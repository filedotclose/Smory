import { AuthForm } from "@/components/auth/AuthForm";
import { PixelParticleBackground } from "@/components/ui/pixel/PixelParticleBackground";

export const metadata = {
  title: "Authenticate | Smory",
};

export default function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#0B0B0F]">
      <PixelParticleBackground type="stars" density={100} className="opacity-50" />
      
      <div className="relative z-10 w-full px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white tracking-tight mb-2 uppercase" style={{ textShadow: "4px 4px 0px rgba(0,0,0,0.5)" }}>The Ash Tray</h1>
          <p className="text-[#A1A1AA] text-sm uppercase tracking-widest font-bold">
            Join the anonymous network
          </p>
        </div>

        <AuthForm />
      </div>
    </div>
  );
}
