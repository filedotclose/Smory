"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { PixelCard } from "@/components/ui/pixel/PixelCard";
import { cn } from "@/lib/utils";

export function AgeVerificationModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleYes = () => {
    if (!agreedToTerms) {
      setError("You must accept the Terms & Conditions.");
      return;
    }
    
    // Alert reminder as requested
    alert("Reminder: The legal age to smoke in many regions is 21+.");
    
    router.push("/auth");
  };

  const handleNo = () => {
    // Funny redirect as requested
    window.location.href = "https://www.disney.com/";
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "bg-marlboro-red text-paper-white text-2xl font-bold uppercase tracking-widest px-12 py-4",
          "border-[4px] border-ink-black",
          "shadow-[8px_8px_0px_0px_rgba(11,11,15,1)] hover:shadow-[12px_12px_0px_0px_rgba(11,11,15,1)]",
          "hover:-translate-y-1 transition-all active:translate-y-2 active:shadow-none"
        )}
      >
        Enter
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-ink-black/80 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="relative z-10 w-full max-w-md"
            >
              <PixelCard className="p-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-ink-black uppercase tracking-tight mb-4">
                    Age Verification
                  </h2>
                  <p className="text-ash-gray font-bold uppercase tracking-wider text-sm mb-6">
                    You must be of legal smoking age to enter.
                  </p>
                  
                  <div className="bg-marlboro-red/10 border-[2px] border-marlboro-red p-4 mb-6">
                    <p className="text-marlboro-red font-bold uppercase text-xl">
                      Are you 18 or older?
                    </p>
                  </div>

                  <label className="flex items-start gap-3 text-left cursor-pointer group mb-2">
                    <div className="relative pt-1">
                      <input 
                        type="checkbox" 
                        className="peer sr-only"
                        checked={agreedToTerms}
                        onChange={(e) => {
                          setAgreedToTerms(e.target.checked);
                          if (e.target.checked) setError("");
                        }}
                      />
                      <div className="w-6 h-6 bg-paper-white border-[2px] border-ink-black peer-checked:bg-marlboro-red flex items-center justify-center transition-colors shadow-[2px_2px_0px_0px_rgba(11,11,15,1)] group-active:translate-y-0.5 group-active:shadow-none">
                        <svg className="w-4 h-4 text-paper-white opacity-0 peer-checked:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                          <path strokeLinecap="square" strokeLinejoin="miter" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-ink-black flex-1">
                      I have read and agree to the <a href="#" className="text-marlboro-red underline hover:text-ink-black" onClick={(e) => e.stopPropagation()}>Terms & Conditions</a> and <a href="#" className="text-marlboro-red underline hover:text-ink-black" onClick={(e) => e.stopPropagation()}>Privacy Policy</a>.
                    </span>
                  </label>
                  
                  {error && (
                    <motion.p 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="text-marlboro-red text-sm font-bold uppercase text-left mt-2"
                    >
                      {error}
                    </motion.p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 mt-8">
                  <button
                    onClick={handleNo}
                    className={cn(
                      "bg-paper-white text-ink-black font-bold uppercase tracking-widest py-3",
                      "border-[3px] border-ink-black",
                      "shadow-[4px_4px_0px_0px_rgba(11,11,15,1)]",
                      "hover:-translate-y-0.5 transition-all active:translate-y-1 active:shadow-none"
                    )}
                  >
                    No
                  </button>
                  <button
                    onClick={handleYes}
                    className={cn(
                      "bg-ink-black text-paper-white font-bold uppercase tracking-widest py-3",
                      "border-[3px] border-ink-black",
                      "shadow-[4px_4px_0px_0px_rgba(11,11,15,1)]",
                      "hover:-translate-y-0.5 transition-all active:translate-y-1 active:shadow-none"
                    )}
                  >
                    Yes (18+)
                  </button>
                </div>
              </PixelCard>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
