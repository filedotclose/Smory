import { PostCard } from "@/components/feed/PostCard";
import { getFeed } from "@/server/feed/actions";
import { PixelParticleBackground } from "@/components/ui/pixel/PixelParticleBackground";
import { FeedHeader } from "@/components/feed/FeedHeader";

export const dynamic = "force-dynamic";

export default async function Home() {
  const posts = await getFeed();

  return (
    <div className="min-h-screen relative bg-checkered">
      <PixelParticleBackground type="dust" density={30} className="opacity-20" />
      
      <div className="relative z-10 max-w-2xl mx-auto pt-8 px-4 sm:px-6 lg:px-8 pb-32">
        <FeedHeader />

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
