"use client";

import { Edit2, Settings } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

interface ProfileAvatarSectionProps {
  username: string;
  displayName?: string | null;
  species: string;
  joinDate: string;
  logsCount: number;
}

export function ProfileAvatarSection({ username, displayName, species, joinDate, logsCount }: ProfileAvatarSectionProps) {
  // Calculate gamified level and XP based on logs
  const logsPerLevel = 5;
  const level = Math.floor(logsCount / logsPerLevel) + 1;
  const currentLevelXp = logsCount % logsPerLevel;
  const xpPercentage = (currentLevelXp / logsPerLevel) * 100;
  const nextLevelXpNeeded = logsPerLevel - currentLevelXp;

  const getAvatarEmoji = (s: string) => {
    const map: Record<string, string> = {
      Fox: '🦊', Wolf: '🐺', Cat: '🐱', Dragon: '🐉', Owl: '🦉', Rabbit: '🐰'
    };
    return map[s] || '👤';
  };

  const getSpeciesColor = (s: string) => {
    const map: Record<string, string> = {
      Fox: 'bg-orange-500/20 text-orange-600 border-orange-400',
      Wolf: 'bg-slate-500/20 text-slate-700 border-slate-400',
      Cat: 'bg-yellow-500/20 text-yellow-700 border-yellow-400',
      Dragon: 'bg-rose-500/20 text-rose-600 border-rose-400',
      Owl: 'bg-purple-500/20 text-purple-600 border-purple-400',
      Rabbit: 'bg-emerald-500/20 text-emerald-600 border-emerald-400',
    };
    return map[s] || 'bg-ash-gray/20 text-ink-black border-ink-black/20';
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 relative my-6">
      {/* Neo-brutalist Badge Card Container */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="bg-paper-white border-[4px] border-ink-black shadow-[10px_10px_0px_0px_rgba(11,11,15,1)] p-6 relative overflow-hidden"
      >
        {/* Card Header Strip */}
        <div className="absolute top-0 left-0 right-0 h-4 bg-marlboro-red border-b-[3px] border-ink-black" />
        
        {/* Fun Stamps/Stickers */}
        <div className="absolute right-4 top-8 -rotate-12 bg-filter-gold text-ink-black text-[9px] font-black uppercase tracking-widest px-2 py-0.5 border-[2px] border-ink-black shadow-[2px_2px_0px_0px_rgba(11,11,15,1)] select-none">
          OFFICIAL ID
        </div>
        <div className="absolute right-28 top-7 rotate-6 text-2xl opacity-10 select-none pointer-events-none">🚬</div>

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mt-4">
          
          {/* Left Column: Stylized Avatar Frame */}
          <div className="flex flex-col items-center">
            <div className="relative group select-none">
              <div className="w-28 h-28 bg-paper-white border-[4px] border-ink-black shadow-[4px_4px_0px_0px_rgba(11,11,15,1)] flex items-center justify-center text-6xl relative overflow-hidden">
                {/* Checkered inner pattern */}
                <div className="absolute inset-0 bg-checkered opacity-10 z-0" />
                <span className="relative z-10 filter drop-shadow-[2px_2px_0px_rgba(0,0,0,0.15)] animate-pulse" style={{ animationDuration: '3s' }}>
                  {getAvatarEmoji(species)}
                </span>
              </div>
              
              <Link 
                href="/settings"
                className="absolute inset-0 bg-ink-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 cursor-pointer border-[4px] border-transparent"
              >
                <Edit2 className="text-paper-white" size={24} />
              </Link>
            </div>
            
            {/* Stamp below avatar */}
            <div className="mt-3 bg-ink-black text-paper-white text-[9px] font-extrabold uppercase tracking-widest px-3 py-1 border border-ink-black shadow-[2px_2px_0px_0px_rgba(11,11,15,0.2)]">
              {species} CLASS
            </div>
          </div>

          {/* Right Column: User Bio & XP */}
          <div className="flex-1 w-full flex flex-col justify-between">
            
            {/* Header: Name and Settings Link */}
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-black text-ink-black tracking-tight leading-none uppercase">
                  {displayName || username}
                </h2>
                {displayName && (
                  <p className="text-[10px] text-ash-gray font-bold tracking-wider mt-1 uppercase">
                    @{username}
                  </p>
                )}
              </div>
              
              <Link 
                href="/settings" 
                className="text-ash-gray hover:text-marlboro-red hover:rotate-45 transition-all p-1"
                title="Edit Character Settings"
              >
                <Settings size={20} strokeWidth={2.5} />
              </Link>
            </div>

            <div className="h-[2px] bg-ink-black/10 my-3" />

            {/* Badges/Level Tag Row */}
            <div className="flex flex-wrap gap-2 items-center mb-4">
              <span className="text-xs font-black bg-marlboro-red text-paper-white px-2 py-0.5 border-[2px] border-ink-black shadow-[2px_2px_0px_0px_rgba(11,11,15,1)]">
                LVL {level}
              </span>
              <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 border-[2px] border-ink-black ${getSpeciesColor(species)}`}>
                {species} Hybrid
              </span>
              <span className="text-[10px] font-bold text-ash-gray uppercase ml-auto">
                Est. {joinDate}
              </span>
            </div>

            {/* XP Gamified Progress Bar */}
            <div className="w-full">
              <div className="flex justify-between items-center text-[10px] font-extrabold uppercase tracking-widest text-ink-black mb-1.5">
                <span>XP (LOGS TO LEVEL)</span>
                <span className="text-marlboro-red">{currentLevelXp} / {logsPerLevel} LOGS</span>
              </div>
              
              {/* Outer Bar */}
              <div className="h-6 w-full bg-ash-gray/20 border-[3px] border-ink-black relative overflow-hidden">
                {/* Inner Filled Bar */}
                <motion.div 
                  className="h-full bg-filter-gold border-r-[3px] border-ink-black"
                  initial={{ width: 0 }}
                  animate={{ width: `${xpPercentage}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
                
                {/* Stripe Details */}
                <div className="absolute inset-0 bg-stripes opacity-15 pointer-events-none" />
              </div>
              
              <p className="text-[9px] text-ash-gray font-bold uppercase mt-1 tracking-wider">
                {nextLevelXpNeeded} log{nextLevelXpNeeded > 1 ? 's' : ''} remaining until LEVEL {level + 1}
              </p>
            </div>

          </div>
        </div>

      </motion.div>
    </div>
  );
}
