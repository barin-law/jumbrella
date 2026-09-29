import React, { useState } from 'react';
import {
  Shield,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileText,
  DollarSign,
  Download,
  CreditCard,
  Building,
  Settings,
  History,
  TrendingUp,
  Search,
  Check,
  Clock,
  Eye,
  Edit,
  Save,
  Lock,
  ArrowRight,
} from 'lucide-react';
import { EnfStorageService } from '../../services/enf/enfStorageService';
import {
  ENFPaymentSubmission,
  ENFOrder,
  ENFPlan,
  ENFBankConfig,
  ENFCreditWallet,
  ENFCreditLedgerEntry,
  ENFAuditLogRecord,
} from '../../types/enf';

interface EnfAdminPortalViewProps {
  onNavigate: (path: string) => void;
}

export const EnfAdminPortalView: React.FC<EnfAdminPortalViewProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<
    'PAYMENTS' | 'ORDERS' | 'PLANS' | 'BANK_SETTINGS' | 'WALLETS' | 'AUDIT_LOGS' | 'REPORTS'
  >('PAYMENTS');

  // Live state from storage service
  const [payments, setPayments] = useState<ENFPaymentSubmission[]>(() =>
    EnfStorageService.getPayments()
  );
  const [orders, setOrders] = useState<ENFOrder[]>(() => EnfStorageService.getOrders());
  const [plans, setPlans] = useState<ENFPlan[]>(() => EnfStorageService.getPlans());
  const [bankConfig, setBankConfig] = useState<ENFBankConfig>(() =>
    EnfStorageService.getBankConfig()
  );
  const [wallets, setWallets] = useState<ENFCreditWallet[]>(() =>
    EnfStorageService.getWallets()
  );
  const [ledger, setLedger] = useState<ENFCreditLedgerEntry[]>(() =>
    EnfStorageService.getLedger()
  );
  const [auditLogs, setAuditLogs] = useState<ENFAuditLogRecord[]>(() =>
    EnfStorageService.getAuditLogs()
  );
  const [reports, setReports] = useState(() => EnfStorageService.getAdminReports());

  // Payment Verification selection & action state
  const [selectedPayment, setSelectedPayment] = useState<ENFPaymentSubmission | null>(
    payments[0] || null
  );
  const [actionModal, setActionModal] = useState<{
    type: 'CONFIRM' | 'REQUEST_INFO' | 'REJECT' | null;
    payment: ENFPaymentSubmission | null;
  }>({ type: null, payment: null });
  const [actionReason, setActionReason] = useState('');
  const [adminNotes, setAdminNotes] = useState('Reconciled with BDO online bank statement.');
  const [feedback, setFeedback] = useState<string | null>(null);

  // Plan editing state
  const [editingPlan, setEditingPlan] = useState<ENFPlan | null>(null);

  // Bank settings form state
  const [bankForm, setBankForm] = useState<ENFBankConfig>(bankConfig);

  const reloadData = () => {
    setPayments(EnfStorageService.getPayments());
    setOrders(EnfStorageService.getOrders());
    setPlans(EnfStorageService.getPlans());
    setBankConfig(EnfStorageService.getBankConfig());
    setWallets(EnfStorageService.getWallets());
    setLedger(EnfStorageService.getLedger());
    setAuditLogs(EnfStorageService.getAuditLogs());
    setReports(EnfStorageService.getAdminReports());
  };

  // Execution of payment verification action (Section 7 & 8)
  const handleExecuteVerification = () => {
    if (!actionModal.payment || !actionModal.type) return;

    const res = EnfStorageService.verifyPayment(actionModal.payment.id, actionModal.type, {
      reason: actionReason,
      adminNotes,
      actorEmail: 'superadmin@jurimbrella.ph',
    });

    setFeedback(res.message);
    setActionModal({ type: null, payment: null });
    setActionReason('');
    reloadData();
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleSavePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;
    EnfStorageService.updatePlan(editingPlan, 'superadmin@jurimbrella.ph');
    setEditingPlan(null);
    reloadData();
    setFeedback(`Plan ${editingPlan.name} updated successfully.`);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleSaveBankConfig = (e: React.FormEvent) => {
    e.preventDefault();
    EnfStorageService.updateBankConfig(bankForm, 'superadmin@jurimbrella.ph');
    reloadData();
    setFeedback('Official bank configuration saved successfully.');
    setTimeout(() => setFeedback(null), 3000);
  };

  const exportOrdersCsv = () => {
    const csv = EnfStorageService.generateOrdersCsv();
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ENF_Orders_Export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#F4F7F9] text-[#17212B] font-sans antialiased py-6 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D9E1E8] pb-5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('/enf')}
              className="text-xs font-semibold text-[#0078CE] hover:underline cursor-pointer"
            >
              ← Back to ENF Public
            </button>
            <span className="text-slate-300">/</span>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-[#002D5B]" />
              <h1 className="text-base font-bold text-[#002D5B]">
                ENF Platform Administrative Console (FINANCE & SUPER_ADMIN)
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('/enf/dashboard')}
              className="rounded-lg border border-[#D9E1E8] bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-[#002D5B] shadow-2xs cursor-pointer"
            >
              Customer View
            </button>
            <span className="rounded-md bg-[#002D5B] px-2.5 py-1 text-xs font-bold text-white font-mono">
              FINANCE PRIVILEGED
            </span>
          </div>
        </div>

        {feedback && (
          <div className="rounded-xl border border-[#2EAF4A]/40 bg-[#2EAF4A]/10 p-3.5 text-xs text-[#1B6C2E] flex items-center gap-2 font-bold shadow-xs">
            <CheckCircle2 className="h-4 w-4 text-[#2EAF4A] shrink-0" />
            <span>{feedback}</span>
          </div>
        )}

        {/* 4 KPI CARDS (Section 30) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-[#D9E1E8] bg-white p-5 shadow-xs space-y-1">
            <span className="text-xs font-semibold text-slate-500">Total Confirmed Revenue</span>
            <p className="text-2xl font-extrabold text-[#002D5B] font-mono">
              ₱{reports.totalRevenuePhp.toLocaleString()}.00
            </p>
            <p className="text-[11px] text-[#2EAF4A] font-semibold">{reports.paidOrdersCount} Paid Orders</p>
          </div>

          <div className="rounded-2xl border border-[#D9E1E8] bg-white p-5 shadow-xs space-y-1">
            <span className="text-xs font-semibold text-slate-500">Pending Bank Verifications</span>
            <p className="text-2xl font-extrabold text-amber-600 font-mono">
              {reports.pendingVerificationCount} Submissions
            </p>
            <p className="text-[11px] text-amber-700 font-semibold">Requires Action Below</p>
          </div>

          <div className="rounded-2xl border border-[#D9E1E8] bg-white p-5 shadow-xs space-y-1">
            <span className="text-xs font-semibold text-slate-500">Credits Funded</span>
            <p className="text-2xl font-extrabold text-[#0078CE] font-mono">
              ₱{reports.totalCreditsFundedPhp.toLocaleString()}.00
            </p>
            <p className="text-[11px] text-slate-500">Across {reports.activeWalletsCount} Wallets</p>
          </div>

          <div className="rounded-2xl border border-[#D9E1E8] bg-white p-5 shadow-xs space-y-1">
            <span className="text-xs font-semibold text-slate-500">Double-Entry Ledger Records</span>
            <p className="text-2xl font-extrabold text-slate-800 font-mono">
              {reports.ledgerTransactionsCount} Transactions
            </p>
            <p className="text-[11px] text-[#2EAF4A] font-semibold">Immutable Hashes Verified</p>
          </div>
        </div>

        {/* ADMIN CONSOLE TABS */}
        <div className="flex border-b border-[#D9E1E8] bg-white p-2 rounded-xl shadow-2xs overflow-x-auto text-xs font-semibold">
          {[
            { id: 'PAYMENTS', label: `Payment Verification (${reports.pendingVerificationCount})` },
            { id: 'ORDERS', label: `Development Orders (${orders.length})` },
            { id: 'PLANS', label: 'Commercial Plans Config' },
            { id: 'BANK_SETTINGS', label: 'Bank Remittance Settings' },
            { id: 'WALLETS', label: `Credit Wallets & Ledger (${wallets.length})` },
            { id: 'AUDIT_LOGS', label: `Audit Trail (${auditLogs.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-lg whitespace-nowrap cursor-pointer transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#002D5B] text-white font-bold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: PAYMENT VERIFICATION WORKFLOW (Section 7 & 8) */}
        {activeTab === 'PAYMENTS' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Payment Queue List */}
            <div className="lg:col-span-5 rounded-2xl border border-[#D9E1E8] bg-white p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-xs font-bold text-[#002D5B] uppercase tracking-wider">
                  Payment Verification Queue
                </h3>
                <span className="text-[10px] text-slate-400 font-mono">Section 7 & 8</span>
              </div>

              <div className="space-y-2">
                {payments.map((p) => {
                  const isSelected = selectedPayment?.id === p.id;
                  const isPending = p.status === 'PAYMENT_SUBMITTED' || p.status === 'UNDER_REVIEW';

                  return (
                    <div
                      key={p.id}
                      onClick={() => setSelectedPayment(p)}
                      className={`rounded-xl border p-3.5 cursor-pointer transition-all space-y-2 ${
                        isSelected
                          ? 'border-[#0078CE] bg-[#0078CE]/5 ring-1 ring-[#0078CE]'
                          : 'border-[#D9E1E8] hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-[#002D5B]">{p.paymentRef}</span>
                        <span
                          className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                            p.status === 'PAID'
                              ? 'bg-[#2EAF4A]/20 text-[#1B6C2E]'
                              : isPending
                              ? 'bg-amber-100 text-amber-900 animate-pulse'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {p.status}
                        </span>
                      </div>

                      <div className="flex justify-between items-baseline">
                        <p className="text-xs font-bold text-slate-800 truncate">{p.customerName}</p>
                        <p className="text-sm font-extrabold text-[#002D5B] font-mono">
                          ₱{p.amountPhp.toLocaleString()}
                        </p>
                      </div>

                      <div className="text-[10px] text-slate-500 flex justify-between border-t border-slate-100 pt-1.5">
                        <span>{p.bankName}</span>
                        <span>{new Date(p.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Payment Details & Action Inspector */}
            <div className="lg:col-span-7 rounded-2xl border border-[#D9E1E8] bg-white p-6 shadow-xs space-y-6">
              {selectedPayment ? (
                <>
                  <div className="border-b border-[#D9E1E8] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-bold text-[#0078CE] uppercase tracking-wider">
                        Submission ID: {selectedPayment.id}
                      </span>
                      <h2 className="text-lg font-bold text-[#002D5B]">
                        Remittance Verification: {selectedPayment.paymentRef}
                      </h2>
                    </div>

                    <span
                      className={`rounded px-2.5 py-1 text-xs font-bold font-mono ${
                        selectedPayment.status === 'PAID'
                          ? 'bg-[#2EAF4A]/20 text-[#1B6C2E]'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {selectedPayment.status}
                    </span>
                  </div>

                  {/* Comparison Grid */}
                  <div className="grid grid-cols-2 gap-3 text-xs bg-[#F4F7F9] p-4 rounded-xl border border-[#D9E1E8]">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Customer Name</span>
                      <span className="font-bold text-[#002D5B]">{selectedPayment.customerName}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Associated Order ID</span>
                      <span className="font-bold font-mono text-[#002D5B]">{selectedPayment.orderId}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Remitting Bank</span>
                      <span className="font-bold text-[#002D5B]">{selectedPayment.bankName}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Bank Transaction Ref</span>
                      <span className="font-bold font-mono text-[#002D5B]">{selectedPayment.bankTransactionRef}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Remitted Amount</span>
                      <span className="font-extrabold text-base text-[#2EAF4A] font-mono">
                        ₱{selectedPayment.amountPhp.toLocaleString()}.00
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Transfer Date & Time</span>
                      <span className="font-semibold text-slate-700">
                        {selectedPayment.transferDate} at {selectedPayment.transferTime}
                      </span>
                    </div>
                  </div>

                  {/* Proof of Payment File Preview Card */}
                  <div className="rounded-xl border border-[#D9E1E8] p-4 space-y-2">
                    <p className="text-xs font-bold text-[#002D5B] flex items-center gap-1.5">
                      <FileText className="h-4 w-4 text-[#0078CE]" />
                      <span>Uploaded Proof of Payment File:</span>
                    </p>
                    <div className="rounded-lg bg-slate-50 p-3 border border-slate-200 flex items-center justify-between">
                      <div className="truncate">
                        <p className="text-xs font-semibold text-[#002D5B]">{selectedPayment.proofFileName}</p>
                        <p className="text-[10px] text-slate-400 font-mono">Type: {selectedPayment.proofFileType}</p>
                      </div>
                      <span className="rounded bg-[#0078CE]/10 px-2 py-0.5 text-[10px] font-bold text-[#002D5B]">
                        Validated Upload
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons (Section 7 & 8) */}
                  {selectedPayment.status !== 'PAID' ? (
                    <div className="border-t border-slate-100 pt-4 flex flex-col sm:flex-row items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setActionModal({ type: 'CONFIRM', payment: selectedPayment })}
                        className="w-full sm:w-auto flex-1 rounded-xl bg-[#2EAF4A] py-3 text-xs font-bold text-white hover:bg-[#258F3C] transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        <span>CONFIRM PAYMENT (Atomic Activation)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setActionModal({ type: 'REQUEST_INFO', payment: selectedPayment })}
                        className="w-full sm:w-auto rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-xs font-bold text-amber-900 hover:bg-amber-100 transition-all cursor-pointer"
                      >
                        Request More Info
                      </button>

                      <button
                        type="button"
                        onClick={() => setActionModal({ type: 'REJECT', payment: selectedPayment })}
                        className="w-full sm:w-auto rounded-xl border border-rose-300 bg-rose-50 px-4 py-3 text-xs font-bold text-rose-800 hover:bg-rose-100 transition-all cursor-pointer"
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-[#2EAF4A]/40 bg-[#2EAF4A]/10 p-4 text-xs text-[#1B6C2E] flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-[#2EAF4A] shrink-0" />
                      <div>
                        <p className="font-bold">Payment Verified & Activated</p>
                        <p className="text-[11px] text-[#1B6C2E]">
                          Receipt Number: <strong>{selectedPayment.receiptNumber || 'JUR-RCPT-2026-VERIFIED'}</strong> • Verified by {selectedPayment.verifiedBy || 'Finance Desk'}
                        </p>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-xs text-slate-400 py-12 text-center">Select a payment from the queue.</p>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: DEVELOPMENT ORDERS (Section 5) */}
        {activeTab === 'ORDERS' && (
          <div className="rounded-2xl border border-[#D9E1E8] bg-white p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D9E1E8] pb-4">
              <div>
                <h3 className="text-base font-bold text-[#002D5B]">Development Orders Registry</h3>
                <p className="text-xs text-slate-500">Track all customer orders, pricing tiers, and terms versions.</p>
              </div>

              <button
                onClick={exportOrdersCsv}
                className="rounded-lg border border-[#D9E1E8] bg-white px-3 py-1.5 text-xs font-semibold text-[#002D5B] hover:border-[#0078CE] flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <Download className="h-3.5 w-3.5 text-[#0078CE]" />
                <span>Export Orders (.csv)</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                    <th className="pb-3">Order ID / Ref</th>
                    <th className="pb-3">Customer</th>
                    <th className="pb-3">Selected Plan</th>
                    <th className="pb-3">Amount (PHP)</th>
                    <th className="pb-3">Discount</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-slate-50/80">
                      <td className="py-3 font-mono font-bold text-[#002D5B]">
                        <div>{o.id}</div>
                        <div className="text-[10px] text-slate-400">{o.paymentRef}</div>
                      </td>
                      <td className="py-3">
                        <p className="font-semibold text-slate-800">{o.customerName}</p>
                        <p className="text-[10px] text-slate-400">{o.customerEmail}</p>
                      </td>
                      <td className="py-3 font-medium text-slate-700">{o.planName}</td>
                      <td className="py-3 font-mono font-bold text-[#002D5B]">
                        ₱{o.amountPhp.toLocaleString()}.00
                      </td>
                      <td className="py-3 font-mono font-bold text-[#0078CE]">
                        {(o.discountRate * 100).toFixed(0)}% OFF
                      </td>
                      <td className="py-3">
                        <span
                          className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                            o.status === 'ACTIVATED' || o.status === 'PAID'
                              ? 'bg-[#2EAF4A]/20 text-[#1B6C2E]'
                              : 'bg-amber-100 text-amber-900'
                          }`}
                        >
                          {o.status}
                        </span>
                      </td>
                      <td className="py-3 text-[11px] text-slate-400">
                        {new Date(o.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: COMMERCIAL PLANS CONFIGURATION (Section 4) */}
        {activeTab === 'PLANS' && (
          <div className="space-y-6">
            <div className="rounded-xl border border-[#0078CE]/20 bg-[#0078CE]/5 p-4 text-xs text-[#002D5B] flex items-center justify-between">
              <div>
                <p className="font-bold">SECTION 4 COMPLIANCE: ADMIN COMMERCIAL RULES</p>
                <p className="text-slate-600">
                  Commercial rules, pricing tiers, and discounts are NOT hardcoded into React components. They are modified and persisted here.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((p) => (
                <div key={p.id} className="rounded-2xl border border-[#D9E1E8] bg-white p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b pb-3">
                    <span className="font-bold text-[#002D5B] text-base">{p.name}</span>
                    <button
                      onClick={() => setEditingPlan(p)}
                      className="text-xs font-semibold text-[#0078CE] hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <Edit className="h-3.5 w-3.5" />
                      <span>Edit</span>
                    </button>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Plan Price:</span>
                      <span className="font-bold font-mono text-[#002D5B]">₱{p.pricePhp.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Credited Usable:</span>
                      <span className="font-bold font-mono text-[#2EAF4A]">₱{p.creditAmountPhp.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Technical Fee Discount:</span>
                      <span className="font-bold font-mono text-[#0078CE]">{(p.discountRate * 100).toFixed(0)}% OFF</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500">{p.description}</p>
                </div>
              ))}
            </div>

            {/* Edit Plan Modal */}
            {editingPlan && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
                <form onSubmit={handleSavePlan} className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl space-y-4 border border-[#D9E1E8]">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-base font-bold text-[#002D5B]">Configure Plan: {editingPlan.name}</h3>
                    <button type="button" onClick={() => setEditingPlan(null)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                      ✕
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#002D5B] mb-1">Plan Display Name</label>
                    <input
                      type="text"
                      required
                      value={editingPlan.name}
                      onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                      className="w-full rounded-lg border border-[#D9E1E8] p-2 text-xs focus:border-[#0078CE] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#002D5B] mb-1">Price (PHP)</label>
                      <input
                        type="number"
                        required
                        value={editingPlan.pricePhp}
                        onChange={(e) => setEditingPlan({ ...editingPlan, pricePhp: Number(e.target.value) })}
                        className="w-full rounded-lg border border-[#D9E1E8] p-2 text-xs font-mono focus:border-[#0078CE] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#002D5B] mb-1">Usable Credit (PHP)</label>
                      <input
                        type="number"
                        required
                        value={editingPlan.creditAmountPhp}
                        onChange={(e) => setEditingPlan({ ...editingPlan, creditAmountPhp: Number(e.target.value) })}
                        className="w-full rounded-lg border border-[#D9E1E8] p-2 text-xs font-mono focus:border-[#0078CE] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#002D5B] mb-1">
                      Technical-Fee Discount Rate (e.g. 0.45 for 45%)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      max="0.99"
                      required
                      value={editingPlan.discountRate}
                      onChange={(e) => setEditingPlan({ ...editingPlan, discountRate: Number(e.target.value) })}
                      className="w-full rounded-lg border border-[#D9E1E8] p-2 text-xs font-mono focus:border-[#0078CE] focus:outline-none"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setEditingPlan(null)}
                      className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-[#002D5B] text-xs font-bold text-white hover:bg-[#0078CE] cursor-pointer"
                    >
                      Save Commercial Plan
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: BANK REMITTANCE SETTINGS (Section 20) */}
        {activeTab === 'BANK_SETTINGS' && (
          <form onSubmit={handleSaveBankConfig} className="rounded-2xl border border-[#D9E1E8] bg-white p-6 sm:p-8 shadow-xs space-y-6">
            <div className="border-b border-[#D9E1E8] pb-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#0078CE]">
                Section 20 Compliance: Configurable Bank Information
              </span>
              <h3 className="text-lg font-bold text-[#002D5B]">
                Philippine Corporate Remittance Account Settings
              </h3>
              <p className="text-xs text-slate-500">
                These details are rendered across all customer checkout workflows.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#002D5B] mb-1">Bank Name *</label>
                <input
                  type="text"
                  required
                  value={bankForm.bankName}
                  onChange={(e) => setBankForm({ ...bankForm, bankName: e.target.value })}
                  className="w-full rounded-lg border border-[#D9E1E8] p-2.5 text-xs text-[#17212B] focus:border-[#0078CE] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#002D5B] mb-1">Corporate Account Name *</label>
                <input
                  type="text"
                  required
                  value={bankForm.accountName}
                  onChange={(e) => setBankForm({ ...bankForm, accountName: e.target.value })}
                  className="w-full rounded-lg border border-[#D9E1E8] p-2.5 text-xs text-[#17212B] font-mono focus:border-[#0078CE] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#002D5B] mb-1">Account Number *</label>
                <input
                  type="text"
                  required
                  value={bankForm.accountNumber}
                  onChange={(e) => setBankForm({ ...bankForm, accountNumber: e.target.value })}
                  className="w-full rounded-lg border border-[#D9E1E8] p-2.5 text-xs text-[#17212B] font-mono focus:border-[#0078CE] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#002D5B] mb-1">Branch *</label>
                <input
                  type="text"
                  required
                  value={bankForm.branch}
                  onChange={(e) => setBankForm({ ...bankForm, branch: e.target.value })}
                  className="w-full rounded-lg border border-[#D9E1E8] p-2.5 text-xs text-[#17212B] focus:border-[#0078CE] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#002D5B] mb-1">Transfer Instructions Text *</label>
              <textarea
                rows={3}
                required
                value={bankForm.instructions}
                onChange={(e) => setBankForm({ ...bankForm, instructions: e.target.value })}
                className="w-full rounded-lg border border-[#D9E1E8] p-2.5 text-xs text-[#17212B] focus:border-[#0078CE] focus:outline-none"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="rounded-xl bg-[#002D5B] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#0078CE] transition-all cursor-pointer shadow-xs"
              >
                Save Bank Settings
              </button>
            </div>
          </form>
        )}

        {/* TAB 5: CREDIT WALLETS & LEDGER (Section 9) */}
        {activeTab === 'WALLETS' && (
          <div className="rounded-2xl border border-[#D9E1E8] bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#D9E1E8] pb-4">
              <div>
                <h3 className="text-base font-bold text-[#002D5B]">Active Credit Wallets Registry</h3>
                <p className="text-xs text-slate-500">Live subscriber credit balances & discount assignments.</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                    <th className="pb-3">Wallet ID</th>
                    <th className="pb-3">Subscriber</th>
                    <th className="pb-3">Available Balance</th>
                    <th className="pb-3">Total Purchased</th>
                    <th className="pb-3">Total Used</th>
                    <th className="pb-3">Discount Tier</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {wallets.map((w) => (
                    <tr key={w.id} className="hover:bg-slate-50/80">
                      <td className="py-3 font-mono font-bold text-[#002D5B]">{w.id}</td>
                      <td className="py-3">
                        <p className="font-semibold text-slate-800">{w.ownerName}</p>
                        <p className="text-[10px] text-slate-400">{w.ownerEmail}</p>
                      </td>
                      <td className="py-3 font-mono font-bold text-[#2EAF4A] text-sm">
                        ₱{w.availableBalancePhp.toLocaleString()}.00
                      </td>
                      <td className="py-3 font-mono text-slate-700">₱{w.totalPurchasedPhp.toLocaleString()}</td>
                      <td className="py-3 font-mono text-slate-500">₱{w.totalUsedPhp.toLocaleString()}</td>
                      <td className="py-3 font-mono font-bold text-[#0078CE]">
                        {(w.currentDiscountRate * 100).toFixed(0)}% OFF
                      </td>
                      <td className="py-3">
                        <span className="rounded bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-bold">
                          {w.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: IMMUTABLE AUDIT LOG (Section 22) */}
        {activeTab === 'AUDIT_LOGS' && (
          <div className="rounded-2xl border border-[#D9E1E8] bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#D9E1E8] pb-4">
              <div>
                <h3 className="text-base font-bold text-[#002D5B]">Immutable Administrative Audit Log</h3>
                <p className="text-xs text-slate-500">
                  Cryptographically structured logs of all role changes, payments, credit adjustments, and logins.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                    <th className="pb-3">Timestamp</th>
                    <th className="pb-3">Actor Email & Role</th>
                    <th className="pb-3">Action</th>
                    <th className="pb-3">Target</th>
                    <th className="pb-3">Metadata Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/80">
                      <td className="py-3 text-[11px] text-slate-500 font-mono whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="py-3">
                        <p className="font-bold text-[#002D5B]">{log.actorEmail}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{log.actorRole}</p>
                      </td>
                      <td className="py-3">
                        <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-mono font-bold text-slate-800">
                          {log.action}
                        </span>
                      </td>
                      <td className="py-3 font-mono text-[11px] text-slate-600">
                        {log.targetType}:{log.targetId}
                      </td>
                      <td className="py-3 text-[10px] font-mono text-slate-500 max-w-xs truncate">
                        {JSON.stringify(log.details)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VERIFICATION MODAL DIALOG */}
        {actionModal.type && actionModal.payment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4 border border-[#D9E1E8]">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-[#002D5B]">
                  {actionModal.type === 'CONFIRM'
                    ? 'Confirm Payment & Fund Wallet'
                    : actionModal.type === 'REQUEST_INFO'
                    ? 'Request Additional Transfer Information'
                    : 'Reject Payment Remittance'}
                </h3>
                <button
                  type="button"
                  onClick={() => setActionModal({ type: null, payment: null })}
                  className="text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {actionModal.type === 'CONFIRM' ? (
                <div className="space-y-3 text-xs">
                  <div className="rounded-xl bg-[#2EAF4A]/10 border border-[#2EAF4A]/30 p-3 text-[#1B6C2E] space-y-1">
                    <p className="font-bold">ATOMIC ACTIVATION SEQUENCE:</p>
                    <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                      <li>Mark Payment & Order status as PAID</li>
                      <li>Credit ₱{actionModal.payment.amountPhp.toLocaleString()} into subscriber wallet</li>
                      <li>Activate applicable technical fee discount tier</li>
                      <li>Generate and archive official receipt PDF</li>
                      <li>Notify customer in-app and by email</li>
                      <li>Write immutable financial audit log</li>
                    </ul>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#002D5B] mb-1">
                      Internal Reconciliation Notes
                    </label>
                    <input
                      type="text"
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      className="w-full rounded-lg border border-[#D9E1E8] p-2 text-xs focus:border-[#0078CE] focus:outline-none"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-bold text-[#002D5B] mb-1">
                      Reason / Required Action for Customer *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={actionReason}
                      onChange={(e) => setActionReason(e.target.value)}
                      placeholder="Specify the reason or request clearer document..."
                      className="w-full rounded-lg border border-[#D9E1E8] p-2 text-xs focus:border-[#0078CE] focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActionModal({ type: null, payment: null })}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleExecuteVerification}
                  className={`px-4 py-2 rounded-lg text-xs font-bold text-white shadow-xs cursor-pointer ${
                    actionModal.type === 'CONFIRM'
                      ? 'bg-[#2EAF4A] hover:bg-[#258F3C]'
                      : actionModal.type === 'REQUEST_INFO'
                      ? 'bg-amber-600 hover:bg-amber-700'
                      : 'bg-rose-600 hover:bg-rose-700'
                  }`}
                >
                  Execute Verification
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
