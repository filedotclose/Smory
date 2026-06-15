"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";

interface FlickLighterCTAProps {
  onIgnite: () => void;
}

/**
 * FlickLighterCTA
 *
 * A pixel-art lighter that the user drags upward on the flint wheel to "ignite."
 * When the flick threshold is reached, a flame burst animation plays and the
 * onIgnite callback fires (opening the age verification modal).
 */
export function FlickLighterCTA({ onIgnite }: FlickLighterCTAProps) {
  const [isLit, setIsLit] = useState(false);
  const [sparks, setSparks] = useState<{ id: number; x: number; y: number }[]>([]);
  const [hint, setHint] = useState(true);
  const sparkId = useRef(0);
  const flickY = useMotionValue(0);
  const flickProgress = useTransform(flickY, [0, -40], [0, 1]);

  const handleFlick = useCallback(() => {
    if (isLit) return;

    // Spawn sparks
    const newSparks = Array.from({ length: 6 }, () => ({
      id: sparkId.current++,
      x: (Math.random() - 0.5) * 20,
      y: -Math.random() * 15,
    }));
    setSparks(newSparks);

    setIsLit(true);
    setHint(false);

    // Fire callback after flame animation
    setTimeout(() => {
      onIgnite();
    }, 800);

    // Clean up sparks
    setTimeout(() => setSparks([]), 500);
  }, [isLit, onIgnite]);

  return (
    <div className="flex flex-col items-center gap-4">
      {/* ── Lighter Body ──────────────────────── */}
      <div className="relative select-none">
        {/* Flame */}
        <AnimatePresence>
          {isLit && (
            <motion.div
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{
                scaleY: [0, 1.2, 1, 1.3, 1],
                opacity: [0, 1, 0.9, 1, 0.8],
              }}
              exit={{ scaleY: 0, opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="absolute -top-12 left-1/2 -translate-x-1/2 origin-bottom"
            >
              {/* Outer flame */}
              <div
                className="w-6 h-10 rounded-full"
                style={{
                  background:
                    "radial-gradient(ellipse at bottom, #EAB308 0%, #E11D48 50%, transparent 100%)",
                  filter: "blur(1px)",
                  animation: "flicker 0.15s infinite alternate",
                }}
              />
              {/* Inner flame */}
              <div
                className="absolute bottom-1 left-1/2 -translate-x-1/2 w-3 h-5 rounded-full"
                style={{
                  background:
                    "radial-gradient(ellipse at bottom, #FDE68A 0%, #EAB308 70%, transparent 100%)",
                }}
              />
              {/* Glow */}
              <div
                className="absolute -top-4 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full"
                style={{
                  background: "radial-gradient(circle, rgba(234,179,8,0.25) 0%, transparent 70%)",
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sparks */}
        <AnimatePresence>
          {sparks.map((spark) => (
            <motion.div
              key={spark.id}
              initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
              animate={{
                opacity: 0,
                x: spark.x * 3,
                y: spark.y * 3 - 20,
                scale: 0,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="absolute -top-4 left-1/2 w-1.5 h-1.5 bg-filter-gold"
              style={{ imageRendering: "pixelated" }}
            />
          ))}
        </AnimatePresence>

        {/* Lighter */}
        <div
          className="relative w-16 h-24 flex flex-col items-center cursor-grab active:cursor-grabbing"
          style={{ imageRendering: "pixelated" }}
        >
          {/* Lighter top (metal cap) */}
          <div className="w-10 h-4 bg-gradient-to-b from-zinc-400 to-zinc-500 border-[2px] border-ink-black rounded-t-sm" />

          {/* Flint wheel — drag zone */}
          <motion.div
            drag="y"
            dragConstraints={{ top: -40, bottom: 0 }}
            dragElastic={0.1}
            dragSnapToOrigin
            style={{ y: flickY }}
            onDragEnd={(_, info) => {
              if (info.offset.y < -30) {
                handleFlick();
              }
            }}
            onDragStart={() => setHint(false)}
            className="w-8 h-5 bg-gradient-to-b from-zinc-600 to-zinc-700 border-[2px] border-ink-black flex items-center justify-center z-10 touch-none"
          >
            {/* Wheel texture lines */}
            <div className="flex gap-[1px]">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-[2px] h-3 bg-zinc-500" />
              ))}
            </div>
          </motion.div>

          {/* Lighter body */}
          <div className="w-14 h-14 bg-gradient-to-b from-marlboro-red to-rose-700 border-[2px] border-ink-black flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(11,11,15,1)]">
            <span
              className="text-paper-white font-black text-[8px] uppercase tracking-wider"
              style={{ textShadow: "1px 1px 0px rgba(0,0,0,0.3)" }}
            >
              SMORY
            </span>
          </div>
        </div>

        {/* Drag hint */}
        <AnimatePresence>
          {hint && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: [0, -6, 0] }}
              exit={{ opacity: 0 }}
              transition={{
                opacity: { duration: 0.3 },
                y: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
              }}
              className="absolute -top-16 left-1/2 -translate-x-1/2 whitespace-nowrap"
            >
              <span className="text-xs font-bold text-ash-gray uppercase tracking-widest flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="rotate-180">
                  <path d="M6 2L6 10M6 2L3 5M6 2L9 5" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
                </svg>
                Flick to Enter
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Or use button fallback */}
      <button
        onClick={() => {
          if (!isLit) {
            handleFlick();
          }
        }}
        className="text-xs font-bold text-ash-gray hover:text-marlboro-red uppercase tracking-widest transition-colors cursor-pointer mt-2"
      >
        or tap to skip →
      </button>
    </div>
  );
}
