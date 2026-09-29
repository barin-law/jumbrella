import React, { useState, useEffect } from 'react';
import {
  Building,
  CheckCircle2,
  AlertCircle,
  Upload,
  Copy,
  Check,
  ArrowRight,
  ShieldCheck,
  Clock,
  Lock,
} from 'lucide-react';
import { EnfStorageService } from '../../services/enf/enfStorageService';
import { EnfAuthService } from '../../services/enf/enfAuthService';
import { ApiClient } from '../../services/apiClient';
import { ENFPlan, ENFOrder, ENFBankConfig } from '../../types/enf';

interface EnfPlansAndCheckoutViewProps {
  initialPlanId?: string;
  onNavigate: (path: string) => void;
  onPaymentSubmitted?: (orderId: string) => void;
}

export const EnfPlansAndCheckoutView: React.FC<EnfPlansAndCheckoutViewProps> = ({
  initialPlanId,
  onNavigate,
  onPaymentSubmitted,
}) => {
  const currentUser = EnfAuthService.getCurrentUser();

  const [plans] = useState<ENFPlan[]>(() => EnfStorageService.getPlans());
  const [bankConfig] = useState<ENFBankConfig>(() => EnfStorageService.getBankConfig());

  // Parse URL search params for planId or orderId
  const getUrlParams = () => {
    try {
      const search = window.location.search;
      const params = new URLSearchParams(search);
      return {
        planId: params.get('planId'),
        orderId: params.get('orderId'),
      };
    } catch {
      return { planId: null, orderId: null };
    }
  };

  const urlParams = getUrlParams();

  const [selectedPlanId, setSelectedPlanId] = useState<string>(
    urlParams.planId || initialPlanId || plans[1]?.id || plans[0]?.id
  );

  // Customer information linked to authenticated session if present
  const [customerName, setCustomerName] = useState(
    currentUser?.fullName || ''
  );
  const [customerEmail, setCustomerEmail] = useState(
    currentUser?.email || ''
  );
  const [customerPhone, setCustomerPhone] = useState(
    currentUser?.phone || ''
  );

  // Checkout stage
  const [stage, setStage] = useState<'SELECT_PLAN' | 'ORDER_REVIEW' | 'SUBMIT_PAYMENT' | 'PAYMENT_PENDING'>(
    urlParams.orderId ? 'SUBMIT_PAYMENT' : 'SELECT_PLAN'
  );
  const [activeOrder, setActiveOrder] = useState<ENFOrder | null>(() => {
    if (urlParams.orderId) {
      const allOrders = EnfStorageService.getOrders();
      return allOrders.find((o) => o.id === urlParams.orderId) || null;
    }
    return null;
  });

  // Bank transfer proof submission fields
  const [senderBank, setSenderBank] = useState('BDO Unibank');
  const [transferDate, setTransferDate] = useState(new Date().toISOString().split('T')[0]);
  const [transferTime, setTransferTime] = useState('11:30 AM');
  const [transferAmount, setTransferAmount] = useState<number>(50000);
  const [senderName, setSenderName] = useState(currentUser?.fullName || '');
  const [bankTransactionRef, setBankTransactionRef] = useState('BDO-TX-');
  const [proofFileName, setProofFileName] = useState('');
  const [proofFileType, setProofFileType] = useState('');
  const [proofPreviewUrl, setProofPreviewUrl] = useState('');
  const [fileError, setFileError] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const selectedPlan = plans.find((p) => p.id === selectedPlanId) || plans[0];

  useEffect(() => {
    if (currentUser) {
      if (!customerName) setCustomerName(currentUser.fullName);
      if (!customerEmail) setCustomerEmail(currentUser.email);
      if (!customerPhone && currentUser.phone) setCustomerPhone(currentUser.phone);
      if (!senderName) setSenderName(currentUser.fullName);
    }
  }, [currentUser]);

  useEffect(() => {
    if (selectedPlan && !activeOrder) {
      setTransferAmount(selectedPlan.pricePhp);
    }
  }, [selectedPlan, activeOrder]);

  const copyToClipboard = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    // If user is not authenticated, redirect to sign in and preserve selected plan
    if (!currentUser) {
      onNavigate(`/enf/login?returnTo=${encodeURIComponent(`/enf/checkout?planId=${selectedPlanId}`)}`);
      return;
    }

    setIsSubmitting(true);

    try {
      // Create order via server API
      const res = await ApiClient.post('/enf/orders', {
        planId: selectedPlanId,
      });

      if (res.success && res.data?.order) {
        const order = res.data.order as ENFOrder;
        setActiveOrder(order);
        setTransferAmount(order.amountPhp);
        setBankTransactionRef(`BNK-${Date.now().toString().slice(-6)}`);
        setStage('SUBMIT_PAYMENT');
        setIsSubmitting(false);
        return;
      }

      // Fallback to local storage engine if offline
      const localOrder = EnfStorageService.createOrder(selectedPlanId, {
        id: currentUser.id,
        name: customerName || currentUser.fullName,
        email: customerEmail || currentUser.email,
        phone: customerPhone || currentUser.phone,
      });
      setActiveOrder(localOrder);
      setTransferAmount(localOrder.amountPhp);
      setBankTransactionRef(`BNK-${Date.now().toString().slice(-6)}`);
      setStage('SUBMIT_PAYMENT');
      setIsSubmitting(false);
    } catch {
      setIsSubmitting(false);
      setApiError('Failed to initialize development order. Please check network connection.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    const file = e.target.files?.[0];
    if (file) {
      const allowedExtensions = ['.jpg', '.jpeg', '.png', '.pdf'];
      const ext = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!allowedExtensions.includes(ext)) {
        setFileError('Invalid file type. Only JPG, PNG, and PDF files are accepted.');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setFileError('File size exceeds the 10 MB limit. Please upload a smaller file.');
        return;
      }
      setProofFileName(file.name);
      setProofFileType(file.type || 'application/pdf');
      const reader = new FileReader();
      reader.onload = () => {
        setProofPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitProof = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOrder) return;

    if (!proofFileName) {
      setFileError('Please attach your deposit slip or transfer screenshot.');
      return;
    }

    setIsSubmitting(true);
    setApiError(null);

    const payload = {
      orderId: activeOrder.id,
      paymentRef: activeOrder.paymentRef,
      customerId: activeOrder.customerId,
      customerName: senderName || activeOrder.customerName,
      bankName: senderBank,
      transferDate,
      transferTime,
      amountPhp: transferAmount,
      senderName,
      bankTransactionRef,
      proofFileName,
      proofFileType,
      proofFileDataUrl: proofPreviewUrl,
    };

    try {
      // Submit payment via server API
      const res = await ApiClient.post('/enf/payments', payload);
      setIsSubmitting(false);

      if (res.success) {
        // Also save to local storage engine
        EnfStorageService.submitPayment(payload);
        setStage('PAYMENT_PENDING');
        if (onPaymentSubmitted) {
          onPaymentSubmitted(activeOrder.id);
        }
      } else {
        setApiError(res.message || 'Payment submission could not be verified by server.');
      }
    } catch {
      // Fallback to local storage engine
      EnfStorageService.submitPayment(payload);
      setIsSubmitting(false);
      setStage('PAYMENT_PENDING');
      if (onPaymentSubmitted) {
        onPaymentSubmitted(activeOrder.id);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7F9] text-[#17212B] font-sans antialiased py-8 sm:py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 space-y-8">
        {/* Navigation Breadcrumbs / Title */}
        <div className="flex items-center justify-between border-b border-[#D9E1E8] pb-4">
          <div>
            <span className="text-[10px] font-bold text-[#0078CE] uppercase font-mono">
              Electronic Notarial Facility Onboarding
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-[#002D5B]">
              Commercial Plan Selection & Checkout
            </h1>
          </div>
          <button
            onClick={() => onNavigate('/enf/dashboard')}
            className="text-xs font-bold text-slate-500 hover:text-[#002D5B] cursor-pointer"
          >
            ← Return to Dashboard
          </button>
        </div>

        {apiError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-800 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
            <span>{apiError}</span>
          </div>
        )}

        {/* STEP 1: Plan Selection & Order Review (Section 12, 13, 14, 15) */}
        {stage === 'SELECT_PLAN' && (
          <div className="space-y-8">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#002D5B]">
                Select Your ENF Commercial Package
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                100% of your plan fee goes directly into usable prepaid notarial technical credits (₱100/credit base).
              </p>
            </div>

            {/* Plan Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {plans.map((p) => {
                const isSelected = p.id === selectedPlanId;
                const discount = Math.round(p.discountRate * 100);

                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPlanId(p.id)}
                    className={`rounded-xl border p-5 cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#0078CE] bg-white ring-2 ring-[#0078CE]/20 shadow-md'
                        : 'border-[#D9E1E8] bg-white hover:border-slate-400 shadow-2xs'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#002D5B]">{p.name}</span>
                        {p.isPopular && (
                          <span className="rounded bg-[#0078CE] px-1.5 py-0.5 text-[9px] font-bold text-white uppercase">
                            Popular
                          </span>
                        )}
                      </div>

                      <div>
                        <p className="text-2xl font-extrabold text-[#002D5B] font-mono">
                          ₱{p.pricePhp.toLocaleString()}
                        </p>
                        <p className="text-xs font-bold text-[#2EAF4A] mt-0.5">
                          {discount}% Technical Fee Discount
                        </p>
                      </div>

                      <div className="text-[11px] text-slate-600 border-t border-slate-100 pt-2 space-y-1">
                        <p className="font-bold text-[#002D5B]">• {p.creditsQuantity} Credits included</p>
                        <p>• ₱{p.effectiveFeePhp} effective technical fee</p>
                        <p>• ₱0 setup or onboarding fee</p>
                        <p>• Custom ENF Subdomain & Seal</p>
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-500">
                        {isSelected ? 'Selected' : 'Click to select'}
                      </span>
                      <div
                        className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-[#0078CE] bg-[#0078CE] text-white' : 'border-slate-300'
                        }`}
                      >
                        {isSelected && <Check className="h-3 w-3" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Authoritative Checkout Summary Card (Section 14) */}
            <div className="rounded-2xl border-2 border-[#002D5B]/20 bg-white p-6 sm:p-8 shadow-sm space-y-6">
              <div className="border-b border-[#D9E1E8] pb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-[#002D5B]">Package Checkout Breakdown</h3>
                  <p className="text-xs text-slate-500">
                    Authoritative commercial allocation as specified by Supreme Court e-notarization technical rules.
                  </p>
                </div>
                <span className="rounded bg-[#2EAF4A]/10 text-[#1B6C2E] px-2.5 py-1 text-xs font-bold font-mono">
                  {selectedPlan.name}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Purchase Price</span>
                  <p className="text-base font-extrabold text-[#002D5B] font-mono mt-1">
                    ₱{selectedPlan.pricePhp.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Discount Rate</span>
                  <p className="text-base font-extrabold text-[#0078CE] font-mono mt-1">
                    {Math.round(selectedPlan.discountRate * 100)}%
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Effective Fee</span>
                  <p className="text-base font-extrabold text-[#2EAF4A] font-mono mt-1">
                    ₱{selectedPlan.effectiveFeePhp}
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Credits Allocation</span>
                  <p className="text-base font-extrabold text-[#002D5B] font-mono mt-1">
                    {selectedPlan.creditsQuantity}
                  </p>
                </div>
              </div>

              {/* Customer Details Form */}
              <form onSubmit={handleCreateOrder} className="space-y-4 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#002D5B] mb-1">
                      Subscriber / Notary Public Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full rounded-lg border border-[#D9E1E8] p-2.5 text-xs text-[#17212B] focus:border-[#0078CE] focus:outline-none"
                      placeholder="e.g. Atty. Juan Dela Cruz, En.P."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#002D5B] mb-1">
                      Official Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full rounded-lg border border-[#D9E1E8] p-2.5 text-xs text-[#17212B] focus:border-[#0078CE] focus:outline-none"
                      placeholder="notary@lawfirm.ph"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-xl bg-[#002D5B] py-3.5 text-sm font-bold text-white hover:bg-[#0078CE] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-4"
                >
                  <span>{isSubmitting ? 'Creating Order on Server...' : 'CREATE ORDER & VIEW PAYMENT INSTRUCTIONS'}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>
        )}

        {/* STEP 2: Bank Transfer Instructions & Proof Upload (Section 17 & 18) */}
        {stage === 'SUBMIT_PAYMENT' && activeOrder && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-[#0078CE]/30 bg-white p-6 sm:p-8 shadow-md space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D9E1E8] pb-5">
                <div>
                  <span className="rounded bg-[#0078CE]/10 px-2 py-0.5 text-[10px] font-bold text-[#002D5B] uppercase">
                    ORDER CREATED • PENDING BANK TRANSFER
                  </span>
                  <h2 className="text-xl font-bold text-[#002D5B] mt-1">
                    Philippine Bank Remittance Instructions
                  </h2>
                </div>
                <div className="text-right font-mono">
                  <p className="text-xs text-slate-500">Order Number</p>
                  <p className="text-lg font-bold text-[#002D5B]">{activeOrder.orderNumber || activeOrder.id}</p>
                </div>
              </div>

              {/* Payment Reference Highlight Box */}
              <div className="rounded-xl border-2 border-dashed border-[#0078CE] bg-[#0078CE]/5 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#002D5B]">
                    Your Unique Payment Reference (Mandatory):
                  </p>
                  <p className="text-2xl font-black text-[#002D5B] font-mono tracking-wider mt-1">
                    {activeOrder.paymentRef}
                  </p>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Please paste or write this reference code into the transfer memo / notes field of your bank app.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => copyToClipboard(activeOrder.paymentRef, 'ref')}
                  className="rounded-lg bg-white border border-[#0078CE] px-4 py-2 text-xs font-bold text-[#0078CE] hover:bg-[#0078CE] hover:text-white transition-all shadow-2xs flex items-center gap-2 cursor-pointer whitespace-nowrap"
                >
                  {copiedField === 'ref' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  <span>{copiedField === 'ref' ? 'Copied Reference' : 'Copy Reference Code'}</span>
                </button>
              </div>

              {/* Official Bank Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl border border-[#D9E1E8] bg-[#F4F7F9] p-4 space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Bank Name</p>
                  <p className="text-sm font-bold text-[#002D5B]">{bankConfig.bankName}</p>
                  <p className="text-xs text-slate-500">{bankConfig.branch}</p>
                </div>

                <div className="rounded-xl border border-[#D9E1E8] bg-[#F4F7F9] p-4 space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Account Name</p>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-[#002D5B] font-mono">{bankConfig.accountName}</p>
                    <button
                      onClick={() => copyToClipboard(bankConfig.accountName, 'accName')}
                      className="text-slate-400 hover:text-[#002D5B] cursor-pointer"
                      title="Copy Account Name"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="rounded-xl border border-[#D9E1E8] bg-[#F4F7F9] p-4 space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Account Number</p>
                  <div className="flex items-center justify-between">
                    <p className="text-base font-extrabold text-[#002D5B] font-mono">{bankConfig.accountNumber}</p>
                    <button
                      onClick={() => copyToClipboard(bankConfig.accountNumber, 'accNo')}
                      className="text-slate-400 hover:text-[#002D5B] cursor-pointer"
                      title="Copy Account Number"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="rounded-xl border border-[#D9E1E8] bg-[#F4F7F9] p-4 space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Exact Transfer Amount</p>
                  <p className="text-base font-extrabold text-[#2EAF4A] font-mono">
                    ₱{activeOrder.amountPhp.toLocaleString()}.00
                  </p>
                </div>
              </div>

              <div className="rounded-lg border border-amber-200 bg-amber-50/70 p-3 text-xs text-amber-900 flex items-start gap-2.5">
                <Clock className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Administrative Verification Notice: </span>
                  <span>
                    Payment is NOT automatically confirmed. Submit your transaction reference and screenshot below. The administrative verification desk reconciles records within 1–3 hours during business days.
                  </span>
                </div>
              </div>
            </div>

            {/* Proof of Payment Submission Form */}
            <form onSubmit={handleSubmitProof} className="rounded-2xl border border-[#D9E1E8] bg-white p-6 sm:p-8 shadow-xs space-y-6">
              <div className="border-b border-[#D9E1E8] pb-4">
                <h3 className="text-lg font-bold text-[#002D5B]">Submit Proof of Payment</h3>
                <p className="text-xs text-slate-500">
                  Upload your bank transfer receipt (PDF, JPG, or PNG) for administrative verification.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#002D5B] mb-1">
                    Your Sending Bank *
                  </label>
                  <input
                    type="text"
                    required
                    value={senderBank}
                    onChange={(e) => setSenderBank(e.target.value)}
                    className="w-full rounded-lg border border-[#D9E1E8] p-2.5 text-xs text-[#17212B] focus:border-[#0078CE] focus:outline-none"
                    placeholder="e.g. BPI, BDO, Metrobank, UnionBank, GCash"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#002D5B] mb-1">
                    Bank Transaction / Trace Reference *
                  </label>
                  <input
                    type="text"
                    required
                    value={bankTransactionRef}
                    onChange={(e) => setBankTransactionRef(e.target.value)}
                    className="w-full rounded-lg border border-[#D9E1E8] p-2.5 text-xs text-[#17212B] font-mono focus:border-[#0078CE] focus:outline-none"
                    placeholder="e.g. 20260929-BDO-981240"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#002D5B] mb-1">
                    Remitter / Sender Account Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="w-full rounded-lg border border-[#D9E1E8] p-2.5 text-xs text-[#17212B] focus:border-[#0078CE] focus:outline-none"
                    placeholder="Account name as printed on transfer slip"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#002D5B] mb-1">
                    Actual Transferred Amount (PHP) *
                  </label>
                  <input
                    type="number"
                    required
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(Number(e.target.value))}
                    className="w-full rounded-lg border border-[#D9E1E8] p-2.5 text-xs text-[#17212B] font-mono focus:border-[#0078CE] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#002D5B] mb-1">
                    Transfer Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={transferDate}
                    onChange={(e) => setTransferDate(e.target.value)}
                    className="w-full rounded-lg border border-[#D9E1E8] p-2.5 text-xs text-[#17212B] focus:border-[#0078CE] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#002D5B] mb-1">
                    Transfer Time *
                  </label>
                  <input
                    type="text"
                    required
                    value={transferTime}
                    onChange={(e) => setTransferTime(e.target.value)}
                    className="w-full rounded-lg border border-[#D9E1E8] p-2.5 text-xs text-[#17212B] focus:border-[#0078CE] focus:outline-none"
                    placeholder="e.g. 10:45 AM"
                  />
                </div>
              </div>

              {/* File Upload Box */}
              <div>
                <label className="block text-xs font-bold text-[#002D5B] mb-1">
                  Upload Payment Proof Slip (JPG, PNG, or PDF) *
                </label>
                <div className="rounded-xl border-2 border-dashed border-[#D9E1E8] hover:border-[#0078CE] p-6 text-center bg-[#F4F7F9] cursor-pointer transition-colors relative">
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={handleFileUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <div className="space-y-2 flex flex-col items-center">
                    <Upload className="h-8 w-8 text-[#0078CE]" />
                    <p className="text-xs font-bold text-[#002D5B]">
                      {proofFileName ? proofFileName : 'Click to select or drag and drop bank transfer proof'}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      Supports JPG, PNG, PDF up to 10 MB
                    </p>
                    {fileError && (
                      <span className="rounded bg-red-100 text-red-700 px-2.5 py-1 text-xs font-bold">
                        ⚠ {fileError}
                      </span>
                    )}
                    {proofFileName && !fileError && (
                      <span className="rounded bg-[#2EAF4A]/20 px-2.5 py-0.5 text-xs font-bold text-[#1B6C2E]">
                        ✓ File Attached: {proofFileName}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStage('SELECT_PLAN')}
                  className="rounded-lg border border-[#D9E1E8] px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Modify Order
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-[#2EAF4A] px-6 py-3 text-xs font-bold text-white hover:bg-[#258F3C] transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>{isSubmitting ? 'Transmitting Submission to Backend...' : 'Submit Payment for Verification'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 3: Submission Confirmation / Pending Status (Section 19) */}
        {stage === 'PAYMENT_PENDING' && activeOrder && (
          <div className="rounded-2xl border border-[#2EAF4A]/40 bg-white p-6 sm:p-10 shadow-lg text-center space-y-6">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#2EAF4A]/10 text-[#2EAF4A]">
              <CheckCircle2 className="h-9 w-9" />
            </div>

            <div className="space-y-2 max-w-lg mx-auto">
              <span className="rounded-full bg-[#0078CE]/10 px-3 py-1 text-xs font-bold text-[#002D5B]">
                STATUS: PAYMENT_SUBMITTED (UNDER ADMINISTRATIVE REVIEW)
              </span>
              <h2 className="text-2xl font-extrabold text-[#002D5B]">
                Payment Submitted Successfully
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Your payment submission for <strong>{activeOrder.planName}</strong> (Ref:{' '}
                <strong className="font-mono text-[#002D5B]">{activeOrder.paymentRef}</strong>) has been queued for verification.
              </p>
            </div>

            {/* Status Breakdown Box */}
            <div className="rounded-xl border border-[#D9E1E8] bg-[#F4F7F9] p-5 max-w-lg mx-auto text-left space-y-3 text-xs">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Order ID:</span>
                <span className="font-bold text-[#002D5B] font-mono">{activeOrder.orderNumber || activeOrder.id}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Submitted Amount:</span>
                <span className="font-bold text-[#2EAF4A] font-mono">₱{transferAmount.toLocaleString()}.00</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Credited on Approval:</span>
                <span className="font-bold text-[#002D5B] font-mono">{activeOrder.creditsQuantity} Credits</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Applicable Discount Tier:</span>
                <span className="font-bold text-[#0078CE] font-mono">{(activeOrder.discountRate * 100).toFixed(0)}% OFF</span>
              </div>
            </div>

            <div className="rounded-lg border border-[#0078CE]/30 bg-[#0078CE]/5 p-4 max-w-lg mx-auto text-xs text-[#002D5B] text-left flex items-start gap-3">
              <Clock className="h-5 w-5 text-[#0078CE] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Next Steps:</p>
                <p className="mt-1 text-slate-600">
                  Our treasury officer will verify your bank transfer. Upon approval, your credits will be activated immediately and an Official Receipt will be issued to your account.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => onNavigate('/enf/dashboard')}
                className="w-full sm:w-auto rounded-xl bg-[#002D5B] px-6 py-3 text-xs font-bold text-white hover:bg-[#0078CE] transition-all shadow-md cursor-pointer"
              >
                Go to Customer Dashboard
              </button>

              <button
                type="button"
                onClick={() => onNavigate('/enf/transactions')}
                className="w-full sm:w-auto rounded-xl border border-[#002D5B] bg-white px-6 py-3 text-xs font-bold text-[#002D5B] hover:bg-[#F4F7F9] transition-all cursor-pointer"
              >
                View Purchase History & Receipts
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
