"use client";

import { useState, useEffect, useRef } from "react";
import { formatDistanceToNow } from "date-fns";
import { Send, ArrowLeft } from "lucide-react";
import { PixelCard } from "@/components/ui/pixel/PixelCard";
import { cn } from "@/lib/utils";
import { sendMessage, getMessages } from "@/server/communities/actions";
import { toast } from "sonner";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

interface CommunityChatProps {
  community: {
    id: string;
    name: string;
    description: string | null;
  };
  initialMessages: any[];
  currentUserId?: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
}

export function CommunityChat({ community, initialMessages, currentUserId, supabaseUrl, supabaseAnonKey }: CommunityChatProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [content, setContent] = useState("");
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom on load
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const channel = supabase
      .channel(`community-${community.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'Message',
          filter: `communityId=eq.${community.id}`
        },
        (payload) => {
          // Add the new message if it's not already there (we might have added it optimistically)
          const newMessage = payload.new;
          setMessages(prev => {
            if (prev.find(m => m.id === newMessage.id)) return prev;
            
            // We need to fetch the full message with user data, 
            // but for a quick insert we can just reload all messages
            getMessages(community.id).then(data => setMessages(data));
            return prev;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [community.id, supabaseUrl, supabaseAnonKey]);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !currentUserId) return;

    setIsSending(true);
    const result = await sendMessage(community.id, content);
    setIsSending(false);

    if (result.error) {
      toast.error(result.error);
    } else if (result.message) {
      setContent("");
      // Realtime will catch this, but we can also optimistically update
      setMessages(prev => [...prev, result.message]);
    }
  };

  const getAvatarEmoji = (species: string) => {
    const map: Record<string, string> = {
      Fox: '🦊', Wolf: '🐺', Cat: '🐱', Dragon: '🐉', Owl: '🦉', Rabbit: '🐰'
    };
    return map[species] || '👤';
  };

  return (
    <div className="flex flex-col h-[calc(100dvh-80px)] md:h-[600px] border-[4px] border-ink-black shadow-[8px_8px_0px_0px_rgba(11,11,15,1)] bg-paper-white relative">
      {/* Header */}
      <div className="p-4 border-b-[3px] border-ink-black flex items-center gap-3 bg-marlboro-red text-paper-white z-10">
        <Link href="/communities" className="p-1 hover:bg-ink-black/20 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="font-bold uppercase tracking-widest leading-none">{community.name}</h2>
          {community.description && (
            <p className="text-[10px] font-medium opacity-80 mt-1 line-clamp-1">{community.description}</p>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-checkered relative"
      >
        <div className="absolute inset-0 bg-paper-white/80 pointer-events-none" />
        
        {messages.length === 0 ? (
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-ash-gray">
            <p className="font-bold uppercase tracking-widest text-sm text-center px-4">
              The room is empty. <br/> Strike a match to start the fire.
            </p>
          </div>
        ) : (
          messages.map(msg => {
            const isMe = msg.userId === currentUserId;
            return (
              <div key={msg.id} className={cn("relative z-10 flex gap-2 max-w-[85%]", isMe ? "self-end flex-row-reverse" : "self-start")}>
                <div className="w-8 h-8 shrink-0 bg-paper-white border-[2px] border-ink-black flex items-center justify-center text-sm shadow-[2px_2px_0px_0px_rgba(11,11,15,1)]">
                  {getAvatarEmoji(msg.user?.avatar_species || 'Fox')}
                </div>
                <div className={cn(
                  "border-[2px] border-ink-black p-3 relative shadow-[2px_2px_0px_0px_rgba(11,11,15,1)]",
                  isMe ? "bg-marlboro-red text-paper-white" : "bg-paper-white text-ink-black"
                )}>
                  {!isMe && (
                    <span className="font-bold text-[10px] uppercase tracking-widest opacity-60 block mb-1">
                      {msg.user?.anonymous_username}
                    </span>
                  )}
                  <p className="text-sm font-medium whitespace-pre-wrap">{msg.content}</p>
                  <span className="text-[9px] font-bold uppercase tracking-wider block mt-2 opacity-50 text-right">
                    {formatDistanceToNow(new Date(msg.created_at))} ago
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] sm:pb-4 border-t-[3px] border-ink-black bg-paper-white flex gap-2 z-10">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Say something..."
          className="flex-1 bg-paper-white border-[3px] border-ink-black p-3 text-ink-black font-medium text-sm focus:outline-none focus:border-marlboro-red focus:shadow-[4px_4px_0px_0px_rgba(225,29,72,0.2)] transition-all"
          disabled={isSending || !currentUserId}
        />
        <button
          type="submit"
          disabled={isSending || !content.trim() || !currentUserId}
          className={cn(
            "px-4 border-[3px] border-ink-black flex items-center justify-center transition-all",
            isSending || !content.trim() || !currentUserId
              ? "bg-paper-white text-ash-gray border-dashed cursor-not-allowed"
              : "bg-marlboro-red text-paper-white shadow-[4px_4px_0px_0px_rgba(11,11,15,1)] active:translate-y-1 active:shadow-none hover:bg-marlboro-red/90"
          )}
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
