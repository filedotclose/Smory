import { PixelCard } from "@/components/ui/pixel/PixelCard";
import { ReactNode } from "react";

interface InsightCardProps {
  title: string;
  value: string | number;
  label?: string;
  icon?: ReactNode;
  trend?: "up" | "down" | "neutral";
}

export function InsightCard({ title, value, label, icon, trend }: InsightCardProps) {
  return (
    <PixelCard className="flex flex-col h-full bg-paper-white shadow-[4px_4px_0px_0px_rgba(11,11,15,1)]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-ink-black text-xs font-bold uppercase tracking-widest">{title}</h3>
        {icon && <div className="text-marlboro-red">{icon}</div>}
      </div>
      
      <div className="mt-auto">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-ink-black tracking-tight" style={{ textShadow: "2px 2px 0px rgba(11,11,15,0.1)" }}>
            {value}
          </span>
          {trend === "up" && <span className="text-[#22C55E] text-sm font-bold">↑</span>}
          {trend === "down" && <span className="text-marlboro-red text-sm font-bold">↓</span>}
        </div>
        {label && <p className="text-ash-gray text-xs font-bold mt-1 uppercase tracking-widest">{label}</p>}
      </div>
    </PixelCard>
  );
}
