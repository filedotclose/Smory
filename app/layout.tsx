import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { AuthenticatedLayoutWrapper } from "@/components/layout/AuthenticatedLayoutWrapper";
import { Toaster } from "sonner";
import { ServiceWorkerRegistrar } from "@/components/pwa/ServiceWorkerRegistrar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Smory | Every smoke tells a story",
  description: "An anonymous social network for smokers. Community, identity, and behavioral intelligence.",
  manifest: "/manifest.json",

  // ── Apple PWA Meta Tags ──────────────────────────────────
  appleWebApp: {
    capable: true,
    title: "Smory",
    statusBarStyle: "default",
  },

  // ── Standard PWA Meta ────────────────────────────────────
  applicationName: "Smory",
  formatDetection: {
    telephone: false,
  },

  // ── Icons ────────────────────────────────────────────────
  icons: {
    icon: [
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#E11D48",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
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
        <ServiceWorkerRegistrar />
        <Providers>
          <AuthenticatedLayoutWrapper>
            {children}
          </AuthenticatedLayoutWrapper>
          <Toaster theme="dark" position="top-center" />
        </Providers>
      </body>
    </html>
  );
}
