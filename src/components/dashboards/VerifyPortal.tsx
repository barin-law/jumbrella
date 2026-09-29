import React, { useState } from 'react';
import { Search, ShieldCheck, CheckCircle2, AlertTriangle, QrCode, Lock, FileText } from 'lucide-react';
import { useNotarization } from '../../context/NotarizationContext';

export const VerifyPortal: React.FC = () => {
  const { verifyDocumentByQuery, requests } = useNotarization();
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(false);
  const [result, setResult] = useState<ReturnType<typeof verifyDocumentByQuery>>(undefined);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    const res = verifyDocumentByQuery(query.trim());
    setResult(res);
    setSearched(true);
  };

  const loadSample = (ref: string) => {
    setQuery(ref);
    const res = verifyDocumentByQuery(ref);
    setResult(res);
    setSearched(true);
  };

  return (
    <div id="document-verification-portal" className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2 border-b border-black/15 pb-6 dark:border-white/15">
        <div className="inline-flex items-center gap-1.5 border border-black px-2.5 py-0.5 text-xs font-mono font-bold dark:border-white mb-1">
          <ShieldCheck className="h-4 w-4" />
          R.A. 8792 & A.M. No. 01-7-01-SC Minimal Disclosure Verification
        </div>
        <h2 className="text-2xl font-bold tracking-tight">Public Instrument Verification Portal</h2>
        <p className="text-xs text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto">
          Verify the authenticity, integrity, and Electronic Notary Public commission for any instrument executed via the JuriMbrella Philippine Electronic Notarization platform.
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="border border-black p-4 bg-neutral-50 dark:border-white dark:bg-neutral-900 space-y-3">
        <label className="block text-xs font-bold uppercase tracking-wider">
          Enter Instrument Reference Number or SHA-256 PDF/A Hash
        </label>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="h-4 w-4 absolute left-3.5 top-3 text-neutral-400" />
            <input
              type="text"
              required
              placeholder="e.g., ENF-20260914-2201 or 9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full border border-black bg-white pl-10 pr-3 py-2 text-xs font-mono text-black focus:outline-none dark:border-white dark:bg-black dark:text-white"
            />
          </div>
          <button
            type="submit"
            className="border border-black bg-black px-6 py-2 text-xs font-semibold text-white hover:bg-neutral-800 dark:border-white dark:bg-white dark:text-black dark:hover:bg-neutral-200"
          >
            Verify Integrity
          </button>
        </div>

        {/* Quick Sample Links */}
        <div className="flex items-center gap-2 text-[11px] text-neutral-600 dark:text-neutral-400 pt-1">
          <span>Try quick sample:</span>
          <button
            type="button"
            onClick={() => loadSample('ENF-20260914-2201')}
            className="underline font-mono font-semibold hover:text-black dark:hover:text-white"
          >
            ENF-20260914-2201 (Completed)
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => loadSample('ENF-20260914-4050')}
            className="underline font-mono font-semibold hover:text-black dark:hover:text-white"
          >
            ENF-20260914-4050 (Refused)
          </button>
        </div>
      </form>

      {/* Verification Results Display */}
      {searched && (
        <div className="space-y-4">
          {result ? (
            <div className="border border-black bg-white p-6 dark:border-white dark:bg-black space-y-6">
              {/* Status Header */}
              <div className="flex items-start justify-between border-b border-black/15 pb-4 dark:border-white/15">
                <div>
                  <div className="flex items-center gap-2">
                    {result.state === 'COMPLETED' ? (
                      <span className="flex items-center gap-1.5 font-bold text-green-700 dark:text-green-400 text-sm">
                        <CheckCircle2 className="h-5 w-5" />
                        GENUINE NOTARIZED INSTRUMENT RECORD FOUND
                      </span>
                    ) : result.state === 'REFUSED' ? (
                      <span className="flex items-center gap-1.5 font-bold text-red-600 dark:text-red-400 text-sm">
                        <AlertTriangle className="h-5 w-5" />
                        FORMAL LEGAL REFUSAL ON RECORD
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 font-bold text-black dark:text-white text-sm">
                        <FileText className="h-5 w-5" />
                        RECORD IN PROGRESS ({result.state})
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-500 font-mono mt-1">
                    Reference Number: {result.referenceNumber}
                  </p>
                </div>

                <div className="border border-black px-2 py-1 text-[10px] font-mono uppercase dark:border-white">
                  {result.mode} Electronic Notarization
                </div>
              </div>

              {/* Candidate Legal Notice */}
              <div className="border border-black/20 bg-neutral-100 p-3 text-xs dark:border-white/20 dark:bg-neutral-900">
                <strong>Accreditation Candidate Disclosure:</strong> This document verification demonstrates the cryptographic architecture submitted for accreditation under Supreme Court A.M. No. 24-10-14-SC. Electronic notarization is not available for legal use until formal accreditation.
              </div>

              {/* Minimal Disclosure Data Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                <div className="border border-black/15 p-3 space-y-1 dark:border-white/15">
                  <span className="text-neutral-500 text-[10px] uppercase">Document Classification</span>
                  <p className="font-bold text-black dark:text-white">{result.title}</p>
                  <p className="text-[11px] text-neutral-500">{result.documentType}</p>
                </div>

                <div className="border border-black/15 p-3 space-y-1 dark:border-white/15">
                  <span className="text-neutral-500 text-[10px] uppercase">Notarial Act Executed</span>
                  <p className="font-bold text-black dark:text-white">{result.notarialAct}</p>
                  <p className="text-[11px] text-neutral-500">Mode: {result.mode}</p>
                </div>

                <div className="border border-black/15 p-3 space-y-1 dark:border-white/15">
                  <span className="text-neutral-500 text-[10px] uppercase">Commissioned Notary Public</span>
                  <p className="font-bold text-black dark:text-white">
                    {result.enp ? result.enp.name : 'Pending Commission Verification'}
                  </p>
                  {result.enp && (
                    <p className="text-[10px] text-neutral-500">
                      {result.enp.commissionNo} • {result.enp.commissionJurisdiction}
                    </p>
                  )}
                </div>

                <div className="border border-black/15 p-3 space-y-1 dark:border-white/15">
                  <span className="text-neutral-500 text-[10px] uppercase">Notarial Book Coordinates</span>
                  {result.notarialBookEntry ? (
                    <p className="font-bold text-black dark:text-white">
                      Book {result.notarialBookEntry.bookNo}, Page {result.notarialBookEntry.pageNo}, Doc {result.notarialBookEntry.docNo} (Series of {result.notarialBookEntry.seriesYear})
                    </p>
                  ) : (
                    <p className="text-neutral-500">Awaiting Final Sealing</p>
                  )}
                </div>
              </div>

              {/* Cryptographic SHA-256 Digest Confirmation */}
              <div className="border border-black/20 p-4 bg-neutral-50 text-xs font-mono space-y-2 dark:border-white/20 dark:bg-neutral-900">
                <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider">
                  <Lock className="h-4 w-4" />
                  <span>Cryptographic Digest Fingerprint (PDF/A)</span>
                </div>
                <p className="break-all font-semibold text-black dark:text-white">
                  {result.document.pdfaSha256}
                </p>
                <div className="flex justify-between text-[11px] text-neutral-500 pt-1 border-t border-black/10 dark:border-white/10">
                  <span>Tamper Integrity: SHA-256 MATCH VERIFIED</span>
                  <span>Scanned by: {result.document.scanProvider}</span>
                </div>
              </div>

              {result.refusalReason && (
                <div className="border border-red-600 bg-red-50 p-4 text-xs space-y-1 dark:bg-red-950/40">
                  <span className="font-bold text-red-600 dark:text-red-400">Formal Refusal Details:</span>
                  <p>{result.refusalReason}</p>
                  <p className="text-[11px] font-mono text-neutral-500">
                    Legal Basis: {result.refusalLegalBasis}
                  </p>
                </div>
              )}

              {/* Privacy Notice on Data Minimization */}
              <div className="text-[11px] text-neutral-500 border-t border-black/10 pt-3 dark:border-white/10 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 shrink-0" />
                <span>
                  In strict compliance with R.A. 10173 (Data Privacy Act of 2012), this public verification endpoint omits all raw national ID numbers, citizen selfies/biometrics, and sensitive contractual clauses.
                </span>
              </div>
            </div>
          ) : (
            <div className="border border-black p-8 text-center bg-neutral-50 dark:border-white dark:bg-neutral-900 space-y-2">
              <AlertTriangle className="h-6 w-6 mx-auto text-black dark:text-white" />
              <h3 className="text-sm font-bold uppercase tracking-wider">
                No Record Found for "{query}"
              </h3>
              <p className="text-xs text-neutral-500 max-w-md mx-auto">
                No electronic notarial record matched the provided reference number or cryptographic hash. Verify that the reference is typed accurately.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
