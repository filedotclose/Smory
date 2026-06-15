import { NotificationCard, NotificationProps } from "@/components/notifications/NotificationCard";
import { PixelParticleBackground } from "@/components/ui/pixel/PixelParticleBackground";
import { PixelEmptyState } from "@/components/ui/pixel/PixelEmptyState";
import { Bell, ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Alerts | Smory",
};

// Mock data for the MVP
const MOCK_NOTIFICATIONS: NotificationProps[] = [
  {
    id: "1",
    type: "puff",
    actor: { username: "Anonymous_Fox_99", species: "Fox" },
    content: "Took my first break at 2 AM. The quiet was nice.",
    createdAt: new Date(Date.now() - 1000 * 60 * 5), // 5 mins ago
    isRead: false,
  },
  {
    id: "2",
    type: "insight",
    actor: { username: "Night_Owl_22", species: "Owl" },
    content: "It's always the stress that gets me.",
    createdAt: new Date(Date.now() - 1000 * 60 * 45), // 45 mins ago
    isRead: false,
  },
  {
    id: "3",
    type: "reply",
    actor: { username: "City_Cat_01", species: "Cat" },
    content: "I totally feel this. Coffee makes it worse sometimes though.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    isRead: true,
  },
  {
    id: "4",
    type: "puff",
    actor: { username: "Lone_Wolf_77", species: "Wolf" },
    content: "Finally hit my 3 day streak.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    isRead: true,
  },
];

export default function NotificationsPage() {
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

        {MOCK_NOTIFICATIONS.length === 0 ? (
          <PixelEmptyState 
            title="All Quiet" 
            description="Your board is empty. Post something to the Ash Tray to get interactions." 
            icon={<Bell size={48} />}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {MOCK_NOTIFICATIONS.map((notification) => (
              <NotificationCard key={notification.id} notification={notification} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
