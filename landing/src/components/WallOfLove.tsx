"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Twitter, Star, PlayCircle, Flame } from "lucide-react";

interface Testimonial {
    id: number;
    type: "tweet" | "video";
    author: string;
    handle?: string;
    content?: string;
    thumbnail?: string;
    avatar?: string;
    icon?: React.ReactNode;
}

const testimonials: Testimonial[] = [
    {
        id: 1,
        type: "tweet",
        author: "Josh W.",
        handle: "@joshw_dev",
        content: "Honestly, CodeTyper is a game changer for my LinkedIn posts. No more clunky screen recordings. Just clean, aesthetic typing videos.",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Josh",
        icon: <Flame className="w-4 h-4 text-orange-500 inline-block align-text-bottom ml-1" />,
    },
    {
        id: 2,
        type: "video",
        author: "Sarah Chen",
        thumbnail: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=500&auto=format&fit=crop",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    },
    {
        id: 3,
        type: "tweet",
        author: "Alex Rivera",
        handle: "@alex_codes",
        content: "The realistic typing engine is scary good. People keep asking me what VS Code extension I'm using to record my screen. I just send them here.",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    },
    {
        id: 4,
        type: "video",
        author: "Elena Petrova",
        thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=500&auto=format&fit=crop",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena",
    },
    {
        id: 5,
        type: "tweet",
        author: "Marcus Brown",
        handle: "@marcus_dev",
        content: "Fast, simple, and the themes are stunning. 10/10 would recommend for any developer looking to build a personal brand.",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
    },
    {
        id: 6,
        type: "video",
        author: "David Kim",
        thumbnail: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=500&auto=format&fit=crop",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    },
];

export function WallOfLove() {
    return (
        <section className="py-24 px-6 bg-white/[0.01] border-t border-b border-white/5">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
                        Wall of <span className="text-electric-blue italic">Love</span>
                    </h2>
                    <p className="text-slate-500 font-medium max-w-2xl mx-auto">
                        Join thousands of developers turning their code into high-performing content.
                    </p>
                </div>

                <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                    {testimonials.map((item) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: item.id * 0.1 }}
                            className="break-inside-avoid"
                        >
                            {item.type === "tweet" ? (
                                <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-colors">
                                    <div className="flex items-center gap-3 mb-4">
                                        <img
                                            src={item.avatar}
                                            alt={item.author}
                                            className="w-10 h-10 rounded-full bg-white/10"
                                            loading="lazy"
                                        />
                                        <div>
                                            <h4 className="text-sm font-bold text-white">{item.author}</h4>
                                            <p className="text-xs text-slate-500 font-medium">{item.handle}</p>
                                        </div>
                                        <Twitter className="w-4 h-4 text-blue-400 ml-auto" />
                                    </div>
                                    <p className="text-slate-300 text-sm leading-relaxed mb-4">
                                        {item.content}
                                        {item.icon}
                                    </p>
                                    <div className="flex gap-1 text-yellow-500">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="w-3 h-3 fill-current" />
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="group relative rounded-2xl overflow-hidden border border-white/5 bg-white/[0.03] hover:border-electric-blue/30 transition-all cursor-pointer">
                                    <div className="aspect-video relative overflow-hidden">
                                        <img
                                            src={item.thumbnail}
                                            alt={`Video by ${item.author}`}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <PlayCircle className="w-12 h-12 text-white" />
                                        </div>
                                    </div>
                                    <div className="p-4 flex items-center gap-3">
                                        <img
                                            src={item.avatar}
                                            alt={item.author}
                                            className="w-8 h-8 rounded-full bg-white/10"
                                            loading="lazy"
                                        />
                                        <h4 className="text-sm font-bold text-white">{item.author}</h4>
                                        <span className="ml-auto px-2 py-0.5 rounded text-[10px] font-bold bg-electric-blue/20 text-electric-blue border border-electric-blue/30 uppercase">
                                            Video Playback
                                        </span>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
