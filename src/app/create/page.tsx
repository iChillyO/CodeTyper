import { Suspense } from "react";
import { Navbar } from "@/components/Navbar";
import CreateClient from "./CreateClient";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function CreatePage() {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    const user = data?.user;

    if (!user) {
        redirect("/login");
    }

    return (
        <main className="min-h-screen bg-[#020617] text-slate-200">
            <Navbar isCreatePage={true} />
            <Suspense fallback={<div className="flex items-center justify-center p-12"><div className="w-8 h-8 border-4 border-blue-600/10 border-t-blue-600 rounded-full animate-spin" /></div>}>
                <CreateClient />
            </Suspense>
        </main>
    );
}
