import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import type { ReactNode } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CodeTyper - Turn Your Code Into Cinematic Videos",
  description: "Transform your code snippets into professional, high-quality typing animations. Perfect for TikTok, YouTube, and LinkedIn content creators.",
  openGraph: {
    title: "CodeTyper - Beautiful Code to Video",
    description: "Convert any code snippet into a cinematic typing animation in 60 seconds.",
    url: "https://codetyper.dev", // Update this when you have a domain
    siteName: "CodeTyper",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CodeTyper Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CodeTyper - Turn Your Code Into Cinematic Videos",
    description: "Transform your code snippets into professional, high-quality typing animations.",
    images: ["/og-image.png"],
    creator: "@iChillyO",
  },
};

import { ThemeProvider } from "@/components/ThemeProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
