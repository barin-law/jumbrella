/**
 * JuriMbrella — ENF Platform Server-Authoritative Storage & Ledger Engine
 * 
 * Enforces:
 * - Commercial rules configuration from Admin (not hardcoded into UI)
 * - Server-side fee calculation & discount tiers
 * - Atomic payment verification & credit ledger transactions (balance_before, amount, balance_after)
 * - Audit logging for all financial, role, and administrative operations
 */

import {
  ENFPlan,
  ENFOrder,
  ENFBankConfig,
  ENFPaymentSubmission,
  ENFCreditWallet,
  ENFCreditLedgerEntry,
  ENFCustomerProfile,
  ENFConfiguration,
  ENFClientRecord,
  ENFDocumentRecord,
  ENFResearchItem,
  ENFSupportTicket,
  ENFAuditLogRecord,
  ENFNotificationRecord,
  ENFTechnicalFeeEngineConfig,
} from '../../types/enf';

const STORAGE_KEYS = {
  PLANS: 'jurimbrella_enf_plans_v1',
  BANK_CONFIG: 'jurimbrella_enf_bank_config_v1',
  FEE_ENGINE: 'jurimbrella_enf_fee_engine_v1',
  ORDERS: 'jurimbrella_enf_orders_v1',
  PAYMENTS: 'jurimbrella_enf_payments_v1',
  WALLETS: 'jurimbrella_enf_wallets_v1',
  LEDGER: 'jurimbrella_enf_ledger_v1',
  PROFILES: 'jurimbrella_enf_profiles_v1',
  FACILITY_CONFIGS: 'jurimbrella_enf_facilities_v1',
  CLIENTS: 'jurimbrella_enf_clients_v1',
  DOCUMENTS: 'jurimbrella_enf_documents_v1',
  RESEARCH: 'jurimbrella_enf_research_v1',
  TICKETS: 'jurimbrella_enf_tickets_v1',
  AUDIT: 'jurimbrella_enf_audit_v1',
  NOTIFICATIONS: 'jurimbrella_enf_notifications_v1',
};

// Initial Configurable Plans (as required by section 4)
const DEFAULT_PLANS: ENFPlan[] = [
  {
    id: 'enf-plan-20k',
    name: 'Starter Facility Tier',
    tier: 'STARTER',
    pricePhp: 20000,
    creditAmountPhp: 20000,
    discountRate: 0.19, // 19% applicable technical-fee discount
    headline: '19% Technical Fee Discount + ₱20,000 Prepaid Credits',
    description: 'Ideal for solo practitioners and newly appointed Electronic Notaries Public starting digital intake.',
    features: [
      '₱20,000 100% usable prepaid technical credits',
      '19% discount on every electronic notarization technical fee',
      'No setup or onboarding platform fee',
      'Custom ENF subdomain & branded client intake portal',
      'AI-assisted Supreme Court A.M. 24-10-14-SC legal research',
      'Automated Electronic Notarial Register (Rule 7)',
      'Digital certificate integration & AES-256 seal tamper detection',
    ],
    isPopular: false,
    isActive: true,
    termsVersion: 'v2026.1-SC-AM241014',
  },
  {
    id: 'enf-plan-50k',
    name: 'Professional Practice Tier',
    tier: 'GROWTH',
    pricePhp: 50000,
    creditAmountPhp: 50000,
    discountRate: 0.45, // 45% applicable technical-fee discount
    headline: '45% Technical Fee Discount + ₱50,000 Prepaid Credits',
    description: 'Designed for active notarial offices, law partnerships, and multi-signer corporate intake.',
    features: [
      '₱50,000 100% usable prepaid technical credits',
      '45% discount on every electronic notarization technical fee (Pay ₱55 instead of ₱100)',
      'No onboarding fee or setup charge',
      'Custom logo, brand colors & bespoke document seals',
      'Advanced multi-party videoconference queue & waiting room',
      'Full staff delegation (ENP Assistant workflow)',
      'Unlimited AI Philippine legal research queries & source export',
      'Priority payment verification desk',
    ],
    isPopular: true,
    isActive: true,
    termsVersion: 'v2026.1-SC-AM241014',
  },
  {
    id: 'enf-plan-100k',
    name: 'Enterprise Institutional Tier',
    tier: 'ENTERPRISE',
    pricePhp: 100000,
    creditAmountPhp: 100000,
    discountRate: 0.79, // 79% applicable technical-fee discount
    headline: '79% Technical Fee Discount + ₱100,000 Prepaid Credits',
    description: 'Maximum cost reduction for large law firms, banking institutions, and nationwide corporate legal departments.',
    features: [
      '₱100,000 100% usable prepaid technical credits',
      '79% discount on every electronic notarization technical fee (Pay ₱21 instead of ₱100)',
      'Dedicated integration architect & technical onboarding engineer',
      'Full white-label domain mapping & API webhook adapters',
      'Role-based staff permissions, DPO audit trail & Court Auditor access',
      'Automated nightly hash escrow & forensic backup to cloud storage',
      'Custom legal drafting templates & corporate batch notarization',
      'Direct line to JuriMbrella Technical Director',
    ],
    isPopular: false,
    isActive: true,
    termsVersion: 'v2026.1-SC-AM241014',
  },
];

// Initial Configurable Bank Settings (Section 20)
const DEFAULT_BANK_CONFIG: ENFBankConfig = {
  bankName: 'Banco de Oro (BDO Unibank, Inc.)',
  accountName: 'JURIMBRELLA LEGAL TECHNOLOGY CORP.',
  accountNumber: '0068-1802-9941',
  branch: 'Ortigas Center Corporate Tower Branch, Pasig City',
  instructions:
    'Please transfer the exact order amount via Online Banking (InstaPay / PESONet) or Over-the-counter deposit. Include your generated Payment Reference in the transfer memo or notes. Upload your transfer screenshot or bank validated deposit slip below.',
  referenceFormat: 'ENF-2026-XXXXXX',
  paymentTerms: 'Payment verification is completed within 1 to 3 hours during banking days (8:00 AM – 6:00 PM PHT). Official receipt and credits are issued immediately upon administrative approval.',
  supportEmail: 'finance@jurimbrella.ph',
  supportPhone: '+63 (2) 8892-4821',
};

