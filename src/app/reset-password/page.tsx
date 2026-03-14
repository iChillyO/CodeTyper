import ResetPasswordForm from './ResetPasswordForm'
import { Suspense } from 'react'

export const metadata = {
    title: 'New Password | CodeTyper',
    description: 'Set a new password for your CodeTyper account.',
}

export default function ResetPasswordPage() {
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
            <ResetPasswordForm />
        </Suspense>
    )
}
