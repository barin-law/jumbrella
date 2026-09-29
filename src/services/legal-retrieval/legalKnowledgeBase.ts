/**
 * JuriMbrella Assistant Legal Knowledge Retrieval Base
 * Grounded in Supreme Court of the Philippines issuances, Official Gazette statutes, and NPC regulations.
 */

import { LegalSourceCitation, PreapprovedLegalQnA } from '../../types/jurimbrella-assistant';

export const VERIFIED_LEGAL_SOURCES: LegalSourceCitation[] = [
  {
    id: 'src-am-24-10-14-sc',
    title: 'Rules on Electronic Notarization (A.M. No. 24-10-14-SC)',
    sourceType: 'ADMINISTRATIVE_ISSUANCE',
    issuingAuthority: 'Supreme Court of the Philippines En Banc',
    docketNumber: 'A.M. No. 24-10-14-SC',
    publicationDate: 'October 2024',
    url: 'https://sc.judiciary.gov.ph',
    summary: 'Governs accreditation of Electronic Notarization Facilities (ENF), video-conferencing hearings, digital signatures, cryptographic SHA-256 seals, and tamper-evident audit logs for notarial acts across Philippine judicial jurisdictions.',
    isVerified: true,
  },
  {
    id: 'src-ra-8792',
    title: 'Electronic Commerce Act of 2000 (Republic Act No. 8792)',
    sourceType: 'STATUTE',
    issuingAuthority: 'Congress of the Philippines',
    docketNumber: 'R.A. No. 8792',
    publicationDate: 'June 14, 2000',
    url: 'https://www.officialgazette.gov.ph/2000/06/14/republic-act-no-8792/',
    summary: 'Provides legal recognition to electronic data messages, electronic documents, and electronic signatures as the functional equivalent of paper-based writings in commercial and legal transactions.',
    isVerified: true,
  },
  {
    id: 'src-ra-10173',
    title: 'Data Privacy Act of 2012 (Republic Act No. 10173)',
    sourceType: 'STATUTE',
    issuingAuthority: 'Congress of the Philippines / National Privacy Commission',
    docketNumber: 'R.A. No. 10173',
    publicationDate: 'August 15, 2012',
    url: 'https://privacy.gov.ph/data-privacy-act/',
    summary: 'Regulates the processing of all types of personal information, data-subject rights, appointment of Data Protection Officers (DPO), and mandatory 72-hour breach notification procedures.',
    isVerified: true,
  },
  {
    id: 'src-am-02-8-13-sc',
    title: '2004 Rules on Notarial Practice (A.M. No. 02-8-13-SC)',
    sourceType: 'ADMINISTRATIVE_ISSUANCE',
    issuingAuthority: 'Supreme Court of the Philippines',
    docketNumber: 'A.M. No. 02-8-13-SC',
    publicationDate: 'August 1, 2004',
    url: 'https://sc.judiciary.gov.ph',
    summary: 'Establishes fundamental qualifications, duties, and protocols for Notaries Public, including jurats, acknowledgments, oaths, competence, and physical/electronic presence requirements.',
    isVerified: true,
  },
  {
    id: 'src-am-19-10-20-sc',
    title: '2019 Proposed Amendments to the 1997 Rules of Civil Procedure (A.M. No. 19-10-20-SC)',
    sourceType: 'COURT_RULING',
    issuingAuthority: 'Supreme Court of the Philippines En Banc',
    docketNumber: 'A.M. No. 19-10-20-SC',
    publicationDate: 'May 1, 2020',
    url: 'https://sc.judiciary.gov.ph',
    summary: 'Modernized judicial procedure, recognizing electronic service of summons, verified electronic filings, and authenticating electronic evidence in Philippine trial courts.',
    isVerified: true,
  },
];

