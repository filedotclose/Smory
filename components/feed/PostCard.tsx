"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, Flame, Sparkles, MoreHorizontal } from "lucide-react";
import { PixelCard } from "@/components/ui/pixel/PixelCard";
import { motion } from "framer-motion";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { togglePuff, toggleInsight } from "@/server/feed/social-actions";
import { ReplyModal } from "./ReplyModal";

type PostCardProps = {
  post: {
    id: string;
    content: string;
    created_at: Date;
    author: {
      id: string;
      anonymous_username: string;
      display_name: string | null;
      avatar_species: string;
    };
    puffs?: any[];
    insightReactions?: any[];
    replies?: any[];
    isFriend?: boolean;
  };
  currentUserId?: string;
};

export function PostCard({ post, currentUserId }: PostCardProps) {
  const [isPuffing, setIsPuffing] = useState(false);
  const [isInsighting, setIsInsighting] = useState(false);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  
  const initialHasPuffed = post.puffs?.some(p => p.userId === currentUserId) || false;
  const initialPuffCount = post.puffs?.length || 0;
  const [puffs, setPuffs] = useState(initialPuffCount);
  const [hasPuffed, setHasPuffed] = useState(initialHasPuffed);

  const initialHasInsight = post.insightReactions?.some(i => i.userId === currentUserId) || false;
  const initialInsightCount = post.insightReactions?.length || 0;
  const [insights, setInsights] = useState(initialInsightCount);
  const [hasInsight, setHasInsight] = useState(initialHasInsight);

  const getAvatarEmoji = (species: string) => {
    const map: Record<string, string> = {
      Fox: '🦊', Wolf: '🐺', Cat: '🐱', Dragon: '🐉', Owl: '🦉', Rabbit: '🐰'
    };
    return map[species] || '👤';
  };

  const handlePuff = async () => {
    if (isPuffing || !currentUserId) {
      if (!currentUserId) toast.error("Must be logged in");
      return;
    }
    
    setIsPuffing(true);
    
    // Optimistic UI
    const wasPuffed = hasPuffed;
    setHasPuffed(!wasPuffed);
    setPuffs(prev => wasPuffed ? Math.max(0, prev - 1) : prev + 1);
    
    if (!wasPuffed) {
      confetti({
        particleCount: 30,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#E11D48'], // Marlboro Red
        shapes: ['square']
      });
    }

    const result = await togglePuff(post.id);
    if (result.error) {
      // Revert on error
      setHasPuffed(wasPuffed);
      setPuffs(prev => wasPuffed ? prev + 1 : Math.max(0, prev - 1));
      toast.error(result.error);
    }
    setIsPuffing(false);
  };

  const handleInsight = async () => {
    if (isInsighting || !currentUserId) {
      if (!currentUserId) toast.error("Must be logged in");
      return;
    }

    setIsInsighting(true);

    // Optimistic UI
    const wasInsighted = hasInsight;
    setHasInsight(!wasInsighted);
    setInsights(prev => wasInsighted ? Math.max(0, prev - 1) : prev + 1);

    if (!wasInsighted) {
      toast.success("Marked as insightful!", { icon: "💡", className: "border-2 border-ink-black shadow-[4px_4px_0px_0px_rgba(11,11,15,1)] rounded-none font-bold" });
    }

    const result = await toggleInsight(post.id);
    if (result.error) {
      // Revert on error
      setHasInsight(wasInsighted);
      setInsights(prev => wasInsighted ? prev + 1 : Math.max(0, prev - 1));
      toast.error(result.error);
    }
    setIsInsighting(false);
  };

  const displayName = (post.isFriend || post.author.id === currentUserId) && post.author.display_name 
    ? post.author.display_name 
    : post.author.anonymous_username;

  return (
    <>
      <PixelCard className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-paper-white border-[3px] border-ink-black flex items-center justify-center text-xl shadow-[2px_2px_0px_0px_rgba(11,11,15,1)]">
              {getAvatarEmoji(post.author.avatar_species)}
            </div>
            <div>
              <h3 className="font-bold text-ink-black tracking-tight">{displayName}</h3>
              <p className="text-[10px] text-ash-gray uppercase tracking-widest font-bold mt-0.5">
                {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
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
            disabled={isPuffing}
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
            disabled={isInsighting}
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
            onClick={() => setIsReplyModalOpen(true)}
            className="flex items-center gap-2 text-ash-gray hover:text-ink-black text-sm font-bold uppercase tracking-widest transition-colors"
          >
            <MessageSquare size={18} />
            <span>Reply {post.replies && post.replies.length > 0 && `(${post.replies.length})`}</span>
          </motion.button>
        </div>
      </PixelCard>

      <ReplyModal 
        isOpen={isReplyModalOpen} 
        onClose={() => setIsReplyModalOpen(false)} 
        postId={post.id}
        currentUserId={currentUserId}
      />
    </>
  );
}

