import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { checkRenderProgress } from '@/lib/render-worker';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const renderId = searchParams.get('renderId');
        const lambdaId = searchParams.get('lambdaId');
        const bucket = searchParams.get('bucket');

        if (!renderId || !lambdaId || !bucket) {
            return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
        }

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Verify the render belongs to the user
        const { data: render } = await supabase
            .from('renders')
            .select('user_id, status')
            .eq('id', renderId)
            .single();

        if (!render || render.user_id !== user.id) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }

        // If it's already done or failed in DB, don't ping AWS
        if (render.status === 'done' || render.status === 'failed') {
            return NextResponse.json({ status: render.status });
        }

        // Check AWS for actual status and update DB
        const result = await checkRenderProgress(renderId, lambdaId, bucket);

        return NextResponse.json(result);
    } catch (error: any) {
        console.error("Progress API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
