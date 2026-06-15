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
        className="absolute top-0 left-0 right-0 h-16 opacity-10 pointer-events-none transition-opacity group-hover:opacity-20"
        style={{ 
          backgroundColor: themeColor,
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(11,11,15,0.2) 10px, rgba(11,11,15,0.2) 20px)`
        }}
      />
      
      <div className="relative z-10 pt-4">
        <h3 className="text-xl font-bold mb-2 uppercase tracking-tight" style={{ color: themeColor, textShadow: "2px 2px 0px rgba(11,11,15,0.1)" }}>
          {name}
        </h3>
        <p className="text-ink-black font-medium text-sm mb-4 leading-relaxed line-clamp-3">
          {description}
        </p>
      </div>
      
      <div className="relative z-10 flex items-center justify-between border-t-[3px] border-ink-black/10 pt-4 mt-auto">
        <div className="flex items-center gap-1.5 text-ash-gray text-xs font-bold tracking-widest uppercase">
          <Users size={14} strokeWidth={2.5} />
          <span>{memberCount.toLocaleString()}</span>
        </div>
        
        <button 
          className="text-xs font-bold uppercase tracking-widest px-3 py-1.5 transition-colors border-[2px] border-transparent hover:border-ink-black"
          style={{ color: themeColor }}
        >
          Join
        </button>
      </div>
    </PixelCard>
  );
}
