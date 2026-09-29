import React, { useState } from 'react';
import { PageHeader } from '../common/PageHeader';
import { SummaryCard } from '../common/SummaryCard';
import { StatusBadge } from '../common/StatusBadge';
import { DetailsDrawer } from '../common/DetailsDrawer';
import { useSecurity } from '../../context/SecurityContext';
import { useNotarization } from '../../context/NotarizationContext';
import { AuditLogDashboard } from './AuditLogDashboard';
import {
  ShieldCheck,
  FileSearch,
  CheckCircle,
  AlertTriangle,
  Lock,
  Share2,
  ListChecks,
  Users,
  Download,
  Eye,
  RefreshCw,
} from 'lucide-react';

interface InternalAuditorDashboardProps {
  activeModuleId: string;
  onSelectModule: (id: string) => void;
}

export const InternalAuditorDashboard: React.FC<InternalAuditorDashboardProps> = ({
  activeModuleId,
  onSelectModule,
}) => {
  const { auditLogs } = useSecurity();
  const { requests } = useNotarization();

  const [verifyingChain, setVerifyingChain] = useState(false);
  const [chainResult, setChainResult] = useState<{ valid: boolean; checkedCount: number } | null>(null);
  const [selectedFinding, setSelectedFinding] = useState<any | null>(null);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  if (activeModuleId === 'audit-integrity-verification') {
    return (
      <AuditLogDashboard
        activeModuleId={activeModuleId}
        onSelectModule={onSelectModule}
      />
    );
  }

  const runIntegrityCheck = () => {
    setVerifyingChain(true);
    setTimeout(() => {
      setVerifyingChain(false);
      setChainResult({ valid: true, checkedCount: auditLogs.length });
    }, 1200);
  };

  const handleExportWorkpapers = () => {
    setExportNotice('Cryptographically signed audit workpaper package (SHA-256 manifest) exported.');
    setTimeout(() => setExportNotice(null), 4000);
  };

  return (
    <div id="internal-auditor-dashboard-view" className="space-y-6">
      <PageHeader
        breadcrumbs={[{ label: 'Auditing' }, { label: 'Internal Cryptographic Auditor Workspace', active: true }]}
        title="Internal Cryptographic Auditor Workspace"
        purpose="Read-only verification of tamper-evident SHA-256 hash chains, SOC 2 / ISO 27001 control evidence, transaction sampling, and signed audit workpapers."
        statusBadge={<StatusBadge status="READ-ONLY AUDIT" variant="demo" />}
        primaryAction={{
          label: 'Run Cryptographic Hash Chain Audit',
          icon: Lock,
          onClick: () => onSelectModule('audit-integrity-verification'),
        }}
        secondaryActions={[
          {
            label: 'Export Signed Workpapers',
            icon: Share2,
            onClick: handleExportWorkpapers,
          },
        ]}
      />

      {exportNotice && (
        <div className="border border-emerald-500 bg-emerald-50 p-3 text-xs text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
          {exportNotice}
        </div>
      )}

      {chainResult && (
        <div className="border border-emerald-500 bg-emerald-50 p-3 text-xs text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span className="font-bold">Cryptographic Ledger Chain Intact:</span>
            <span>Verified unbroken SHA-256 linking across {chainResult.checkedCount} recorded audit events.</span>
          </div>
          <span className="font-mono text-[10px] text-emerald-700 dark:text-emerald-300 font-bold">ZERO TAMPER DETECTED</span>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          label="Ledger Integrity"
          value="100% Intact"
          subtext="Unbroken block hash chain"
          icon={Lock}
          trend={{ value: 'SHA-256 Valid', positive: true }}
        />
        <SummaryCard
          label="Audit Events Sampled"
          value={auditLogs.length}
          subtext="Cryptographic non-repudiation"
          icon={FileSearch}
        />
        <SummaryCard
          label="Open Audit Findings"
          value="2"
          subtext="Awaiting management response"
          icon={AlertTriangle}
          trend={{ value: 'Medium Risk', positive: false }}
        />
        <SummaryCard
          label="Control Coverage"
          value="28 / 28"
          subtext="SOC 2 Trust Principles & ISO 27001"
          icon={ShieldCheck}
          trend={{ value: 'Accreditation Ready', positive: true }}
        />
      </div>

      {/* Read-Only Safeguard Notice */}
      <div className="border border-black/15 bg-neutral-50 p-4 dark:border-white/15 dark:bg-neutral-950 text-xs">
        <div className="flex items-start gap-2.5">
          <ShieldCheck className="h-4 w-4 text-neutral-600 dark:text-neutral-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-neutral-600 dark:text-neutral-400">
            <p className="font-semibold text-black dark:text-white">
              Independent Read-Only Audit Mandate
            </p>
            <p>
              In accordance with international auditing standards (IIA / ISACA), the Internal Auditor possesses read-only access to all transaction states, hash chains, and access manifests. The auditor may create findings and corrective action recommendations but cannot modify transactional records or notarial entries.
            </p>
          </div>
        </div>
      </div>

      {/* Transaction Sampling & Hash Integrity Table */}
      <div className="border border-black/15 bg-white p-5 dark:border-white/15 dark:bg-neutral-950 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-black dark:text-white">
            Statistically Random Transaction Sampling & Cryptographic Proofs
          </h3>
          <span className="text-xs font-mono text-neutral-500">
            Sample Size: {requests.length} records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-black/20 bg-neutral-50 text-[11px] font-semibold text-neutral-600 dark:border-white/20 dark:bg-neutral-900 dark:text-neutral-400">
              <tr>
                <th className="p-2.5">Filing ID</th>
                <th className="p-2.5">Document SHA-256 Hash</th>
                <th className="p-2.5">Notarial Act</th>
                <th className="p-2.5">State Transition</th>
                <th className="p-2.5">Integrity Verification</th>
                <th className="p-2.5 text-right">Audit Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 dark:divide-white/10 font-mono text-[11px]">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50">
                  <td className="p-2.5 font-bold">{req.id}</td>
                  <td className="p-2.5 text-neutral-600 dark:text-neutral-400 truncate max-w-[200px]">
                    {req.document.originalSha256}
                  </td>
                  <td className="p-2.5 font-sans">{req.notarialAct}</td>
                  <td className="p-2.5 font-sans">
                    <StatusBadge status={req.state} size="sm" />
                  </td>
                  <td className="p-2.5 text-emerald-600 dark:text-emerald-400 font-bold">
                    VERIFIED (Clean)
                  </td>
                  <td className="p-2.5 text-right font-sans">
                    <button
                      onClick={() => {
                        setSelectedFinding({
                          id: `FND-${req.id}`,
                          ref: req.id,
                          title: `Verification of ${req.documentType}`,
                          status: 'RESOLVED',
                          details: `All participant hashes, quarantine logs, and state timestamps conform to A.M. 24-10-14-SC technical requirements.`,
                        });
                      }}
                      className="border border-black/20 px-2 py-1 text-[11px] hover:bg-neutral-100 dark:border-white/20 dark:hover:bg-neutral-900"
                    >
                      Annotate Finding
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Drawer: Findings Annotation */}
      <DetailsDrawer
        isOpen={!!selectedFinding}
        onClose={() => setSelectedFinding(null)}
        title={selectedFinding?.title || 'Audit Finding'}
        subtitle={`Reference: ${selectedFinding?.ref}`}
      >
        {selectedFinding && (
          <div className="space-y-4 text-xs">
            <div>
              <span className="text-[10px] uppercase font-mono text-neutral-400">Finding Status</span>
              <div className="mt-1">
                <StatusBadge status={selectedFinding.status} size="sm" />
              </div>
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono text-neutral-400">Audit Observation</span>
              <p className="mt-1 border border-black/10 p-3 bg-neutral-50 dark:bg-neutral-900 leading-relaxed font-mono">
                {selectedFinding.details}
              </p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono text-neutral-400">Internal Auditor Attestation</span>
              <p className="text-neutral-500 mt-1">
                Signed by Victoria Solis, CIA, CISA (Demo Internal Auditor) under ISO 19011 audit guidelines.
              </p>
            </div>
            <div className="pt-3 border-t border-black/10 dark:border-white/10 flex justify-end">
              <button
                onClick={() => setSelectedFinding(null)}
                className="border border-black bg-black px-4 py-1.5 text-xs text-white font-semibold dark:border-white dark:bg-white dark:text-black"
              >
                Save Workpaper Entry
              </button>
            </div>
          </div>
        )}
      </DetailsDrawer>
    </div>
  );
};
