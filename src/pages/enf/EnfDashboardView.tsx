import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Building,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  Shield,
  Layers,
  Sparkles,
  Zap,
  TrendingUp,
  FileText,
  Users,
  Compass,
  DollarSign,
  Download,
  ExternalLink,
  ChevronRight,
  Check,
  Send,
  RefreshCw,
  Bell,
  HelpCircle,
} from 'lucide-react';
import { EnfStorageService } from '../../services/enf/enfStorageService';
import {
  ENFCreditWallet,
  ENFCreditLedgerEntry,
  ENFOrder,
  ENFConfiguration,
  ENFCustomerProfile,
} from '../../types/enf';
import { BrandLogo } from '../../components/common/BrandLogo';

interface EnfDashboardViewProps {
  onNavigate: (path: string) => void;
  userId?: string;
}

export const EnfDashboardView: React.FC<EnfDashboardViewProps> = ({
  onNavigate,
  userId = 'demo-enf-owner-1',
}) => {
  const [wallet, setWallet] = useState<ENFCreditWallet>(() =>
    EnfStorageService.getOrCreateWallet(userId)
  );
  const [ledger, setLedger] = useState<ENFCreditLedgerEntry[]>(() =>
    EnfStorageService.getLedger(wallet.id)
  );
  const [orders, setOrders] = useState<ENFOrder[]>(() => EnfStorageService.getOrders());
  const [enfConfig, setEnfConfig] = useState<ENFConfiguration>(() =>
    EnfStorageService.getENFConfig(userId)
  );
  const [profile, setProfile] = useState<ENFCustomerProfile>(() =>
    EnfStorageService.getProfile(userId)
  );

  const [testSimulating, setTestSimulating] = useState(false);
  const [simulationMessage, setSimulationMessage] = useState<string | null>(null);

  // Refresh data
  const refreshData = () => {
    const updatedWallet = EnfStorageService.getOrCreateWallet(userId);
    setWallet(updatedWallet);
    setLedger(EnfStorageService.getLedger(updatedWallet.id));
    setOrders(EnfStorageService.getOrders());
    setEnfConfig(EnfStorageService.getENFConfig(userId));
    setProfile(EnfStorageService.getProfile(userId));
  };

  useEffect(() => {
    refreshData();
  }, [userId]);

  // Compute onboarding steps (Section 16)
  const latestOrder = orders[0];
  const isPaid = latestOrder && (latestOrder.status === 'PAID' || latestOrder.status === 'ACTIVATED');
  const isUnderReview = latestOrder && latestOrder.status === 'UNDER_REVIEW';

  const onboardingSteps = [
    { name: 'Account Created', done: true },
    { name: 'Email Verification', done: profile.emailVerified },
    { name: 'Customer Profile', done: profile.onboardingStep >= 2 },
    { name: 'Plan Selected', done: !!latestOrder },
    { name: 'Bank Transfer', done: isUnderReview || isPaid },
    { name: 'Admin Verification', done: isPaid },
    { name: 'Credit Wallet Activated', done: isPaid && wallet.availableBalancePhp > 0 },
    { name: 'Facility Branding', done: enfConfig.facilityName.length > 0 },
    { name: 'Workflow Rules', done: enfConfig.allowedServices.length > 0 },
    { name: 'Go-Live Readiness', done: isPaid },
  ];

  const completedStepsCount = onboardingSteps.filter((s) => s.done).length;
  const progressPercent = Math.round((completedStepsCount / onboardingSteps.length) * 100);

  // Live test transaction: Simulates executing an electronic notarization technical fee
  const handleSimulateNotarization = () => {
    setTestSimulating(true);
    setSimulationMessage(null);

    setTimeout(() => {
      const res = EnfStorageService.debitTechnicalFee(
        userId,
        'srv-remote-notarization',
        `BENF-DEMO-${Date.now().toString().slice(-4)}`
      );

      if (res.success) {
        setSimulationMessage(res.message);
        refreshData();
      } else {
        setSimulationMessage(res.message);
      }
      setTestSimulating(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#F4F7F9] text-[#17212B] font-sans antialiased py-6 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-8">
        {/* Top Header / Context */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D9E1E8] pb-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#002D5B] text-white flex items-center justify-center font-bold text-sm shadow-xs">
              ENF
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-[#002D5B] font-sans">
                  {enfConfig.facilityName || 'My Electronic Notarial Facility'}
                </h1>
                <span className="rounded bg-[#2EAF4A]/20 px-2 py-0.5 text-[10px] font-bold text-[#1B6C2E] uppercase">
                  {wallet.status === 'ACTIVE' ? 'Active Facility' : 'Setup Stage'}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                A.M. No. 24-10-14-SC Aligned • Subscriber: {profile.fullName} ({profile.rollNumber ? `Roll #${profile.rollNumber}` : 'Pending Roll'})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => onNavigate('/enf/builder')}
              className="rounded-lg bg-[#002D5B] px-3.5 py-2 text-white hover:bg-[#0078CE] transition-all font-semibold shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Compass className="h-3.5 w-3.5" />
              <span>Customize Facility</span>
            </button>
            <button
              onClick={() => onNavigate('/enf/admin')}
              className="rounded-lg border border-[#D9E1E8] bg-white px-3 py-2 text-slate-700 hover:text-[#002D5B] hover:border-[#0078CE] transition-all font-semibold shadow-2xs cursor-pointer flex items-center gap-1.5"
              title="Open Admin Payment Verification & Control Desk"
            >
              <Shield className="h-3.5 w-3.5 text-[#0078CE]" />
              <span>Admin Desk</span>
            </button>
          </div>
        </div>

        {/* SECTION 24: "WHERE I AM / WHAT I NEED TO DO" CUSTOMER EXPERIENCE STATUS BAR */}
        <div className="rounded-2xl border border-[#002D5B] bg-gradient-to-r from-[#002D5B] to-[#003F7D] text-white p-5 sm:p-6 shadow-md space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#A8E063]">
                Facility Status Overview (Section 24 Customer Clarity)
              </span>
              <h2 className="text-lg font-bold font-sans mt-0.5">
                {isPaid
                  ? 'All Systems Operational — Your ENF is Active & Ready'
                  : isUnderReview
                  ? 'Payment Under Administrative Verification'
                  : 'Action Required: Complete Plan Payment Remittance'}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-[11px] text-slate-300">Onboarding Completion</p>
                <p className="text-base font-extrabold font-mono text-[#A8E063]">{progressPercent}%</p>
              </div>
              <div className="w-24 bg-white/20 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-[#2EAF4A] h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* 6 Key Clarity Pillars */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-xs pt-1">
            <div className="bg-white/5 rounded-xl p-2.5 border border-white/10">
              <span className="text-[10px] text-slate-300 block">WHERE I AM</span>
              <span className="font-bold text-white text-xs truncate block">
                {isPaid ? 'Development Active' : isUnderReview ? 'Under Review' : 'Checkout'}
              </span>
            </div>

            <div className="bg-white/5 rounded-xl p-2.5 border border-white/10">
              <span className="text-[10px] text-slate-300 block">WHAT I NEED TO DO</span>
              <span className="font-bold text-[#A8E063] text-xs truncate block">
                {isPaid ? 'Add Clients & Seals' : isUnderReview ? 'Wait for Admin' : 'Submit Bank Proof'}
              </span>
            </div>

            <div className="bg-white/5 rounded-xl p-2.5 border border-white/10">
              <span className="text-[10px] text-slate-300 block">WHAT I HAVE PAID</span>
              <span className="font-bold text-white font-mono text-xs truncate block">
                ₱{wallet.totalPurchasedPhp.toLocaleString()}
              </span>
            </div>

            <div className="bg-white/5 rounded-xl p-2.5 border border-white/10">
              <span className="text-[10px] text-slate-300 block">CREDIT BALANCE</span>
              <span className="font-bold text-[#A8E063] font-mono text-xs truncate block">
                ₱{wallet.availableBalancePhp.toLocaleString()}
              </span>
            </div>

            <div className="bg-white/5 rounded-xl p-2.5 border border-white/10">
              <span className="text-[10px] text-slate-300 block">FEE DISCOUNT</span>
              <span className="font-bold text-[#0078CE] bg-white px-1.5 py-0.2 rounded font-mono text-[11px] truncate block w-fit">
                {(wallet.currentDiscountRate * 100).toFixed(0)}% OFF
              </span>
            </div>

            <div className="bg-white/5 rounded-xl p-2.5 border border-white/10">
              <span className="text-[10px] text-slate-300 block">WHAT HAPPENS NEXT</span>
              <span className="font-bold text-white text-xs truncate block">
                {isPaid ? 'Conduct Notarization' : 'Credit Activation'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Banner for Pending Verification */}
        {isUnderReview && (
          <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-xs text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm">Payment Under Administrative Verification</p>
                <p className="text-amber-800">
                  Your bank remittance for <strong>{latestOrder.planName}</strong> (₱{latestOrder.amountPhp.toLocaleString()}) is currently being reconciled. Once approved, ₱{latestOrder.creditAmountPhp.toLocaleString()} credits will appear in your wallet instantly.
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('/enf/admin')}
              className="rounded-lg bg-amber-800 px-3 py-1.5 text-xs font-bold text-white hover:bg-amber-900 transition-colors shrink-0 cursor-pointer"
            >
              Open Admin Desk (Reviewer Simulation)
            </button>
          </div>
        )}

        {/* 4 PRIMARY METRIC CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Available Credit Balance */}
          <div className="rounded-2xl border border-[#D9E1E8] bg-white p-5 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Available Credits</span>
              <div className="h-8 w-8 rounded-lg bg-[#2EAF4A]/10 text-[#2EAF4A] flex items-center justify-center font-bold">
                ₱
              </div>
            </div>
            <p className="text-3xl font-extrabold text-[#002D5B] font-mono">
              ₱{wallet.availableBalancePhp.toLocaleString()}.00
            </p>
            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
              <span className="text-slate-500">Total Purchased:</span>
              <span className="font-semibold text-slate-700 font-mono">₱{wallet.totalPurchasedPhp.toLocaleString()}</span>
            </div>
          </div>

          {/* Card 2: Discount Tier */}
          <div className="rounded-2xl border border-[#D9E1E8] bg-white p-5 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Technical Fee Discount</span>
              <div className="h-8 w-8 rounded-lg bg-[#0078CE]/10 text-[#0078CE] flex items-center justify-center">
                <Zap className="h-4 w-4" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-[#0078CE] font-mono">
              {(wallet.currentDiscountRate * 100).toFixed(0)}% OFF
            </p>
            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
              <span className="text-slate-500">Pay per ₱100 standard fee:</span>
              <span className="font-bold text-[#2EAF4A] font-mono">
                ₱{(100 * (1 - wallet.currentDiscountRate)).toFixed(0)}.00
              </span>
            </div>
          </div>

          {/* Card 3: Total Credits Used */}
          <div className="rounded-2xl border border-[#D9E1E8] bg-white p-5 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Credits Consumed</span>
              <div className="h-8 w-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-slate-700 font-mono">
              ₱{wallet.totalUsedPhp.toLocaleString()}.00
            </p>
            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
              <span className="text-slate-500">Transactions Count:</span>
              <span className="font-semibold text-slate-700 font-mono">{ledger.length}</span>
            </div>
          </div>

          {/* Card 4: Facility Domain & Readiness */}
          <div className="rounded-2xl border border-[#D9E1E8] bg-white p-5 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Custom ENF Subdomain</span>
              <div className="h-8 w-8 rounded-lg bg-[#002D5B]/10 text-[#002D5B] flex items-center justify-center">
                <ExternalLink className="h-4 w-4" />
              </div>
            </div>
            <p className="text-sm font-bold text-[#002D5B] truncate font-mono">
              {enfConfig.domainSlug}.enf.jurimbrella.ph
            </p>
            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
              <span className="text-slate-500">Status:</span>
              <span className="font-bold text-[#2EAF4A]">SSL & Sandbox Active</span>
            </div>
          </div>
        </div>

        {/* SECTION: LIVE NOTARIAL SIMULATION & LEDGER DEMONSTRATION */}
        <div className="rounded-2xl border border-[#D9E1E8] bg-white p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D9E1E8] pb-4">
            <div>
              <h3 className="text-base font-bold text-[#002D5B] flex items-center gap-2">
                <Zap className="h-4 w-4 text-[#0078CE]" />
                <span>Live Technical Fee Engine & Ledger Debit Simulator</span>
              </h3>
              <p className="text-xs text-slate-500">
                Execute a test electronic notarization transaction to observe the real server-authoritative ledger deduction and discount calculation.
              </p>
            </div>

            <button
              onClick={handleSimulateNotarization}
              disabled={testSimulating || wallet.availableBalancePhp < 50}
              className="rounded-xl bg-[#2EAF4A] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#258F3C] transition-all shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${testSimulating ? 'animate-spin' : ''}`} />
              <span>Simulate Notarial Debit (₱100 Base)</span>
            </button>
          </div>

          {simulationMessage && (
            <div className="rounded-xl border border-[#2EAF4A]/30 bg-[#2EAF4A]/10 p-3 text-xs text-[#1B6C2E] flex items-center gap-2 font-medium">
              <CheckCircle2 className="h-4 w-4 text-[#2EAF4A] shrink-0" />
              <span>{simulationMessage}</span>
            </div>
          )}

          {/* Quick Explanatory Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="rounded-lg bg-[#F4F7F9] p-3 border border-[#D9E1E8]">
              <span className="text-slate-500 block">Base Platform Fee:</span>
              <strong className="text-slate-800 text-sm font-mono">₱100.00</strong>
            </div>
            <div className="rounded-lg bg-[#F4F7F9] p-3 border border-[#D9E1E8]">
              <span className="text-slate-500 block">Your Applied Discount:</span>
              <strong className="text-[#0078CE] text-sm font-mono">
                {(wallet.currentDiscountRate * 100).toFixed(0)}% OFF (-₱{(100 * wallet.currentDiscountRate).toFixed(0)})
              </strong>
            </div>
            <div className="rounded-lg bg-[#F4F7F9] p-3 border border-[#D9E1E8]">
              <span className="text-slate-500 block">Exact Ledger Debit:</span>
              <strong className="text-[#2EAF4A] text-sm font-mono">
                ₱{(100 * (1 - wallet.currentDiscountRate)).toFixed(0)}.00
              </strong>
            </div>
          </div>
        </div>

        {/* 2-COLUMN SECTION: RECENT LEDGER TRANSACTIONS & QUICK NAVIGATION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Recent Ledger Transactions (Section 9 & 25) */}
          <div className="lg:col-span-8 rounded-2xl border border-[#D9E1E8] bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#D9E1E8] pb-4">
              <div>
                <h3 className="text-base font-bold text-[#002D5B]">Recent Credit Ledger Entries</h3>
                <p className="text-xs text-slate-500">
                  Double-entry server records with pre- and post-transaction balances.
                </p>
              </div>
              <button
                onClick={() => onNavigate('/enf/wallet')}
                className="text-xs font-semibold text-[#0078CE] hover:underline cursor-pointer"
              >
                View Full Ledger →
              </button>
            </div>

            {ledger.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No ledger entries recorded yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 font-semibold">
                      <th className="pb-2">Type</th>
                      <th className="pb-2">Description</th>
                      <th className="pb-2">Amount</th>
                      <th className="pb-2">Balance</th>
                      <th className="pb-2">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {ledger.slice(0, 5).map((entry) => {
                      const isCredit = entry.type === 'CREDIT';
                      return (
                        <tr key={entry.id} className="hover:bg-slate-50/80">
                          <td className="py-3">
                            <span
                              className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                                isCredit
                                  ? 'bg-[#2EAF4A]/20 text-[#1B6C2E]'
                                  : 'bg-slate-200 text-slate-700'
                              }`}
                            >
                              {entry.type}
                            </span>
                          </td>
                          <td className="py-3 max-w-[220px] truncate font-medium text-[#002D5B]">
                            {entry.serviceName}
                          </td>
                          <td
                            className={`py-3 font-mono font-bold ${
                              isCredit ? 'text-[#2EAF4A]' : 'text-slate-700'
                            }`}
                          >
                            {isCredit ? '+' : '-'}₱{entry.amountPhp.toLocaleString()}.00
                          </td>
                          <td className="py-3 font-mono text-slate-600">
                            ₱{entry.balanceAfterPhp.toLocaleString()}
                          </td>
                          <td className="py-3 text-[11px] text-slate-400">
                            {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Right: Quick Module Navigation */}
          <div className="lg:col-span-4 space-y-4">
            <div className="rounded-2xl border border-[#D9E1E8] bg-white p-5 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-[#002D5B] uppercase tracking-wider">
                ENF Modules & Tooling
              </h3>

              <div className="space-y-2">
                <button
                  onClick={() => onNavigate('/enf/builder')}
                  className="w-full rounded-xl border border-[#D9E1E8] p-3 text-left hover:border-[#0078CE] hover:bg-[#F4F7F9] transition-all flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Compass className="h-4 w-4 text-[#0078CE]" />
                    <div>
                      <p className="text-xs font-bold text-[#002D5B]">Customize My ENF</p>
                      <p className="text-[10px] text-slate-500">Logo, brand colors & document seal</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </button>

                <button
                  onClick={() => onNavigate('/enf/clients')}
                  className="w-full rounded-xl border border-[#D9E1E8] p-3 text-left hover:border-[#0078CE] hover:bg-[#F4F7F9] transition-all flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Users className="h-4 w-4 text-[#2EAF4A]" />
                    <div>
                      <p className="text-xs font-bold text-[#002D5B]">Client Intake Directory</p>
                      <p className="text-[10px] text-slate-500">Manage principals & organizations</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </button>

                <button
                  onClick={() => onNavigate('/enf/documents')}
                  className="w-full rounded-xl border border-[#D9E1E8] p-3 text-left hover:border-[#0078CE] hover:bg-[#F4F7F9] transition-all flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-[#002D5B]" />
                    <div>
                      <p className="text-xs font-bold text-[#002D5B]">Document Center</p>
                      <p className="text-[10px] text-slate-500">Archive, receipts, & evidence hashes</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </button>

                <button
                  onClick={() => onNavigate('/enf/research')}
                  className="w-full rounded-xl border border-[#D9E1E8] p-3 text-left hover:border-[#0078CE] hover:bg-[#F4F7F9] transition-all flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Sparkles className="h-4 w-4 text-[#A8E063]" />
                    <div>
                      <p className="text-xs font-bold text-[#002D5B]">AI Legal Research Desk</p>
                      <p className="text-[10px] text-slate-500">Supreme Court rule search & citations</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </button>

                <button
                  onClick={() => onNavigate('/enf/support')}
                  className="w-full rounded-xl border border-[#D9E1E8] p-3 text-left hover:border-[#0078CE] hover:bg-[#F4F7F9] transition-all flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle className="h-4 w-4 text-slate-500" />
                    <div>
                      <p className="text-xs font-bold text-[#002D5B]">Support Desk</p>
                      <p className="text-[10px] text-slate-500">Tickets & onboarding assistance</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </button>
              </div>
            </div>

            {/* Replenish Credits CTA */}
            <div className="rounded-2xl border border-[#2EAF4A]/40 bg-[#2EAF4A]/5 p-5 space-y-3">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-[#2EAF4A]" />
                <h4 className="text-xs font-bold text-[#1B6C2E] uppercase tracking-wider">
                  Replenish Credits
                </h4>
              </div>
              <p className="text-xs text-slate-600">
                Lock in higher discount tiers up to 79% by acquiring prepaid credits for future notarizations.
              </p>
              <button
                onClick={() => onNavigate('/enf/order')}
                className="w-full rounded-xl bg-[#2EAF4A] py-2.5 text-xs font-bold text-white hover:bg-[#258F3C] transition-colors shadow-xs cursor-pointer"
              >
                Top-up Technical Credits
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
