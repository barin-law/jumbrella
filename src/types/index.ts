/**
 * JuriMbrella — Philippine Electronic Notarization
 * Core Domain Types & Compliance Schemas
 * Compliant with Supreme Court A.M. No. 24-10-14-SC, R.A. 8792, and R.A. 10173
 */

export type UserRole =
  | 'PRINCIPAL'
  | 'WITNESS'
  | 'ORG_REQUESTER'
  | 'ORG_ADMIN'
  | 'ENP'
  | 'ENP_ASSISTANT'
  | 'COMPLIANCE_REVIEWER'
  | 'DPO'
  | 'SECOPS_ANALYST'
  | 'FINANCE_OFFICER'
  | 'SUPPORT_AGENT'
  | 'ENF_ADMIN'
  | 'INTERNAL_AUDITOR'
  | 'COURT_AUDITOR';

export type AdapterState =
  | 'NOT_CONFIGURED'
  | 'DEMO'
  | 'CONNECTING'
  | 'OPERATIONAL'
  | 'DEGRADED'
  | 'UNAVAILABLE'
  | 'ERROR';

export interface IntegrationAdapter {
  id: string;
  provider: string;
  capability: string;
  environment: 'DEMO / CANDIDATE' | 'STAGING' | 'PRODUCTION';
  status: AdapterState;
  lastHealthCheck: string;
  lastSuccessfulRequest?: string;
  errorStatus?: string;
  requiredEnvVars: string[];
  docLink: string;
  auditHistoryCount: number;
  description: string;
}

export interface RoleInfo {
  role: UserRole;
  label: string;
  description: string;
  category: 'Parties' | 'Notarial Office' | 'Governance & Security' | 'Operations';
}

export type TransactionState =
  | 'DRAFT'
  | 'UPLOADED_QUARANTINED'
  | 'SCAN_FAILED'
  | 'INTAKE_REVIEW'
  | 'NEEDS_INFORMATION'
  | 'IDENTITY_PENDING'
  | 'IDENTITY_REVIEW'
  | 'ENP_REVIEW'
  | 'SCHEDULED'
  | 'IN_SESSION'
  | 'INTERRUPTED'
  | 'AWAITING_ENP_DECISION'
  | 'REFUSED'
  | 'AWAITING_ENP_SEAL'
  | 'REGULATORY_SUBMISSION_PENDING'
  | 'COMPLETED'
  | 'ARCHIVED'
  | 'CANCELLED';

export type NotarizationMode = 'IEN' | 'REN';

export type NotarialAct =
  | 'ACKNOWLEDGMENT'
  | 'JURAT'
  | 'OATH_AFFIRMATION'
  | 'SIGNATURE_WITNESSING'
  | 'COPY_CERTIFICATION';

export type AccreditationStatus =
  | 'CANDIDATE'
  | 'PENDING'
  | 'ACCREDITED'
  | 'SUSPENDED'
  | 'EXPIRED'
  | 'REVOKED';

export type AuditSeverity = 'INFO' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface AuditEvent {
  id: string;
  timestamp: string;
  actor: {
    uid: string;
    name: string;
    role: UserRole;
    email: string;
  };
  action: string;
  resource: string;
  resourceId?: string;
  severity: AuditSeverity;
  ipAddress: string;
  userAgent: string;
  location?: string;
  prevHash: string;
  hash: string;
  tamperVerified?: boolean;
  metadata?: Record<string, unknown>;
}

export type ThreatType =
  | 'IMPOSSIBLE_TRAVEL'
  | 'FAILED_MFA_BRUTE_FORCE'
  | 'UNAUTHORIZED_ROLE_ESCALATION'
  | 'MALWARE_DETECTED'
  | 'SIGNATURE_HASH_MISMATCH'
  | 'RATE_LIMIT_EXCEEDED'
  | 'UNAUTHORIZED_EXPORT_ATTEMPT';

