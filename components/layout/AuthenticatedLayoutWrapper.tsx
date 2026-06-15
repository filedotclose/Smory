"use client";

import { usePathname } from "next/navigation";
import { Navigation } from "./Navigation";

const PUBLIC_ROUTES = ["/welcome", "/auth", "/terms", "/privacy"];

export function AuthenticatedLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  if (isPublicRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <Navigation />
      <main className="flex-1 pb-20 lg:pb-0 lg:pl-64">
        {children}
      </main>
    </>
  );
}
