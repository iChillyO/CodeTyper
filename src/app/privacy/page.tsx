"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
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
                    <h1>Privacy Policy for CodeTyper</h1>
                    <p className="text-slate-400 font-medium">Last Updated: {today}</p>

                    <h2>1. What We Collect</h2>
                    <p>
                        We collect your email address when you create an account. We also temporarily process the code snippets you paste into our app to generate your video.
                    </p>

                    <h2>2. How We Use Your Data</h2>
                    <p>
                        We use your email to manage your account and send important updates. We use your code snippets exclusively to render your typing animation videos. We do not use your code to train AI models.
                    </p>

                    <h2>3. Third-Party Services</h2>
                    <p>
                        We use trusted third-party services to run our app, including Vercel (hosting) and our payment processor (e.g., Stripe). These services only access the data necessary to perform their functions.
                    </p>

                    <h2>4. Data Sharing</h2>
                    <p>
                        We never sell your personal data or code to third parties.
                    </p>

                    <h2>5. Your Rights</h2>
                    <p>
                        You can delete your account and all associated data at any time from your account dashboard, or by contacting us.
                    </p>
                </article>
            </div>
        </main>
    );
}
