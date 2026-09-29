/**
 * JuriMbrella — Philippine Electronic Notarization
 * Client Case Workflow Context
 * Unified State Management for Signer & Principal Workspace
 * Demonstration Mode Only (APP_ENV=demo, DEMO_MODE=true)
 */

import React, { createContext, useContext, useState } from 'react';
import {
  ClientProfile,
  ClientCase,
  CaseParticipant,
  CaseEvidenceItem,
  DocumentVersion,
  LawyerMessage,
  CaseStatus,
  CaseFolderCategory,
  IdentityStatus,
} from '../types/client-case';
import { INITIAL_CLIENT_PROFILE, INITIAL_CLIENT_CASES } from '../data/clientCaseData';
import { sha256 } from '../utils/crypto';
import { useSecurity } from './SecurityContext';
import { AuditSeverity } from '../types';

interface NewCaseInput {
  title: string;
  matterCategory: string;
  requestedService: string;
  clientDescription: string;
  urgency: 'LOW' | 'STANDARD' | 'URGENT';
  jurisdiction: string;
  courtOrAgencyReference?: string;
  existingLawyerInfo?: string;
  notarizationRequired: boolean;
  preferredConsultationMethod: 'VIDEO' | 'IN_PERSON' | 'ASYNC_MESSAGE';
  preferredAppearanceMethod: 'REN' | 'IEN';
  conflictCheckConsent: boolean;
}

interface ClientCaseContextType {
  profile: ClientProfile;
  cases: ClientCase[];
  activeCaseId: string;
  activeCase: ClientCase;
  setActiveCaseId: (caseId: string) => void;
  updateProfile: (updates: Partial<ClientProfile>) => void;
  updateConsent: (consentId: string, consented: boolean) => void;
  simulateEgovPhVerification: () => Promise<{ success: boolean; message: string }>;
  simulateIdentityReverification: (otp: string) => Promise<{ success: boolean; message: string }>;
  createNewCase: (input: NewCaseInput) => Promise<ClientCase>;
  updateCaseStatus: (caseId: string, newStatus: CaseStatus, reason?: string) => void;
  inviteWitness: (
    caseId: string,
    witnessName: string,
    email: string,
    mobile: string,
    relationship: string
  ) => Promise<{ success: boolean; message: string; roleConflict?: string }>;
  removeParticipant: (caseId: string, participantId: string, reason: string) => Promise<boolean>;
  maskedLookupInternalId: (query: string) => {
    found: boolean;
    maskedName?: string;
    maskedContact?: string;
    identityStatus?: string;
    warning?: string;
  };
  uploadEvidenceItem: (
    caseId: string,
    file: { name: string; size: number; content?: string },
    folder: CaseFolderCategory,
    fileType: 'PDF' | 'DOCX' | 'IMAGE' | 'AUDIO' | 'VIDEO' | 'TESTIMONY'
  ) => Promise<{ item: CaseEvidenceItem; isDuplicate: boolean }>;
  updateAiClassificationStatus: (
    caseId: string,
    evidenceId: string,
    status: 'CLIENT_ACCEPTED' | 'LAWYER_APPROVED' | 'REJECTED',
    customNotes?: string
  ) => void;
  toggleEvidenceSharing: (caseId: string, evidenceId: string) => void;
  createCorrectedVersion: (
    caseId: string,
    canonicalDocId: string,
    changesSummary: string
  ) => Promise<DocumentVersion>;
  approveDocumentVersion: (caseId: string, versionId: string) => Promise<boolean>;
  sendMessageToCounsel: (caseId: string, text: string) => void;
  sendLawyerMessage: (caseId: string, text: string) => void;
  runLivenessDiagnostic: () => Promise<{ success: boolean; score: number; livenessResult: string }>;
  performIdentityReverification: (otp: string) => Promise<{ success: boolean; message: string }>;
  performMaskedInternalLookup: (query: string) => {
    found: boolean;
    maskedName?: string;
    maskedMobile?: string;
    internalPersonId?: string;
    disclaimer: string;
  };
  updateAiClassificationReview: (
    caseId: string,
    evidenceId: string,
    status: 'CLIENT_ACCEPTED' | 'LAWYER_APPROVED' | 'REJECTED',
    customNotes?: string
  ) => void;
  signActiveCaseDocument: (caseId: string) => Promise<{ success: boolean }>;
  finalizeCaseNotarization: (caseId: string) => Promise<{
    success: boolean;
    publicReference: string;
    canonicalHash: string;
    qrUrl: string;
  }>;
  completeCeremonyNotarization: (
    caseId: string,
    notarialAct: string,
    enpName: string
  ) => Promise<{
    success: boolean;
    publicReference: string;
    canonicalHash: string;
    qrUrl: string;
  }>;
}

