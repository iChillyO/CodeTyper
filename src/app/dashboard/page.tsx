'use client'

import { Video, Zap, Plus, Clock, ExternalLink, ChevronRight, Loader2, Crown } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getPlanConfig } from '@/lib/plans'

export default function DashboardOverview() {
    const supabase = createClient()
    const [usage, setUsage] = useState<any>(null)
    const [renders, setRenders] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            // Usage
            const { data: usageData } = await supabase
                .from('usage')
                .select('*')
                .maybeSingle()
            setUsage(usageData)

            // Renders
            const { data: rendersData } = await supabase
                .from('renders')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(3)
            setRenders(rendersData || [])
            setLoading(false)
        }
        fetchData()
    }, [])

    const rendersUsed = usage?.renders_used || 0
    const planConfig = getPlanConfig(usage?.plan);
    const monthlyLimit = planConfig.rendersPerMonth;
    const percentage = Math.round((rendersUsed / monthlyLimit) * 100)

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-8 h-8 border-4 border-blue-600/10 border-t-blue-600 rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
                    <p className="text-white/50 text-sm">Welcome to your CodeTyper dashboard.</p>
                </div>
                <Link href="/create">
                    <Button className="w-full md:w-auto h-11 px-6 text-sm">
                        <Plus size={18} />
                        New Video
                    </Button>
                </Link>
            </div>

            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Usage Card - SIMPLIFIED */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 text-blue-600/20 group-hover:text-blue-600/40 transition-colors">
                        <Zap size={64} strokeWidth={1} />
                    </div>
                    <p className="text-white/50 text-sm font-medium mb-1">Total Renders</p>
                    <div className="flex items-end gap-2 mb-4">
                        <span className="text-4xl font-bold">{rendersUsed}</span>
                        <span className="text-white/30 font-medium mb-1.5">videos created</span>
                    </div>
                    <div className="flex justify-between text-[10px] font-bold tracking-wider text-blue-400/60 uppercase italic">
                        <span>Early Access privileges active</span>
                    </div>
                </div>

                {/* Plan Card */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <p className="text-white/50 text-sm font-medium mb-1">Account Type</p>
                    <div className="flex items-center gap-3 mb-6">
                        <span className="text-4xl font-bold">{planConfig.name}</span>
                        <div className="bg-blue-600/20 text-blue-400 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border border-blue-600/30 shadow-sm flex items-center gap-1">
                            <Crown size={10} />
                            Active
                        </div>
                    </div>
                    <div className="text-sm font-semibold text-slate-500 flex items-center gap-1.5">
                        No additional plans available during beta.
                    </div>
                </div>

                {/* Quick Stats? or Tips */}
                <div className="bg-gradient-to-br from-blue-600/20 to-indigo-600/5 border border-blue-600/20 rounded-2xl p-6 flex flex-col justify-between">
                    <div>
                        <h3 className="font-bold text-lg mb-1">Generate magic</h3>
                        <p className="text-sm text-white/60 leading-relaxed">Turn your code into cinematic videos in seconds.</p>
                    </div>
                    <p className="text-[10px] text-blue-400/60 font-medium italic mt-4">Tip: Use the 'Dracula' theme for high contrast.</p>
                </div>
            </div>

            {/* Recent Renders Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold px-1">Recent Renders</h2>
                    <Link href="/dashboard/renders" className="text-xs text-white/40 hover:text-white transition-colors">
                        View all history
                    </Link>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden divide-y divide-white/5">
                    {renders && renders.length > 0 ? (
                        renders.map((render) => (
                            <div key={render.id} className="p-4 hover:bg-white/[0.02] transition-colors flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-white/30 group-hover:text-blue-400 transition-colors">
                                        <Video size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-sm">{render.title}</h3>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <Clock size={12} className="text-white/30" />
                                            <span className="text-[10px] text-white/30">
                                                {new Date(render.created_at).toLocaleDateString()}
                                            </span>
                                            <span className={cn(
                                                "text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1",
                                                render.status === 'done' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                                                    render.status === 'failed' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                                                        'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                            )}>
                                                {(render.status === 'queued' || render.status === 'rendering') && (
                                                    <Loader2 size={10} className="animate-spin" />
                                                )}
                                                {render.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                {render.video_url && (
                                    <Link href={render.video_url} target="_blank" className="p-2 text-white/20 hover:text-white transition-colors">
                                        <ExternalLink size={18} />
                                    </Link>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="p-10 flex flex-col items-center justify-center text-center">
                            <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-4 text-white/10">
                                <Video size={24} />
                            </div>
                            <p className="text-sm text-white/40 mb-1">No renders found</p>
                            <p className="text-xs text-white/20">Your cinematic videos will appear here.</p>
                        </div>
                    )}
                </div>
            </div>


        </div>
    )
}
