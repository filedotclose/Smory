import { AuthForm } from "@/components/auth/AuthForm";
import { PixelParticleBackground } from "@/components/ui/pixel/PixelParticleBackground";

export const metadata = {
  title: "Authenticate | Smory",
};

export default function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-checkered">
      <PixelParticleBackground type="dust" density={100} className="opacity-40" />
      
      <div className="relative z-10 w-full px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-ink-black tracking-tight mb-2 uppercase" style={{ textShadow: "4px 4px 0px rgba(11,11,15,0.2)" }}>The Ash Tray</h1>
          <p className="text-marlboro-red text-sm uppercase tracking-widest font-bold">
            Join the anonymous network
          </p>
        </div>

        <AuthForm />
      </div>
    </div>
  );
}
