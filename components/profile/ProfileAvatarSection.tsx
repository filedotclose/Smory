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
          className="bg-[#0B0B0F] border-4 border-[#4DA6FF] shadow-[8px_8px_0px_0px_rgba(0,0,0,0.5)] z-10" 
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
          <Edit2 className="text-white" size={32} />
        </div>
      </motion.div>
      
      <div className="mt-6 flex flex-col items-center">
        <div className="flex items-center gap-3 mb-1">
          <h2 className="text-3xl font-bold text-white tracking-tight" style={{ textShadow: "3px 3px 0px rgba(0,0,0,0.5)" }}>
            {username}
          </h2>
          <button className="text-[#A1A1AA] hover:text-white transition-colors">
            <Settings size={20} />
          </button>
        </div>
        <p className="text-[#4DA6FF] font-bold uppercase tracking-widest text-sm mb-2">
          Level 4 {species}
        </p>
        <p className="text-[#A1A1AA] text-xs uppercase tracking-widest font-bold">
          Joined {joinDate}
        </p>
      </div>
    </div>
  );
}