export interface ThreatAlert {
  id: string;
  timestamp: string;
  title: string;
  type: ThreatType;
  severity: AuditSeverity;
  details: string;
  status: 'ACTIVE' | 'INVESTIGATING' | 'CONTAINED' | 'RESOLVED';
  ip: string;
  location: string;
  targetUser: string;
  dispatchedChannels: Array<'EMAIL' | 'SLACK' | 'PUSH'>;
}

export interface Participant {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'PRINCIPAL' | 'WITNESS';
  idType: 'PHILIPPINE_PASSPORT' | 'UMID' | 'NATIONAL_ID_PHILSYS' | 'DRIVERS_LICENSE' | 'PRC_ID';
  idNumberRedacted: string;
  identityVerified: boolean;
  livenessConfidenceScore: number;
  locationDisclosed: string;
  presenceStatus: 'OFFLINE' | 'WAITING_ROOM' | 'IN_SESSION' | 'DISCONNECTED';
  signedAt?: string;
  signatureHash?: string;
}

export interface NotarizationRequest {
  id: string;
  referenceNumber: string;
  title: string;
  documentType: string;
  mode: NotarizationMode;
  notarialAct: NotarialAct;
  state: TransactionState;
  requester: {
    name: string;
    email: string;
    orgName?: string;
  };
  participants: Participant[];
  document: {
    originalFilename: string;
    fileSize: number;
    originalSha256: string;
    pdfaSha256: string;
    quarantineStatus: 'QUARANTINED' | 'CLEARED' | 'BLOCKED_INFECTED' | 'SCANNER_UNAVAILABLE';
    scanProvider: string;
    scanTimestamp: string;
    pagesCount: number;
    isEncryptedPdf: boolean;
    integrityVerified: boolean;
  };
  enp?: {
    uid: string;
    name: string;
    commissionNo: string;
    commissionJurisdiction: string;
    commissionExpiry: string;
    digitalSealSerial: string;
  };
  appointment?: {
    scheduledStart: string;
    scheduledEnd: string;
    meetingUrl?: string;
    videoProviderStatus: 'ACTIVE' | 'PENDING_SPECIFICATION';
  };
  sessionRecording?: {
    recordingHash: string;
    durationSeconds: number;
    sealedEvidenceUrl?: string;
  };
  notarialBookEntry?: {
    bookNo: number;
    pageNo: number;
    docNo: number;
    seriesYear: number;
    entryHash: string;
    entryTimestamp: string;
    committedByEnp: string;
  };
  refusalReason?: string;
  refusalTimestamp?: string;
  refusalLegalBasis?: string;
  regulatoryReceipt?: {
    status: 'SUBMITTED' | 'ACKNOWLEDGED' | 'AWAITING_SPECIFICATION' | 'AWAITING_OFFICIAL_SPECIFICATION';
    transactionNumber: string;
    submittedAt: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AuthoritativeRequirement {
  id: string;
  source: string;
  section: string;
  requirement: string;
  counselInterpretation: string;
  affectedWorkflow: string;
  technicalControl: string;
  accountableOwner: string;
  status: 'IMPLEMENTED' | 'AWAITING_OFFICIAL_SPECIFICATION' | 'UNDER_AUDIT';
  testEvidence: string;
  lastReviewDate: string;
}

export interface SecurityNotificationConfig {
  emailAlertsEnabled: boolean;
  alertEmailRecipient: string;
  slackAlertsEnabled: boolean;
  slackWebhookConfigured: boolean;
  pushNotificationsEnabled: boolean;
  failedLoginThreshold: number;
  impossibleTravelKmThreshold: number;
  notifyOnCriticalOnly: boolean;
  autoQuarantineOnThreat: boolean;
}

export interface UnitTestCase {
  id: string;
  suite: string;
  name: string;
  description: string;
  testFile?: string;
  assertion?: string;
  productionControlTested?: string;
  mockDependency?: string;
  limitation?: string;
  status: 'PENDING' | 'PASSED' | 'FAILED';
  durationMs?: number;
  assertionMessage?: string;
  run: () => Promise<{ passed: boolean; message: string }>;
}
