"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, Flame, Sparkles, MoreHorizontal } from "lucide-react";
import { PixelCard } from "@/components/ui/pixel/PixelCard";
import { motion } from "framer-motion";
import { toast } from "sonner";
import confetti from "canvas-confetti";

type PostCardProps = {
  post: {
    id: string;
    content: string;
    created_at: Date;
    author: {
      anonymous_username: string;
      avatar_species: string;
    };
    community: {
      name: string;
    } | null;
  };
};

export function PostCard({ post }: PostCardProps) {
  const [puffs, setPuffs] = useState(0);
  const [hasPuffed, setHasPuffed] = useState(false);
  
  const [insights, setInsights] = useState(0);
  const [hasInsight, setHasInsight] = useState(false);

  const getAvatarEmoji = (species: string) => {
    const map: Record<string, string> = {
      Fox: '🦊', Wolf: '🐺', Cat: '🐱', Dragon: '🐉', Owl: '🦉', Rabbit: '🐰'
    };
    return map[species] || '👤';
  };

  const handlePuff = () => {
    if (hasPuffed) {
      setPuffs(prev => Math.max(0, prev - 1));
      setHasPuffed(false);
    } else {
      setPuffs(prev => prev + 1);
      setHasPuffed(true);
      
      confetti({
        particleCount: 30,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#E11D48'], // Marlboro Red
        shapes: ['square']
      });
    }
  };

  const handleInsight = () => {
    if (hasInsight) {
      setInsights(prev => Math.max(0, prev - 1));
      setHasInsight(false);
    } else {
      setInsights(prev => prev + 1);
      setHasInsight(true);
      toast.success("Marked as insightful!", { icon: "💡", className: "border-2 border-ink-black shadow-[4px_4px_0px_0px_rgba(11,11,15,1)] rounded-none font-bold" });
    }
  };

  const handleReply = () => {
    toast("Reply feature coming soon!", { icon: "💬", className: "border-2 border-ink-black shadow-[4px_4px_0px_0px_rgba(11,11,15,1)] rounded-none font-bold text-ink-black" });
  };

  return (
    <PixelCard className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-paper-white border-[3px] border-ink-black flex items-center justify-center text-xl shadow-[2px_2px_0px_0px_rgba(11,11,15,1)]">
            {getAvatarEmoji(post.author.avatar_species)}
          </div>
          <div>
            <h3 className="font-bold text-ink-black tracking-tight">{post.author.anonymous_username}</h3>
            <p className="text-[10px] text-ash-gray uppercase tracking-widest font-bold mt-0.5">
              {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
              {post.community && ` • ${post.community.name}`}
            </p>
          </div>
        </div>
        <button className="text-ash-gray hover:text-ink-black transition-colors">
          <MoreHorizontal size={20} />
        </button>
      </div>
      
      <p className="text-ink-black font-medium leading-relaxed text-[15px] mb-5 whitespace-pre-wrap">
        {post.content}
      </p>
      
      <div className="flex items-center gap-6 pt-4 border-t-[3px] border-ink-black/10">
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePuff}
          className={`flex items-center gap-2 text-sm font-bold uppercase tracking-widest transition-colors ${
            hasPuffed ? "text-marlboro-red" : "text-ash-gray hover:text-marlboro-red"
          }`}
        >
          <Flame size={18} className={hasPuffed ? "fill-marlboro-red" : ""} />
          <span>Puff {puffs > 0 && `(${puffs})`}</span>
        </motion.button>

        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleInsight}
          className={`flex items-center gap-2 text-sm font-bold uppercase tracking-widest transition-colors ${
            hasInsight ? "text-filter-gold" : "text-ash-gray hover:text-filter-gold"
          }`}
        >
          <Sparkles size={18} className={hasInsight ? "fill-filter-gold" : ""} />
          <span>Insight {insights > 0 && `(${insights})`}</span>
        </motion.button>

        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleReply}
          className="flex items-center gap-2 text-ash-gray hover:text-ink-black text-sm font-bold uppercase tracking-widest transition-colors"
        >
          <MessageSquare size={18} />
          <span>Reply</span>
        </motion.button>
      </div>
    </PixelCard>
  );
}
