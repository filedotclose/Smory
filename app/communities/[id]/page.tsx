import { getCommunity, getMessages } from "@/server/communities/actions";
import { getCurrentUser } from "@/server/auth/actions";
import { CommunityChat } from "@/components/communities/CommunityChat";
import { notFound } from "next/navigation";
import { PixelParticleBackground } from "@/components/ui/pixel/PixelParticleBackground";

export const dynamic = "force-dynamic";

export default async function CommunityPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const community = await getCommunity(params.id);
  
  if (!community) {
    notFound();
  }

  const messages = await getMessages(params.id);
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen relative p-4 sm:p-6 lg:p-8 bg-checkered flex items-center justify-center">
      <PixelParticleBackground type="dust" density={30} className="fixed inset-0 opacity-20 pointer-events-none z-0" />
      
      <div className="relative z-10 w-full max-w-3xl">
        <CommunityChat 
          community={community}
          initialMessages={messages}
          currentUserId={user?.id}
          supabaseUrl={process.env.NEXT_PUBLIC_SUPABASE_URL || ""}
          supabaseAnonKey={process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""}
        />
      </div>
    </div>
  );
}
