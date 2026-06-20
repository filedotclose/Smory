"use client";

import Link from "next/link";
import Image from "next/image";
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
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-paper-white/90 backdrop-blur-md border-t-[3px] border-ink-black pb-safe">
        <div className="flex justify-around items-center h-16 px-4">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            if (item.isPrimary) {
              return (
                <Link
                  id={`tour-nav-${item.label.toLowerCase()}`}
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-center -mt-6 rounded-full bg-marlboro-red text-paper-white p-4 shadow-[0px_4px_0px_0px_rgba(11,11,15,1)] border-[3px] border-ink-black active:translate-y-1 active:shadow-none transition-all"
                >
                  <Icon size={28} strokeWidth={2.5} />
                </Link>
              );
            }

            return (
              <Link
                id={`tour-nav-${item.label.toLowerCase()}`}
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center w-full h-full space-y-1 text-xs font-bold uppercase tracking-widest",
                  isActive ? "text-marlboro-red" : "text-ash-gray hover:text-ink-black transition-colors"
                )}
              >
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 fixed left-0 top-0 bottom-0 z-50 bg-paper-white border-r-[3px] border-ink-black p-6">
        <div className="mb-10 flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-marlboro-red border-[2px] border-ink-black shadow-[2px_2px_0px_0px_rgba(11,11,15,1)] overflow-hidden flex items-center justify-center p-0.5">
            <Image src="/icon-192x192.png" alt="Smory Logo" width={24} height={24} className="w-full h-full object-contain" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-ink-black">Smory</span>
        </div>

        <div className="flex flex-col gap-2">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                id={`tour-nav-desktop-${item.label.toLowerCase()}`}
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-4 px-4 py-3 border-[2px] border-transparent font-bold uppercase tracking-widest transition-all",
                  isActive 
                    ? "bg-ink-black text-paper-white shadow-[4px_4px_0px_0px_rgba(225,29,72,1)]" 
                    : "text-ash-gray hover:text-ink-black hover:border-ink-black hover:shadow-[4px_4px_0px_0px_rgba(11,11,15,0.1)]"
                )}
              >
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} className={isActive ? "text-marlboro-red" : ""} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </aside>
    </>
  );
}
