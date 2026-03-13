'use client'

import React, { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Eye, EyeOff, Lock, ShieldCheck, CheckCircle2 } from 'lucide-react'

export default function ResetPasswordForm() {
    const router = useRouter()
    const supabase = createClient()

    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)
    const [message, setMessage] = useState<string | null>(null)

    const isPasswordValid = password.length >= 6
    const doPasswordsMatch = password === confirmPassword
    const canSubmit = isPasswordValid && doPasswordsMatch && !isPending

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!canSubmit) return

        setError(null)
        setMessage(null)

        startTransition(async () => {
            const { error } = await supabase.auth.updateUser({
                password: password,
            })

            if (error) {
                setError(error.message)
                return
            }

            setMessage('Password updated successfully!')

            setTimeout(() => {
                router.push('/dashboard')
            }, 2000)
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
                    <h1 className="text-2xl font-semibold text-white tracking-tight">Set new password</h1>
                    <p className="text-white/50 text-sm mt-1">Please enter your new password below</p>
                </div>

                {/* Card */}
                <div className="bg-white/[0.03] border border-white/10 backdrop-blur-md rounded-2xl p-6 shadow-2xl">
                    {message ? (
                        <div className="py-4 text-center space-y-4">
                            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-2 border border-green-500/20">
                                <CheckCircle2 className="text-green-500" size={32} />
                            </div>
                            <h2 className="text-xl font-medium text-white">Password Updated</h2>
                            <p className="text-white/50 text-sm">
                                Your password has been successfully changed. Redirecting to dashboard...
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleUpdatePassword} className="space-y-5">
                            <div className="space-y-1">
                                <Input
                                    label="New Password"
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
                            </div>

                            <Input
                                label="Confirm New Password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                leftIcon={<Lock size={18} />}
                                required
                                autoComplete="new-password"
                                error={confirmPassword && !doPasswordsMatch ? 'Passwords do not match' : undefined}
                            />

                            <Button
                                type="submit"
                                className="w-full py-6 text-base mt-2"
                                isLoading={isPending}
                                disabled={!canSubmit}
                            >
                                Update password
                            </Button>

                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg text-center animate-in fade-in slide-in-from-bottom-2">
                                    {error}
                                </div>
                            )}
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
