"use client";

import { Flame, Sparkles, MessageSquare, AlertCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { PixelCard } from "@/components/ui/pixel/PixelCard";
import { motion } from "framer-motion";

export type NotificationType = "puff" | "insight" | "reply" | "system";

export interface NotificationProps {
  id: string;
  type: NotificationType;
  actor: {
    username: string;
    species: string;
  };
  content: string;
  createdAt: Date;
  isRead: boolean;
}

export function NotificationCard({ notification }: { notification: NotificationProps }) {
  const getAvatarEmoji = (species: string) => {
    const map: Record<string, string> = {
      Fox: '🦊', Wolf: '🐺', Cat: '🐱', Dragon: '🐉', Owl: '🦉', Rabbit: '🐰'
    };
    return map[species] || '👤';
  };

  const getConfig = () => {
    switch (notification.type) {
      case "puff":
        return { icon: Flame, color: "#E11D48", action: "puffed your log" }; // Marlboro Red
      case "insight":
        return { icon: Sparkles, color: "#EAB308", action: "found your log insightful" }; // Filter Gold
      case "reply":
        return { icon: MessageSquare, color: "#0B0B0F", action: "replied to your post" }; // Ink Black
      case "system":
        return { icon: AlertCircle, color: "#4DA6FF", action: "System Alert" }; // Blue
    }
  };

  const { icon: Icon, color, action } = getConfig();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="relative"
    >
      <PixelCard className={`p-4 flex flex-col gap-3 transition-colors ${notification.isRead ? 'bg-paper-white' : 'bg-filter-gold/10'}`}>
        {!notification.isRead && (
          <div className="absolute -top-2 -right-2 w-3 h-3 bg-marlboro-red border-[2px] border-ink-black animate-pulse z-10" />
        )}
        
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-paper-white border-[3px] border-ink-black flex items-center justify-center text-lg shadow-[2px_2px_0px_0px_rgba(11,11,15,1)] flex-shrink-0">
              {getAvatarEmoji(notification.actor.species)}
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-ink-black uppercase tracking-tight leading-tight">
                {notification.actor.username}
              </span>
              <span className="text-[10px] text-ash-gray uppercase tracking-widest font-bold">
                {action}
              </span>
            </div>
          </div>
          
          <div 
            className="p-2 border-[2px] border-ink-black bg-paper-white shadow-[2px_2px_0px_0px_rgba(11,11,15,1)]"
            style={{ color }}
          >
            <Icon size={16} strokeWidth={2.5} />
          </div>
        </div>

        <div className="bg-ink-black/5 p-3 border-[2px] border-ink-black/20">
          <p className="text-ink-black text-sm font-medium italic line-clamp-2">
            &quot;{notification.content}&quot;
          </p>
        </div>

        <div className="text-[9px] text-ash-gray uppercase tracking-widest font-bold text-right mt-1">
          {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
        </div>
      </PixelCard>
    </motion.div>
  );
}
