import { PixelParticleBackground } from "@/components/ui/pixel/PixelParticleBackground";
import { PixelCard } from "@/components/ui/pixel/PixelCard";

export const metadata = {
  title: "Thank You | Smory",
};

export default function ThankYouPage() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-checkered">
      <PixelParticleBackground type="dust" density={100} className="opacity-40" />

      <div className="relative z-10 w-full px-4 max-w-md mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-ink-black tracking-tight mb-2 uppercase" style={{ textShadow: "4px 4px 0px rgba(11,11,15,0.2)" }}>Smory</h1>
          <p className="text-marlboro-red text-sm uppercase tracking-widest font-bold">
            Registration Complete
          </p>
        </div>

        <PixelCard className="w-full p-8 bg-paper-white shadow-[8px_8px_0px_0px_rgba(11,11,15,1)] flex flex-col items-center">
          <div className="w-20 h-20 bg-filter-gold rounded-full flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_rgba(11,11,15,1)] border-[4px] border-ink-black">
            <span className="text-4xl">🔥</span>
          </div>

          <h2 className="text-2xl font-black text-ink-black mb-4 uppercase tracking-tight">
            Thank You!
          </h2>
          
          <p className="text-ink-black font-medium text-sm leading-relaxed">
            You have successfully joined the anonymous network. Please use the same credentials you just created to log in to Smory via the app.
          </p>
        </PixelCard>
      </div>
    </div>
  );
}
