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
        "relative bg-paper-white p-4",
        "border-[3px] border-ink-black",
        "shadow-[4px_4px_0px_0px_rgba(11,11,15,0.1)]", // subtle shadow for light mode
        variant === "interactive" && "hover:border-marlboro-red hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(225,29,72,0.3)] transition-colors cursor-pointer",
        className
      )}
      initial={variant === "interactive" ? { opacity: 0, y: 10 } : undefined}
      animate={variant === "interactive" ? { opacity: 1, y: 0 } : undefined}
      whileHover={variant === "interactive" ? { scale: 1.02 } : undefined}
      whileTap={variant === "interactive" ? { scale: 0.98, x: 2, y: 2, boxShadow: "0px_0px_0px_0px_rgba(0,0,0,0)" } : undefined}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      {...props}
    >
      {/* Corner cutouts for a pixel aesthetic */}
      <div className="absolute -top-[3px] -left-[3px] w-1.5 h-1.5 bg-paper-white border-b-2 border-r-2 border-ink-black" />
      <div className="absolute -top-[3px] -right-[3px] w-1.5 h-1.5 bg-paper-white border-b-2 border-l-2 border-ink-black" />
      <div className="absolute -bottom-[3px] -left-[3px] w-1.5 h-1.5 bg-paper-white border-t-2 border-r-2 border-ink-black" />
      <div className="absolute -bottom-[3px] -right-[3px] w-1.5 h-1.5 bg-paper-white border-t-2 border-l-2 border-ink-black" />
      
      {children}
    </motion.div>
  );
}
