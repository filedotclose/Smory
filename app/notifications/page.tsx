import { NotificationCard } from "@/components/notifications/NotificationCard";
import { PixelParticleBackground } from "@/components/ui/pixel/PixelParticleBackground";
import { PixelEmptyState } from "@/components/ui/pixel/PixelEmptyState";
import { Bell, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getNotifications, markNotificationsAsRead } from "@/server/notifications/actions";
import { getCurrentUser } from "@/server/auth/actions";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Alerts | Smory",
};

export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  const user = await getCurrentUser();
  if (!user) return redirect("/welcome");

  const notifications = await getNotifications();
  
  // Mark as read when they visit the page
  await markNotificationsAsRead();

  return (
    <div className="min-h-screen relative bg-checkered pb-24">
      <PixelParticleBackground type="dust" density={30} className="fixed inset-0 opacity-20 pointer-events-none z-0" />
      
      <div className="relative z-10 max-w-2xl mx-auto pt-8 px-4 sm:px-6 lg:px-8">
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/"
              className="bg-paper-white text-ink-black p-3 border-[3px] border-ink-black shadow-[4px_4px_0px_0px_rgba(11,11,15,1)] active:translate-y-1 active:shadow-none transition-all"
            >
              <ArrowLeft size={20} strokeWidth={2.5} />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-ink-black tracking-tight uppercase" style={{ textShadow: "3px 3px 0px rgba(11,11,15,0.1)" }}>
                The Board
              </h1>
              <p className="text-marlboro-red font-bold tracking-widest uppercase text-xs mt-1">Recent Activity</p>
            </div>
          </div>
          
          <div className="bg-paper-white p-3 border-[3px] border-ink-black text-ink-black shadow-[4px_4px_0px_0px_rgba(11,11,15,1)]">
            <Bell size={24} strokeWidth={2.5} />
          </div>
        </header>

        {notifications.length === 0 ? (
          <PixelEmptyState 
            title="All Quiet" 
            description="Your board is empty. Post something to the Ash Tray to get interactions." 
            icon={<Bell size={48} />}
          />
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {notifications.map((notification: any) => (
              <NotificationCard 
                key={notification.id} 
                notification={{
                  id: notification.id,
                  type: notification.type.toLowerCase(),
                  actor: {
                    username: notification.actor?.anonymous_username || "Someone",
                    species: notification.actor?.avatar_species || "Fox"
                  },
                  content: notification.content || notification.post?.content || "",
                  createdAt: notification.created_at,
                  isRead: notification.isRead,
                }} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