export const PREAPPROVED_LEGAL_ANSWERS: PreapprovedLegalQnA[] = [
  {
    id: 'qna-sc-ruling',
    triggerPhrase: 'explain a philippine supreme court ruling',
    question: 'Explain a Philippine Supreme Court ruling',
    category: 'Court Rulings & Jurisprudence',
    answerText: `In Philippine jurisprudence, Supreme Court decisions form part of the law of the land pursuant to Article 8 of the Civil Code of the Philippines.

Key principles when reviewing a Supreme Court ruling:
1. Ratio Decidendi vs. Obiter Dictum: The ratio decidendi constitutes the binding legal holding that forms precedent (stare decisis). Comments made in passing (obiter dictum) do not create binding obligations.
2. Prospective vs. Retroactive Application: When doctrine is abandoned or overturned by the Supreme Court En Banc, the new rule is generally applied prospectively so as not to prejudice parties who relied on prior interpretations in good faith.
3. Verification with the Supreme Court E-Library: Always review the original decision text, promulgation date, and verify whether a motion for reconsideration was filed or whether the decision has attained finality with an Entry of Judgment.`,
    sources: [VERIFIED_LEGAL_SOURCES[4]],
  },
  {
    id: 'qna-enotary-requirements',
    triggerPhrase: 'what are the requirements for electronic notarization?',
    question: 'What are the requirements for electronic notarization?',
    category: 'Electronic Notarization (A.M. No. 24-10-14-SC)',
    answerText: `Under the Supreme Court Rules on Electronic Notarization (A.M. No. 24-10-14-SC), the statutory and technical requirements include:

1. Commissioned Electronic Notary Public (ENP): The lawyer must hold a valid, active notarial commission issued by the Executive Judge and accreditation for electronic notarization.
2. Accredited Electronic Notarization Facility (ENF): The act must be performed through an accredited secure facility featuring tamper-evident SHA-256 hash chains, encrypted audio-visual recording, and multi-factor authentication (MFA).
3. Personal Appearance via Secure Teleconference: Parties and instrumental witnesses must be in direct, uninhibited audio-visual contact during the entire notarial ceremony.
4. Competent Evidence of Identity: Government-issued identification containing the signatory's photograph and signature (such as the PhilSys National ID, Philippine Passport, PRC ID, or Driver's License) must be presented and verified before execution.
5. Voluntariness and Capacity: The ENP must independently evaluate that the principal understands the instrument, is acting voluntarily, and is free from duress or undue influence.`,
    sources: [VERIFIED_LEGAL_SOURCES[0], VERIFIED_LEGAL_SOURCES[1], VERIFIED_LEGAL_SOURCES[3]],
  },
  {
    id: 'qna-summarize-law',
    triggerPhrase: 'summarize a philippine law',
    question: 'Summarize a Philippine law',
    category: 'Philippine Statutes & Regulations',
    answerText: `To summarize any Philippine statute (such as Republic Acts, Batas Pambansa, or Presidential Decrees), the legal analysis systematically evaluates:

1. Title and Statutory Policy: The legislative intent and public policy objectives articulated in Section 2 of the Act.
2. Scope and Application: Whom the law governs, extraterritorial reach (if any), and statutory exemptions.
3. Core Rights and Obligations: Prescribed duties, compliance standards, and affirmative obligations for covered persons or corporations.
4. Enforcement & Regulatory Agency: The administrative body tasked with promulgating the Implementing Rules and Regulations (IRR).
5. Penal and Civil Sanctions: Fines, imprisonment, civil damages, or administrative penalties for non-compliance.
6. Effectivity Clause: Publication in the Official Gazette or two newspapers of general circulation (standard fifteen-day effectivity rule under Article 2 of the Civil Code).`,
    sources: [VERIFIED_LEGAL_SOURCES[1], VERIFIED_LEGAL_SOURCES[2]],
  },
  {
    id: 'qna-consultation-documents',
    triggerPhrase: 'what documents may be needed for a legal consultation?',
    question: 'What documents may be needed for a legal consultation?',
    category: 'Consultation Preparation',
    answerText: `To prepare effectively for a legal consultation with a Philippine lawyer, having organized documentation saves critical time and allows your counsel to provide accurate advice:

1. Government-Issued Identification: At least two valid government IDs (PhilSys ID, Passport, UMID, Driver's License, PRC ID).
2. The Primary Instruments in Dispute: Original or clear certified true copies of the contracts, deeds of sale, affidavits, leases, employment agreements, or promissory notes.
3. Formal Communications & Demand Letters: Relevant emails, letters, text exchanges, notices to vacate, notices of termination, or formal letters of demand.
4. Chronological Summary of Facts: A simple, factual 1-page timeline listing key dates, events, parties involved, and the specific relief or outcome you are seeking.
5. Official Receipts and Records: Proof of payments, bank transfers, titles (Transfer Certificates of Title), tax declarations, or police blotters if applicable.`,
    sources: [VERIFIED_LEGAL_SOURCES[3]],
  },
];
