"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PixelCard } from "@/components/ui/pixel/PixelCard";
import { toast } from "sonner";
import { Flame, Activity, Coffee, Moon, CloudRain, Briefcase } from "lucide-react";
import confetti from "canvas-confetti";

// A fun pixelated confetti burst
const triggerPixelBurst = () => {
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
  const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

  const interval: any = setInterval(function() {
    const timeLeft = 1000 - Date.now() + performance.now(); // run for 1 sec
    if (timeLeft <= 0) {
      return clearInterval(interval);
    }
    const particleCount = 50 * (timeLeft / 1000);
    confetti(Object.assign({}, defaults, { 
      particleCount, 
      origin: { x: randomInRange(0.1, 0.9), y: Math.random() - 0.2 },
      colors: ['#4DA6FF', '#1D1D24', '#FFFFFF'],
      shapes: ['square'], // pixel look
      scalar: 1.5
    }));
  }, 250);
};

export function LogForm() {
  const [step, setStep] = useState(1);
  const [intensity, setIntensity] = useState(3);
  const [trigger, setTrigger] = useState<string | null>(null);

  const triggers = [
    { id: "stress", label: "Stress", icon: Activity, color: "#EC4899" },
    { id: "habit", label: "Habit", icon: Coffee, color: "#EAB308" },
    { id: "social", label: "Social", icon: Flame, color: "#F97316" },
    { id: "boredom", label: "Boredom", icon: Moon, color: "#A855F7" },
    { id: "weather", label: "Weather", icon: CloudRain, color: "#4DA6FF" },
    { id: "work", label: "Work", icon: Briefcase, color: "#22C55E" },
  ];

  const handleNext = () => setStep(2);
  
  const handleSubmit = () => {
    // Optimistic UX
    triggerPixelBurst();
    toast.success("Log recorded. 1 day streak! 🔥", {
      className: "border-2 border-[#0B0B0F] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] rounded-none font-bold"
    });
    // In a real app we'd trigger a Server Action here
    setTimeout(() => {
      setStep(1);
      setTrigger(null);
      setIntensity(3);
    }, 2000);
  };

  return (
    <PixelCard className="w-full max-w-lg mx-auto bg-[#1D1D24] p-6 sm:p-8">
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex flex-col gap-8"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2 uppercase tracking-tight">What triggered it?</h2>
              <p className="text-[#A1A1AA] text-sm font-bold uppercase tracking-widest">Identify the craving</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {triggers.map((t) => {
                const isSelected = trigger === t.id;
                const Icon = t.icon;
                return (
                  <motion.button
                    key={t.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setTrigger(t.id)}
                    className={`flex flex-col items-center justify-center gap-3 p-4 border-[3px] transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] ${
                      isSelected 
                        ? "bg-[#16161C] border-white scale-[1.02]" 
                        : "bg-[#1D1D24] border-[#2D2D36] hover:border-[#A1A1AA]"
                    }`}
                  >
                    <Icon size={32} color={isSelected ? t.color : "#A1A1AA"} strokeWidth={isSelected ? 2.5 : 2} />
                    <span className={`text-xs font-bold uppercase tracking-widest ${isSelected ? "text-white" : "text-[#A1A1AA]"}`}>
                      {t.label}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            <button
              disabled={!trigger}
              onClick={handleNext}
              className={`w-full py-4 font-bold uppercase tracking-widest transition-all border-[3px] border-[#0B0B0F] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] ${
                trigger 
                  ? "bg-[#4DA6FF] text-[#0B0B0F] hover:bg-[#3b82f6] active:translate-y-1 active:shadow-none" 
                  : "bg-[#2D2D36] text-[#A1A1AA] cursor-not-allowed"
              }`}
            >
              Continue
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col gap-8"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2 uppercase tracking-tight">How intense was it?</h2>
              <p className="text-[#A1A1AA] text-sm font-bold uppercase tracking-widest">Rate the craving</p>
            </div>

            <div className="flex flex-col items-center gap-8 py-8">
              <div className="text-6xl font-bold" style={{ color: `hsl(${120 - intensity * 20}, 80%, 60%)`, textShadow: "4px 4px 0px rgba(0,0,0,0.5)" }}>
                {intensity}
              </div>
              
              <input 
                type="range" 
                min="1" 
                max="5" 
                value={intensity}
                onChange={(e) => setIntensity(Number(e.target.value))}
                className="w-full accent-[#4DA6FF] h-3 bg-[#2D2D36] rounded-none appearance-none outline-none"
              />
              
              <div className="flex justify-between w-full text-[#A1A1AA] text-xs font-bold uppercase tracking-widest">
                <span>Mild</span>
                <span>Severe</span>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep(1)}
                className="w-1/3 py-4 bg-[#2D2D36] text-white font-bold uppercase tracking-widest border-[3px] border-[#0B0B0F] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] hover:bg-[#3D3D46] active:translate-y-1 active:shadow-none transition-all"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                className="w-2/3 py-4 bg-[#4DA6FF] text-[#0B0B0F] font-bold uppercase tracking-widest border-[3px] border-[#0B0B0F] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] hover:bg-[#3b82f6] active:translate-y-1 active:shadow-none transition-all"
              >
                Log It
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </PixelCard>
  );
}
