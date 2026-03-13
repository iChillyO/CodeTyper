"use client";

import React, { useState } from "react";
import { Player } from "@remotion/player";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { MyComposition } from "../../remotion/Composition"; // Adjusted path
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { calculateDuration } from "@/lib/video-utils";
import { Play, Download, Share2, Sparkles, Terminal, ChevronDown, Palette, Loader2, Copy, Check } from "lucide-react";
import { VideoTheme, THEME_CONFIG } from "../../remotion/themes";

type VideoFormat = "9:16" | "16:9" | "1:1";

const FORMAT_CONFIG = {
    "9:16": { width: 1080, height: 1920, label: "9:16 (TikTok)" },
    "16:9": { width: 1920, height: 1080, label: "16:9 (YouTube)" },
    "1:1": { width: 1080, height: 1080, label: "1:1 (Instagram)" },
};

export default function CreateClient() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const supabase = createClient();
    const duplicateId = searchParams.get('duplicate');
    const [code, setCode] = useState('console.log("Welcome to CodeTyper!");');
    const [format, setFormat] = useState<VideoFormat>("9:16");
    const [speedMs, setSpeedMs] = useState<number>(45);
    const [theme, setTheme] = useState<VideoTheme>("original");
    const [cursorStyle, setCursorStyle] = useState<"block" | "bar" | "line">("block");
    const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code');
    const [showHint, setShowHint] = useState(false);

    // Render State
    const [isRendering, setIsRendering] = useState(false);
    const [renderProgress, setRenderProgress] = useState(0);
    const [renderMessage, setRenderMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
    const [lastRenderedVideo, setLastRenderedVideo] = useState<{ url: string; title: string } | null>(null);
    const [isCopied, setIsCopied] = useState(false);

    const currentFormat = FORMAT_CONFIG[format];

    const getSpeedCategory = (ms: number) => {
        if (ms <= 35) return "Fast";
        if (ms <= 65) return "Medium";
        return "Slow";
    };



    const durationInFrames = calculateDuration(code, speedMs);

    useEffect(() => {
        if (code) {
            setShowHint(true);
            const timer = setTimeout(() => setShowHint(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [code]);

    // Handle Duplication Pre-fill
    useEffect(() => {
        if (!duplicateId) return;

        const fetchDuplicateData = async () => {
            const { data, error } = await supabase
                .from('renders')
                .select('*')
                .eq('id', duplicateId)
                .maybeSingle();

            if (data && !error) {
                if (data.code) setCode(data.code);
                if (data.theme) setTheme(data.theme as VideoTheme);
                if (data.speed_ms) setSpeedMs(data.speed_ms);
                if (data.format) setFormat(data.format as VideoFormat);
                if (data.cursor_style) setCursorStyle(data.cursor_style as any);
            }
        };

        fetchDuplicateData();
    }, [duplicateId, supabase]);

    const handleRender = async () => {
        setIsRendering(true);
        setRenderMessage(null);
        setLastRenderedVideo(null);

        try {
            // Get first line of code as title, or default
            const firstLine = code.split('\n')[0].substring(0, 30).trim() || 'Untitled Video';
            const renderTitle = `Render: ${firstLine}`;
            const dimensions = FORMAT_CONFIG[format];

            const res = await fetch('/api/render', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: renderTitle,
                    code,
                    theme,
                    speed_ms: speedMs,
                    cursor_style: cursorStyle,
                    width: dimensions.width,
                    height: dimensions.height,
                    auto_title_enabled: true
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                const isLimitError = data.error?.includes('Monthly limit reached');
                setRenderMessage({
                    text: isLimitError
                        ? `Monthly limit reached for Early Access. Thanks for your incredible feedback!`
                        : (data.error || 'Failed to render video'),
                    type: 'error'
                });
            } else {
                setRenderMessage({
                    text: `Render started! We're processing your video.`,
                    type: 'success'
                });
                
                // Start polling for completion
                const renderId = data.render.id;
                const pollInterval = setInterval(async () => {
                    const { data: updatedRender } = await supabase
                        .from('renders')
                        .select('status, video_url, title, failed_reason, progress')
                        .eq('id', renderId)
                        .maybeSingle();
                    
                    if (updatedRender?.progress !== undefined) {
                        setRenderProgress(updatedRender.progress);
                    }
                    
                    if (updatedRender?.status === 'done' && updatedRender.video_url) {
                        setLastRenderedVideo({ url: updatedRender.video_url, title: updatedRender.title });
                        setRenderMessage({
                            text: `Video ready! You can now download it.`,
                            type: 'success'
                        });
                        setIsRendering(false);
                        setRenderProgress(100);
                        clearInterval(pollInterval);
                    } else if (updatedRender?.status === 'failed') {
                        setRenderMessage({
                            text: `Rendering failed: ${updatedRender.failed_reason || 'Unknown error'}`,
                            type: 'error'
                        });
                        setIsRendering(false);
                        clearInterval(pollInterval);
                    }
                }, 2000);

                // Stop polling after 5 minutes (safety)
                setTimeout(() => clearInterval(pollInterval), 300000);
            }
        } catch (error) {
            setRenderMessage({ text: 'An unexpected error occurred.', type: 'error' });
        } finally {
            setIsRendering(false);
        }
    };

    const handleDownload = async () => {
        if (!lastRenderedVideo?.url) return;
        
        try {
            const response = await fetch(lastRenderedVideo.url);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = `${lastRenderedVideo.title.replace(/\s+/g, '_') || 'video'}.mp4`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            // Fallback for CORS or other issues
            window.open(lastRenderedVideo.url, '_blank');
        }
    };

    const handleCopyLink = () => {
        if (lastRenderedVideo?.url) {
            navigator.clipboard.writeText(lastRenderedVideo.url);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        }
    };

    const renderButtonContent = isRendering ? (
        <>
            <Loader2 className="w-6 h-6 animate-spin text-electric-blue" />
            Rendering...
        </>
    ) : (
        <>
            <Sparkles className="w-6 h-6 text-yellow-400" />
            Generate Video
        </>
    );

    return (
        <>
            <div className="pt-20 pb-32 lg:pb-8 px-4 lg:px-6 max-w-[1700px] mx-auto">
                {/* Mobile Tab Switcher */}
                <div className="flex lg:hidden mb-6 bg-slate-900/50 p-1 rounded-xl border border-white/5 relative">
                    <button
                        onClick={() => setActiveTab('code')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold transition-all rounded-lg z-10 ${activeTab === 'code' ? 'text-white' : 'text-slate-500 hover:text-slate-300'
                            }`}
                    >
                        <Terminal className="w-4 h-4" />
                        Code
                    </button>
                    <button
                        onClick={() => setActiveTab('preview')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold transition-all rounded-lg z-10 ${activeTab === 'preview' ? 'text-white' : 'text-slate-500 hover:text-slate-300'
                            }`}
                    >
                        <Play className="w-4 h-4" />
                        Preview
                    </button>
                    {/* Animated Tab Indicator */}
                    <div
                        className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-electric-blue/20 border border-electric-blue/30 rounded-lg transition-all duration-300 ease-out ${activeTab === 'code' ? 'left-1' : 'left-[calc(50%+1px)]'
                            }`}
                    />
                </div>

                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start justify-center">

                    {/* LEFT COLUMN: The Video Preview (The Masterpiece) */}
                    <div className={`flex-[1.4] w-full lg:sticky lg:top-24 ${activeTab !== 'preview' ? 'hidden lg:block' : 'block'}`}>
                        <div className="overflow-hidden border border-white/10 rounded-2xl shadow-[0_40px_100px_rgba(0,0,0,0.5),0_0_80px_rgba(59,130,246,0.12)] bg-black/40 backdrop-blur-3xl ring-1 ring-white/10 group">
                            <div className="flex flex-row items-center justify-between bg-white/[0.03] px-8 py-5 border-b border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-electric-blue/10 border border-electric-blue/20">
                                        <Play className="w-5 h-5 text-electric-blue fill-electric-blue" />
                                    </div>
                                    <h3 className="text-xl tracking-tight font-black">Video Preview</h3>
                                </div>
                                <div className="px-4 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
                                    Uncompressed 4K Preview
                                </div>
                            </div>
                            <div className="p-0 bg-black aspect-video flex items-center justify-center overflow-hidden relative">
                                <Player
                                    component={MyComposition}
                                    durationInFrames={durationInFrames}
                                    compositionWidth={currentFormat.width}
                                    compositionHeight={currentFormat.height}
                                    fps={30}
                                    controls={true}
                                    clickToPlay={true}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "contain",
                                    }}
                                    inputProps={{
                                        codeString: code,
                                        language: "javascript",
                                        baseDelayMs: speedMs,
                                        theme: theme,
                                        cursorStyle: cursorStyle,
                                        width: currentFormat.width,
                                        height: currentFormat.height
                                    }}
                                />
                                {/* Soft Inner Glow Overlay */}
                                <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-electric-blue/5 to-transparent flex items-end justify-center pb-4">
                                    <div className="w-1/2 h-1 bg-electric-blue shadow-[0_0_20px_rgba(59,130,246,0.5)] opacity-20 rounded-full" />
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 space-y-5 hidden lg:block">
                            <Button
                                onClick={handleRender}
                                disabled={!code.trim() || isRendering}
                                className="w-full h-18 gap-3 text-2xl font-black shadow-[0_20px_60px_rgba(0,210,255,0.3)] hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:grayscale disabled:pointer-events-none"
                            >
                                {renderButtonContent}
                            </Button>

                            {/* DESKTOP TOAST MESSAGE */}
                            {(isRendering || renderMessage) && (
                                <div className={`p-4 rounded-xl border text-sm text-center font-bold animate-in fade-in slide-in-from-bottom-2 ${
                                    renderMessage?.type === 'error'
                                    ? 'border-red-500/20 bg-red-500/10 text-red-400'
                                    : 'border-blue-500/20 bg-blue-500/10 text-blue-400'
                                    }`}>
                                    {isRendering && (
                                        <div className="mb-4 space-y-3">
                                            <div className="flex justify-between text-xs text-white/50">
                                                <span>Processing patterns...</span>
                                                <span>{renderProgress}%</span>
                                            </div>
                                            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-blue-500 transition-all duration-500"
                                                    style={{ width: `${renderProgress}%` }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                    <div className="mb-3">{renderMessage?.text || (isRendering ? 'Rendering your masterpiece...' : '')}</div>
                                    {renderMessage?.type === 'success' && lastRenderedVideo && (
                                        <div className="flex gap-2">
                                            <Button
                                                onClick={handleDownload}
                                                className="flex-1 h-10 bg-green-600 hover:bg-green-500 text-white gap-2"
                                            >
                                                <Download size={16} />
                                                Download
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={handleCopyLink}
                                                className="flex-1 h-10 border-white/10 hover:bg-white/5 gap-2"
                                            >
                                                {isCopied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                                                {isCopied ? 'Copied!' : 'Copy Link'}
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="flex items-center justify-between gap-6 px-4">
                                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                    Final export will be a <span className="text-slate-300">1080p MP4</span> optimized for <br />
                                    TikTok, Instagram Reels, and YouTube Shorts.
                                </p>
                                <Button variant="outline" className="h-12 px-6 border-white/10 hover:bg-white/5 shrink-0">
                                    <Share2 className="w-5 h-5 text-slate-400" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: The Controls (Secondary Importance) */}
                    <div className={`w-full lg:w-[400px] flex flex-col gap-6 opacity-90 hover:opacity-100 transition-opacity ${activeTab !== 'code' ? 'hidden lg:flex' : 'flex'}`}>
                        <div className="bg-slate-900/60 border border-white/5 rounded-2xl overflow-hidden shadow-xl">
                            <div className="px-6 py-4 border-b border-white/5">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Terminal className="w-4 h-4 text-slate-400" />
                                        <h3 className="text-sm uppercase tracking-widest text-slate-400 font-bold">Source Code</h3>
                                    </div>
                                    <Sparkles className="w-3 h-3 text-yellow-400 opacity-50" />
                                </div>
                            </div>
                            <div className="p-6 space-y-4 pt-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                                        Paste your code here
                                    </label>
                                    <div className="relative">
                                        <Textarea
                                            value={code}
                                            onChange={(e) => setCode(e.target.value)}
                                            placeholder="Enter your code..."
                                            className="min-h-[400px] text-lg leading-relaxed focus:border-electric-blue/50"
                                        />
                                        {/* Mobile Update Hint */}
                                        <div className={`absolute top-4 right-4 pointer-events-none transition-all duration-500 lg:hidden ${showHint ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
                                            }`}>
                                            <div className="px-3 py-1.5 bg-electric-blue/90 text-white text-[10px] font-bold rounded-full shadow-lg backdrop-blur-sm flex items-center gap-2 border border-white/20">
                                                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                                                PREVIEW UPDATED
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                    <p className="text-xs text-slate-400 font-medium">
                                        ✨ <span className="text-electric-blue">Tip:</span> Cinematic mode works best with blocks between 5-15 lines.
                                    </p>
                                </div>
                            </div>

                        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-8 space-y-8">
                            <h4 className="text-sm font-bold text-white uppercase tracking-widest">Animation Settings</h4>

                            <div className="space-y-6">
                                {/* Theme Selector */}
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                                            Visual Theme
                                        </label>
                                    </div>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-electric-blue transition-colors">
                                            <Palette className="w-4 h-4" />
                                        </div>
                                        <select
                                            value={theme}
                                            onChange={(e) => setTheme(e.target.value as VideoTheme)}
                                            className="w-full h-12 pl-12 pr-10 bg-slate-900 border border-white/5 rounded-xl text-sm font-bold appearance-none focus:outline-none focus:border-electric-blue/50 focus:ring-1 focus:ring-electric-blue/20 transition-all cursor-pointer"
                                        >
                                            <option value="original">Original (Cinematic)</option>
                                            <option value="dark">Dark Minimal</option>
                                            <option value="vscode">VS Code Style</option>
                                            <option value="terminal">Terminal Retro</option>
                                            <option value="midnight">Midnight Blue</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                            <ChevronDown className="w-4 h-4" />
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-slate-500 font-medium">Changes background, fonts, and accents.</p>
                                </div>

                                <div className="h-px bg-white/5 my-2" />

                                {/* Cursor Style Selector */}
                                <div className="space-y-3">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                                        Cursor Style
                                    </label>
                                    <div className="flex gap-2">
                                        {(['block', 'bar', 'line'] as const).map((style) => (
                                            <button
                                                key={style}
                                                onClick={() => setCursorStyle(style)}
                                                className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg border transition-all ${cursorStyle === style
                                                    ? 'bg-electric-blue/20 border-electric-blue text-electric-blue'
                                                    : 'bg-slate-900 border-white/5 text-slate-500 hover:text-slate-300'
                                                    }`}
                                            >
                                                {style}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="h-px bg-white/5 my-2" />

                                {/* Video Format Dropdown */}
                                <div className="space-y-3">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                                        Video Format
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={format}
                                            onChange={(e) => setFormat(e.target.value as VideoFormat)}
                                            className="w-full h-12 bg-slate-900 border border-white/10 rounded-xl px-4 appearance-none focus:outline-none focus:border-electric-blue/50 text-slate-200 transition-colors"
                                        >
                                            <option value="9:16">9:16 (TikTok)</option>
                                            <option value="16:9">16:9 (YouTube)</option>
                                            <option value="1:1">1:1 (Instagram)</option>
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                                    </div>
                                    <p className="text-[10px] text-slate-500 font-medium">
                                        Choose the output aspect ratio.
                                    </p>
                                </div>

                                {/* Typing Speed Slider */}
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                                            Typing Speed: <span className="text-electric-blue">{getSpeedCategory(speedMs)}</span> <span className="text-slate-400 text-[10px] lowercase">({speedMs}ms)</span>
                                        </label>
                                    </div>
                                    <div className="h-12 flex items-center px-2 bg-slate-900 border border-white/5 rounded-xl">
                                        <input
                                            type="range"
                                            min="15"
                                            max="120"
                                            step="1"
                                            value={speedMs}
                                            onChange={(e) => setSpeedMs(parseInt(e.target.value))}
                                            className="w-full accent-electric-blue bg-white/5 h-1.5 rounded-lg appearance-none cursor-pointer"
                                        />
                                    </div>
                                </div>



                                <div className="h-px bg-white/5 my-2" />


                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* STICKY BOTTOM ACTION BAR (Mobile Only) */}
            <div className="fixed bottom-0 inset-x-0 lg:hidden z-50 pointer-events-none">
                <div className="max-w-[1700px] mx-auto px-4 pb-[env(safe-area-inset-bottom)]">
                    <div className="max-w-md mx-auto pointer-events-auto pb-6 space-y-2">
                        {/* MOBILE TOAST MESSAGE */}
                        {(isRendering || renderMessage) && (
                            <div className={`p-3 rounded-xl border text-xs text-center font-bold shadow-xl animate-in fade-in slide-in-from-bottom-2 ${
                                renderMessage?.type === 'error'
                                ? 'border-red-500/20 bg-red-500/90 text-red-50 backdrop-blur-md'
                                : 'border-blue-500/20 bg-blue-600/90 text-white backdrop-blur-md'
                                }`}>
                                {isRendering && (
                                    <div className="mb-3 space-y-2 text-left">
                                        <div className="flex justify-between text-[10px] opacity-80">
                                            <span className="uppercase tracking-widest font-black">Rendering</span>
                                            <span>{renderProgress}%</span>
                                        </div>
                                        <div className="w-full h-1 bg-white/30 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-white transition-all duration-500"
                                                style={{ width: `${renderProgress}%` }}
                                            />
                                        </div>
                                    </div>
                                )}
                                <div className="mb-2">{renderMessage?.text || (isRendering ? 'Starting render engine...' : '')}</div>
                                {renderMessage?.type === 'success' && lastRenderedVideo && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                const link = document.createElement('a');
                                                link.href = lastRenderedVideo?.url || '';
                                                link.target = '_blank';
                                                link.download = `${lastRenderedVideo?.title || 'video'}.mp4`;
                                                document.body.appendChild(link);
                                                link.click();
                                                document.body.removeChild(link);
                                            }}
                                            className="flex-1 h-10 bg-white/20 hover:bg-white/30 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
                                        >
                                            <Download size={14} />
                                            Download
                                        </button>
                                        <button
                                            onClick={handleCopyLink}
                                            className="flex-1 h-10 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-lg flex items-center justify-center gap-2 transition-colors"
                                        >
                                            {isCopied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                                            {isCopied ? 'Copied' : 'Link'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 p-2 rounded-2xl shadow-[0_-30px_60px_rgba(0,0,0,0.5)] flex items-center gap-2">
                            <button
                                onClick={handleRender}
                                disabled={!code.trim() || isRendering}
                                className="flex-1 h-14 bg-electric-blue hover:bg-blue-500 disabled:opacity-50 disabled:grayscale text-white font-black rounded-xl flex items-center justify-center gap-2 shadow-[0_10px_30px_rgba(59,130,246,0.3)] active:scale-95 transition-all text-sm uppercase tracking-wide"
                            >
                                {isRendering ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                                {isRendering ? 'Rendering...' : 'Render Video'}
                            </button>

                            <button
                                onClick={() => setActiveTab(activeTab === 'code' ? 'preview' : 'code')}
                                className="w-14 h-14 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center justify-center transition-all active:scale-90"
                            >
                                {activeTab === 'code' ? (
                                    <Play className="w-6 h-6 text-slate-300" />
                                ) : (
                                    <Terminal className="w-6 h-6 text-slate-300" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
