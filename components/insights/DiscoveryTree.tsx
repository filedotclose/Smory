"use client";

import { motion } from "framer-motion";
import { Lock, Unlock, Zap, Brain, Flame, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import confetti from "canvas-confetti";

interface Node {
  id: string;
  label: string;
  icon: any;
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
      className: "border-2 border-[#0B0B0F] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] rounded-none font-bold"
    });
    
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#4DA6FF', '#EAB308'],
      shapes: ['square']
    });
  };

  return (
    <div className="relative w-full aspect-square md:aspect-video bg-[#16161C] border-[3px] border-[#2D2D36] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] overflow-hidden">
      {/* Background Grid */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(#2D2D36 1px, transparent 1px), linear-gradient(90deg, #2D2D36 1px, transparent 1px)",
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
              stroke={isUnlocked ? "#4DA6FF" : isAvailable ? "#2D2D36" : "#1D1D24"} 
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
              "w-12 h-12 flex items-center justify-center border-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)] cursor-pointer transition-colors duration-500",
              isUnlocked ? "bg-[#4DA6FF] border-[#0B0B0F] text-[#0B0B0F]" :
              isAvailable ? "bg-[#1D1D24] border-[#4DA6FF] text-[#4DA6FF] shadow-[0_0_15px_rgba(77,166,255,0.3)] animate-pulse" :
              "bg-[#0B0B0F] border-[#2D2D36] text-[#2D2D36]"
            )}>
              {isLocked ? <Lock size={20} /> : <Icon size={24} strokeWidth={2.5} />}
            </div>
            
            <div className="mt-2 text-center w-24">
              <span className={cn(
                "text-[10px] font-bold uppercase tracking-widest",
                isUnlocked ? "text-white drop-shadow-[1px_1px_0_rgba(0,0,0,1)]" :
                isAvailable ? "text-[#4DA6FF]" :
                "text-[#2D2D36]"
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
