import { ProfileAvatarSection } from "@/components/profile/ProfileAvatarSection";
import { BadgeGrid } from "@/components/profile/BadgeGrid";
import { PixelParticleBackground } from "@/components/ui/pixel/PixelParticleBackground";
import { PixelCard } from "@/components/ui/pixel/PixelCard";
import { getCurrentUser, logout } from "@/server/auth/actions";
import { getFriends, getPendingRequests } from "@/server/friends/actions";
import { redirect } from "next/navigation";
import { LogOut } from "lucide-react";
import { FriendsSection } from "@/components/profile/FriendsSection";
import { PushNotificationSettings } from "@/components/profile/PushNotificationSettings";

export const metadata = {
  title: "Profile | Smory",
};

export default async function ProfilePage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/auth");
  }

  const friends = await getFriends();
  const requests = await getPendingRequests();

  return (
    <div className="min-h-screen relative pb-24 bg-checkered">
      <PixelParticleBackground type="dust" density={40} className="fixed inset-0 z-0 opacity-40 pointer-events-none" />
      
      <div className="relative z-10">
        <header className="flex justify-between items-center p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 16 16" className="w-8 h-8 sm:w-10 sm:h-10 text-ink-black" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 2h10v12H3V2z" fill="#F8F8F2" stroke="currentColor" strokeWidth="2" />
              <path d="M3 6h10v2H3V6z" fill="#E11D48" />
              <path d="M6 2v4M8 2v4M10 2v4" stroke="currentColor" strokeWidth="2" />
            </svg>
            <h1 className="text-3xl sm:text-4xl font-bold text-ink-black tracking-tight uppercase" style={{ textShadow: "3px 3px 0px rgba(11,11,15,0.1)" }}>
              Your Case
            </h1>
          </div>
          <form action={logout}>
            <button 
              type="submit"
              className="bg-paper-white text-ink-black hover:text-marlboro-red p-3 border-[3px] border-ink-black shadow-[4px_4px_0px_0px_rgba(11,11,15,1)] active:translate-y-1 active:shadow-none transition-all flex items-center gap-2"
            >
              <LogOut size={18} strokeWidth={2.5} />
              <span className="text-xs font-bold uppercase tracking-widest hidden sm:inline">Logout</span>
            </button>
          </form>
        </header>

        <ProfileAvatarSection 
          username={user.anonymous_username || "Anonymous Smoker"} 
          species={user.avatar_species || "Fox"} 
          joinDate={new Date(user.created_at).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
        />

        <div className="max-w-4xl mx-auto px-4 mt-8 mb-8">
          <div className="grid grid-cols-3 gap-4">
            <PixelCard className="text-center p-4">
              <p className="text-3xl font-bold text-ink-black mb-1" style={{ textShadow: "2px 2px 0px rgba(11,11,15,0.1)" }}>12</p>
              <p className="text-[10px] font-bold text-ash-gray uppercase tracking-widest">Logs</p>
            </PixelCard>
            <PixelCard className="text-center p-4">
              <p className="text-3xl font-bold text-marlboro-red mb-1" style={{ textShadow: "2px 2px 0px rgba(11,11,15,0.1)" }}>3</p>
              <p className="text-[10px] font-bold text-ash-gray uppercase tracking-widest">Streak</p>
            </PixelCard>
            <PixelCard className="text-center p-4">
              <p className="text-3xl font-bold text-filter-gold mb-1" style={{ textShadow: "2px 2px 0px rgba(11,11,15,0.1)" }}>2</p>
              <p className="text-[10px] font-bold text-ash-gray uppercase tracking-widest">Badges</p>
            </PixelCard>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 mt-8 mb-8">
          <PushNotificationSettings />
        </div>

        <FriendsSection initialFriends={friends} initialRequests={requests} />

        <BadgeGrid />
      </div>
    </div>
  );
}
