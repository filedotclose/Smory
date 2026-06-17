"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { updateProfileSettings } from "@/server/profile/actions";
import { PushNotificationSettings } from "@/components/profile/PushNotificationSettings";

interface SettingsFormProps {
  initialUser: {
    anonymous_username: string;
    display_name: string | null;
    avatar_species: string;
  };
}

const SPECIES_OPTIONS = [
  { name: "Fox", emoji: "🦊", color: "bg-orange-500/10 border-orange-500/30 text-orange-600 hover:bg-orange-500/20" },
  { name: "Wolf", emoji: "🐺", color: "bg-slate-500/10 border-slate-500/30 text-slate-700 hover:bg-slate-500/20" },
  { name: "Cat", emoji: "🐱", color: "bg-yellow-500/10 border-yellow-500/30 text-yellow-700 hover:bg-yellow-500/20" },
  { name: "Dragon", emoji: "🐉", color: "bg-rose-500/10 border-rose-500/30 text-rose-600 hover:bg-rose-500/20" },
  { name: "Owl", emoji: "🦉", color: "bg-purple-500/10 border-purple-500/30 text-purple-600 hover:bg-purple-500/20" },
  { name: "Rabbit", emoji: "🐰", color: "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/20" },
];

export function SettingsForm({ initialUser }: SettingsFormProps) {
  const router = useRouter();
  const [username, setUsername] = useState(initialUser.anonymous_username);
  const [displayName, setDisplayName] = useState(initialUser.display_name || "");
  const [selectedSpecies, setSelectedSpecies] = useState(initialUser.avatar_species);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim().length < 3) {
      toast.error("Username must be at least 3 characters long");
      return;
    }

    setIsPending(true);
    const formData = new FormData();
    formData.append("username", username);
    formData.append("species", selectedSpecies);
    formData.append("displayName", displayName);

    const result = await updateProfileSettings(formData);
    setIsPending(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Profile updated successfully!", {
        icon: "✨",
        className: "border-[3px] border-ink-black shadow-[4px_4px_0px_0px_rgba(11,11,15,1)] font-bold rounded-none"
      });
      router.push("/profile");
      router.refresh();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8">
      {/* Header and Back Button */}
      <div className="flex items-center gap-4 mb-8">
        <Link 
          href="/profile"
          className="bg-paper-white text-ink-black hover:text-marlboro-red p-2 border-[3px] border-ink-black shadow-[3px_3px_0px_0px_rgba(11,11,15,1)] active:translate-y-0.5 active:shadow-none transition-all"
        >
          <ArrowLeft size={20} strokeWidth={2.5} />
        </Link>
        <h1 className="text-3xl font-black text-ink-black uppercase tracking-tight" style={{ textShadow: "2px 2px 0px rgba(11,11,15,0.1)" }}>
          Case Settings
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        
        {/* Profile Identity Card Form */}
        <div className="bg-paper-white border-[3px] border-ink-black shadow-[6px_6px_0px_0px_rgba(11,11,15,1)] p-6 flex flex-col gap-6">
          <h2 className="text-lg font-black text-ink-black uppercase tracking-widest border-b-[3px] border-ink-black pb-2 mb-2">
            Character Details
          </h2>

          {/* Anonymous Username */}
          <div className="flex flex-col gap-2">
            <label htmlFor="username" className="text-xs font-black uppercase tracking-widest text-ink-black">
              Anonymous Alias (Required)
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-paper-white border-[3px] border-ink-black p-3 font-bold text-ink-black focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(225,29,72,1)] focus:-translate-y-1 transition-all rounded-none"
              placeholder="e.g. ShadowSmoker"
              required
            />
            <p className="text-[10px] text-ash-gray font-bold uppercase tracking-wider">
              This name is shown to strangers and on public feeds.
            </p>
          </div>

          {/* Real Display Name */}
          <div className="flex flex-col gap-2">
            <label htmlFor="displayName" className="text-xs font-black uppercase tracking-widest text-ink-black">
              Display Name (Visible to Friends)
            </label>
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="bg-paper-white border-[3px] border-ink-black p-3 font-bold text-ink-black focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(225,29,72,1)] focus:-translate-y-1 transition-all rounded-none"
              placeholder="e.g. John Doe"
            />
            <p className="text-[10px] text-ash-gray font-bold uppercase tracking-wider">
              Only approved friends will see this name. Defaults to alias if empty.
            </p>
          </div>

          {/* Avatar Species Selector */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-black uppercase tracking-widest text-ink-black mb-1">
              Select Avatar Species
            </label>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {SPECIES_OPTIONS.map((species) => {
                const isSelected = selectedSpecies === species.name;
                return (
                  <button
                    key={species.name}
                    type="button"
                    onClick={() => setSelectedSpecies(species.name)}
                    className={`flex items-center gap-3 p-3 border-[3px] transition-all text-sm font-bold uppercase tracking-widest ${
                      isSelected
                        ? "bg-ink-black text-paper-white border-ink-black shadow-[3px_3px_0px_0px_rgba(225,29,72,1)] -translate-y-0.5"
                        : `bg-paper-white text-ink-black border-ink-black hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_rgba(11,11,15,0.1)]`
                    }`}
                  >
                    <span className="text-2xl filter drop-shadow-[1px_1px_0px_rgba(0,0,0,0.1)]">{species.emoji}</span>
                    <span>{species.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button
          type="submit"
          disabled={isPending}
          className="bg-marlboro-red text-paper-white font-black p-4 uppercase tracking-widest text-sm border-[3px] border-ink-black shadow-[6px_6px_0px_0px_rgba(11,11,15,1)] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-3 cursor-pointer"
        >
          {isPending ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>Saving Changes...</span>
            </>
          ) : (
            <>
              <Save size={18} />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </form>

      {/* Push Settings Separator */}
      <div className="my-10 border-t-[3px] border-ink-black/15" />

      {/* Push Notification Panel */}
      <div className="flex flex-col gap-4">
        <h2 className="text-xs font-black uppercase tracking-widest text-ash-gray px-1">
          Notification Configuration
        </h2>
        <PushNotificationSettings />
      </div>
    </div>
  );
}
