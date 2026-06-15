"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const SMORY_LETTERS = ["S", "M", "O", "R", "Y"];

const letterVariants = {
  hidden: { opacity: 0, y: 60, scale: 0.3, rotate: -15 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    rotate: 0,
    transition: {
      delay: 0.3 + i * 0.1,
      type: "spring" as const,
      stiffness: 200,
      damping: 12,
      mass: 0.8,
    },
  }),
};

const taglineWords = "Every smoke tells a story".split(" ");

export function WelcomeGraphics() {
  const [taglineComplete, setTaglineComplete] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setTaglineComplete(true), 2200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full select-none">
      {/* Floating smoke wisps above the logo */}
      <div className="relative w-full flex justify-center mb-4">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: 40 + i * 20,
              height: 8 + i * 4,
              background: `radial-gradient(ellipse, rgba(161,161,170,${0.15 - i * 0.03}) 0%, transparent 70%)`,
              left: `${35 + i * 8}%`,
              top: -10 - i * 15,
            }}
            animate={{
              y: [0, -30 - i * 10, -60 - i * 15],
              scaleX: [1, 1.4 + i * 0.2, 2 + i * 0.3],
              opacity: [0.3, 0.15, 0],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeOut",
              delay: i * 1.5,
            }}
          />
        ))}
      </div>

      {/* ── SMORY Wordmark ───────────────────────────────── */}
      <motion.div
        id="smory-title"
        className="flex items-center justify-center gap-1 md:gap-2"
        initial="hidden"
        animate="visible"
      >
        {SMORY_LETTERS.map((letter, i) => (
          <motion.span
            key={i}
            custom={i}
            variants={letterVariants}
            className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black uppercase inline-block"
            style={{
              color: "#0B0B0F",
              textShadow: "6px 6px 0px rgba(11,11,15,0.15)",
              WebkitTextStroke: "2px rgba(11,11,15,0.05)",
            }}
          >
            {letter}
          </motion.span>
        ))}
      </motion.div>

      {/* ── Decorative underline ────────────────────────── */}
      <motion.div
        className="flex items-center gap-2 mt-3"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ delay: 1.0, duration: 0.6, ease: "easeOut" }}
      >
        <div className="h-1 w-8 bg-filter-gold" />
        <div className="h-1.5 w-20 bg-marlboro-red" />
        <div className="h-1 w-8 bg-filter-gold" />
      </motion.div>

      {/* ── Typewriter Tagline ──────────────────────────── */}
      <div className="mt-6 md:mt-8 flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
        {taglineWords.map((word, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 1.2 + i * 0.15,
              duration: 0.3,
              ease: "easeOut",
            }}
            className="text-marlboro-red text-base sm:text-lg md:text-xl uppercase tracking-[0.2em] font-bold"
          >
            {word}
          </motion.span>
        ))}
        {/* Blinking cursor */}
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: taglineComplete ? [1, 0] : 0 }}
          transition={{
            delay: 0,
            duration: 0.8,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="text-marlboro-red text-base sm:text-lg md:text-xl font-bold"
        >
          _
        </motion.span>
      </div>
    </div>
  );
}
