'use client'

import React, { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Loader2, CheckCircle2 } from 'lucide-react'

export default function ChangePasswordButton({ email }: { email: string }) {
    const supabase = createClient()
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleReset = async () => {
        setLoading(true)
        setError(null)
        
        try {
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            })

            if (resetError) {
                setError(resetError.message)
            } else {
                setSent(true)
            }
        } catch (err: any) {
            setError('Something went wrong. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    if (sent) {
        return (
            <div className="flex items-center gap-2 px-3 py-2 bg-green-500/10 border border-green-500/20 rounded-lg text-xs font-bold text-green-400">
                <CheckCircle2 size={14} />
                Reset link sent!
            </div>
        )
    }

    return (
        <div className="space-y-2">
            <button
                onClick={handleReset}
                disabled={loading}
                className="w-full text-left px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-blue-400 hover:bg-white/10 transition-colors flex items-center justify-between disabled:opacity-50"
            >
                <span>{loading ? 'Sending link...' : 'Change Password'}</span>
                {loading && <Loader2 size={14} className="animate-spin" />}
            </button>
            {error && <p className="text-[10px] text-red-400 px-1">{error}</p>}
        </div>
    )
}
