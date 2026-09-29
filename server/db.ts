import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, '../.data');
const DB_FILE = path.join(DATA_DIR, 'jurimbrella_db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export type ENFRole =
  | 'CLIENT'
  | 'ENF_OWNER'
  | 'NOTARY'
  | 'STAFF'
  | 'SUPPORT'
  | 'ENF_MANAGER'
  | 'FINANCE'
  | 'ADMIN'
  | 'SUPER_ADMIN';

export interface UserRecord {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  passwordHash: string;
  salt: string;
  role: ENFRole;
  organization: string;
  professionalInfo: string;
  emailVerified: boolean;
  verificationCode?: string;
  accountStatus: 'PENDING_EMAIL_VERIFICATION' | 'ACTIVE' | 'SUSPENDED';
  resetToken?: string;
  resetTokenExpires?: string;
  twoFactorEnabled: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

export interface SessionRecord {
  token: string;
  userId: string;
  email: string;
  role: ENFRole;
  fullName: string;
  createdAt: string;
  expiresAt: string;
}

export interface PlanRecord {
  id: string;
  name: string;
  tier: string;
  tierLabel: string;
  pricePhp: number;
  creditAmountPhp: number;
  discountRate: number;
  baseFeePhp: number;
  effectiveFeePhp: number;
  creditsQuantity: number;
  headline: string;
  description: string;
  features: string[];
  termsVersion: string;
  isActive: boolean;
}

export interface OrderRecord {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  planId: string;
  planName: string;
  amountPhp: number;
  creditAmountPhp: number;
  discountRate: number;
  tierLabel: string;
  baseFeePhp: number;
  effectiveFeePhp: number;
  creditsQuantity: number;
  paymentRef: string;
  termsVersion: string;
  status:
    | 'PENDING_PAYMENT'
    | 'PAYMENT_SUBMITTED'
    | 'UNDER_REVIEW'
    | 'REQUIRES_INFORMATION'
    | 'PAID'
    | 'ACTIVATED'
    | 'REJECTED'
    | 'CANCELLED'
    | 'REFUND_PENDING'
    | 'REFUNDED';
  createdAt: string;
  updatedAt: string;
  paidAt?: string;
  activatedAt?: string;
  rejectionReason?: string;
  informationRequested?: string;
}

export interface PaymentRecord {
  id: string;
  orderId: string;
  paymentRef: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  bankName: string;
  transferDate: string;
  transferTime: string;
  amountPhp: number;
  senderName: string;
  bankTransactionRef: string;
  proofFileName: string;
  proofFileType: string;
  proofFileDataUrl?: string;
  submittedAt: string;
  status: 'PAYMENT_SUBMITTED' | 'UNDER_REVIEW' | 'PAID' | 'REJECTED' | 'REQUIRES_INFORMATION';
  verifiedAt?: string;
  verifiedBy?: string;
  receiptNumber?: string;
  adminNotes?: string;
  informationRequested?: string;
}

export interface WalletRecord {
  id: string;
  userId: string;
  ownerName: string;
  ownerEmail: string;
  availableBalancePhp: number;
  totalPurchasedPhp: number;
  totalUsedPhp: number;
  availableCredits: number;
  creditsUsed: number;
  originalCredits: number;
  developmentTier: string;
  discountRate: number;
  baseFeePhp: number;
  effectiveTechnicalFeePhp: number;
  status: 'ACTIVE' | 'SUSPENDED';
  lastUpdated: string;
}

export interface LedgerRecord {
  id: string;
  walletId: string;
  userId: string;
  orderId?: string;
  type: 'CREDIT' | 'DEBIT' | 'ADJUSTMENT' | 'REFUND' | 'REVERSAL';
  amountPhp: number;
  creditsDebited?: number;
  creditsBalanceBefore: number;
  creditsBalanceAfter: number;
  serviceName: string;
  referenceCode: string;
  timestamp: string;
  status: 'COMPLETED' | 'PENDING' | 'REVERSED';
  actorEmail?: string;
  notes?: string;
}

export interface ReceiptRecord {
  id: string;
  receiptNumber: string;
  orderId: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  planName: string;
  purchaseAmountPhp: number;
  paymentRef: string;
  paymentDate: string;
  creditsIssued: number;
  discountRate: number;
  effectiveTechnicalFeePhp: number;
  paymentStatus: string;
  verifiedBy: string;
  issuedAt: string;
}

export interface AuditRecord {
  id: string;
  actorId: string;
  actorEmail: string;
  actorRole: string;
  action: string;
  targetType: string;
  targetId: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  timestamp: string;
}

export interface NotificationRecord {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  read: boolean;
  link?: string;
  timestamp: string;
}

export interface DatabaseSchema {
  users: UserRecord[];
  sessions: SessionRecord[];
  plans: PlanRecord[];
  orders: OrderRecord[];
  payments: PaymentRecord[];
  wallets: WalletRecord[];
  ledger: LedgerRecord[];
  receipts: ReceiptRecord[];
  profiles: Record<string, Record<string, unknown>>;
  configs: Record<string, Record<string, unknown>>;
  documents: Array<{
    id: string;
    ownerId: string;
    title: string;
    category: string;
    fileSizeBytes: number;
    fileType: string;
    version: number;
    sha256Hash: string;
    uploadedBy: string;
    status: string;
    createdAt: string;
  }>;
  research: Array<{
    id: string;
    userId: string;
    topic: string;
    query: string;
    analysisText: string;
    citations: Array<{ source: string; title: string; date: string; citation: string; provision: string }>;
    saved: boolean;
    createdAt: string;
  }>;
  auditLogs: AuditRecord[];
  notifications: NotificationRecord[];
  bankConfig: {
    bankName: string;
    accountName: string;
    accountNumber: string;
    branch: string;
    instructions: string;
    referenceFormat: string;
    paymentTerms: string;
    supportEmail: string;
    supportPhone: string;
  };
}

// Scrypt password hashing
export function hashPassword(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}

export function verifyPassword(password: string, salt: string, storedHash: string): boolean {
  const hash = hashPassword(password, salt);
  const a = Buffer.from(hash, 'hex');
  const b = Buffer.from(storedHash, 'hex');
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

// Seed data definitions
const SEED_SALT_ADMIN = 'jm_salt_sec_admin_2026';
const SEED_SALT_FINANCE = 'jm_salt_sec_fin_2026';
const SEED_SALT_SUPERADMIN = 'jm_salt_sec_super_2026';
const SEED_SALT_SANTOS = 'jm_salt_sec_santos_2026';

const INITIAL_PLANS: PlanRecord[] = [
  {
    id: 'enf-20k',
    name: 'ENF ₱20K',
    tier: 'STARTER',
    tierLabel: '₱20K',
    pricePhp: 20000,
    creditAmountPhp: 20000,
    discountRate: 0.19, // 19%
    baseFeePhp: 100,
    effectiveFeePhp: 81,
    creditsQuantity: 247,
    headline: '19% Discount • ₱81 Effective Fee • 247 Credits',
    description: 'Entry-tier development access for solo practitioners and independent electronic notaries public.',
    features: [
      '247 Credits included (₱20,000 prepaid value)',
      '19% applicable technical-fee discount',
      '₱81 effective technical fee (Base fee ₱100)',
      '1 credit per online notarial technical service',
      '₱0 setup fee for onboarding',
      'Custom ENF subdomain & branded client intake portal',
      'AI-assisted Supreme Court legal research',
    ],
    termsVersion: 'v2026.1-SC-AM241014',
    isActive: true,
  },
  {
    id: 'enf-50k',
    name: 'ENF ₱50K',
    tier: 'GROWTH',
    tierLabel: '₱50K',
    pricePhp: 50000,
    creditAmountPhp: 50000,
    discountRate: 0.45, // 45%
    baseFeePhp: 100,
    effectiveFeePhp: 55,
    creditsQuantity: 1819,
    headline: '45% Discount • ₱55 Effective Fee • 1,819 Credits',
    description: 'Designed for active notarial offices, law partnerships, and corporate legal operations.',
    features: [
      '1,819 Credits included (₱50,000 prepaid value)',
      '45% applicable technical-fee discount',
      '₱55 effective technical fee (Base fee ₱100)',
      '1 credit per online notarial technical service',
      '₱0 setup fee for onboarding',
      'Custom logo, brand colors & bespoke document seals',
      'Full staff delegation (ENP Assistant workflow)',
      'Unlimited AI Philippine legal research queries',
    ],
    termsVersion: 'v2026.1-SC-AM241014',
    isActive: true,
  },
  {
    id: 'enf-100k',
    name: 'ENF ₱100K',
    tier: 'ENTERPRISE',
    tierLabel: '₱100K',
    pricePhp: 100000,
    creditAmountPhp: 100000,
    discountRate: 0.79, // 79%
    baseFeePhp: 100,
    effectiveFeePhp: 21,
    creditsQuantity: 4761,
    headline: '79% Discount • ₱21 Effective Fee • 4,761 Credits',
    description: 'Maximum cost reduction for large law firms, banking institutions, and institutional legal departments.',
    features: [
      '4,761 Credits included (₱100,000 prepaid value)',
      '79% applicable technical-fee discount',
      '₱21 effective technical fee (Base fee ₱100)',
      '1 credit per online notarial technical service',
      '₱0 setup fee for onboarding',
      'Dedicated integration architect & technical onboarding engineer',
      'Role-based staff permissions, DPO audit trail & Court Auditor access',
      'Automated nightly hash escrow & forensic backup to cloud storage',
    ],
    termsVersion: 'v2026.1-SC-AM241014',
    isActive: true,
  },
];

const INITIAL_BANK_CONFIG = {
  bankName: 'Banco de Oro (BDO Unibank, Inc.)',
  accountName: 'JURIMBRELLA LEGAL TECHNOLOGY CORP.',
  accountNumber: '0068-1802-9941',
  branch: 'Ortigas Center Corporate Tower Branch, Pasig City',
  instructions:
    'Please transfer the exact order amount via Online Banking (InstaPay / PESONet) or Over-the-counter deposit. Include your generated Payment Reference in the transfer memo or notes. Upload your transfer screenshot or bank validated deposit slip.',
  referenceFormat: 'ENF-2026-XXXXXX',
  paymentTerms:
    'Payment verification is completed within 1 to 3 hours during banking days (8:00 AM – 6:00 PM PHT). Official receipt and credits are issued immediately upon administrative approval.',
  supportEmail: 'finance@jurimbrella.ph',
  supportPhone: '+63 (2) 8892-4821',
};

const INITIAL_USERS: UserRecord[] = [
  {
    id: 'user-admin-1',
    fullName: 'JuriMbrella Platform Administrator',
    email: 'admin@jurimbrella.ph',
    phone: '+63 2 8892 4821',
    passwordHash: hashPassword('Admin2026!', SEED_SALT_ADMIN),
    salt: SEED_SALT_ADMIN,
    role: 'ADMIN',
    organization: 'JuriMbrella Platform Operations',
    professionalInfo: 'Roll No. 58190 / Supreme Court ENF Compliance Oversight',
    emailVerified: true,
    accountStatus: 'ACTIVE',
    twoFactorEnabled: true,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'user-finance-1',
    fullName: 'Rowena Garcia (Treasury & Finance Officer)',
    email: 'finance@jurimbrella.ph',
    phone: '+63 2 8892 4822',
    passwordHash: hashPassword('Finance2026!', SEED_SALT_FINANCE),
    salt: SEED_SALT_FINANCE,
    role: 'FINANCE',
    organization: 'JuriMbrella Treasury & Finance',
    professionalInfo: 'CPA Reg No. 109284 / Financial Verification Desk',
    emailVerified: true,
    accountStatus: 'ACTIVE',
    twoFactorEnabled: true,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'user-superadmin-1',
    fullName: 'JuriMbrella Executive Director',
    email: 'superadmin@jurimbrella.ph',
    phone: '+63 2 8892 4820',
    passwordHash: hashPassword('SuperAdmin2026!', SEED_SALT_SUPERADMIN),
    salt: SEED_SALT_SUPERADMIN,
    role: 'SUPER_ADMIN',
    organization: 'JuriMbrella Legal Technology Corp.',
    professionalInfo: 'Roll No. 41920 / Board of Directors',
    emailVerified: true,
    accountStatus: 'ACTIVE',
    twoFactorEnabled: true,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'user-santos-1',
    fullName: 'Atty. Maria Elena Santos, En.P.',
    email: 'atty.santos@santoslaw.ph',
    phone: '+63 917 555 4921',
    passwordHash: hashPassword('Santos2026!', SEED_SALT_SANTOS),
    salt: SEED_SALT_SANTOS,
    role: 'ENF_OWNER',
    organization: 'Santos & Associates Law Chambers',
    professionalInfo: 'Roll of Attorneys No. 67890 / IBP Makati Chapter / Notarial Commission No. 2026-042',
    emailVerified: true,
    accountStatus: 'ACTIVE',
    twoFactorEnabled: false,
    createdAt: '2026-01-15T08:00:00.000Z',
  },
];

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.load();
  }

  private load(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        return {
          users: parsed.users || INITIAL_USERS,
          sessions: parsed.sessions || [],
          plans: parsed.plans || INITIAL_PLANS,
          orders: parsed.orders || [],
          payments: parsed.payments || [],
          wallets: parsed.wallets || [],
          ledger: parsed.ledger || [],
          receipts: parsed.receipts || [],
          profiles: parsed.profiles || {},
          configs: parsed.configs || {},
          documents: parsed.documents || [],
          research: parsed.research || [],
          auditLogs: parsed.auditLogs || [],
          notifications: parsed.notifications || [],
          bankConfig: parsed.bankConfig || INITIAL_BANK_CONFIG,
        };
      }
    } catch (e) {
      console.error('Error loading DB file, reinitializing:', e);
    }

    const initialDb: DatabaseSchema = {
      users: INITIAL_USERS,
      sessions: [],
      plans: INITIAL_PLANS,
      orders: [],
      payments: [],
      wallets: [],
      ledger: [],
      receipts: [],
      profiles: {},
      configs: {},
      documents: [],
      research: [],
      auditLogs: [],
      notifications: [],
      bankConfig: INITIAL_BANK_CONFIG,
    };
    this.saveData(initialDb);
    return initialDb;
  }

  private saveData(data: DatabaseSchema): void {
    const tempFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  }

  public save(): void {
    this.saveData(this.data);
  }

  public get users() {
    return this.data.users;
  }

  public get sessions() {
    return this.data.sessions;
  }

  public invalidateUserSessions(userId: string): void {
    this.data.sessions = this.data.sessions.filter((s) => s.userId !== userId);
  }

  public get plans() {
    return this.data.plans;
  }

  public get orders() {
    return this.data.orders;
  }

  public get payments() {
    return this.data.payments;
  }

  public get wallets() {
    return this.data.wallets;
  }

  public get ledger() {
    return this.data.ledger;
  }

  public get receipts() {
    return this.data.receipts;
  }

  public get profiles() {
    return this.data.profiles;
  }

  public get configs() {
    return this.data.configs;
  }

  public get documents() {
    return this.data.documents;
  }

  public get research() {
    return this.data.research;
  }

  public get auditLogs() {
    return this.data.auditLogs;
  }

  public get notifications() {
    return this.data.notifications;
  }

  public get bankConfig() {
    return this.data.bankConfig;
  }
}

export const db = new Database();
