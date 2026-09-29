import React, { useState } from 'react';
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  Download,
  Zap,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  FileText,
  Filter,
  PlusCircle,
  Lock,
} from 'lucide-react';
import { EnfStorageService } from '../../services/enf/enfStorageService';
import { ENFCreditWallet, ENFCreditLedgerEntry, ENFLedgerEntryType } from '../../types/enf';

interface EnfCreditWalletViewProps {
  onNavigate: (path: string) => void;
  userId?: string;
}

export const EnfCreditWalletView: React.FC<EnfCreditWalletViewProps> = ({
  onNavigate,
  userId = 'demo-enf-owner-1',
}) => {
  const [wallet, setWallet] = useState<ENFCreditWallet>(() =>
    EnfStorageService.getOrCreateWallet(userId)
  );
  const [ledger, setLedger] = useState<ENFCreditLedgerEntry[]>(() =>
    EnfStorageService.getLedger(wallet.id)
  );
  const [filterType, setFilterType] = useState<string>('ALL');
  const [isSimulating, setIsSimulating] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const reloadData = () => {
    const freshWallet = EnfStorageService.getOrCreateWallet(userId);
    setWallet(freshWallet);
    setLedger(EnfStorageService.getLedger(freshWallet.id));
  };

  const filteredEntries = ledger.filter((item) => {
    if (filterType === 'ALL') return true;
    return item.type === filterType;
  });

  const handleSimulateDebit = () => {
    setIsSimulating(true);
    setFeedbackMessage(null);

    setTimeout(() => {
      const res = EnfStorageService.debitTechnicalFee(
        userId,
        'srv-remote-notarization',
        `BENF-TX-${Date.now().toString().slice(-4)}`
      );

      if (res.success) {
        setFeedbackMessage(res.message);
        reloadData();
      } else {
        setFeedbackMessage(res.message);
      }
      setIsSimulating(false);
    }, 400);
  };

  const handleExportCsv = () => {
    const csvContent = EnfStorageService.generateLedgerCsv(wallet.id);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ENF_Credit_Ledger_${wallet.id}_${Date.now()}.csv`);
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
              onClick={() => onNavigate('/enf/dashboard')}
              className="text-xs font-semibold text-[#0078CE] hover:underline cursor-pointer"
            >
              ← Back to Dashboard
            </button>
            <span className="text-slate-300">/</span>
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-[#002D5B]" />
              <h1 className="text-base font-bold text-[#002D5B]">Server-Authoritative Credit Wallet & Ledger</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCsv}
              className="rounded-lg border border-[#D9E1E8] bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-[#002D5B] hover:border-[#0078CE] transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="h-3.5 w-3.5 text-[#0078CE]" />
              <span>Export Ledger CSV</span>
            </button>
            <button
              onClick={() => onNavigate('/enf/order')}
              className="rounded-lg bg-[#2EAF4A] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#258F3C] transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span>Replenish Credits</span>
            </button>
          </div>
        </div>

        {/* 4 KPI CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-[#D9E1E8] bg-white p-5 shadow-xs space-y-2">
            <span className="text-xs font-semibold text-slate-500">Available Balance</span>
            <p className="text-3xl font-extrabold text-[#002D5B] font-mono">
              ₱{wallet.availableBalancePhp.toLocaleString()}.00
            </p>
            <p className="text-[11px] text-[#2EAF4A] font-semibold">100% Usable for Notarial Filings</p>
          </div>

          <div className="rounded-2xl border border-[#D9E1E8] bg-white p-5 shadow-xs space-y-2">
            <span className="text-xs font-semibold text-slate-500">Total Purchased</span>
            <p className="text-3xl font-extrabold text-[#002D5B] font-mono">
              ₱{wallet.totalPurchasedPhp.toLocaleString()}.00
            </p>
            <p className="text-[11px] text-slate-500">Verified Bank Remittance</p>
          </div>

          <div className="rounded-2xl border border-[#D9E1E8] bg-white p-5 shadow-xs space-y-2">
            <span className="text-xs font-semibold text-slate-500">Total Consumed</span>
            <p className="text-3xl font-extrabold text-slate-700 font-mono">
              ₱{wallet.totalUsedPhp.toLocaleString()}.00
            </p>
            <p className="text-[11px] text-slate-500">{ledger.filter((l) => l.type === 'DEBIT').length} Completed Filings</p>
          </div>

          <div className="rounded-2xl border border-[#D9E1E8] bg-white p-5 shadow-xs space-y-2">
            <span className="text-xs font-semibold text-slate-500">Current Discount Tier</span>
            <p className="text-3xl font-extrabold text-[#0078CE] font-mono">
              {(wallet.currentDiscountRate * 100).toFixed(0)}% OFF
            </p>
            <p className="text-[11px] text-[#0078CE] font-semibold">Base ₱100 Fee Charge: ₱{(100 * (1 - wallet.currentDiscountRate)).toFixed(0)}.00</p>
          </div>
        </div>

        {/* SECTION 10: TECHNICAL FEE ENGINE LIVE TESTER */}
        <div className="rounded-2xl border border-[#002D5B] bg-[#002D5B] text-white p-6 shadow-md space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#A8E063]">
                Server-Authoritative Technical Fee Engine (Section 10)
              </span>
              <h3 className="text-lg font-bold font-sans">
                Base Fee Calculation & Double-Entry Ledger Verification
              </h3>
            </div>

            <button
              onClick={handleSimulateDebit}
              disabled={isSimulating || wallet.availableBalancePhp < 20}
              className="rounded-xl bg-[#2EAF4A] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#258F3C] transition-all shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Zap className={`h-4 w-4 ${isSimulating ? 'animate-spin' : ''}`} />
              <span>Simulate Live Debit Transaction</span>
            </button>
          </div>

          {feedbackMessage && (
            <div className="rounded-xl border border-white/20 bg-white/10 p-3 text-xs text-[#A8E063] flex items-center gap-2 font-medium">
              <CheckCircle2 className="h-4 w-4 text-[#A8E063] shrink-0" />
              <span>{feedbackMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs pt-1">
            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <span className="text-slate-300 block text-[11px]">Standard Base Fee</span>
              <span className="font-bold text-white text-base font-mono">₱100.00</span>
            </div>
            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <span className="text-slate-300 block text-[11px]">Your Discount Rate</span>
              <span className="font-bold text-[#A8E063] text-base font-mono">
                {(wallet.currentDiscountRate * 100).toFixed(0)}% OFF
              </span>
            </div>
            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <span className="text-slate-300 block text-[11px]">Discount Savings</span>
              <span className="font-bold text-[#A8E063] text-base font-mono">
                -₱{(100 * wallet.currentDiscountRate).toFixed(0)}.00
              </span>
            </div>
            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <span className="text-slate-300 block text-[11px]">Net Ledger Charge</span>
              <span className="font-bold text-white text-base font-mono">
                ₱{(100 * (1 - wallet.currentDiscountRate)).toFixed(0)}.00
              </span>
            </div>
          </div>
        </div>

        {/* FULL TRANSACTION LEDGER TABLE (Section 25) */}
        <div className="rounded-2xl border border-[#D9E1E8] bg-white p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D9E1E8] pb-4">
            <div>
              <h3 className="text-base font-bold text-[#002D5B]">Complete Financial Audit Ledger</h3>
              <p className="text-xs text-slate-500">
                Every entry records balance before, transaction amount, and post-transaction balance.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-[#F4F7F9] p-1 rounded-lg border border-[#D9E1E8] text-xs">
              <button
                onClick={() => setFilterType('ALL')}
                className={`px-3 py-1 rounded-md font-semibold cursor-pointer transition-colors ${
                  filterType === 'ALL' ? 'bg-white text-[#002D5B] shadow-2xs' : 'text-slate-500'
                }`}
              >
                All ({ledger.length})
              </button>
              <button
                onClick={() => setFilterType('CREDIT')}
                className={`px-3 py-1 rounded-md font-semibold cursor-pointer transition-colors ${
                  filterType === 'CREDIT' ? 'bg-white text-[#2EAF4A] shadow-2xs' : 'text-slate-500'
                }`}
              >
                Credits
              </button>
              <button
                onClick={() => setFilterType('DEBIT')}
                className={`px-3 py-1 rounded-md font-semibold cursor-pointer transition-colors ${
                  filterType === 'DEBIT' ? 'bg-white text-[#002D5B] shadow-2xs' : 'text-slate-500'
                }`}
              >
                Debits
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="pb-2.5">Trx ID / Ref</th>
                  <th className="pb-2.5">Type</th>
                  <th className="pb-2.5">Service / Description</th>
                  <th className="pb-2.5">Pre-Balance</th>
                  <th className="pb-2.5">Amount</th>
                  <th className="pb-2.5">Post-Balance</th>
                  <th className="pb-2.5">Date & Time</th>
                  <th className="pb-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEntries.map((entry) => {
                  const isCredit = entry.type === 'CREDIT';
                  return (
                    <tr key={entry.id} className="hover:bg-slate-50/80">
                      <td className="py-3 font-mono text-slate-600 font-semibold">
                        <div>{entry.id}</div>
                        <div className="text-[10px] text-slate-400">{entry.referenceCode}</div>
                      </td>
                      <td className="py-3">
                        <span
                          className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                            isCredit
                              ? 'bg-[#2EAF4A]/20 text-[#1B6C2E]'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {entry.type}
                        </span>
                      </td>
                      <td className="py-3 max-w-[240px]">
                        <p className="font-bold text-[#002D5B] truncate">{entry.serviceName}</p>
                        <p className="text-[10px] text-slate-500 truncate">{entry.notes}</p>
                      </td>
                      <td className="py-3 font-mono text-slate-500">
                        ₱{entry.balanceBeforePhp.toLocaleString()}
                      </td>
                      <td
                        className={`py-3 font-mono font-bold text-sm ${
                          isCredit ? 'text-[#2EAF4A]' : 'text-slate-800'
                        }`}
                      >
                        {isCredit ? '+' : '-'}₱{entry.amountPhp.toLocaleString()}.00
                      </td>
                      <td className="py-3 font-mono font-bold text-[#002D5B]">
                        ₱{entry.balanceAfterPhp.toLocaleString()}
                      </td>
                      <td className="py-3 text-[11px] text-slate-500 whitespace-nowrap">
                        {new Date(entry.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}{' '}
                        {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-3">
                        <span className="rounded bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 text-[10px] font-bold">
                          {entry.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
