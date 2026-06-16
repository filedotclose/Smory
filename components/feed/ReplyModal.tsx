"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Trash2 } from "lucide-react";
import { PixelCard } from "@/components/ui/pixel/PixelCard";
import { cn } from "@/lib/utils";
import { getReplies, createReply, deleteReply } from "@/server/feed/social-actions";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

interface ReplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
  currentUserId?: string;
}

export function ReplyModal({ isOpen, onClose, postId, currentUserId }: ReplyModalProps) {
  const [replies, setReplies] = useState<any[]>([]);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsFetching(true);
      getReplies(postId).then(data => {
        setReplies(data);
        setIsFetching(false);
      });
    }
  }, [isOpen, postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsLoading(true);
    const result = await createReply(postId, content);
    setIsLoading(false);

    if (result.error) {
      toast.error(result.error);
    } else if (result.reply) {
      setReplies(prev => [...prev, result.reply]);
      setContent("");
      toast.success("Reply added");
    }
  };

  const handleDelete = async (replyId: string) => {
    const result = await deleteReply(replyId);
    if (result.error) {
      toast.error(result.error);
    } else {
      setReplies(prev => prev.filter(r => r.id !== replyId));
      toast.success("Reply deleted");
    }
  };

  const getAvatarEmoji = (species: string) => {
    const map: Record<string, string> = {
      Fox: '🦊', Wolf: '🐺', Cat: '🐱', Dragon: '🐉', Owl: '🦉', Rabbit: '🐰'
    };
    return map[species] || '👤';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[250] flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-none">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-ink-black/80 backdrop-blur-sm pointer-events-auto"
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative z-10 w-full max-w-lg h-[80vh] sm:h-[600px] pointer-events-auto flex flex-col bg-paper-white sm:border-[4px] sm:border-ink-black sm:shadow-[8px_8px_0px_0px_rgba(11,11,15,1)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b-[3px] border-ink-black/10 bg-paper-white z-20">
              <h2 className="text-lg font-bold text-ink-black uppercase tracking-tight">Replies</h2>
              <button
                onClick={onClose}
                className="text-ink-black hover:bg-marlboro-red hover:text-paper-white p-1 border-[2px] border-transparent hover:border-ink-black transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Replies List */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-checkered relative">
              {isFetching ? (
                <div className="text-center text-ash-gray font-bold uppercase text-xs p-4">Loading replies...</div>
              ) : replies.length === 0 ? (
                <div className="text-center text-ash-gray font-bold uppercase text-xs p-8 bg-paper-white border-[2px] border-ink-black/20">
                  No replies yet. Be the first to add to the story.
                </div>
              ) : (
                replies.map(reply => (
                  <div key={reply.id} className="flex gap-3 items-start group">
                    <div className="w-8 h-8 shrink-0 bg-paper-white border-[2px] border-ink-black flex items-center justify-center text-sm shadow-[2px_2px_0px_0px_rgba(11,11,15,1)]">
                      {getAvatarEmoji(reply.user.avatar_species)}
                    </div>
                    <div className="flex-1 bg-paper-white border-[2px] border-ink-black p-3 relative shadow-[2px_2px_0px_0px_rgba(11,11,15,1)]">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-ink-black text-sm">{reply.user.anonymous_username}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-ash-gray uppercase font-bold">
                            {formatDistanceToNow(new Date(reply.created_at), { addSuffix: true })}
                          </span>
                          {currentUserId === reply.userId && (
                            <button 
                              onClick={() => handleDelete(reply.id)}
                              className="text-ash-gray hover:text-marlboro-red transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="text-ink-black text-sm font-medium whitespace-pre-wrap">{reply.content}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSubmit} className="p-4 border-t-[3px] border-ink-black/10 bg-paper-white flex gap-2 z-20">
              <input
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Add a reply..."
                className="flex-1 bg-paper-white border-[3px] border-ink-black p-3 text-ink-black font-medium text-sm focus:outline-none focus:border-marlboro-red focus:shadow-[4px_4px_0px_0px_rgba(225,29,72,0.2)] transition-all"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !content.trim()}
                className={cn(
                  "px-4 border-[3px] border-ink-black flex items-center justify-center transition-all",
                  isLoading || !content.trim()
                    ? "bg-paper-white text-ash-gray border-dashed cursor-not-allowed"
                    : "bg-marlboro-red text-paper-white shadow-[4px_4px_0px_0px_rgba(11,11,15,1)] active:translate-y-1 active:shadow-none hover:bg-marlboro-red/90"
                )}
              >
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
