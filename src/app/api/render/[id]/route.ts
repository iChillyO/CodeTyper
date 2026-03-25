import { createClient, createAdminClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { trackServer } from '@/lib/analytics-server';

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
        
        // 2. Verify ownership (Use adminSupabase to ensure we can see the row regardless of RLS)
        const { data: renderDoc, error: fetchError } = await adminSupabase
            .from('renders')
            .select('id, user_id, video_url')
            .eq('id', renderId)
            .maybeSingle();

        console.log(`[Delete] Verifying ownership for render ${renderId}. Found:`, !!renderDoc);

        if (fetchError || !renderDoc) {
            return NextResponse.json({ error: 'Render not found' }, { status: 404 });
        }

        if (renderDoc.user_id !== user.id) {
            console.warn(`[Delete] Ownership mismatch. Render belongs to ${renderDoc.user_id}, but request from ${user.id}`);
            return NextResponse.json({ error: 'Unauthorized to delete this render' }, { status: 403 });
        }

        // 3. Delete from Supabase Storage (if video exists)
        if (renderDoc.video_url) {
            try {
                const storagePath = `${user.id}/${renderId}.mp4`;
                await adminSupabase.storage
                    .from('renders')
                    .remove([storagePath]);
            } catch (e) {
                console.error("[Delete] Storage removal error:", e);
            }
        }

        // 4. Delete the row from the database
        const { error: deleteError, count } = await adminSupabase
            .from('renders')
            .delete({ count: 'exact' })
            .eq('id', renderId);

        console.log(`[Delete] DB Result for ${renderId}: count=${count}, error=${deleteError}`);

        if (deleteError) {
            return NextResponse.json({ error: 'Failed to delete render record' }, { status: 500 });
        }

        if (count === 0) {
            return NextResponse.json({ error: 'Delete failed: Row no longer exists' }, { status: 404 });
        }

        trackServer(user!.id, 'video_deleted', { render_id: renderId });

        return NextResponse.json({ success: true, deletedCount: count });

    } catch (error) {
        console.error("Unexpected error handling DELETE /api/render/[id]:", error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
