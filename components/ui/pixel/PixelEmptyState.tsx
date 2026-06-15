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
        <PixelCard className="mb-6 p-8 flex flex-col items-center bg-paper-white shadow-[8px_8px_0px_0px_rgba(11,11,15,0.1)]">
          {icon && <div className="mb-4 text-marlboro-red">{icon}</div>}
          <h3 className="text-xl font-bold text-ink-black mb-2">{title}</h3>
          <p className="text-ash-gray text-sm mb-6 max-w-sm">{description}</p>
          
          {actionLabel && onAction && (
            <button 
              onClick={onAction}
              className="px-6 py-3 bg-marlboro-red text-paper-white font-bold text-sm tracking-wide transition-transform active:scale-95 shadow-[4px_4px_0px_0px_rgba(11,11,15,1)] border-[2px] border-ink-black"
            >
              {actionLabel}
            </button>
          )}
        </PixelCard>
      </motion.div>
    </div>
  );
}
