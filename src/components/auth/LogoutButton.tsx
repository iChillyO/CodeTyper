'use client'

import { useTransition } from 'react'
import { logout } from '@/app/auth/actions'
import { LogOut } from 'lucide-react'

export default function LogoutButton() {
    const [isPending, startTransition] = useTransition()

    const handleLogout = (e: React.FormEvent) => {
        e.preventDefault()
        startTransition(async () => {
            await logout()
        })
    }

    return (
        <form onSubmit={handleLogout}>
            <button
                type="submit"
                disabled={isPending}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400/70 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200 disabled:opacity-50"
            >
                {isPending ? (
                    <div className="w-4.5 h-4.5 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
                ) : (
                    <LogOut size={18} />
                )}
                {isPending ? 'Signing out...' : 'Sign out'}
            </button>
        </form>
    )
}
