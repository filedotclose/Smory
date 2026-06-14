import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Navigation } from "@/components/layout/Navigation";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Smory | Every cigarette has a story",
  description: "An anonymous social network for smokers. Community, identity, and behavioral intelligence.",
  manifest: "/manifest.json",
};

export const viewport = {
  themeColor: "#0B0B0F",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.className} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0B0B0F] text-white overflow-x-hidden">
        <Providers>
          <Navigation />
          <main className="flex-1 pb-20 lg:pb-0 lg:pl-64">
            {children}
          </main>
          <Toaster theme="dark" position="top-center" />
        </Providers>
      </body>
    </html>
  );
}
