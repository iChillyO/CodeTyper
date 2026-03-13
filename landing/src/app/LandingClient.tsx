"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import {
    Terminal, Code, Zap, Video, ArrowRight,
    Layers, Monitor, ShieldCheck, Sparkles, Github, Rocket, Users,
    Target, Film, Flame
} from "lucide-react";
import { motion } from "framer-motion";
import { TransformationSection } from "@/components/TransformationSection";
import { WallOfLove } from "@/components/WallOfLove";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";

export default function LandingClient() {
    const [typingText, setTypingText] = useState("");
    const codeSnippet = `const startCreating = () => {\n  console.log("Turn code to content...");\n  return "Done in 60s";\n};`;

    useEffect(() => {
        let i = 0;
        const interval = setInterval(() => {
            setTypingText(codeSnippet.slice(0, i));
            i++;
            if (i > codeSnippet.length) i = 0;
        }, 50);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            {/* HERO SECTION */}
            <section className="relative pt-32 pb-24 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
                {/* Left Side (Text Column - 45%) */}
                <div className="flex-1 lg:max-w-[45%] z-10">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.05] mb-6">
                            Turn Your Code Into <br />
                            <span className="text-electric-blue">Cinematic</span> <br />
                            Typing Videos.
                        </h1>
                        <p className="text-lg md:text-xl text-slate-400 mb-10 leading-relaxed font-medium">
                            Paste your code. We generate a smooth, realistic typing animation — ready for TikTok, YouTube Shorts, and LinkedIn.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 mb-8 w-full lg:w-auto">
                            <Link href="/create" className="flex-1 sm:flex-initial">
                                <button className="h-16 w-full sm:w-64 rounded-2xl btn-primary text-xl font-black shadow-[0_20px_50px_rgba(59,130,246,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3">
                                    Generate Video
                                    <ArrowRight className="w-6 h-6" />
                                </button>
                            </Link>
                        </div>

                        <p className="text-sm text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-yellow-400" />
                            Free to try • 4K Export • No credit card
                        </p>
                    </motion.div>
                </div>

                {/* Right Side (Visual Column - 55%) */}
                <div className="flex-1 lg:max-w-[55%] w-full relative">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="w-full aspect-[4/5] sm:aspect-square lg:aspect-video flex flex-col gap-4 relative"
                    >
                        {/* Top half: Code Window */}
                        <div className="flex-1 glass-card p-6 flex flex-col shadow-2xl relative overflow-hidden group">
                            <div className="flex items-center gap-2 mb-4 opacity-50">
                                <div className="w-3 h-3 rounded-full bg-red-500/30" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/30" />
                                <div className="w-3 h-3 rounded-full bg-green-500/30" />
                                <span className="ml-2 font-mono text-xs">source.py</span>
                            </div>
                            <div className="flex-1 font-mono text-sm sm:text-base leading-relaxed text-slate-300">
                                <pre>
                                    <code>
                                        <span className="text-purple-400">const</span> <span className="text-blue-400">snippet</span> = () =&gt; &#123;<br />
                                        &nbsp;&nbsp;render(<span className="text-orange-400">"Beautiful Animation"</span>);<br />
                                        &#125;;
                                    </code>
                                </pre>
                            </div>
                            <div className="absolute right-4 bottom-4 p-2 rounded-lg bg-electric-blue/10 border border-electric-blue/30 text-electric-blue">
                                <Code className="w-5 h-5" />
                            </div>
                        </div>

                        {/* Middle: Connection Arrow */}
                        <div className="flex justify-center -my-2 relative z-20">
                            <div className="w-10 h-10 rounded-full bg-electric-blue flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                                <motion.div animate={{ y: [-5, 5, -5] }} transition={{ repeat: Infinity, duration: 2 }}>
                                    <ArrowRight className="w-5 h-5 text-white rotate-90" />
                                </motion.div>
                            </div>
                        </div>

                        {/* Bottom half: Video Window */}
                        <div className="flex-1 glass-card border-electric-blue/30 p-6 flex flex-col shadow-2xl relative overflow-hidden bg-electric-blue/[0.02]">
                            <div className="flex items-center justify-between mb-4">
                                <div className="px-2 py-1 rounded bg-electric-blue animate-pulse text-[10px] font-bold uppercase tracking-tighter">Live Preview</div>
                                <Video className="w-4 h-4 text-electric-blue" />
                            </div>
                            <div className="flex-1 flex items-center justify-center">
                                <div className="w-full text-center font-mono text-xl sm:text-2xl font-bold tracking-tight py-4">
                                    {typingText}
                                    <span className="inline-block w-3 h-8 bg-electric-blue align-middle ml-1 animate-[pulse_1s_infinite]" />
                                </div>
                            </div>
                            {/* Visual Glow Layer */}
                            <div className="absolute inset-0 bg-gradient-to-t from-electric-blue/5 to-transparent pointer-events-none" />

                        </div>

                        {/* Background Soft Glow */}
                        <div className="absolute -inset-10 bg-electric-blue/10 blur-[100px] rounded-full -z-10" />
                    </motion.div>
                </div>
            </section>

            {/* Love ❤️ (Now immediately after Hero for trust building) */}
            <WallOfLove />

            {/* HOW IT WORKS SECTION */}
            <section className="py-32 px-6 border-t border-white/5 bg-black/20">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-black mb-20 text-center tracking-tight flex items-center justify-center gap-4"><Film className="w-10 h-10 text-electric-blue" /> How It Works</h2>
                    <div className="grid md:grid-cols-3 gap-12">
                        <StepCard
                            num="1"
                            title="Paste Your Code"
                            desc="Drop any snippet — JavaScript, Python, C++, whatever."
                        />
                        <StepCard
                            num="2"
                            title="Customize The Style"
                            desc="Choose typing speed, theme, cursor style, background music."
                        />
                        <StepCard
                            num="3"
                            title="Export Your Video"
                            desc="Download a social-ready vertical or landscape clip instantly."
                        />
                    </div>
                </div>
            </section>

            {/* WHAT MAKES IT DIFFERENT SECTION */}
            <section id="features" className="py-32 px-6 border-t border-white/5 bg-grid-subtle">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-24">
                        <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight flex items-center justify-center gap-4"><Flame className="w-10 h-10 text-orange-500" /> What Makes Us <span className="text-electric-blue italic text-glow-soft">Different</span></h2>
                        <p className="text-slate-500 font-medium">Built for the modern developer-content-creator workflow.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                        <FeatureCard
                            icon={<Zap className="w-7 h-7" />}
                            title="Realistic Typing Engine"
                            desc="Human-like keystrokes. Natural pauses. Blinking cursor."
                        />
                        <FeatureCard
                            icon={<Layers className="w-7 h-7" />}
                            title="Developer Themes"
                            desc="VS Code style. Terminal mode. Dark minimal. Custom fonts."
                        />
                        <FeatureCard
                            icon={<Rocket className="w-7 h-7" />}
                            title="Built For Social"
                            desc="Export for: TikTok, YouTube Shorts, Instagram Reels, LinkedIn."
                        />
                        <FeatureCard
                            icon={<ShieldCheck className="w-7 h-7" />}
                            title="No Screen Recording Needed"
                            desc="No OBS. No editing. No manual typing."
                        />
                    </div>
                </div>
            </section>

            {/* WHO IT’S FOR SECTION */}
            <section className="py-32 px-6 border-t border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-electric-blue/5 blur-[100px] rounded-full pointer-events-none -z-10" />

                <div className="max-w-7xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-black mb-24 text-center tracking-tight flex items-center justify-center gap-4"><Target className="w-10 h-10 text-red-500" /> Who It&apos;s For</h2>
                    <div className="grid sm:grid-cols-2 gap-8">
                        <AudienceCard
                            icon={<Sparkles className="w-8 h-8 text-yellow-400" />}
                            title="Indie Hackers"
                            desc="Launch your projects visually with high-impact clips."
                        />
                        <AudienceCard
                            icon={<Monitor className="w-8 h-8 text-blue-400" />}
                            title="CS Students"
                            desc="Submit clean code demos that stand out to professors."
                        />
                        <AudienceCard
                            icon={<Users className="w-8 h-8 text-purple-400" />}
                            title="Dev Influencers"
                            desc="Grow your personal brand with aesthetic coding clips."
                        />
                        <AudienceCard
                            icon={<Rocket className="w-8 h-8 text-green-400" />}
                            title="SaaS Founders"
                            desc="Show exactly how your backend logic works to potential users."
                        />
                    </div>
                </div>
            </section>

            {/* BEFORE / AFTER SECTION */}
            <TransformationSection />

            {/* FINAL CTA SECTION */}
            <section className="py-48 px-6 border-t border-white/5 relative bg-gradient-to-t from-electric-blue/10 to-transparent">
                <div className="max-w-4xl mx-auto text-center z-10 relative">
                    <h2 className="text-5xl md:text-7xl font-black mb-10 tracking-tight leading-none">Start Turning Your <br /> Code Into Content.</h2>
                    <Link href="/create">
                        <button className="h-20 px-16 rounded-2xl btn-primary text-2xl font-black shadow-[0_0_50px_rgba(59,130,246,0.3)] hover:scale-105 transition-all">
                            Generate Video
                        </button>
                    </Link>
                    <div className="mt-12 flex items-center justify-center gap-8 opacity-40 grayscale grayscale-100">
                        <a href="https://github.com/iChillyO/" target="_blank" rel="noopener noreferrer" className="hover:opacity-100 transition-opacity">
                            <Github className="w-6 h-6" />
                        </a>
                        <Twitter className="w-6 h-6" />
                        <Video className="w-6 h-6" />
                    </div>
                </div>
                {/* Particle Glows */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none -z-10">
                    <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/20 blur-3xl animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-purple-500/20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                </div>
            </section>

            {/* Global Footer */}
            <footer className="py-20 px-10 border-t border-white/5 bg-black flex flex-col md:flex-row justify-between items-center gap-10">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-electric-blue/10 border border-electric-blue/30 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.1)]">
                        <Terminal className="w-6 h-6 text-electric-blue" />
                    </div>
                    <span className="text-2xl font-black tracking-tighter">CodeTyper</span>
                </div>
                <p className="text-slate-500 font-bold tracking-[.3em] uppercase text-xs">
                    Built & Launched in GAZA 🇵🇸
                </p>
                <div className="flex gap-8 text-slate-500 text-sm font-bold">
                    <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                    <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
                    <a href="https://github.com/iChillyO/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors uppercase">GitHub</a>
                </div>
            </footer>

            <StickyMobileCTA />
        </>
    );
}

