import Link from "next/link";
import { Terminal } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ThemeToggle } from "./ThemeToggle";

interface NavbarProps {
    isCreatePage?: boolean;
}

export async function Navbar({ isCreatePage = false }: NavbarProps) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-10 py-5 bg-[var(--background)]/50 backdrop-blur-xl border-b border-[var(--border)]">
            <Link href="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-lg bg-electric-blue/10 border border-electric-blue/30 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.1)] group-hover:border-electric-blue/50 transition-all">
                    <Terminal className="w-5 h-5 text-electric-blue" />
                </div>
                <span className="text-2xl font-black tracking-tighter text-white">
                    Code<span className="text-electric-blue">Typer</span>
                </span>
            </Link>

            <div className="flex items-center gap-10">
                <div className="hidden md:block">
                    <ThemeToggle />
                </div>
                <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-400">
                    <Link href="/#features" className="hover:text-white transition-colors">Features</Link>
                    <Link href="/#pricing" className="hover:text-white transition-colors">Pricing</Link>

                    {!user ? (
                        <>
                            <Link href="/login" className="hover:text-white transition-colors">Login</Link>
                            <Link href="/signup" className="hover:text-white transition-colors">Sign Up</Link>
                        </>
                    ) : (
                        <>
                            <Link href="/dashboard" className="px-4 py-2 rounded-lg bg-electric-blue/20 text-electric-blue hover:bg-electric-blue/30 transition-colors border border-electric-blue/30">
                                Dashboard
                            </Link>
                        </>
                    )}
                </div>

                {!isCreatePage && (
                    <Link href={user ? "/create" : "/login"}>
                        <button className="px-4 text-[11px] sm:px-6 py-2 sm:py-2.5 rounded-lg btn-primary sm:text-sm font-black tracking-tight whitespace-nowrap">
                            Generate Video
                        </button>
                    </Link>
                )}
            </div>
        </nav>
    );
}
