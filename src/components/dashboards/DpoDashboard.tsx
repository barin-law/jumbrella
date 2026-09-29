import React, { useState } from 'react';
import { PageHeader } from '../common/PageHeader';
import { SummaryCard } from '../common/SummaryCard';
import { StatusBadge } from '../common/StatusBadge';
import { DetailsDrawer } from '../common/DetailsDrawer';
import {
  ShieldCheck,
  ClipboardList,
  FileSearch,
  FileBadge,
  Users,
  Layers,
  Globe,
  Archive,
  FolderLock,
  AlertTriangle,
  Bell,
  Eye,
  CheckCircle,
  Clock,
  Lock,
} from 'lucide-react';

interface DpoDashboardProps {
  activeModuleId: string;
  onSelectModule: (id: string) => void;
}

export const DpoDashboard: React.FC<DpoDashboardProps> = ({
  activeModuleId,
  onSelectModule,
}) => {
  const [selectedDsr, setSelectedDsr] = useState<any | null>(null);
  const [showBreachEval, setShowBreachEval] = useState(false);
  const [breachResult, setBreachResult] = useState<string | null>(null);

  const runBreachEvaluation = () => {
    setBreachResult(
      'NPC Circular 16-03 Assessment: No personal data breach criteria met. Zero unauthorized exfiltration detected in the audit log chain.'
    );
    setTimeout(() => setBreachResult(null), 6000);
  };

  return (
    <div id="dpo-dashboard-view" className="space-y-6">
      <PageHeader
        breadcrumbs={[{ label: 'Governance' }, { label: 'Data Protection Officer (DPO) Workspace', active: true }]}
        title="Data Protection Officer (DPO) Workspace"
        purpose="Monitor Republic Act No. 10173 compliance, oversee Records of Processing Activities (ROPA), manage Data-Subject Requests (DSR), and enforce notarial retention policies."
        statusBadge={<StatusBadge status="R.A. 10173 COMPLIANCE" variant="success" />}
        primaryAction={{
          label: 'Run 72-Hour Breach Evaluation',
          icon: AlertTriangle,
          onClick: runBreachEvaluation,
        }}
        secondaryActions={[
          {
            label: 'Records of Processing (ROPA)',
            icon: ClipboardList,
            onClick: () => onSelectModule('dpo-records-processing'),
          },
        ]}
      />

      {breachResult && (
        <div className="border border-emerald-500 bg-emerald-50 p-3 text-xs text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
          {breachResult}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          label="ROPA Processing Activities"
          value="14"
          subtext="Mapped data flows"
          icon={ClipboardList}
        />
        <SummaryCard
          label="Pending DSR Requests"
          value="1"
          subtext="Right to access / statutory limits"
          icon={Users}
          trend={{ value: 'Within 30d SLA', positive: true }}
        />
        <SummaryCard
          label="Consent Version"
          value="v2.4"
          subtext="Active biometric & video consent"
          icon={FileBadge}
        />
        <SummaryCard
          label="Statutory Retention Window"
          value="10 Years"
          subtext="Pursuant to Notarial Rules"
          icon={Archive}
          trend={{ value: 'Legal Hold Active', positive: true }}
        />
      </div>

      {/* DPO Access Scope & Redaction Notice */}
      <div className="border border-black/15 bg-neutral-50 p-4 dark:border-white/15 dark:bg-neutral-950 text-xs">
        <div className="flex items-start gap-2.5">
          <Lock className="h-4 w-4 text-neutral-600 dark:text-neutral-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-neutral-600 dark:text-neutral-400">
            <p className="font-semibold text-black dark:text-white">
              Data Minimization & Redacted Oversight Boundary
            </p>
            <p>
              Pursuant to privacy by design and the National Privacy Commission (NPC) directives, the DPO has structural access to data flow metadata, consent versions, processing logs, and subprocessor registries. The DPO does <strong>not</strong> have access to plaintext instrument contents, confidential corporate trade secrets, or unredacted biometric templates.
            </p>
          </div>
        </div>
      </div>

      {/* Records of Processing Activities (ROPA) */}
      <div className="border border-black/15 bg-white p-5 dark:border-white/15 dark:bg-neutral-950 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-black dark:text-white">
            Records of Processing Activities (ROPA — R.A. 10173 Section 21)
          </h3>
          <span className="text-xs font-mono text-neutral-500">
            NPC Registration No. NPC-DPO-2026-08149
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-black/20 bg-neutral-50 text-[11px] font-semibold text-neutral-600 dark:border-white/20 dark:bg-neutral-900 dark:text-neutral-400">
              <tr>
                <th className="p-2.5">Processing Activity</th>
                <th className="p-2.5">Data Categories</th>
                <th className="p-2.5">Legal Basis</th>
                <th className="p-2.5">Retention Period</th>
                <th className="p-2.5">Security Safeguards</th>
                <th className="p-2.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 dark:divide-white/10 font-mono text-[11px]">
              {[
                {
                  activity: 'Principal Identification & PhilSys eKYC',
                  data: 'Full Name, Address, PhilSys Card No., Biometric Selfie',
                  basis: 'Statutory Obligation (A.M. 24-10-14-SC)',
                  retention: '10 Years in Notarial Register',
                  safeguard: 'AES-256-GCM Envelope Encryption',
                  status: 'VERIFIED',
                },
                {
                  activity: 'Remote Videoconference Recording (REN)',
                  data: 'Audio, Full Video Stream, Geolocation Coordinates',
                  basis: 'Explicit Consent & Notarial Rule Requirement',
                  retention: '10 Years Immutable Archival',
                  safeguard: 'WORM Compliant Cloud Vault',
                  status: 'VERIFIED',
                },
                {
                  activity: 'Electronic Notarial Book Entries',
                  data: 'Instrument Title, Signatory Names, Notarial Fees, Date',
                  basis: 'Public Legal Record (2004 Rules)',
                  retention: 'Perpetual Archive to Supreme Court',
                  safeguard: 'SHA-256 Block Chain Linking',
                  status: 'VERIFIED',
                },
                {
                  activity: 'Customer Support & Connectivity Telemetry',
                  data: 'IP Address, User Agent, Network Latency Logs',
                  basis: 'Legitimate Interest (Service Delivery)',
                  retention: '90 Days Automated Purge',
                  safeguard: 'Pseudonymized SIEM Logs',
                  status: 'VERIFIED',
                },
              ].map((ropa, idx) => (
                <tr key={idx} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50">
                  <td className="p-2.5 font-bold font-sans">{ropa.activity}</td>
                  <td className="p-2.5 font-sans text-neutral-600 dark:text-neutral-300">{ropa.data}</td>
                  <td className="p-2.5 font-sans">{ropa.basis}</td>
                  <td className="p-2.5">{ropa.retention}</td>
                  <td className="p-2.5">{ropa.safeguard}</td>
                  <td className="p-2.5">
                    <StatusBadge status={ropa.status} size="sm" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Data Subject Requests (DSR) & Breach Management Grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="border border-black/15 bg-white p-5 dark:border-white/15 dark:bg-neutral-950 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-black dark:text-white">
              Data-Subject Requests (DSR) Queue
            </h3>
            <span className="text-xs font-mono text-neutral-500">1 Pending Request</span>
          </div>

          <div className="border border-black/10 p-3 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold">DSR-2026-004: Request for Erasure</span>
              <StatusBadge status="STATUTORY RESTRICTION" variant="warning" size="sm" />
            </div>
            <p className="text-neutral-600 dark:text-neutral-400 text-[11px]">
              Requester: Signatory Maria Elena Santos requested deletion of notarized Special Power of Attorney.
            </p>
            <div className="border-t border-black/10 pt-2 text-[10px] font-mono text-neutral-500 flex items-center justify-between">
              <span>Legal Determination: Right to erasure denied under Section 34(c) of R.A. 10173 (Statutory 10-Year Notarial Retention).</span>
            </div>
          </div>
        </div>

        <div className="border border-black/15 bg-white p-5 dark:border-white/15 dark:bg-neutral-950 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-black dark:text-white">
              Subprocessor Registry & DPA Safeguards
            </h3>
            <span className="text-xs font-mono text-neutral-500">All Agreements Active</span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            {[
              { vendor: 'Google Cloud Platform (GCP)', scope: 'Storage, Cloud KMS & Firestore', dpa: 'Signed & Valid' },
              { vendor: 'LiveKit SFU Network', scope: 'Encrypted WebRTC Media Router', dpa: 'Signed & Valid' },
              { vendor: 'Maya Philippines Inc.', scope: 'Statutory Fee Settlement Gateway', dpa: 'Signed & Valid' },
            ].map((v, i) => (
              <div key={i} className="flex items-center justify-between border border-black/10 p-2.5 bg-neutral-50 dark:bg-neutral-900">
                <div>
                  <span className="font-bold font-sans">{v.vendor}</span>
                  <div className="text-[10px] text-neutral-500">{v.scope}</div>
                </div>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">{v.dpa}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
