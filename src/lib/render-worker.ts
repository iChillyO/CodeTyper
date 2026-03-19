import { createClient } from '@supabase/supabase-js';
import { calculateDuration } from './video-utils';
import { renderMediaOnLambda, getRenderProgress } from '@remotion/lambda/client';

// Helper to get supabase client lazily
const getSupabase = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
        throw new Error(`Missing Supabase configuration. URL: ${!!supabaseUrl}, Key: ${!!supabaseKey}`);
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

const REMOTION_FUNCTION_NAME = 'remotion-render-4-0-435-mem2048mb-disk2048mb-121sec-v2';

export const startRenderJob = async (params: RenderParams) => {
    const { userId, renderId, title, code, language, speedMs, theme, cursorStyle, width, height } = params;
    
    try {
        console.log(`[Worker] Triggering Lambda render for ${renderId}...`);

        if (!process.env.REMOTION_AWS_ACCESS_KEY_ID || !process.env.REMOTION_AWS_SECRET_ACCESS_KEY) {
            throw new Error("AWS Credentials missing in environment.");
        }

        const region = (process.env.REMOTION_AWS_REGION as any) || 'us-east-1';
        const functionName = REMOTION_FUNCTION_NAME;
        const durationInFrames = calculateDuration(code, speedMs);

        const { renderId: lambdaRenderId, bucketName } = await renderMediaOnLambda({
            region,
            functionName,
            serveUrl: 'codetyper',
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

        console.log(`[Worker] Lambda triggered: ${lambdaRenderId}`);
        
        // Return these so the API can give them to the client
        return { lambdaRenderId, bucketName };

    } catch (error: any) {
        console.error(`[Worker] Trigger failed for ${renderId}:`, error);
        const supabase = getSupabase();
        await supabase
            .from('renders')
            .update({
                status: 'failed',
                failed_reason: error.message || 'Trigger failed'
            })
            .eq('id', renderId);
        throw error;
    }
};

/**
 * Checks the progress of a Lambda render and updates the Supabase record.
 * This can be called from a lightweight polling API.
 */
export const checkRenderProgress = async (renderId: string, lambdaId: string, bucket: string) => {
    const supabase = getSupabase();
    const region = (process.env.REMOTION_AWS_REGION as any) || 'us-east-1';
    const functionName = REMOTION_FUNCTION_NAME;

    try {

        const progress = await getRenderProgress({
            renderId: lambdaId,
            bucketName: bucket,
            region,
            functionName,
        });

        if (progress.fatalErrorEncountered) {
            const error = progress.errors[0]?.message || 'Unknown Lambda error';
            await supabase
                .from('renders')
                .update({ status: 'failed', failed_reason: error })
                .eq('id', renderId);
            return { status: 'failed', error };
        }

        if (progress.done) {
            // 1. Get render data to know the user_id (needed for storage path)
            const { data: renderData } = await supabase
                .from('renders')
                .select('user_id')
                .eq('id', renderId)
                .single();

            if (!renderData) {
                throw new Error(`Render record ${renderId} not found in database.`);
            }

            console.log(`[Worker] Render ${renderId} finished on Lambda. Transferring to Supabase...`);

            // 2. Download from S3 directly via URL
            // This avoids loading the massive @remotion/lambda package in a Vercel Serverless Function
            const s3Url = `https://${bucket}.s3.${region}.amazonaws.com/renders/${lambdaId}/out.mp4`;
            
            try {
                const response = await fetch(s3Url);
                if (!response.ok) {
                    throw new Error(`Failed to download video from AWS S3: ${response.status} ${response.statusText}`);
                }
                
                const arrayBuffer = await response.arrayBuffer();
                const fileBuffer = Buffer.from(arrayBuffer);

                // 3. Upload to Supabase Storage
                const storagePath = `${renderData.user_id}/${renderId}.mp4`;

                const { error: uploadError } = await supabase.storage
                    .from('renders')
                    .upload(storagePath, fileBuffer, {
                        contentType: 'video/mp4',
                        upsert: true
                    });

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('renders')
                    .getPublicUrl(storagePath);

                console.log(`[Worker] Video uploaded to Supabase: ${publicUrl}`);

                // 4. Update DB status
                await supabase
                    .from('renders')
                    .update({
                        status: 'done',
                        video_url: publicUrl,
                        progress: 100
                    })
                    .eq('id', renderId);

                return { status: 'done', url: publicUrl, progress: 100 };

            } catch (transferError: any) {
                console.error("[Worker] Failed to transfer video from S3 to Supabase:", transferError);
                throw transferError;
            }
        } else {
            const currentPercent = Math.round(progress.overallProgress * 100);
            await supabase
                .from('renders')
                .update({ progress: currentPercent })
                .eq('id', renderId);
            return { status: 'rendering', progress: currentPercent };
        }
    } catch (error: any) {
        console.error(`[Worker] Progress check failed for ${renderId}:`, error);
        
        // If we have a persistent failure, mark the render as failed
        // This avoids locking the user out via 409
        try {
            const supabase = getSupabase();
            await supabase
                .from('renders')
                .update({ status: 'failed', failed_reason: `Progress check error: ${error.message}` })
                .eq('id', renderId);
        } catch (dbError) {
            console.error("[Worker] Failed to update DB in progress failure catch:", dbError);
        }

        return { status: 'error', error: error.message };
    }
};
