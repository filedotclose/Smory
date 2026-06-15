"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PixelAvatarProps {
  src: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  isIdleAnimated?: boolean;
}

export function PixelAvatar({ src, size = "md", className, isIdleAnimated = true }: PixelAvatarProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-16 h-16",
    lg: "w-32 h-32",
    xl: "w-48 h-48",
  };

  return (
    <motion.div
      className={cn(
        "relative inline-block overflow-hidden bg-paper-white border-[3px] border-ink-black",
        "shadow-[4px_4px_0px_0px_rgba(11,11,15,1)]", // Solid black shadow for light mode
        sizeClasses[size],
        className
      )}
      animate={isIdleAnimated ? {
        y: [0, -4, 0],
      } : {}}
      transition={isIdleAnimated ? {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      } : {}}
      style={{
        imageRendering: "pixelated"
      }}
    >
      {/* Corner cutouts */}
      <div className="absolute -top-[3px] -left-[3px] w-1.5 h-1.5 bg-paper-white border-b-2 border-r-2 border-ink-black" />
      <div className="absolute -top-[3px] -right-[3px] w-1.5 h-1.5 bg-paper-white border-b-2 border-l-2 border-ink-black" />
      <div className="absolute -bottom-[3px] -left-[3px] w-1.5 h-1.5 bg-paper-white border-t-2 border-r-2 border-ink-black" />
      <div className="absolute -bottom-[3px] -right-[3px] w-1.5 h-1.5 bg-paper-white border-t-2 border-l-2 border-ink-black" />
      
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="Pixel Avatar" className="w-full h-full object-cover pixelated" style={{ imageRendering: "pixelated" }} />
    </motion.div>
  );
}
