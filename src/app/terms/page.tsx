"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
    const today = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <main className="min-h-screen bg-background">
            <div className="max-w-3xl mx-auto py-16 px-4">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-12 group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </Link>

                <article className="prose prose-invert prose-slate max-w-none">
                    <h1>Terms of Service for CodeTyper</h1>
                    <p className="text-slate-400 font-medium">Last Updated: {today}</p>

                    <h2>1. Acceptance of Terms</h2>
                    <p>
                        By using CodeTyper, you agree to these terms. If you disagree, please do not use the service.
                    </p>

                    <h2>2. The Service</h2>
                    <p>
                        CodeTyper allows users to convert code snippets into animated videos. We reserve the right to modify or discontinue the service at any time.
                    </p>

                    <h2>3. Ownership & Copyright</h2>
                    <p>
                        You retain full ownership of the code you paste into our app and the final exported videos you generate. We retain all rights to the CodeTyper software, branding, and animation engine.
                    </p>

                    <h2>4. Refunds</h2>
                    <p>
                        Because rendering video requires heavy, unrecoverable server compute costs, we do not offer refunds once a video has been successfully exported using Pro or Creator credits.
                    </p>

                    <h2>5. Prohibited Conduct</h2>
                    <p>
                        You agree not to abuse the API, attempt to reverse-engineer the rendering engine, or generate videos containing illegal or highly explicit content. We reserve the right to ban accounts that violate these rules.
                    </p>

                    <h2>6. Liability</h2>
                    <p>
                        CodeTyper is provided "as is". We are not liable for any damages or lost profits resulting from the use or inability to use our service.
                    </p>
                </article>
            </div>
        </main>
    );
}
