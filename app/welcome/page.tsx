"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { PixelParticleBackground } from "@/components/ui/pixel/PixelParticleBackground";
import { AgeVerificationModal } from "@/components/auth/AgeVerificationModal";
import { WelcomeGraphics } from "@/components/auth/WelcomeGraphics";
import { PixelCard } from "@/components/ui/pixel/PixelCard";
import { BrutalistMarquee } from "@/components/welcome/BrutalistMarquee";
import { FloatingIconsBackground } from "@/components/welcome/FloatingIconsBackground";
import { Flame, Activity, Compass, ShieldCheck, ChevronDown, ChevronUp } from "lucide-react";

// Dynamic imports for heavy components


// ── Feature data ──────────────────────────────────────────
const FEATURES = [
  {
    icon: Activity,
    title: "Smoke Logging",
    desc: "Record each break. Tag your brand, rate your craving, and track your triggers — work stress, social vibes, boredom. Every drag, documented.",
    color: "marlboro-red",
    iconBg: "bg-marlboro-red/10 border-marlboro-red text-marlboro-red",
  },
  {
    icon: Compass,
    title: "Habit Intelligence",
    desc: "Unlock weekly patterns and behavioral insights. Peak hours, brand affinity, trigger analysis — your smoking fingerprint, visualized.",
    color: "filter-gold",
    iconBg: "bg-filter-gold/15 border-filter-gold text-filter-gold",
  },
  {
    icon: ShieldCheck,
    title: "Pure Anonymity",
    desc: "No names. No numbers. No email on feeds. Share raw stories under auto-generated aliases. Your identity stays in the smoke.",
    color: "ink-black",
    iconBg: "bg-ink-black/5 border-ink-black text-ink-black",
  },
];

// ── Feature Card with InView animation ────────────────────
function FeatureCard({ feature, index }: { feature: typeof FEATURES[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ delay: index * 0.15, type: "spring", stiffness: 200, damping: 20 }}
      className="sticky top-[var(--sticky-offset)] md:relative md:top-auto"
      style={{ "--sticky-offset": `calc(120px + ${index * 16}px)` } as React.CSSProperties}
    >
      <PixelCard className="p-6 md:h-full bg-paper-white border-[3px] border-ink-black shadow-[6px_6px_0px_0px_rgba(11,11,15,1)] hover:shadow-[6px_6px_0px_0px_rgba(225,29,72,1)] transition-shadow duration-300">
        <div className={`w-10 h-10 ${feature.iconBg} border-[2px] flex items-center justify-center mb-4`}>
          <feature.icon size={20} />
        </div>
        <h3 className="text-lg font-bold uppercase tracking-tight text-ink-black mb-3">
          {feature.title}
        </h3>
        <p className="text-sm text-ash-gray font-semibold leading-relaxed">
          {feature.desc}
        </p>
      </PixelCard>
    </motion.div>
  );
}

