import React, { createContext, useContext, useState } from 'react';
import {
  NotarizationRequest,
  TransactionState,
  NotarizationMode,
  NotarialAct,
} from '../types';
import { INITIAL_REQUESTS } from '../data/initialData';
import { sha256, generateReferenceNumber } from '../utils/crypto';
import { useAuth } from './AuthContext';
import { useSecurity } from './SecurityContext';

interface CreateRequestParams {
  title: string;
  documentType: string;
  mode: NotarizationMode;
  notarialAct: NotarialAct;
  originalFilename: string;
  fileSize: number;
  fileContentSimulated?: string;
  requesterName: string;
  requesterEmail: string;
  orgName?: string;
  participantNames: string[];
}

interface NotarizationContextType {
  requests: NotarizationRequest[];
  createRequest: (params: CreateRequestParams) => Promise<NotarizationRequest>;
  updateState: (requestId: string, newState: TransactionState, auditNote?: string) => Promise<boolean>;
  executeEnpSeal: (
    requestId: string,
    enpUid: string,
    stepUpCode: string
  ) => Promise<{ success: boolean; message: string }>;
  applyDemoSeal: (
    requestId: string,
    enpUid: string
  ) => Promise<{ success: boolean; message: string; certificateId?: string }>;
  recordRefusal: (
    requestId: string,
    reason: string,
    legalBasis: string
  ) => Promise<{ success: boolean }>;
  verifyDocumentByQuery: (query: string) => NotarizationRequest | undefined;
  resetDemoState: () => void;
  activeRequestCount: number;
  completedRequestCount: number;
  refusedRequestCount: number;
}

const NotarizationContext = createContext<NotarizationContextType | undefined>(undefined);

