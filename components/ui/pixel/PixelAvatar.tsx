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
        "relative inline-block overflow-hidden bg-[#1D1D24] border-[3px] border-[#2D2D36]",
        "shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]",
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
      <div className="absolute -top-[3px] -left-[3px] w-1.5 h-1.5 bg-[#0B0B0F]" />
      <div className="absolute -top-[3px] -right-[3px] w-1.5 h-1.5 bg-[#0B0B0F]" />
      <div className="absolute -bottom-[3px] -left-[3px] w-1.5 h-1.5 bg-[#0B0B0F]" />
      <div className="absolute -bottom-[3px] -right-[3px] w-1.5 h-1.5 bg-[#0B0B0F]" />
      
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="Pixel Avatar" className="w-full h-full object-cover pixelated" style={{ imageRendering: "pixelated" }} />
    </motion.div>
  );
}
