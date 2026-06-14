import { CommunityCard } from "@/components/communities/CommunityCard";
import { PixelParticleBackground } from "@/components/ui/pixel/PixelParticleBackground";
import { Compass } from "lucide-react";

export const metadata = {
  title: "Communities | Smory",
};

const COMMUNITIES = [
  {
    id: "1",
    name: "Night Owls",
    description: "For those who find their peace between 1 AM and 4 AM. Dark thoughts, deep reflections, and the quiet crackle of burning paper.",
    memberCount: 1420,
    themeColor: "#4DA6FF" // Blue
  },
  {
    id: "2",
    name: "Coffee & Cigarettes",
    description: "The classic combination. Discussing morning routines, the perfect roast, and the first drag of the day.",
    memberCount: 893,
    themeColor: "#EAB308" // Yellow/Gold
  },
  {
    id: "3",
    name: "Quitting Support",
    description: "Trying to stop? Or taking a break? Lean on others who understand the struggle of putting out the last one.",
    memberCount: 2155,
    themeColor: "#22C55E" // Green
  },
  {
    id: "4",
    name: "Creative Block",
    description: "Writers, artists, coders, and thinkers stepping outside for a moment to find the missing piece of the puzzle.",
    memberCount: 654,
    themeColor: "#EC4899" // Pink
  },
  {
    id: "5",
    name: "Old Souls",
    description: "Vinyl records, classic literature, and unfiltered conversations. A place that feels like a smoky 1920s jazz club.",
    memberCount: 432,
    themeColor: "#F97316" // Orange
  },
  {
    id: "6",
    name: "The Commute",
    description: "Stuck in traffic or waiting for the train. Sharing the fleeting moments of urban transit.",
    memberCount: 1105,
    themeColor: "#A855F7" // Purple
  }
];

export default function CommunitiesPage() {
  return (
    <div className="min-h-screen relative p-4 sm:p-6 lg:p-8">
      <PixelParticleBackground type="dust" density={30} className="fixed inset-0 opacity-20 pointer-events-none z-0" />
      
      <div className="relative z-10 max-w-5xl mx-auto pt-8">
        <header className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight uppercase" style={{ textShadow: "3px 3px 0px rgba(0,0,0,0.5)" }}>
              Find Your Tribe
            </h1>
            <p className="text-[#A1A1AA] text-sm mt-1 uppercase tracking-widest font-bold">Discover communities that fit your vibe</p>
          </div>
          <div className="bg-[#1D1D24] p-3 rounded-xl border border-[#2D2D36] text-[#4DA6FF] shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]">
            <Compass size={24} />
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-24">
          {COMMUNITIES.map((community) => (
            <CommunityCard key={community.id} {...community} />
          ))}
        </div>
      </div>
    </div>
  );
}
