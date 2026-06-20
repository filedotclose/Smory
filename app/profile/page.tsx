import { ProfileAvatarSection } from "@/components/profile/ProfileAvatarSection";
import { BadgeGrid } from "@/components/profile/BadgeGrid";
import { PixelParticleBackground } from "@/components/ui/pixel/PixelParticleBackground";
import { getCurrentUser, logout } from "@/server/auth/actions";
import { getProfileStats } from "@/server/profile/actions";
import { getFriends, getPendingRequests } from "@/server/friends/actions";
import { redirect } from "next/navigation";
import { Settings } from "lucide-react";
import Link from "next/link";
import { FriendsSection } from "@/components/profile/FriendsSection";

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
  const { logsCount, streak, badgesCount, brandCounts } = await getProfileStats();

  return (
    <div className="min-h-screen relative pb-24 bg-checkered overflow-hidden">
      <PixelParticleBackground type="dust" density={30} className="fixed inset-0 z-0 opacity-30 pointer-events-none" />
      
      {/* Playful Neo-Brutalist Sticker Details */}
      <div className="absolute top-24 left-6 -rotate-12 hidden lg:block select-none pointer-events-none z-20">
        <div className="bg-ink-black text-paper-white text-[9px] font-black uppercase tracking-widest px-3 py-1 border-[3px] border-ink-black shadow-[4px_4px_0px_0px_rgba(225,29,72,1)]">
          🚭 SMOKING AREA
        </div>
      </div>
      <div className="absolute top-48 right-8 rotate-12 hidden lg:block select-none pointer-events-none z-20">
        <div className="bg-filter-gold text-ink-black text-[9px] font-black uppercase tracking-widest px-3 py-1 border-[3px] border-ink-black shadow-[4px_4px_0px_0px_rgba(11,11,15,1)]">
          ✨ 100% TOXIC HABITS
        </div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <header className="flex justify-between items-center p-4 sm:p-6 max-w-4xl mx-auto">
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
          <Link 
            href="/settings"
            className="bg-paper-white text-ink-black hover:text-marlboro-red p-3 border-[3px] border-ink-black shadow-[4px_4px_0px_0px_rgba(11,11,15,1)] active:translate-y-1 active:shadow-none transition-all flex items-center gap-2 cursor-pointer"
          >
            <Settings size={18} strokeWidth={2.5} />
            <span className="text-xs font-bold uppercase tracking-widest hidden sm:inline">Settings</span>
          </Link>
        </header>

        {/* Bento Box Main Section */}
        <div className="max-w-4xl mx-auto px-4 mt-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            
            {/* Bento Block 1: Profile Card (Spans 2 columns) */}
            <div className="col-span-1 md:col-span-2 flex">
              <ProfileAvatarSection 
                username={user.anonymous_username} 
                displayName={user.display_name}
                species={user.avatar_species || "Fox"} 
                joinDate={new Date(user.created_at).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                logsCount={logsCount}
              />
            </div>

            {/* Bento Block 2: Quick Stats Sub-grid (Spans 1 column, holds 3 widgets) */}
            <div className="col-span-1 flex flex-col justify-between gap-4 py-6">
              
              {/* Logs Widget */}
              <div className="bg-paper-white border-[3px] border-ink-black p-4 shadow-[4px_4px_0px_0px_rgba(11,11,15,1)] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(11,11,15,1)] transition-all flex flex-col justify-center">
                <span className="text-[9px] font-black text-ash-gray uppercase tracking-widest block mb-0.5">Total Logs</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-ink-black tracking-tight">{logsCount}</span>
                  <span className="text-[10px] font-bold text-ash-gray uppercase">Recorded</span>
                </div>
              </div>

              {/* Streak Widget */}
              <div className="bg-paper-white border-[3px] border-ink-black p-4 shadow-[4px_4px_0px_0px_rgba(11,11,15,1)] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(225,29,72,1)] hover:border-marlboro-red transition-all relative overflow-hidden flex flex-col justify-center">
                <span className="text-[9px] font-black text-ash-gray uppercase tracking-widest block mb-0.5">Current Streak</span>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-black text-marlboro-red tracking-tight flex items-center gap-1">
                    {streak} <span className="text-xl">🔥</span>
                  </span>
                  <span className="text-[10px] font-bold text-ash-gray uppercase">Days</span>
                </div>
                <p className="text-[8px] text-ash-gray font-bold uppercase mt-1 tracking-wider leading-none">
                  Login everyday to maintain streak
                </p>
              </div>

              {/* Badges Widget */}
              <div className="bg-paper-white border-[3px] border-ink-black p-4 shadow-[4px_4px_0px_0px_rgba(11,11,15,1)] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(234,179,8,1)] hover:border-filter-gold transition-all flex flex-col justify-center">
                <span className="text-[9px] font-black text-ash-gray uppercase tracking-widest block mb-0.5">Badges Earned</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-filter-gold tracking-tight">{badgesCount}</span>
                  <span className="text-[10px] font-bold text-ash-gray uppercase">Unlocked</span>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Social Network Section */}
        <FriendsSection initialFriends={friends} initialRequests={requests} />

        {/* Badge Collection Section */}
        <BadgeGrid brandCounts={brandCounts} />

      </div>
    </div>
  );
}
