/**
 * JuriMbrella — Philippine Electronic Notarization
 * Client Notarization Ceremony, Seals, Canonical SHA-256 & QR Code Verification
 * Supreme Court A.M. No. 24-10-14-SC Demonstration Mode
 */

import React, { useState } from 'react';
import {
  Stamp,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Download,
  Copy,
  Check,
  ExternalLink,
  Lock,
  RefreshCw,
} from 'lucide-react';
import { useClientCase } from '../../../context/ClientCaseContext';
import { StatusBadge } from '../../common/StatusBadge';

interface ClientNotarizationSectionProps {
  activeSubModule: string;
  onNavigateModule: (moduleId: string) => void;
}

export const ClientNotarizationSection: React.FC<ClientNotarizationSectionProps> = ({
  activeSubModule,
  onNavigateModule,
}) => {
  const {
    activeCase,
    signActiveCaseDocument,
    finalizeCaseNotarization,
  } = useClientCase();

  const [signing, setSigning] = useState(false);
  const [finalizing, setFinalizing] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);

  if (!activeCase) {
    return (
      <div className="border border-black/15 bg-white p-6 dark:border-white/15 dark:bg-neutral-950 text-xs">
        Please select or create an active case to access notarization modules.
      </div>
    );
  }

  const handleSign = async () => {
    setSigning(true);
    try {
      await signActiveCaseDocument(activeCase.caseId);
    } finally {
      setSigning(false);
    }
  };

  const handleFinalizeNotarization = async () => {
    setFinalizing(true);
    try {
      await finalizeCaseNotarization(activeCase.caseId);
    } finally {
      setFinalizing(false);
    }
  };

  const handleCopyHash = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 3000);
  };

  const outcome = activeCase.notarialOutcome;

  return (
    <div className="space-y-5 text-xs">
      {/* Case Header */}
      <div className="border border-black/20 bg-white p-4 dark:border-white/20 dark:bg-neutral-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <span className="text-[10px] font-mono uppercase text-neutral-500">
            Electronic Notarial Proceeding
          </span>
          <h4 className="text-sm font-bold text-black dark:text-white">
            {activeCase.caseReference} • {activeCase.title}
          </h4>
        </div>
        <StatusBadge status={activeCase.status} size="sm" />
      </div>

      {/* SUB-VIEW ROUTING */}
      {activeSubModule === 'principal-hash-qr' || activeSubModule === 'principal-completed-docs' ? (
        /* HASH & QR CODE VERIFICATION VIEW (Section 33) */
        <div className="border border-black/15 bg-white p-6 dark:border-white/15 dark:bg-neutral-950 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/10 pb-3 dark:border-white/10">
            <div>
              <h3 className="text-sm font-bold text-black dark:text-white">
                Canonical SHA-256 Hash & QR Verification
              </h3>
              <p className="text-xs text-neutral-500">
                Official verification record embedded in the final electronic instrument.
              </p>
            </div>
            <StatusBadge status="CANONICAL SHA-256" variant="success" size="sm" />
          </div>

          {outcome ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left 2 Cols: Hash and Register Details */}
              <div className="md:col-span-2 space-y-4">
                <div className="border border-black/10 p-4 bg-neutral-50 dark:border-white/10 dark:bg-neutral-900 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs">Canonical Document Digest</span>
                    <button
                      onClick={() => handleCopyHash(outcome.canonicalSha256)}
                      className="flex items-center gap-1 border border-black/20 bg-white px-2 py-1 text-[11px] hover:bg-neutral-100 dark:border-white/20 dark:bg-black cursor-pointer"
                    >
                      {copiedHash ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                      <span>{copiedHash ? 'Copied' : 'Copy Hash'}</span>
                    </button>
                  </div>
                  <div className="p-2.5 bg-white dark:bg-black border border-black/15 font-mono text-[11px] break-all leading-relaxed">
                    {outcome.canonicalSha256}
                  </div>
                  <p className="text-[10px] text-neutral-500 font-sans">
                    Generated via standard W3C WebCrypto API SHA-256 algorithm over the final canonicalized PDF/A payload.
                  </p>
                </div>

                {/* Notarial Register Entry */}
                <div className="border border-black/10 p-4 bg-neutral-50 dark:border-white/10 dark:bg-neutral-900 space-y-2 font-mono text-xs">
                  <h4 className="font-bold font-sans text-xs mb-2">Supreme Court Notarial Register Record</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-neutral-500 text-[10px] block">Public Reference:</span>
                      <span className="font-bold">{outcome.publicReference}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 text-[10px] block">Notarial Act:</span>
                      <span>{outcome.notarialAct}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 text-[10px] block">Commissioned ENP:</span>
                      <span>{outcome.enpName}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 text-[10px] block">Commission Number:</span>
                      <span>{outcome.enpCommissionNo}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 text-[10px] block">Register Coordinates:</span>
                      <span>
                        Book {outcome.notarialBookEntry?.bookNo || 14}, Page {outcome.notarialBookEntry?.pageNo || 89}, Doc #{outcome.notarialBookEntry?.docNo || 413}, Series of {outcome.notarialBookEntry?.seriesYear || 2026}
                      </span>
                    </div>
                    <div>
                      <span className="text-neutral-500 text-[10px] block">Completion Timestamp:</span>
                      <span>{new Date(outcome.completedAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 border border-dashed border-black/30 text-center font-mono text-[10px] text-neutral-500">
                  DEMONSTRATION NOTARIAL OUTPUT — NOT LEGALLY VALID
                </div>
              </div>

              {/* Right Col: Visual QR Code */}
              <div className="border border-black/20 p-5 bg-neutral-50 dark:border-white/20 dark:bg-neutral-900 flex flex-col items-center justify-between text-center space-y-4">
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider">
                    Verification QR Code
                  </h4>
                  <p className="text-[10px] text-neutral-500 mt-0.5">
                    Scan with any standard smartphone camera or eGovPH app.
                  </p>
                </div>

                {/* Visual Representation of QR Code */}
                <div className="p-3 bg-white border border-black shadow-md">
                  <div className="w-36 h-36 border-2 border-black flex flex-col items-center justify-center p-2 relative">
                    <QrCode className="h-28 w-28 text-black" />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className="border border-black bg-white px-1 text-[8px] font-bold font-mono">
                        JURIMBRELLA
                      </span>
                    </div>
                  </div>
                </div>

                <div className="w-full space-y-2">
                  <a
                    href={`/verify?token=${outcome.verificationQrToken}&hash=${outcome.canonicalSha256}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full flex items-center justify-center gap-1.5 border border-black bg-black py-2 text-xs font-semibold text-white hover:bg-neutral-800 dark:border-white dark:bg-white dark:text-black cursor-pointer"
                  >
                    <span>Test Public Portal Verification</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                  <div className="font-mono text-[9px] text-neutral-400 break-all">
                    Token: {outcome.verificationQrToken}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 border border-dashed border-black/20 text-center space-y-3">
              <p className="text-neutral-500">
                This case has not yet completed the signing ceremony and ENP sealing process.
              </p>
              <button
                onClick={() => onNavigateModule('principal-signing-session')}
                className="border border-black bg-black px-4 py-2 font-semibold text-white hover:bg-neutral-800 dark:border-white dark:bg-white dark:text-black cursor-pointer"
              >
                Proceed to Signing Session
              </button>
            </div>
          )}
        </div>
      ) : (
        /* SIGNING CEREMONY WORKSPACE (Default View) */
        <div className="border border-black/15 bg-white p-5 dark:border-white/15 dark:bg-neutral-950 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/10 pb-3 dark:border-white/10">
            <div>
              <h3 className="text-sm font-bold text-black dark:text-white">
                Interactive Signing & Appearance Ceremony
              </h3>
              <p className="text-xs text-neutral-500">
                Phase 3: Real-time electronic signature affixation and digital notarial seal execution.
              </p>
            </div>
            <span className="font-mono text-[10px] border border-black/20 px-2 py-0.5">
              Rule 6 A.M. No. 24-10-14-SC
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left 2 Cols: Document Viewer with Watermark */}
            <div className="md:col-span-2 border border-black/20 p-5 bg-neutral-50 dark:border-white/20 dark:bg-neutral-900 space-y-4">
              <div className="flex items-center justify-between border-b border-black/10 pb-2 dark:border-white/10">
                <span className="font-bold text-xs uppercase tracking-wider">
                  Document Instrument Preview (PDF/A)
                </span>
                <span className="font-mono text-[10px] text-neutral-500">
                  Version 1.1 • Final Draft
                </span>
              </div>

              {/* Synchronized Document Canvas */}
              <div className="relative bg-white p-6 border border-neutral-300 min-h-[300px] text-xs font-serif leading-relaxed dark:bg-black dark:border-neutral-700 text-black dark:text-white space-y-3">
                {/* Prominent Demo Watermark */}
                <div className="absolute top-3 right-3 border border-black bg-black px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white dark:border-white dark:bg-white dark:text-black">
                  DEMO — NOT LEGALLY VALID
                </div>

                <div className="text-center font-bold tracking-wider uppercase border-b pb-2">
                  REPUBLIC OF THE PHILIPPINES) S.S.
                  <br />
                  CITY OF MAKATI)
                </div>

                <p className="font-bold text-center underline uppercase">
                  {activeCase.title}
                </p>

                <p>
                  KNOW ALL MEN BY THESE PRESENTS: That I, <strong>Maria Elena Santos</strong>, of legal age, Filipino citizen, married, with residence at Makati City, Philippines, do hereby name, constitute, and appoint the Attorney-in-Fact herein authorized to perform acts of administration and legal representation...
                </p>

                <p className="italic text-[11px]">
                  IN WITNESS WHEREOF, the Principal has hereunto affixed her electronic digital signature this 20th day of March 2026.
                </p>

                {/* Signature Box */}
                <div className="mt-4 pt-3 border-t border-dashed border-black/20">
                  {activeCase.status === 'COMPLETED' || activeCase.status === 'IN_CEREMONY' ? (
                    <div className="p-3 border border-black bg-neutral-100 dark:border-white dark:bg-neutral-800 font-mono text-[11px]">
                      <div className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>DIGITAL SIGNATURE AFFIXED (DEMO — NOT LEGALLY VALID)</span>
                      </div>
                      <div className="text-[10px] text-neutral-500 mt-1">
                        Signer: Maria Elena Santos • PhilSys Token Validated • Timestamp: {new Date().toLocaleTimeString()}
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 border border-dashed border-black/30 text-center text-neutral-400 text-xs">
                      [Digital Signature Box — Awaiting Principal Execution]
                    </div>
                  )}
                </div>

                {/* Notarial Seal Graphic if Completed */}
                {activeCase.status === 'COMPLETED' && (
                  <div className="mt-4 border-2 border-black p-4 bg-white dark:bg-black dark:border-white text-center space-y-1 font-mono">
                    <div className="flex items-center justify-center gap-1.5 text-xs font-bold uppercase">
                      <Stamp className="h-4 w-4" />
                      <span>OFFICIAL ELECTRONIC NOTARIAL SEAL (DEMONSTRATION)</span>
                    </div>
                    <p className="text-[10px] text-neutral-600 dark:text-neutral-400">
                      Atty. Juan Dela Cruz • Commission NP-2025-0814-MKT
                    </p>
                    <p className="text-[9px] text-neutral-500">
                      Book XIV, Page 89, Doc #413, Series of 2026 • RTC Makati City
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Col: Actions & Pre-signing Re-verification Checklist */}
            <div className="space-y-4">
              <div className="border border-black/15 p-4 bg-neutral-50 dark:border-white/15 dark:bg-neutral-900 space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider">
                  Ceremony Checklist
                </h4>
                <div className="space-y-2 text-[11px]">
                  <div className="flex items-center justify-between border-b border-black/10 pb-1 dark:border-white/10">
                    <span>Identity Re-verification:</span>
                    <span className="font-bold text-emerald-600">✓ Step-Up Passed</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-black/10 pb-1 dark:border-white/10">
                    <span>Active Video Appearance:</span>
                    <span className="font-bold text-emerald-600">✓ In Hearing Room</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-black/10 pb-1 dark:border-white/10">
                    <span>Witness Appearance:</span>
                    <span className="font-bold text-emerald-600">✓ Authorized</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-black/10 pb-1 dark:border-white/10">
                    <span>Presiding ENP:</span>
                    <span>Atty. Juan Dela Cruz</span>
                  </div>
                </div>
              </div>

              {/* Ceremony Execution Buttons */}
              <div className="border border-black/15 p-4 bg-neutral-50 dark:border-white/15 dark:bg-neutral-900 space-y-3">
                <h4 className="font-bold text-xs">Execute Actions</h4>

                {activeCase.status !== 'COMPLETED' ? (
                  <>
                    <button
                      onClick={handleSign}
                      disabled={signing}
                      className="w-full border border-black bg-black py-2.5 text-xs font-semibold text-white hover:bg-neutral-800 dark:border-white dark:bg-white dark:text-black cursor-pointer disabled:opacity-50"
                    >
                      {signing ? 'Affixing Digital Signature...' : 'Affix Principal Digital Signature'}
                    </button>

                    <button
                      onClick={handleFinalizeNotarization}
                      disabled={finalizing}
                      className="w-full border border-black/20 bg-white py-2.5 text-xs font-semibold hover:bg-neutral-100 dark:border-white/20 dark:bg-black cursor-pointer disabled:opacity-50"
                    >
                      {finalizing ? 'Applying ENP Seal...' : 'Complete Ceremony & Apply Notarial Seal'}
                    </button>
                  </>
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={() => onNavigateModule('principal-hash-qr')}
                      className="w-full flex items-center justify-center gap-1.5 border border-black bg-black py-2.5 text-xs font-semibold text-white hover:bg-neutral-800 dark:border-white dark:bg-white dark:text-black cursor-pointer"
                    >
                      <QrCode className="h-3.5 w-3.5" />
                      <span>View Canonical Hash & QR Code</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
