import React from "react";
import { PixelCard } from "./PixelCard";
import { motion } from "framer-motion";

interface PixelEmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export function PixelEmptyState({ title, description, actionLabel, onAction, icon }: PixelEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center min-h-[300px]">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        <PixelCard className="mb-6 p-8 bg-[#1D1D24]/80 backdrop-blur-sm flex flex-col items-center">
          {icon && <div className="mb-4 text-[#4DA6FF]">{icon}</div>}
          <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
          <p className="text-[#A1A1AA] text-sm mb-6 max-w-sm">{description}</p>
          
          {actionLabel && onAction && (
            <button 
              onClick={onAction}
              className="px-6 py-3 bg-[#4DA6FF] text-[#0B0B0F] font-bold text-sm tracking-wide transition-transform active:scale-95 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] border-[2px] border-[#0B0B0F]"
            >
              {actionLabel}
            </button>
          )}
        </PixelCard>
      </motion.div>
    </div>
  );
}
