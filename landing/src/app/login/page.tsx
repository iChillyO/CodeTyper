import LoginForm from './LoginForm'
import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export const metadata = {
    title: 'Sign In | CodeTyper',
    description: 'Login to your CodeTyper account to continue generating cinematic code videos.',
}

export default async function LoginPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
        redirect('/dashboard')
    }

    return (
        <Suspense fallback={
            <div className="min-h-screen w-full flex items-center justify-center bg-[#0A0A0B]">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-12 h-12 bg-white/10 rounded-xl mb-4" />
                    <div className="w-48 h-4 bg-white/10 rounded-full mb-2" />
                    <div className="w-32 h-3 bg-white/5 rounded-full" />
                </div>
            </div>
        }>
            <LoginForm />
        </Suspense>
    )
}
