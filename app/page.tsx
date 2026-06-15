import { PostCard } from "@/components/feed/PostCard";
import { getFeed } from "@/server/feed/actions";
import { PenSquare, Bell } from "lucide-react";
import Link from "next/link";
import { PixelParticleBackground } from "@/components/ui/pixel/PixelParticleBackground";

export const dynamic = "force-dynamic";

export default async function Home() {
  const posts = await getFeed();

  return (
    <div className="min-h-screen relative bg-checkered">
      <PixelParticleBackground type="dust" density={30} className="opacity-20" />
      
      <div className="relative z-10 max-w-2xl mx-auto pt-8 px-4 sm:px-6 lg:px-8 pb-32">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-ink-black tracking-tight uppercase" style={{ textShadow: "3px 3px 0px rgba(11,11,15,0.1)" }}>The Ash Tray</h1>
            <p className="text-marlboro-red font-bold tracking-widest uppercase text-xs mt-1">Real stories from the smoke break.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/notifications" className="bg-paper-white hover:bg-ash-gray/10 text-ink-black p-3 border-[3px] border-ink-black shadow-[4px_4px_0px_0px_rgba(11,11,15,1)] active:translate-y-1 active:shadow-none transition-all relative">
              <Bell size={20} strokeWidth={2.5} />
              {/* Unread indicator */}
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-marlboro-red border-[2px] border-ink-black flex items-center justify-center text-[8px] font-bold text-paper-white">3</div>
            </Link>
            <button className="bg-marlboro-red hover:bg-marlboro-red/90 text-paper-white p-3 border-[3px] border-ink-black shadow-[4px_4px_0px_0px_rgba(11,11,15,1)] active:translate-y-1 active:shadow-none transition-all flex items-center gap-2">
              <PenSquare size={20} />
              <span className="hidden sm:inline font-bold uppercase tracking-widest text-xs pr-1">Post</span>
            </button>
          </div>
        </header>

        <div className="space-y-6">
          {posts.length === 0 ? (
            <div className="text-center py-20 bg-paper-white border-[3px] border-ink-black shadow-[8px_8px_0px_0px_rgba(11,11,15,1)]">
              <p className="text-ink-black font-bold uppercase tracking-widest text-sm">No posts yet. Be the first to break the ice.</p>
            </div>
          ) : (
            posts.map((post) => (
              <PostCard key={post.id} post={post as any} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
