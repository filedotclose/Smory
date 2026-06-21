"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { InsightCard } from "./InsightCard";

export function PeakCravingTime({ timestamps }: { timestamps: string[] }) {
  const [peakTime, setPeakTime] = useState<string>("--");

  useEffect(() => {
    if (!timestamps || timestamps.length === 0) {
      setPeakTime("--");
      return;
    }

    const hourCounts = Array(24).fill(0);
    
    timestamps.forEach(ts => {
      // Create a Date object from the ISO string.
      // This will automatically convert the UTC time to the user's local timezone.
      const date = new Date(ts);
      hourCounts[date.getHours()]++;
    });

    const maxCount = Math.max(...hourCounts);
    
    // Check if maxCount is 0 just in case
    if (maxCount === 0) {
      setPeakTime("--");
      return;
    }

    const peakHour = hourCounts.indexOf(maxCount);
    
    const formattedTime = `${peakHour === 0 ? 12 : peakHour > 12 ? peakHour - 12 : peakHour}:00 ${peakHour >= 12 ? 'PM' : 'AM'}`;
    setPeakTime(formattedTime);
  }, [timestamps]);

  return (
    <InsightCard 
      title="Peak Craving" 
      value={peakTime} 
      label={timestamps.length === 0 ? "No data yet" : "Most frequent hour"} 
      icon={<Clock />} 
    />
  );
}
