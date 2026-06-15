"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PixelCard } from "@/components/ui/pixel/PixelCard";
import { toast } from "sonner";
import { Flame, Activity, Coffee, Moon, CloudRain, Briefcase, Camera, Image as ImageIcon } from "lucide-react";
import confetti from "canvas-confetti";

// A fun pixelated confetti burst (using Marlboro Red)
const triggerPixelBurst = () => {
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
  const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

  const interval: any = setInterval(function() {
    const timeLeft = 1000 - Date.now() + performance.now(); // run for 1 sec
    if (timeLeft <= 0) {
      return clearInterval(interval);
    }
    const particleCount = 50 * (timeLeft / 1000);
    confetti({
      ...defaults,
      particleCount, 
      origin: { x: randomInRange(0.1, 0.9), y: Math.random() - 0.2 },
      colors: ['#E11D48', '#EAB308', '#0B0B0F'], // Red, Gold, Black
      shapes: ['square'], // pixel look
      scalar: 1.5
    });
  }, 250);
};

const BRANDS = ["Marlboro Red", "Marlboro Gold", "Camel Crush", "American Spirit", "Newport", "Other"];

export function LogForm() {
  const [step, setStep] = useState(1);
  
  // Step 1 State
  const [brand, setBrand] = useState<string | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Step 2 State
  const [trigger, setTrigger] = useState<string | null>(null);
  
  // Step 3 State
  const [intensity, setIntensity] = useState(3);

  const triggers = [
    { id: "stress", label: "Stress", icon: Activity },
    { id: "habit", label: "Habit", icon: Coffee },
    { id: "social", label: "Social", icon: Flame },
    { id: "boredom", label: "Boredom", icon: Moon },
    { id: "weather", label: "Weather", icon: CloudRain },
    { id: "work", label: "Work", icon: Briefcase },
  ];

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);
  
  const handleSubmit = () => {
    // Optimistic UX
    triggerPixelBurst();
    toast.success(`Log recorded: ${brand}. 1 day streak! 🔥`, {
      className: "border-[3px] border-ink-black shadow-[4px_4px_0px_0px_rgba(11,11,15,1)] rounded-none font-bold text-ink-black"
    });
    // Reset form after delay
    setTimeout(() => {
      setStep(1);
      setBrand(null);
      setPhoto(null);
      setTrigger(null);
      setIntensity(3);
    }, 2000);
  };

  return (
    <PixelCard className="w-full max-w-lg mx-auto bg-paper-white p-6 sm:p-8 border-[3px] border-ink-black shadow-[8px_8px_0px_0px_rgba(11,11,15,1)]">
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex flex-col gap-6"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold text-ink-black mb-1 uppercase tracking-tight">The Smoke</h2>
              <p className="text-ash-gray text-xs font-bold uppercase tracking-widest">Brand & Evidence</p>
            </div>

            <div className="flex flex-col gap-4">
              <label className="text-xs text-ink-black font-bold uppercase tracking-widest">Select Brand</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {BRANDS.map(b => (
                  <button
                    key={b}
                    onClick={() => setBrand(b)}
                    className={`p-3 text-[10px] font-bold uppercase tracking-widest border-[3px] transition-all ${
                      brand === b 
                        ? "bg-marlboro-red text-paper-white border-ink-black shadow-[2px_2px_0px_0px_rgba(11,11,15,1)]" 
                        : "bg-paper-white text-ink-black border-ink-black/20 hover:border-ink-black"
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-2">
              <label className="text-xs text-ink-black font-bold uppercase tracking-widest">Upload Photo</label>
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                ref={fileInputRef} 
                onChange={handlePhotoUpload}
              />
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`border-[3px] border-dashed transition-colors flex flex-col items-center justify-center p-6 cursor-pointer ${
                  photo ? "border-ink-black bg-paper-white p-2" : "border-ink-black/30 bg-paper-white hover:border-marlboro-red hover:bg-marlboro-red/5"
                }`}
              >
                {photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={photo} alt="Uploaded cigarette" className="max-h-48 object-contain border-[3px] border-ink-black shadow-[4px_4px_0px_0px_rgba(11,11,15,1)]" />
                ) : (
                  <>
                    <Camera size={32} className="text-ash-gray mb-2" />
                    <span className="text-xs font-bold uppercase tracking-widest text-ash-gray">Tap to snap</span>
                  </>
                )}
              </div>
            </div>

            <button
              disabled={!brand}
              onClick={handleNext}
              className={`w-full py-4 font-bold uppercase tracking-widest transition-all border-[3px] border-ink-black shadow-[4px_4px_0px_0px_rgba(11,11,15,1)] mt-4 ${
                brand 
                  ? "bg-filter-gold text-ink-black hover:bg-filter-gold/90 active:translate-y-1 active:shadow-none" 
                  : "bg-paper-white text-ash-gray border-dashed cursor-not-allowed shadow-none"
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
              <h2 className="text-2xl font-bold text-ink-black mb-2 uppercase tracking-tight">The Trigger</h2>
              <p className="text-ash-gray text-xs font-bold uppercase tracking-widest">Identify the craving</p>
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
                    className={`flex flex-col items-center justify-center gap-3 p-4 border-[3px] transition-all shadow-[4px_4px_0px_0px_rgba(11,11,15,1)] ${
                      isSelected 
                        ? "bg-marlboro-red border-ink-black text-paper-white" 
                        : "bg-paper-white border-ink-black text-ink-black hover:border-marlboro-red"
                    }`}
                  >
                    <Icon size={32} strokeWidth={isSelected ? 2.5 : 2} />
                    <span className="text-xs font-bold uppercase tracking-widest">
                      {t.label}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleBack}
                className="w-1/3 py-4 bg-paper-white text-ink-black font-bold uppercase tracking-widest border-[3px] border-ink-black shadow-[4px_4px_0px_0px_rgba(11,11,15,1)] hover:bg-ash-gray/10 active:translate-y-1 active:shadow-none transition-all"
              >
                Back
              </button>
              <button
                disabled={!trigger}
                onClick={handleNext}
                className={`w-2/3 py-4 font-bold uppercase tracking-widest transition-all border-[3px] border-ink-black shadow-[4px_4px_0px_0px_rgba(11,11,15,1)] ${
                  trigger 
                    ? "bg-filter-gold text-ink-black active:translate-y-1 active:shadow-none" 
                    : "bg-paper-white text-ash-gray border-dashed cursor-not-allowed shadow-none"
                }`}
              >
                Continue
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col gap-8"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold text-ink-black mb-2 uppercase tracking-tight">The Intensity</h2>
              <p className="text-ash-gray text-xs font-bold uppercase tracking-widest">Rate the craving</p>
            </div>

            <div className="flex flex-col items-center gap-8 py-8">
              <div className="text-6xl font-bold text-ink-black" style={{ textShadow: "4px 4px 0px rgba(225,29,72,0.5)" }}>
                {intensity}
              </div>
              
              <input 
                type="range" 
                min="1" 
                max="5" 
                value={intensity}
                onChange={(e) => setIntensity(Number(e.target.value))}
                className="w-full accent-marlboro-red h-3 bg-ink-black/10 rounded-none appearance-none outline-none border-[2px] border-ink-black"
              />
              
              <div className="flex justify-between w-full text-ink-black text-xs font-bold uppercase tracking-widest">
                <span>Mild</span>
                <span>Severe</span>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleBack}
                className="w-1/3 py-4 bg-paper-white text-ink-black font-bold uppercase tracking-widest border-[3px] border-ink-black shadow-[4px_4px_0px_0px_rgba(11,11,15,1)] hover:bg-ash-gray/10 active:translate-y-1 active:shadow-none transition-all"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                className="w-2/3 py-4 bg-marlboro-red text-paper-white font-bold uppercase tracking-widest border-[3px] border-ink-black shadow-[4px_4px_0px_0px_rgba(11,11,15,1)] hover:bg-marlboro-red/90 active:translate-y-1 active:shadow-none transition-all"
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
