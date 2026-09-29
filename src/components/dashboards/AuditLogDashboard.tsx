import React, { useState } from 'react';
import {
  ListOrdered,
  ShieldCheck,
  AlertTriangle,
  Download,
  Filter,
  Search,
  RotateCcw,
  CheckCircle2,
  FileSpreadsheet,
  FileText,
  Printer,
  Hash,
} from 'lucide-react';
import { useSecurity } from '../../context/SecurityContext';
import { truncateHash } from '../../utils/crypto';
import { AuditSeverity } from '../../types';
import { PageHeader } from '../common/PageHeader';
import { StatusBadge } from '../common/StatusBadge';

interface AuditLogDashboardProps {
  activeModuleId?: string;
  onSelectModule?: (id: string) => void;
}

export const AuditLogDashboard: React.FC<AuditLogDashboardProps> = ({
  activeModuleId,
  onSelectModule,
}) => {
  const {
    auditLogs,
    chainIntegrity,
    verifyChain,
    tamperSimulateChain,
    resetChain,
  } = useSecurity();

  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verificationFeedback, setVerificationFeedback] = useState<string | null>(null);

  // Filter logs
  const filteredLogs = auditLogs.filter((log) => {
    if (severityFilter !== 'ALL' && log.severity !== severityFilter) return false;
    if (roleFilter !== 'ALL' && log.actor.role !== roleFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchAction = log.action.toLowerCase().includes(q);
      const matchActor = log.actor.name.toLowerCase().includes(q) || log.actor.email.toLowerCase().includes(q);
      const matchResource = log.resource.toLowerCase().includes(q);
      const matchIp = log.ipAddress.includes(q);
      if (!matchAction && !matchActor && !matchResource && !matchIp) return false;
    }
    return true;
  });

  const handleVerifyChain = async () => {
    setVerifying(true);
    setVerificationFeedback(null);
    try {
      const valid = await verifyChain();
      if (valid) {
        setVerificationFeedback('Cryptographic integrity confirmed: All blocks validly signed from Genesis.');
      } else {
        setVerificationFeedback('Integrity failure: One or more blocks have an invalid SHA-256 hash or broken predecessor pointer.');
      }
    } finally {
      setVerifying(false);
    }
  };

  const exportCsv = () => {
    const headers = ['ID', 'Timestamp', 'Actor Name', 'Actor Role', 'Actor Email', 'Action', 'Resource', 'Severity', 'IP Address', 'Prev Hash', 'Block Hash'];
    const rows = filteredLogs.map((l) => [
      l.id,
      l.timestamp,
      `"${l.actor.name}"`,
      l.actor.role,
      l.actor.email,
      l.action,
      l.resource,
      l.severity,
      l.ipAddress,
      l.prevHash,
      l.hash,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `jurimbrella-audit-report-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportJson = () => {
    const jsonStr = JSON.stringify(filteredLogs, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `jurimbrella-audit-events-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const printReport = () => {
    window.print();
  };

  return (
    <div id="audit-log-dashboard-view" className="space-y-6">
      <PageHeader
        breadcrumbs={[{ label: 'Forensics' }, { label: 'Immutable Cryptographic Audit Trail', active: true }]}
        title="Immutable Cryptographic Audit Trail"
        purpose="Inspect tamper-evident SHA-256 hash-chained event ledgers, execute live mathematical verification tests, and test automated tamper-detection safeguards."
        statusBadge={<StatusBadge status="HASH CHAIN" variant="demo" />}
        primaryAction={{
          label: verifying ? 'Computing Hashes...' : 'Verify Chain Integrity',
          icon: ShieldCheck,
          onClick: handleVerifyChain,
        }}
        secondaryActions={[
          {
            label: 'Simulate Tamper Attack',
            icon: AlertTriangle,
            onClick: tamperSimulateChain,
          },
          {
            label: 'Restore Chain',
            icon: RotateCcw,
            onClick: resetChain,
          },
        ]}
      />

      {/* Quick Export Actions Bar */}
      <div className="flex items-center justify-between border-b border-black/10 pb-3 dark:border-white/10 text-xs">
        <span className="font-mono text-neutral-500">
          Total Chained Audit Events: {auditLogs.length} records
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={exportCsv}
            className="flex items-center gap-1 border border-black/20 px-2.5 py-1 text-[11px] font-semibold hover:bg-neutral-100 dark:border-white/20 dark:hover:bg-neutral-900"
          >
            <FileSpreadsheet className="h-3 w-3" />
            CSV Export
          </button>
          <button
            onClick={exportJson}
            className="flex items-center gap-1 border border-black/20 px-2.5 py-1 text-[11px] font-semibold hover:bg-neutral-100 dark:border-white/20 dark:hover:bg-neutral-900"
          >
            <FileText className="h-3 w-3" />
            JSON Export
          </button>
          <button
            onClick={printReport}
            className="flex items-center gap-1 border border-black bg-black px-3 py-1 text-[11px] font-semibold text-white hover:bg-neutral-800 dark:border-white dark:bg-white dark:text-black"
          >
            <Printer className="h-3 w-3" />
            Print Ledger
          </button>
        </div>
      </div>

      {/* Chain Status Notification */}
      {!chainIntegrity.isValid ? (
        <div className="border border-red-600 bg-red-50 p-4 text-black dark:bg-red-950/40 dark:text-white space-y-1">
          <div className="flex items-center gap-2 font-bold text-red-600 dark:text-red-400">
            <AlertTriangle className="h-4 w-4" />
            <span>CRITICAL ALERT: CRYPTOGRAPHIC TAMPER DETECTED AT BLOCK INDEX {chainIntegrity.tamperedIndex}!</span>
          </div>
          <p className="text-xs">
            Calculated block hash does not match stored block payload or predecessor link. The audit trail has detected unauthorized alteration. Click "Reset" to restore authentic state.
          </p>
        </div>
      ) : (
        verificationFeedback && (
          <div className="border border-black bg-neutral-100 p-3 text-xs font-medium dark:border-white dark:bg-neutral-900 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-black dark:text-white" />
            <span>{verificationFeedback}</span>
          </div>
        )
      )}

      {/* Filters and Search Bar */}
      <div className="border border-black/15 p-4 bg-white dark:border-white/15 dark:bg-black space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="h-3.5 w-3.5 absolute left-3 top-2.5 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by action, actor, resource, or IP address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-black bg-white pl-9 pr-3 py-1.5 text-xs text-black focus:outline-none dark:border-white dark:bg-black dark:text-white"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs">
              <span className="font-semibold">Severity:</span>
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="border border-black bg-white px-2 py-1 text-xs dark:border-white dark:bg-black"
              >
                <option value="ALL">All Severities</option>
                <option value="CRITICAL">Critical</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
                <option value="INFO">Info</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              <span className="font-semibold">Role:</span>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="border border-black bg-white px-2 py-1 text-xs dark:border-white dark:bg-black"
              >
                <option value="ALL">All Roles</option>
                <option value="PRINCIPAL">Principal</option>
                <option value="ENP">ENP</option>
                <option value="SECOPS_ANALYST">SecOps Analyst</option>
                <option value="DPO">DPO</option>
                <option value="COURT_AUDITOR">Court Auditor</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-neutral-500 font-mono pt-1">
          <span>Showing {filteredLogs.length} of {auditLogs.length} verified events</span>
          <span>Hash Algorithm: SHA-256 (NIST FIPS 180-4)</span>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="border border-black/15 bg-white dark:border-white/15 dark:bg-black overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-black/10 bg-neutral-50 text-[11px] font-bold uppercase tracking-wider text-neutral-600 dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-300">
            <tr>
              <th className="px-4 py-3">Timestamp / Actor</th>
              <th className="px-4 py-3">Action Executed</th>
              <th className="px-4 py-3">Target Resource</th>
              <th className="px-4 py-3">Severity</th>
              <th className="px-4 py-3">IP & Location</th>
              <th className="px-4 py-3 font-mono">Block Hash & PrevHash</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/10 dark:divide-white/10">
            {filteredLogs.map((event, idx) => {
              const isCritical = event.severity === 'CRITICAL';
              const isHigh = event.severity === 'HIGH';

              return (
                <tr
                  key={event.id}
                  className="hover:bg-neutral-50/70 transition-colors dark:hover:bg-neutral-900/60"
                >
                  <td className="px-4 py-3.5">
                    <div className="font-mono text-[11px]">{event.timestamp}</div>
                    <div className="font-semibold text-black dark:text-white mt-0.5">
                      {event.actor.name}
                    </div>
                    <div className="text-[10px] text-neutral-500 font-mono">
                      {event.actor.role} • {event.actor.email}
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="font-mono font-bold">{event.action}</span>
                    {event.resourceId && (
                      <div className="text-[10px] text-neutral-500 font-mono">
                        Ref: {event.resourceId}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="font-mono text-[11px]">{event.resource}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-block border px-2 py-0.5 text-[9px] font-bold uppercase ${
                        isCritical
                          ? 'border-red-600 bg-red-600 text-white'
                          : isHigh
                          ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
                          : 'border-black/30 text-neutral-700 dark:border-white/30 dark:text-neutral-300'
                      }`}
                    >
                      {event.severity}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 font-mono text-[11px]">
                    <div>{event.ipAddress}</div>
                    <div className="text-[10px] text-neutral-500">{event.location || 'Taguig, PH'}</div>
                  </td>
                  <td className="px-4 py-3.5 font-mono text-[10px] space-y-0.5">
                    <div className="text-black dark:text-white font-semibold">
                      Hash: {truncateHash(event.hash, 8, 6)}
                    </div>
                    <div className="text-neutral-400">
                      Prev: {truncateHash(event.prevHash, 6, 4)}
                    </div>
                  </td>
                </tr>
              );
            })}
            {filteredLogs.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-8 text-neutral-500">
                  No audit events matched current filter parameters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