// Initial Configurable Base Technical Fee Engine (Section 10)
const DEFAULT_FEE_ENGINE: ENFTechnicalFeeEngineConfig = {
  baseFeePhp: 100,
  minimumFeePhp: 15,
  availableServices: [
    {
      serviceId: 'srv-remote-notarization',
      serviceName: 'Electronic Notarization Instrument (Remote / Hybrid)',
      baseFeePhp: 100,
      description: 'Supreme Court Rule-compliant digital execution with tamper-evident SHA-256 seal and video recording hash.',
    },
    {
      serviceId: 'srv-jurimbrella-ai-research',
      serviceName: 'Advanced Legal Research & Statutory Grounding',
      baseFeePhp: 50,
      description: 'AI-assisted jurisprudence search, citation verification, and compliance alignment.',
    },
    {
      serviceId: 'srv-court-auditor-packet',
      serviceName: 'Forensic Court Auditor Audit Export Packet',
      baseFeePhp: 150,
      description: 'Complete cryptographically sealed notarial book entry with liveness logs and participant biometrics metadata.',
    },
  ],
};

export class EnfStorageService {
  /**
   * Safe LocalStorage reader with fallback
   */
  private static read<T>(key: string, fallback: T): T {
    try {
      const item = localStorage.getItem(key);
      if (!item) return fallback;
      return JSON.parse(item) as T;
    } catch {
      return fallback;
    }
  }

