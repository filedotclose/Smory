"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, PlusCircle, BarChart2, User } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Feed", icon: Home },
  { href: "/communities", label: "Communities", icon: Users },
  { href: "/log", label: "Log", icon: PlusCircle, isPrimary: true },
  { href: "/insights", label: "Insights", icon: BarChart2 },
  { href: "/profile", label: "Profile", icon: User },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0B0B0F]/90 backdrop-blur-md border-t border-[#1D1D24] pb-safe">
        <div className="flex justify-around items-center h-16 px-4">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            if (item.isPrimary) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-center -mt-6 rounded-full bg-[#4DA6FF] text-[#0B0B0F] p-4 shadow-lg shadow-[#4DA6FF]/20"
                >
                  <Icon size={28} strokeWidth={2.5} />
                </Link>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center w-full h-full space-y-1 text-xs",
                  isActive ? "text-[#4DA6FF]" : "text-[#A1A1AA] hover:text-white transition-colors"
                )}
              >
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 fixed left-0 top-0 bottom-0 z-50 bg-[#0B0B0F] border-r border-[#1D1D24] p-6">
        <div className="mb-10 flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-[#4DA6FF]" /> {/* Logo Placeholder */}
          <span className="text-2xl font-bold tracking-tight text-white">Smory</span>
        </div>

        <div className="flex flex-col gap-2">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-4 px-4 py-3 rounded-2xl text-lg font-medium transition-all",
                  isActive 
                    ? "bg-[#1D1D24] text-white" 
                    : "text-[#A1A1AA] hover:text-white hover:bg-[#1D1D24]/50"
                )}
              >
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} className={isActive ? "text-[#4DA6FF]" : ""} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </aside>
    </>
  );
}
