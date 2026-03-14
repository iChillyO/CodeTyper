'use client'

import React, { useState, useTransition } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Mail, ArrowLeft, ShieldCheck, CheckCircle2 } from 'lucide-react'

export default function ForgotPasswordForm() {
    const supabase = createClient()

    const [email, setEmail] = useState('')
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)
    const [message, setMessage] = useState<string | null>(null)

    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    const canSubmit = isEmailValid && !isPending

    const handleResetRequest = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!canSubmit) return

        setError(null)
        setMessage(null)

        startTransition(async () => {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            })

            if (error) {
                setError(error.message)
                return
            }

            setMessage('Check your email for the reset link.')
        })
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-[#0A0A0B]">
            {/* Background aesthetic details */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/10 blur-[120px] rounded-full" />
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3%3Ffilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
                />
            </div>

            <div className="w-full max-w-[400px] z-10 animate-in fade-in zoom-in duration-500">
                {/* Logo/Brand Area */}
                <div className="flex flex-col items-center mb-8 text-center">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-xl shadow-blue-600/20 -rotate-3">
                        <span className="text-white font-bold text-xl">CT</span>
                    </div>
                    <h1 className="text-2xl font-semibold text-white tracking-tight">Forgot password?</h1>
                    <p className="text-white/50 text-sm mt-1">No worries, we'll send you reset instructions</p>
                </div>

                {/* Card */}
                <div className="bg-white/[0.03] border border-white/10 backdrop-blur-md rounded-2xl p-6 shadow-2xl">
                    {message ? (
                        <div className="py-4 text-center space-y-4">
                            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-2 border border-green-500/20">
                                <CheckCircle2 className="text-green-500" size={32} />
                            </div>
                            <h2 className="text-xl font-medium text-white">Check your email</h2>
                            <p className="text-white/50 text-sm">
                                We've sent a password reset link to <span className="text-white font-medium">{email}</span>.
                            </p>
                            <Link
                                href="/login"
                                className="inline-flex items-center gap-2 text-blue-400 font-medium hover:text-blue-300 transition-colors mt-4"
                            >
                                <ArrowLeft size={16} />
                                Back to login
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleResetRequest} className="space-y-5">
                            <Input
                                label="Email address"
                                type="email"
                                placeholder="name@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                leftIcon={<Mail size={18} />}
                                required
                                autoComplete="email"
                                error={email && !isEmailValid ? 'Please enter a valid email' : undefined}
                            />

                            <Button
                                type="submit"
                                className="w-full py-6 text-base mt-2"
                                isLoading={isPending}
                                disabled={!canSubmit}
                            >
                                Send reset link
                            </Button>

                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg text-center animate-in fade-in slide-in-from-bottom-2">
                                    {error}
                                </div>
                            )}

                            <p className="text-center text-sm text-white/40 mt-6">
                                <Link href="/login" className="inline-flex items-center gap-2 text-blue-400 font-medium hover:text-blue-300 transition-colors underline underline-offset-4 decoration-blue-500/30">
                                    <ArrowLeft size={16} />
                                    Back to login
                                </Link>
                            </p>
                        </form>
                    )}
                </div>

                {/* Footer info */}
                <div className="mt-8 flex items-center justify-center gap-6 text-white/30">
                    <div className="flex items-center gap-1.5 text-xs">
                        <ShieldCheck size={14} className="text-blue-500/60" />
                        <span>Secure encryption</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
