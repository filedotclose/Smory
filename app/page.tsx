import { PostCard } from "@/components/feed/PostCard";
import { getFeed } from "@/server/feed/actions";
import { PenSquare } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Home() {
  const posts = await getFeed();

  return (
    <div className="min-h-screen relative">
      <div className="relative z-10 max-w-2xl mx-auto pt-8 px-4 sm:px-6 lg:px-8 pb-32">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">The Ash Tray</h1>
            <p className="text-[#A1A1AA] text-sm mt-1">Real stories from the smoke break.</p>
          </div>
          <button className="bg-[#4DA6FF] hover:bg-[#3b82f6] text-white p-3 rounded-2xl shadow-lg shadow-[#4DA6FF]/20 transition-all active:scale-95 flex items-center gap-2">
            <PenSquare size={20} />
            <span className="hidden sm:inline font-medium pr-1">Post</span>
          </button>
        </header>

        <div className="space-y-4">
          {posts.length === 0 ? (
            <div className="text-center py-20 bg-[#1D1D24] rounded-3xl border border-[#2D2D36]">
              <p className="text-[#A1A1AA]">No posts yet. Be the first to break the ice.</p>
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
