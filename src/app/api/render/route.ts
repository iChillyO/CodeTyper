import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { generateTitle } from '@/lib/geminiTitle';
import { getPlanConfig } from '@/lib/plans';
import { startRenderJob } from '@/lib/render-worker';

export async function POST(req: Request) {
    try {
        console.log("API /api/render: Checking environment variables...");
        const envVars = {
            NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
            NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
            REMOTION_AWS_ACCESS_KEY_ID: !!process.env.REMOTION_AWS_ACCESS_KEY_ID,
            REMOTION_AWS_SECRET_ACCESS_KEY: !!process.env.REMOTION_AWS_SECRET_ACCESS_KEY,
            REMOTION_AWS_REGION: !!process.env.REMOTION_AWS_REGION,
            GEMINI_API_KEY: !!process.env.GEMINI_API_KEY
        };
        console.log("Env Status:", envVars);

        if (!process.env.REMOTION_AWS_ACCESS_KEY_ID || !process.env.REMOTION_AWS_SECRET_ACCESS_KEY) {
            return NextResponse.json({ 
                error: 'Server configuration missing. AWS credentials are not set on Vercel.' 
            }, { status: 500 });
        }

        const supabase = await createClient();

        // 1. Authenticate user securely on the server
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Parse format and dimensions from request body
        const body = await req.json().catch(() => ({}));
        let renderTitle = body.title || 'Untitled Video';
        const format = body.format || '9:16';
        const theme = body.theme || 'original';
        const speedMs = body.speed_ms || 45;
        const code = body.code || '';
        const language = body.language || 'javascript';
        const cursorStyle = body.cursor_style || 'block';
        const width = body.width || 1080;
        const height = body.height || 1920;
        const autoTitleEnabled = body.auto_title_enabled !== undefined ? body.auto_title_enabled : true;

        // Generate AI Title if enabled and user didn't write a completely custom one
        if (autoTitleEnabled && code.trim().length > 0) {
            // In CreateClient, we set default title to `Render: ${firstLine}`
            // If the user hasn't changed it from the default pattern, let the AI override it
            if (renderTitle === 'Untitled Video' || renderTitle.startsWith('Render: ')) {
                renderTitle = await generateTitle(code, language);
            }
        }

        // 2. Concurrency Guard: Check if a render is already in progress
        const STUCK_TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes
        const { data: activeRenders, error: activeCheckError } = await supabase
            .from('renders')
            .select('id, created_at, status')
            .eq('user_id', user.id)
            .in('status', ['queued', 'rendering']);

        if (activeCheckError) {
            console.error("Error checking active renders:", activeCheckError);
            return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
        }

        if (activeRenders && activeRenders.length > 0) {
            // Check if any of these are "stuck"
            const now = new Date();
            const stuckRenders = activeRenders.filter(r => {
                const createdAt = new Date(r.created_at);
                return (now.getTime() - createdAt.getTime()) > STUCK_TIMEOUT_MS;
            });

            if (stuckRenders.length > 0) {
                console.log(`Marking ${stuckRenders.length} stuck renders as failed.`);
                // Update stuck renders to failed in the background
                await supabase
                    .from('renders')
                    .update({ status: 'failed', failed_reason: 'Render timed out / was stuck' })
                    .in('id', stuckRenders.map(r => r.id));
                
                // If ALL active renders were stuck, we can proceed
                if (stuckRenders.length === activeRenders.length) {
                    // All stuck, proceed
                } else {
                    return NextResponse.json({
                        error: 'A render is already in progress. Please wait for it to finish.'
                    }, { status: 409 });
                }
            } else {
                return NextResponse.json({
                    error: 'A render is already in progress. Please wait for it to finish.'
                }, { status: 409 });
            }
        }

        // 3. Load/Create Usage for current month
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999).toISOString();

        // eslint-disable-next-line prefer-const
        let { data: usageData, error: usageError } = await supabase
            .from('usage')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle();

        if (usageError) {
            console.error("Error retrieving usage info:", usageError);
            return NextResponse.json({ error: `Internal Server Error: ${usageError.message}` }, { status: 500 });
        }

        // If no usage record exists, create one for the current period
        if (!usageData) {
            const { data: newUsage, error: insertError } = await supabase
                .from('usage')
                .insert({
                    user_id: user.id,
                    period_start: firstDayOfMonth,
                    period_end: lastDayOfMonth,
                    renders_used: 0
                })
                .select()
                .maybeSingle();

            if (insertError) {
                console.error("Failed to create usage tracking:", insertError);
                return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
            }
            usageData = newUsage;
        }

        // Check if usage billing period needs to be reset
        const currentPeriodEnd = new Date(usageData.period_end);
        if (now > currentPeriodEnd) {
            const { data: updatedUsage, error: resetError } = await supabase
                .from('usage')
                .update({
                    period_start: firstDayOfMonth,
                    period_end: lastDayOfMonth,
                    renders_used: 0
                })
                .eq('user_id', user.id)
                .select()
                .maybeSingle();

            if (resetError) {
                console.error("Failed to reset usage tracking:", resetError);
                return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
            }
            usageData = updatedUsage;
        }

        // 4. Prevent rendering if over the plan limit
        const planConfig = getPlanConfig(usageData.plan);
        if (usageData.renders_used >= planConfig.rendersPerMonth) {
            return NextResponse.json({
                error: `Monthly limit reached for ${planConfig.name} plan (${planConfig.rendersPerMonth} renders).`
            }, { status: 403 });
        }

        // 5. Create queued row
        // Note: Using a minimal set of columns first to avoid failure if schema is missing newer columns
        const { data: newRender, error: renderInsertError } = await supabase
            .from('renders')
            .insert({
                user_id: user.id,
                title: renderTitle,
                status: 'queued',
                format,
                width,
                height
            })
            .select()
            .maybeSingle();

        if (renderInsertError || !newRender) {
            console.error("Failed to create render job:", renderInsertError);
            return NextResponse.json({ error: `Failed to start render process: ${renderInsertError?.message || 'DB Error'}` }, { status: 500 });
        }

        // Try to update with additional metadata (don't fail if columns are missing)
        try {
            await supabase
                .from('renders')
                .update({
                    theme,
                    speed_ms: speedMs,
                    code,
                    language,
                    cursor_style: cursorStyle,
                    auto_title_enabled: autoTitleEnabled
                })
                .eq('id', newRender.id);
        } catch (e) {
            console.warn("Could not save additional metadata to render row (likely missing columns)", e);
        }

        // 6. Move to 'rendering' status
        await supabase
            .from('renders')
            .update({ status: 'rendering' })
            .eq('id', newRender.id);

        // 7. Increment user's usage immediately
        await supabase
            .from('usage')
            .update({ renders_used: usageData.renders_used + 1 })
            .eq('user_id', user.id);

        // 8. Start Render Job (Triggering only)
        // We await this to ensure the Lambda actually starts before responding
        const renderResult = await startRenderJob({
            userId: user.id,
            renderId: newRender.id,
            title: renderTitle,
            code,
            language,
            speedMs,
            theme,
            cursorStyle,
            width,
            height
        });

        // 9. Return success with AWS info so client can help poll if needed
        return NextResponse.json({
            success: true,
            render: {
                ...newRender,
                lambdaRenderId: renderResult.lambdaRenderId,
                bucketName: renderResult.bucketName
            },
            usage: {
                used: usageData.renders_used + 1,
                limit: planConfig.rendersPerMonth
            }
        });

    } catch (error: any) {
        console.error("Unexpected error handling /api/render:", error);
        return NextResponse.json({ 
            error: 'Internal server error', 
            details: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: 500 });
    }
}
