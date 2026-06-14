import { PixelCard } from "@/components/ui/pixel/PixelCard";
import { Award, Zap, Heart, Target, Clock, Shield } from "lucide-react";

const BADGES = [
  { id: "1", name: "First Step", icon: Award, color: "#EAB308", unlocked: true },
  { id: "2", name: "7 Day Streak", icon: Zap, color: "#4DA6FF", unlocked: true },
  { id: "3", name: "Trigger Identified", icon: Target, color: "#EC4899", unlocked: true },
  { id: "4", name: "Community Pillar", icon: Heart, color: "#22C55E", unlocked: false },
  { id: "5", name: "Night Owl", icon: Clock, color: "#A855F7", unlocked: false },
  { id: "6", name: "Iron Will", icon: Shield, color: "#F97316", unlocked: false },
];

export function BadgeGrid() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <h3 className="text-xl font-bold text-white mb-4 uppercase tracking-tight" style={{ textShadow: "2px 2px 0px rgba(0,0,0,0.5)" }}>
        Achievement Badges
      </h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {BADGES.map((badge) => {
          const Icon = badge.icon;
          return (
            <PixelCard 
              key={badge.id}
              className={`flex flex-col items-center justify-center p-4 text-center aspect-square ${
                !badge.unlocked ? "opacity-40 grayscale" : ""
              }`}
            >
              <div 
                className="mb-2 p-3 bg-[#0B0B0F] border-2 border-[#2D2D36] shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]"
                style={badge.unlocked ? { borderColor: badge.color, color: badge.color } : {}}
              >
                <Icon size={24} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#A1A1AA] leading-tight mt-1">
                {badge.name}
              </span>
            </PixelCard>
          );
        })}
      </div>
    </div>
  );
}
