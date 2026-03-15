import path from 'path';
import fs from 'fs';
import os from 'os';
import { createClient } from '@supabase/supabase-js';
import { calculateDuration } from './video-utils';

// Helper to get supabase client lazily
const getSupabase = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
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
        console.log(`Starting render job for ${renderId}...`);

        // Dynamically import Remotion heavy packages to avoid startup crashes in some environments
        const { bundle } = await import('@remotion/bundler');
        const { getCompositions, renderMedia } = await import('@remotion/renderer');

        // 1. Calculate duration
        const durationInFrames = calculateDuration(code, speedMs);
        console.log(`Calculated duration: ${durationInFrames} frames`);

        // 2. Bundle the project
        const bundleLocation = await bundle({
            entryPoint: path.resolve(process.cwd(), 'src/remotion/index.ts'),
            webpackOverride: (config: any) => {
                return {
                    ...config,
                    cache: false, // Force rebuild, ignore webpack cache
                    resolve: {
                        ...config.resolve,
                        alias: {
                            ...(config.resolve?.alias || {}),
                            '@': path.resolve(process.cwd(), 'src'),
                        },
                    },
                };
            },
        });

        // 3. Get composition
        console.log("Fetching compositions...");
        const comps = await getCompositions(bundleLocation, {
            inputProps: {
                codeString: code,
                language,
                baseDelayMs: speedMs,
                theme,
                cursorStyle,
                width,
                height
            }
        });

        const composition = comps.find((c: any) => c.id === 'CodeTyper');
        if (!composition) {
            console.error("Available compositions:", comps.map((c: any) => c.id));
            throw new Error(`No composition with the ID CodeTyper found.`);
        }
        
        // Override duration dynamically based on code length
        composition.durationInFrames = durationInFrames;
        
        console.log(`Found composition ${composition.id}. Resolution: ${composition.width}x${composition.height}, Duration: ${composition.durationInFrames} frames`);

        // 4. Render video
        const tempOutputFile = path.join(os.tmpdir(), `${renderId}.mp4`);
        await renderMedia({
            composition,
            serveUrl: bundleLocation,
            codec: 'h264',
            outputLocation: tempOutputFile,
            inputProps: {
                codeString: code,
                language,
                baseDelayMs: speedMs,
                theme,
                cursorStyle,
                width,
                height
            },
            onProgress: ({ progress }: { progress: number }) => {
                const percent = Math.round(progress * 100);
                console.log(`Rendering ${renderId}: ${percent}%`);
                
                // Update database with current progress
                // We wrap in try/catch to avoid failing the render if the progress column is missing
                supabase
                    .from('renders')
                    .update({ progress: percent })
                    .eq('id', renderId)
                    .then(({ error }: { error: any }) => {
                        if (error) console.warn(`Failed to update progress for ${renderId}:`, error.message);
                    });
            }
        });

        console.log(`Render complete! Saved to ${tempOutputFile}`);

        // 5. Upload to Supabase Storage
        console.log(`Uploading ${renderId} to Supabase...`);
        const fileData = fs.readFileSync(tempOutputFile);

        const storagePath = `${userId}/${renderId}.mp4`;
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('renders')
            .upload(storagePath, fileData, {
                contentType: 'video/mp4',
                upsert: true
            });

        if (uploadError) {
            throw new Error(`Failed to upload to Supabase: ${uploadError.message}`);
        }

        const { data: { publicUrl } } = supabase.storage
            .from('renders')
            .getPublicUrl(storagePath);

        // 6. Update database with successful status
        const { error: dbError } = await supabase
            .from('renders')
            .update({
                status: 'done',
                video_url: publicUrl,
            })
            .eq('id', renderId);

        if (dbError) {
            throw new Error(`Failed to update DB after render: ${dbError.message}`);
        }

        // Cleanup temp file
        try {
            fs.unlinkSync(tempOutputFile);
        } catch (e) {
            console.warn("Could not delete temp file", e);
        }

        console.log(`Job ${renderId} successfully completed!`);

    } catch (error: any) {
        console.error(`Render Job ${renderId} failed:`, error);
        
        // Specific error message for common serverless issues
        let failedReason = error.message || 'Unknown error during rendering';
        if (failedReason.includes('rspack') || failedReason.includes('binding')) {
            failedReason = "Asset bundling failed due to missing native binaries on Vercel. Consider using Remotion Lambda or a full server.";
        } else if (failedReason.includes('browser') || failedReason.includes('executable')) {
            failedReason = "Video rendering requires Chromium, which is missing on Vercel. Use Remotion Lambda for production.";
        }

        // Update database with failed status
        await supabase
            .from('renders')
            .update({
                status: 'failed',
                failed_reason: failedReason
            })
            .eq('id', renderId);
    }
};
