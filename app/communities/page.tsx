import { CommunityCard } from "@/components/communities/CommunityCard";
import { PixelParticleBackground } from "@/components/ui/pixel/PixelParticleBackground";
import { Compass } from "lucide-react";
import { getCommunities } from "@/server/communities/actions";
import { getCurrentUser } from "@/server/auth/actions";

export const metadata = {
  title: "Communities | Smory",
};

export const dynamic = "force-dynamic";

export default async function CommunitiesPage() {
  const communities = await getCommunities();
  const user = await getCurrentUser();

  // Pre-assigned colors based on index for variety
  const colors = ["#0B0B0F", "#EAB308", "#22C55E", "#E11D48", "#F97316", "#3b82f6"];

  return (
    <div className="min-h-screen relative p-4 sm:p-6 lg:p-8 bg-checkered">
      <PixelParticleBackground type="dust" density={30} className="fixed inset-0 opacity-20 pointer-events-none z-0" />
      
      <div className="relative z-10 max-w-5xl mx-auto pt-8">
        <header className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-ink-black tracking-tight uppercase" style={{ textShadow: "3px 3px 0px rgba(11,11,15,0.1)" }}>
              Find Your Tribe
            </h1>
            <p className="text-marlboro-red text-sm mt-1 uppercase tracking-widest font-bold">Discover communities that fit your vibe</p>
          </div>
          <div className="bg-paper-white p-3 border-[3px] border-ink-black text-ink-black shadow-[4px_4px_0px_0px_rgba(11,11,15,1)]">
            <Compass size={24} strokeWidth={2.5} />
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-24">
          {communities.map((community, idx) => (
            <CommunityCard 
              key={community.id} 
              id={community.id}
              name={community.name}
              description={community.description || ""}
              memberCount={community._count?.members || 0}
              themeColor={colors[idx % colors.length]}
              isJoined={community.members && community.members.length > 0}
            />
          ))}
          {communities.length === 0 && (
            <div className="col-span-full text-center p-12 bg-paper-white border-[3px] border-ink-black shadow-[8px_8px_0px_0px_rgba(11,11,15,1)]">
              <p className="font-bold text-ink-black uppercase tracking-widest text-sm">No communities found. Run the seed script.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

