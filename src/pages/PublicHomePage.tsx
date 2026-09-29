import React, { useState } from 'react';
import { BrandLogo, BrandMark } from '../components/common/BrandLogo';
import {
  ShieldCheck,
  Lock,
  ArrowRight,
  MessageSquare,
  FileCheck2,
  CheckCircle2,
  FileText,
  Key,
  Users,
  Building2,
  Briefcase,
  Landmark,
  TrendingUp,
  Globe2,
  FileSearch,
  Check,
  Shield,
  Stamp,
  Sparkles,
} from 'lucide-react';
import { GlobalFooter } from '../components/common/GlobalFooter';
import { SupportModal } from '../components/common/SupportModal';

interface PublicHomePageProps {
  onNavigate: (path: string) => void;
}

export const PublicHomePage: React.FC<PublicHomePageProps> = ({ onNavigate }) => {
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);

  return (
    <div
      id="jurimbrella-public-homepage"
      className="min-h-screen bg-[#F4F7F9] text-[#17212B] font-sans antialiased selection:bg-[#002D5B] selection:text-white"
    >
      {/* 1. Official Header */}
      <header className="sticky top-0 z-40 border-b border-[#D9E1E8] bg-white/95 backdrop-blur-xs shadow-xs">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div
            onClick={() => onNavigate('/')}
            className="flex items-center cursor-pointer select-none"
            title="JuriMbrella — Protection over every signature"
          >
            <BrandLogo
              variant="compact"
              height={40}
              priority
              alt="JuriMbrella Philippine Electronic Notarization"
            />
          </div>

          <nav aria-label="Public Navigation" className="flex items-center gap-2 sm:gap-6 text-xs font-medium">
            <button
              onClick={() => onNavigate('/enf')}
              className="text-[#002D5B] hover:text-[#0078CE] transition-colors font-bold flex items-center gap-1.5 cursor-pointer bg-[#0078CE]/10 px-3 py-1.5 rounded-lg border border-[#0078CE]/30 hover:bg-[#0078CE]/20"
            >
              <Sparkles className="h-3.5 w-3.5 text-[#2EAF4A]" />
              <span>ENF Portal</span>
            </button>
            <button
              onClick={() => onNavigate('/verify')}
              className="text-slate-600 hover:text-[#002D5B] transition-colors font-medium hidden sm:inline-block cursor-pointer"
            >
              Verify Notarization
            </button>
            <button
              onClick={() => onNavigate('/jurimbrella-portal')}
              className="text-slate-600 hover:text-[#002D5B] transition-colors font-medium hidden md:inline-block cursor-pointer"
            >
              Legal Information
            </button>
            <button
              onClick={() => onNavigate('/contact')}
              className="text-slate-600 hover:text-[#002D5B] transition-colors font-medium hidden sm:inline-block cursor-pointer"
            >
              Contact Us
            </button>
            <button
              onClick={() => onNavigate('/sign-in')}
              className="rounded-lg bg-[#002D5B] px-3.5 py-1.5 sm:px-4 sm:py-2 text-white hover:bg-[#0078CE] transition-all font-semibold shadow-xs cursor-pointer text-xs"
            >
              Sign In
            </button>
          </nav>
        </div>
      </header>

      {/* 2. Hero Section */}
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-16 space-y-16">
        <section className="text-center max-w-3xl mx-auto space-y-6">
          <div className="flex justify-center pb-2">
            <BrandLogo
              variant="full"
              height={140}
              priority
              alt="JuriMbrella — Protection over every signature"
              className="mx-auto"
            />
          </div>

          <div className="inline-flex items-center gap-2 border border-[#2EAF4A]/40 bg-white px-4 py-1.5 text-xs text-[#002D5B] rounded-full shadow-xs">
            <span className="h-2 w-2 rounded-full bg-[#2EAF4A]" />
            <span className="font-bold tracking-wide">PHILIPPINE eNOTARIZATION</span>
            <span>•</span>
            <span className="text-[#0078CE] font-medium">Secure. Legal. Digital. Nationwide.</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#002D5B] leading-tight font-sans">
              Protection over every signature
            </h1>
            <p className="text-sm sm:text-base font-semibold text-[#0078CE]">
              Secure. Legal. Digital. Nationwide.
            </p>
          </div>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            A professional Philippine electronic notarization platform focused on secure, compliant,
            traceable, and professionally controlled digital notarization workflows under Supreme Court Rules.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => onNavigate('/enf')}
              className="w-full sm:w-auto rounded-lg bg-[#002D5B] px-6 py-3 text-sm font-semibold text-white hover:bg-[#0078CE] transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="h-4 w-4 text-[#A8E063]" />
              <span>Start My ENF</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate('/sign-in')}
              className="w-full sm:w-auto rounded-lg border border-[#002D5B] bg-white px-6 py-3 text-sm font-semibold text-[#002D5B] hover:bg-[#F4F7F9] transition-all shadow-xs cursor-pointer"
            >
              Sign In
            </button>

            <button
              type="button"
              onClick={() => onNavigate('/verify')}
              className="w-full sm:w-auto rounded-lg border border-[#D9E1E8] bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:border-[#0078CE] transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <FileCheck2 className="h-4 w-4 text-[#2EAF4A]" />
              <span>Verify Document</span>
            </button>
          </div>

          {/* ENF Portal Callout Highlight Banner */}
          <div className="mt-8 rounded-2xl border border-[#2EAF4A]/40 bg-gradient-to-r from-[#002D5B] via-[#00386E] to-[#002D5B] p-6 text-white text-left shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#2EAF4A]/20 border border-[#2EAF4A]/40 px-3 py-0.5 text-[11px] font-bold text-[#A8E063] uppercase tracking-wider">
                <Sparkles className="h-3 w-3" />
                <span>ENF Development Program</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Build & Customize Your Own Electronic Notarial Facility
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                Prepaid technical credits, up to 79% applicable technical-fee discounts, AI-assisted legal research, and zero onboarding setup fee.
              </p>
            </div>
            <div className="shrink-0 flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <button
                type="button"
                onClick={() => onNavigate('/enf')}
                className="rounded-lg bg-[#2EAF4A] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#259b40] transition-colors text-center cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
              >
                <span>Explore Development Plans</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </section>

        {/* 3. Core Capabilities Grid */}
        <section id="pillars" className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-1">
            <h2 className="text-2xl font-bold text-[#002D5B]">
              Engineered for Complete Notarial Trust
            </h2>
            <p className="text-xs text-slate-500">
              Designed around Supreme Court A.M. No. 24-10-14-SC, R.A. 8792, and R.A. 10173.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl border border-[#D9E1E8] p-6 space-y-3 shadow-xs border-t-4 border-t-[#002D5B]">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#002D5B]/10 text-[#002D5B]">
                <Stamp className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-[#002D5B]">
                Secure eNotarization
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Full procedural compliance for both Integrated In-Person (IEN) and Remote Electronic Notarization (REN) with structured 24-step verification.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-[#D9E1E8] p-6 space-y-3 shadow-xs border-t-4 border-t-[#0078CE]">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#0078CE]/10 text-[#0078CE]">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-[#002D5B]">
                Cryptographic Document Protection
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every document receives an immutable SHA-256 hash computed directly from file bytes, preventing tampering or retroactive alterations.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-[#D9E1E8] p-6 space-y-3 shadow-xs border-t-4 border-t-[#2EAF4A]">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#2EAF4A]/10 text-[#2EAF4A]">
                <FileSearch className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-[#002D5B]">
                Instant Public Verification
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Anyone can verify the authenticity of an electronic notarial certificate via QR codes or opaque hash tokens without exposing sensitive client data.
              </p>
            </div>
          </div>
        </section>

        {/* 4. Ecosystem & Audience Segments */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-1">
            <h2 className="text-2xl font-bold text-[#002D5B]">
              Serving the Entire Philippine Legal Ecosystem
            </h2>
            <p className="text-xs text-slate-500">
              Tailored workspaces and permissions for each statutory role.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white rounded-xl border border-[#D9E1E8] p-5 space-y-2.5 shadow-xs hover:border-[#0078CE] transition-all">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#002D5B]/5 text-[#002D5B]">
                <Users className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-sm text-[#002D5B]">Individuals & Signers</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Execute sworn affidavits, deeds, and legal instruments securely from anywhere in the country.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-[#D9E1E8] p-5 space-y-2.5 shadow-xs hover:border-[#0078CE] transition-all">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0078CE]/10 text-[#0078CE]">
                <Building2 className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-sm text-[#002D5B]">Enterprises & Businesses</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Manage high-volume corporate board resolutions, contracts, procurement bids, and audit trails.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-[#D9E1E8] p-5 space-y-2.5 shadow-xs hover:border-[#2EAF4A] transition-all">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2EAF4A]/10 text-[#2EAF4A]">
                <Briefcase className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-sm text-[#002D5B]">Lawyers & Notaries (ENP)</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Dedicated Electronic Notary Public dashboard with conflict checking, notarial registers, and seals.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-[#D9E1E8] p-5 space-y-2.5 shadow-xs hover:border-[#A8E063] transition-all">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#A8E063]/20 text-[#1B6C2E]">
                <TrendingUp className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-sm text-[#002D5B]">Wealth & Opportunity</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Empowering commerce, financing, and business registration with frictionless, enforceable digital contracts.
              </p>
            </div>
          </div>
        </section>

        {/* 5. Demonstration & Evaluation Notice */}
        <section className="bg-white rounded-xl border border-[#D9E1E8] p-6 space-y-3 text-xs text-slate-700 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#D9E1E8] pb-2.5">
            <span className="font-bold uppercase font-mono text-[11px] text-[#002D5B] flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#2EAF4A]" />
              Evaluation Sandbox Environment
            </span>
            <span className="text-[10px] font-mono text-slate-500">
              SIMULATED IDENTITY VERIFICATION
            </span>
          </div>
          <p className="leading-relaxed">
            This deployment is a demonstration environment. In compliance with Philippine legal ethics, no live government database was queried, and all digital identity verification transactions are simulated. To inspect all 14 statutory workspaces, proceed to the sign-in portal.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => onNavigate('/sign-in')}
              className="inline-flex items-center gap-1.5 font-semibold text-[#002D5B] hover:text-[#0078CE] transition-colors cursor-pointer"
            >
              <span>Access Role-Based Workspace Presets</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </section>
      </main>

      {/* 6. Standardized Global Public Footer */}
      <GlobalFooter
        onNavigate={onNavigate}
        onOpenSupportModal={() => setIsSupportModalOpen(true)}
      />

      {/* Support Modal */}
      <SupportModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
        defaultTopic="general"
      />
    </div>
  );
};

export default PublicHomePage;
