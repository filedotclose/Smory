"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PixelCard } from "@/components/ui/pixel/PixelCard";

export function InstallPwaModal() {
  const [isMobile, setIsMobile] = useState(false);
  const [isStandalone, setIsStandalone] = useState(true); // Default true to avoid flash
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [os, setOs] = useState<"ios" | "android" | "other">("other");

  useEffect(() => {
    // Check if app is already installed / standalone
    const isStandaloneMode = 
      window.matchMedia("(display-mode: standalone)").matches || 
      (window.navigator as any).standalone || 
      document.referrer.includes("android-app://");
    
    setIsStandalone(isStandaloneMode);

    // Detect OS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isAndroid = /android/.test(userAgent);
    
    if (isIOS) setOs("ios");
    else if (isAndroid) setOs("android");
    
    if (isIOS || isAndroid) setIsMobile(true);

    // Listen for the native Android install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // We don't trigger setShowModal(true) here anymore, we let the timer handle it below
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // For iOS and Android, show modal if not standalone
    if ((isIOS || isAndroid) && !isStandaloneMode) {
      const dismissed = localStorage.getItem("smory_pwa_dismissed");
      // Ignore 24h cooldown if we are in development mode for easy testing
      const isDev = process.env.NODE_ENV === "development";
      if (isDev || !dismissed || Date.now() - parseInt(dismissed) > 1000 * 60 * 60 * 12) {
        // Small delay so it doesn't pop up instantly on load
        const timer = setTimeout(() => setShowModal(true), 2500);
        return () => clearTimeout(timer);
      }
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setDeferredPrompt(null);
        setShowModal(false);
      }
    }
  };

  const handleDismiss = () => {
    setShowModal(false);
    localStorage.setItem("smory_pwa_dismissed", Date.now().toString());
  };

  if (!showModal) return null;

  return (
    <AnimatePresence>
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-ink-black/80"
          onClick={handleDismiss}
        >
          <motion.div
            initial={{ scale: 0.9, y: 50, rotate: -2 }}
            animate={{ scale: 1, y: 0, rotate: 0 }}
            exit={{ scale: 0.9, y: 50, opacity: 0 }}
            transition={{ type: "spring", bounce: 0.5 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm"
          >
            <PixelCard className="bg-paper-white border-[4px] border-ink-black shadow-[12px_12px_0px_0px_rgba(11,11,15,1)] p-6 relative overflow-hidden">
              {/* Fun Decorative Elements */}
              <div className="absolute -top-4 -right-4 text-6xl animate-bounce" style={{ animationDuration: "2s" }}>✨</div>
              <div className="absolute -bottom-2 -left-2 text-5xl opacity-50 rotate-12">📱</div>

              <div className="relative z-10 text-center">
                <div className="w-20 h-20 bg-marlboro-red mx-auto border-[3px] border-ink-black shadow-[4px_4px_0px_0px_rgba(11,11,15,1)] flex items-center justify-center mb-6 -mt-10 rotate-3">
                  <span className="text-4xl">🚬</span>
                </div>
                
                <h2 className="text-2xl font-black text-ink-black uppercase tracking-tight mb-2">
                  Get the App!
                </h2>
                
                <p className="text-ink-black font-medium text-sm leading-relaxed mb-6">
                  Smory was <strong className="text-marlboro-red">made to be used</strong> as a native app! Add it to your homescreen for the best experience (no browser bars, faster loading).
                </p>

                {os === "ios" ? (
                  <div className="bg-filter-gold/30 border-[3px] border-ink-black p-4 text-left shadow-[4px_4px_0px_0px_rgba(11,11,15,1)] mb-6">
                    <p className="text-ink-black text-sm font-bold mb-2">How to install on iOS:</p>
                    <ol className="text-ink-black text-xs space-y-2 font-medium">
                      <li>1. Tap the <span className="inline-block bg-white border border-ink-black px-1 rounded">Share</span> button at the bottom of your screen.</li>
                      <li>2. Scroll down and tap <strong className="text-marlboro-red">"Add to Home Screen"</strong> ➕</li>
                    </ol>
                  </div>
                ) : deferredPrompt ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleInstallClick}
                    className="w-full bg-marlboro-red text-paper-white font-black p-4 uppercase tracking-widest shadow-[6px_6px_0px_0px_rgba(11,11,15,1)] border-[3px] border-ink-black mb-4 active:shadow-none active:translate-y-[6px] active:translate-x-[6px] transition-all"
                  >
                    Install Smory
                  </motion.button>
                ) : (
                  <div className="bg-filter-gold/30 border-[3px] border-ink-black p-4 text-left shadow-[4px_4px_0px_0px_rgba(11,11,15,1)] mb-6">
                    <p className="text-ink-black text-sm font-bold mb-2">How to install on Android:</p>
                    <ol className="text-ink-black text-xs space-y-2 font-medium">
                      <li>1. Tap the <span className="inline-block font-bold">Menu (⋮)</span> button.</li>
                      <li>2. Tap <strong className="text-marlboro-red">"Install app"</strong> or "Add to Home screen".</li>
                    </ol>
                  </div>
                )}

                <button
                  onClick={handleDismiss}
                  className="text-xs text-ash-gray font-bold uppercase tracking-widest hover:text-ink-black transition-colors"
                >
                  Maybe later
                </button>
              </div>
            </PixelCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