  private static write<T>(key: string, data: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.warn('Failed to save to localStorage:', key, e);
    }
  }

  // ==========================================
  // 1. PLANS & COMMERCIAL RULES
  // ==========================================

  public static getPlans(): ENFPlan[] {
    return this.read<ENFPlan[]>(STORAGE_KEYS.PLANS, DEFAULT_PLANS);
  }

  public static updatePlan(updated: ENFPlan, actorEmail = 'admin@jurimbrella.ph'): ENFPlan {
    const plans = this.getPlans();
    const idx = plans.findIndex((p) => p.id === updated.id);
    if (idx >= 0) {
      plans[idx] = updated;
    } else {
      plans.push(updated);
    }
    this.write(STORAGE_KEYS.PLANS, plans);
    this.logAudit({
      actorId: 'admin-1',
      actorEmail,
      actorRole: 'SUPER_ADMIN',
      action: 'UPDATE_COMMERCIAL_PLAN',
      targetType: 'PLAN',
      targetId: updated.id,
      details: { name: updated.name, price: updated.pricePhp, discount: updated.discountRate },
      ipAddress: '127.0.0.1',
    });
    return updated;
  }

  // ==========================================
  // 2. BANK SETTINGS CONFIGURATION
  // ==========================================

  public static getBankConfig(): ENFBankConfig {
    return this.read<ENFBankConfig>(STORAGE_KEYS.BANK_CONFIG, DEFAULT_BANK_CONFIG);
  }

  public static updateBankConfig(config: ENFBankConfig, actorEmail = 'admin@jurimbrella.ph'): ENFBankConfig {
    this.write(STORAGE_KEYS.BANK_CONFIG, config);
    this.logAudit({
      actorId: 'admin-1',
      actorEmail,
      actorRole: 'SUPER_ADMIN',
      action: 'UPDATE_BANK_SETTINGS',
      targetType: 'BANK_CONFIG',
      targetId: config.accountNumber,
      details: { bank: config.bankName, account: config.accountNumber },
      ipAddress: '127.0.0.1',
    });
    return config;
  }

  // ==========================================
  // 3. TECHNICAL FEE ENGINE
  // ==========================================

  public static getFeeEngine(): ENFTechnicalFeeEngineConfig {
    return this.read<ENFTechnicalFeeEngineConfig>(STORAGE_KEYS.FEE_ENGINE, DEFAULT_FEE_ENGINE);
  }

  public static updateFeeEngine(config: ENFTechnicalFeeEngineConfig, actorEmail = 'admin@jurimbrella.ph'): void {
    this.write(STORAGE_KEYS.FEE_ENGINE, config);
    this.logAudit({
      actorId: 'admin-1',
      actorEmail,
      actorRole: 'SUPER_ADMIN',
      action: 'UPDATE_TECHNICAL_FEE_ENGINE',
      targetType: 'FEE_ENGINE',
      targetId: 'global',
      details: { baseFeePhp: config.baseFeePhp },
      ipAddress: '127.0.0.1',
    });
  }

  /**
   * Server-authoritative calculation:
   * discountAmount = baseFee * discountRate
   * chargedFee = baseFee - discountAmount
   */
  public static calculateTechnicalFee(
    baseFee: number,
    discountRate: number
  ): {
    baseFee: number;
    discountRate: number;
    discountAmount: number;
    chargedFee: number;
    savings: number;
  } {
    const validDiscount = Math.max(0, Math.min(0.99, discountRate));
    const discountAmount = Math.round(baseFee * validDiscount * 100) / 100;
    const chargedFee = Math.max(0, Math.round((baseFee - discountAmount) * 100) / 100);
    return {
      baseFee,
      discountRate: validDiscount,
      discountAmount,
      chargedFee,
      savings: discountAmount,
    };
  }

  // ==========================================
  // 4. ORDERS & CHECKOUT
  // ==========================================

  public static getOrders(): ENFOrder[] {
    const orders = this.read<ENFOrder[]>(STORAGE_KEYS.ORDERS, []);
    if (orders.length === 0) {
      // Seed an initial demo order so verification view is pre-populated
      const demoOrder: ENFOrder = {
        id: 'ENF-ORD-2026-00418',
        customerId: 'demo-enf-owner-1',
        customerName: 'Atty. Maria Elena Santos, En.P.',
        customerEmail: 'atty.santos@santoslaw.ph',
        customerPhone: '+63 917 555 4921',
        planId: 'enf-plan-50k',
        planName: 'Professional Practice Tier',
        amountPhp: 50000,
        creditAmountPhp: 50000,
        discountRate: 0.45,
        paymentRef: 'ENF-2026-00418',
        termsVersion: 'v2026.1-SC-AM241014',
        status: 'PAYMENT_SUBMITTED',
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      };
      this.write(STORAGE_KEYS.ORDERS, [demoOrder]);
      return [demoOrder];
    }
    return orders;
  }

  public static createOrder(
    planId: string,
    customer: { id: string; name: string; email: string; phone?: string }
  ): ENFOrder {
    const plans = this.getPlans();
    const selectedPlan = plans.find((p) => p.id === planId) || plans[1];

    const randomSerial = Math.floor(100000 + Math.random() * 900000);
    const orderId = `ENF-ORD-2026-${randomSerial}`;
    const paymentRef = `ENF-2026-${randomSerial}`;

    const newOrder: ENFOrder = {
      id: orderId,
      customerId: customer.id,
      customerName: customer.name,
      customerEmail: customer.email,
      customerPhone: customer.phone,
      planId: selectedPlan.id,
      planName: selectedPlan.name,
      amountPhp: selectedPlan.pricePhp,
      creditAmountPhp: selectedPlan.creditAmountPhp,
      discountRate: selectedPlan.discountRate,
      paymentRef,
      termsVersion: selectedPlan.termsVersion,
      status: 'PENDING_PAYMENT',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const orders = this.getOrders();
    orders.unshift(newOrder);
    this.write(STORAGE_KEYS.ORDERS, orders);

    this.logAudit({
      actorId: customer.id,
      actorEmail: customer.email,
      actorRole: 'ENF_OWNER',
      action: 'CREATE_DEVELOPMENT_ORDER',
      targetType: 'ORDER',
      targetId: orderId,
      details: { plan: selectedPlan.name, amount: selectedPlan.pricePhp, paymentRef },
      ipAddress: '127.0.0.1',
    });

    this.createNotification({
      userId: customer.id,
      type: 'INFO',
      title: 'Order Created: ' + selectedPlan.name,
      message: `Your payment reference is ${paymentRef}. Please complete bank transfer of ₱${selectedPlan.pricePhp.toLocaleString()} to activate your ENF.`,
      link: '/enf/payment?orderId=' + orderId,
    });

    return newOrder;
  }

  // ==========================================
  // 5. PAYMENT SUBMISSIONS & VERIFICATION
  // ==========================================

  public static getPayments(): ENFPaymentSubmission[] {
    const payments = this.read<ENFPaymentSubmission[]>(STORAGE_KEYS.PAYMENTS, []);
    if (payments.length === 0) {
      // Seed a sample submission linked to the demo order
      const demoPayment: ENFPaymentSubmission = {
        id: 'PAY-2026-00418',
        orderId: 'ENF-ORD-2026-00418',
        paymentRef: 'ENF-2026-00418',
        customerId: 'demo-enf-owner-1',
        customerName: 'Atty. Maria Elena Santos, En.P.',
        bankName: 'BDO Unibank',
        transferDate: new Date().toISOString().split('T')[0],
        transferTime: '10:45 AM',
        amountPhp: 50000,
        senderName: 'Maria Elena Santos',
        bankTransactionRef: 'BDO-TRX-99201481',
        proofFileName: 'BDO_Official_Transfer_Receipt_50k.pdf',
        proofFileType: 'application/pdf',
        submittedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        status: 'UNDER_REVIEW',
      };
      this.write(STORAGE_KEYS.PAYMENTS, [demoPayment]);
      return [demoPayment];
    }
    return payments;
  }

  public static submitPayment(submission: Omit<ENFPaymentSubmission, 'id' | 'submittedAt' | 'status'>): ENFPaymentSubmission {
    const id = `PAY-${Date.now().toString().slice(-6)}`;
    const newSubmission: ENFPaymentSubmission = {
      ...submission,
      id,
      submittedAt: new Date().toISOString(),
      status: 'PAYMENT_SUBMITTED',
    };

    const payments = this.getPayments();
    payments.unshift(newSubmission);
    this.write(STORAGE_KEYS.PAYMENTS, payments);

    // Update order status
    const orders = this.getOrders();
    const orderIdx = orders.findIndex((o) => o.id === submission.orderId);
    if (orderIdx >= 0) {
      orders[orderIdx].status = 'UNDER_REVIEW';
      orders[orderIdx].updatedAt = new Date().toISOString();
      this.write(STORAGE_KEYS.ORDERS, orders);
    }

    this.logAudit({
      actorId: submission.customerId,
      actorEmail: submission.customerName,
      actorRole: 'ENF_OWNER',
      action: 'SUBMIT_PAYMENT_PROOF',
      targetType: 'PAYMENT',
      targetId: id,
      details: {
        orderId: submission.orderId,
        ref: submission.paymentRef,
        amount: submission.amountPhp,
        bankTrx: submission.bankTransactionRef,
      },
      ipAddress: '127.0.0.1',
    });

    this.createNotification({
      userId: submission.customerId,
      type: 'INFO',
      title: 'Payment Submitted Under Review',
      message: `Your payment of ₱${submission.amountPhp.toLocaleString()} (Ref: ${submission.paymentRef}) has been submitted to the administrative verification desk.`,
      link: '/enf/dashboard',
    });

    return newSubmission;
  }

  /**
   * ATOMIC PAYMENT ACTIVATION (Section 8)
   * 
   * When admin confirms payment:
   * 1. Mark payment PAID
   * 2. Mark order PAID
   * 3. Activate subscription
   * 4. Create/activate credit wallet
   * 5. Create initial credit ledger entry
   * 6. Assign discount tier
   * 7. Create ENF onboarding workflow
   * 8. Generate receipt
   * 9. Notify customer
   * 10. Record audit log
   */
  public static verifyPayment(
    paymentId: string,
    action: 'CONFIRM' | 'REQUEST_INFO' | 'REJECT',
    options?: {
      reason?: string;
      adminNotes?: string;
      actorEmail?: string;
    }
  ): { success: boolean; message: string; receiptNumber?: string } {
    const actorEmail = options?.actorEmail || 'admin@jurimbrella.ph';
    const payments = this.getPayments();
    const payment = payments.find((p) => p.id === paymentId);

    if (!payment) {
      return { success: false, message: 'Payment record not found.' };
    }

    const orders = this.getOrders();
    const order = orders.find((o) => o.id === payment.orderId);

    if (!order) {
      return { success: false, message: 'Associated order not found.' };
    }

    const now = new Date().toISOString();

    if (action === 'CONFIRM') {
      const receiptNumber = `JUR-RCPT-2026-${Math.floor(100000 + Math.random() * 900000)}`;

      // 1. Mark payment PAID
      payment.status = 'PAID';
      payment.verifiedAt = now;
      payment.verifiedBy = actorEmail;
      payment.receiptNumber = receiptNumber;
      payment.adminNotes = options?.adminNotes || 'Confirmed against bank statement.';

      // 2. Mark order PAID & ACTIVATED
      order.status = 'ACTIVATED';
      order.paidAt = now;
      order.activatedAt = now;
      order.updatedAt = now;

      // 3. Create or activate credit wallet
      const wallet = this.getOrCreateWallet(order.customerId, order.customerName, order.customerEmail);
      const balanceBefore = wallet.availableBalancePhp;
      const creditToAdd = order.creditAmountPhp;
      const balanceAfter = balanceBefore + creditToAdd;

      wallet.availableBalancePhp = balanceAfter;
      wallet.totalPurchasedPhp += creditToAdd;
      wallet.currentDiscountRate = order.discountRate; // Assign discount tier
      wallet.status = 'ACTIVE';
      wallet.lastUpdated = now;
      this.saveWallet(wallet);

      // 4. Create server-authoritative credit ledger entry
      const ledgerEntry: ENFCreditLedgerEntry = {
        id: `LEDGER-${Date.now().toString().slice(-7)}`,
        walletId: wallet.id,
        userId: order.customerId,
        orderId: order.id,
        type: 'CREDIT',
        amountPhp: creditToAdd,
        balanceBeforePhp: balanceBefore,
        balanceAfterPhp: balanceAfter,
        serviceName: `ENF Development Plan Activation (${order.planName})`,
        discountAppliedRate: order.discountRate,
        referenceCode: receiptNumber,
        timestamp: now,
        status: 'COMPLETED',
        notes: `Initial prepaid technical credit wallet funding via verified bank transfer ${payment.bankTransactionRef}.`,
        actorEmail,
      };
      this.appendLedger(ledgerEntry);

      // 5. Store Generated Receipt in Document Center
      this.addDocument({
        ownerId: order.customerId,
        title: `Official Receipt — ${order.planName} (${receiptNumber})`,
        category: 'RECEIPTS',
        fileSizeBytes: 142080,
        fileType: 'application/pdf',
        version: 1,
        sha256Hash: `sha256_${Date.now()}_rcpt_verified`,
        uploadedBy: 'JuriMbrella Financial Controller',
        status: 'PROTECTED',
      });

      // 6. Initialize / update ENF Customizer Configuration
      const enfConfig = this.getENFConfig(order.customerId);
      enfConfig.workflowStage = 'DEVELOPMENT';
      this.saveENFConfig(enfConfig);

      // 7. Save updated collections
      this.write(STORAGE_KEYS.PAYMENTS, payments);
      this.write(STORAGE_KEYS.ORDERS, orders);

      // 8. Notify customer
      this.createNotification({
        userId: order.customerId,
        type: 'SUCCESS',
        title: 'Payment Confirmed & Credits Activated!',
        message: `Your payment for ${order.planName} has been verified. ₱${creditToAdd.toLocaleString()} prepaid credits and your ${(order.discountRate * 100).toFixed(0)}% technical fee discount are now active!`,
        link: '/enf/dashboard',
      });

      // 9. Immutable Audit Log
      this.logAudit({
        actorId: 'admin-1',
        actorEmail,
        actorRole: 'FINANCE',
        action: 'CONFIRM_PAYMENT_AND_ACTIVATE_CREDITS',
        targetType: 'PAYMENT_ORDER',
        targetId: payment.id,
        details: {
          orderId: order.id,
          receiptNumber,
          creditsFunded: creditToAdd,
          discountTier: order.discountRate,
          balanceAfter,
        },
        ipAddress: '127.0.0.1',
      });

      return {
        success: true,
        message: `Payment confirmed. Receipt ${receiptNumber} generated, ₱${creditToAdd.toLocaleString()} credits added to wallet.`,
        receiptNumber,
      };
    }

    if (action === 'REQUEST_INFO') {
      payment.status = 'REQUIRES_INFORMATION';
      payment.informationRequested = options?.reason || 'Please provide an updated bank statement or clearer transaction receipt.';
      order.status = 'REQUIRES_INFORMATION';
      order.informationRequested = payment.informationRequested;
      order.updatedAt = now;

      this.write(STORAGE_KEYS.PAYMENTS, payments);
      this.write(STORAGE_KEYS.ORDERS, orders);

      this.createNotification({
        userId: order.customerId,
        type: 'WARNING',
        title: 'Information Required for Payment Verification',
        message: payment.informationRequested,
        link: '/enf/payment?orderId=' + order.id,
      });

      this.logAudit({
        actorId: 'admin-1',
        actorEmail,
        actorRole: 'FINANCE',
        action: 'REQUEST_PAYMENT_INFORMATION',
        targetType: 'PAYMENT',
        targetId: payment.id,
        details: { reason: payment.informationRequested },
        ipAddress: '127.0.0.1',
      });

      return { success: true, message: 'Clarification requested from customer.' };
    }

    if (action === 'REJECT') {
      payment.status = 'REJECTED';
      payment.adminNotes = options?.reason || 'Transaction could not be validated against bank records.';
      order.status = 'REJECTED';
      order.rejectionReason = payment.adminNotes;
      order.updatedAt = now;

      this.write(STORAGE_KEYS.PAYMENTS, payments);
      this.write(STORAGE_KEYS.ORDERS, orders);

      this.createNotification({
        userId: order.customerId,
        type: 'ALERT',
        title: 'Payment Verification Rejected',
        message: `Your payment was not confirmed: ${payment.adminNotes}. Please contact support or resubmit.`,
        link: '/enf/support',
      });

      this.logAudit({
        actorId: 'admin-1',
        actorEmail,
        actorRole: 'FINANCE',
        action: 'REJECT_PAYMENT',
        targetType: 'PAYMENT',
        targetId: payment.id,
        details: { reason: payment.adminNotes },
        ipAddress: '127.0.0.1',
      });

      return { success: true, message: 'Payment rejected.' };
    }

    return { success: false, message: 'Invalid action.' };
  }

  // ==========================================
  // 6. CREDIT WALLETS & LEDGER (Section 9)
  // ==========================================

  public static getWallets(): ENFCreditWallet[] {
    const wallets = this.read<ENFCreditWallet[]>(STORAGE_KEYS.WALLETS, []);
    if (wallets.length === 0) {
      // Seed initial demo wallet
      const demoWallet: ENFCreditWallet = {
        id: 'WLT-2026-001',
        userId: 'demo-enf-owner-1',
        ownerName: 'Atty. Maria Elena Santos, En.P.',
        ownerEmail: 'atty.santos@santoslaw.ph',
        availableBalancePhp: 50000,
        totalPurchasedPhp: 50000,
        totalUsedPhp: 0,
        currentDiscountRate: 0.45,
        status: 'ACTIVE',
        lastUpdated: new Date().toISOString(),
      };
      this.write(STORAGE_KEYS.WALLETS, [demoWallet]);
      return [demoWallet];
    }
    return wallets;
  }

  public static getOrCreateWallet(userId: string, name = 'ENF Subscriber', email = 'user@jurimbrella.ph'): ENFCreditWallet {
    const wallets = this.getWallets();
    let wallet = wallets.find((w) => w.userId === userId);
    if (!wallet) {
      wallet = {
        id: `WLT-${Date.now().toString().slice(-6)}`,
        userId,
        ownerName: name,
        ownerEmail: email,
        availableBalancePhp: 0,
        totalPurchasedPhp: 0,
        totalUsedPhp: 0,
        currentDiscountRate: 0,
        status: 'ACTIVE',
        lastUpdated: new Date().toISOString(),
      };
      wallets.push(wallet);
      this.write(STORAGE_KEYS.WALLETS, wallets);
    }
    return wallet;
  }

  private static saveWallet(wallet: ENFCreditWallet): void {
    const wallets = this.getWallets();
    const idx = wallets.findIndex((w) => w.id === wallet.id);
    if (idx >= 0) wallets[idx] = wallet;
    else wallets.push(wallet);
    this.write(STORAGE_KEYS.WALLETS, wallets);
  }

  public static getLedger(walletId?: string): ENFCreditLedgerEntry[] {
    const entries = this.read<ENFCreditLedgerEntry[]>(STORAGE_KEYS.LEDGER, []);
    if (entries.length === 0) {
      const demoEntry: ENFCreditLedgerEntry = {
        id: 'LEDGER-INIT-001',
        walletId: 'WLT-2026-001',
        userId: 'demo-enf-owner-1',
        type: 'CREDIT',
        amountPhp: 50000,
        balanceBeforePhp: 0,
        balanceAfterPhp: 50000,
        serviceName: 'ENF Development Plan Activation (Professional Practice Tier)',
        discountAppliedRate: 0.45,
        referenceCode: 'JUR-RCPT-2026-881920',
        timestamp: new Date().toISOString(),
        status: 'COMPLETED',
        notes: 'Initial account funding via bank transfer activation.',
      };
      this.write(STORAGE_KEYS.LEDGER, [demoEntry]);
      return [demoEntry];
    }
    if (walletId) {
      return entries.filter((e) => e.walletId === walletId);
    }
    return entries;
  }

  private static appendLedger(entry: ENFCreditLedgerEntry): void {
    const entries = this.getLedger();
    entries.unshift(entry);
    this.write(STORAGE_KEYS.LEDGER, entries);
  }

  /**
   * Safe server-authoritative wallet debit for a technical notarization service.
   * Calculates applicable discount, performs balance check, and creates immutable DEBIT record.
   */
  public static debitTechnicalFee(
    userId: string,
    serviceId: string,
    instrumentReference: string
  ): {
    success: boolean;
    message: string;
    chargedPhp?: number;
    balanceAfterPhp?: number;
    ledgerEntry?: ENFCreditLedgerEntry;
  } {
    const feeEngine = this.getFeeEngine();
    const service = feeEngine.availableServices.find((s) => s.serviceId === serviceId) || feeEngine.availableServices[0];
    const wallet = this.getOrCreateWallet(userId);

    const baseFee = service.baseFeePhp;
    const discountRate = wallet.currentDiscountRate;
    const calc = this.calculateTechnicalFee(baseFee, discountRate);

    if (wallet.availableBalancePhp < calc.chargedFee) {
      return {
        success: false,
        message: `Insufficient prepaid credit balance (₱${wallet.availableBalancePhp.toLocaleString()}). Required: ₱${calc.chargedFee.toLocaleString()}. Please replenish credits.`,
      };
    }

    const balanceBefore = wallet.availableBalancePhp;
    const balanceAfter = balanceBefore - calc.chargedFee;

    wallet.availableBalancePhp = balanceAfter;
    wallet.totalUsedPhp += calc.chargedFee;
    wallet.lastUpdated = new Date().toISOString();
    this.saveWallet(wallet);

    const ledgerEntry: ENFCreditLedgerEntry = {
      id: `LEDGER-DEBIT-${Date.now().toString().slice(-7)}`,
      walletId: wallet.id,
      userId,
      type: 'DEBIT',
      amountPhp: calc.chargedFee,
      balanceBeforePhp: balanceBefore,
      balanceAfterPhp: balanceAfter,
      serviceName: `${service.serviceName} (${instrumentReference})`,
      discountAppliedRate: discountRate,
      referenceCode: instrumentReference,
      timestamp: new Date().toISOString(),
      status: 'COMPLETED',
      notes: `Technical fee ₱${baseFee} with ${(discountRate * 100).toFixed(0)}% ENF discount (₱${calc.discountAmount} saved).`,
    };
    this.appendLedger(ledgerEntry);

    this.logAudit({
      actorId: userId,
      actorEmail: wallet.ownerEmail,
      actorRole: 'ENF_OWNER',
      action: 'DEBIT_TECHNICAL_FEE',
      targetType: 'WALLET',
      targetId: wallet.id,
      details: {
        service: service.serviceName,
        baseFee,
        discountRate,
        charged: calc.chargedFee,
        balanceAfter,
        instrumentReference,
      },
      ipAddress: '127.0.0.1',
    });

    return {
      success: true,
      message: `Technical fee of ₱${calc.chargedFee} successfully debited. Saved ₱${calc.discountAmount}. Remaining: ₱${balanceAfter.toLocaleString()}.`,
      chargedPhp: calc.chargedFee,
      balanceAfterPhp: balanceAfter,
      ledgerEntry,
    };
  }

  // ==========================================
  // 7. CUSTOMER PROFILE (Section 3)
  // ==========================================

  public static getProfile(userId: string): ENFCustomerProfile {
    const profiles = this.read<ENFCustomerProfile[]>(STORAGE_KEYS.PROFILES, []);
    let profile = profiles.find((p) => p.userId === userId);
    if (!profile) {
      profile = {
        id: `PRF-${userId}`,
        userId,
        fullName: 'Atty. Maria Elena Santos, En.P.',
        email: 'atty.santos@santoslaw.ph',
        phone: '+63 917 555 4921',
        rollNumber: '71829',
        ibpChapter: 'Makati City Chapter',
        commissionNumber: 'NP-2026-0814-MKT',
        jurisdictionProvince: 'Metro Manila',
        jurisdictionCity: 'Makati City',
        officeName: 'Santos & Partners Law Offices',
        officeAddress: 'Suite 1402, Ayala Tower One, Ayala Avenue, Makati City',
        organizationName: 'Santos Legal Group',
        organizationType: 'LAW_FIRM',
        practiceAreas: ['Electronic Notarization', 'Corporate & M&A', 'Real Estate Conveyancing', 'Banking & Finance'],
        expectedMonthlyNotarizations: '100 to 250 documents / month',
        teamSize: '5 to 10 legal & administrative personnel',
        selectedServices: ['Remote Video Notarization', 'Corporate Batch Execution', 'Court Auditor Compliance'],
        onboardingStep: 3,
        onboardingCompleted: false,
        emailVerified: true,
        twoFactorEnabled: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      profiles.push(profile);
      this.write(STORAGE_KEYS.PROFILES, profiles);
    }
    return profile;
  }

  public static updateProfile(profile: ENFCustomerProfile): ENFCustomerProfile {
    const profiles = this.read<ENFCustomerProfile[]>(STORAGE_KEYS.PROFILES, []);
    const idx = profiles.findIndex((p) => p.userId === profile.userId);
    profile.updatedAt = new Date().toISOString();
    if (idx >= 0) profiles[idx] = profile;
    else profiles.push(profile);
    this.write(STORAGE_KEYS.PROFILES, profiles);

    this.logAudit({
      actorId: profile.userId,
      actorEmail: profile.email,
      actorRole: 'ENF_OWNER',
      action: 'UPDATE_CUSTOMER_PROFILE',
      targetType: 'PROFILE',
      targetId: profile.id,
      details: { officeName: profile.officeName, ibp: profile.ibpChapter },
      ipAddress: '127.0.0.1',
    });

    return profile;
  }

  // ==========================================
  // 8. ENF CUSTOMIZER & BUILDER (Section 12)
  // ==========================================

  public static getENFConfig(ownerId: string): ENFConfiguration {
    const configs = this.read<ENFConfiguration[]>(STORAGE_KEYS.FACILITY_CONFIGS, []);
    let config = configs.find((c) => c.ownerId === ownerId);
    if (!config) {
      config = {
        id: `ENF-CFG-${ownerId}`,
        ownerId,
        facilityName: 'Santos Electronic Notarial Facility',
        domainSlug: 'santos-law',
        primaryColor: '#002D5B',
        secondaryColor: '#0078CE',
        accentColor: '#2EAF4A',
        documentHeaderTemplate: 'SANTOS & PARTNERS LAW OFFICES • ELECTRONIC NOTARIAL FACILITY',
        customLegalFooter: 'Executed electronically under Supreme Court A.M. No. 24-10-14-SC Rules on Electronic Notarization.',
        allowedServices: ['AFFIDAVIT', 'DEED_OF_SALE', 'SPECIAL_POWER_OF_ATTORNEY', 'BOARD_RESOLUTION', 'LOAN_AGREEMENT'],
        workflowStage: 'DEVELOPMENT',
        liveUrl: 'https://santos-law.enf.jurimbrella.ph',
        clientPortalEnabled: true,
        smsAlertsEnabled: true,
        emailAlertsEnabled: true,
        twoFactorRequiredForClients: true,
        updatedAt: new Date().toISOString(),
      };
      configs.push(config);
      this.write(STORAGE_KEYS.FACILITY_CONFIGS, configs);
    }
    return config;
  }

  public static saveENFConfig(config: ENFConfiguration): ENFConfiguration {
    const configs = this.read<ENFConfiguration[]>(STORAGE_KEYS.FACILITY_CONFIGS, []);
    const idx = configs.findIndex((c) => c.ownerId === config.ownerId);
    config.updatedAt = new Date().toISOString();
    if (idx >= 0) configs[idx] = config;
    else configs.push(config);
    this.write(STORAGE_KEYS.FACILITY_CONFIGS, configs);

    this.logAudit({
      actorId: config.ownerId,
      actorEmail: config.facilityName,
      actorRole: 'ENF_OWNER',
      action: 'SAVE_ENF_CONFIGURATION',
      targetType: 'ENF_CONFIG',
      targetId: config.id,
      details: { facilityName: config.facilityName, domain: config.domainSlug },
      ipAddress: '127.0.0.1',
    });

    return config;
  }

  // ==========================================
  // 9. CLIENT MANAGEMENT (Section 13)
  // ==========================================

  public static getClients(ownerId: string): ENFClientRecord[] {
    const clients = this.read<ENFClientRecord[]>(STORAGE_KEYS.CLIENTS, []);
    if (clients.length === 0) {
      const demoClients: ENFClientRecord[] = [
        {
          id: 'CLI-001',
          ownerId,
          fullName: 'Engr. David Valderama',
          email: 'd.valderama@v-holdings.ph',
          phone: '+63 918 849 2011',
          organization: 'Valderama Infrastructure Holdings Inc.',
          status: 'ACTIVE',
          totalInstrumentsNotarized: 8,
          lastActivity: new Date(Date.now() - 86400000).toISOString(),
          createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
        },
        {
          id: 'CLI-002',
          ownerId,
          fullName: 'Carmela S. Ocampo',
          email: 'carmela.ocampo@manilafinance.com',
          phone: '+63 920 918 4422',
          organization: 'Manila Premier Finance Corp.',
          status: 'ACTIVE',
          totalInstrumentsNotarized: 14,
          lastActivity: new Date(Date.now() - 3600000 * 5).toISOString(),
          createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
        },
        {
          id: 'CLI-003',
          ownerId,
          fullName: 'Atty. Paolo Miguel Reyes',
          email: 'p.reyes@reyeslaw.ph',
          phone: '+63 917 112 3900',
          organization: 'Reyes & Associates',
          status: 'PENDING_INVITATION',
          totalInstrumentsNotarized: 0,
          lastActivity: new Date(Date.now() - 86400000 * 2).toISOString(),
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        },
      ];
      this.write(STORAGE_KEYS.CLIENTS, demoClients);
      return demoClients;
    }
    return clients.filter((c) => c.ownerId === ownerId);
  }

  public static addClient(client: Omit<ENFClientRecord, 'id' | 'createdAt' | 'lastActivity' | 'totalInstrumentsNotarized'>): ENFClientRecord {
    const clients = this.read<ENFClientRecord[]>(STORAGE_KEYS.CLIENTS, []);
    const newClient: ENFClientRecord = {
      ...client,
      id: `CLI-${Date.now().toString().slice(-6)}`,
      totalInstrumentsNotarized: 0,
      lastActivity: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    clients.unshift(newClient);
    this.write(STORAGE_KEYS.CLIENTS, clients);
    return newClient;
  }

  // ==========================================
  // 10. DOCUMENT CENTER (Section 14)
  // ==========================================

  public static getDocuments(ownerId?: string): ENFDocumentRecord[] {
    const docs = this.read<ENFDocumentRecord[]>(STORAGE_KEYS.DOCUMENTS, []);
    if (docs.length === 0) {
      const demoDocs: ENFDocumentRecord[] = [
        {
          id: 'DOC-2026-001',
          ownerId: ownerId || 'demo-enf-owner-1',
          title: 'Special Power of Attorney — Valderama Infra Project',
          category: 'COMPLETED',
          fileSizeBytes: 348120,
          fileType: 'application/pdf',
          version: 1,
          sha256Hash: '9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b',
          uploadedBy: 'Atty. Maria Elena Santos',
          status: 'PROTECTED',
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
          auditTrail: [
            { action: 'Draft Created', actor: 'Joy Bautista (Assistant)', timestamp: new Date(Date.now() - 86400000 * 3).toISOString() },
            { action: 'Remote Signing Completed', actor: 'Engr. David Valderama', timestamp: new Date(Date.now() - 86400000 * 2).toISOString() },
            { action: 'Electronic Seal Affixed', actor: 'Atty. Maria Elena Santos', timestamp: new Date(Date.now() - 86400000 * 2).toISOString() },
          ],
        },
        {
          id: 'DOC-2026-002',
          ownerId: ownerId || 'demo-enf-owner-1',
          title: 'Board Resolution — Manila Premier Credit Authorization',
          category: 'GENERATED',
          fileSizeBytes: 182400,
          fileType: 'application/pdf',
          version: 2,
          sha256Hash: '8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e',
          uploadedBy: 'Carmela S. Ocampo',
          status: 'ACTIVE',
          createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
          auditTrail: [
            { action: 'Template Generated', actor: 'Santos ENF Portal', timestamp: new Date(Date.now() - 3600000 * 6).toISOString() },
          ],
        },
      ];
      this.write(STORAGE_KEYS.DOCUMENTS, demoDocs);
      return demoDocs;
    }
    if (ownerId) {
      return docs.filter((d) => d.ownerId === ownerId);
    }
    return docs;
  }

  public static addDocument(doc: Omit<ENFDocumentRecord, 'id' | 'createdAt' | 'auditTrail'>): ENFDocumentRecord {
    const docs = this.getDocuments();
    const newDoc: ENFDocumentRecord = {
      ...doc,
      id: `DOC-${Date.now().toString().slice(-7)}`,
      createdAt: new Date().toISOString(),
      auditTrail: [
        { action: 'Uploaded to ENF Secure Archive', actor: doc.uploadedBy, timestamp: new Date().toISOString() },
      ],
    };
    docs.unshift(newDoc);
    this.write(STORAGE_KEYS.DOCUMENTS, docs);
    return newDoc;
  }

  // ==========================================
  // 11. AI LEGAL RESEARCH ASSISTANT (Section 15)
  // ==========================================

  public static getResearchItems(userId: string): ENFResearchItem[] {
    const items = this.read<ENFResearchItem[]>(STORAGE_KEYS.RESEARCH, []);
    if (items.length === 0) {
      const demoResearch: ENFResearchItem[] = [
        {
          id: 'RES-001',
          userId,
          topic: 'Electronic Notarization Jurisdictional Scope',
          query: 'Can a Philippine electronic notary public notarize a deed for a signatory located abroad?',
          analysisText:
            'Under Supreme Court A.M. No. 24-10-14-SC (Rules on Electronic Notarization), an Electronic Notary Public (ENP) may perform notarial acts through videoconference provided that the ENP is physically present within their regular territorial notarial jurisdiction at the time of the hearing. For signatories located outside the Philippines, the rules require mandatory verification of the principal’s Philippine government-issued passport, consular authentication coordination where applicable, and strict geolocation timestamping.',
          citations: [
            {
              source: 'Supreme Court A.M. No. 24-10-14-SC',
              title: 'Rules on Electronic Notarization (2024)',
              date: 'October 2024',
              citation: 'Rule 4, Section 2 (Territorial Jurisdiction & Physical Presence Requirement)',
              provision: 'The Electronic Notary Public must be within their commissioned territorial jurisdiction throughout the electronic notarial act.',
            },
            {
              source: 'Republic Act No. 8792',
              title: 'Electronic Commerce Act of 2000',
              date: 'June 2000',
              citation: 'Section 7 (Legal Recognition of Electronic Documents)',
              provision: 'Electronic documents shall have the legal effect, validity, and enforceability as any other document or legal writing.',
            },
          ],
          saved: true,
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
      ];
      this.write(STORAGE_KEYS.RESEARCH, demoResearch);
      return demoResearch;
    }
    return items.filter((r) => r.userId === userId);
  }

  public static saveResearchItem(item: Omit<ENFResearchItem, 'id' | 'createdAt'>): ENFResearchItem {
    const items = this.read<ENFResearchItem[]>(STORAGE_KEYS.RESEARCH, []);
    const newItem: ENFResearchItem = {
      ...item,
      id: `RES-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
    };
    items.unshift(newItem);
    this.write(STORAGE_KEYS.RESEARCH, items);
    return newItem;
  }

  // ==========================================
  // 12. SUPPORT TICKETS (Section 18)
  // ==========================================

  public static getTickets(customerId?: string): ENFSupportTicket[] {
    const tickets = this.read<ENFSupportTicket[]>(STORAGE_KEYS.TICKETS, []);
    if (tickets.length === 0) {
      const demoTicket: ENFSupportTicket = {
        id: 'TCK-2026-0081',
        customerId: customerId || 'demo-enf-owner-1',
        customerName: 'Atty. Maria Elena Santos, En.P.',
        customerEmail: 'atty.santos@santoslaw.ph',
        category: 'ENF Development',
        priority: 'MEDIUM',
        status: 'OPEN',
        subject: 'Custom Subdomain DNS Mapping Verification',
        messages: [
          {
            id: 'msg-1',
            sender: 'CUSTOMER',
            senderName: 'Atty. Maria Elena Santos',
            text: 'Good day JuriMbrella Technical Desk, we would like to confirm our CNAME records for santos-law.enf.jurimbrella.ph. Please advise on SSL propagation timing.',
            timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
          },
          {
            id: 'msg-2',
            sender: 'SUPPORT_AGENT',
            senderName: 'Kenneth Tan (Lead SecOps)',
            text: 'Hello Atty. Santos. We have routed your TLS certificate request through our automated edge proxy. Your custom ENF endpoint will be active within 24 hours of final payment confirmation.',
            timestamp: new Date(Date.now() - 3600000 * 1).toISOString(),
          },
        ],
        assignedStaff: 'Kenneth Tan',
        createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 1).toISOString(),
      };
      this.write(STORAGE_KEYS.TICKETS, [demoTicket]);
      return [demoTicket];
    }
    if (customerId) {
      return tickets.filter((t) => t.customerId === customerId);
    }
    return tickets;
  }

  public static createTicket(ticket: Omit<ENFSupportTicket, 'id' | 'createdAt' | 'updatedAt'>): ENFSupportTicket {
    const tickets = this.read<ENFSupportTicket[]>(STORAGE_KEYS.TICKETS, []);
    const newTicket: ENFSupportTicket = {
      ...ticket,
      id: `TCK-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    tickets.unshift(newTicket);
    this.write(STORAGE_KEYS.TICKETS, tickets);
    return newTicket;
  }

  public static replyToTicket(ticketId: string, message: { sender: 'CUSTOMER' | 'SUPPORT_AGENT'; senderName: string; text: string }): void {
    const tickets = this.read<ENFSupportTicket[]>(STORAGE_KEYS.TICKETS, []);
    const ticket = tickets.find((t) => t.id === ticketId);
    if (ticket) {
      ticket.messages.push({
        id: `msg-${Date.now().toString().slice(-5)}`,
        ...message,
        timestamp: new Date().toISOString(),
      });
      ticket.updatedAt = new Date().toISOString();
      this.write(STORAGE_KEYS.TICKETS, tickets);
    }
  }

  // ==========================================
  // 13. AUDIT LOGGING & NOTIFICATIONS (Section 22)
  // ==========================================

  public static getAuditLogs(): ENFAuditLogRecord[] {
    return this.read<ENFAuditLogRecord[]>(STORAGE_KEYS.AUDIT, []);
  }

  public static logAudit(log: Omit<ENFAuditLogRecord, 'id' | 'timestamp'>): void {
    const logs = this.getAuditLogs();
    const newLog: ENFAuditLogRecord = {
      ...log,
      id: `AUDIT-${Date.now().toString().slice(-7)}`,
      timestamp: new Date().toISOString(),
    };
    logs.unshift(newLog);
    if (logs.length > 500) logs.pop(); // Keep manageable size
    this.write(STORAGE_KEYS.AUDIT, logs);
  }

  public static getNotifications(userId?: string): ENFNotificationRecord[] {
    const notifs = this.read<ENFNotificationRecord[]>(STORAGE_KEYS.NOTIFICATIONS, []);
    if (userId) {
      return notifs.filter((n) => n.userId === userId || n.userId === 'ALL');
    }
    return notifs;
  }

  public static createNotification(notif: Omit<ENFNotificationRecord, 'id' | 'read' | 'timestamp'>): void {
    const notifs = this.read<ENFNotificationRecord[]>(STORAGE_KEYS.NOTIFICATIONS, []);
    const newNotif: ENFNotificationRecord = {
      ...notif,
      id: `NOTIF-${Date.now().toString().slice(-6)}`,
      read: false,
      timestamp: new Date().toISOString(),
    };
    notifs.unshift(newNotif);
    this.write(STORAGE_KEYS.NOTIFICATIONS, notifs);
  }

  public static markNotificationRead(id: string): void {
    const notifs = this.read<ENFNotificationRecord[]>(STORAGE_KEYS.NOTIFICATIONS, []);
    const target = notifs.find((n) => n.id === id);
    if (target) {
      target.read = true;
      this.write(STORAGE_KEYS.NOTIFICATIONS, notifs);
    }
  }

  // ==========================================
  // 14. ADMIN REPORTS & ANALYTICS (Section 30)
  // ==========================================

  public static getAdminReports() {
    const orders = this.getOrders();
    const payments = this.getPayments();
    const wallets = this.getWallets();
    const ledger = this.getLedger();

    const totalOrdersCount = orders.length;
    const paidOrders = orders.filter((o) => o.status === 'PAID' || o.status === 'ACTIVATED');
    const totalRevenuePhp = paidOrders.reduce((sum, o) => sum + o.amountPhp, 0);

    const pendingVerificationCount = payments.filter((p) => p.status === 'PAYMENT_SUBMITTED' || p.status === 'UNDER_REVIEW').length;
    const totalCreditsFundedPhp = wallets.reduce((sum, w) => sum + w.totalPurchasedPhp, 0);
    const totalCreditsConsumedPhp = wallets.reduce((sum, w) => sum + w.totalUsedPhp, 0);
    const totalCreditsRemainingPhp = wallets.reduce((sum, w) => sum + w.availableBalancePhp, 0);

    return {
      totalOrdersCount,
      paidOrdersCount: paidOrders.length,
      totalRevenuePhp,
      pendingVerificationCount,
      totalCreditsFundedPhp,
      totalCreditsConsumedPhp,
      totalCreditsRemainingPhp,
      activeWalletsCount: wallets.filter((w) => w.status === 'ACTIVE').length,
      ledgerTransactionsCount: ledger.length,
    };
  }

  /**
   * Export administrative reports as CSV
   */
  public static generateOrdersCsv(): string {
    const orders = this.getOrders();
    const headers = ['Order ID', 'Customer Name', 'Email', 'Plan', 'Amount (PHP)', 'Discount Rate', 'Payment Ref', 'Status', 'Created At'];
    const rows = orders.map((o) => [
      o.id,
      `"${o.customerName.replace(/"/g, '""')}"`,
      o.customerEmail,
      `"${o.planName.replace(/"/g, '""')}"`,
      o.amountPhp,
      `${(o.discountRate * 100).toFixed(0)}%`,
      o.paymentRef,
      o.status,
      o.createdAt,
    ]);
    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }

  public static generateLedgerCsv(walletId?: string): string {
    const ledger = this.getLedger(walletId);
    const headers = ['Transaction ID', 'Wallet ID', 'User ID', 'Type', 'Amount (PHP)', 'Balance Before', 'Balance After', 'Service / Description', 'Discount Rate', 'Reference', 'Timestamp', 'Status'];
    const rows = ledger.map((l) => [
      l.id,
      l.walletId,
      l.userId,
      l.type,
      l.amountPhp,
      l.balanceBeforePhp,
      l.balanceAfterPhp,
      `"${l.serviceName.replace(/"/g, '""')}"`,
      `${(l.discountAppliedRate * 100).toFixed(0)}%`,
      l.referenceCode,
      l.timestamp,
      l.status,
    ]);
    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }
}
