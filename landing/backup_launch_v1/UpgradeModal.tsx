'use client'

import React from 'react'
import { X, Zap, Crown, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface UpgradeModalProps {
    isOpen: boolean
    onClose: () => void
}

export default function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-md bg-[#0A0A0B] border border-white/10 rounded-2xl p-8 shadow-2xl animate-in zoom-in duration-300">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white/30 hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-blue-600/20 rotate-3 group-hover:rotate-6 transition-transform">
                        <Zap size={32} className="text-white fill-white/20" />
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-4 shadow-[0_0_20px_rgba(59,130,246,0.1)]">
                        <Crown size={12} />
                        Best Recommended
                    </div>

                    <h2 className="text-3xl font-black tracking-tight mb-2">Upgrade to Pro</h2>
                    <div className="flex items-baseline gap-1 mb-6">
                        <span className="text-4xl font-extrabold">$19</span>
                        <span className="text-white/40 text-sm font-medium">/month</span>
                    </div>

                    <div className="w-full space-y-4 mb-8">
                        {[
                            '100 high-quality renders / mo',
                            'All Premium Cinematic Themes',
                            '4K Resolution Exports',
                            'Remove All Watermarks',
                            'Priority Rendering Queue'
                        ].map((feature, i) => (
                            <div key={i} className="flex items-center gap-3 text-sm text-white/80 font-medium">
                                <div className="p-1 rounded-full bg-blue-500/20">
                                    <CheckCircle2 size={14} className="text-blue-400" />
                                </div>
                                {feature}
                            </div>
                        ))}
                    </div>

                    <Link href="/pricing" className="w-full">
                        <Button className="w-full py-7 text-lg font-bold shadow-[0_20px_40px_rgba(37,99,235,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all">
                            Get Started with Pro
                        </Button>
                    </Link>

                    <p className="mt-6 text-[10px] text-white/20 uppercase tracking-[0.2em] font-black">
                        Cancel anytime • Secure payment
                    </p>
                </div>
            </div>
        </div>
    )
}
