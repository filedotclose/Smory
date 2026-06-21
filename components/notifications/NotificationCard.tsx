"use client";

import { Flame, Sparkles, MessageSquare, AlertCircle, Users } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { PixelCard } from "@/components/ui/pixel/PixelCard";
import { motion } from "framer-motion";

export type NotificationType = "puff" | "insight" | "reply" | "system" | "friend_request";

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
      case "friend_request":
        return { icon: Users, color: "#3b82f6", action: "sent you a connection request" }; // Blue
      case "system":
        return { icon: AlertCircle, color: "#4DA6FF", action: "System Alert" }; // Blue
      default:
        return { icon: AlertCircle, color: "#0B0B0F", action: "interacted with you" }; // Safe fallback
    }
  };

  const { icon: Icon, color, action } = getConfig();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="relative mb-2"
    >
      <div className={`relative p-5 border-[3px] border-ink-black bg-paper-white flex flex-col gap-3 transition-all ${!notification.isRead ? 'shadow-[6px_6px_0px_0px_rgba(225,29,72,1)] translate-y-[-2px] translate-x-[-2px]' : 'shadow-[4px_4px_0px_0px_rgba(11,11,15,1)] hover:translate-y-[-1px] hover:translate-x-[-1px] hover:shadow-[5px_5px_0px_0px_rgba(11,11,15,1)]'}`}>
        
        {/* Brutalist NEW Badge */}
        {!notification.isRead && (
          <div className="absolute -top-3 -right-3 bg-marlboro-red text-paper-white text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 border-[2px] border-ink-black shadow-[2px_2px_0px_0px_rgba(11,11,15,1)] rotate-3 z-10">
            NEW
          </div>
        )}
        
        <div className="flex items-start gap-4">
          {/* Avatar Box */}
          <div className="w-12 h-12 bg-paper-white border-[3px] border-ink-black flex items-center justify-center text-2xl shadow-[2px_2px_0px_0px_rgba(11,11,15,1)] flex-shrink-0">
            {getAvatarEmoji(notification.actor.species)}
          </div>
          
          <div className="flex-1 pt-0.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
              <span className="font-black text-ink-black uppercase tracking-tight text-base leading-none">
                {notification.actor.username}
              </span>
              <span className="text-[9px] text-ash-gray font-bold uppercase tracking-widest shrink-0">
                {formatDistanceToNow(notification.createdAt)} AGO
              </span>
            </div>
            
            <div className="flex items-center gap-1.5 mt-2">
              <Icon size={14} style={{ color }} strokeWidth={3} />
              <span className="text-[11px] font-extrabold uppercase tracking-wider" style={{ color: notification.isRead ? '#828282' : '#0B0B0F' }}>
                {action}
              </span>
            </div>
          </div>
        </div>

        {/* Quote Block - Only show if content exists */}
        {notification.content && (
          <div className="mt-2 bg-paper-white p-3 border-[2px] border-ink-black border-dashed relative">
            {/* Small decorative pin */}
            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-1 bg-ash-gray/30" />
            <p className="text-ink-black text-sm font-medium italic">
              "{notification.content}"
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
