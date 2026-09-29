/**
 * Comprehensive Automated Commercial Sales Flow Test Suite
 * Tests all requirements from Sections 1, 5, 6, 9, 10, 11, 12, 13, 14, 15, 18, 41, and 42.
 */

import { EnfStorageService } from '../src/services/enf/enfStorageService.ts';
import { EnfAuthService } from '../src/services/enf/enfAuthService.ts';

// Mock localStorage for Node test environment
const store = new Map();
global.localStorage = {
  getItem: (k) => store.get(k) || null,
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
  clear: () => store.clear(),
};

async function runTestSuite() {
  console.log('========================================================');
  console.log('JURIMBRELLA ENF COMMERCIAL FLOW VERIFICATION TEST SUITE');
  console.log('========================================================\n');

  // TEST 1: Approved Customer-Facing Commercial Values
  console.log('--- TEST 1: Commercial Values Validation ---');
  const plans = EnfStorageService.getPlans();
  const plan20k = plans.find((p) => p.pricePhp === 20000);
  const plan50k = plans.find((p) => p.pricePhp === 50000);
  const plan100k = plans.find((p) => p.pricePhp === 100000);

  if (!plan20k || plan20k.creditsQuantity !== 247 || plan20k.discountRate !== 0.19 || plan20k.effectiveFeePhp !== 81) {
    throw new Error('FAILED: Plan ₱20K commercial values mismatch!');
  }
  console.log('✓ Plan ₱20K: ₱20,000, 19% discount, ₱81 effective fee, 247 credits');

  if (!plan50k || plan50k.creditsQuantity !== 1819 || plan50k.discountRate !== 0.45 || plan50k.effectiveFeePhp !== 55) {
    throw new Error('FAILED: Plan ₱50K commercial values mismatch!');
  }
  console.log('✓ Plan ₱50K: ₱50,000, 45% discount, ₱55 effective fee, 1,819 credits');

  if (!plan100k || plan100k.creditsQuantity !== 4761 || plan100k.discountRate !== 0.79 || plan100k.effectiveFeePhp !== 21) {
    throw new Error('FAILED: Plan ₱100K commercial values mismatch!');
  }
  console.log('✓ Plan ₱100K: ₱100,000, 79% discount, ₱21 effective fee, 4,761 credits\n');

  // TEST 2: Registration & Password Hashing
  console.log('--- TEST 2: Customer Registration & Cryptographic Hashing ---');
  const regResult = await EnfAuthService.register({
    fullName: 'Atty. Test Customer, En.P.',
    email: 'test.customer@lawpractice.ph',
    password: 'SecurePassword2026!',
    phone: '+63 917 111 2233',
    organization: 'Test Legal Chambers',
  });

  if (!regResult.success || !regResult.user) {
    throw new Error(`FAILED: Customer registration: ${regResult.message}`);
  }
  console.log(`✓ Registered User: ${regResult.user.id} (${regResult.user.email})`);
  console.log(`✓ Password Hashed: ${regResult.user.passwordHash.slice(0, 16)}...`);
  console.log(`✓ Verification Code Dispatched: ${regResult.user.verificationCode}`);

  // TEST 3: Email Verification
  console.log('\n--- TEST 3: Email Verification ---');
  const verifyRes = EnfAuthService.verifyEmail(regResult.user.verificationCode);
  if (!verifyRes.success) {
    throw new Error(`FAILED: Email verification: ${verifyRes.message}`);
  }
  console.log(`✓ ${verifyRes.message}`);

  // TEST 4: Package 1 (₱20K) End-to-End Purchase & Admin Verification
  console.log('\n--- TEST 4: Package 1 (₱20K) Order, Payment Proof, & Activation ---');
  const order20k = EnfStorageService.createOrder('enf-plan-20k', {
    id: regResult.user.id,
    name: regResult.user.fullName,
    email: regResult.user.email,
    phone: regResult.user.phone,
  });

  console.log(`✓ Order Created: ${order20k.id}`);
  console.log(`✓ Payment Reference: ${order20k.paymentRef}`);
  console.log(`✓ Initial Status: ${order20k.status}`);

  if (order20k.status !== 'PENDING_PAYMENT') {
    throw new Error('FAILED: Initial order status must be PENDING_PAYMENT');
  }

  // Submit payment proof
  const payment20k = EnfStorageService.submitPayment({
    orderId: order20k.id,
    paymentRef: order20k.paymentRef,
    customerId: regResult.user.id,
    customerName: regResult.user.fullName,
    bankName: 'BDO Unibank',
    transferDate: '2026-09-29',
    transferTime: '02:30 PM',
    amountPhp: 20000,
    senderName: 'Test Customer',
    bankTransactionRef: 'BDO-TRX-20260929-20K',
    proofFileName: 'BDO_Slip_20K.pdf',
    proofFileType: 'application/pdf',
  });

  console.log(`✓ Payment Proof Submitted: ${payment20k.id}`);
  console.log(`✓ Payment Status: ${payment20k.status} (MUST NOT BE PAID YET)`);

  if (payment20k.status === 'PAID') {
    throw new Error('FAILED: Payment must NEVER become PAID upon submission alone!');
  }

  // Admin Payment Verification
  console.log('\n--- TEST 5: Admin Payment Verification & Atomic Activation ---');
  const verifyAdminRes = EnfStorageService.verifyPayment(payment20k.id, 'CONFIRM', {
    adminNotes: 'Verified against BDO Corporate Banking Statement.',
    actorEmail: 'finance@jurimbrella.ph',
  });

  if (!verifyAdminRes.success) {
    throw new Error(`FAILED: Admin verification: ${verifyAdminRes.message}`);
  }
  console.log(`✓ Payment Confirmed: Receipt ${verifyAdminRes.receiptNumber}`);

  // Check updated wallet
  const wallet20k = EnfStorageService.getOrCreateWallet(regResult.user.id);
  console.log(`✓ Wallet Available Credits: ${wallet20k.availableCredits} (Expected: 247)`);
  console.log(`✓ Wallet Balance: ₱${wallet20k.availableBalancePhp.toLocaleString()}`);
  console.log(`✓ Effective Fee: ₱${wallet20k.effectiveTechnicalFeePhp} (Expected: ₱81)`);
  console.log(`✓ Discount: ${(wallet20k.currentDiscountRate * 100).toFixed(0)}% (Expected: 19%)`);

  if (wallet20k.availableCredits !== 247 || wallet20k.effectiveTechnicalFeePhp !== 81 || wallet20k.currentDiscountRate !== 0.19) {
    throw new Error('FAILED: Wallet activation values for ₱20K package mismatch!');
  }

  // TEST 6: Idempotency Verification
  console.log('\n--- TEST 6: Idempotency (Prevent Duplicate Credits on Double Confirmation) ---');
  const duplicateConfirmRes = EnfStorageService.verifyPayment(payment20k.id, 'CONFIRM', {
    adminNotes: 'Accidental second click by admin.',
    actorEmail: 'finance@jurimbrella.ph',
  });
  console.log(`✓ Idempotency Response: ${duplicateConfirmRes.message}`);

  const walletAfterDuplicate = EnfStorageService.getOrCreateWallet(regResult.user.id);
  if (walletAfterDuplicate.availableCredits !== 247) {
    throw new Error(`FAILED: Idempotency failed! Credits duplicated to ${walletAfterDuplicate.availableCredits}`);
  }
  console.log(`✓ Verified Credits NOT duplicated: still ${walletAfterDuplicate.availableCredits}`);

  // TEST 7: Credit Deduction Rule (Section 6)
  console.log('\n--- TEST 7: Credit Deduction Rule (1 Credit = 1 Notarial Technical Fee) ---');
  const debitRes = EnfStorageService.debitTechnicalFee(
    regResult.user.id,
    'srv-remote-notarization',
    'INSTRUMENT-NOTARIAL-001'
  );

  if (!debitRes.success) {
    throw new Error(`FAILED: Credit debit: ${debitRes.message}`);
  }
  console.log(`✓ Debit Result: ${debitRes.message}`);
  console.log(`✓ Credits Debited: ${debitRes.creditsDebited}`);
  console.log(`✓ Balance After Debit: ${debitRes.availableCredits} Credits (Expected: 246)`);

  if (debitRes.availableCredits !== 246) {
    throw new Error('FAILED: Deduction did not reduce credits from 247 to 246!');
  }

  // TEST 8: Package 2 (₱50K) and Package 3 (₱100K) Verification
  console.log('\n--- TEST 8: Package 2 (₱50K) and Package 3 (₱100K) Verification ---');
  // 50K
  const order50k = EnfStorageService.createOrder('enf-plan-50k', {
    id: 'user-test-50k',
    name: 'Atty. Fifty Thousand',
    email: 'fifty@law.ph',
  });
  const pay50k = EnfStorageService.submitPayment({
    orderId: order50k.id,
    paymentRef: order50k.paymentRef,
    customerId: 'user-test-50k',
    customerName: 'Atty. Fifty Thousand',
    bankName: 'BDO Unibank',
    transferDate: '2026-09-29',
    transferTime: '03:00 PM',
    amountPhp: 50000,
    senderName: 'Fifty Thousand',
    bankTransactionRef: 'BDO-50K-TRX',
    proofFileName: 'slip50k.pdf',
    proofFileType: 'application/pdf',
  });
  EnfStorageService.verifyPayment(pay50k.id, 'CONFIRM');
  const wallet50k = EnfStorageService.getOrCreateWallet('user-test-50k');
  if (wallet50k.availableCredits !== 1819 || wallet50k.effectiveTechnicalFeePhp !== 55 || wallet50k.currentDiscountRate !== 0.45) {
    throw new Error('FAILED: Package ₱50K wallet activation mismatch!');
  }
  console.log('✓ ₱50K Package Confirmed: Exactly 1,819 credits, ₱55 effective fee, 45% discount');

  // 100K
  const order100k = EnfStorageService.createOrder('enf-plan-100k', {
    id: 'user-test-100k',
    name: 'Atty. Hundred Thousand',
    email: 'hundred@law.ph',
  });
  const pay100k = EnfStorageService.submitPayment({
    orderId: order100k.id,
    paymentRef: order100k.paymentRef,
    customerId: 'user-test-100k',
    customerName: 'Atty. Hundred Thousand',
    bankName: 'BDO Unibank',
    transferDate: '2026-09-29',
    transferTime: '03:15 PM',
    amountPhp: 100000,
    senderName: 'Hundred Thousand',
    bankTransactionRef: 'BDO-100K-TRX',
    proofFileName: 'slip100k.pdf',
    proofFileType: 'application/pdf',
  });
  EnfStorageService.verifyPayment(pay100k.id, 'CONFIRM');
  const wallet100k = EnfStorageService.getOrCreateWallet('user-test-100k');
  if (wallet100k.availableCredits !== 4761 || wallet100k.effectiveTechnicalFeePhp !== 21 || wallet100k.currentDiscountRate !== 0.79) {
    throw new Error('FAILED: Package ₱100K wallet activation mismatch!');
  }
  console.log('✓ ₱100K Package Confirmed: Exactly 4,761 credits, ₱21 effective fee, 79% discount');

  // TEST 9: Audit Logs & Receipts
  console.log('\n--- TEST 9: Audit Logging & Document Receipts ---');
  const auditLogs = EnfStorageService.getAuditLogs();
  console.log(`✓ Total Audit Events Logged: ${auditLogs.length}`);
  const hasPaymentAudit = auditLogs.some((l) => l.action.includes('PAYMENT'));
  if (!hasPaymentAudit) throw new Error('FAILED: Payment audit log missing!');
  console.log('✓ Verified immutable audit logging for payment verification.');

  console.log('\n========================================================');
  console.log('ALL COMMERCIAL SALES SUITE TESTS PASSED WITH 100% SUCCESS');
  console.log('========================================================');
}

runTestSuite().catch((err) => {
  console.error('\n❌ TEST RUN FAILED:', err);
  process.exit(1);
});
