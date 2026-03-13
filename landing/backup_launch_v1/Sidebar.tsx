'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    Video,
    Settings,
    LogOut,
    Zap,
    ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'
import LogoutButton from '@/components/auth/LogoutButton'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useState } from 'react'
import UpgradeModal from './UpgradeModal'
import { getPlanConfig } from '@/lib/plans'

const navItems = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Renders', href: '/dashboard/renders', icon: Video },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export default function Sidebar({ userEmail, usage }: { userEmail: string; usage?: any }) {
    const pathname = usePathname()
    const [isUpgradeOpen, setIsUpgradeOpen] = useState(false)

    const rendersUsed = usage?.renders_used || 0
    const planConfig = getPlanConfig(usage?.plan);
    const limit = planConfig.rendersPerMonth;
    const percentage = Math.round((rendersUsed / limit) * 100)

    return (
        <div className="flex flex-col h-full p-4 bg-[var(--background)]">
            {/* Brand */}
            <Link href="/dashboard" className="flex items-center gap-3 px-2 mb-10 mt-2 group">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20 group-hover:scale-110 transition-transform duration-200">
                    <span className="text-white font-bold text-lg">CT</span>
                </div>
                <div className="flex flex-col">
                    <span className="font-bold text-lg tracking-tight leading-tight">CodeTyper</span>
                    <span className="text-[10px] text-blue-400 font-medium tracking-widest uppercase">PRO DASHBOARD</span>
                </div>
            </Link>

            {/* Navigation */}
            <nav className="flex-1 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
                                isActive
                                    ? "bg-blue-600/10 text-blue-400 border border-blue-600/20"
                                    : "text-white/50 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <item.icon size={18} className={isActive ? "text-blue-400" : "text-white/30 group-hover:text-white/60"} />
                                {item.name}
                            </div>
                            {isActive && <ChevronRight size={14} className="animate-in fade-in slide-in-from-left-1" />}
                        </Link>
                    )
                })}
            </nav>

            {/* Plan / Usage Mini Area */}
            <div className="mt-auto mb-6 px-2">
                <div className="bg-[var(--glass-bg)] rounded-2xl p-4 border border-[var(--border)]">
                    <div className="flex items-center gap-2 mb-2">
                        <Zap size={14} className="text-blue-400 fill-blue-400/20" />
                        <span className="text-xs font-semibold text-white/80">{planConfig.name} Plan</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-1.5 mb-2 overflow-hidden">
                        <div
                            className="bg-blue-500 h-1.5 rounded-full transition-all duration-1000"
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                        />
                    </div>
                    <p className="text-[10px] text-white/40 mb-4">{rendersUsed} of {limit} renders used this month</p>
                    <Link
                        href="/pricing"
                        className="w-full inline-block text-center py-2 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all shadow-lg shadow-blue-600/20"
                    >
                        Upgrade Now
                    </Link>
                </div>
                <UpgradeModal isOpen={isUpgradeOpen} onClose={() => setIsUpgradeOpen(false)} />
            </div>

            {/* User / Logout */}
            <div className="pt-4 border-t border-[var(--border)] px-2 space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-xs text-white/40 truncate">Signed in as</span>
                        <span className="text-sm font-medium truncate">{userEmail}</span>
                    </div>
                    <div className="hidden md:block">
                        <ThemeToggle />
                    </div>
                </div>
                <LogoutButton />
            </div>
        </div>
    )
}


