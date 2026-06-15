"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { PixelCard } from "@/components/ui/pixel/PixelCard";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Link from "next/link";
import { X, ShieldAlert } from "lucide-react";

interface AgeVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AgeVerificationModal({ isOpen, onClose }: AgeVerificationModalProps) {
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleYes = () => {
    if (!agreedToTerms) {
      setError("You must accept the Terms & Conditions and Privacy Policy.");
      return;
    }
    
    // Custom styled warning toast
    toast.warning("Warning: Tobacco is highly addictive. The legal age to purchase tobacco is 21+ in many regions (18+ in India). Please consume responsibly.", {
      duration: 5000,
      className: "border-[3px] border-ink-black shadow-[4px_4px_0px_0px_rgba(11,11,15,1)] rounded-none font-bold text-ink-black bg-paper-white"
    });
    
    // Save verification state in localStorage
    localStorage.setItem("smory_age_verified", "true");
    
    router.push("/auth");
  };

  const handleNo = () => {
    // Redirect to Disney as a joke
    window.location.href = "https://www.disney.com/";
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-ink-black/80 backdrop-blur-sm pointer-events-auto"
            onClick={onClose}
          />
          
          {/* Modal content */}
          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="relative z-10 w-full max-w-md pointer-events-auto"
          >
            <PixelCard className="p-6 md:p-8 bg-paper-white border-[4px] border-ink-black shadow-[8px_8px_0px_0px_rgba(11,11,15,1)]">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 bg-paper-white text-ink-black hover:bg-marlboro-red hover:text-paper-white p-1.5 border-[2px] border-ink-black transition-colors"
              >
                <X size={16} />
              </button>

              <div className="text-center mb-6 mt-2">
                <div className="inline-block bg-marlboro-red/10 text-marlboro-red p-3 border-[2px] border-marlboro-red mb-4">
                  <ShieldAlert size={32} />
                </div>
                
                <h2 className="text-3xl font-bold text-ink-black uppercase tracking-tight mb-2">
                  Age Verification
                </h2>
                <p className="text-ash-gray font-bold uppercase tracking-wider text-xs mb-6">
                  Access is restricted to adult users
                </p>
                
                <div className="bg-marlboro-red/10 border-[2px] border-marlboro-red p-4 mb-6">
                  <p className="text-marlboro-red font-bold uppercase text-lg">
                    Are you 18 years of age or older?
                  </p>
                </div>

                {/* Consent Checkbox */}
                <label className="flex items-start gap-3 text-left cursor-pointer group mb-2">
                  <div className="relative pt-1 select-none">
                    <input 
                      type="checkbox" 
                      className="peer sr-only"
                      checked={agreedToTerms}
                      onChange={(e) => {
                        setAgreedToTerms(e.target.checked);
                        if (e.target.checked) setError("");
                      }}
                    />
                    <div className="w-6 h-6 bg-paper-white border-[3px] border-ink-black peer-checked:bg-marlboro-red flex items-center justify-center transition-colors shadow-[2px_2px_0px_0px_rgba(11,11,15,1)] group-active:translate-y-0.5 group-active:shadow-none">
                      <svg className="w-4 h-4 text-paper-white opacity-0 peer-checked:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                        <path strokeLinecap="square" strokeLinejoin="miter" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-ink-black flex-1 leading-normal select-none">
                    I acknowledge that I am of legal age to view tobacco-related content and I agree to the{" "}
                    <Link href="/terms" className="text-marlboro-red underline hover:text-ink-black" onClick={(e) => e.stopPropagation()}>
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-marlboro-red underline hover:text-ink-black" onClick={(e) => e.stopPropagation()}>
                      Privacy Policy
                    </Link>{" "}
                    which are compliant with the Indian Information Technology Act.
                  </span>
                </label>
                
                {error && (
                  <motion.p 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="text-marlboro-red text-xs font-bold uppercase text-left mt-3 border-l-2 border-marlboro-red pl-2"
                  >
                    {error}
                  </motion.p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <button
                  onClick={handleNo}
                  className={cn(
                    "bg-paper-white text-ink-black font-bold uppercase tracking-widest py-3 text-sm cursor-pointer",
                    "border-[3px] border-ink-black",
                    "shadow-[4px_4px_0px_0px_rgba(11,11,15,1)]",
                    "hover:-translate-y-0.5 transition-all active:translate-y-1 active:shadow-none"
                  )}
                >
                  No, I am under 18
                </button>
                <button
                  onClick={handleYes}
                  className={cn(
                    "bg-ink-black text-paper-white font-bold uppercase tracking-widest py-3 text-sm cursor-pointer",
                    "border-[3px] border-ink-black",
                    "shadow-[4px_4px_0px_0px_rgba(11,11,15,1)]",
                    "hover:-translate-y-0.5 transition-all active:translate-y-1 active:shadow-none"
                  )}
                >
                  Yes, I am 18+
                </button>
              </div>
            </PixelCard>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
