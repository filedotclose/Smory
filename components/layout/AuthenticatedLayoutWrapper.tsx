"use client";

import { usePathname } from "next/navigation";
import { Navigation } from "./Navigation";
import { AutoPushSubscriber } from "@/components/notifications/AutoPushSubscriber";

import { OnboardingProvider } from "@/components/onboarding/OnboardingProvider";

const PUBLIC_ROUTES = ["/welcome", "/auth", "/terms", "/privacy", "/thankyou"];
const FULLSCREEN_ROUTES = ["/communities/"]; // Prefix for routes that should hide navigation (like IG DMs)

export function AuthenticatedLayoutWrapper({
  children,
  hasCompletedOnboarding = true,
}: {
  children: React.ReactNode;
  hasCompletedOnboarding?: boolean;
}) {
  const pathname = usePathname();
  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  if (isPublicRoute) {
    return <>{children}</>;
  }

  // Check if we are inside a specific community chat
  const isFullscreen = FULLSCREEN_ROUTES.some((route) => pathname.startsWith(route));

  return (
    <OnboardingProvider hasCompletedOnboarding={hasCompletedOnboarding}>
      <AutoPushSubscriber />
      {!isFullscreen && <Navigation />}
      <main className={isFullscreen ? "flex-1" : "flex-1 pb-20 lg:pb-0 lg:pl-64"}>
        {children}
      </main>
    </OnboardingProvider>
  );
}
