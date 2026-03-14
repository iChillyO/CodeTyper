"use client";

import React from "react";
import { motion } from "framer-motion";
import { Github, Play, Video, Sparkles } from "lucide-react";

export function TransformationSection() {
    return (
        <section className="py-32 px-6 border-t border-white/5 bg-[#020617] overflow-hidden">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-24 transition-all duration-700">
                    <h2 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter leading-none">
                        Turn Static Code <br /> Into <span className="text-electric-blue">Scroll-Stopping Video</span>
                    </h2>
                    <p className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
                        Transform plain snippets into cinematic typing animations in seconds.
                    </p>
                </div>

                {/* Transformation Grid */}
                <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-8 max-w-6xl mx-auto relative px-4">

                    {/* BEFORE CARD: The "Static" State */}
                    <div className="w-full lg:w-[45%] flex flex-col group/before translate-y-4 lg:translate-y-8">
                        <div className="flex items-center gap-2 mb-4 opacity-40 group-hover/before:opacity-60 transition-opacity">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Before</span>
                            <div className="h-px flex-1 bg-slate-800" />
                        </div>

                        <div className="bg-[#f8f9fa] dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-white/5 p-6 shadow-sm overflow-hidden grayscale transition-all duration-700">
                            {/* Static Code Mock */}
                            <div className="mb-4 flex items-center gap-2 opacity-30">
                                <Github className="w-4 h-4 text-slate-400" />
                                <div className="h-1.5 w-20 bg-slate-300 rounded" />
                            </div>
                            <div className="space-y-3 font-mono text-[11px] text-slate-400">
                                <div className="flex gap-2">
                                    <span className="opacity-70">const</span>
                                    <span className="opacity-70">data</span>
                                    <span className="opacity-70">=</span>
                                    <span className="opacity-70">fetch</span>
                                    <span className="opacity-70">(</span>
                                    <span className="opacity-70">'/api/v1'</span>
                                    <span className="opacity-70">)</span>
                                </div>
                                <div className="flex gap-2">
                                    <span className="opacity-70">const</span>
                                    <span className="opacity-70">results</span>
                                    <span className="opacity-70">=</span>
                                    <span className="opacity-70">await</span>
                                    <span className="opacity-70">data</span>
                                    <span className="opacity-70">.</span>
                                    <span className="opacity-70">json</span>
                                    <span className="opacity-70">()</span>
                                </div>
                                <div className="flex gap-2">
                                    <span className="opacity-70">console</span>
                                    <span className="opacity-70">.</span>
                                    <span className="opacity-70">log</span>
                                    <span className="opacity-70">(</span>
                                    <span className="opacity-70">'Done'</span>
                                    <span className="opacity-70">)</span>
                                </div>
                                <div className="h-3 w-3/4 bg-slate-200/50 dark:bg-slate-800/50 rounded" />
                                <div className="h-3 w-1/2 bg-slate-200/50 dark:bg-slate-800/50 rounded" />
                            </div>
                        </div>
                        <p className="mt-6 text-center lg:text-left text-sm font-bold text-slate-600 dark:text-slate-500 uppercase tracking-widest italic opacity-50">
                            "Technically correct, but visually boring."
                        </p>
                    </div>

                    {/* AFTER CARD: The "Cinematic" State (Dominate) */}
                    <div className="w-full lg:w-[55%] flex flex-col relative z-10 group/after">
                        {/* Glow effect */}
                        <div className="absolute -inset-10 bg-electric-blue/10 blur-[80px] rounded-full pointer-events-none -z-10 group-hover/after:bg-electric-blue/15 transition-colors duration-1000" />

                        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-2 mb-8 md:mb-4 w-full">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-electric-blue">After</span>
                            <div className="hidden md:block h-px flex-1 bg-electric-blue/20" />
                            <div className="flex gap-2">
                                <div className="px-3 py-1 rounded-full bg-electric-blue/10 border border-electric-blue/20 text-[9px] text-electric-blue font-bold tracking-widest uppercase">
                                    1080p MP4
                                </div>
                                <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] text-slate-400 font-bold tracking-widest uppercase">
                                    Social Ready
                                </div>
                            </div>
                        </div>

                        {/* Video Preview Mockup */}
                        <div className="bg-[#0b0f1a] rounded-2xl border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.6),0_0_80px_rgba(59,130,246,0.1)] px-6 py-10 md:p-8 overflow-hidden relative group-hover/after:shadow-[0_40px_100px_rgba(0,0,0,0.8),0_0_100px_rgba(59,130,246,0.2)] transition-all duration-700">
                            <div className="flex items-center justify-between mb-8">
                                <Video className="w-5 h-5 text-electric-blue" />
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Rendering...</span>
                                </div>
                            </div>

                            <div className="space-y-4 font-mono text-sm md:text-base p-4 md:p-6 bg-black/40 rounded-xl border border-white/5 relative">
                                <div className="flex gap-3">
                                    <span className="text-purple-400">const</span>
                                    <span className="text-blue-400">data</span>
                                    <span className="text-white">=</span>
                                    <span className="text-yellow-400">await</span>
                                    <span className="text-green-400">fetch</span>
                                    <span className="text-white">(</span>
                                    <span className="text-orange-400">'/api/v1'</span>
                                    <span className="text-white">)</span>
                                </div>
                                <div className="flex gap-3">
                                    <span className="text-purple-400">const</span>
                                    <span className="text-blue-400">results</span>
                                    <span className="text-white">=</span>
                                    <span className="text-yellow-400">await</span>
                                    <span className="text-blue-400">data</span>
                                    <span className="text-white">.</span>
                                    <span className="text-green-400">json</span>
                                    <span className="text-white">()</span>
                                </div>
                                <div className="flex gap-3 items-center">
                                    <span className="text-blue-400">console</span>
                                    <span className="text-white">.</span>
                                    <span className="text-green-400">log</span>
                                    <span className="text-white">(</span>
                                    <span className="text-orange-400">'Done'</span>
                                    <span className="text-white">)</span>
                                    <motion.div
                                        initial={{ opacity: 1 }}
                                        animate={{ opacity: [1, 0, 1] }}
                                        transition={{ repeat: Infinity, duration: 1 }}
                                        className="w-2.5 h-6 bg-electric-blue"
                                    />
                                </div>

                                {/* Overlay Play Indicator */}
                                <div className="absolute inset-0 flex items-center justify-center bg-black/5 group-hover/after:bg-black/20 transition-all cursor-pointer">
                                    <div className="w-16 h-16 rounded-full bg-electric-blue/90 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.5)] group-hover/after:scale-110 transition-transform backdrop-blur-sm">
                                        <Play className="w-8 h-8 text-white fill-white ml-1" />
                                    </div>
                                </div>
                            </div>

                            {/* Accent Glow Lines */}
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-electric-blue/40 to-transparent" />
                        </div>

                        <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4 px-2 text-center md:text-left">
                            <div className="flex flex-col md:flex-row items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                                    <Sparkles className="w-5 h-5 text-yellow-400" />
                                </div>
                                <span className="text-sm font-black text-white italic tracking-tight">"Export Ready. Social Optimized."</span>
                            </div>
                            <div className="flex items-center gap-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                <span>High Bitrate</span>
                                <span>•</span>
                                <span>60 FPS</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
