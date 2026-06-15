"use client";

import { useId } from "react";

export function BrutalistMarquee() {
  const id = useId();
  // We duplicate the text array a few times to ensure it covers the screen width infinitely
  const items = [
    "///",
    "NO NAMES",
    "///",
    "PURE ANONYMITY",
    "///",
    "REAL STORIES",
    "///",
    "THE BREAK ROOM",
  ];
  const combinedText = items.join("  ");

  return (
    <div className="w-full bg-marlboro-red border-y-[4px] border-ink-black py-3 overflow-hidden relative shadow-[0px_4px_0px_0px_rgba(11,11,15,1)] z-20 flex" style={{ transform: "rotate(-1deg) scale(1.02)" }}>
      {/* 
        We use two identical spans that animate leftwards. 
        When the first span finishes scrolling, the second one is exactly in its place, creating a seamless loop.
      */}
      <div className="flex whitespace-nowrap animate-marquee will-change-transform">
        {[...Array(10)].map((_, i) => (
          <span key={`${id}-${i}`} className="text-paper-white font-black text-xl md:text-2xl tracking-[0.2em] uppercase pr-8">
            {combinedText}
          </span>
        ))}
      </div>
      <div className="flex whitespace-nowrap animate-marquee will-change-transform" aria-hidden="true">
        {[...Array(10)].map((_, i) => (
          <span key={`${id}-hidden-${i}`} className="text-paper-white font-black text-xl md:text-2xl tracking-[0.2em] uppercase pr-8">
            {combinedText}
          </span>
        ))}
      </div>
    </div>
  );
}
