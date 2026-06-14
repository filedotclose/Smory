"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import React from "react";

interface PixelCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  variant?: "default" | "interactive";
}

export function PixelCard({ children, className, variant = "default", ...props }: PixelCardProps) {
  return (
    <motion.div
      className={cn(
        "relative bg-[#1D1D24] p-4",
        "border-[3px] border-[#2D2D36]",
        // This gives a simple pixelated corner look without complex clip-paths
        // and keeps the rendering crisp for a premium feel
        "shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]",
        variant === "interactive" && "hover:border-[#4DA6FF] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(77,166,255,0.3)] transition-colors cursor-pointer",
        className
      )}
      initial={variant === "interactive" ? { opacity: 0, y: 10 } : undefined}
      animate={variant === "interactive" ? { opacity: 1, y: 0 } : undefined}
      whileHover={variant === "interactive" ? { scale: 1.02 } : undefined}
      whileTap={variant === "interactive" ? { scale: 0.98, x: 2, y: 2, boxShadow: "0px_0px_0px_0px_rgba(0,0,0,0.5)" } : undefined}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      {...props}
    >
      {/* Optional: Pixel corner decorations */}
      <div className="absolute -top-[3px] -left-[3px] w-1.5 h-1.5 bg-[#0B0B0F]" />
      <div className="absolute -top-[3px] -right-[3px] w-1.5 h-1.5 bg-[#0B0B0F]" />
      <div className="absolute -bottom-[3px] -left-[3px] w-1.5 h-1.5 bg-[#0B0B0F]" />
      <div className="absolute -bottom-[3px] -right-[3px] w-1.5 h-1.5 bg-[#0B0B0F]" />
      
      {children}
    </motion.div>
  );
}
