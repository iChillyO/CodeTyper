"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";

export function StickyMobileCTA() {
    const [isVisible, setIsVisible] = useState(false);
    const { scrollY } = useScroll();

    // Optimized scroll listener using framer-motion's useMotionValueEvent
    useMotionValueEvent(scrollY, "change", (latest) => {
        if (latest > 400 && !isVisible) {
            setIsVisible(true);
        } else if (latest <= 400 && isVisible) {
            setIsVisible(false);
        }
    });

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, x: "-50%", opacity: 0 }}
                    animate={{ y: 0, x: "-50%", opacity: 1 }}
                    exit={{ y: 100, x: "-50%", opacity: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-sm md:hidden"
                >
                    <Link href="/create" className="block outline-none">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="relative w-full h-15 py-4 bg-electric-blue text-navy-950 rounded-full font-black text-lg flex items-center justify-center gap-3 shadow-[0_20px_60px_rgba(0,210,255,0.5)] border-2 border-white/20 overflow-hidden"
                        >
                            {/* Subtle animated shine effect */}
                            <motion.div
                                animate={{ x: ["-100%", "200%"] }}
                                transition={{ repeat: Infinity, duration: 3, ease: "linear", repeatDelay: 1 }}
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-full h-full skew-x-12"
                            />

                            <span className="relative z-10 flex items-center gap-2">
                                Generate Video
                                <ArrowRight className="w-5 h-5" />
                            </span>
                        </motion.button>
                    </Link>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
