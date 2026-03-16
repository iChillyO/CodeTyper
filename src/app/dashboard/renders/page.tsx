'use client'

import { Video, Clock, ExternalLink, Filter, Search, Download, RefreshCw, Copy, Check, AlertCircle, Loader2, PlayCircle, Trash2, X, PlusSquare } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'

export default function RendersPage() {
    const supabase = createClient()
    const router = useRouter()
    const [renders, setRenders] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [retryingId, setRetryingId] = useState<string | null>(null)
    const [copiedId, setCopiedId] = useState<string | null>(null)
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const [playingVideo, setPlayingVideo] = useState<{ url: string; title: string } | null>(null)
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

    const fetchRenders = async () => {
        const { data } = await supabase
            .from('renders')
            .select('*')
            .order('created_at', { ascending: false })
        setRenders(data || [])
        setLoading(false)
    }

    useEffect(() => {
        fetchRenders()
    }, [])

    const handleRetry = async (render: any) => {
        setRetryingId(render.id)
        try {
            const res = await fetch('/api/render', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: render.title,
                    format: render.format,
                    theme: render.theme,
                    width: render.width,
                    height: render.height,
                    keyboard_sound_enabled: render.keyboard_sound_enabled,
                    keyboard_sound_volume: render.keyboard_sound_volume
                }),
            });

            if (res.ok) {
                fetchRenders()
                router.refresh()
            } else {
                const data = await res.json()
                alert(data.error || 'Retry failed')
            }
        } catch (error) {
            alert('An error occurred during retry')
        } finally {
            setRetryingId(null)
        }
    }

    const handleDuplicate = (renderId: string) => {
        router.push(`/create?duplicate=${renderId}`)
    }

    const handleCopyLink = (url: string, id: string) => {
        navigator.clipboard.writeText(url)
        setCopiedId(id)
        setTimeout(() => setCopiedId(null), 2000)
    }

    const filteredRenders = renders.filter(r =>
        r.title.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleDownload = async (videoUrl: string, title: string) => {
        try {
            const response = await fetch(videoUrl);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = `${title.replace(/\s+/g, '_') || 'video'}.mp4`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error("Download failed, falling back to new tab:", error);
            window.open(videoUrl, '_blank');
        }
    }

    const handleDelete = async (renderId: any) => {
        const idToDelete = typeof renderId === 'string' ? renderId : renderId?.id;
        alert("Deleting ID: " + idToDelete);
        
        if (!idToDelete || deletingId) {
            console.log("Delete blocked:", { idToDelete, deletingId });
            return;
        }

        setDeletingId(idToDelete)
        try {
            console.log("Attempting to delete:", idToDelete);
            const res = await fetch(`/api/render/${idToDelete}`, { 
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            });
            
            if (res.ok) {
                // Optimistically remove from state immediately
                setRenders(prev => prev.filter(r => r.id !== idToDelete));
                setConfirmDeleteId(null);
                
                // We DON'T fetchRenders() here. Trusting the server's "OK" and our local state 
                // prevents the "reappearing" bug caused by stale DB data/replication lag.
            } else {
                const data = await res.json().catch(() => ({}));
                console.error("Delete failed with status:", res.status, data);
                alert(`Delete failed (Status ${res.status}): ${data.error || 'Unknown error'}`)
                setConfirmDeleteId(null)
            }
        } catch (error) {
            console.error("Delete network error:", error);
            alert('A network error occurred during deletion. Please check the console.')
            setConfirmDeleteId(null)
        } finally {
            setDeletingId(null)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-8 h-8 border-4 border-blue-600/10 border-t-blue-600 rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Render History</h1>
                    <p className="text-white/50 text-sm">Manage and download your generated videos.</p>
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                        <input
                            type="text"
                            placeholder="Search renders..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all font-medium"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/10 bg-white/[0.02]">
                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-white/30">Video</th>
                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-white/30 truncate">Format</th>
                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-white/30">Date</th>
                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-white/30">Status</th>
                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-white/30 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredRenders.length > 0 ? (
                            filteredRenders.map((render) => (
                                <tr key={render.id} className="group hover:bg-white/[0.01] transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-blue-600/10 rounded flex items-center justify-center text-blue-400">
                                                <Video size={16} />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium">{render.title}</span>
                                                {render.status === 'failed' && render.failed_reason && (
                                                    <span className="text-[10px] text-red-400/80 flex items-center gap-1 mt-0.5">
                                                        <AlertCircle size={10} />
                                                        {render.failed_reason}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs text-white/40 font-mono">
                                            {render.format || '9:16'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-white/40 text-xs font-medium">
                                            <Clock size={12} />
                                            {new Date(render.created_at).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={cn(
                                            "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border transition-all duration-300 inline-flex items-center gap-1.5",
                                            render.status === 'done' ? 'bg-green-500/10 text-green-400 border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.1)]' :
                                                render.status === 'failed' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                                    'bg-blue-500/10 text-blue-400 border-blue-600/20'
                                        )}>
                                            {(render.status === 'queued' || render.status === 'rendering') && (
                                                <Loader2 size={10} className="animate-spin" />
                                            )}
                                            {render.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {render.status === 'failed' && (
                                                <button
                                                    onClick={() => handleRetry(render)}
                                                    disabled={retryingId === render.id}
                                                    className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 rounded-lg transition-all flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider disabled:opacity-50"
                                                >
                                                    <RefreshCw size={14} className={retryingId === render.id ? 'animate-spin' : ''} />
                                                    Retry
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDuplicate(render.id)}
                                                className="p-1.5 text-white/30 hover:text-blue-400 hover:bg-white/5 rounded-lg transition-all"
                                                title="Duplicate Settings"
                                            >
                                                <PlusSquare size={16} />
                                            </button>
                                            {render.video_url && render.status === 'done' && (
                                                <button
                                                    onClick={() => setPlayingVideo({ url: render.video_url, title: render.title })}
                                                    className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 rounded-lg transition-all"
                                                    title="Play Video"
                                                >
                                                    <PlayCircle size={16} />
                                                </button>
                                            )}
                                            {render.video_url && render.status === 'done' && (
                                                <>
                                                    <button
                                                        onClick={() => handleCopyLink(render.video_url, render.id)}
                                                        className="p-1.5 text-white/30 hover:text-blue-400 hover:bg-white/5 rounded-lg transition-all"
                                                        title="Copy video link"
                                                    >
                                                        {copiedId === render.id ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                                                    </button>
                                                    <button
                                                        onClick={() => handleDownload(render.video_url, render.title)}
                                                        className="p-1.5 text-white/30 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                                                        title="Download Video"
                                                    >
                                                        <Download size={16} />
                                                    </button>
                                                </>
                                            )}
                                            <button
                                                onClick={() => setConfirmDeleteId(render.id)}
                                                disabled={deletingId === render.id}
                                                className="p-1.5 text-white/30 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all ml-1"
                                                title="Delete Render"
                                            >
                                                {deletingId === render.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-20 text-center">
                                    <p className="text-sm text-white/30">
                                        No renders found.
                                    </p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {playingVideo && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
                    <div className="relative w-full max-w-md bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                        <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/[0.02]">
                            <h3 className="font-bold text-sm truncate pr-4">{playingVideo.title}</h3>
                            <button
                                onClick={() => setPlayingVideo(null)}
                                className="p-1 text-white/50 hover:text-white rounded-lg transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="aspect-[9/16] bg-black relative flex items-center justify-center">
                            <video
                                src={playingVideo.url}
                                controls
                                autoPlay
                                className="w-full h-full object-contain"
                            />
                        </div>
                    </div>
                </div>
            )}
            {confirmDeleteId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
                    <div className="relative w-full max-w-sm bg-slate-900 border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col items-center text-center">
                        <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mb-4">
                            <Trash2 size={24} />
                        </div>
                        <h3 className="text-lg font-bold mb-2">Delete Video?</h3>
                        <p className="text-sm text-white/50 mb-6">
                            This action cannot be undone. The video will be permanently removed.
                        </p>
                        <div className="flex w-full gap-3">
                            <button
                                onClick={() => setConfirmDeleteId(null)}
                                disabled={!!deletingId}
                                className="flex-1 h-11 px-4 rounded-xl border border-white/10 text-sm font-bold hover:bg-white/5 transition-all disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(confirmDeleteId)}
                                disabled={!!deletingId}
                                className="flex-1 h-11 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-sm font-bold transition-all shadow-lg shadow-red-600/20 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {deletingId ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        Deleting...
                                    </>
                                ) : (
                                    'Delete Forever'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
