import React from "react";
import { motion } from "framer-motion";

interface PixelLoadingProps {
  message?: string;
}

export function PixelLoading({ message = "Loading..." }: PixelLoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] gap-6">
      <div className="flex space-x-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-4 h-4 bg-marlboro-red shadow-[2px_2px_0px_0px_rgba(11,11,15,1)] border-2 border-ink-black"
            animate={{
              y: ["0%", "-100%", "0%"],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.15,
            }}
          />
        ))}
      </div>
      <motion.p 
        className="text-ink-black text-sm tracking-widest uppercase font-bold"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        {message}
      </motion.p>
    </div>
  );
}
