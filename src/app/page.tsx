import { Navbar } from "@/components/Navbar";
import LandingClient from "./LandingClient";

export default function LandingPage() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-grid-subtle pb-24 md:pb-0">
      <Navbar />
      <LandingClient />
    </main>
  );
}
