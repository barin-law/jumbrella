import React, { useState } from 'react';
import { PageHeader } from '../common/PageHeader';
import { SummaryCard } from '../common/SummaryCard';
import { StatusBadge } from '../common/StatusBadge';
import { DetailsDrawer } from '../common/DetailsDrawer';
import { ConfirmationDialog } from '../common/ConfirmationDialog';
import {
  Stamp,
  ShieldCheck,
  AlertCircle,
  FileCheck2,
  XCircle,
  KeyRound,
  Eye,
  CheckCircle,
  Video,
  FileText,
  BookOpen,
  Calendar,
  AlertTriangle,
  Scale,
  Award,
  Search,
  CheckSquare,
  Square,
  Sparkles,
} from 'lucide-react';
import { useNotarization } from '../../context/NotarizationContext';
import { useAuth } from '../../context/AuthContext';
import { NotarizationRequest } from '../../types';
import { truncateHash } from '../../utils/crypto';

interface EnpDashboardProps {
  activeModuleId: string;
  onSelectModule: (id: string) => void;
}

export const EnpDashboard: React.FC<EnpDashboardProps> = ({
  activeModuleId,
  onSelectModule,
}) => {
  const { requests, applyDemoSeal, recordRefusal, updateState } = useNotarization();
  const { currentUser } = useAuth();

  const [selectedReq, setSelectedReq] = useState<NotarizationRequest | null>(null);
  const [ceremonyModalOpen, setCeremonyModalOpen] = useState(false);
  const [refusalModalOpen, setRefusalModalOpen] = useState(false);
  const [refusalReason, setRefusalReason] = useState('');
  const [refusalLegalBasis, setRefusalLegalBasis] = useState(
    'Supreme Court A.M. No. 24-10-14-SC, Rule II, Section 3(b) (Prohibited Instruments)'
  );
  const [actionMessage, setActionMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [processing, setProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Remote Ceremony Checklist items
  const [checklist, setChecklist] = useState({
    identityConfirmed: false,
    voluntaryExecution: false,
    documentUnderstood: false,
    jurisdictionConfirmed: false,
    witnessPresent: false,
  });

  const toggleChecklist = (key: keyof typeof checklist) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const allChecklistCompleted = Object.values(checklist).every(Boolean);

  const pendingRequests = requests.filter(
    (r) => r.state !== 'COMPLETED' && r.state !== 'REFUSED' && r.state !== 'CANCELLED'
  );
  const completedRequests = requests.filter((r) => r.state === 'COMPLETED');
  const refusedRequests = requests.filter((r) => r.state === 'REFUSED');

  const handleApplyDemoSeal = async () => {
    if (!selectedReq) return;
    setProcessing(true);
    setActionMessage(null);

    try {
      const result = await applyDemoSeal(selectedReq.id, currentUser.uid);
      if (result.success) {
        setActionMessage({ text: result.message, isError: false });
        // Refresh current selected req to show completed status
        const updated = requests.find((r) => r.id === selectedReq.id);
        if (updated) setSelectedReq({ ...updated, state: 'COMPLETED' });
      } else {
        setActionMessage({ text: result.message, isError: true });
      }
    } finally {
      setProcessing(false);
    }
  };

  const handleRecordRefusal = async () => {
    if (!selectedReq || !refusalReason.trim()) return;
    setProcessing(true);
    try {
      await recordRefusal(selectedReq.id, refusalReason, refusalLegalBasis);
      setRefusalModalOpen(false);
      setSelectedReq(null);
      setCeremonyModalOpen(false);
      setActionMessage({ text: 'Formal notarial refusal recorded with legal citation.', isError: false });
    } finally {
      setProcessing(false);
    }
  };

  const filteredQueue = requests.filter((r) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        r.referenceNumber.toLowerCase().includes(q) ||
        r.title.toLowerCase().includes(q) ||
        r.documentType.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div id="enp-dashboard-view" className="space-y-6">
      <PageHeader
        breadcrumbs={[{ label: 'Notarial Chambers' }, { label: 'Electronic Notary Public (ENP) Workspace', active: true }]}
        title="Electronic Notary Public (ENP) Workspace"
        purpose="Review intake submissions, conduct synchronous videoconference hearings, execute electronic notarial seals, maintain the electronic notarial register, and record formal refusals."
        statusBadge={<StatusBadge status="COMMISSIONED ENP" variant="info" />}
        primaryAction={{
          label: 'Admit to Waiting Room',
          icon: Video,
          onClick: () => {
            const firstPending = pendingRequests[0] || requests[0];
            if (firstPending) {
              setSelectedReq(firstPending);
              setCeremonyModalOpen(true);
            }
          },
        }}
        secondaryActions={[
          {
            label: 'Electronic Notarial Register',
            icon: BookOpen,
            onClick: () => onSelectModule('enp-register'),
          },
          {
            label: 'Record Formal Refusal',
            icon: XCircle,
            onClick: () => {
              const firstPending = pendingRequests[0] || requests[0];
              if (firstPending) {
                setSelectedReq(firstPending);
                setRefusalModalOpen(true);
              }
            },
          },
        ]}
      />

      {actionMessage && (
        <div
          className={`border p-3 text-xs ${
            actionMessage.isError
              ? 'border-red-500 bg-red-50 text-red-900 dark:bg-red-950/40 dark:text-red-300'
              : 'border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300'
          }`}
        >
          {actionMessage.text}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          label="Intake Queue"
          value={pendingRequests.length}
          subtext="Awaiting hearing / review"
          icon={FileText}
        />
        <SummaryCard
          label="Notarial Register Entries"
          value={completedRequests.length + 412}
          subtext="Book XIV, Series of 2026"
          icon={BookOpen}
          trend={{ value: 'Sequential Doc #413 next', positive: true }}
        />
        <SummaryCard
          label="Formal Refusals"
          value={refusedRequests.length}
          subtext="Exclusions & non-compliance"
          icon={XCircle}
          trend={{ value: 'Statutory compliance', positive: true }}
        />
        <SummaryCard
          label="RTC Commission"
          value="Makati RTC 138"
          subtext="Expires Dec 31, 2026"
          icon={Scale}
        />
      </div>

      {/* Notarial Safeguard Notice */}
      <div className="border border-black/15 bg-neutral-50 p-4 dark:border-white/15 dark:bg-neutral-950 text-xs">
        <div className="flex items-start gap-2.5">
          <Stamp className="h-4 w-4 text-neutral-600 dark:text-neutral-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-neutral-600 dark:text-neutral-400">
            <p className="font-semibold text-black dark:text-white">
              Demonstration Environment: Notarial Commission NP-2025-0814-MKT
            </p>
            <p>
              Under Supreme Court A.M. No. 24-10-14-SC, electronic notarization requires accredited Cloud HSM key management and live judicial registry syncing. In this accreditation staging environment, completed certificates are generated with demonstrative watermarks: <strong>DEMO — NOT A LEGALLY NOTARIZED DOCUMENT</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* SUB-VIEWS */}
      {activeModuleId === 'enp-register' ? (
        /* Electronic Notarial Register (Rule VI) */
        <div className="border border-black/15 bg-white p-5 dark:border-white/15 dark:bg-neutral-950 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-black dark:text-white">
                Electronic Notarial Register (Rule VI, A.M. No. 24-10-14-SC)
              </h3>
              <p className="text-xs text-neutral-500">
                Official chronologically sequential register of all electronic notarial acts, parties, document hashes, and fees.
              </p>
            </div>
            <StatusBadge status="CHRONOLOGICAL REGISTER" variant="info" size="sm" />
          </div>

          <div className="overflow-x-auto pt-2">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-black/20 bg-neutral-50 text-[11px] font-semibold text-neutral-600 dark:border-white/20 dark:bg-neutral-900 dark:text-neutral-400">
                <tr>
                  <th className="p-2.5">Book Entry</th>
                  <th className="p-2.5">Instrument Title</th>
                  <th className="p-2.5">Principal / Parties</th>
                  <th className="p-2.5">Notarial Act</th>
                  <th className="p-2.5">PDF/A Hash (SHA-256)</th>
                  <th className="p-2.5">Fee</th>
                  <th className="p-2.5 text-right">Register Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/10 dark:divide-white/10 font-mono text-[11px]">
                {completedRequests.map((r, i) => (
                  <tr key={r.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50">
                    <td className="p-2.5 font-bold">
                      Doc #{410 + i}, Page 89, Book XIV, S. 2026
                    </td>
                    <td className="p-2.5 font-sans font-medium">{r.title}</td>
                    <td className="p-2.5 font-sans">{r.requester.name}</td>
                    <td className="p-2.5 font-sans">{r.notarialAct}</td>
                    <td className="p-2.5 truncate max-w-[140px] text-neutral-500">
                      {r.document.pdfaSha256}
                    </td>
                    <td className="p-2.5 font-sans">₱500.00</td>
                    <td className="p-2.5 text-right font-sans">
                      <StatusBadge status="SEALED_DEMO" variant="demo" size="sm" />
                    </td>
                  </tr>
                ))}
                {/* Seeded prior entries for realism */}
                <tr className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50">
                  <td className="p-2.5 font-bold">Doc #409, Page 88, Book XIV, S. 2026</td>
                  <td className="p-2.5 font-sans font-medium">Deed of Absolute Sale (Condominium)</td>
                  <td className="p-2.5 font-sans">Eduardo Ramos Jr.</td>
                  <td className="p-2.5 font-sans">ACKNOWLEDGMENT</td>
                  <td className="p-2.5 truncate max-w-[140px] text-neutral-500">
                    7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b
                  </td>
                  <td className="p-2.5 font-sans">₱1,200.00</td>
                  <td className="p-2.5 text-right font-sans">
                    <StatusBadge status="RECORDED" variant="success" size="sm" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : activeModuleId === 'enp-refusals' ? (
        /* Formal Refusals Register */
        <div className="border border-black/15 bg-white p-5 dark:border-white/15 dark:bg-neutral-950 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-black dark:text-white">
                Formal Notarial Refusals Log (A.M. No. 24-10-14-SC)
              </h3>
              <p className="text-xs text-neutral-500">
                Records of instruments where notarization was refused due to statutory exclusions, defective identity, or coercion.
              </p>
            </div>
            <StatusBadge status="MANDATORY REFUSAL" variant="error" size="sm" />
          </div>

          <div className="overflow-x-auto pt-2">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-black/20 bg-neutral-50 text-[11px] font-semibold text-neutral-600 dark:border-white/20 dark:bg-neutral-900 dark:text-neutral-400">
                <tr>
                  <th className="p-2.5">Filing Ref</th>
                  <th className="p-2.5">Instrument Title</th>
                  <th className="p-2.5">Principal</th>
                  <th className="p-2.5">Statutory Legal Basis</th>
                  <th className="p-2.5">Refusal Reason</th>
                  <th className="p-2.5 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/10 dark:divide-white/10 font-mono text-[11px]">
                {refusedRequests.map((r) => (
                  <tr key={r.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50">
                    <td className="p-2.5 font-bold">{r.referenceNumber}</td>
                    <td className="p-2.5 font-sans font-medium">{r.title}</td>
                    <td className="p-2.5 font-sans">{r.requester.name}</td>
                    <td className="p-2.5 font-sans text-red-600 dark:text-red-400">
                      {r.refusalLegalBasis || 'A.M. No. 24-10-14-SC Rule II Sec 3'}
                    </td>
                    <td className="p-2.5 font-sans max-w-xs">{r.refusalReason}</td>
                    <td className="p-2.5 text-right font-sans">
                      {new Date(r.refusalTimestamp || r.updatedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Default: ENP Intake Queue & Active Hearings */
        <div className="border border-black/15 bg-white p-5 dark:border-white/15 dark:bg-neutral-950 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-black/10 pb-3 dark:border-white/10">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-black dark:text-white">
                Chamber Intake Queue & Hearing Summons
              </h3>
              <span className="text-xs font-mono text-neutral-500">
                ({filteredQueue.length} matters)
              </span>
            </div>

            <div className="relative w-56">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search matter or principal..."
                className="w-full border border-black/20 bg-white py-1.5 pl-8 pr-2.5 text-xs dark:border-white/20 dark:bg-black"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-black/20 bg-neutral-50 text-[11px] font-semibold text-neutral-600 dark:border-white/20 dark:bg-neutral-900 dark:text-neutral-400">
                <tr>
                  <th className="p-2.5">Reference No.</th>
                  <th className="p-2.5">Instrument Title</th>
                  <th className="p-2.5">Principal</th>
                  <th className="p-2.5">Mode & Act</th>
                  <th className="p-2.5">State</th>
                  <th className="p-2.5 text-right">Chamber Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/10 dark:divide-white/10 font-mono text-[11px]">
                {filteredQueue.map((req) => (
                  <tr key={req.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50">
                    <td className="p-2.5 font-bold">{req.referenceNumber}</td>
                    <td className="p-2.5 font-sans">
                      <div className="font-semibold text-black dark:text-white">{req.title}</div>
                      <div className="text-[10px] text-neutral-500">{req.documentType}</div>
                    </td>
                    <td className="p-2.5 font-sans">{req.requester.name}</td>
                    <td className="p-2.5 font-sans">
                      <span className="font-semibold">{req.mode}</span> • {req.notarialAct}
                    </td>
                    <td className="p-2.5">
                      <StatusBadge status={req.state} size="sm" />
                    </td>
                    <td className="p-2.5 text-right font-sans space-x-1">
                      <button
                        onClick={() => setSelectedReq(req)}
                        className="border border-black/20 px-2 py-1 text-[11px] hover:bg-neutral-100 dark:border-white/20 dark:hover:bg-neutral-900"
                      >
                        Inspect
                      </button>
                      <button
                        onClick={() => {
                          setSelectedReq(req);
                          setCeremonyModalOpen(true);
                        }}
                        className="border border-black bg-black px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-neutral-800 dark:border-white dark:bg-white dark:text-black cursor-pointer"
                      >
                        Preside Hearing
                      </button>
                      <button
                        onClick={() => {
                          setSelectedReq(req);
                          setRefusalModalOpen(true);
                        }}
                        className="border border-red-600 px-2 py-1 text-[11px] text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                      >
                        Refuse
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Interactive REN Hearing & Ceremony Modal */}
      {ceremonyModalOpen && selectedReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
          <div className="w-full max-w-5xl border border-black bg-white p-6 shadow-2xl max-h-[92vh] overflow-y-auto dark:border-white dark:bg-black space-y-6">
            <div className="flex items-center justify-between border-b border-black/15 pb-3 dark:border-white/15">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-500">
                  Judicial Notarial Hearing Chamber • {selectedReq.referenceNumber}
                </span>
                <h3 className="text-base font-bold">
                  Presiding: {currentUser.name} • RTC Makati Commission NP-2025-0814-MKT
                </h3>
              </div>
              <button
                onClick={() => setCeremonyModalOpen(false)}
                className="border border-black px-2.5 py-1 text-xs hover:bg-neutral-100 dark:border-white dark:hover:bg-neutral-900 cursor-pointer"
              >
                ✕ Close Chamber
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left 2 Cols: Document Viewer & Certificate */}
              <div className="lg:col-span-2 border border-black/20 p-5 bg-neutral-50 space-y-4 dark:border-white/20 dark:bg-neutral-900">
                <div className="flex items-center justify-between border-b border-black/10 pb-2 dark:border-white/10">
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Instrument Under Notarial Review
                  </span>
                  <span className="text-[10px] font-mono text-neutral-500">
                    PDF/A-1b Confirmed
                  </span>
                </div>

                <div className="relative bg-white p-6 border border-neutral-300 min-h-[300px] text-xs font-serif leading-relaxed dark:bg-black dark:border-neutral-700 text-black dark:text-white space-y-3">
                  <div className="text-center font-bold tracking-wider uppercase border-b pb-2">
                    REPUBLIC OF THE PHILIPPINES) S.S.
                    <br />
                    CITY OF MAKATI)
                  </div>
                  <p className="font-bold text-center underline">{selectedReq.title}</p>
                  <p>
                    BEFORE ME, an Electronic Notary Public in and for the City of Makati, personally appeared{' '}
                    <strong>{selectedReq.requester.name}</strong>, who exhibited competent evidence of identity...
                  </p>

                  <div className="pt-3 border-t border-dashed space-y-1 font-mono text-[11px]">
                    <p>INSTRUMENT SHA-256: {selectedReq.document.pdfaSha256}</p>
                    <p>NOTARIAL ACT: {selectedReq.notarialAct}</p>
                    <p>PRINCIPAL: {selectedReq.requester.name} ({selectedReq.requester.email})</p>
                  </div>

                  {selectedReq.state === 'COMPLETED' && (
                    <div className="mt-4 border-2 border-dashed border-black p-5 text-center dark:border-white bg-neutral-50 dark:bg-neutral-900 font-mono space-y-2">
                      <div className="text-xs font-bold uppercase tracking-wider text-black dark:text-white">
                        DEMO — NOT A LEGALLY NOTARIZED DOCUMENT
                      </div>
                      <p className="text-[11px] text-neutral-600 dark:text-neutral-300">
                        Electronic Notary Public: Atty. Juan Dela Cruz (Candidate)
                      </p>
                      <p className="text-[10px] text-neutral-500">
                        Commission NP-2025-0814-MKT • RTC Makati City Branch 138
                        <br />
                        Notarial Register: Doc No. 413, Page No. 89, Book No. XIV, Series of 2026
                        <br />
                        Digital Seal Hash: {selectedReq.document.pdfaSha256.slice(0, 32)}...
                      </p>
                    </div>
                  )}
                </div>

                {selectedReq.state !== 'COMPLETED' ? (
                  <div className="pt-3 border-t border-black/10 dark:border-white/10 flex items-center justify-between">
                    <span className="text-[11px] text-neutral-500">
                      {allChecklistCompleted
                        ? 'Checklist complete. You may apply demonstrative notarial seal.'
                        : 'Complete all 5 ceremony checklist items before sealing.'}
                    </span>
                    <button
                      onClick={handleApplyDemoSeal}
                      disabled={!allChecklistCompleted || processing}
                      className="flex items-center gap-1.5 border border-black bg-black px-4 py-2 text-xs font-semibold text-white hover:bg-neutral-800 dark:border-white dark:bg-white dark:text-black dark:hover:bg-neutral-200 cursor-pointer disabled:opacity-40"
                    >
                      <Stamp className="h-3.5 w-3.5" />
                      <span>{processing ? 'Applying Demo Seal...' : 'Apply Demo Notarial Seal'}</span>
                    </button>
                  </div>
                ) : (
                  <div className="pt-2 text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                    <CheckCircle className="h-4 w-4" />
                    <span>Ceremony completed. Demonstration notarial certificate generated.</span>
                  </div>
                )}
              </div>

              {/* Right Col: Statutory REN Ceremony Checklist */}
              <div className="space-y-4">
                <div className="border border-black/20 p-4 space-y-3 dark:border-white/20 bg-neutral-50 dark:bg-neutral-900">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider">
                      Statutory Ceremony Checklist
                    </h4>
                    <span className="text-[10px] font-mono text-neutral-500">
                      Rule IV, A.M. 24-10-14-SC
                    </span>
                  </div>

                  <p className="text-[11px] text-neutral-500">
                    Mandatory judicial findings required prior to executing the electronic notarial seal:
                  </p>

                  <div className="space-y-2 text-xs">
                    <label
                      onClick={() => toggleChecklist('identityConfirmed')}
                      className="flex items-start gap-2 p-2 border border-black/10 bg-white dark:border-white/10 dark:bg-black cursor-pointer"
                    >
                      {checklist.identityConfirmed ? (
                        <CheckSquare className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <Square className="h-4 w-4 text-neutral-400 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className="font-semibold">1. Identity Confirmed</p>
                        <p className="text-[10px] text-neutral-500">PSA PhilSys eKYC / Competent ID verified.</p>
                      </div>
                    </label>

                    <label
                      onClick={() => toggleChecklist('voluntaryExecution')}
                      className="flex items-start gap-2 p-2 border border-black/10 bg-white dark:border-white/10 dark:bg-black cursor-pointer"
                    >
                      {checklist.voluntaryExecution ? (
                        <CheckSquare className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <Square className="h-4 w-4 text-neutral-400 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className="font-semibold">2. Voluntary Execution Confirmed</p>
                        <p className="text-[10px] text-neutral-500">Absence of duress, coercion, or undue influence.</p>
                      </div>
                    </label>

                    <label
                      onClick={() => toggleChecklist('documentUnderstood')}
                      className="flex items-start gap-2 p-2 border border-black/10 bg-white dark:border-white/10 dark:bg-black cursor-pointer"
                    >
                      {checklist.documentUnderstood ? (
                        <CheckSquare className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <Square className="h-4 w-4 text-neutral-400 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className="font-semibold">3. Document Read & Understood</p>
                        <p className="text-[10px] text-neutral-500">Principal understands legal consequences.</p>
                      </div>
                    </label>

                    <label
                      onClick={() => toggleChecklist('jurisdictionConfirmed')}
                      className="flex items-start gap-2 p-2 border border-black/10 bg-white dark:border-white/10 dark:bg-black cursor-pointer"
                    >
                      {checklist.jurisdictionConfirmed ? (
                        <CheckSquare className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <Square className="h-4 w-4 text-neutral-400 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className="font-semibold">4. Territorial Jurisdiction Confirmed</p>
                        <p className="text-[10px] text-neutral-500">ENP physically located in Makati City.</p>
                      </div>
                    </label>

                    <label
                      onClick={() => toggleChecklist('witnessPresent')}
                      className="flex items-start gap-2 p-2 border border-black/10 bg-white dark:border-white/10 dark:bg-black cursor-pointer"
                    >
                      {checklist.witnessPresent ? (
                        <CheckSquare className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <Square className="h-4 w-4 text-neutral-400 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className="font-semibold">5. Instrumental Witness Present</p>
                        <p className="text-[10px] text-neutral-500">Instrumental witness verified in session.</p>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="border border-black/20 p-4 space-y-2 text-xs dark:border-white/20">
                  <h4 className="font-bold uppercase tracking-wider text-xs">Alternative Actions</h4>
                  <button
                    onClick={() => {
                      setRefusalModalOpen(true);
                    }}
                    className="w-full border border-red-600 py-1.5 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                  >
                    Issue Formal Notarial Refusal
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Formal Refusal Dialog */}
      {refusalModalOpen && selectedReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg border border-black bg-white p-6 shadow-2xl dark:border-white dark:bg-black space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-black/15 pb-2 dark:border-white/15">
              <h3 className="font-bold text-sm text-red-600 dark:text-red-400 flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4" />
                Record Formal Notarial Refusal
              </h3>
              <button
                onClick={() => setRefusalModalOpen(false)}
                className="text-neutral-500 hover:text-black dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-neutral-600 dark:text-neutral-400">
              Pursuant to the 2004 Rules on Notarial Practice and Supreme Court A.M. No. 24-10-14-SC, an ENP must refuse notarization if the instrument is prohibited, the principal lacks capacity, or coercion is suspected.
            </p>

            <div>
              <label className="block font-semibold uppercase text-[10px] text-neutral-500 mb-1">
                Statutory Legal Basis
              </label>
              <select
                value={refusalLegalBasis}
                onChange={(e) => setRefusalLegalBasis(e.target.value)}
                className="w-full border border-black/20 bg-white p-2 text-xs dark:border-white/20 dark:bg-black"
              >
                <option value="Supreme Court A.M. No. 24-10-14-SC, Rule II, Section 3(b) (Prohibited Instruments)">
                  A.M. 24-10-14-SC Rule II Sec 3(b) (Prohibited: Last Will / Testamentary)
                </option>
                <option value="Supreme Court A.M. No. 24-10-14-SC, Rule IV, Section 2 (Territorial Jurisdiction Defect)">
                  A.M. 24-10-14-SC Rule IV Sec 2 (Territorial Jurisdiction Exceeded)
                </option>
                <option value="2004 Rules on Notarial Practice, Rule IV, Section 4 (Defective Identity)">
                  2004 Rules on Notarial Practice Rule IV Sec 4 (Defective Identity Evidence)
                </option>
                <option value="2004 Rules on Notarial Practice, Rule IV, Section 4 (Involuntary Execution / Duress)">
                  2004 Rules on Notarial Practice Rule IV Sec 4 (Suspected Duress or Coercion)
                </option>
              </select>
            </div>

            <div>
              <label className="block font-semibold uppercase text-[10px] text-neutral-500 mb-1">
                Detailed Refusal Findings & Observations *
              </label>
              <textarea
                rows={3}
                value={refusalReason}
                onChange={(e) => setRefusalReason(e.target.value)}
                placeholder="State specific judicial observations justifying the refusal..."
                className="w-full border border-black/20 bg-white p-2 text-xs dark:border-white/20 dark:bg-black"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-black/10 dark:border-white/10">
              <button
                onClick={() => setRefusalModalOpen(false)}
                className="border border-black/20 px-3 py-1.5 hover:bg-neutral-100 dark:border-white/20 dark:hover:bg-neutral-900"
              >
                Cancel
              </button>
              <button
                onClick={handleRecordRefusal}
                disabled={!refusalReason.trim() || processing}
                className="border border-red-600 bg-red-600 px-4 py-1.5 text-white font-semibold hover:bg-red-700 disabled:opacity-50"
              >
                {processing ? 'Recording Refusal...' : 'Confirm Formal Refusal'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Details Drawer */}
      <DetailsDrawer
        isOpen={!!selectedReq && !ceremonyModalOpen && !refusalModalOpen}
        onClose={() => setSelectedReq(null)}
        title={selectedReq?.referenceNumber || 'Matter Details'}
        subtitle={selectedReq?.title}
      >
        {selectedReq && (
          <div className="space-y-4 text-xs font-mono">
            <div>
              <span className="text-[10px] uppercase text-neutral-400">Principal</span>
              <p className="font-bold font-sans">{selectedReq.requester.name} ({selectedReq.requester.email})</p>
            </div>
            <div>
              <span className="text-[10px] uppercase text-neutral-400">Notarial Act & Mode</span>
              <p className="font-sans">{selectedReq.notarialAct} • {selectedReq.mode}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase text-neutral-400">State</span>
              <div className="mt-1">
                <StatusBadge status={selectedReq.state} size="sm" />
              </div>
            </div>
            <div>
              <span className="text-[10px] uppercase text-neutral-400">Document Hash</span>
              <p className="border border-black/10 p-2 text-[10px] break-all bg-neutral-50 dark:bg-neutral-900">
                {selectedReq.document.pdfaSha256}
              </p>
            </div>
            <div className="pt-3 border-t border-black/10 dark:border-white/10 flex justify-end gap-2">
              <button
                onClick={() => setCeremonyModalOpen(true)}
                className="border border-black bg-black px-3 py-1.5 text-xs text-white font-semibold dark:border-white dark:bg-white dark:text-black"
              >
                Preside Hearing
              </button>
            </div>
          </div>
        )}
      </DetailsDrawer>
    </div>
  );
};
