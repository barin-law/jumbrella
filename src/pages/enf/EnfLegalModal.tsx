import React, { useState } from 'react';
import { X, Shield, FileText, CheckCircle2, AlertTriangle, Scale, Lock, BookOpen } from 'lucide-react';

interface EnfLegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'TERMS' | 'PAYMENT' | 'CREDITS' | 'DISCLAIMER' | 'AGREEMENT';
}

export const EnfLegalModal: React.FC<EnfLegalModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'TERMS',
}) => {
  const [activeTab, setActiveTab] = useState<'TERMS' | 'PAYMENT' | 'CREDITS' | 'DISCLAIMER' | 'AGREEMENT'>(initialTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl bg-white text-[#17212B] shadow-2xl border border-[#D9E1E8] flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#D9E1E8] px-6 py-4 bg-[#002D5B] text-white rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-[#A8E063]">
              <Scale className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-sans">Legal & Commercial Disclosures</h2>
              <p className="text-xs text-slate-200">
                Electronic Notarial Facility Development & Prepaid Access Terms
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-300 hover:text-white hover:bg-white/10 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#D9E1E8] bg-[#F4F7F9] px-6 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('TERMS')}
            className={`py-3 px-4 border-b-2 font-medium cursor-pointer transition-colors whitespace-nowrap ${
              activeTab === 'TERMS'
                ? 'border-[#002D5B] text-[#002D5B] font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Terms of Use
          </button>
          <button
            onClick={() => setActiveTab('PAYMENT')}
            className={`py-3 px-4 border-b-2 font-medium cursor-pointer transition-colors whitespace-nowrap ${
              activeTab === 'PAYMENT'
                ? 'border-[#002D5B] text-[#002D5B] font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Payment & Bank Transfer
          </button>
          <button
            onClick={() => setActiveTab('CREDITS')}
            className={`py-3 px-4 border-b-2 font-medium cursor-pointer transition-colors whitespace-nowrap ${
              activeTab === 'CREDITS'
                ? 'border-[#002D5B] text-[#002D5B] font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Prepaid Technical Credits
          </button>
          <button
            onClick={() => setActiveTab('DISCLAIMER')}
            className={`py-3 px-4 border-b-2 font-medium cursor-pointer transition-colors whitespace-nowrap ${
              activeTab === 'DISCLAIMER'
                ? 'border-[#002D5B] text-[#002D5B] font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            AI Research Disclaimer
          </button>
          <button
            onClick={() => setActiveTab('AGREEMENT')}
            className={`py-3 px-4 border-b-2 font-medium cursor-pointer transition-colors whitespace-nowrap ${
              activeTab === 'AGREEMENT'
                ? 'border-[#002D5B] text-[#002D5B] font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            ENF Development Agreement
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-700 leading-relaxed">
          {activeTab === 'TERMS' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-[#0078CE]/20 bg-[#0078CE]/5 p-4 text-xs text-[#002D5B]">
                <p className="font-bold mb-1">MANDATORY REGULATORY DISTINCTION</p>
                <p>
                  JuriMbrella provides digital infrastructure, technical software tooling, and electronic facility connectivity under the Supreme Court of the Philippines Rules on Electronic Notarization (A.M. No. 24-10-14-SC). JuriMbrella is a legal technology platform provider and not a law firm or electronic notary public.
                </p>
              </div>

              <h3 className="font-bold text-[#002D5B] text-base">1. Nature of the Electronic Notarial Facility</h3>
              <p>
                The Electronic Notarial Facility (ENF) is a specialized, secure digital environment enabling commissioned Electronic Notaries Public (ENP), authorized witnesses, and principals to execute, record, and preserve electronic notarial acts in strict conformity with Philippine law.
              </p>

              <h3 className="font-bold text-[#002D5B] text-base">2. Separation of Fees</h3>
              <p>
                Platform users explicitly acknowledge that technical platform fees charged by JuriMbrella are strictly separate and independent from:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Professional notarial fees assessed solely by the independent Electronic Notary Public;</li>
                <li>Statutory court fees, legal research funds, and Integrated Bar of the Philippines (IBP) dues;</li>
                <li>Government taxes (Documentary Stamp Tax, withholding taxes, or local revenue charges).</li>
              </ul>

              <h3 className="font-bold text-[#002D5B] text-base">3. Non-Investment Representation</h3>
              <p>
                Participation in the ENF Development Program and acquisition of prepaid technical credits does NOT constitute an investment contract, security, deposit, loan, or partnership interest in JuriMbrella or its affiliates. Prepaid credits represent prepaid software access credits usable exclusively for technical platform fees.
              </p>
            </div>
          )}

          {activeTab === 'PAYMENT' && (
            <div className="space-y-4">
              <h3 className="font-bold text-[#002D5B] text-base">Philippine Bank Transfer & Administrative Verification Policy</h3>
              <p>
                To maintain the integrity of funds and comply with anti-money laundering and financial reporting obligations in the Philippines, all development plan payments are conducted through bank transfer to JuriMbrella’s corporate accounts.
              </p>

              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900 flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Administrative Verification Requirement</p>
                  <p className="mt-1">
                    Payments are not automatically credited. Customers must submit a valid bank transaction reference and an unedited transfer slip/screenshot. Official activation occurs only upon manual reconciliation by JuriMbrella Financial Officers.
                  </p>
                </div>
              </div>

              <h4 className="font-bold text-[#002D5B]">Refund & Adjustment Policy</h4>
              <p>
                Orders may be cancelled prior to administrative verification with full refund of the transferred amount less applicable third-party bank remittance fees. Once activated, prepaid credits are non-refundable in cash but remain valid indefinitely for technical platform transactions.
              </p>
            </div>
          )}

          {activeTab === 'CREDITS' && (
            <div className="space-y-4">
              <h3 className="font-bold text-[#002D5B] text-base">Prepaid Technical Credits & Discount Tiers</h3>
              <p>
                Prepaid technical credits purchased through the ENF development packages are recorded in a server-authoritative double-entry ledger.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-4">
                <div className="p-3 rounded-xl border border-[#D9E1E8] bg-white text-center">
                  <p className="text-xs font-bold text-slate-500">Starter Tier (₱20k)</p>
                  <p className="text-lg font-extrabold text-[#002D5B] mt-1">19% Discount</p>
                  <p className="text-xs text-[#2EAF4A] font-semibold">Pay ₱81 per ₱100 Base Fee</p>
                </div>
                <div className="p-3 rounded-xl border border-[#0078CE] bg-[#0078CE]/5 text-center">
                  <p className="text-xs font-bold text-[#0078CE]">Practice Tier (₱50k)</p>
                  <p className="text-lg font-extrabold text-[#002D5B] mt-1">45% Discount</p>
                  <p className="text-xs text-[#2EAF4A] font-semibold">Pay ₱55 per ₱100 Base Fee</p>
                </div>
                <div className="p-3 rounded-xl border border-[#2EAF4A] bg-[#2EAF4A]/5 text-center">
                  <p className="text-xs font-bold text-[#2EAF4A]">Enterprise Tier (₱100k)</p>
                  <p className="text-lg font-extrabold text-[#002D5B] mt-1">79% Discount</p>
                  <p className="text-xs text-[#2EAF4A] font-semibold">Pay ₱21 per ₱100 Base Fee</p>
                </div>
              </div>

              <h4 className="font-bold text-[#002D5B]">Credits Validity & Accounting</h4>
              <p>
                Prepaid credits do not expire as long as the ENF facility account remains in good standing. Every deduction generates an immutable transaction log with cryptographic transaction ID, pre-transaction balance, exact deducted amount, and remaining balance.
              </p>
            </div>
          )}

          {activeTab === 'DISCLAIMER' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-[#2EAF4A]/30 bg-[#2EAF4A]/5 p-4 text-xs text-[#1B6C2E] flex items-start gap-3">
                <BookOpen className="h-5 w-5 text-[#2EAF4A] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">AI LEGAL RESEARCH ASSISTANCE NOTICE</p>
                  <p className="mt-1">
                    The ENF AI Research Assistant is an automated legal information retrieval and document indexing tool. It searches codified statutes, Supreme Court rules, and verified legal precedents.
                  </p>
                </div>
              </div>

              <h3 className="font-bold text-[#002D5B] text-base">Not Legal Advice</h3>
              <p>
                AI research output does NOT constitute formal legal advice, judicial interpretation, or an attorney-client relationship. Commissioned Electronic Notaries Public and practitioners retain sole statutory responsibility for reviewing all documents, verifying statutory compliance, and applying legal discretion under their oath of office.
              </p>

              <h3 className="font-bold text-[#002D5B] text-base">Citations & Verification</h3>
              <p>
                Every AI output provides source citations, rule numbers, and relevant provisions (such as Supreme Court A.M. No. 24-10-14-SC, R.A. 8792, and the Rules on Electronic Evidence). Users are advised to verify citations against the official Supreme Court e-Library or Official Gazette.
              </p>
            </div>
          )}

          {activeTab === 'AGREEMENT' && (
            <div className="space-y-4">
              <h3 className="font-bold text-[#002D5B] text-base">ENF Development Program Agreement</h3>
              <p>
                By creating an ENF development order and completing onboarding, the subscriber enters into a software service level and infrastructure development agreement with JuriMbrella Legal Technology Corp.
              </p>
              <h4 className="font-bold text-[#002D5B]">Platform Deliverables:</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Bespoke sub-domain and secure TLS portal deployment;</li>
                <li>Customized branding, practice profile, and document seal integration;</li>
                <li>Encrypted client intake and remote video waiting room facilities;</li>
                <li>Continuous maintenance and alignment with updated Supreme Court circulars;</li>
                <li>Forensic audit logging and tamper-proof electronic notarial register backing.</li>
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[#D9E1E8] px-6 py-4 bg-[#F4F7F9] rounded-b-2xl">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Lock className="h-3.5 w-3.5 text-[#0078CE]" />
            <span>JuriMbrella Terms Version: v2026.1-SC-AM241014</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg bg-[#002D5B] px-5 py-2 text-xs font-semibold text-white hover:bg-[#0078CE] transition-all shadow-xs cursor-pointer"
          >
            I Understand & Agree
          </button>
        </div>
      </div>
    </div>
  );
};
