import { LogForm } from "@/components/log/LogForm";
import { PixelParticleBackground } from "@/components/ui/pixel/PixelParticleBackground";
import { PlusCircle } from "lucide-react";

export const metadata = {
  title: "Log Entry | Smory",
};

export default function LogPage() {
  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden bg-checkered">
      <PixelParticleBackground type="smoke" density={100} className="fixed inset-0 opacity-20 pointer-events-none z-0" />
      
      <div className="relative z-10 w-full max-w-lg mx-auto pb-24">
        <header className="mb-8 text-center flex flex-col items-center">
          <div className="bg-marlboro-red text-paper-white p-4 rounded-full border-[3px] border-ink-black shadow-[4px_4px_0px_0px_rgba(11,11,15,1)] mb-6">
            <PlusCircle size={40} strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-bold text-ink-black tracking-tight uppercase" style={{ textShadow: "3px 3px 0px rgba(11,11,15,0.1)" }}>
            New Entry
          </h1>
          <p className="text-ash-gray text-xs mt-2 uppercase tracking-widest font-bold">Document the moment</p>
        </header>

        <LogForm />
      </div>
    </div>
  );
}
