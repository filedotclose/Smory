"use client";

import { PixelAvatar } from "@/components/ui/pixel/PixelAvatar";
import { Edit2, Settings } from "lucide-react";
import { motion } from "framer-motion";

interface ProfileAvatarSectionProps {
  username: string;
  species: string;
  joinDate: string;
}

export function ProfileAvatarSection({ username, species, joinDate }: ProfileAvatarSectionProps) {
  return (
    <div className="flex flex-col items-center justify-center pt-10 pb-6 relative">
      <motion.div 
        className="relative group cursor-pointer"
        whileHover={{ scale: 1.05 }}
      >
        <PixelAvatar 
          src="/pixel-fox.png" 
          size="xl" 
          className="bg-paper-white z-10" 
        />
        <div className="absolute inset-0 bg-ink-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
          <Edit2 className="text-paper-white" size={32} />
        </div>
      </motion.div>
      
      <div className="mt-6 flex flex-col items-center">
        <div className="flex items-center gap-3 mb-1">
          <h2 className="text-3xl font-bold text-ink-black tracking-tight" style={{ textShadow: "3px 3px 0px rgba(11,11,15,0.1)" }}>
            {username}
          </h2>
          <button className="text-ash-gray hover:text-ink-black transition-colors">
            <Settings size={20} />
          </button>
        </div>
        <p className="text-marlboro-red font-bold uppercase tracking-widest text-sm mb-2">
          Level 4 {species}
        </p>
        <p className="text-ash-gray text-xs uppercase tracking-widest font-bold">
          Joined {joinDate}
        </p>
      </div>
    </div>
  );
}
