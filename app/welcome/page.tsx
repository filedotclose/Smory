import { PixelParticleBackground } from "@/components/ui/pixel/PixelParticleBackground";
import { AgeVerificationModal } from "@/components/auth/AgeVerificationModal";

export const metadata = {
  title: "Welcome | Smory",
};

export default function WelcomePage() {
  return (
    <div className="fixed inset-0 z-[100] bg-paper-white flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0 bg-checkered opacity-50 mix-blend-multiply" />
      <PixelParticleBackground type="dust" density={100} className="opacity-40" />
      
      <div className="relative z-10 w-full max-w-md px-4 flex flex-col items-center">
        <div className="text-center mb-12">
          <h1 
            className="text-5xl md:text-7xl font-bold text-ink-black tracking-tight mb-4 uppercase" 
            style={{ textShadow: "6px 6px 0px rgba(11,11,15,0.2)" }}
          >
            The Ash Tray
          </h1>
          <p className="text-marlboro-red text-lg md:text-xl uppercase tracking-widest font-bold bg-paper-white inline-block px-4 py-1 border-[2px] border-ink-black shadow-[4px_4px_0px_0px_rgba(11,11,15,1)]">
            Every cigarette has a story
          </p>
        </div>

        <AgeVerificationModal />
      </div>
    </div>
  );
}
