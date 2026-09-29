/**
 * JuriMbrella — Philippine Electronic Notarization
 * Client & Principal Case Workflow Domain Types
 * Compliant with Supreme Court A.M. No. 24-10-14-SC, R.A. 8792, and R.A. 10173
 * Demonstration-Only Environment (APP_ENV=demo, DEMO_MODE=true)
 */

export type IdentityStatus =
  | 'NOT_STARTED'
  | 'CONSENT_REQUIRED'
  | 'IN_PROGRESS'
  | 'VERIFIED_DEMO'
  | 'PARTIAL_MATCH'
  | 'REVIEW_REQUIRED'
  | 'FAILED'
  | 'EXPIRED';

export type ParticipantRole =
  | 'PRINCIPAL'
  | 'SIGNER'
  | 'INSTRUMENT_WITNESS'
  | 'SUBSCRIBING_WITNESS'
  | 'AUTHORIZED_REPRESENTATIVE'
  | 'ORGANIZATION_REQUESTER'
  | 'INTERPRETER'
  | 'GUARDIAN'
  | 'ATTORNEY'
  | 'OTHER_AUTHORIZED_ROLE';

export type CaseParticipantRole = ParticipantRole;

export type ParticipantStatus =
  | 'INVITED'
  | 'CONSENT_PENDING'
  | 'IDENTITY_PENDING'
  | 'PENDING_REVIEW'
  | 'ACTIVE'
  | 'DECLINED'
  | 'REMOVED'
  | 'COMPLETED'
  | 'REVOKED';

export type IdentityRequirementLevel = 'NONE' | 'BASIC' | 'ENHANCED' | 'REVERIFY';

export interface CaseParticipant {
  caseParticipantId: string;
  caseId: string;
  internalPersonId: string;
  fullName: string;
  email: string;
  mobileNumber?: string;
  role: ParticipantRole;
  status: ParticipantStatus;
  authorizationRequestId: string;
  invitationId?: string;
  invitationToken?: string;
  invitationExpiresAt?: string;
  identityRequirement: IdentityRequirementLevel;
  consentRecordId?: string;
  relationshipToCase?: string;
  authorityDocumentId?: string;
  validFrom?: string;
  validUntil?: string;
  addedBy: string;
  approvedBy?: string;
  removalReason?: string;
  createdAt: string;
  updatedAt: string;
}

export type CaseStatus =
  | 'DRAFT'
  | 'ONBOARDING_PENDING'
  | 'IDENTITY_PENDING'
  | 'EVIDENCE_INTAKE'
  | 'LAWYER_REVIEW'
  | 'DOCUMENT_CORRECTION'
  | 'CLIENT_APPROVAL_PENDING'
  | 'READY_FOR_SIGNING'
  | 'CEREMONY_SCHEDULED'
  | 'IN_CEREMONY'
  | 'COMPLETED'
  | 'REFUSED'
  | 'WITHDRAWN'
  | 'ARCHIVED';

export type CaseFolderCategory =
  | 'Case Overview'
  | 'Identity and Authority'
  | 'Participants and Witnesses'
  | 'Primary Instruments'
  | 'Supporting Documents'
  | 'Correspondence'
  | 'Evidence'
  | 'Photographs'
  | 'Audio'
  | 'Video'
  | 'Testimonies'
  | 'Consultation Materials'
  | 'Corrections and Drafts'
  | 'Client Approvals'
  | 'Signing and Appearance'
  | 'Notarial Outputs'
  | 'Hash and QR Records'
  | 'Receipts and Downloads';

export interface CaseFolderMeta {
  id: CaseFolderCategory;
  label: string;
  description: string;
}

