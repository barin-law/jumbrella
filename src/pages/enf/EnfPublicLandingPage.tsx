import React, { useState } from 'react';
import { BrandLogo } from '../../components/common/BrandLogo';
import {
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Calculator,
  Lock,
  Zap,
  Building2,
  Scale,
  Award,
  BookOpen,
  Users,
  Cpu,
  Layers,
  FileCheck2,
  Compass,
  Check,
  ExternalLink,
  ChevronDown,
  Info,
} from 'lucide-react';
import { EnfStorageService } from '../../services/enf/enfStorageService';
import { ENFPlan } from '../../types/enf';
import { EnfLegalModal } from './EnfLegalModal';

interface EnfPublicLandingPageProps {
  onNavigate: (path: string) => void;
  onSelectPlan?: (planId: string) => void;
  onOpenAuth?: () => void;
}

export const EnfPublicLandingPage: React.FC<EnfPublicLandingPageProps> = ({
  onNavigate,
  onSelectPlan,
  onOpenAuth,
}) => {
  const [plans] = useState<ENFPlan[]>(() => EnfStorageService.getPlans());
  const [feeEngine] = useState(() => EnfStorageService.getFeeEngine());
  const [calcBaseFee, setCalcBaseFee] = useState<number>(100);
  const [calcVolume, setCalcVolume] = useState<number>(150);
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const [legalModalTab, setLegalModalTab] = useState<'TERMS' | 'PAYMENT' | 'CREDITS' | 'DISCLAIMER' | 'AGREEMENT'>('TERMS');

  const scrollToPlans = () => {
    const el = document.getElementById('development-plans-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleStartPlan = (planId: string) => {
    if (onSelectPlan) {
      onSelectPlan(planId);
    } else {
      onNavigate(`/enf/order?planId=${planId}`);
    }
  };

  const openLegal = (tab: 'TERMS' | 'PAYMENT' | 'CREDITS' | 'DISCLAIMER' | 'AGREEMENT') => {
    setLegalModalTab(tab);
    setIsLegalModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F4F7F9] text-[#17212B] font-sans antialiased selection:bg-[#002D5B] selection:text-white">
      {/* 1. Official Header */}
      <header className="sticky top-0 z-40 border-b border-[#D9E1E8] bg-white/95 backdrop-blur-xs shadow-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div
            onClick={() => onNavigate('/enf')}
            className="flex items-center gap-3 cursor-pointer select-none"
            title="JuriMbrella ENF Development Portal"
          >
            <BrandLogo
              variant="compact"
              height={38}
              priority
              alt="JuriMbrella ENF Portal"
              className="shrink-0"
            />
            <div className="hidden lg:flex items-center gap-1.5 border-l border-slate-200 pl-3">
              <span className="rounded-md bg-[#0078CE]/10 px-2 py-0.5 text-[10px] font-bold text-[#002D5B] uppercase tracking-wider">
                ENF Development Portal
              </span>
            </div>
          </div>

          <nav className="flex items-center gap-2 sm:gap-6 text-xs font-semibold">
            <button
              onClick={() => onNavigate('/')}
              className="text-slate-600 hover:text-[#002D5B] transition-colors hidden md:inline-block cursor-pointer"
            >
              JuriMbrella Platform
            </button>
            <button
              onClick={scrollToPlans}
              className="text-slate-600 hover:text-[#002D5B] transition-colors hidden sm:inline-block cursor-pointer"
            >
              Development Plans
            </button>
            <button
              onClick={() => onNavigate('/enf/dashboard')}
              className="text-slate-600 hover:text-[#002D5B] transition-colors cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={() => onNavigate('/enf/admin')}
              className="hidden lg:inline-flex items-center gap-1 text-slate-500 hover:text-[#002D5B] text-[11px] cursor-pointer"
            >
              <Lock className="h-3 w-3" />
              <span>Admin Desk</span>
            </button>
            <button
              onClick={scrollToPlans}
              className="rounded-lg bg-[#002D5B] px-4 py-2 text-white hover:bg-[#0078CE] transition-all font-semibold shadow-xs cursor-pointer"
            >
              Start My ENF
            </button>
          </nav>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden border-b border-[#D9E1E8] bg-white py-12 sm:py-20">
        <div className="absolute inset-0 bg-radial from-[#0078CE]/5 via-transparent to-transparent pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#2EAF4A]/40 bg-[#2EAF4A]/10 px-3.5 py-1 text-xs font-bold text-[#1B6C2E]">
                <Sparkles className="h-3.5 w-3.5 text-[#2EAF4A]" />
                <span>ELECTRONIC NOTARIAL FACILITY DEVELOPMENT PROGRAM</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#002D5B] leading-[1.12]">
                Your Independent, Fully Branded{' '}
                <span className="text-[#0078CE]">Electronic Notarial Facility</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
                Build and operate your customized notarial intake portal under the Supreme Court of the Philippines Rules on Electronic Notarization (A.M. No. 24-10-14-SC). Enjoy <strong>₱0 onboarding setup fee</strong>, <strong>100% usable prepaid technical credits</strong>, and <strong>up to 79% applicable technical-fee discounts</strong>.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={scrollToPlans}
                  className="rounded-lg bg-[#002D5B] px-6 py-3.5 text-sm font-bold text-white hover:bg-[#0078CE] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer group"
                >
                  <span>Start My ENF</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>

                <button
                  type="button"
                  onClick={scrollToPlans}
                  className="rounded-lg border border-[#002D5B] bg-white px-6 py-3.5 text-sm font-bold text-[#002D5B] hover:bg-[#F4F7F9] transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Explore Development Plans</span>
                  <ChevronDown className="h-4 w-4 text-[#0078CE]" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('/enf/dashboard')}
                  className="text-xs text-slate-600 hover:text-[#002D5B] font-semibold text-center py-2 sm:py-0 underline underline-offset-4 cursor-pointer"
                >
                  Existing Subscriber? Sign In
                </button>
              </div>

              {/* Key Value Micro-Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#D9E1E8]">
                <div>
                  <p className="text-xl font-extrabold text-[#002D5B]">₱0</p>
                  <p className="text-xs text-slate-500 font-medium">Setup & Onboarding</p>
                </div>
                <div>
                  <p className="text-xl font-extrabold text-[#2EAF4A]">Up to 79%</p>
                  <p className="text-xs text-slate-500 font-medium">Fee Discount</p>
                </div>
                <div>
                  <p className="text-xl font-extrabold text-[#0078CE]">100%</p>
                  <p className="text-xs text-slate-500 font-medium">Usable Credits</p>
                </div>
                <div>
                  <p className="text-xl font-extrabold text-[#002D5B]">A.M. 24-10-14</p>
                  <p className="text-xs text-slate-500 font-medium">Supreme Court Aligned</p>
                </div>
              </div>
            </div>

            {/* Right Interactive Card: Visual Facility Preview */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-[#D9E1E8] bg-white p-5 shadow-xl space-y-5">
                <div className="flex items-center justify-between border-b border-[#D9E1E8] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-3 w-3 rounded-full bg-emerald-500" />
                    <span className="text-xs font-bold text-[#002D5B] uppercase tracking-wider font-mono">
                      Your Custom ENF Portal
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">your-law.enf.jurimbrella.ph</span>
                </div>

                {/* Simulated Portal View */}
                <div className="rounded-xl border border-[#D9E1E8] bg-[#F4F7F9] p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-[#002D5B] text-white flex items-center justify-center font-bold text-xs">
                        ENP
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#002D5B]">Atty. Maria Elena Santos, En.P.</p>
                        <p className="text-[10px] text-slate-500">Electronic Notarial Facility • Makati City</p>
                      </div>
                    </div>
                    <span className="rounded bg-[#2EAF4A]/20 px-2 py-0.5 text-[9px] font-bold text-[#1B6C2E]">
                      ACTIVE ENF
                    </span>
                  </div>

                  <div className="rounded-lg bg-white p-3 border border-[#D9E1E8] shadow-2xs space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Prepaid Credit Wallet:</span>
                      <span className="font-bold text-[#2EAF4A] font-mono">₱50,000.00</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Technical Fee Discount:</span>
                      <span className="font-bold text-[#0078CE] font-mono">45% OFF</span>
                    </div>
                    <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                      <span className="text-slate-600 font-medium">Standard ₱100 Fee Charge:</span>
                      <span className="font-bold text-[#002D5B] font-mono text-sm">₱55.00 only</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="rounded border border-[#D9E1E8] bg-white p-2 text-center">
                      <p className="text-slate-400">Online Intake Queue</p>
                      <p className="font-bold text-[#002D5B]">12 Filings Ready</p>
                    </div>
                    <div className="rounded border border-[#D9E1E8] bg-white p-2 text-center">
                      <p className="text-slate-400">AI Legal Research</p>
                      <p className="font-bold text-[#2EAF4A]">Enabled (SC Rules)</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-[#0078CE]/20 bg-[#0078CE]/5 p-3 flex items-start gap-2.5 text-xs text-[#002D5B]">
                  <Info className="h-4 w-4 text-[#0078CE] shrink-0 mt-0.5" />
                  <p>
                    Independent domain, custom logos, bespoke document templates, and role-based staff access are delivered within your initial onboarding.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Core Capabilities Grid */}
      <section className="py-14 sm:py-20 bg-[#F4F7F9] border-b border-[#D9E1E8]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0078CE]">
              Enterprise Legal Technology Architecture
            </span>
            <h2 className="text-3xl font-extrabold text-[#002D5B]">
              Engineered Exclusively for Philippine Notarial Law
            </h2>
            <p className="text-sm text-slate-600">
              Unlike generic US/foreign signing tools, JuriMbrella ENF is natively programmed around the 2024 Supreme Court Rules on Electronic Notarization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="rounded-xl border border-[#D9E1E8] bg-white p-6 shadow-xs space-y-3 hover:border-[#0078CE] transition-all">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#002D5B] text-white">
                <Building2 className="h-5 w-5 text-[#A8E063]" />
              </div>
              <h3 className="font-bold text-[#002D5B] text-base">Customizable ENF Subdomain</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Provide your corporate and private clients a branded experience under your chosen domain slug, with your firm's logo, primary brand colors, and practice identity.
              </p>
            </div>

            {/* Card 2 */}
            <div className="rounded-xl border border-[#D9E1E8] bg-white p-6 shadow-xs space-y-3 hover:border-[#0078CE] transition-all">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#2EAF4A] text-white">
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-[#002D5B] text-base">100% Usable Prepaid Credits</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every peso of your development package is credited dollar-for-dollar into your server-authoritative credit wallet. Zero deduction for onboarding or account setup.
              </p>
            </div>

            {/* Card 3 */}
            <div className="rounded-xl border border-[#D9E1E8] bg-white p-6 shadow-xs space-y-3 hover:border-[#0078CE] transition-all">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0078CE] text-white">
                <Award className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-[#002D5B] text-base">Permanent Technical-Fee Discount</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Lock in substantial platform fee reductions of 19%, 45%, or 79% for all electronic notarial instruments executed across the life of your plan.
              </p>
            </div>

            {/* Card 4 */}
            <div className="rounded-xl border border-[#D9E1E8] bg-white p-6 shadow-xs space-y-3 hover:border-[#0078CE] transition-all">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#002D5B] text-white">
                <BookOpen className="h-5 w-5 text-[#A8E063]" />
              </div>
              <h3 className="font-bold text-[#002D5B] text-base">AI Legal Research Assistant</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Instant statutory grounding in Supreme Court A.M. 24-10-14-SC, the Rules on Electronic Evidence, E-Commerce Act, and statutory notarial jurisprudence.
              </p>
            </div>

            {/* Card 5 */}
            <div className="rounded-xl border border-[#D9E1E8] bg-white p-6 shadow-xs space-y-3 hover:border-[#0078CE] transition-all">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#2EAF4A] text-white">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-[#002D5B] text-base">Staff & Client Intake Management</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Empower your ENP Assistants and administrative staff to prepare drafts, conduct pre-hearing identity intake, and coordinate client appointments safely.
              </p>
            </div>

            {/* Card 6 */}
            <div className="rounded-xl border border-[#D9E1E8] bg-white p-6 shadow-xs space-y-3 hover:border-[#0078CE] transition-all">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0078CE] text-white">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-[#002D5B] text-base">Rule 7 Electronic Register</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Automated electronic register generation with continuous SHA-256 hash chaining, courtroom audit packet exports, and verified timestamping.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Interactive Savings & Discount Calculator */}
      <section className="py-14 sm:py-20 bg-white border-b border-[#D9E1E8]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="rounded-2xl border border-[#002D5B] bg-[#002D5B] text-white p-6 sm:p-10 shadow-xl space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
              <div>
                <div className="flex items-center gap-2 text-[#A8E063] text-xs font-bold uppercase tracking-wider mb-1">
                  <Calculator className="h-4 w-4" />
                  <span>Interactive Fee Calculator</span>
                </div>
                <h3 className="text-2xl font-bold font-sans">Simulate Your Practice Fee Savings</h3>
              </div>
              <p className="text-xs text-slate-300 max-w-sm">
                Demonstrating server-side pricing engine logic based on administrative base fee rules (Section 10).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Sliders */}
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-slate-300">Base Technical Platform Fee per Instrument</span>
                    <span className="font-bold font-mono text-[#A8E063]">₱{calcBaseFee}.00</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="200"
                    step="10"
                    value={calcBaseFee}
                    onChange={(e) => setCalcBaseFee(Number(e.target.value))}
                    className="w-full accent-[#2EAF4A] cursor-pointer"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Configurable from Admin (Default: ₱100.00)</p>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-slate-300">Estimated Monthly Notarizations</span>
                    <span className="font-bold font-mono text-[#A8E063]">{calcVolume} instruments/mo</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="500"
                    step="10"
                    value={calcVolume}
                    onChange={(e) => setCalcVolume(Number(e.target.value))}
                    className="w-full accent-[#0078CE] cursor-pointer"
                  />
                </div>
              </div>

              {/* Tier Comparison Breakdown */}
              <div className="space-y-3 bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-center justify-between text-xs pb-2 border-b border-white/10">
                  <span className="text-slate-300">Starter Tier (19% Disc.)</span>
                  <div className="text-right font-mono">
                    <span className="font-bold text-white">₱{Math.round(calcBaseFee * 0.81)} / instrument</span>
                    <p className="text-[10px] text-[#A8E063]">Save ₱{Math.round(calcBaseFee * 0.19 * calcVolume).toLocaleString()} / mo</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pb-2 border-b border-white/10 bg-[#0078CE]/20 p-2 rounded-lg">
                  <div>
                    <span className="font-bold text-white">Practice Tier (45% Disc.)</span>
                    <span className="block text-[10px] text-[#A8E063]">Most Popular</span>
                  </div>
                  <div className="text-right font-mono">
                    <span className="font-bold text-[#A8E063] text-sm">₱{Math.round(calcBaseFee * 0.55)} / instrument</span>
                    <p className="text-[10px] text-white">Save ₱{Math.round(calcBaseFee * 0.45 * calcVolume).toLocaleString()} / mo</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-300">Enterprise Tier (79% Disc.)</span>
                  <div className="text-right font-mono">
                    <span className="font-bold text-[#A8E063]">₱{Math.round(calcBaseFee * 0.21)} / instrument</span>
                    <p className="text-[10px] text-[#A8E063]">Save ₱{Math.round(calcBaseFee * 0.79 * calcVolume).toLocaleString()} / mo</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. ENF DEVELOPMENT ACCESS — CREDIT TABLE & OFFER CARDS */}
      <section id="development-plans-section" className="py-16 sm:py-24 bg-[#F4F7F9] border-b border-[#D9E1E8]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-12">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#2EAF4A]/40 bg-[#2EAF4A]/10 px-3.5 py-1 text-xs font-bold text-[#1B6C2E]">
              <Sparkles className="h-3.5 w-3.5 text-[#2EAF4A]" />
              <span>OFFICIAL ENF DEVELOPMENT OFFERS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#002D5B] font-sans tracking-tight">
              ENF Development Access
            </h2>
            <p className="text-sm sm:text-base text-slate-600 font-medium">
              Choose your development tier and receive prepaid credits for your online notarial services.
            </p>
          </div>

          {/* EXACT CREDIT TABLE */}
          <div className="rounded-2xl border border-[#D9E1E8] bg-white shadow-sm overflow-hidden">
            <div className="border-b border-[#D9E1E8] bg-slate-50/80 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#002D5B]">
                  Development Tier Comparison & Credit Allocation
                </h3>
                <p className="text-xs text-slate-500">
                  Server-authoritative technical fee engine pricing under Supreme Court rules.
                </p>
              </div>
              <span className="text-[11px] font-mono font-semibold text-[#0078CE] bg-[#0078CE]/10 px-2.5 py-1 rounded-md self-start sm:self-auto">
                BASE FEE: ₱100
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[620px]">
                <thead>
                  <tr className="border-b border-[#D9E1E8] bg-[#F4F7F9] text-[#002D5B] font-bold">
                    <th scope="col" className="py-3.5 px-6 font-extrabold">Tier</th>
                    <th scope="col" className="py-3.5 px-6 font-semibold">Base Fee</th>
                    <th scope="col" className="py-3.5 px-6 font-semibold">Discount</th>
                    <th scope="col" className="py-3.5 px-6 font-bold text-[#0078CE]">Effective Technical Fee</th>
                    <th scope="col" className="py-3.5 px-6 font-extrabold text-[#2EAF4A]">Credits</th>
                    <th scope="col" className="py-3.5 px-6 text-right font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D9E1E8] text-[#17212B]">
                  {/* Row 1: ₱20K */}
                  <tr className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-6 font-extrabold text-base text-[#002D5B] font-mono">
                      ₱20K
                    </td>
                    <td className="py-4 px-6 font-mono text-slate-600">
                      ₱100
                    </td>
                    <td className="py-4 px-6 font-bold text-[#0078CE]">
                      19%
                    </td>
                    <td className="py-4 px-6 font-extrabold font-mono text-[#002D5B] text-base">
                      ₱81
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1.5 font-extrabold text-base text-[#1B6C2E] bg-[#2EAF4A]/15 px-3 py-1 rounded-lg font-mono">
                        247 credits
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        type="button"
                        onClick={() => handleStartPlan('enf-plan-20k')}
                        className="rounded-lg bg-[#002D5B] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#0078CE] transition-colors cursor-pointer shadow-2xs whitespace-nowrap"
                      >
                        Select ₱20K
                      </button>
                    </td>
                  </tr>

                  {/* Row 2: ₱50K */}
                  <tr className="hover:bg-slate-50/70 bg-[#0078CE]/5 transition-colors">
                    <td className="py-4 px-6 font-extrabold text-base text-[#002D5B] font-mono flex items-center gap-2">
                      <span>₱50K</span>
                      <span className="text-[10px] uppercase font-bold text-white bg-[#0078CE] px-2 py-0.5 rounded-full font-sans tracking-tight">
                        Popular
                      </span>
                    </td>
                    <td className="py-4 px-6 font-mono text-slate-600">
                      ₱100
                    </td>
                    <td className="py-4 px-6 font-bold text-[#0078CE]">
                      45%
                    </td>
                    <td className="py-4 px-6 font-extrabold font-mono text-[#002D5B] text-base">
                      ₱55
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1.5 font-extrabold text-base text-[#1B6C2E] bg-[#2EAF4A]/20 px-3 py-1 rounded-lg font-mono">
                        1,819 credits
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        type="button"
                        onClick={() => handleStartPlan('enf-plan-50k')}
                        className="rounded-lg bg-[#002D5B] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#0078CE] transition-colors cursor-pointer shadow-2xs whitespace-nowrap"
                      >
                        Select ₱50K
                      </button>
                    </td>
                  </tr>

                  {/* Row 3: ₱100K */}
                  <tr className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-6 font-extrabold text-base text-[#002D5B] font-mono flex items-center gap-2">
                      <span>₱100K</span>
                      <span className="text-[10px] uppercase font-bold text-[#1B6C2E] bg-[#2EAF4A]/20 px-2 py-0.5 rounded-full font-sans tracking-tight">
                        Highest Access
                      </span>
                    </td>
                    <td className="py-4 px-6 font-mono text-slate-600">
                      ₱100
                    </td>
                    <td className="py-4 px-6 font-bold text-[#0078CE]">
                      79%
                    </td>
                    <td className="py-4 px-6 font-extrabold font-mono text-[#002D5B] text-base">
                      ₱21
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1.5 font-extrabold text-base text-[#1B6C2E] bg-[#2EAF4A]/25 px-3 py-1 rounded-lg font-mono border border-[#2EAF4A]/30">
                        4,761 credits
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        type="button"
                        onClick={() => handleStartPlan('enf-plan-100k')}
                        className="rounded-lg bg-[#002D5B] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#0078CE] transition-colors cursor-pointer shadow-2xs whitespace-nowrap"
                      >
                        Select ₱100K
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* EXACT CUSTOMER-FACING DESCRIPTION CALLOUT */}
          <div className="rounded-xl border border-[#2EAF4A]/50 bg-white p-5 shadow-xs flex items-center justify-center text-center">
            <p className="text-sm sm:text-base font-bold text-[#002D5B]">
              <span className="inline-block mr-2 text-[#2EAF4A]">✓</span>
              1 credit can be used for the technical fee of one online notarial service through the ENF facility.
            </p>
          </div>

          {/* THREE RESPONSIVE OFFER CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 pt-4">
            {/* CARD 1: ENF ₱20K */}
            <div className="rounded-2xl border border-[#D9E1E8] bg-white p-6 sm:p-8 shadow-sm hover:shadow-md hover:border-[#002D5B] transition-all flex flex-col justify-between space-y-6">
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-xs font-bold tracking-wider uppercase text-slate-500 font-mono">
                    Tier 1
                  </span>
                  <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                    Solo Practitioner
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-2xl font-extrabold text-[#002D5B] font-mono">
                    ENF ₱20K
                  </h3>
                  <p className="text-xs text-slate-500">
                    Starter facility tier for independent notarial intake
                  </p>
                </div>

                {/* Key Metrics Stack */}
                <div className="rounded-xl bg-[#F4F7F9] p-4 border border-[#D9E1E8] space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 font-medium">Base Fee:</span>
                    <span className="font-extrabold font-mono text-[#002D5B] text-sm">₱100</span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 font-medium">Discount:</span>
                    <span className="font-extrabold font-mono text-[#0078CE] text-sm">19%</span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200">
                    <span className="text-[#002D5B] font-bold">Effective Technical Fee:</span>
                    <span className="font-extrabold font-mono text-[#002D5B] text-base">₱81</span>
                  </div>

                  <div className="rounded-lg bg-white p-3 border border-[#2EAF4A]/40 flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1B6C2E]">Credits:</span>
                    <span className="text-lg font-black font-mono text-[#1B6C2E]">247 Credits</span>
                  </div>
                </div>

                <ul className="space-y-2 text-xs text-slate-600 pt-1">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#2EAF4A] shrink-0 mt-0.5" />
                    <span>₱20,000 prepaid technical value</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#2EAF4A] shrink-0 mt-0.5" />
                    <span>No setup fee for onboarding</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#2EAF4A] shrink-0 mt-0.5" />
                    <span>Branded client intake portal</span>
                  </li>
                </ul>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => handleStartPlan('enf-plan-20k')}
                  className="w-full rounded-xl bg-[#002D5B] py-3.5 text-xs sm:text-sm font-bold text-white hover:bg-[#0078CE] transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Select ₱20K</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* CARD 2: ENF ₱50K */}
            <div className="rounded-2xl border-2 border-[#0078CE] bg-white p-6 sm:p-8 shadow-xl relative flex flex-col justify-between space-y-6">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-[#0078CE] px-4 py-0.5 text-[11px] font-bold text-white shadow-xs tracking-wider uppercase">
                Most Popular Tier
              </div>

              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-xs font-bold tracking-wider uppercase text-[#0078CE] font-mono">
                    Tier 2
                  </span>
                  <span className="rounded bg-[#0078CE]/10 px-2 py-0.5 text-[10px] font-bold text-[#002D5B]">
                    Active Practice
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-2xl font-extrabold text-[#002D5B] font-mono">
                    ENF ₱50K
                  </h3>
                  <p className="text-xs text-slate-500">
                    Designed for high-volume law partnerships and corporate intake
                  </p>
                </div>

                {/* Key Metrics Stack */}
                <div className="rounded-xl bg-[#0078CE]/5 p-4 border border-[#0078CE]/20 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 font-medium">Base Fee:</span>
                    <span className="font-extrabold font-mono text-[#002D5B] text-sm">₱100</span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 font-medium">Discount:</span>
                    <span className="font-extrabold font-mono text-[#0078CE] text-sm">45%</span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-[#0078CE]/20">
                    <span className="text-[#002D5B] font-bold">Effective Technical Fee:</span>
                    <span className="font-extrabold font-mono text-[#002D5B] text-base">₱55</span>
                  </div>

                  <div className="rounded-lg bg-white p-3 border border-[#2EAF4A]/50 flex items-center justify-between shadow-2xs">
                    <span className="text-xs font-bold text-[#1B6C2E]">Credits:</span>
                    <span className="text-lg font-black font-mono text-[#1B6C2E]">1,819 Credits</span>
                  </div>
                </div>

                <ul className="space-y-2 text-xs text-slate-600 pt-1">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#2EAF4A] shrink-0 mt-0.5" />
                    <span>₱50,000 prepaid technical value</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#2EAF4A] shrink-0 mt-0.5" />
                    <span>No setup fee for onboarding</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#2EAF4A] shrink-0 mt-0.5" />
                    <span>Custom branding & multi-staff workflows</span>
                  </li>
                </ul>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => handleStartPlan('enf-plan-50k')}
                  className="w-full rounded-xl bg-[#002D5B] py-3.5 text-xs sm:text-sm font-bold text-white hover:bg-[#0078CE] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Select ₱50K</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* CARD 3: ENF ₱100K */}
            <div className="rounded-2xl border-2 border-[#2EAF4A] bg-white p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all flex flex-col justify-between space-y-6 relative">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-[#2EAF4A] px-4 py-0.5 text-[11px] font-bold text-white shadow-xs tracking-wider uppercase">
                Highest Access Tier
              </div>

              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-xs font-bold tracking-wider uppercase text-[#1B6C2E] font-mono">
                    Tier 3
                  </span>
                  <span className="rounded bg-[#2EAF4A]/15 px-2 py-0.5 text-[10px] font-bold text-[#1B6C2E]">
                    Enterprise Firm
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-2xl font-extrabold text-[#002D5B] font-mono">
                    ENF ₱100K
                  </h3>
                  <p className="text-xs text-slate-500">
                    Maximum fee reduction for nationwide and institutional operations
                  </p>
                </div>

                {/* Key Metrics Stack */}
                <div className="rounded-xl bg-[#2EAF4A]/5 p-4 border border-[#2EAF4A]/25 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 font-medium">Base Fee:</span>
                    <span className="font-extrabold font-mono text-[#002D5B] text-sm">₱100</span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 font-medium">Discount:</span>
                    <span className="font-extrabold font-mono text-[#0078CE] text-sm">79%</span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-[#2EAF4A]/25">
                    <span className="text-[#002D5B] font-bold">Effective Technical Fee:</span>
                    <span className="font-extrabold font-mono text-[#002D5B] text-base">₱21</span>
                  </div>

                  <div className="rounded-lg bg-white p-3 border-2 border-[#2EAF4A] flex items-center justify-between shadow-xs">
                    <span className="text-xs font-bold text-[#1B6C2E]">Credits:</span>
                    <span className="text-lg font-black font-mono text-[#1B6C2E]">4,761 Credits</span>
                  </div>
                </div>

                <ul className="space-y-2 text-xs text-slate-600 pt-1">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#2EAF4A] shrink-0 mt-0.5" />
                    <span>₱100,000 prepaid technical value</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#2EAF4A] shrink-0 mt-0.5" />
                    <span>No setup fee for onboarding</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#2EAF4A] shrink-0 mt-0.5" />
                    <span>Dedicated integration architect & nightly escrow</span>
                  </li>
                </ul>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => handleStartPlan('enf-plan-100k')}
                  className="w-full rounded-xl bg-[#002D5B] py-3.5 text-xs sm:text-sm font-bold text-white hover:bg-[#0078CE] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Select ₱100K</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Administrative Commercial Rules Note */}
          <div className="rounded-xl border border-[#D9E1E8] bg-white p-4 text-xs text-slate-600 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-slate-700">
              <Lock className="h-4 w-4 text-[#0078CE]" />
              <span>Official Commercial Terms: Configurable from JuriMbrella System Administration.</span>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <button
                onClick={() => openLegal('PAYMENT')}
                className="text-[#0078CE] hover:underline cursor-pointer"
              >
                Payment & Transfer Terms
              </button>
              <button
                onClick={() => openLegal('CREDITS')}
                className="text-[#0078CE] hover:underline cursor-pointer"
              >
                Prepaid Technical Credit Policy
              </button>
              <button
                onClick={() => openLegal('TERMS')}
                className="text-[#0078CE] hover:underline cursor-pointer"
              >
                Terms of Service
              </button>
              <button
                onClick={() => openLegal('AGREEMENT')}
                className="text-[#0078CE] hover:underline cursor-pointer"
              >
                ENF Development Agreement
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Development Progress Roadmap & Future Services */}
      <section className="py-14 sm:py-20 bg-white border-b border-[#D9E1E8]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0078CE]">
              Continuous Innovation
            </span>
            <h2 className="text-3xl font-extrabold text-[#002D5B]">
              Development Progress & Future ENF Services
            </h2>
            <p className="text-sm text-slate-600">
              Our engineering team deploys weekly enhancements aligned with Supreme Court guidelines, regional bar feedback, and corporate audit standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="rounded-xl border border-[#2EAF4A]/40 bg-[#2EAF4A]/5 p-5 space-y-2">
              <span className="rounded bg-[#2EAF4A] px-2 py-0.5 text-[9px] font-bold text-white uppercase">
                Phase 1 • Live
              </span>
              <h4 className="font-bold text-[#002D5B] text-sm">ENF Custom Subdomain</h4>
              <p className="text-xs text-slate-600">
                Independent client intake endpoints, custom branding, colors, and direct portal link sharing.
              </p>
            </div>

            <div className="rounded-xl border border-[#2EAF4A]/40 bg-[#2EAF4A]/5 p-5 space-y-2">
              <span className="rounded bg-[#2EAF4A] px-2 py-0.5 text-[9px] font-bold text-white uppercase">
                Phase 2 • Live
              </span>
              <h4 className="font-bold text-[#002D5B] text-sm">Prepaid Credit Engine</h4>
              <p className="text-xs text-slate-600">
                Server-authoritative double-entry ledger with automatic technical fee discounts and instant top-ups.
              </p>
            </div>

            <div className="rounded-xl border border-[#0078CE]/40 bg-[#0078CE]/5 p-5 space-y-2">
              <span className="rounded bg-[#0078CE] px-2 py-0.5 text-[9px] font-bold text-white uppercase">
                Phase 3 • Active
              </span>
              <h4 className="font-bold text-[#002D5B] text-sm">AI Legal Research Desk</h4>
              <p className="text-xs text-slate-600">
                Real-time Philippine eNotarization statutory citations, rule interpretations, and automated case references.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 space-y-2">
              <span className="rounded bg-slate-400 px-2 py-0.5 text-[9px] font-bold text-white uppercase">
                Phase 4 • Coming Soon
              </span>
              <h4 className="font-bold text-[#002D5B] text-sm">Cross-Border Apostille & Consular Link</h4>
              <p className="text-xs text-slate-600">
                Automated DFA authentication routing and overseas Philippine foreign post coordination.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Public Footer */}
      <footer className="bg-[#002D5B] text-white py-12 border-t border-[#001F3F]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-white/10 pb-8">
            <div className="flex items-center gap-3">
              <BrandLogo
                variant="compact"
                height={36}
                themeMode="dark"
                alt="JuriMbrella ENF"
              />
              <div className="border-l border-white/20 pl-3">
                <p className="text-xs font-bold text-white">Electronic Notarial Facility Development Portal</p>
                <p className="text-[11px] text-slate-300">Protection over every signature</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
              <button onClick={() => openLegal('TERMS')} className="hover:text-white cursor-pointer">
                Terms of Use
              </button>
              <span>•</span>
              <button onClick={() => openLegal('PAYMENT')} className="hover:text-white cursor-pointer">
                Payment Policies
              </button>
              <span>•</span>
              <button onClick={() => openLegal('CREDITS')} className="hover:text-white cursor-pointer">
                Credit Ledger Terms
              </button>
              <span>•</span>
              <button onClick={() => openLegal('DISCLAIMER')} className="hover:text-white cursor-pointer">
                AI Research Disclaimer
              </button>
              <span>•</span>
              <button onClick={() => onNavigate('/')} className="hover:text-white cursor-pointer">
                Back to JuriMbrella Main
              </button>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 space-y-2 text-center md:text-left">
            <p>
              <strong>STATUTORY NOTICE:</strong> JuriMbrella Legal Technology Corp. is an independent software and legal engineering facility provider. Technical platform fees are strictly separate from independent professional notarial fees, court filing dues, and government revenue stamp taxes. All electronic notarial acts are executed independently by commissioned Electronic Notaries Public under Supreme Court A.M. No. 24-10-14-SC.
            </p>
            <p>© 2026 JuriMbrella Legal Technology Corp. All Rights Reserved. Republic of the Philippines.</p>
          </div>
        </div>
      </footer>

      {/* Legal Disclosures Modal */}
      <EnfLegalModal
        isOpen={isLegalModalOpen}
        onClose={() => setIsLegalModalOpen(false)}
        initialTab={legalModalTab}
      />
    </div>
  );
};
