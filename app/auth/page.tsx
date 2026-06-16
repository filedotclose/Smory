import { AuthForm } from "@/components/auth/AuthForm";
import { PixelParticleBackground } from "@/components/ui/pixel/PixelParticleBackground";
import Link from "next/link";

export const metadata = {
  title: "Authenticate | Smory",
};

export default function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-checkered">
      <PixelParticleBackground type="dust" density={100} className="opacity-40" />
      
      {/* Back Button to Welcome */}
      <Link
        href="/welcome"
        className="absolute top-6 left-6 z-20 bg-paper-white text-ink-black hover:bg-marlboro-red hover:text-paper-white w-10 h-10 border-[3px] border-ink-black shadow-[4px_4px_0px_0px_rgba(11,11,15,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center justify-center font-black text-xl select-none"
        title="Back to Welcome"
      >
        &lt;
      </Link>

      <div className="relative z-10 w-full px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-ink-black tracking-tight mb-2 uppercase" style={{ textShadow: "4px 4px 0px rgba(11,11,15,0.2)" }}>Smory</h1>
          <p className="text-marlboro-red text-sm uppercase tracking-widest font-bold">
            Join the anonymous network
          </p>
        </div>

        <AuthForm />
      </div>
    </div>
  );
}

