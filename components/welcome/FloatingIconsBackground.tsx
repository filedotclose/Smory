"use client";

import { useEffect, useState } from "react";

const SVGS = {
  match: (
    <svg width="12" height="36" viewBox="0 0 8 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="4" width="4" height="20" fill="#E5E7EB" />
      <rect x="2" y="0" width="4" height="4" fill="#E11D48" />
      <rect x="3" y="1" width="2" height="2" fill="#FCA5A5" />
    </svg>
  ),
  coffee: (
    <svg width="32" height="28" viewBox="0 0 24 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="4" width="16" height="14" fill="#0B0B0F" />
      <rect x="6" y="18" width="8" height="2" fill="#0B0B0F" />
      <rect x="18" y="6" width="4" height="2" fill="#0B0B0F" />
      <rect x="20" y="8" width="2" height="6" fill="#0B0B0F" />
      <rect x="18" y="14" width="4" height="2" fill="#0B0B0F" />
      <rect x="4" y="6" width="12" height="10" fill="#ffffff" />
    </svg>
  ),
  smoke: (
    <svg width="24" height="36" viewBox="0 0 16 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="20" width="4" height="4" fill="#0B0B0F" opacity="0.15" />
      <rect x="8" y="16" width="4" height="4" fill="#0B0B0F" opacity="0.25" />
      <rect x="4" y="12" width="4" height="4" fill="#0B0B0F" opacity="0.2" />
      <rect x="8" y="8" width="4" height="4" fill="#0B0B0F" opacity="0.1" />
      <rect x="6" y="4" width="4" height="4" fill="#0B0B0F" opacity="0.08" />
      <rect x="10" y="0" width="4" height="4" fill="#0B0B0F" opacity="0.05" />
    </svg>
  )
};

const ICONS = ["match", "coffee", "smoke", "smoke", "match"] as const;

export function FloatingIconsBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // We generate a deterministic array of icons with random-looking but fixed properties 
  // to avoid hydration mismatch, or we just render them after mount (which we are doing).
  const icons = Array.from({ length: 15 }).map((_, i) => {
    const type = ICONS[i % ICONS.length];
    const left = `${Math.random() * 100}%`;
    const animationDuration = `${15 + Math.random() * 20}s`;
    const animationDelay = `-${Math.random() * 20}s`;
    const scale = 0.5 + Math.random() * 0.8;
    const rotate = Math.random() * 360;

    return { id: i, type, left, animationDuration, animationDelay, scale, rotate };
  });

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-40">
      {icons.map((icon) => (
        <div
          key={icon.id}
          className="absolute bottom-[-10%] animate-float-up"
          style={{
            left: icon.left,
            animationDuration: icon.animationDuration,
            animationDelay: icon.animationDelay,
            transform: `scale(${icon.scale}) rotate(${icon.rotate}deg)`,
          }}
        >
          {SVGS[icon.type]}
        </div>
      ))}
    </div>
  );
}