const ClientCaseContext = createContext<ClientCaseContextType | undefined>(undefined);

export const ClientCaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { addAuditEvent } = useSecurity();
  const [profile, setProfile] = useState<ClientProfile>(INITIAL_CLIENT_PROFILE);
  const [cases, setCases] = useState<ClientCase[]>(INITIAL_CLIENT_CASES);
  const [activeCaseId, setActiveCaseId] = useState<string>(INITIAL_CLIENT_CASES[0]?.caseId || '');

  const activeCase = cases.find((c) => c.caseId === activeCaseId) || cases[0];

  const logAuditEvent = (params: {
    action: string;
    resource: string;
    resourceId?: string;
    severity?: AuditSeverity;
    metadata?: Record<string, unknown>;
  }) => {
    addAuditEvent({
      timestamp: new Date().toISOString(),
      actor: {
        uid: profile.authUserId,
        name: profile.fullName,
        role: "PRINCIPAL",
        email: profile.email,
      },
      action: params.action,
      resource: params.resource,
      resourceId: params.resourceId,
      severity: params.severity || "INFO",
      ipAddress: "119.93.18.42",
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
      metadata: params.metadata,
    });
  };


  const updateProfile = (updates: Partial<ClientProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
    logAuditEvent({
      action: 'CLIENT_PROFILE_UPDATED',
      resource: 'ClientProfile',
      resourceId: profile.internalPersonId,
      severity: 'INFO',
      metadata: { fieldsUpdated: Object.keys(updates) },
    });
  };

  const updateConsent = (consentId: string, consented: boolean) => {
    setProfile((prev) => ({
      ...prev,
      consents: prev.consents.map((c) =>
        c.id === consentId
          ? {
              ...c,
              consentedAt: consented ? new Date().toISOString() : '',
            }
          : c
      ),
    }));
    logAuditEvent({
      action: 'CONSENT_RECORD_TOGGLED',
      resource: 'ConsentRecord',
      resourceId: consentId,
      severity: 'INFO',
      metadata: { consentId, consented, version: 'v2026.1' },
    });
  };

  const simulateEgovPhVerification = async (): Promise<{ success: boolean; message: string }> => {
    const txId = `TX-EGOVPH-${Date.now()}`;
    const now = new Date().toISOString();
    const expiry = new Date(Date.now() + 90 * 24 * 3600 * 1000).toISOString();

    setProfile((prev) => ({
      ...prev,
      identityStatus: 'VERIFIED_DEMO',
      verificationRecord: {
        transactionId: txId,
        verificationMethod: 'Simulated eGovPH National ID SSO & Facial Liveness',
        timestamp: now,
        status: 'VERIFIED_DEMO',
        matchResult: 'Facial match: 99.1% confidence • Demographic match: 100%',
        livenessResult: 'Passed (ISO/IEC 30107-3 Compliant Passive Check)',
        consentId: 'cst-03',
        providerLabel: 'PSA PhilSys eKYC Sandbox (Simulated)',
        expirationDate: expiry,
        auditReference: `AUD-EKYC-${Date.now()}`,
        isDemo: true,
      },
    }));

    logAuditEvent({
      action: 'SIMULATED_EGOVPH_EKYC_VERIFIED',
      resource: 'IdentityVerificationRecord',
      resourceId: txId,
      severity: 'INFO',
      metadata: {
        provider: 'PSA PhilSys Sandbox',
        internalPersonId: profile.internalPersonId,
        livenessResult: 'PASS',
      },
    });

    return {
      success: true,
      message: 'Simulated eGovPH / National ID verification successful (Demonstration record generated).',
    };
  };

  const simulateIdentityReverification = async (otp: string): Promise<{ success: boolean; message: string }> => {
    if (!otp || otp.length < 4) {
      return { success: false, message: 'Invalid demonstration OTP. Please enter the 6-digit challenge code.' };
    }

    logAuditEvent({
      action: 'IDENTITY_REVERIFICATION_CHALLENGE_PASSED',
      resource: 'IdentityReverification',
      resourceId: profile.internalPersonId,
      severity: 'INFO',
      metadata: {
        step: 'PRE_SIGNING_CHALLENGE',
        livenessScore: 99.4,
        deviceFingerprint: 'DEV-VERIFIED-CHROME-MACOS',
      },
    });

    return {
      success: true,
      message: 'Identity successfully re-verified. Step-up authorization confirmed for signing appearance.',
    };
  };

  const createNewCase = async (input: NewCaseInput): Promise<ClientCase> => {
    const timestamp = Date.now();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const caseId = `CASE-2026-${randomSuffix}`;
    const caseRef = caseId;
    const now = new Date().toISOString();

    const newCase: ClientCase = {
      caseId,
      caseReference: caseRef,
      title: input.title,
      matterCategory: input.matterCategory,
      requestedService: input.requestedService,
      clientDescription: input.clientDescription,
      urgency: input.urgency,
      status: 'LAWYER_REVIEW',
      relevantDates: {
        incidentOrExecutionDate: new Date().toISOString().split('T')[0],
      },
      jurisdiction: input.jurisdiction,
      courtOrAgencyReference: input.courtOrAgencyReference,
      existingLawyerInfo: input.existingLawyerInfo,
      notarizationRequired: input.notarizationRequired,
      preferredConsultationMethod: input.preferredConsultationMethod,
      preferredAppearanceMethod: input.preferredAppearanceMethod,
      conflictCheckConsent: input.conflictCheckConsent,
      assignedLawyer: {
        name: 'Atty. Leandro V. Morales',
        title: 'Managing Counsel & Notary Public',
        rollNumber: 'Roll of Attorneys No. 49214',
        ibpChapter: 'Integrated Bar of the Philippines — Makati Chapter',
      },
      clientInternalPersonId: profile.internalPersonId,
      participants: [
        {
          caseParticipantId: `cpart-${timestamp}-01`,
          caseId,
          internalPersonId: profile.internalPersonId,
          fullName: profile.fullName,
          email: profile.email,
          mobileNumber: profile.mobileNumber,
          role: 'PRINCIPAL',
          status: 'ACTIVE',
          authorizationRequestId: `AUTHREQ-${timestamp}-P`,
          identityRequirement: 'ENHANCED',
          relationshipToCase: 'Primary Principal / Applicant',
          addedBy: `${profile.fullName} (Self)`,
          createdAt: now,
          updatedAt: now,
        },
      ],
      evidenceItems: [],
      versions: [],
      messages: [
        {
          id: `msg-init-${timestamp}`,
          caseId,
          senderName: 'JuriMbrella Intake Officer',
          senderRole: 'LAWYER',
          message:
            'Welcome. Your demonstrative case has been successfully staged and placed in the Counsel Preliminary Review Queue. You may upload evidence, invite witnesses, and inspect AI-assisted classification.',
          timestamp: now,
          isConfidential: true,
        },
      ],
      consultations: [],
      tasks: [
        {
          id: `tsk-${timestamp}-1`,
          title: 'Upload primary instrument draft for legal sufficiency review',
          responsiblePerson: `${profile.fullName} (Client)`,
          status: 'PENDING',
        },
        {
          id: `tsk-${timestamp}-2`,
          title: 'Complete preliminary conflict and jurisdiction check',
          responsiblePerson: 'Atty. Leandro V. Morales (Counsel)',
          status: 'IN_PROGRESS',
        },
      ],
      createdAt: now,
      updatedAt: now,
    };

    setCases((prev) => [newCase, ...prev]);
    setActiveCaseId(caseId);

    logAuditEvent({
      action: 'CLIENT_CASE_CREATED',
      resource: 'ClientCase',
      resourceId: caseId,
      severity: 'INFO',
      metadata: {
        caseReference: caseRef,
        title: input.title,
        matterCategory: input.matterCategory,
        internalPersonId: profile.internalPersonId,
      },
    });

    return newCase;
  };

  const updateCaseStatus = (caseId: string, newStatus: CaseStatus, reason?: string) => {
    setCases((prev) =>
      prev.map((c) =>
        c.caseId === caseId
          ? {
              ...c,
              status: newStatus,
              updatedAt: new Date().toISOString(),
            }
          : c
      )
    );

    logAuditEvent({
      action: 'CASE_STATUS_TRANSITION',
      resource: 'ClientCase',
      resourceId: caseId,
      severity: 'INFO',
      metadata: { newStatus, reason: reason || 'Client workflow transition' },
    });
  };

  const inviteWitness = async (
    caseId: string,
    witnessName: string,
    email: string,
    mobile: string,
    relationship: string
  ): Promise<{ success: boolean; message: string; roleConflict?: string }> => {
    // Role conflict check: check if witness matches principal or notary
    let roleConflict: string | undefined;
    if (witnessName.toLowerCase().trim() === profile.fullName.toLowerCase().trim()) {
      roleConflict =
        'Potential role conflict detected — A principal cannot act as an independent witness to their own instrument execution.';
    }

    const invitationToken = `inv_tk_${Math.random().toString(36).substring(2, 12)}_${Date.now()}`;
    const expiresAt = new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString();
    const now = new Date().toISOString();
    const cpartId = `cpart-wit-${Date.now()}`;

    const newParticipant: CaseParticipant = {
      caseParticipantId: cpartId,
      caseId,
      internalPersonId: `DEMO-BPI-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      fullName: witnessName,
      email,
      mobileNumber: mobile,
      role: 'INSTRUMENT_WITNESS',
      status: roleConflict ? 'PENDING_REVIEW' : 'INVITED',
      authorizationRequestId: `AUTHREQ-${Date.now()}`,
      invitationId: `inv-${Date.now()}`,
      invitationToken,
      invitationExpiresAt: expiresAt,
      identityRequirement: 'BASIC',
      relationshipToCase: relationship || 'Instrumental Witness',
      addedBy: profile.fullName,
      createdAt: now,
      updatedAt: now,
    };

    setCases((prev) =>
      prev.map((c) =>
        c.caseId === caseId
          ? {
              ...c,
              participants: [...c.participants, newParticipant],
              updatedAt: now,
            }
          : c
      )
    );

    logAuditEvent({
      action: 'WITNESS_INVITATION_DISPATCHED',
      resource: 'CaseParticipant',
      resourceId: cpartId,
      severity: roleConflict ? 'MEDIUM' : 'INFO',
      metadata: {
        caseId,
        witnessName,
        email,
        invitationExpiresAt: expiresAt,
        roleConflict,
      },
    });

    return {
      success: true,
      message: roleConflict
        ? `Witness invited with caution: ${roleConflict}`
        : `Secure witness invitation dispatched to ${email}. Token valid for 7 days.`,
      roleConflict,
    };
  };

  const removeParticipant = async (caseId: string, participantId: string, reason: string): Promise<boolean> => {
    setCases((prev) =>
      prev.map((c) =>
        c.caseId === caseId
          ? {
              ...c,
              participants: c.participants.map((p) =>
                p.caseParticipantId === participantId
                  ? {
                      ...p,
                      status: 'REVOKED' as const,
                      removalReason: reason,
                      invitationToken: undefined,
                      updatedAt: new Date().toISOString(),
                    }
                  : p
              ),
              updatedAt: new Date().toISOString(),
            }
          : c
      )
    );

    logAuditEvent({
      action: 'PARTICIPANT_ACCESS_REVOKED',
      resource: 'CaseParticipant',
      resourceId: participantId,
      severity: 'HIGH',
      metadata: { caseId, reason, actor: profile.fullName },
    });

    return true;
  };

  const maskedLookupInternalId = (query: string) => {
    const q = query.trim().toUpperCase();
    if (!q || q.length < 6) {
      return { found: false, warning: 'Please enter at least 6 characters for exact-match simulation.' };
    }

    logAuditEvent({
      action: 'MASKED_INTERNAL_LOOKUP_PERFORMED',
      resource: 'InternalPersonIdDirectory',
      resourceId: 'DIRECTORY_SEARCH',
      severity: 'LOW',
      metadata: { queryLength: q.length, searcher: profile.fullName },
    });

    if (q.includes('7K4M') || q.includes('MARIA') || q.includes('92QX')) {
      return {
        found: true,
        maskedName: 'M*** E**** S****',
        maskedContact: 'Mobile ending in 9104',
        identityStatus: 'Demo Verified (PSA PhilSys ePhilID)',
        warning: 'Exact internal match located. Record belongs to current principal profile.',
      };
    }

    if (q.includes('ROBERTO') || q.includes('CRUZ')) {
      return {
        found: true,
        maskedName: 'R****** C***',
        maskedContact: 'Mobile ending in 8821',
        identityStatus: 'Demo Verified (IBP Attorney Identification)',
        warning: 'Exact internal match located. Verified instrumental witness.',
      };
    }

    return {
      found: false,
      warning: 'No matching internal person record found. An invitation token can be issued instead.',
    };
  };

  const uploadEvidenceItem = async (
    caseId: string,
    file: { name: string; size: number; content?: string },
    folder: CaseFolderCategory,
    fileType: 'PDF' | 'DOCX' | 'IMAGE' | 'AUDIO' | 'VIDEO' | 'TESTIMONY'
  ): Promise<{ item: CaseEvidenceItem; isDuplicate: boolean }> => {
    const content = file.content || `${file.name}-${file.size}`;
    const hash = await sha256(content);

    // Check all existing items in all cases for SHA-256 collision / duplicate detection
    let isDuplicate = false;
    let duplicateOfDocId: string | undefined;

    cases.forEach((c) => {
      c.evidenceItems.forEach((ev) => {
        if (ev.sha256Hash === hash) {
          isDuplicate = true;
          duplicateOfDocId = ev.canonicalDocId;
        }
      });
    });

    const canonicalDocId = duplicateOfDocId || `CANONICAL-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const now = new Date().toISOString();

    const newItem: CaseEvidenceItem = {
      id: `ev-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      caseId,
      canonicalDocId,
      folder,
      title: file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' '),
      filename: file.name,
      fileType,
      fileSize: file.size,
      sha256Hash: hash,
      isCanonicalDuplicate: isDuplicate,
      duplicateOfDocId,
      quarantineStatus: 'CLEARED',
      securityScanNotice: 'Simulated security scan completed — demonstration only (ClamAV synthetic engine passed)',
      ocrText:
        fileType === 'PDF' || fileType === 'IMAGE'
          ? `[SIMULATED OCR OUTPUT]: Analyzed text for ${file.name}. Confirmed high legibility and standard legal formatting.`
          : undefined,
      transcriptText:
        fileType === 'AUDIO' || fileType === 'VIDEO'
          ? `[SIMULATED TRANSCRIPT]: Recorded audio/video testimony. Audio stream verified clear without forensic anomalies.`
          : undefined,
      aiClassification: {
        suggestedCategory: `${folder} / AI-Classified Document`,
        confidence: 0.96,
        model: 'Gemini Legal Embedder v2',
        timestamp: now,
        reviewStatus: 'UNVERIFIED',
        notes: 'AI-suggested classification — requires professional review.',
      },
      audioDurationSeconds: fileType === 'AUDIO' ? 65 : undefined,
      videoDurationSeconds: fileType === 'VIDEO' ? 120 : undefined,
      uploadedAt: now,
      uploadedBy: profile.fullName,
      isOriginalPreserved: true,
      sharedWithLawyer: true,
      clientApprovedVersion: false,
      versionNumber: 'v1.0',
    };

    setCases((prev) =>
      prev.map((c) =>
        c.caseId === caseId
          ? {
              ...c,
              evidenceItems: [newItem, ...c.evidenceItems],
              updatedAt: now,
            }
          : c
      )
    );

    logAuditEvent({
      action: isDuplicate ? 'DUPLICATE_DOCUMENT_CANONICALLY_LINKED' : 'EVIDENCE_DOCUMENT_UPLOADED',
      resource: 'CaseEvidenceItem',
      resourceId: newItem.id,
      severity: 'INFO',
      metadata: {
        caseId,
        filename: file.name,
        sha256: hash,
        isDuplicate,
        duplicateOfDocId,
      },
    });

    return { item: newItem, isDuplicate };
  };

  const updateAiClassificationStatus = (
    caseId: string,
    evidenceId: string,
    status: 'CLIENT_ACCEPTED' | 'LAWYER_APPROVED' | 'REJECTED',
    customNotes?: string
  ) => {
    setCases((prev) =>
      prev.map((c) =>
        c.caseId === caseId
          ? {
              ...c,
              evidenceItems: c.evidenceItems.map((ev) =>
                ev.id === evidenceId && ev.aiClassification
                  ? {
                      ...ev,
                      aiClassification: {
                        ...ev.aiClassification,
                        reviewStatus: status,
                        notes: customNotes || ev.aiClassification.notes,
                      },
                    }
                  : ev
              ),
              updatedAt: new Date().toISOString(),
            }
          : c
      )
    );

    logAuditEvent({
      action: 'AI_CLASSIFICATION_STATUS_UPDATED',
      resource: 'CaseEvidenceItem',
      resourceId: evidenceId,
      severity: 'INFO',
      metadata: { caseId, status, customNotes },
    });
  };

  const toggleEvidenceSharing = (caseId: string, evidenceId: string) => {
    setCases((prev) =>
      prev.map((c) =>
        c.caseId === caseId
          ? {
              ...c,
              evidenceItems: c.evidenceItems.map((ev) =>
                ev.id === evidenceId ? { ...ev, sharedWithLawyer: !ev.sharedWithLawyer } : ev
              ),
              updatedAt: new Date().toISOString(),
            }
          : c
      )
    );
  };

  const createCorrectedVersion = async (
    caseId: string,
    canonicalDocId: string,
    changesSummary: string
  ): Promise<DocumentVersion> => {
    const timestamp = Date.now();
    const versionNumber = `v1.${Math.floor(1 + Math.random() * 9)}`;
    const hash = await sha256(`corrected-version-${canonicalDocId}-${timestamp}`);
    const now = new Date().toISOString();

    const newVersion: DocumentVersion = {
      versionId: `dver-${timestamp}`,
      documentId: canonicalDocId,
      versionNumber,
      label: `Corrected Instrument Draft (${versionNumber})`,
      createdBy: 'Atty. Juan Dela Cruz (Counsel)',
      createdAt: now,
      sha256Hash: hash,
      changesSummary,
      isClientApproved: false,
    };

    setCases((prev) =>
      prev.map((c) =>
        c.caseId === caseId
          ? {
              ...c,
              versions: [newVersion, ...c.versions],
              status: 'CLIENT_APPROVAL_PENDING',
              updatedAt: now,
            }
          : c
      )
    );

    logAuditEvent({
      action: 'DOCUMENT_VERSION_CORRECTED',
      resource: 'DocumentVersion',
      resourceId: newVersion.versionId,
      severity: 'INFO',
      metadata: { caseId, versionNumber, sha256: hash, changesSummary },
    });

    return newVersion;
  };

  const approveDocumentVersion = async (caseId: string, versionId: string): Promise<boolean> => {
    setCases((prev) =>
      prev.map((c) =>
        c.caseId === caseId
          ? {
              ...c,
              status: 'READY_FOR_SIGNING',
              versions: c.versions.map((v) =>
                v.versionId === versionId
                  ? {
                      ...v,
                      isClientApproved: true,
                      approvedAt: new Date().toISOString(),
                    }
                  : v
              ),
              updatedAt: new Date().toISOString(),
            }
          : c
      )
    );

    logAuditEvent({
      action: 'CLIENT_DOCUMENT_VERSION_APPROVED',
      resource: 'DocumentVersion',
      resourceId: versionId,
      severity: 'INFO',
      metadata: { caseId, approvedBy: profile.fullName },
    });

    return true;
  };

  const sendMessageToCounsel = (caseId: string, text: string) => {
    const newMsg: LawyerMessage = {
      id: `msg-${Date.now()}`,
      caseId,
      senderName: profile.fullName,
      senderRole: 'CLIENT',
      message: text,
      timestamp: new Date().toISOString(),
      isConfidential: true,
    };

    setCases((prev) =>
      prev.map((c) =>
        c.caseId === caseId
          ? {
              ...c,
              messages: [...c.messages, newMsg],
              updatedAt: new Date().toISOString(),
            }
          : c
      )
    );

    logAuditEvent({
      action: 'CONFIDENTIAL_LAWYER_MESSAGE_SENT',
      resource: 'LawyerMessage',
      resourceId: newMsg.id,
      severity: 'INFO',
      metadata: { caseId, sender: profile.fullName },
    });
  };

  const completeCeremonyNotarization = async (
    caseId: string,
    notarialAct: string,
    enpName: string
  ): Promise<{
    success: boolean;
    publicReference: string;
    canonicalHash: string;
    qrUrl: string;
  }> => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const publicRef = `ENF-20260917-${randomSuffix}`;
    const qrToken = `vqr_${randomSuffix}_${Math.random().toString(36).substring(2, 10)}`;
    const hash = await sha256(`notarized-final-${caseId}-${publicRef}-${Date.now()}`);
    const now = new Date().toISOString();
    const qrUrl = `/verify?ref=${publicRef}`;

    const outcome = {
      notarialRequestId: `NOTREQ-${randomSuffix}`,
      publicReference: publicRef,
      notarialAct,
      completedAt: now,
      enpName,
      enpCommissionNo: 'Commission NP-2025-0814-MKT',
      notarialBookEntry: {
        bookNo: 14,
        pageNo: 91,
        docNo: 420,
        seriesYear: 2026,
      },
      canonicalSha256: hash,
      verificationQrToken: qrToken,
      qrUrl,
      certifiedDownloadUrl: `#download-demo-${publicRef}`,
    };

    setCases((prev) =>
      prev.map((c) =>
        c.caseId === caseId
          ? {
              ...c,
              status: 'COMPLETED',
              notarialOutcome: outcome,
              updatedAt: now,
            }
          : c
      )
    );

    logAuditEvent({
      action: 'DEMO_NOTARIZATION_CEREMONY_COMPLETED',
      resource: 'NotarizationOutcome',
      resourceId: publicRef,
      severity: 'INFO',
      metadata: {
        caseId,
        publicReference: publicRef,
        notarialAct,
        enpName,
        canonicalHash: hash,
        qrToken,
      },
    });

    return {
      success: true,
      publicReference: publicRef,
      canonicalHash: hash,
      qrUrl,
    };
  };

  const runLivenessDiagnostic = async () => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    logAuditEvent({
      action: 'BIOMETRIC_LIVENESS_DIAGNOSTIC_COMPLETED',
      resource: 'ClientProfile',
      resourceId: profile.internalPersonId,
      severity: 'INFO',
      metadata: { livenessScore: 98.4, standard: 'ISO/IEC 30107-3' },
    });
    return {
      success: true,
      score: 98.4,
      livenessResult: 'Passed (Simulated Active Facial Landmark Motion Detection)',
    };
  };

  const performIdentityReverification = async (otp: string) => {
    return simulateIdentityReverification(otp);
  };

  const performMaskedInternalLookup = (query: string) => {
    const res = maskedLookupInternalId(query);
    return {
      found: res.found,
      maskedName: res.maskedName,
      maskedMobile: res.maskedContact,
      internalPersonId: res.found ? 'DEMO-BPI-7K4M-92QX' : undefined,
      disclaimer: res.warning || 'Simulated demonstration search.',
    };
  };

  const updateAiClassificationReview = (
    caseId: string,
    evidenceId: string,
    status: 'CLIENT_ACCEPTED' | 'LAWYER_APPROVED' | 'REJECTED',
    customNotes?: string
  ) => {
    updateAiClassificationStatus(caseId, evidenceId, status, customNotes);
  };

  const sendLawyerMessage = (caseId: string, text: string) => {
    sendMessageToCounsel(caseId, text);
  };

  const signActiveCaseDocument = async (caseId: string) => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    setCases((prev) =>
      prev.map((c) =>
        c.caseId === caseId
          ? {
              ...c,
              status: 'READY_FOR_SIGNING',
              updatedAt: new Date().toISOString(),
            }
          : c
      )
    );
    logAuditEvent({
      action: 'PRINCIPAL_DIGITAL_SIGNATURE_AFFIXED',
      resource: 'ClientCase',
      resourceId: caseId,
      severity: 'INFO',
      metadata: { signer: profile.fullName, timestamp: new Date().toISOString() },
    });
    return { success: true };
  };

  const finalizeCaseNotarization = async (caseId: string) => {
    return completeCeremonyNotarization(caseId, 'ACKNOWLEDGMENT', 'Atty. Juan Dela Cruz');
  };

  return (
    <ClientCaseContext.Provider
      value={{
        profile,
        cases,
        activeCaseId,
        activeCase,
        setActiveCaseId,
        updateProfile,
        updateConsent,
        simulateEgovPhVerification,
        simulateIdentityReverification,
        createNewCase,
        updateCaseStatus,
        inviteWitness,
        removeParticipant,
        maskedLookupInternalId,
        uploadEvidenceItem,
        updateAiClassificationStatus,
        toggleEvidenceSharing,
        createCorrectedVersion,
        approveDocumentVersion,
        sendMessageToCounsel,
        completeCeremonyNotarization,
        sendLawyerMessage,
        runLivenessDiagnostic,
        performIdentityReverification,
        performMaskedInternalLookup,
        updateAiClassificationReview,
        signActiveCaseDocument,
        finalizeCaseNotarization,
      }}
    >
      {children}
    </ClientCaseContext.Provider>
  );
};

export const useClientCase = () => {
  const context = useContext(ClientCaseContext);
  if (!context) {
    throw new Error('useClientCase must be used within a ClientCaseProvider');
  }
  return context;
};
