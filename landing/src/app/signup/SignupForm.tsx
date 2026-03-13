'use client'

import React, { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Eye, EyeOff, Mail, Lock, ShieldCheck, CheckCircle2 } from 'lucide-react'

export default function SignupForm() {
    const router = useRouter()
    const supabase = createClient()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)
    const [message, setMessage] = useState<string | null>(null)

    // Validation
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    const isPasswordValid = password.length >= 6
    const canSubmit = isEmailValid && isPasswordValid && !isPending

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!canSubmit) return

        setError(null)
        setMessage(null)

        startTransition(async () => {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                },
            })

            if (error) {
                setError(error.message)
                return
            }

            // In Supabase, if the user already exists, signUp returns a user but with an empty identities array
            // when enumeration protection is enabled (default in recent projects).
            if (data.user && data.user.identities && data.user.identities.length === 0) {
                setError('An account with this email already exists. Please sign in or reset your password.')
                return
            }

            setMessage('Check your email to confirm your account.')

            // Optional: redirect to login with message after a delay
            setTimeout(() => {
                router.push(`/login?message=Check your email to confirm your account`)
            }, 3000)
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
                    <h1 className="text-2xl font-semibold text-white tracking-tight">Create an account</h1>
                    <p className="text-white/50 text-sm mt-1">Start generating cinematic code videos today</p>
                </div>

                {/* Signup Card */}
                <div className="bg-white/[0.03] border border-white/10 backdrop-blur-md rounded-2xl p-6 shadow-2xl">
                    <form onSubmit={handleSignup} className="space-y-5">
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

                        <div className="space-y-1">
                            <Input
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                leftIcon={<Lock size={18} />}
                                required
                                autoComplete="new-password"
                                error={password && !isPasswordValid ? 'Password must be at least 6 characters' : undefined}
                                rightElement={
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="text-white/30 hover:text-white/60 transition-colors"
                                        tabIndex={-1}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                }
                            />
                            <p className="text-[10px] text-white/30 px-1">
                                Must be at least 6 characters with letters and numbers.
                            </p>
                            <div className="flex justify-end px-1">
                                <Link
                                    href="/forgot-password"
                                    className="text-[11px] text-blue-400/70 hover:text-blue-400 hover:underline transition-all"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full py-6 text-base mt-2"
                            isLoading={isPending}
                            disabled={!canSubmit}
                        >
                            Get started for free
                        </Button>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg text-center animate-in fade-in slide-in-from-bottom-2">
                                {error}
                            </div>
                        )}

                        {message && (
                            <div className="bg-green-500/10 border border-green-500/20 text-green-400 text-sm p-3 rounded-lg text-center animate-in fade-in slide-in-from-bottom-2">
                                {message}
                            </div>
                        )}
                    </form>

                    <p className="text-center text-sm text-white/40 mt-6">
                        Already have an account?{' '}
                        <Link href="/login" className="text-blue-400 font-medium hover:text-blue-300 transition-colors underline underline-offset-4 decoration-blue-500/30">
                            Sign in
                        </Link>
                    </p>
                </div>

                {/* Footer info */}
                <div className="mt-8 flex items-center justify-center gap-6 text-white/30">
                    <div className="flex items-center gap-1.5 text-xs">
                        <ShieldCheck size={14} className="text-blue-500/60" />
                        <span>Secure encryption</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs">
                        <CheckCircle2 size={14} className="text-blue-500/60" />
                        <span>Privacy guaranteed</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
