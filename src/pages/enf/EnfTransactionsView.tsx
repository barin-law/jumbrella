import React, { useState } from 'react';
import {
  FileText,
  DollarSign,
  Download,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  Shield,
  Eye,
  Printer,
  Copy,
  Check,
  Building,
  User,
  X,
} from 'lucide-react';
import { EnfStorageService } from '../../services/enf/enfStorageService';
import { EnfAuthService } from '../../services/enf/enfAuthService';
import { ENFOrder, ENFCreditLedgerEntry, ENFPaymentSubmission } from '../../types/enf';
import { BrandLogo } from '../../components/common/BrandLogo';

interface EnfTransactionsViewProps {
  onNavigate: (path: string) => void;
  userId?: string;
}

export const EnfTransactionsView: React.FC<EnfTransactionsViewProps> = ({
  onNavigate,
  userId = 'demo-enf-owner-1',
}) => {
  const currentUser = EnfAuthService.getCurrentUser();
  const actualUserId = currentUser?.id || userId;

  const [orders] = useState<ENFOrder[]>(() => {
    const all = EnfStorageService.getOrders();
    // Security: Filter to user's orders unless administrative role
    if (currentUser && ['ADMIN', 'SUPER_ADMIN', 'FINANCE'].includes(currentUser.role)) {
      return all;
    }
    return all.filter((o) => o.customerId === actualUserId);
  });

  const [payments] = useState<ENFPaymentSubmission[]>(() => {
    const all = EnfStorageService.getPayments();
    if (currentUser && ['ADMIN', 'SUPER_ADMIN', 'FINANCE'].includes(currentUser.role)) {
      return all;
    }
    return all.filter((p) => p.customerId === actualUserId);
  });

  const [ledger] = useState<ENFCreditLedgerEntry[]>(() => {
    const all = EnfStorageService.getLedger();
    if (currentUser && ['ADMIN', 'SUPER_ADMIN', 'FINANCE'].includes(currentUser.role)) {
      return all;
    }
    return all.filter((l) => l.userId === actualUserId);
  });

  // Selected receipt for detailed itemized modal view
  const [activeReceiptOrder, setActiveReceiptOrder] = useState<ENFOrder | null>(null);
  const [copiedReceiptId, setCopiedReceiptId] = useState(false);

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleCopyReceiptId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedReceiptId(true);
    setTimeout(() => setCopiedReceiptId(false), 2000);
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
              <FileText className="h-4 w-4 text-[#002D5B]" />
              <h1 className="text-base font-bold text-[#002D5B]">Purchases, Payments & Official Receipts</h1>
            </div>
          </div>

          <button
            onClick={() => onNavigate('/enf/plans')}
            className="rounded-lg bg-[#002D5B] px-4 py-2 text-xs font-bold text-white hover:bg-[#0078CE] transition-all shadow-xs cursor-pointer"
          >
            New Development Order +
          </button>
        </div>

        {/* Orders Table */}
        <div className="rounded-2xl border border-[#D9E1E8] bg-white shadow-xs overflow-hidden">
          <div className="border-b border-[#D9E1E8] bg-slate-50/80 px-6 py-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#002D5B]">ENF Development Orders</h3>
              <p className="text-xs text-slate-500">Official order history, verified remittances, and receipts.</p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-500">{orders.length} Orders</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-[#D9E1E8] bg-[#F4F7F9] text-[#002D5B] font-bold">
                  <th scope="col" className="py-3 px-6">Order ID & Date</th>
                  <th scope="col" className="py-3 px-6">Package</th>
                  <th scope="col" className="py-3 px-6">Amount</th>
                  <th scope="col" className="py-3 px-6">Payment Ref</th>
                  <th scope="col" className="py-3 px-6">Status</th>
                  <th scope="col" className="py-3 px-6 text-right">Receipt & Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D9E1E8] text-[#17212B]">
                {orders.map((o) => {
                  const isPaid = o.status === 'PAID' || o.status === 'ACTIVATED';
                  const isPending = o.status === 'PENDING_PAYMENT';
                  const isReview = o.status === 'PAYMENT_SUBMITTED' || o.status === 'UNDER_REVIEW';

                  return (
                    <tr key={o.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-6">
                        <span className="font-mono font-bold text-[#002D5B] block">{o.id}</span>
                        <span className="text-[11px] text-slate-500">
                          {new Date(o.createdAt).toLocaleDateString()}
                        </span>
                      </td>

                      <td className="py-3.5 px-6">
                        <span className="font-bold text-[#002D5B] block">{o.planName}</span>
                        <span className="text-[11px] text-[#2EAF4A] font-semibold">
                          {o.creditsQuantity || (o.amountPhp === 20000 ? 247 : o.amountPhp === 100000 ? 4761 : 1819)} Credits Issued
                        </span>
                      </td>

                      <td className="py-3.5 px-6 font-mono font-extrabold text-[#002D5B]">
                        ₱{o.amountPhp.toLocaleString()}.00
                      </td>

                      <td className="py-3.5 px-6 font-mono text-xs text-slate-600">
                        {o.paymentRef}
                      </td>

                      <td className="py-3.5 px-6">
                        <span
                          className={`rounded px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1 ${
                            isPaid
                              ? 'bg-[#2EAF4A]/20 text-[#1B6C2E]'
                              : isReview
                              ? 'bg-[#0078CE]/15 text-[#002D5B]'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {isPaid && <CheckCircle2 className="h-3 w-3" />}
                          {isReview && <Clock className="h-3 w-3" />}
                          {o.status.replace(/_/g, ' ')}
                        </span>
                      </td>

                      <td className="py-3.5 px-6 text-right space-x-2">
                        {isPaid && (
                          <button
                            onClick={() => setActiveReceiptOrder(o)}
                            className="rounded-lg border border-[#002D5B] bg-white px-3 py-1 text-xs font-bold text-[#002D5B] hover:bg-[#F4F7F9] transition-colors cursor-pointer inline-flex items-center gap-1"
                          >
                            <Eye className="h-3.5 w-3.5 text-[#0078CE]" />
                            <span>Official Receipt</span>
                          </button>
                        )}

                        {isPending && (
                          <button
                            onClick={() => onNavigate(`/enf/payment?orderId=${o.id}`)}
                            className="rounded-lg bg-[#002D5B] px-3 py-1 text-xs font-bold text-white hover:bg-[#0078CE] transition-colors cursor-pointer inline-flex items-center gap-1"
                          >
                            <span>Upload Proof</span>
                            <ArrowRight className="h-3 w-3" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Ledger Transactions View */}
        <div className="rounded-2xl border border-[#D9E1E8] bg-white shadow-xs overflow-hidden">
          <div className="border-b border-[#D9E1E8] bg-slate-50/80 px-6 py-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#002D5B]">Credit Wallet Ledger Entries</h3>
              <p className="text-xs text-slate-500">Immutable double-entry transaction records with balance audits.</p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-500">{ledger.length} Records</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-[#D9E1E8] bg-[#F4F7F9] text-[#002D5B] font-bold">
                  <th scope="col" className="py-3 px-6">Transaction ID</th>
                  <th scope="col" className="py-3 px-6">Type</th>
                  <th scope="col" className="py-3 px-6">Service / Description</th>
                  <th scope="col" className="py-3 px-6">Amount</th>
                  <th scope="col" className="py-3 px-6">Balance Before</th>
                  <th scope="col" className="py-3 px-6">Balance After</th>
                  <th scope="col" className="py-3 px-6">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D9E1E8] text-[#17212B]">
                {ledger.map((entry) => (
                  <tr key={entry.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-6 font-mono text-xs font-semibold text-slate-700">
                      {entry.id}
                    </td>
                    <td className="py-3 px-6">
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] font-bold font-mono ${
                          entry.type === 'CREDIT'
                            ? 'bg-[#2EAF4A]/20 text-[#1B6C2E]'
                            : 'bg-amber-100 text-amber-900'
                        }`}
                      >
                        {entry.type}
                      </span>
                    </td>
                    <td className="py-3 px-6">
                      <span className="font-semibold text-[#002D5B] block">{entry.serviceName}</span>
                      {entry.notes && <span className="text-[11px] text-slate-500">{entry.notes}</span>}
                    </td>
                    <td className="py-3 px-6 font-mono font-bold">
                      {entry.type === 'CREDIT' ? '+' : '-'}₱{entry.amountPhp.toLocaleString()}.00
                    </td>
                    <td className="py-3 px-6 font-mono text-xs text-slate-500">
                      ₱{entry.balanceBeforePhp.toLocaleString()}.00
                    </td>
                    <td className="py-3 px-6 font-mono text-xs font-bold text-[#002D5B]">
                      ₱{entry.balanceAfterPhp.toLocaleString()}.00
                    </td>
                    <td className="py-3 px-6 text-xs text-slate-500 font-mono">
                      {new Date(entry.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 18: Official Receipt Modal */}
        {activeReceiptOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
            <div className="relative w-full max-w-2xl rounded-2xl bg-white p-6 sm:p-8 shadow-2xl space-y-6">
              {/* Close Button */}
              <button
                onClick={() => setActiveReceiptOrder(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Receipt Header */}
              <div className="border-b border-[#D9E1E8] pb-5 space-y-3">
                <div className="flex items-center justify-between">
                  <BrandLogo variant="official" height={36} alt="JuriMbrella" priority />
                  <div className="text-right">
                    <span className="rounded bg-[#2EAF4A]/20 px-2 py-0.5 text-[10px] font-bold text-[#1B6C2E] uppercase font-mono">
                      OFFICIAL RECEIPT
                    </span>
                    <p className="text-xs font-mono text-slate-500 mt-0.5">
                      Receipt #: JUR-RCPT-2026-{activeReceiptOrder.id.slice(-6)}
                    </p>
                  </div>
                </div>

                <div className="text-center pt-2">
                  <h3 className="text-lg font-extrabold text-[#002D5B]">JURIMBRELLA LEGAL TECHNOLOGY CORP.</h3>
                  <p className="text-[11px] text-slate-500">
                    Electronic Notarial Facility Development & Prepaid Access Platform
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono">
                    TIN: 009-881-294-000 • Ortigas Center Corporate Tower, Pasig City, Philippines
                  </p>
                </div>
              </div>

              {/* Customer & Transaction Meta */}
              <div className="grid grid-cols-2 gap-4 text-xs bg-[#F4F7F9] p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-500 block">Issued To:</span>
                  <span className="font-bold text-[#002D5B]">{activeReceiptOrder.customerName}</span>
                  <span className="text-slate-500 block text-[11px]">{activeReceiptOrder.customerEmail}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Payment Reference:</span>
                  <span className="font-mono font-bold text-[#002D5B]">{activeReceiptOrder.paymentRef}</span>
                  <span className="text-slate-500 block text-[11px]">
                    Date: {new Date(activeReceiptOrder.paidAt || activeReceiptOrder.updatedAt).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Itemized Fee Breakdown (Required by Section 18) */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-[#002D5B] uppercase tracking-wider">
                  Itemized Fee Breakdown
                </div>
                <div className="border border-[#D9E1E8] rounded-xl overflow-hidden text-xs">
                  <div className="bg-[#F4F7F9] p-2.5 font-bold text-[#002D5B] flex justify-between border-b border-[#D9E1E8]">
                    <span>Description</span>
                    <span>Amount (PHP)</span>
                  </div>
                  <div className="p-3 space-y-2 divide-y divide-slate-100">
                    <div className="flex justify-between items-center pt-1">
                      <div>
                        <span className="font-bold text-[#002D5B] block">{activeReceiptOrder.planName}</span>
                        <span className="text-[11px] text-slate-500">
                          Prepaid Technical Credits ({activeReceiptOrder.creditsQuantity || (activeReceiptOrder.amountPhp === 20000 ? 247 : activeReceiptOrder.amountPhp === 100000 ? 4761 : 1819)} Credits @ ₱{activeReceiptOrder.effectiveFeePhp || 55}/filing)
                        </span>
                      </div>
                      <span className="font-mono font-bold">₱{activeReceiptOrder.amountPhp.toLocaleString()}.00</span>
                    </div>

                    <div className="flex justify-between items-center pt-2 text-slate-600">
                      <span>Setup & Technical Onboarding Fee</span>
                      <span className="font-mono text-[#2EAF4A] font-bold">₱0.00 (Waived)</span>
                    </div>

                    <div className="flex justify-between items-center pt-2 text-slate-600">
                      <span>Applicable Technical Fee Discount</span>
                      <span className="font-mono text-[#0078CE] font-bold">
                        {(activeReceiptOrder.discountRate * 100).toFixed(0)}% OFF
                      </span>
                    </div>

                    <div className="flex justify-between items-center pt-2 text-slate-600">
                      <span>Professional Notarial Fees (Attorney-Client)</span>
                      <span className="font-mono text-slate-400">₱0.00 (Billed Independently)</span>
                    </div>

                    <div className="flex justify-between items-center pt-2 text-slate-600">
                      <span>Statutory Fees & Government Charges</span>
                      <span className="font-mono text-slate-400">₱0.00 (Rule 7 Notarial Book Excluded)</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3 border-t border-[#D9E1E8] flex justify-between items-center text-sm font-bold text-[#002D5B]">
                    <span>Total Amount Paid:</span>
                    <span className="text-base font-mono text-[#2EAF4A]">
                      ₱{activeReceiptOrder.amountPhp.toLocaleString()}.00
                    </span>
                  </div>
                </div>
              </div>

              {/* Statutory Footnote */}
              <div className="rounded-lg bg-[#F4F7F9] p-3 text-[10px] text-slate-500 border border-slate-200 space-y-1">
                <p className="font-bold text-[#002D5B]">Legal Notice:</p>
                <p>
                  This official receipt covers technical platform development and prepaid technical fees for eligible online notarial services under Supreme Court A.M. No. 24-10-14-SC. This does not constitute legal fees or statutory government taxes.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => handleCopyReceiptId(activeReceiptOrder.id)}
                  className="rounded-lg border border-[#D9E1E8] px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer flex items-center gap-1.5"
                >
                  {copiedReceiptId ? <Check className="h-3.5 w-3.5 text-[#2EAF4A]" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedReceiptId ? 'Copied Order ID' : 'Copy Order ID'}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrintReceipt}
                    className="rounded-lg border border-[#002D5B] px-3.5 py-2 text-xs font-bold text-[#002D5B] hover:bg-[#F4F7F9] cursor-pointer flex items-center gap-1.5"
                  >
                    <Printer className="h-3.5 w-3.5" />
                    <span>Print Receipt</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveReceiptOrder(null)}
                    className="rounded-lg bg-[#002D5B] px-4 py-2 text-xs font-bold text-white hover:bg-[#0078CE] cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
