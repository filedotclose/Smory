"use client";

import { useState } from "react";
import { PixelCard } from "@/components/ui/pixel/PixelCard";
import { Users } from "lucide-react";
import { toggleCommunityMembership } from "@/server/communities/actions";
import { toast } from "sonner";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface CommunityCardProps {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  themeColor: string;
  isJoined?: boolean;
}

export function CommunityCard({ id, name, description, memberCount, themeColor, isJoined = false }: CommunityCardProps) {
  const [joined, setJoined] = useState(isJoined);
  const [loading, setLoading] = useState(false);
  const [localMemberCount, setLocalMemberCount] = useState(memberCount);

  const handleJoin = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating when clicking join
    e.stopPropagation();

    setLoading(true);
    const result = await toggleCommunityMembership(id);
    setLoading(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      setJoined(!!result.joined);
      setLocalMemberCount(prev => result.joined ? prev + 1 : Math.max(0, prev - 1));
      toast.success(result.joined ? `Joined ${name}` : `Left ${name}`);
    }
  };

  return (
    <div className="block h-full">
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
            <span>{localMemberCount.toLocaleString()}</span>
          </div>
          
          <div className="flex gap-2">
            {joined && (
              <Link 
                href={`/communities/${id}`}
                className="bg-filter-gold text-ink-black text-xs font-bold uppercase tracking-widest px-3 py-1.5 border-[2px] border-ink-black shadow-[2px_2px_0px_0px_rgba(11,11,15,1)] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(11,11,15,1)] transition-all"
                onClick={(e) => e.stopPropagation()}
              >
                Open
              </Link>
            )}
            <button 
              onClick={handleJoin}
              disabled={loading}
              className={cn(
                "text-xs font-bold uppercase tracking-widest px-3 py-1.5 transition-colors border-[2px]",
                joined 
                  ? "bg-paper-white text-ink-black border-ink-black hover:bg-marlboro-red hover:text-paper-white hover:border-marlboro-red"
                  : "bg-ink-black text-paper-white border-ink-black hover:bg-marlboro-red hover:border-marlboro-red"
              )}
            >
              {loading ? "..." : joined ? "Leave" : "Join"}
            </button>
          </div>
        </div>
      </PixelCard>
    </div>
  );
}
