import { Navbar } from "@/components/Navbar";
import CreateClient from "./CreateClient";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function CreatePage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    return (
        <main className="min-h-screen bg-[#020617] text-slate-200">
            <Navbar isCreatePage={true} />
            <CreateClient />
        </main>
    );
}
