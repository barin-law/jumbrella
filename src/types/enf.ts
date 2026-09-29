/**
 * JuriMbrella — Electronic Notarial Facility (ENF) Development & Prepaid Access Platform
 * Data Models & Type Definitions
 */

export type ENFPlanTier = 'STARTER' | 'GROWTH' | 'ENTERPRISE' | 'CUSTOM';

export interface ENFPlan {
  id: string;
  name: string;
  tier: ENFPlanTier;
  pricePhp: number;
  creditAmountPhp: number;
  discountRate: number; // e.g. 0.19 for 19%, 0.45 for 45%, 0.79 for 79%
  headline: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  isActive: boolean;
  termsVersion: string;
}

export type ENFOrderStatus =
  | 'DRAFT'
  | 'PENDING_PAYMENT'
  | 'PAYMENT_SUBMITTED'
  | 'UNDER_REVIEW'
  | 'PAID'
  | 'ACTIVATED'
  | 'COMPLETED'
  | 'REQUIRES_INFORMATION'
  | 'REJECTED'
  | 'CANCELLED'
  | 'REFUND_PENDING'
  | 'REFUNDED';

export interface ENFOrder {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  planId: string;
  planName: string;
  amountPhp: number;
  creditAmountPhp: number;
  discountRate: number;
  paymentRef: string;
  termsVersion: string;
  status: ENFOrderStatus;
  createdAt: string;
  updatedAt: string;
  paidAt?: string;
  activatedAt?: string;
  rejectionReason?: string;
  informationRequested?: string;
  notes?: string;
}

export type PaymentMethodType = 'MANUAL_BANK_TRANSFER' | 'ONLINE_BANKING' | 'QR_PH' | 'CARD';

export interface ENFBankConfig {
  bankName: string;
  accountName: string;
  accountNumber: string;
  branch: string;
  instructions: string;
  referenceFormat: string;
  paymentTerms: string;
  supportEmail: string;
  supportPhone: string;
}

export interface ENFPaymentSubmission {
  id: string;
  orderId: string;
  paymentRef: string;
  customerId: string;
  customerName: string;
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
  adminNotes?: string;
  informationRequested?: string;
  receiptNumber?: string;
}

export type ENFLedgerEntryType = 'CREDIT' | 'DEBIT' | 'ADJUSTMENT' | 'REFUND' | 'REVERSAL';

export interface ENFCreditLedgerEntry {
  id: string;
  walletId: string;
  userId: string;
  orderId?: string;
  type: ENFLedgerEntryType;
  amountPhp: number;
  balanceBeforePhp: number;
  balanceAfterPhp: number;
  serviceName: string;
  discountAppliedRate: number;
  referenceCode: string;
  timestamp: string;
  status: 'COMPLETED' | 'PENDING' | 'REVERSED';
  notes?: string;
  actorEmail?: string;
}

export interface ENFCreditWallet {
  id: string;
  userId: string;
  ownerName: string;
  ownerEmail: string;
  availableBalancePhp: number;
  totalPurchasedPhp: number;
  totalUsedPhp: number;
  currentDiscountRate: number;
  status: 'ACTIVE' | 'SUSPENDED' | 'FROZEN';
  lastUpdated: string;
}

export interface ENFCustomerProfile {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  rollNumber?: string;
  ibpChapter?: string;
  commissionNumber?: string;
  jurisdictionProvince?: string;
  jurisdictionCity?: string;
  officeName: string;
  officeAddress: string;
  organizationName?: string;
  organizationType?: string;
  practiceAreas: string[];
  expectedMonthlyNotarizations: string;
  teamSize: string;
  selectedServices: string[];
  onboardingStep: number;
  onboardingCompleted: boolean;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ENFConfiguration {
  id: string;
  ownerId: string;
  facilityName: string;
  domainSlug: string;
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  documentHeaderTemplate: string;
  customLegalFooter: string;
  allowedServices: string[];
  workflowStage: 'DEVELOPMENT' | 'SANDBOX_TESTING' | 'INTEGRATION_REVIEW' | 'PRODUCTION_ACTIVE';
  liveUrl?: string;
  clientPortalEnabled: boolean;
  smsAlertsEnabled: boolean;
  emailAlertsEnabled: boolean;
  twoFactorRequiredForClients: boolean;
  updatedAt: string;
}

export interface ENFClientRecord {
  id: string;
  ownerId: string;
  fullName: string;
  email: string;
  phone: string;
  organization?: string;
  status: 'ACTIVE' | 'PENDING_INVITATION' | 'ARCHIVED';
  totalInstrumentsNotarized: number;
  lastActivity: string;
  createdAt: string;
}

export type ENFDocumentCategory =
  | 'UPLOADS'
  | 'GENERATED'
  | 'COMPLETED'
  | 'ARCHIVED'
  | 'RECEIPTS'
  | 'PAYMENT_PROOF'
  | 'RESEARCH';

export interface ENFDocumentRecord {
  id: string;
  ownerId: string;
  clientId?: string;
  title: string;
  category: ENFDocumentCategory;
  fileSizeBytes: number;
  fileType: string;
  version: number;
  sha256Hash: string;
  downloadUrl?: string;
  uploadedBy: string;
  status: 'ACTIVE' | 'ARCHIVED' | 'PROTECTED';
  createdAt: string;
  auditTrail: Array<{
    action: string;
    timestamp: string;
    actor: string;
  }>;
}

export interface ENFCitation {
  source: string;
  title: string;
  date: string;
  citation: string;
  provision: string;
  sourceLink?: string;
}

export interface ENFResearchItem {
  id: string;
  userId: string;
  topic: string;
  query: string;
  analysisText: string;
  citations: ENFCitation[];
  saved: boolean;
  createdAt: string;
}

export type ENFSupportCategory =
  | 'Payment'
  | 'Account'
  | 'ENF Development'
  | 'Documents'
  | 'Technical'
  | 'Research'
  | 'Other';

export type ENFTicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type ENFTicketStatus = 'OPEN' | 'IN_PROGRESS' | 'WAITING_ON_CUSTOMER' | 'RESOLVED' | 'CLOSED';

export interface ENFSupportMessage {
  id: string;
  sender: 'CUSTOMER' | 'SUPPORT_AGENT';
  senderName: string;
  text: string;
  attachmentName?: string;
  timestamp: string;
}

export interface ENFSupportTicket {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  category: ENFSupportCategory;
  priority: ENFTicketPriority;
  status: ENFTicketStatus;
  subject: string;
  messages: ENFSupportMessage[];
  assignedStaff?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ENFAuditLogRecord {
  id: string;
  actorId: string;
  actorEmail: string;
  actorRole: string;
  action: string;
  targetType: string;
  targetId: string;
  details: Record<string, any>;
  ipAddress: string;
  timestamp: string;
}

export interface ENFNotificationRecord {
  id: string;
  userId: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ALERT';
  title: string;
  message: string;
  read: boolean;
  link?: string;
  timestamp: string;
}

export interface ENFTechnicalFeeEngineConfig {
  baseFeePhp: number;
  minimumFeePhp: number;
  availableServices: Array<{
    serviceId: string;
    serviceName: string;
    baseFeePhp: number;
    description: string;
  }>;
}