export const CASE_FOLDERS: CaseFolderMeta[] = [
  { id: 'Case Overview', label: '01. Case Overview', description: 'Intake sheet, matter summary, and case docket notes' },
  { id: 'Identity and Authority', label: '02. Identity & Authority', description: 'PhilSys credentials, IDs, board resolutions, and powers of attorney' },
  { id: 'Participants and Witnesses', label: '03. Participants & Witnesses', description: 'Witness declarations, authorization tokens, and contact verifications' },
  { id: 'Primary Instruments', label: '04. Primary Instruments', description: 'Deeds, affidavits, contracts, and instruments to be notarized' },
  { id: 'Supporting Documents', label: '05. Supporting Documents', description: 'Certificates of title, tax declarations, and corporate charters' },
  { id: 'Correspondence', label: '06. Correspondence', description: 'Notices, client requests, formal demands, and email records' },
  { id: 'Evidence', label: '07. Evidence', description: 'Physical and documentary exhibits deposited in encrypted vault' },
  { id: 'Photographs', label: '08. Photographs', description: 'Geotagged site photos, ocular inspections, and object captures' },
  { id: 'Audio', label: '09. Audio Recordings', description: 'Voice testimonies, sworn statements, and oral acknowledgments' },
  { id: 'Video', label: '10. Video Recordings', description: 'Remote execution records, video walkthroughs, and appearance clips' },
  { id: 'Testimonies', label: '11. Testimonies & Affidavits', description: 'Affidavits of witness, jurat statements, and depositions' },
  { id: 'Consultation Materials', label: '12. Consultation Materials', description: 'Pre-signing counsel briefs, advice memoranda, and checklist notes' },
  { id: 'Corrections and Drafts', label: '13. Corrections & Drafts', description: 'Track-changes redlines, correction manifests, and version history' },
  { id: 'Client Approvals', label: '14. Client Approvals', description: 'Signed sign-offs, formal approvals of final instrument drafts' },
  { id: 'Signing and Appearance', label: '15. Signing & Appearance', description: 'Videoconference attendance log, biometric liveness check records' },
  { id: 'Notarial Outputs', label: '16. Notarial Outputs', description: 'Completed electronic notarial certificates, seals, and doc entries' },
  { id: 'Hash and QR Records', label: '17. Hash & QR Records', description: 'Canonical SHA-256 fingerprints, QR tokens, and verification URLs' },
  { id: 'Receipts and Downloads', label: '18. Receipts & Downloads', description: 'Notarial fee receipts, certified copy manifests, and download tokens' },
];

export interface CaseEvidenceItem {
  id: string;
  caseId: string;
  canonicalDocId: string;
  folder: CaseFolderCategory;
  title: string;
  filename: string;
  fileType: 'PDF' | 'DOCX' | 'IMAGE' | 'AUDIO' | 'VIDEO' | 'TESTIMONY';
  fileSize: number;
  sha256Hash: string;
  isCanonicalDuplicate: boolean;
  duplicateOfDocId?: string;
  quarantineStatus: 'QUARANTINED' | 'CLEARED' | 'SUSPICIOUS';
  securityScanNotice: string;
  ocrText?: string;
  transcriptText?: string;
  aiClassification?: {
    suggestedCategory: string;
    confidence: number;
    model: string;
    timestamp: string;
    reviewStatus: 'UNVERIFIED' | 'CLIENT_ACCEPTED' | 'LAWYER_APPROVED' | 'REJECTED';
    notes?: string;
  };
  audioDurationSeconds?: number;
  videoDurationSeconds?: number;
  testimonyAuthor?: string;
  uploadedAt: string;
  uploadedBy: string;
  isOriginalPreserved: boolean;
  sharedWithLawyer: boolean;
  clientApprovedVersion?: boolean;
  versionNumber: string;
}

export interface DocumentVersion {
  versionId: string;
  documentId: string;
  versionNumber: string;
  label: string;
  createdBy: string;
  createdAt: string;
  sha256Hash: string;
  changesSummary: string;
  isClientApproved: boolean;
  approvedAt?: string;
  supersededVersionId?: string;
}

export interface LawyerMessage {
  id: string;
  caseId: string;
  senderName: string;
  senderRole: 'LAWYER' | 'CLIENT' | 'WITNESS';
  message: string;
  timestamp: string;
  attachedDocIds?: string[];
  isConfidential: boolean;
}

