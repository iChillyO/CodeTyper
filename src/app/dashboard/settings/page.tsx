import { createClient } from '@/lib/supabase/server'
import { User, Mail, Shield } from 'lucide-react'
import Link from 'next/link'
import { getPlanConfig } from '@/lib/plans'
import ChangePasswordButton from './ChangePasswordButton'

export default async function SettingsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Fetch current plan
    const { data: usage } = await supabase
        .from('usage')
        .select('plan')
        .eq('user_id', user?.id)
        .maybeSingle();

    const planConfig = getPlanConfig(usage?.plan);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
                <p className="text-white/50 text-sm">Manage your account and preferences.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Profile Section */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-white/10 bg-white/[0.02] flex items-center gap-2">
                            <User size={18} className="text-white/40" />
                            <h2 className="font-bold text-sm">Profile Details</h2>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase tracking-wider text-white/30">Email Address</label>
                                    <div className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white/60 cursor-not-allowed">
                                        <Mail size={14} />
                                        {user?.email}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase tracking-wider text-white/30">Password</label>
                                    <ChangePasswordButton email={user?.email || ''} />
                                </div>
                            </div>
                        </div>
                    </div>


                </div>

                {/* Sidebar Stats in Settings - SIMPLIFIED */}
                <div className="space-y-6">
                    <div className="bg-blue-600/10 border border-blue-600/20 rounded-2xl p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Shield size={18} className="text-blue-400" />
                            <h2 className="font-bold text-sm">Account Type</h2>
                        </div>
                        <p className="text-sm text-white/60 mb-2">You are currently in the <span className="text-white font-bold">{planConfig.name}</span> beta.</p>
                        <p className="text-[10px] text-blue-400/60 font-medium italic">Enjoy full premium features for free during our early launch! ❤️</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
