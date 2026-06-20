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
    <div className="h-[100dvh] w-full flex flex-col relative bg-paper-white overflow-hidden">
      <CommunityChat 
        community={community}
        initialMessages={messages}
        currentUserId={user?.id}
        supabaseUrl={process.env.NEXT_PUBLIC_SUPABASE_URL || ""}
        supabaseAnonKey={process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""}
      />
    </div>
  );
}