export interface ConsultationSession {
  id: string;
  caseId: string;
  scheduledAt: string;
  lawyerName: string;
  lawyerRollNo: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  meetingRoomId: string;
  preMeetingChecklistCompleted: boolean;
  consultationNotes: string[];
  actionItems: Array<{ id: string; title: string; completed: boolean }>;
}

export interface ClientCase {
  caseId: string;
  caseReference: string; // e.g. "CASE-2026-0914-8821"
  title: string;
  matterCategory: string;
  requestedService: string;
  clientDescription: string;
  urgency: 'LOW' | 'STANDARD' | 'URGENT';
  status: CaseStatus;
  relevantDates: {
    incidentOrExecutionDate?: string;
    deadlineDate?: string;
    targetHearingDate?: string;
  };
  jurisdiction: string;
  courtOrAgencyReference?: string;
  existingLawyerInfo?: string;
  notarizationRequired: boolean;
  preferredConsultationMethod: 'VIDEO' | 'IN_PERSON' | 'ASYNC_MESSAGE';
  preferredAppearanceMethod: 'REN' | 'IEN';
  conflictCheckConsent: boolean;
  assignedLawyer?: {
    name: string;
    title: string;
    rollNumber: string;
    ibpChapter: string;
  };
  clientInternalPersonId: string;
  participants: CaseParticipant[];
  evidenceItems: CaseEvidenceItem[];
  versions: DocumentVersion[];
  messages: LawyerMessage[];
  consultations: ConsultationSession[];
  tasks: Array<{
    id: string;
    title: string;
    responsiblePerson: string;
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
    dueDate?: string;
  }>;
  notarialOutcome?: {
    notarialRequestId: string;
    publicReference: string;
    notarialAct: string;
    completedAt: string;
    enpName: string;
    enpCommissionNo: string;
    notarialBookEntry: {
      bookNo: number;
      pageNo: number;
      docNo: number;
      seriesYear: number;
    };
    canonicalSha256: string;
    verificationQrToken: string;
    qrUrl: string;
    certifiedDownloadUrl: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ClientProfile {
  authUserId: string;
  internalPersonId: string; // Non-sequential, PII-free e.g. "DEMO-BPI-7K4M-92QX"
  fullName: string;
  suffix?: string;
  birthDate: string;
  birthPlace: string;
  nationality: string;
  civilStatus: 'SINGLE' | 'MARRIED' | 'WIDOWED' | 'LEGALLY_SEPARATED';
  currentAddress: string;
  permanentAddress: string;
  email: string;
  emailVerified: boolean;
  mobileNumber: string;
  mobileVerified: boolean;
  preferredLanguage: string;
  accessibilityRequirements?: string;
  identityStatus: IdentityStatus;
  idDocument: {
    category: 'PHILIPPINE_NATIONAL_ID' | 'DIGITAL_NATIONAL_ID' | 'PASSPORT' | 'DRIVERS_LICENSE' | 'UMID' | 'PRC_ID' | 'POSTAL_ID';
    issuingAuthority: string;
    idNumberMasked: string;
    issuanceDate: string;
    expirationDate: string;
    frontUploaded: boolean;
    backUploaded: boolean;
    specimenSignatureUploaded: boolean;
  };
  consents: Array<{
    id: string;
    scope: string;
    version: string;
    consentedAt: string;
    mandatory: boolean;
  }>;
  verificationRecord?: {
    transactionId: string;
    verificationMethod: string;
    timestamp: string;
    status: IdentityStatus;
    matchResult: string;
    livenessResult: string;
    consentId: string;
    providerLabel: string;
    expirationDate: string;
    auditReference: string;
    isDemo: true;
  };
  mfaEnabled: boolean;
  authorizedDevices: Array<{
    deviceId: string;
    deviceType: string;
    browser: string;
    ipAddress: string;
    lastActive: string;
    status: 'ACTIVE' | 'REVOKED';
  }>;
}
