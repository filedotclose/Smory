import Link from "next/link";
import { PixelParticleBackground } from "@/components/ui/pixel/PixelParticleBackground";
import { PixelCard } from "@/components/ui/pixel/PixelCard";

export const metadata = {
  title: "Privacy Policy | The Ash Tray",
  description: "Privacy Policy compliant with the Digital Personal Data Protection Act (DPDPA), 2023, the Indian IT Act, and disclosures on third-party developer integrations.",
};

export default function PrivacyPage() {
  return (
    <div className="fixed inset-0 z-[100] bg-paper-white overflow-y-auto p-4 md:p-8 flex justify-center items-start pt-12 md:pt-20 font-mono text-ink-black selection:bg-marlboro-red selection:text-paper-white">
      <div className="fixed inset-0 z-0 bg-checkered opacity-50 mix-blend-multiply pointer-events-none" />
      <PixelParticleBackground type="dust" density={100} className="opacity-25 fixed inset-0 pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-3xl mb-20">
        <PixelCard className="p-6 md:p-10 border-[4px] border-ink-black bg-paper-white shadow-[8px_8px_0px_0px_rgba(11,11,15,1)]">
          <div className="mb-8 border-b-4 border-ink-black pb-4">
            <h1 className="text-3xl md:text-5xl font-bold text-ink-black uppercase tracking-tight mb-2">Privacy Policy</h1>
            <p className="text-ash-gray font-bold uppercase tracking-widest text-[10px] sm:text-xs">
              Last Updated: June 2026 • Compliant with DPDPA 2023 & Indian IT Act
            </p>
          </div>
          
          <div className="space-y-8 text-ink-black font-semibold leading-relaxed text-sm">
            <section className="border-l-4 border-marlboro-red pl-4">
              <h2 className="text-xl font-bold uppercase mb-2 text-marlboro-red">1. Context & Data Fiduciary</h2>
              <p>
                Under the Indian Digital Personal Data Protection Act (DPDPA), 2023, The Ash Tray operates as a Data Fiduciary. You, the user, are the Data Principal. We collect personal data solely with your explicit, specific, and unambiguous consent to provide our logging, community, and analytics services.
              </p>
            </section>
            
            <section className="border-l-4 border-filter-gold pl-4">
              <h2 className="text-xl font-bold uppercase mb-2 text-filter-gold">2. Information We Collect & Tools Used</h2>
              <p>
                We disclose the collection of following parameters along with the technical integrations utilized:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-2 text-xs">
                <li>
                  <strong className="text-ink-black">Identity & Authentication Data:</strong> Email addresses or phone numbers are collected to create accounts. This data is handled securely using <strong className="text-ink-black">Supabase Auth</strong>.
                </li>
                <li>
                  <strong className="text-ink-black">Behavioral Logs:</strong> Smoking metrics (cigarette brand, trigger conditions, craving levels, log notes, and log images) are saved in our postgres database via the <strong className="text-ink-black">Prisma ORM</strong>.
                </li>
                <li>
                  <strong className="text-ink-black">Diagnostics & Performance Metrics:</strong> We compile non-identifiable browser characteristics and performance statistics (e.g. latency, page load metrics) using <strong className="text-ink-black">Vercel Analytics</strong> and <strong className="text-ink-black">Vercel Speed Insights</strong> to troubleshoot service issues.
                </li>
                <li>
                  <strong className="text-ink-black">Cookies & Local Storage:</strong> We use local cookies and storage objects to maintain active authentication tokens, light/dark theme choices, and to remember that you have satisfied the age gate check.
                </li>
              </ul>
            </section>
            
            <section className="border-l-4 border-ink-black pl-4">
              <h2 className="text-xl font-bold uppercase mb-2 text-ink-black">3. Purpose of Processing</h2>
              <p>
                Your data is processed strictly for the following purposes:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-xs">
                <li>Creating your personal user account and validating adult status.</li>
                <li>Saving log records for personal habit tracking.</li>
                <li>Displaying anonymous posts on the community feed boards.</li>
                <li>Compiling analytics reports (weekly consumption rates and peak smoking hours).</li>
              </ul>
              <p className="mt-2 text-xs">
                We do not sell, rent, or trade your personal logs or account details with third-party advertising companies.
              </p>
            </section>
            
            <section className="border-l-4 border-marlboro-red pl-4">
              <h2 className="text-xl font-bold uppercase mb-2 text-marlboro-red">4. Data Protection & Security</h2>
              <p>
                We maintain industry-standard security safeguards. Database interactions are strictly governed by <strong className="text-ink-black">Supabase Row-Level Security (RLS)</strong> policies, ensuring that users can only read or edit their own private logging metrics. All data transmission uses SSL/TLS encryption protocols.
              </p>
            </section>

            <section className="border-l-4 border-filter-gold pl-4">
              <h2 className="text-xl font-bold uppercase mb-2 text-filter-gold">5. Your Rights as a Data Principal</h2>
              <p>
                In compliance with the DPDPA, 2023, you enjoy the following rights:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-xs">
                <li><strong className="text-ink-black">Right to Access:</strong> Request a summary of the data we hold about you.</li>
                <li><strong className="text-ink-black">Right to Erasure & Correction:</strong> Request deletion or updates to your logs. When you choose to delete your account, we permanently delete your email/phone records and purge all associated database logs.</li>
                <li><strong className="text-ink-black">Right to Withdraw Consent:</strong> You can revoke consent to process your data at any time, which will require terminating your account.</li>
              </ul>
            </section>

            <section className="border-l-4 border-ink-black pl-4">
              <h2 className="text-xl font-bold uppercase mb-2 text-ink-black">6. Grievance Officer</h2>
              <p>
                If you wish to exercise your rights or submit a complaint regarding how we handle your personal data under the IT Act or DPDPA 2023, contact our designated Grievance Officer:
              </p>
              <div className="bg-ink-black/5 border border-ink-black/10 p-4 mt-3 text-xs flex flex-col gap-1 font-bold">
                <span>Name: Sujal Sharma</span>
                <span>Email: grievance@smory.com</span>
                <span>SLA: We acknowledge complaints in 24 hours and resolve them in 15 days.</span>
              </div>
            </section>
          </div>

          <div className="mt-12 pt-6 border-t-4 border-ink-black flex justify-between items-center">
            <Link 
              href="/welcome" 
              className="inline-block bg-ink-black text-paper-white font-bold uppercase tracking-widest px-8 py-3 border-[3px] border-ink-black shadow-[4px_4px_0px_0px_rgba(11,11,15,1)] hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(11,11,15,1)] transition-all active:translate-y-1 active:shadow-none cursor-pointer"
            >
              Back to Welcome
            </Link>
          </div>
        </PixelCard>
      </div>
    </div>
  );
}
