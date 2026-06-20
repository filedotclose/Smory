"use client";

import { usePathname } from "next/navigation";
import { Navigation } from "./Navigation";
import { AutoPushSubscriber } from "@/components/notifications/AutoPushSubscriber";

import { OnboardingProvider } from "@/components/onboarding/OnboardingProvider";

const PUBLIC_ROUTES = ["/welcome", "/auth", "/terms", "/privacy", "/thankyou"];

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

  return (
    <OnboardingProvider hasCompletedOnboarding={hasCompletedOnboarding}>
      <AutoPushSubscriber />
      <Navigation />
      <main className="flex-1 pb-20 lg:pb-0 lg:pl-64">
        {children}
      </main>
    </OnboardingProvider>
  );
}
