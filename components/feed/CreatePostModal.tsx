"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PixelCard } from "@/components/ui/pixel/PixelCard";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { X, Send, Globe, Users, PenSquare } from "lucide-react";
import { createPost } from "@/server/feed/actions";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreatePostModal({ isOpen, onClose }: CreatePostModalProps) {
  const [content, setContent] = useState("");
  const [audience, setAudience] = useState<"PUBLIC" | "FRIENDS">("PUBLIC");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setContent("");
      setAudience("PUBLIC");
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      toast.error("Post content cannot be empty.");
      return;
    }

    if (content.length > 280) {
      toast.error("Post content cannot exceed 280 characters.");
      return;
    }

    setIsLoading(true);
    const result = await createPost(content, audience);
    setIsLoading(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Post created successfully! 🚬", {
        className: "border-[3px] border-ink-black shadow-[4px_4px_0px_0px_rgba(11,11,15,1)] rounded-none font-bold text-ink-black"
      });
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
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
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="relative z-10 w-full max-w-lg pointer-events-auto"
          >
            <PixelCard className="p-6 md:p-8 bg-paper-white border-[4px] border-ink-black shadow-[8px_8px_0px_0px_rgba(11,11,15,1)]">
              {/* Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b-[3px] border-ink-black/10">
                <div className="flex items-center gap-2">
                  <PenSquare className="text-marlboro-red" size={24} />
                  <h2 className="text-2xl font-bold text-ink-black uppercase tracking-tight">
                    Share a Story
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="bg-paper-white text-ink-black hover:bg-marlboro-red hover:text-paper-white p-1.5 border-[2px] border-ink-black transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {/* Audience Selector */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-ink-black font-bold uppercase tracking-widest flex items-center gap-1.5">
                    Select Audience
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setAudience("PUBLIC")}
                      className={cn(
                        "flex-1 py-3 px-4 flex items-center justify-center gap-2 border-[3px] font-bold text-xs uppercase tracking-widest transition-all",
                        audience === "PUBLIC" 
                          ? "bg-marlboro-red text-paper-white border-ink-black shadow-[4px_4px_0px_0px_rgba(11,11,15,1)]" 
                          : "bg-paper-white text-ink-black border-ink-black hover:bg-marlboro-red/10"
                      )}
                    >
                      <Globe size={16} />
                      Public
                    </button>
                    <button
                      type="button"
                      onClick={() => setAudience("FRIENDS")}
                      className={cn(
                        "flex-1 py-3 px-4 flex items-center justify-center gap-2 border-[3px] font-bold text-xs uppercase tracking-widest transition-all",
                        audience === "FRIENDS" 
                          ? "bg-marlboro-red text-paper-white border-ink-black shadow-[4px_4px_0px_0px_rgba(11,11,15,1)]" 
                          : "bg-paper-white text-ink-black border-ink-black hover:bg-marlboro-red/10"
                      )}
                    >
                      <Users size={16} />
                      Friends Only
                    </button>
                  </div>
                </div>

                {/* Content Textarea */}
                <div className="flex flex-col gap-2 relative">
                  <label className="text-xs text-ink-black font-bold uppercase tracking-widest">
                    Your Story
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value.slice(0, 280))}
                    disabled={isLoading}
                    placeholder="Real stories from the smoke break... what's on your mind?"
                    rows={5}
                    required
                    className="w-full bg-paper-white border-[3px] border-ink-black p-4 text-ink-black focus:outline-none focus:border-marlboro-red focus:shadow-[4px_4px_0px_0px_rgba(225,29,72,0.2)] transition-all font-medium text-sm leading-relaxed resize-none"
                  />
                  {/* Counter */}
                  <div className="absolute bottom-3 right-3 text-[10px] font-bold uppercase tracking-wider text-ash-gray bg-paper-white px-1 border border-ink-black/25">
                    {content.length} / 280
                  </div>
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={isLoading || !content.trim()}
                  className={cn(
                    "w-full py-4 font-bold uppercase tracking-widest border-[3px] border-ink-black shadow-[4px_4px_0px_0px_rgba(11,11,15,1)] flex items-center justify-center gap-2 transition-all",
                    isLoading || !content.trim()
                      ? "bg-paper-white text-ash-gray border-dashed cursor-not-allowed shadow-none"
                      : "bg-marlboro-red text-paper-white hover:bg-marlboro-red/90 active:translate-y-1 active:shadow-none"
                  )}
                >
                  <Send size={16} />
                  <span>{isLoading ? "Publishing..." : "Send to Feed"}</span>
                </button>
              </form>
            </PixelCard>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
