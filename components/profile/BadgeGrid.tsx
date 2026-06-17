"use client";

import { useState } from "react";
import { PixelCard } from "@/components/ui/pixel/PixelCard";
import { Flame, Wind, Droplet, Star, Zap, Leaf, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface BadgeGridProps {
  brandCounts: Record<string, number>;
}

export function BadgeGrid({ brandCounts }: BadgeGridProps) {
  const [selectedBadge, setSelectedBadge] = useState<any | null>(null);

  const getBrandCount = (badgeName: string) => {
    // Normalized comparison
    const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
    const bNorm = norm(badgeName);

    const matchingKey = Object.keys(brandCounts).find(key => {
      const kNorm = norm(key);
      return kNorm.includes(bNorm) || bNorm.includes(kNorm);
    });

    return matchingKey ? brandCounts[matchingKey] : 0;
  };

  const badges = [
    { id: "1", name: "Marlboro Red", icon: Flame, color: "#E11D48", desc: "The classic full flavor. You've smoked a lot of these." },
    { id: "2", name: "Camel Gold", icon: Star, color: "#EAB308", desc: "Smooth Turkish blend. Your occasional choice." },
    { id: "3", name: "Am. Spirit", icon: Leaf, color: "#4DA6FF", desc: "100% additive free. Slowly burning through these." },
    { id: "4", name: "Newport", icon: Wind, color: "#22C55E", desc: "Menthol king. Haven't tried logging this yet." },
    { id: "5", name: "Parliament", icon: Droplet, color: "#3b82f6", desc: "Recessed filter. Needs more logs to unlock." },
    { id: "6", name: "Lucky Strike", icon: Zap, color: "#F97316", desc: "It's toasted. A rare vintage choice." },
  ].map(badge => {
    const count = getBrandCount(badge.name);
    return {
      ...badge,
      unlocked: count > 0,
      count
    };
  });

  return (
    <div className="w-full max-w-4xl mx-auto px-4 relative mt-4">
      <h3 className="text-xl font-bold text-ink-black mb-4 uppercase tracking-tight" style={{ textShadow: "2px 2px 0px rgba(11,11,15,0.1)" }}>
        Brand Collection
      </h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {badges.map((badge) => {
          const Icon = badge.icon;
          return (
            <PixelCard 
              key={badge.id}
              variant="interactive"
              onClick={() => setSelectedBadge(badge)}
              className={`flex flex-col items-center justify-center p-4 text-center aspect-square ${
                !badge.unlocked ? "opacity-40 grayscale hover:grayscale-0 hover:opacity-80" : ""
              }`}
            >
              <div 
                className="mb-2 p-3 bg-paper-white border-[3px] border-ink-black shadow-[4px_4px_0px_0px_rgba(11,11,15,1)]"
                style={badge.unlocked ? { borderColor: badge.color, color: badge.color } : {}}
              >
                <Icon size={24} strokeWidth={2.5} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-ink-black leading-tight mt-1">
                {badge.name}
              </span>
            </PixelCard>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedBadge && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-sm"
            >
              <PixelCard className="bg-paper-white p-6 relative">
                <button 
                  onClick={() => setSelectedBadge(null)}
                  className="absolute top-4 right-4 text-ash-gray hover:text-ink-black"
                >
                  <X size={24} />
                </button>
                
                <div className="flex flex-col items-center text-center mt-4">
                  <div 
                    className="p-6 bg-paper-white border-[4px] border-ink-black shadow-[8px_8px_0px_0px_rgba(11,11,15,1)] mb-6"
                    style={{ borderColor: selectedBadge.unlocked ? selectedBadge.color : undefined, color: selectedBadge.unlocked ? selectedBadge.color : undefined }}
                  >
                    <selectedBadge.icon size={48} strokeWidth={2.5} />
                  </div>
                  
                  <h2 className="text-2xl font-bold text-ink-black uppercase tracking-tight mb-2">
                    {selectedBadge.name}
                  </h2>
                  
                  {selectedBadge.unlocked ? (
                    <div className="mb-4">
                      <span className="text-3xl font-bold" style={{ color: selectedBadge.color }}>
                        {selectedBadge.count}
                      </span>
                      <span className="text-ash-gray text-xs font-bold uppercase tracking-widest ml-2">Logged</span>
                    </div>
                  ) : (
                    <div className="mb-4 bg-ink-black/10 px-4 py-1 border-[2px] border-ink-black">
                      <span className="text-ink-black text-xs font-bold uppercase tracking-widest">Locked</span>
                    </div>
                  )}
                  
                  <p className="text-ink-black font-medium leading-relaxed">
                    {selectedBadge.desc}
                  </p>
                </div>
              </PixelCard>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
