import { PixelCard } from "@/components/ui/pixel/PixelCard";
import { Users } from "lucide-react";

interface CommunityCardProps {
  name: string;
  description: string;
  memberCount: number;
  themeColor: string;
}

export function CommunityCard({ name, description, memberCount, themeColor }: CommunityCardProps) {
  return (
    <PixelCard variant="interactive" className="h-full flex flex-col justify-between group overflow-hidden">
      {/* Theme banner / pixel pattern */}
      <div 
        className="absolute top-0 left-0 right-0 h-16 opacity-20 pointer-events-none transition-opacity group-hover:opacity-40"
        style={{ 
          backgroundColor: themeColor,
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.2) 10px, rgba(0,0,0,0.2) 20px)`
        }}
      />
      
      <div className="relative z-10 pt-4">
        <h3 className="text-xl font-bold text-white mb-2" style={{ color: themeColor, textShadow: "2px 2px 0px rgba(0,0,0,0.8)" }}>
          {name}
        </h3>
        <p className="text-[#A1A1AA] text-sm mb-4 leading-relaxed line-clamp-3">
          {description}
        </p>
      </div>
      
      <div className="relative z-10 flex items-center justify-between border-t border-[#2D2D36] pt-4 mt-auto">
        <div className="flex items-center gap-1.5 text-[#A1A1AA] text-xs font-bold tracking-widest uppercase">
          <Users size={14} />
          <span>{memberCount.toLocaleString()}</span>
        </div>
        
        <button 
          className="text-xs font-bold uppercase tracking-widest px-3 py-1.5 transition-colors border-2 border-transparent"
          style={{ color: themeColor }}
        >
          Join
        </button>
      </div>
    </PixelCard>
  );
}
