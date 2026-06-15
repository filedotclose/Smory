"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell, PenSquare } from "lucide-react";
import { CreatePostModal } from "./CreatePostModal";

export function FeedHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 
            className="text-3xl font-bold text-ink-black tracking-tight uppercase" 
            style={{ textShadow: "3px 3px 0px rgba(11,11,15,0.1)" }}
          >
            Smory
          </h1>
          <p className="text-marlboro-red font-bold tracking-widest uppercase text-xs mt-1 animate-pulse">
            Real stories from the smoke break.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link 
            href="/notifications" 
            className="bg-paper-white hover:bg-ash-gray/10 text-ink-black p-3 border-[3px] border-ink-black shadow-[4px_4px_0px_0px_rgba(11,11,15,1)] active:translate-y-1 active:shadow-none transition-all relative block"
          >
            <Bell size={20} strokeWidth={2.5} />
            {/* Unread indicator */}
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-marlboro-red border-[2px] border-ink-black flex items-center justify-center text-[8px] font-bold text-paper-white">
              3
            </div>
          </Link>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-marlboro-red hover:bg-marlboro-red/90 text-paper-white p-3 border-[3px] border-ink-black shadow-[4px_4px_0px_0px_rgba(11,11,15,1)] active:translate-y-1 active:shadow-none transition-all flex items-center gap-2 cursor-pointer"
          >
            <PenSquare size={20} />
            <span className="hidden sm:inline font-bold uppercase tracking-widest text-xs pr-1">Post</span>
          </button>
        </div>
      </header>

      <CreatePostModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
