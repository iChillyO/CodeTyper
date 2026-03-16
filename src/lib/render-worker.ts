import { createClient } from '@supabase/supabase-js';
import { calculateDuration } from './video-utils';

// Helper to get supabase client lazily
const getSupabase = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
        throw new Error("Missing Supabase configuration (NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY)");
    }
    
    return createClient(supabaseUrl, supabaseKey);
};

interface RenderParams {
    userId: string;
    renderId: string;
    title: string;
    code: string;
    language: string;
    speedMs: number;
    theme: any;
    cursorStyle: string;
    width: number;
    height: number;
}

export const startRenderJob = async (params: RenderParams) => {
    const { userId, renderId, title, code, language, speedMs, theme, cursorStyle, width, height } = params;
    const supabase = getSupabase();

    try {
        console.log(`Starting Lambda render job for ${renderId}...`);

        // Dynamically import the lightweight Client to avoid binary issues on Vercel
        // This MUST be the /client subpath (which uses @remotion/lambda-client internally)
        const { 
            renderMediaOnLambda, 
            getRenderProgress
        } = (await import('@remotion/lambda/client')) as any;

        // Check for AWS credentials
        if (!process.env.REMOTION_AWS_ACCESS_KEY_ID || !process.env.REMOTION_AWS_SECRET_ACCESS_KEY) {
            throw new Error("AWS Credentials (REMOTION_AWS_ACCESS_KEY_ID/SECRET) are missing. Check your Vercel Environment Variables.");
        }

        const region = (process.env.REMOTION_AWS_REGION as any) || 'us-east-1';
        
        // We hardcode the function name based on your successful deploy output.
        // This avoids calling 'specializeFunction' which pulls in heavy dependencies.
        const functionName = 'remotion-render-4-0-435-mem2048mb-disk2048mb-120sec';

        // 1. Calculate duration
        const durationInFrames = calculateDuration(code, speedMs);
        console.log(`Calculated duration: ${durationInFrames} frames`);

        // 2. Define source and bucket
        // Note: You must have deployed your site using `npm run deploy:site`
        const siteName = 'codetyper'; 
        
        console.log("Triggering Lambda render...");
        const { renderId: lambdaRenderId, bucketName } = await renderMediaOnLambda({
            region,
            functionName,
            serveUrl: siteName,
            composition: 'CodeTyper',
            inputProps: {
                codeString: code,
                language,
                baseDelayMs: speedMs,
                theme,
                cursorStyle,
                width,
                height
            },
            codec: 'h264',
            privacy: 'public',
            frameRange: [0, durationInFrames - 1],
        });

        console.log(`Lambda render triggered! ID: ${lambdaRenderId}`);

        // 3. Poll for progress and completion
        // Since we are running in a "background" Vercel function (hopefully triggered via waitUntil or similar),
        // we can poll for a while. If it exceeds Vercel limits, the DB will stay in 'rendering' state.
        
        let isDone = false;
        let lastProgress = -1;
        
        while (!isDone) {
            const progress = await getRenderProgress({
                renderId: lambdaRenderId,
                bucketName,
                region,
            });

            if (progress.fatalErrorEncountered) {
                throw new Error(`Lambda Render Failed: ${progress.errors[0]?.message || 'Unknown error'}`);
            }

            if (progress.done) {
                console.log("Lambda render complete!");
                const videoUrl = progress.outputFile as string;
                
                // Update database with success
                await supabase
                    .from('renders')
                    .update({
                        status: 'done',
                        video_url: videoUrl,
                        progress: 100
                    })
                    .eq('id', renderId);
                
                isDone = true;
            } else {
                const currentPercent = Math.round(progress.overallProgress * 100);
                if (currentPercent !== lastProgress) {
                    console.log(`Rendering ${renderId}: ${currentPercent}%`);
                    await supabase
                        .from('renders')
                        .update({ progress: currentPercent })
                        .eq('id', renderId);
                    lastProgress = currentPercent;
                }
                
                // Wait 2 seconds before next poll
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }

        console.log(`Job ${renderId} successfully completed on Lambda!`);

    } catch (error: any) {
        console.error(`Render Job ${renderId} failed:`, error);
        
        let failedReason = error.message || 'Unknown error during rendering';
        
        // Final fallback to make sure we always update the UI
        await supabase
            .from('renders')
            .update({
                status: 'failed',
                failed_reason: failedReason
            })
            .eq('id', renderId);
    }
};
