'use client'

import React from 'react'
import { CheckCircle2, Crown, Zap, Terminal, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { PLANS, PlanType } from '@/lib/plans'
import { cn } from '@/lib/utils'

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-[#0A0A0B] text-white pt-32 pb-20 px-4">
            <div className="max-w-7xl mx-auto text-center mb-16">
                <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
                    Pick your <span className="text-electric-blue">Power</span>
                </h1>
                <p className="text-white/50 text-lg max-w-2xl mx-auto font-medium">
                    From hobbyists to professional creators, we have a plan that fits your typing speed.
                </p>
            </div>

            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                {(Object.keys(PLANS) as PlanType[]).map((planKey) => {
                    const plan = PLANS[planKey];
                    return (
                        <div
                            key={planKey}
                            className={cn(
                                "relative flex flex-col p-8 rounded-3xl border transition-all duration-300 group hover:translate-y-[-8px]",
                                plan.isRecommended
                                    ? "bg-blue-600/5 border-blue-500/30 shadow-[0_20px_40px_rgba(59,130,246,0.1)]"
                                    : "bg-white/[0.02] border-white/10"
                            )}
                        >
                            {plan.isRecommended && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 rounded-full bg-blue-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-lg shadow-blue-600/20">
                                    <Crown size={12} />
                                    Most Popular
                                </div>
                            )}

                            <div className="mb-8">
                                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-black">${plan.price}</span>
                                    <span className="text-white/40 text-sm font-medium">/month</span>
                                </div>
                            </div>

                            <div className="space-y-4 mb-10 flex-1">
                                {plan.features.map((feature, i) => (
                                    <div key={i} className="flex items-center gap-3 text-sm text-white/70">
                                        <div className={cn(
                                            "p-0.5 rounded-full",
                                            plan.isRecommended ? "bg-blue-500/20 text-blue-400" : "bg-white/10 text-white/40"
                                        )}>
                                            <CheckCircle2 size={16} />
                                        </div>
                                        {feature}
                                    </div>
                                ))}
                            </div>

                            <Link href="/signup" className="w-full">
                                <Button
                                    variant={plan.isRecommended ? 'primary' : 'outline'}
                                    className={cn(
                                        "w-full py-6 text-sm font-bold uppercase tracking-widest transition-all",
                                        !plan.isRecommended && "border-white/10 hover:bg-white/5"
                                    )}
                                >
                                    {planKey === 'free' ? 'Get Started' : 'Upgrade Now'}
                                    <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                        </div>
                    );
                })}
            </div>

            <div className="mt-20 text-center text-white/20 uppercase tracking-[0.3em] font-black text-[10px]">
                Safe Payments via Stripe
            </div>
        </div>
    );
}
