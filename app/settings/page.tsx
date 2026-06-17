import { getCurrentUser } from "@/server/auth/actions";
import { redirect } from "next/navigation";
import { SettingsForm } from "@/components/settings/SettingsForm";
import { PixelParticleBackground } from "@/components/ui/pixel/PixelParticleBackground";

export const metadata = {
  title: "Settings | Smory",
};

export default async function SettingsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth");
  }

  // Cast type if necessary or pass directly since schema maps username/species
  const userData = {
    anonymous_username: user.anonymous_username,
    display_name: user.display_name,
    avatar_species: user.avatar_species || "Fox",
  };

  return (
    <div className="min-h-screen relative pb-24 bg-checkered">
      <PixelParticleBackground type="dust" density={20} className="fixed inset-0 z-0 opacity-35 pointer-events-none" />
      <div className="relative z-10">
        <SettingsForm initialUser={userData} />
      </div>
    </div>
  );
}