export const NotarizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [requests, setRequests] = useState<NotarizationRequest[]>(INITIAL_REQUESTS);
  const { currentUser, isEnp } = useAuth();
  const { addAuditEvent } = useSecurity();

  // Next sequential coordinates for Electronic Notarial Book
  const [nextBookCoordinates, setNextBookCoordinates] = useState({
    bookNo: 14,
    pageNo: 89,
    docNo: 413,
    seriesYear: 2026,
  });

  const createRequest = async (params: CreateRequestParams): Promise<NotarizationRequest> => {
    const referenceNumber = generateReferenceNumber();
    const content = params.fileContentSimulated || `${params.title}-${params.originalFilename}-${Date.now()}`;
    const originalHash = await sha256(content);
    const pdfaHash = await sha256(`${content}-normalized-pdfa-1b`);

    // Check for prohibited documents under Supreme Court A.M. No. 24-10-14-SC Rule II Section 3
    const isProhibited =
      params.title.toLowerCase().includes('will') ||
      params.title.toLowerCase().includes('deposition') ||
      params.documentType.toLowerCase().includes('will');

    const initialState: TransactionState = isProhibited ? 'REFUSED' : 'INTAKE_REVIEW';
    const now = new Date().toISOString();

    const participants = params.participantNames.map((name, idx) => ({
      id: `part-${Date.now()}-${idx}`,
      name,
      email: idx === 0 ? params.requesterEmail : `witness.${idx}@participant.ph`,
      role: (idx === 0 ? 'PRINCIPAL' : 'WITNESS') as 'PRINCIPAL' | 'WITNESS',
      idType: 'PHILIPPINE_PASSPORT' as const,
      idNumberRedacted: 'P••••••' + Math.floor(100 + Math.random() * 900) + 'A',
      identityVerified: false,
      livenessConfidenceScore: 0,
      locationDisclosed: 'Pending Live Session GPS Check',
      presenceStatus: 'OFFLINE' as const,
    }));

    const newRequest: NotarizationRequest = {
      id: `req-${Date.now()}`,
      referenceNumber,
      title: params.title,
      documentType: params.documentType,
      mode: params.mode,
      notarialAct: params.notarialAct,
      state: initialState,
      requester: {
        name: params.requesterName,
        email: params.requesterEmail,
        orgName: params.orgName,
      },
      participants,
      document: {
        originalFilename: params.originalFilename,
        fileSize: params.fileSize,
        originalSha256: originalHash,
        pdfaSha256: pdfaHash,
        quarantineStatus: 'SCANNER_UNAVAILABLE',
        scanProvider: 'Document storage or security scanning is not configured. Uploads are unavailable.',
        scanTimestamp: now,
        pagesCount: Math.floor(1 + Math.random() * 8),
        isEncryptedPdf: false,
        integrityVerified: false,
      },
      refusalReason: isProhibited
        ? 'Excluded Document Category: Under Section 3, Rule II of Supreme Court A.M. No. 24-10-14-SC, notarial wills, testamentary instruments, and documents requiring wet signatures under the Civil Code are strictly prohibited from Electronic Notarization (IEN or REN).'
        : undefined,
      refusalLegalBasis: isProhibited
        ? 'Supreme Court A.M. No. 24-10-14-SC, Rule II, Section 3(b) (Prohibited Instruments)'
        : undefined,
      refusalTimestamp: isProhibited ? now : undefined,
      createdAt: now,
      updatedAt: now,
    };

    setRequests((prev) => [newRequest, ...prev]);

    await addAuditEvent({
      timestamp: now,
      actor: {
        uid: currentUser.uid,
        name: currentUser.name,
        role: currentUser.role,
        email: currentUser.email,
      },
      action: isProhibited ? 'REQUEST_AUTO_REFUSED_EXCLUDED_DOCUMENT' : 'REQUEST_CREATED_INTAKE',
      resource: 'NotarizationVault/Request',
      resourceId: referenceNumber,
      severity: isProhibited ? 'HIGH' : 'INFO',
      ipAddress: '120.29.74.19',
      userAgent: navigator.userAgent,
      location: 'Metro Manila, Philippines',
      metadata: {
        title: params.title,
        mode: params.mode,
        act: params.notarialAct,
        isProhibited,
        originalSha256: originalHash,
      },
    });

    return newRequest;
  };

  const updateState = async (
    requestId: string,
    newState: TransactionState,
    auditNote?: string
  ): Promise<boolean> => {
    const target = requests.find((r) => r.id === requestId);
    if (!target) return false;

    const now = new Date().toISOString();

    setRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, state: newState, updatedAt: now } : r))
    );

    await addAuditEvent({
      timestamp: now,
      actor: {
        uid: currentUser.uid,
        name: currentUser.name,
        role: currentUser.role,
        email: currentUser.email,
      },
      action: `STATE_TRANSITION_${target.state}_TO_${newState}`,
      resource: 'NotarizationWorkflow',
      resourceId: target.referenceNumber,
      severity: 'LOW',
      ipAddress: '112.198.101.45',
      userAgent: navigator.userAgent,
      location: 'Makati City, Philippines',
      metadata: { previousState: target.state, nextState: newState, note: auditNote },
    });

    return true;
  };

  const executeEnpSeal = async (
    requestId: string,
    enpUid: string,
    stepUpCode: string
  ): Promise<{ success: boolean; message: string }> => {
    // Strict RBAC boundary check: only commissioned ENP
    if (!isEnp) {
      await addAuditEvent({
        timestamp: new Date().toISOString(),
        actor: {
          uid: currentUser.uid,
          name: currentUser.name,
          role: currentUser.role,
          email: currentUser.email,
        },
        action: 'UNAUTHORIZED_SEAL_ATTEMPT_REJECTED',
        resource: 'HSM/ElectronicNotarialSeal',
        resourceId: requestId,
        severity: 'CRITICAL',
        ipAddress: '120.29.74.19',
        userAgent: navigator.userAgent,
        metadata: { attemptedRole: currentUser.role },
      });
      return {
        success: false,
        message: 'Access Denied: Only a commissioned Electronic Notary Public (ENP) may apply the notarial seal.',
      };
    }

    if (!stepUpCode || stepUpCode.length < 4) {
      return {
        success: false,
        message: 'Security Verification Required: Please enter the 6-digit step-up MFA verification code to authorize HSM seal activation.',
      };
    }

    const target = requests.find((r) => r.id === requestId);
    if (!target) {
      return { success: false, message: 'Request record not found.' };
    }

    // Fail closed: Genuine HSM and certificate infrastructure is not configured
    await addAuditEvent({
      timestamp: new Date().toISOString(),
      actor: {
        uid: currentUser.uid,
        name: currentUser.name,
        role: currentUser.role,
        email: currentUser.email,
      },
      action: 'SEAL_EXECUTION_BLOCKED_UNCONFIGURED_HSM',
      resource: 'HSM/ElectronicNotarialSeal',
      resourceId: requestId,
      severity: 'HIGH',
      ipAddress: '112.198.101.45',
      userAgent: navigator.userAgent,
      metadata: { reason: 'HSM-backed ENP signing is not configured.' },
    });

    return {
      success: false,
      message: 'HSM-backed ENP signing is not configured. Electronic notarization is not available for legal use in this development environment.',
    };
  };

  const applyDemoSeal = async (
    requestId: string,
    enpUid: string
  ): Promise<{ success: boolean; message: string; certificateId?: string }> => {
    const target = requests.find((r) => r.id === requestId);
    if (!target) {
      return { success: false, message: 'Request not found.' };
    }

    const now = new Date().toISOString();
    const certificateId = `BENF-CERT-DEMO-${Date.now().toString().slice(-6)}`;
    const certHash = await sha256(`DEMO-CERT-${target.referenceNumber}-${target.document.pdfaSha256}-${now}`);

    const updatedBook = {
      bookNo: nextBookCoordinates.bookNo,
      pageNo: nextBookCoordinates.pageNo,
      docNo: nextBookCoordinates.docNo + 1,
      seriesYear: nextBookCoordinates.seriesYear,
      entryHash: certHash,
      recordedAt: now,
    };

    setNextBookCoordinates((prev) => ({
      ...prev,
      docNo: prev.docNo + 1,
    }));

    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              state: 'COMPLETED',
              completedAt: now,
              updatedAt: now,
              notarialBookEntry: updatedBook,
              enpSeal: {
                appliedBy: currentUser.name,
                appliedAt: now,
                commissionNo: currentUser.commissionNo || 'NP-2025-0814-MKT',
                certificateId,
                certificateHash: certHash,
                watermark: 'DEMO — NOT A LEGALLY NOTARIZED DOCUMENT',
                isDemo: true,
              },
            }
          : r
      )
    );

    await addAuditEvent({
      timestamp: now,
      actor: {
        uid: currentUser.uid,
        name: currentUser.name,
        role: currentUser.role,
        email: currentUser.email,
      },
      action: 'DEMONSTRATION_SEAL_APPLIED_NOT_LEGALLY_VALID',
      resource: 'NotarizationWorkflow/DemoSeal',
      resourceId: target.referenceNumber,
      severity: 'INFO',
      ipAddress: '112.198.101.45',
      userAgent: navigator.userAgent,
      location: 'Makati City, Philippines',
      metadata: {
        certificateId,
        certificateHash: certHash,
        notice: 'DEMO — NOT A LEGALLY NOTARIZED DOCUMENT',
        bookCoordinates: updatedBook,
      },
    });

    return {
      success: true,
      message: 'Demonstration ceremony completed successfully. DEMO — NOT A LEGALLY NOTARIZED DOCUMENT certificate generated.',
      certificateId,
    };
  };

  const resetDemoState = () => {
    setRequests(INITIAL_REQUESTS);
  };

  const recordRefusal = async (
    requestId: string,
    reason: string,
    legalBasis: string
  ): Promise<{ success: boolean }> => {
    const now = new Date().toISOString();
    const target = requests.find((r) => r.id === requestId);
    if (!target) return { success: false };

    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              state: 'REFUSED',
              refusalReason: reason,
              refusalLegalBasis: legalBasis,
              refusalTimestamp: now,
              updatedAt: now,
            }
          : r
      )
    );

    await addAuditEvent({
      timestamp: now,
      actor: {
        uid: currentUser.uid,
        name: currentUser.name,
        role: currentUser.role,
        email: currentUser.email,
      },
      action: 'ENP_RECORDED_FORMAL_REFUSAL',
      resource: 'NotarizationWorkflow/Refusals',
      resourceId: target.referenceNumber,
      severity: 'HIGH',
      ipAddress: '112.198.101.45',
      userAgent: navigator.userAgent,
      location: 'Makati City, Philippines',
      metadata: { reason, legalBasis },
    });

    return { success: true };
  };

  const verifyDocumentByQuery = (query: string): NotarizationRequest | undefined => {
    const clean = query.trim();
    if (!clean) return undefined;
    return requests.find(
      (r) =>
        r.referenceNumber.toLowerCase() === clean.toLowerCase() ||
        r.document.pdfaSha256.toLowerCase() === clean.toLowerCase() ||
        r.document.originalSha256.toLowerCase() === clean.toLowerCase() ||
        r.notarialBookEntry?.entryHash.toLowerCase() === clean.toLowerCase()
    );
  };

  const activeRequestCount = requests.filter(
    (r) => r.state !== 'COMPLETED' && r.state !== 'REFUSED' && r.state !== 'CANCELLED'
  ).length;

  const completedRequestCount = requests.filter((r) => r.state === 'COMPLETED').length;
  const refusedRequestCount = requests.filter((r) => r.state === 'REFUSED').length;

  return (
    <NotarizationContext.Provider
      value={{
        requests,
        createRequest,
        updateState,
        executeEnpSeal,
        applyDemoSeal,
        recordRefusal,
        verifyDocumentByQuery,
        resetDemoState,
        activeRequestCount,
        completedRequestCount,
        refusedRequestCount,
      }}
    >
      {children}
    </NotarizationContext.Provider>
  );
};

export function useNotarization(): NotarizationContextType {
  const context = useContext(NotarizationContext);
  if (!context) {
    throw new Error('useNotarization must be used within a NotarizationProvider');
  }
  return context;
}
