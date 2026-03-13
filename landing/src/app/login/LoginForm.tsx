'use client'

import React, { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Eye, EyeOff, Mail, Lock, CheckCircle2, ShieldCheck, ChevronLeft } from 'lucide-react'

export default function LoginForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const supabase = createClient()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(searchParams.get('error'))
    const [message, setMessage] = useState<string | null>(searchParams.get('message'))

    // Validation
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    const isPasswordValid = password.length >= 6
    const canSubmit = isEmailValid && isPasswordValid && !isPending

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!canSubmit) return

        setError(null)
        setMessage(null)

        startTransition(async () => {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) {
                setError(error.message === 'Invalid login credentials'
                    ? 'Invalid email or password. Please try again.'
                    : error.message)
                return
            }

            router.push('/dashboard')
            router.refresh()
        })
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-[#0A0A0B]">
            {/* Background aesthetic details */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/10 blur-[120px] rounded-full" />
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3%3Ffilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
                />
            </div>

            <div className="w-full max-w-[400px] z-10 animate-in fade-in zoom-in duration-500">
                {/* Back to Home Link */}
                <Link
                    href="/"
                    className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-8 group w-fit"
                >
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 group-hover:border-white/20 transition-all">
                        <ChevronLeft size={16} />
                    </div>
                    <span className="text-sm font-medium">Back to home</span>
                </Link>

                {/* Logo/Brand Area */}
                <div className="flex flex-col items-center mb-8 text-center">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-xl shadow-blue-600/20 rotate-3">
                        <span className="text-white font-bold text-xl">CT</span>
                    </div>
                    <h1 className="text-2xl font-semibold text-white tracking-tight">Welcome back</h1>
                    <p className="text-white/50 text-sm mt-1">Sign in to continue to CodeTyper</p>
                </div>

                {/* Login Card */}
                <div className="bg-white/[0.03] border border-white/10 backdrop-blur-md rounded-2xl p-6 shadow-2xl">
                    <form onSubmit={handleLogin} className="space-y-5">
                        <Input
                            label="Email address"
                            type="email"
                            placeholder="name@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            leftIcon={<Mail size={18} />}
                            required
                            autoComplete="email"
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
                                autoComplete="current-password"
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
                            <div className="flex justify-end px-1">
                                <Link
                                    href="/forgot-password"
                                    className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2 px-1">
                            <input
                                type="checkbox"
                                id="remember"
                                className="w-4 h-4 rounded border-white/10 bg-white/5 text-blue-600 focus:ring-blue-500/50 focus:ring-offset-0"
                            />
                            <label htmlFor="remember" className="text-xs text-white/50 cursor-pointer select-none">
                                Remember me for 30 days
                            </label>
                        </div>

                        <Button
                            type="submit"
                            className="w-full py-6 text-base"
                            isLoading={isPending}
                            disabled={!canSubmit}
                        >
                            Sign in
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
                        Don't have an account?{' '}
                        <Link href="/signup" className="text-blue-400 font-medium hover:text-blue-300 transition-colors underline underline-offset-4 decoration-blue-500/30">
                            Create one for free
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
                        <span>Encrypted session</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
