/**
 * JuriMbrella — Legal Information & Procedural Assistant Types
 * Grounded in Supreme Court A.M. No. 24-10-14-SC, R.A. 8792, and R.A. 10173.
 */

export interface LegalSourceCitation {
  id: string;
  title: string;
  sourceType: 'STATUTE' | 'REGULATION' | 'COURT_RULING' | 'ADMINISTRATIVE_ISSUANCE' | 'GENERAL_PROCEDURAL';
  issuingAuthority: string;
  docketNumber?: string;
  publicationDate?: string;
  url?: string;
  summary: string;
  isVerified: boolean;
}

export interface AssistantMessage {
  id: string;
  sender: 'USER' | 'ASSISTANT';
  text: string;
  timestamp: string;
  jurisdiction?: 'Republic of the Philippines';
  isGeneralInformation?: boolean;
  sources?: LegalSourceCitation[];
  groundingStatus?: 'GROUNDED' | 'UNVERIFIED' | 'DISCLAIMER_ATTACHED';
  safetyPassed?: boolean;
}

export type UserCreditTier = 'GUEST' | 'REGISTERED' | 'SUBSCRIBER' | 'ADMINISTRATOR';

export interface UserCreditProfile {
  tier: UserCreditTier;
  dailyAllowance: number;
  dailyQuestionsUsed: number;
  monthlyQuestionsUsed: number;
  questionsRemaining: number;
  isExhausted: boolean;
  lastResetDate: string;
}

export type LegalCategory =
  | 'ELECTRONIC_NOTARIZATION'
  | 'CIVIL_PROCEDURE'
  | 'DATA_PRIVACY'
  | 'GENERAL'
  | 'Court Rulings & Jurisprudence'
  | 'Electronic Notarization (A.M. No. 24-10-14-SC)'
  | 'Philippine Statutes & Regulations'
  | 'Consultation Preparation'
  | string;

export interface PreapprovedLegalQnA {
  id: string;
  question: string;
  triggerPhrase?: string;
  keywords?: string[];
  category: LegalCategory;
  answerText: string;
  sources?: LegalSourceCitation[];
  citations?: LegalSourceCitation[];
}
