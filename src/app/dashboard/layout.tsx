import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/dashboard/Sidebar'
import type { ReactNode } from 'react'

export default async function DashboardLayout({
    children,
}: {
    children: ReactNode
}) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return redirect('/login')
    }

    // Fetch usage for sidebar
    const { data: usage } = await supabase
        .from('usage')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle()

    return (
        <div className="flex min-h-screen bg-[#0A0A0B] text-white">
            {/* Sidebar - Desktop */}
            <aside className="hidden md:flex w-64 flex-col fixed inset-y-0 border-r border-white/10 bg-[#0A0A0B] z-50">
                <Sidebar userEmail={user.email!} usage={usage} />
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 md:pl-64 flex flex-col">
                {/* Mobile Header */}
                <header className="md:hidden flex items-center justify-between p-4 border-b border-white/10 bg-[#0A0A0B]/80 backdrop-blur-md sticky top-0 z-40">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-sm">CT</div>
                        <span className="font-semibold tracking-tight">CodeTyper</span>
                    </div>
                    {/* Mobile Sidebar Trigger (Simplistic for now) */}
                    <button className="p-2 text-white/70">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
                    </button>
                </header>

                <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
                    {children}
                </main>
            </div>
        </div>
    )
}
