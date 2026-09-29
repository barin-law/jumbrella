import React, { useState } from 'react';
import {
  Compass,
  CheckCircle2,
  Clock,
  ArrowRight,
  Shield,
  Layers,
  Sparkles,
  Zap,
  Building,
  Users,
  FileText,
  Palette,
  Sliders,
  Award,
  Lock,
  ExternalLink,
} from 'lucide-react';
import { EnfStorageService } from '../../services/enf/enfStorageService';
import { EnfAuthService } from '../../services/enf/enfAuthService';
import { ENFCreditWallet, ENFOrder, ENFConfiguration, ENFCustomerProfile } from '../../types/enf';

interface EnfDevelopmentViewProps {
  onNavigate: (path: string) => void;
  userId?: string;
}

export const EnfDevelopmentView: React.FC<EnfDevelopmentViewProps> = ({
  onNavigate,
  userId = 'demo-enf-owner-1',
}) => {
  const [currentUser] = useState(() => EnfAuthService.getCurrentUser());
  const actualUserId = currentUser?.id || userId;

  const [wallet] = useState<ENFCreditWallet>(() => EnfStorageService.getOrCreateWallet(actualUserId));
  const [orders] = useState<ENFOrder[]>(() => EnfStorageService.getOrders());
  const [enfConfig] = useState<ENFConfiguration>(() => EnfStorageService.getENFConfig(actualUserId));
  const [profile] = useState<ENFCustomerProfile>(() => EnfStorageService.getProfile(actualUserId));

  const latestOrder = orders.find((o) => o.customerId === actualUserId) || orders[0];
  const isPaid = latestOrder && (latestOrder.status === 'PAID' || latestOrder.status === 'ACTIVATED');
  const isPaymentSubmitted = latestOrder && (latestOrder.status === 'PAYMENT_SUBMITTED' || latestOrder.status === 'UNDER_REVIEW');

  // 13 Milestones required by Section 20
  const milestones = [
    {
      id: 'ACCOUNT',
      number: 1,
      title: 'Account Registration',
      description: 'Encrypted subscriber credentials created with SHA-256 integrity validation.',
      status: 'COMPLETED',
      icon: Users,
      actionPath: '/enf/profile',
    },
    {
      id: 'PROFILE',
      number: 2,
      title: 'Customer Profile & IBP Details',
      description: 'Roll of Attorneys, commission jurisdiction, and law office credentials.',
      status: profile.onboardingStep >= 2 ? 'COMPLETED' : 'IN_PROGRESS',
      icon: FileText,
      actionPath: '/enf/profile',
    },
    {
      id: 'PAYMENT',
      number: 3,
      title: 'Development Plan Order',
      description: latestOrder ? `Plan selected: ${latestOrder.planName} (₱${latestOrder.amountPhp.toLocaleString()})` : 'Select development tier and generate payment reference.',
      status: latestOrder ? 'COMPLETED' : 'PENDING',
      icon: Zap,
      actionPath: '/enf/plans',
    },
    {
      id: 'PAYMENT_VERIFIED',
      number: 4,
      title: 'Administrative Payment Verification',
      description: isPaid
        ? 'Verified by JuriMbrella Financial Controller against bank settlement.'
        : isPaymentSubmitted
        ? 'Payment proof submitted. Under review by administrative desk.'
        : 'Awaiting Philippine bank remittance and proof upload.',
      status: isPaid ? 'COMPLETED' : isPaymentSubmitted ? 'IN_PROGRESS' : 'PENDING',
      icon: Shield,
      actionPath: isPaid ? '/enf/dashboard' : '/enf/payment',
    },
    {
      id: 'CREDITS_ACTIVATED',
      number: 5,
      title: 'Technical Credit Wallet Activated',
      description: isPaid
        ? `${wallet.availableCredits} Credits available at ₱${wallet.effectiveTechnicalFeePhp} effective fee (${(wallet.currentDiscountRate * 100).toFixed(0)}% discount).`
        : 'Credits and discounted fees unlock immediately upon payment confirmation.',
      status: isPaid && wallet.availableCredits > 0 ? 'COMPLETED' : 'PENDING',
      icon: Award,
      actionPath: '/enf/wallet',
    },
    {
      id: 'ENF_CONFIGURATION',
      number: 6,
      title: 'ENF Subdomain & Facility Architecture',
      description: `Domain slug: ${enfConfig.domainSlug || 'your-law'}.enf.jurimbrella.ph with SSL encryption.`,
      status: isPaid ? 'IN_PROGRESS' : 'LOCKED',
      icon: Compass,
      actionPath: '/enf/customize',
    },
    {
      id: 'BRANDING',
      number: 7,
      title: 'Law Firm Branding & Notarial Seals',
      description: 'Upload firm emblem, primary/secondary brand colors, and electronic seals.',
      status: isPaid && enfConfig.primaryColor ? 'IN_PROGRESS' : 'LOCKED',
      icon: Palette,
      actionPath: '/enf/customize',
    },
    {
      id: 'WORKFLOW',
      number: 8,
      title: 'Supreme Court Rule 7 Workflow Engine',
      description: 'Two-factor video audit logging, liveness verification, and biometric affirmation rules.',
      status: isPaid ? 'IN_PROGRESS' : 'LOCKED',
      icon: Sliders,
      actionPath: '/enf/customize',
    },
    {
      id: 'SERVICES',
      number: 9,
      title: 'Permitted Notarial Services Setup',
      description: `${enfConfig.allowedServices.length} notarial instruments active for digital intake.`,
      status: isPaid && enfConfig.allowedServices.length > 0 ? 'IN_PROGRESS' : 'LOCKED',
      icon: Layers,
      actionPath: '/enf/customize',
    },
    {
      id: 'DOCUMENTS',
      number: 10,
      title: 'Document Center & Custody Vault',
      description: 'Forensic PDF/A tamper-evident storage with SHA-256 hash anchoring.',
      status: isPaid ? 'IN_PROGRESS' : 'LOCKED',
      icon: FileText,
      actionPath: '/enf/documents',
    },
    {
      id: 'TEAM',
      number: 11,
      title: 'Staff & Assistant Delegation',
      description: 'Role-based access for ENP Assistants and administrative intake specialists.',
      status: isPaid ? 'IN_PROGRESS' : 'LOCKED',
      icon: Users,
      actionPath: '/enf/customize',
    },
    {
      id: 'FINAL_REVIEW',
      number: 12,
      title: 'A.M. No. 24-10-14-SC Compliance Review',
      description: 'Legal compliance validation against the Supreme Court Rules on Electronic Notarization.',
      status: isPaid ? 'IN_PROGRESS' : 'LOCKED',
      icon: Shield,
      actionPath: '/enf/customize',
    },
    {
      id: 'GO_LIVE',
      number: 13,
      title: 'Public Go-Live & Client Intake',
      description: 'Facility opened for client electronic acknowledgments, jurats, and copy certifications.',
      status: isPaid && enfConfig.workflowStage === 'PRODUCTION_ACTIVE' ? 'COMPLETED' : 'PENDING',
      icon: Sparkles,
      actionPath: '/enf/dashboard',
    },
  ];

  const completedCount = milestones.filter((m) => m.status === 'COMPLETED').length;
  const progressPercent = Math.round((completedCount / milestones.length) * 100);

  return (
    <div className="min-h-screen bg-[#F4F7F9] text-[#17212B] font-sans antialiased py-6 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D9E1E8] pb-5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('/enf/dashboard')}
              className="text-xs font-semibold text-[#0078CE] hover:underline cursor-pointer"
            >
              ← Back to Dashboard
            </button>
            <span className="text-slate-300">/</span>
            <div className="flex items-center gap-2">
              <Compass className="h-4 w-4 text-[#002D5B]" />
              <h1 className="text-base font-bold text-[#002D5B]">ENF Development Milestones</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('/enf/customize')}
              className="rounded-lg bg-[#002D5B] px-4 py-2 text-xs font-bold text-white hover:bg-[#0078CE] transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <span>Continue to ENF Customization</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Progress Banner */}
        <div className="rounded-2xl border border-[#D9E1E8] bg-white p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#0078CE]">
                Facility Onboarding Tracker
              </span>
              <h2 className="text-2xl font-extrabold text-[#002D5B]">
                {enfConfig.facilityName || 'Your Electronic Notarial Facility'}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Development Program Milestones • Supreme Court A.M. No. 24-10-14-SC Compliant
              </p>
            </div>

            <div className="text-right">
              <p className="text-3xl font-extrabold text-[#2EAF4A] font-mono">{progressPercent}%</p>
              <p className="text-xs text-slate-500 font-semibold">{completedCount} of 13 Milestones Complete</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#002D5B] via-[#0078CE] to-[#2EAF4A] transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
            <div className="rounded-xl bg-[#F4F7F9] p-3 border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Development Plan</span>
              <span className="font-bold text-[#002D5B] text-sm">
                {latestOrder?.planName || 'ENF ₱50K'}
              </span>
            </div>
            <div className="rounded-xl bg-[#F4F7F9] p-3 border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Payment Status</span>
              <span className={`font-bold text-sm ${isPaid ? 'text-[#2EAF4A]' : 'text-amber-600'}`}>
                {isPaid ? 'CONFIRMED & ACTIVATED' : isPaymentSubmitted ? 'UNDER REVIEW' : 'PENDING PAYMENT'}
              </span>
            </div>
            <div className="rounded-xl bg-[#F4F7F9] p-3 border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Available Technical Credits</span>
              <span className="font-bold text-[#002D5B] text-sm font-mono">
                {wallet.availableCredits} Credits (₱{wallet.effectiveTechnicalFeePhp}/filing)
              </span>
            </div>
          </div>
        </div>

        {/* 13 Milestones Grid */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#002D5B]">
            Development Architecture Milestones
          </h3>

          <div className="grid grid-cols-1 gap-3">
            {milestones.map((m) => {
              const Icon = m.icon;
              return (
                <div
                  key={m.id}
                  className={`rounded-xl border p-4 sm:p-5 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    m.status === 'COMPLETED'
                      ? 'border-[#2EAF4A]/40 bg-white'
                      : m.status === 'IN_PROGRESS'
                      ? 'border-[#0078CE] bg-white ring-1 ring-[#0078CE]/20'
                      : 'border-[#D9E1E8] bg-slate-50/60 opacity-80'
                  }`}
                >
                  <div className="flex items-start sm:items-center gap-3.5">
                    <div
                      className={`h-9 w-9 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                        m.status === 'COMPLETED'
                          ? 'bg-[#2EAF4A] text-white'
                          : m.status === 'IN_PROGRESS'
                          ? 'bg-[#002D5B] text-white'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {m.status === 'COMPLETED' ? <CheckCircle2 className="h-5 w-5" /> : m.number}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-[#002D5B] text-sm">{m.title}</h4>
                        <span
                          className={`rounded px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                            m.status === 'COMPLETED'
                              ? 'bg-[#2EAF4A]/15 text-[#1B6C2E]'
                              : m.status === 'IN_PROGRESS'
                              ? 'bg-[#0078CE]/15 text-[#002D5B]'
                              : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {m.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">{m.description}</p>
                    </div>
                  </div>

                  <div className="self-end sm:self-center">
                    <button
                      onClick={() => onNavigate(m.actionPath)}
                      className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                        m.status === 'COMPLETED'
                          ? 'border border-[#D9E1E8] bg-slate-50 text-slate-700 hover:bg-slate-100'
                          : m.status === 'IN_PROGRESS'
                          ? 'bg-[#002D5B] text-white hover:bg-[#0078CE]'
                          : 'border border-slate-200 text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      <span>{m.status === 'COMPLETED' ? 'Review' : 'Configure'}</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
