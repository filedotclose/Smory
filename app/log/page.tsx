import { LogForm } from "@/components/log/LogForm";
import { PixelParticleBackground } from "@/components/ui/pixel/PixelParticleBackground";
import { PlusCircle } from "lucide-react";

export const metadata = {
  title: "Log Entry | Smory",
};

export default function LogPage() {
  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden">
      {/* Heavy smoke effect for the log page to emphasize the smoking context */}
      <PixelParticleBackground type="smoke" density={150} className="fixed inset-0 opacity-40 pointer-events-none z-0 mix-blend-screen" />
      
      <div className="relative z-10 w-full max-w-lg mx-auto">
        <header className="mb-8 text-center flex flex-col items-center">
          <div className="bg-[#4DA6FF] text-[#0B0B0F] p-4 rounded-full border-4 border-[#0B0B0F] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] mb-6">
            <PlusCircle size={40} strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight uppercase" style={{ textShadow: "3px 3px 0px rgba(0,0,0,0.5)" }}>
            New Entry
          </h1>
          <p className="text-[#A1A1AA] text-sm mt-2 uppercase tracking-widest font-bold">Document the moment</p>
        </header>

        <LogForm />
      </div>
    </div>
  );
}
