import { createClient, createAdminClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const supabase = await createClient();
        const adminSupabase = await createAdminClient();

        // 1. Authenticate user
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id: renderId } = await params;
        console.log("DELETE request for renderId:", renderId, "by user:", user.id);
        
        if (!renderId) {
            return NextResponse.json({ error: 'Render ID is required' }, { status: 400 });
        }

        // 2. Verify ownership
        const { data: renderDoc, error: fetchError } = await supabase
            .from('renders')
            .select('id, user_id, video_url')
            .eq('id', renderId)
            .maybeSingle();

        console.log("Fetch result for renderDoc:", renderDoc, "Error:", fetchError);

        if (fetchError || !renderDoc) {
            return NextResponse.json({ error: 'Render not found' }, { status: 404 });
        }

        if (renderDoc.user_id !== user.id) {
            console.log("Ownership mismatch. renderDoc.user_id:", renderDoc.user_id, "user.id:", user.id);
            return NextResponse.json({ 
                error: 'Unauthorized (Ownership mismatch)',
                debug: { rowUser: renderDoc.user_id, currentUser: user.id }
            }, { status: 403 });
        }

        // 3. Delete from Supabase Storage (if video exists)
        if (renderDoc.video_url) {
            // we know from our worker that the file was saved as `${user.id}/${renderId}.mp4`
            const storagePath = `${user.id}/${renderId}.mp4`;
            const { error: storageError } = await supabase.storage
                .from('renders')
                .remove([storagePath]);

            if (storageError) {
                console.error("Failed to delete video from storage:", storageError);
                // We'll proceed to delete the DB row anyway to clean up UI
            }
        }

        // 4. Delete the row from the database (Use admin client to bypass RLS)
        const { error: deleteError, count } = await adminSupabase
            .from('renders')
            .delete({ count: 'exact' })
            .eq('id', renderId);

        console.log(`DELETE operation for ${renderId}: count=${count}, error=${deleteError}`);

        if (deleteError) {
            console.error("Failed to delete render row:", deleteError);
            return NextResponse.json({ error: 'Failed to delete render record' }, { status: 500 });
        }

        if (count === 0) {
            console.warn(`DELETE attempted but 0 rows affected for ID: ${renderId}`);
            // We might still return success if the row is already gone, 
            // but let's be more descriptive for debugging.
            return NextResponse.json({ 
                success: true, 
                message: "Row was not found or already deleted",
                id: renderId 
            });
        }

        return NextResponse.json({ success: true, deletedCount: count });

    } catch (error) {
        console.error("Unexpected error handling DELETE /api/render/[id]:", error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