// ── Main Page ─────────────────────────────────────────────
export default function WelcomePage() {
  const [isAgeModalOpen, setIsAgeModalOpen] = useState(false);
  const [legalExpanded, setLegalExpanded] = useState(false);

  return (
    <div
      className="min-h-screen relative bg-paper-white text-ink-black flex flex-col font-mono selection:bg-marlboro-red selection:text-paper-white"
    >
      {/* ── Background Layers ────────────────────────────── */}
      <div className="fixed inset-0 z-0 bg-checkered opacity-30 mix-blend-multiply pointer-events-none" />
      <PixelParticleBackground
        type="dust"
        density={40}
        className="opacity-25 fixed inset-0 pointer-events-none"
      />
      <FloatingIconsBackground />

      {/* ── Sticky Glassmorphism Navbar ───────────────────── */}
      <nav className="sticky top-0 z-[60] w-full bg-paper-white/80 backdrop-blur-md border-b-[3px] border-ink-black/10">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-marlboro-red border-[2px] border-ink-black flex items-center justify-center text-paper-white shadow-[2px_2px_0px_0px_rgba(11,11,15,1)]">
              <Flame size={16} className="animate-pulse" />
            </div>
            <span className="font-black text-xl uppercase tracking-tight text-ink-black">
              Smory
            </span>
          </div>
          <button
            onClick={() => setIsAgeModalOpen(true)}
            className="bg-ink-black hover:bg-marlboro-red text-paper-white font-bold text-xs uppercase tracking-widest px-5 py-2.5 border-[2px] border-ink-black shadow-[3px_3px_0px_0px_rgba(11,11,15,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer"
          >
            Enter App
          </button>
        </div>
      </nav>

      {/* ── Hero Section (Full Viewport) ─────────────────── */}
      <section className="relative z-10 flex-1 w-full max-w-4xl mx-auto px-6 pt-10 md:pt-16 flex flex-col items-center text-center min-h-[calc(100vh-60px)]">
        <div className="flex-1 flex flex-col items-center justify-center w-full">
          <WelcomeGraphics />

          <div className="mt-10 max-w-lg">
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.5, duration: 0.5 }}
              className="text-sm font-bold text-ash-gray uppercase tracking-[0.25em] mb-6"
            >
              Log. Connect. Reflect.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.7, duration: 0.5 }}
              className="text-base md:text-lg text-ink-black font-semibold leading-relaxed mb-10"
            >
              An age-restricted, fully anonymous micro-network built for tracking habits,
              cataloging smoke breaks, and sharing raw stories.
            </motion.p>

            {/* ── Premium CTA ──────────────────── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 3.0, type: "spring", stiffness: 200, damping: 20 }}
            >
              <button
                id="smory-cta"
                onClick={() => setIsAgeModalOpen(true)}
                className="bg-marlboro-red hover:bg-marlboro-red/90 text-paper-white text-lg font-bold uppercase tracking-widest px-10 py-4 border-[4px] border-ink-black shadow-[6px_6px_0px_0px_rgba(11,11,15,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all cursor-pointer pointer-events-auto"
              >
                Verify Age & Join
              </button>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 8, 0] }}
          transition={{
            opacity: { delay: 4 },
            y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
          }}
          className="pb-8"
        >
          <a href="#features" className="flex flex-col items-center gap-1 text-ash-gray hover:text-marlboro-red transition-colors">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Explore</span>
            <ChevronDown size={16} />
          </a>
        </motion.div>
      </section>

      {/* ── Brutalist Marquee Divider ──────────────────────── */}
      <div className="w-full my-12">
        <BrutalistMarquee />
      </div>

      {/* ── Feature Grid / Stacking ────────────────────────── */}
      <section id="features" className="relative z-10 w-full max-w-4xl mx-auto px-6 py-20 scroll-mt-6">
        <div className="text-center mb-14">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-black text-ink-black uppercase tracking-tight mb-3"
          >
            Inside The Break Room
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="h-1.5 w-20 bg-gradient-to-r from-marlboro-red to-filter-gold mx-auto"
          />
        </div>

        {/* The gap-12 on mobile provides space for the sticky cards to scroll past. On desktop, they sit in a grid with normal spacing. */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 pb-32 md:pb-0 items-stretch">
          {FEATURES.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} />
          ))}
        </div>
      </section>

      {/* ── Health Advisory Warning ───────────────────────── */}
      <section className="relative z-10 w-full max-w-4xl mx-auto px-6 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="border-[3px] border-marlboro-red bg-marlboro-red/5 p-6 flex flex-col sm:flex-row items-center gap-4 text-left shadow-[6px_6px_0px_0px_rgba(225,29,72,0.15)]"
        >
          <div className="w-12 h-12 shrink-0 bg-marlboro-red text-paper-white flex items-center justify-center font-bold text-xl border-[2px] border-ink-black">
            ⚠️
          </div>
          <div>
            <h4 className="font-bold text-marlboro-red uppercase text-sm tracking-wider mb-1">
              Health Advisory Warning
            </h4>
            <p className="text-xs text-ink-black font-semibold leading-relaxed">
              Smoking is injurious to health and causes painful death. Smory does not sell, advertise, or promote tobacco products. This software is designed solely as a behavioral self-logging tool for adults.
            </p>
          </div>
        </motion.div>
      </section>

      {/* ── Legal / Compliance (Collapsible) ──────────────── */}
      <section className="relative z-10 w-full max-w-4xl mx-auto px-6 pb-8">
        <button
          onClick={() => setLegalExpanded(!legalExpanded)}
          className="w-full border-[3px] border-ink-black/20 bg-paper-white p-4 flex items-center justify-between text-left shadow-[4px_4px_0px_0px_rgba(11,11,15,0.05)] hover:shadow-[6px_6px_0px_0px_rgba(11,11,15,0.1)] transition-shadow cursor-pointer"
        >
          <span className="font-bold text-ink-black uppercase text-xs tracking-widest flex items-center gap-2">
            <ShieldCheck size={14} />
            IT Intermediary & DPDPA Compliance (India)
          </span>
          {legalExpanded ? <ChevronUp size={16} className="text-ash-gray" /> : <ChevronDown size={16} className="text-ash-gray" />}
        </button>

        <motion.div
          initial={false}
          animate={{ height: legalExpanded ? "auto" : 0, opacity: legalExpanded ? 1 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <div className="border-x-[3px] border-b-[3px] border-ink-black/20 bg-paper-white p-6">
            <p className="text-[11px] text-ash-gray font-medium leading-relaxed mb-4">
              Under Section 79 of the Indian Information Technology Act, 2000 and the Information Technology (Intermediary Guidelines) Rules, 2021, this application operates as a social media intermediary. We do not host or generate tobacco advertisements and strictly prohibit unlawful content. In compliance with the Digital Personal Data Protection Act (DPDPA), 2023, you retain full rights over your personal logging records.
            </p>
            <div className="bg-ink-black/5 p-3 border border-ink-black/10 text-[10px] font-bold text-ink-black uppercase tracking-wider flex flex-col gap-1">
              <span>Designated Grievance Officer: Sujal Sharma</span>
              <span>Contact: grievance@smory.com</span>
              <span>SLA: Response acknowledgment in 24 hours, resolution in 15 days.</span>
            </div>
          </div>
        </motion.div>
      </section>



      {/* ── Footer ───────────────────────────────────────── */}
      <footer className="relative z-10 w-full max-w-4xl mx-auto px-6 mt-8 pt-6 pb-[160px] border-t-[3px] border-ink-black/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-bold text-ash-gray uppercase tracking-widest">
        <span>© {new Date().getFullYear()} Smory. All rights reserved.</span>
        <div className="flex gap-4">
          <Link href="/terms" className="hover:text-marlboro-red transition-colors underline">
            Terms of Service
          </Link>
          <Link href="/privacy" className="hover:text-marlboro-red transition-colors underline">
            Privacy Policy
          </Link>
        </div>
      </footer>

      {/* ── Age Verification Modal ───────────────────────── */}
      <AgeVerificationModal isOpen={isAgeModalOpen} onClose={() => setIsAgeModalOpen(false)} />
    </div>
  );
}
