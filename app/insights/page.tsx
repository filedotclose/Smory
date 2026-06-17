import { DiscoveryTree } from "@/components/insights/DiscoveryTree";
import { InsightCard } from "@/components/insights/InsightCard";
import { PixelParticleBackground } from "@/components/ui/pixel/PixelParticleBackground";
import { Clock, TrendingDown, Target, Zap } from "lucide-react";

export const metadata = {
  title: "Insights & Discovery | Smory",
};

export default function InsightsPage() {
  return (
    <div className="min-h-screen relative p-4 sm:p-6 lg:p-8 bg-checkered">
      <PixelParticleBackground type="sparks" density={40} className="fixed inset-0 opacity-20 pointer-events-none z-0" />
      
      <div className="relative z-10 max-w-5xl mx-auto pt-8">
        <header className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-ink-black tracking-tight uppercase" style={{ textShadow: "3px 3px 0px rgba(11,11,15,0.1)" }}>
            Behavioral Insights
          </h1>
          <p className="text-marlboro-red text-sm mt-1 uppercase tracking-widest font-bold">Uncover your patterns</p>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <InsightCard title="Daily Avg" value="4.2" label="-1.1 this week" icon={<TrendingDown />} trend="down" />
          <InsightCard title="Peak Craving" value="2:00 PM" label="Post-lunch habit" icon={<Clock />} />
          <InsightCard title="Main Trigger" value="Stress" label="Accounted for 60%" icon={<Zap />} />
          <InsightCard title="Current Streak" value="3 Days" label="Personal best: 14" icon={<Target />} trend="up" />
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-bold text-ink-black mb-2 uppercase tracking-tight" style={{ textShadow: "2px 2px 0px rgba(11,11,15,0.1)" }}>
            Discovery Tree
          </h2>
          <p className="text-ash-gray text-xs font-bold uppercase tracking-widest mb-4">Unlock behavioral nodes to understand your subconscious loops</p>
          <DiscoveryTree />
        </div>
      </div>
    </div>
  );
}
