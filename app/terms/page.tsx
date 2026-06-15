import Link from "next/link";
import { PixelParticleBackground } from "@/components/ui/pixel/PixelParticleBackground";
import { PixelCard } from "@/components/ui/pixel/PixelCard";

export const metadata = {
  title: "Terms of Service | The Ash Tray",
  description: "Terms and Conditions of service compliant with the Indian Information Technology Act, 2000, IT Rules 2021, and COTPA 2003.",
};

export default function TermsPage() {
  return (
    <div className="fixed inset-0 z-[100] bg-paper-white overflow-y-auto p-4 md:p-8 flex justify-center items-start pt-12 md:pt-20 font-mono text-ink-black selection:bg-marlboro-red selection:text-paper-white">
      <div className="fixed inset-0 z-0 bg-checkered opacity-50 mix-blend-multiply pointer-events-none" />
      <PixelParticleBackground type="dust" density={100} className="opacity-25 fixed inset-0 pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-3xl mb-20">
        <PixelCard className="p-6 md:p-10 border-[4px] border-ink-black bg-paper-white shadow-[8px_8px_0px_0px_rgba(11,11,15,1)]">
          <div className="mb-8 border-b-4 border-ink-black pb-4">
            <h1 className="text-3xl md:text-5xl font-bold text-ink-black uppercase tracking-tight mb-2">Terms of Service</h1>
            <p className="text-ash-gray font-bold uppercase tracking-widest text-[10px] sm:text-xs">
              Last Updated: June 2026 • Compliant with IT Rules, 2021 & COTPA 2003
            </p>
          </div>
          
          <div className="space-y-8 text-ink-black font-semibold leading-relaxed text-sm">
            <section className="border-l-4 border-marlboro-red pl-4">
              <h2 className="text-xl font-bold uppercase mb-2 text-marlboro-red">1. Intermediary Status & Acceptance</h2>
              <p>
                The Ash Tray (Smory) is a digital platform and social media intermediary operating under Section 79 of the Indian Information Technology Act, 2000 and the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021. By creating an account or accessing our services, you unconditionally agree to these Terms. If you do not agree, you must exit immediately.
              </p>
            </section>
            
            <section className="border-l-4 border-filter-gold pl-4">
              <h2 className="text-xl font-bold uppercase mb-2 text-filter-gold">2. Age Limit & Eligibility (COTPA Compliance)</h2>
              <p>
                In compliance with Section 6 of the Cigarettes and Other Tobacco Products Act (COTPA), 2003, you must be at least 18 years of age to access this platform. Tobacco use is strictly restricted to adults. Users are solely responsible for verifying compliance with local regulations in their specific jurisdiction, including the 21+ legal age limits enforced in regions such as the United States.
              </p>
            </section>
            
            <section className="border-l-4 border-ink-black pl-4">
              <h2 className="text-xl font-bold uppercase mb-2 text-ink-black">3. Prohibited Content (IT Rules, 2021 - Rule 3(1)(b))</h2>
              <p>
                You represent and warrant that you will not host, display, upload, modify, publish, transmit, or share any information that:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-xs">
                <li>Belongs to another person and to which you do not have any right.</li>
                <li>Is defamatory, obscene, pornographic, pedophilic, invasive of another&apos;s privacy, hateful, or racially or ethnically objectionable.</li>
                <li>Harmful to minors in any way.</li>
                <li>Infringes any patent, trademark, copyright, or other proprietary rights.</li>
                <li>Violates any law for the time being in force (including commercial advertising/promotional materials for tobacco products which violate COTPA Section 5).</li>
                <li>Deceives or misleads the addressee about the origin of the message or communicates any misinformation.</li>
                <li>Impersonates another person or contains software viruses.</li>
              </ul>
            </section>
            
            <section className="border-l-4 border-marlboro-red pl-4">
              <h2 className="text-xl font-bold uppercase mb-2 text-marlboro-red">4. Tobacco Advertising Ban & Disclaimer</h2>
              <p>
                The Ash Tray strictly prohibits direct or indirect tobacco marketing, sponsorship, and promotional advertising. All user logs and stories must represent authentic user-generated narratives. The platform does not endorse smoking. Smoking is highly hazardous to health.
              </p>
            </section>

            <section className="border-l-4 border-filter-gold pl-4">
              <h2 className="text-xl font-bold uppercase mb-2 text-filter-gold">5. Grievance Officer & Redressal</h2>
              <p>
                In accordance with Rule 3(2) of the Information Technology Rules, 2021, any user grievance or complaint regarding content, privacy, or code of conduct violations can be reported to our designated Grievance Officer:
              </p>
              <div className="bg-ink-black/5 border border-ink-black/10 p-4 mt-3 text-xs flex flex-col gap-1 font-bold">
                <span>Name: Sujal Sharma</span>
                <span>Email: grievance@smory.com</span>
                <span>Response SLA: Acknowledged within 24 hours; resolved within 15 days.</span>
              </div>
            </section>

            <section className="border-l-4 border-ink-black pl-4">
              <h2 className="text-xl font-bold uppercase mb-2 text-ink-black">6. Termination & Indemnity</h2>
              <p>
                We reserve the right to suspend, terminate, or delete accounts violating these terms, or upon legal directive. You agree to indemnify and hold harmless The Ash Tray and its operators against any claims arising from your posts, content, or violations of applicable law.
              </p>
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
