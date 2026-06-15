import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Smory | Every smoke tells a story",
  description: "Welcome to Smory — an anonymous, age-verified micro-network for smokers. Log your habits, find your tribe, and turn every smoke break into a story.",
};

export default function WelcomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
