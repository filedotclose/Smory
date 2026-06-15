"use client";

import dynamic from "next/dynamic";
import React from "react";

// Dynamically import the Pixi wrapper so it never runs on the server
const PixiCanvas = dynamic(() => import("./PixiWrapper"), {
  ssr: false,
});

export type ParticleType = "smoke" | "sparks" | "stars" | "dust";

interface PixelParticleBackgroundProps {
  type?: ParticleType;
  density?: number;
  className?: string;
}

export function PixelParticleBackground({ type = "dust", density = 50, className }: PixelParticleBackgroundProps) {
  return (
    <div className={`absolute inset-0 z-0 overflow-hidden pointer-events-none ${className || ""}`}>
      <PixiCanvas type={type} density={density} />
    </div>
  );
}
