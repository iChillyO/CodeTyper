# 🎬 CodeTyper

**CodeTyper** is a premium web application that transforms your code snippets into cinematic, high-quality videos—perfect for sharing on social media, tutorials, or documentation.

![Project Preview](https://github.com/iChillyO/CodeTyper/blob/main/public/og-image.png?raw=true)

## ✨ Features

- **Cinematic Typing Animation**: Intelligent typing logic that pauses for symbols and newlines to mimic human behavior.
- **Multiple Themes**: Modern coding themes (Original, VSCode, Dracula, Midnight, and more).
- **Format Flexibility**: Support for Vertical (9:16) for TikTok/Reels and Landscape for YouTube/Twitter.
- **AI-Powered Titles**: Automatic video title generation based on your code using Gemini AI.
- **Themed Dashboard**: Full history and render management with a custom, premium UI.
- **High-Resolution Rendering**: Powered by Remotion for frame-perfect MP4 output.

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS (Deployed on Vercel).
- **Video Engine**: [Remotion](https://www.remotion.dev/) serverless rendering on AWS Lambda.
- **Backend/Storage**: Supabase (Authentication, PostgreSQL, and Bucket Storage).
- **AI Engine**: Google Gemini for auto-titling.
- **Styling**: Lucide Icons & Framer Motion for premium interactions.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- A Supabase project
- A Google AI (Gemini) API key

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/iChillyO/CodeTyper.git
   cd CodeTyper
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env.local` file in the root directory and add:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   GEMINI_API_KEY=your_gemini_key
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

## 🎥 Rendering Engine

To ensure high availability and scalability, the rendering engine is deployed serverless on AWS Lambda using `@remotion/lambda`. When a user requests a render, the application:
1. Triggers the AWS Lambda function with the React composition props.
2. The Lambda runner bundles the composition utilizing `rspack`.
3. Calculates exact duration based on typing speed and code length.
4. Renders the frames in parallel into a high-quality `.mp4`.
5. Uploads the final video directly to Supabase Storage for immediate download.

## 📄 License

This project is for personal use and demonstration. For commercial use or redistribution, please check the license details.

---
Crafted with ❤️ by [iChillyO](https://github.com/iChillyO)
