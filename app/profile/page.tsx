import { ProfileAvatarSection } from "@/components/profile/ProfileAvatarSection";
import { BadgeGrid } from "@/components/profile/BadgeGrid";
import { PixelParticleBackground } from "@/components/ui/pixel/PixelParticleBackground";
import { PixelCard } from "@/components/ui/pixel/PixelCard";
import { getCurrentUser } from "@/server/auth/actions";
import { redirect } from "next/navigation";
import { LogOut } from "lucide-react";
import { logout } from "@/server/auth/actions";

export const metadata = {
  title: "Profile | Smory",
};

export default async function ProfilePage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/auth");
  }

  return (
    <div className="min-h-screen relative pb-24">
      {/* Profile specific background (Coffee shop vibe) */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-20 pointer-events-none"
        style={{ backgroundImage: "url('/pixel-coffee-shop.png')", imageRendering: "pixelated" }}
      />
      <PixelParticleBackground type="dust" density={40} className="fixed inset-0 z-0 opacity-40 mix-blend-screen pointer-events-none" />
      
      <div className="relative z-10">
        <header className="flex justify-between items-center p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-white tracking-tight uppercase" style={{ textShadow: "2px 2px 0px rgba(0,0,0,0.5)" }}>
            Character Card
          </h1>
          <form action={logout}>
            <button 
              type="submit"
              className="bg-[#1D1D24] text-[#A1A1AA] hover:text-[#EF4444] p-3 rounded-xl border border-[#2D2D36] transition-colors flex items-center gap-2"
            >
              <LogOut size={18} />
              <span className="text-xs font-bold uppercase tracking-widest hidden sm:inline">Logout</span>
            </button>
          </form>
        </header>

        <ProfileAvatarSection 
          username={user.anonymous_username || "Anonymous Smoker"} 
          species={user.avatar_species || "Fox"} 
          joinDate={new Date(user.created_at).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
        />

        <div className="max-w-4xl mx-auto px-4 mt-8 mb-12">
          <div className="grid grid-cols-3 gap-4">
            <PixelCard className="text-center p-4">
              <p className="text-3xl font-bold text-white mb-1" style={{ textShadow: "2px 2px 0px rgba(0,0,0,0.5)" }}>12</p>
              <p className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-widest">Logs</p>
            </PixelCard>
            <PixelCard className="text-center p-4">
              <p className="text-3xl font-bold text-[#4DA6FF] mb-1" style={{ textShadow: "2px 2px 0px rgba(0,0,0,0.5)" }}>3</p>
              <p className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-widest">Streak</p>
            </PixelCard>
            <PixelCard className="text-center p-4">
              <p className="text-3xl font-bold text-[#EAB308] mb-1" style={{ textShadow: "2px 2px 0px rgba(0,0,0,0.5)" }}>2</p>
              <p className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-widest">Badges</p>
            </PixelCard>
          </div>
        </div>

        <BadgeGrid />
      </div>
    </div>
  );
}
