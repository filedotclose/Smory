"use client";

import { motion } from "framer-motion";
import { Lock, Unlock, Zap, Brain, Flame, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import confetti from "canvas-confetti";

import { LucideIcon } from "lucide-react";

interface Node {
  id: string;
  label: string;
  icon: LucideIcon;
  status: "locked" | "available" | "unlocked";
  x: number; // grid position X (0-10)
  y: number; // grid position Y (0-10)
}

const NODES: Node[] = [
  { id: "1", label: "First Smoke", icon: Flame, status: "unlocked", x: 5, y: 8 },
  { id: "2", label: "7 Day Streak", icon: Activity, status: "available", x: 5, y: 5 },
  { id: "3", label: "Pattern Recognition", icon: Brain, status: "locked", x: 2, y: 3 },
  { id: "4", label: "Trigger Master", icon: Zap, status: "locked", x: 8, y: 3 },
  { id: "5", label: "Zen Mode", icon: Unlock, status: "locked", x: 5, y: 1 },
];

const CONNECTIONS = [
  { from: "1", to: "2" },
  { from: "2", to: "3" },
  { from: "2", to: "4" },
  { from: "3", to: "5" },
  { from: "4", to: "5" },
];

export function DiscoveryTree() {
  const triggerUnlock = (node: Node) => {
    if (node.status === "locked") {
      toast("Prerequisites not met. Keep logging to unlock.", { icon: "🔒" });
      return;
    }
    if (node.status === "unlocked") return;

    // Simulate unlock
    toast.success(`Unlocked: ${node.label}!`, {
      className: "border-[3px] border-ink-black shadow-[4px_4px_0px_0px_rgba(11,11,15,1)] rounded-none font-bold text-ink-black"
    });
    
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#E11D48', '#EAB308'],
      shapes: ['square']
    });
  };

  return (
    <div className="relative w-full aspect-square md:aspect-video bg-paper-white border-[3px] border-ink-black shadow-[8px_8px_0px_0px_rgba(11,11,15,1)] overflow-hidden">
      {/* Background Grid */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(#0B0B0F 1px, transparent 1px), linear-gradient(90deg, #0B0B0F 1px, transparent 1px)",
          backgroundSize: "40px 40px"
        }}
      />
      
      {/* Simple Connection Lines (using SVG) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {CONNECTIONS.map((conn, idx) => {
          const fromNode = NODES.find(n => n.id === conn.from);
          const toNode = NODES.find(n => n.id === conn.to);
          if (!fromNode || !toNode) return null;
          
          const isUnlocked = fromNode.status === "unlocked" && toNode.status === "unlocked";
          const isAvailable = fromNode.status === "unlocked" && toNode.status === "available";
          
          return (
            <line 
              key={idx}
              x1={`${fromNode.x * 10}%`} 
              y1={`${fromNode.y * 10}%`} 
              x2={`${toNode.x * 10}%`} 
              y2={`${toNode.y * 10}%`} 
              stroke={isUnlocked ? "#E11D48" : isAvailable ? "#A1A1AA" : "#e4e4e7"} 
              strokeWidth={isUnlocked ? 4 : 2}
              strokeDasharray={isUnlocked ? "none" : "4 4"}
              className="transition-colors duration-1000"
            />
          );
        })}
      </svg>

      {/* Nodes */}
      {NODES.map((node) => {
        const Icon = node.icon;
        const isUnlocked = node.status === "unlocked";
        const isAvailable = node.status === "available";
        const isLocked = node.status === "locked";

        return (
          <motion.div
            key={node.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
            style={{ left: `${node.x * 10}%`, top: `${node.y * 10}%` }}
            whileHover={!isLocked ? { scale: 1.1 } : {}}
            whileTap={!isLocked ? { scale: 0.95 } : {}}
            onClick={() => triggerUnlock(node)}
          >
            <div className={cn(
              "w-12 h-12 flex items-center justify-center border-[3px] shadow-[4px_4px_0px_0px_rgba(11,11,15,1)] cursor-pointer transition-colors duration-500",
              isUnlocked ? "bg-marlboro-red border-ink-black text-paper-white" :
              isAvailable ? "bg-paper-white border-marlboro-red text-marlboro-red shadow-[0_0_15px_rgba(225,29,72,0.5)] animate-pulse" :
              "bg-e4e4e7 border-ash-gray text-ash-gray shadow-[4px_4px_0px_0px_rgba(161,161,170,0.5)]"
            )}>
              {isLocked ? <Lock size={20} /> : <Icon size={24} strokeWidth={2.5} />}
            </div>
            
            <div className="mt-2 text-center w-24">
              <span className={cn(
                "text-[10px] font-bold uppercase tracking-widest",
                isUnlocked ? "text-ink-black" :
                isAvailable ? "text-marlboro-red" :
                "text-ash-gray"
              )}>
                {node.label}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
