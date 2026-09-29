import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, '../.data');
const DB_FILE = path.join(DATA_DIR, 'jurimbrella_db.json');
const OUTPUT_SQL_FILE = path.resolve(__dirname, 'migration_data.sql');

function escapeSql(val: any): string {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
  if (typeof val === 'number') return val.toString();
  if (typeof val === 'object') return `'${JSON.stringify(val).replace(/'/g, "''")}'::jsonb`;
  return `'${val.toString().replace(/'/g, "''")}'`;
}

export function runMigration() {
  console.log('--- JuriMbrella Database Migration Utility ---');

  if (!fs.existsSync(DB_FILE)) {
    console.log(`No local JSON database found at ${DB_FILE}. Migration not required.`);
    return;
  }

  const raw = fs.readFileSync(DB_FILE, 'utf-8');
  let data: any;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse database file:', e);
    return;
  }

  const sqlStatements: string[] = [
    '-- JuriMbrella Exported Production Migration Data',
    '-- Generated: ' + new Date().toISOString(),
    'BEGIN;',
    '',
  ];

  // 1. Users
  if (Array.isArray(data.users)) {
    for (const u of data.users) {
      sqlStatements.push(
        `INSERT INTO users (id, full_name, email, phone, password_hash, salt, role, organization, professional_info, email_verified, verification_code, account_status, two_factor_enabled, created_at) ` +
        `VALUES (${escapeSql(u.id)}, ${escapeSql(u.fullName)}, ${escapeSql(u.email)}, ${escapeSql(u.phone)}, ${escapeSql(u.passwordHash)}, ${escapeSql(u.salt)}, ${escapeSql(u.role)}, ${escapeSql(u.organization)}, ${escapeSql(u.professionalInfo)}, ${escapeSql(u.emailVerified)}, ${escapeSql(u.verificationCode)}, ${escapeSql(u.accountStatus)}, ${escapeSql(u.twoFactorEnabled)}, ${escapeSql(u.createdAt)}) ` +
        `ON CONFLICT (email) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, password_hash = EXCLUDED.password_hash;`
      );
    }
  }

  // 2. Plans
  if (Array.isArray(data.plans)) {
    for (const p of data.plans) {
      sqlStatements.push(
        `INSERT INTO plans (id, name, tier, tier_label, price_php, credit_amount_php, discount_rate, base_fee_php, effective_fee_php, credits_quantity, headline, description, features, terms_version, is_active) ` +
        `VALUES (${escapeSql(p.id)}, ${escapeSql(p.name)}, ${escapeSql(p.tier)}, ${escapeSql(p.tierLabel)}, ${escapeSql(p.pricePhp)}, ${escapeSql(p.creditAmountPhp)}, ${escapeSql(p.discountRate)}, ${escapeSql(p.baseFeePhp)}, ${escapeSql(p.effectiveFeePhp)}, ${escapeSql(p.creditsQuantity)}, ${escapeSql(p.headline)}, ${escapeSql(p.description)}, ${escapeSql(p.features)}, ${escapeSql(p.termsVersion)}, ${escapeSql(p.isActive)}) ` +
        `ON CONFLICT (id) DO NOTHING;`
      );
    }
  }

  // 3. Orders
  if (Array.isArray(data.orders)) {
    for (const o of data.orders) {
      sqlStatements.push(
        `INSERT INTO orders (id, order_number, customer_id, customer_name, customer_email, customer_phone, plan_id, plan_name, amount_php, credit_amount_php, discount_rate, tier_label, base_fee_php, effective_fee_php, credits_quantity, payment_ref, terms_version, status, created_at, updated_at, paid_at, activated_at) ` +
        `VALUES (${escapeSql(o.id)}, ${escapeSql(o.orderNumber || o.id)}, ${escapeSql(o.customerId)}, ${escapeSql(o.customerName)}, ${escapeSql(o.customerEmail)}, ${escapeSql(o.customerPhone)}, ${escapeSql(o.planId)}, ${escapeSql(o.planName)}, ${escapeSql(o.amountPhp)}, ${escapeSql(o.creditAmountPhp)}, ${escapeSql(o.discountRate)}, ${escapeSql(o.tierLabel || '₱50K')}, ${escapeSql(o.baseFeePhp || 100)}, ${escapeSql(o.effectiveFeePhp || 55)}, ${escapeSql(o.creditsQuantity || 1819)}, ${escapeSql(o.paymentRef)}, ${escapeSql(o.termsVersion || 'v2026.1')}, ${escapeSql(o.status)}, ${escapeSql(o.createdAt)}, ${escapeSql(o.updatedAt)}, ${escapeSql(o.paidAt)}, ${escapeSql(o.activatedAt)}) ` +
        `ON CONFLICT (id) DO NOTHING;`
      );
    }
  }

  // 4. Payments
  if (Array.isArray(data.payments)) {
    for (const p of data.payments) {
      sqlStatements.push(
        `INSERT INTO payments (id, order_id, payment_ref, customer_id, customer_name, customer_email, bank_name, transfer_date, transfer_time, amount_php, sender_name, bank_transaction_ref, proof_file_name, proof_file_type, submitted_at, status, verified_at, verified_by, receipt_number, admin_notes) ` +
        `VALUES (${escapeSql(p.id)}, ${escapeSql(p.orderId)}, ${escapeSql(p.paymentRef)}, ${escapeSql(p.customerId)}, ${escapeSql(p.customerName)}, ${escapeSql(p.customerEmail)}, ${escapeSql(p.bankName)}, ${escapeSql(p.transferDate)}, ${escapeSql(p.transferTime)}, ${escapeSql(p.amountPhp)}, ${escapeSql(p.senderName)}, ${escapeSql(p.bankTransactionRef)}, ${escapeSql(p.proofFileName)}, ${escapeSql(p.proofFileType)}, ${escapeSql(p.submittedAt)}, ${escapeSql(p.status)}, ${escapeSql(p.verifiedAt)}, ${escapeSql(p.verifiedBy)}, ${escapeSql(p.receiptNumber)}, ${escapeSql(p.adminNotes)}) ` +
        `ON CONFLICT (id) DO NOTHING;`
      );
    }
  }

  // 5. Wallets
  if (Array.isArray(data.wallets)) {
    for (const w of data.wallets) {
      sqlStatements.push(
        `INSERT INTO wallets (id, user_id, owner_name, owner_email, available_balance_php, total_purchased_php, total_used_php, available_credits, credits_used, original_credits, development_tier, discount_rate, base_fee_php, effective_technical_fee_php, status, last_updated) ` +
        `VALUES (${escapeSql(w.id)}, ${escapeSql(w.userId)}, ${escapeSql(w.ownerName)}, ${escapeSql(w.ownerEmail)}, ${escapeSql(w.availableBalancePhp)}, ${escapeSql(w.totalPurchasedPhp)}, ${escapeSql(w.totalUsedPhp)}, ${escapeSql(w.availableCredits || 0)}, ${escapeSql(w.creditsUsed || 0)}, ${escapeSql(w.originalCredits || 0)}, ${escapeSql(w.developmentTier)}, ${escapeSql(w.discountRate || 0)}, ${escapeSql(w.baseFeePhp || 100)}, ${escapeSql(w.effectiveTechnicalFeePhp || 100)}, ${escapeSql(w.status)}, ${escapeSql(w.lastUpdated)}) ` +
        `ON CONFLICT (user_id) DO UPDATE SET available_credits = EXCLUDED.available_credits, total_purchased_php = EXCLUDED.total_purchased_php;`
      );
    }
  }

  // 6. Ledger
  if (Array.isArray(data.ledger)) {
    for (const l of data.ledger) {
      sqlStatements.push(
        `INSERT INTO credit_ledger (id, wallet_id, user_id, order_id, type, amount_php, credits_debited, credits_balance_before, credits_balance_after, service_name, reference_code, timestamp, status, actor_email, notes) ` +
        `VALUES (${escapeSql(l.id)}, ${escapeSql(l.walletId)}, ${escapeSql(l.userId)}, ${escapeSql(l.orderId)}, ${escapeSql(l.type)}, ${escapeSql(l.amountPhp)}, ${escapeSql(l.creditsDebited)}, ${escapeSql(l.creditsBalanceBefore || 0)}, ${escapeSql(l.creditsBalanceAfter || 0)}, ${escapeSql(l.serviceName)}, ${escapeSql(l.referenceCode)}, ${escapeSql(l.timestamp)}, ${escapeSql(l.status)}, ${escapeSql(l.actorEmail)}, ${escapeSql(l.notes)}) ` +
        `ON CONFLICT (id) DO NOTHING;`
      );
    }
  }

  // 7. Receipts
  if (Array.isArray(data.receipts)) {
    for (const r of data.receipts) {
      sqlStatements.push(
        `INSERT INTO receipts (id, receipt_number, order_id, order_number, customer_id, customer_name, customer_email, plan_name, purchase_amount_php, payment_ref, payment_date, credits_issued, discount_rate, effective_technical_fee_php, payment_status, verified_by, issued_at) ` +
        `VALUES (${escapeSql(r.id)}, ${escapeSql(r.receiptNumber)}, ${escapeSql(r.orderId)}, ${escapeSql(r.orderNumber || r.orderId)}, ${escapeSql(r.customerId)}, ${escapeSql(r.customerName)}, ${escapeSql(r.customerEmail)}, ${escapeSql(r.planName)}, ${escapeSql(r.purchaseAmountPhp)}, ${escapeSql(r.paymentRef)}, ${escapeSql(r.paymentDate)}, ${escapeSql(r.creditsIssued)}, ${escapeSql(r.discountRate)}, ${escapeSql(r.effectiveTechnicalFeePhp)}, ${escapeSql(r.paymentStatus)}, ${escapeSql(r.verifiedBy)}, ${escapeSql(r.issuedAt)}) ` +
        `ON CONFLICT (id) DO NOTHING;`
      );
    }
  }

  // 8. Audit Logs
  if (Array.isArray(data.auditLogs)) {
    for (const a of data.auditLogs) {
      sqlStatements.push(
        `INSERT INTO audit_logs (id, actor_id, actor_email, actor_role, action, target_type, target_id, details, ip_address, timestamp) ` +
        `VALUES (${escapeSql(a.id)}, ${escapeSql(a.actorId)}, ${escapeSql(a.actorEmail)}, ${escapeSql(a.actorRole)}, ${escapeSql(a.action)}, ${escapeSql(a.targetType)}, ${escapeSql(a.targetId)}, ${escapeSql(a.details)}, ${escapeSql(a.ipAddress)}, ${escapeSql(a.timestamp)}) ` +
        `ON CONFLICT (id) DO NOTHING;`
      );
    }
  }

  sqlStatements.push('COMMIT;', '');

  fs.writeFileSync(OUTPUT_SQL_FILE, sqlStatements.join('\n'), 'utf-8');
  console.log(`Successfully generated PostgreSQL migration SQL file at ${OUTPUT_SQL_FILE}`);
  console.log(`Total exported statements: ${sqlStatements.length}`);
}

if (process.argv[1] && process.argv[1].endsWith('migrate.ts')) {
  runMigration();
}
