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
    <PixelCard className="flex flex-col h-full bg-[#16161C]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[#A1A1AA] text-xs font-bold uppercase tracking-widest">{title}</h3>
        {icon && <div className="text-[#4DA6FF]">{icon}</div>}
      </div>
      
      <div className="mt-auto">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-white tracking-tight" style={{ textShadow: "2px 2px 0px rgba(0,0,0,0.5)" }}>
            {value}
          </span>
          {trend === "up" && <span className="text-[#EC4899] text-sm font-bold">↑</span>}
          {trend === "down" && <span className="text-[#22C55E] text-sm font-bold">↓</span>}
        </div>
        {label && <p className="text-[#A1A1AA] text-xs font-medium mt-1">{label}</p>}
      </div>
    </PixelCard>
  );
}