function StepCard({ num, title, desc }: { num: string, title: string, desc: string }) {
    return (
        <div className="glass-card p-10 flex flex-col items-center text-center group hover:bg-white/10 transition-colors border-white/5 shadow-xl">
            <div className="w-14 h-14 rounded-2xl bg-electric-blue flex items-center justify-center text-white text-2xl font-black mb-8 shadow-lg group-hover:scale-110 transition-transform">
                {num}
            </div>
            <h3 className="text-2xl font-black text-white mb-4 leading-tight">{title}</h3>
            <p className="text-slate-400 font-medium leading-relaxed">{desc}</p>
        </div>
    );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
    return (
        <div className="p-6 sm:p-8 rounded-3xl border border-white/5 bg-white/[0.02] hover:bg-white/5 transition-colors group">
            <div className="text-electric-blue mb-6 group-hover:scale-110 transition-transform origin-left">
                {icon}
            </div>
            <h3 className="text-xl font-black text-white mb-3 tracking-tight">{title}</h3>
            <p className="text-slate-500 font-medium text-sm leading-relaxed group-hover:text-slate-400">{desc}</p>
        </div>
    );
}

function AudienceCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
    return (
        <div className="glass-card p-8 flex gap-6 items-start hover:border-white/20 transition-all group">
            <div className="shrink-0 p-3 rounded-2xl bg-white/5 border border-white/5 group-hover:border-white/10 transition-all">
                {icon}
            </div>
            <div>
                <h3 className="text-2xl font-black mb-2 text-white">{title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{desc}</p>
            </div>
        </div>
    );
}



const Twitter = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
    </svg>
);
