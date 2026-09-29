import React, { useState } from 'react';
import { PageHeader } from '../common/PageHeader';
import { SummaryCard } from '../common/SummaryCard';
import { StatusBadge } from '../common/StatusBadge';
import { DetailsDrawer } from '../common/DetailsDrawer';
import { useNotarization } from '../../context/NotarizationContext';
import {
  Inbox,
  AlertTriangle,
  Calendar,
  MessageSquare,
  ListChecks,
  HelpCircle,
  Clock,
  Send,
  UserCheck,
  CheckCircle,
  FileText,
  ShieldAlert,
} from 'lucide-react';
import { NotarizationRequest } from '../../types';

interface EnpAssistantDashboardProps {
  activeModuleId: string;
  onSelectModule: (id: string) => void;
}

export const EnpAssistantDashboard: React.FC<EnpAssistantDashboardProps> = ({
  activeModuleId,
  onSelectModule,
}) => {
  const { requests } = useNotarization();
  const [selectedReq, setSelectedReq] = useState<NotarizationRequest | null>(null);
  const [reminderSent, setReminderSent] = useState<string | null>(null);

  const pendingIntake = requests.filter(
    (r) => r.state === 'INTAKE_REVIEW' || r.state === 'NEEDS_INFORMATION' || r.state === 'SCHEDULED'
  );

  const handleSendReminder = (reqId: string, email: string) => {
    setReminderSent(`Automated readiness checklist reminder sent to ${email} for filing ${reqId}.`);
    setTimeout(() => setReminderSent(null), 4000);
  };

  return (
    <div id="enp-assistant-dashboard-view" className="space-y-6">
      <PageHeader
        breadcrumbs={[{ label: 'Notarial Office' }, { label: 'ENP Office Assistant Workspace', active: true }]}
        title="ENP Office Assistant Workspace"
        purpose="Perform clerical intake, verify preliminary document completeness, coordinate hearing calendars, and track missing participant requirements."
        statusBadge={<StatusBadge status="CLERICAL OFFICE" variant="info" />}
        primaryAction={{
          label: 'Review Next in Intake',
          icon: Inbox,
          onClick: () => {
            if (pendingIntake.length > 0) setSelectedReq(pendingIntake[0]);
          },
        }}
      />

      {/* Strict Statutory Limitation Banner */}
      <div className="border border-black/20 bg-neutral-50 p-4 dark:border-white/20 dark:bg-neutral-950 text-xs">
        <div className="flex items-start gap-2.5">
          <ShieldAlert className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-neutral-600 dark:text-neutral-400">
            <p className="font-semibold text-black dark:text-white">
              Clerical Scope of Authority & Absolute Legal Safeguards
            </p>
            <p>
              Under Supreme Court A.M. No. 24-10-14-SC and the 2004 Rules on Notarial Practice, the ENP Assistant's role is strictly confined to administrative intake, schedule coordination, and clerical document verification. The Assistant is <strong>strictly barred</strong> from making legal sufficiency determinations, conducting notarial ceremonies, or applying digital seals.
            </p>
          </div>
        </div>
      </div>

      {reminderSent && (
        <div className="border border-emerald-500 bg-emerald-50 p-3 text-xs text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
          {reminderSent}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          label="Intake Queue"
          value={pendingIntake.length}
          subtext="Awaiting clerical check"
          icon={Inbox}
        />
        <SummaryCard
          label="Missing Requirements"
          value="2"
          subtext="Incomplete ID or witness"
          icon={AlertTriangle}
          trend={{ value: 'Action required', positive: false }}
        />
        <SummaryCard
          label="Today's Hearings"
          value="2"
          subtext="Scheduled on ENP docket"
          icon={Calendar}
        />
        <SummaryCard
          label="Pre-Session Readiness"
          value="95%"
          subtext="Video & document assembled"
          icon={ListChecks}
          trend={{ value: 'Ready for ENP', positive: true }}
        />
      </div>

      {/* Active Module: Intake Queue Table */}
      <div className="border border-black/15 bg-white p-5 dark:border-white/15 dark:bg-neutral-950 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-black dark:text-white">
            Clerical Intake & Completeness Verification Queue
          </h3>
          <span className="text-xs font-mono text-neutral-500">
            Showing {pendingIntake.length} matters
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-black/20 bg-neutral-50 text-[11px] font-semibold text-neutral-600 dark:border-white/20 dark:bg-neutral-900 dark:text-neutral-400">
              <tr>
                <th className="p-2.5">Filing ID</th>
                <th className="p-2.5">Document Title</th>
                <th className="p-2.5">Principal Requester</th>
                <th className="p-2.5">Quarantine & Hash</th>
                <th className="p-2.5">Status</th>
                <th className="p-2.5 text-right">Clerical Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 dark:divide-white/10 font-mono text-[11px]">
              {pendingIntake.map((req) => (
                <tr key={req.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50">
                  <td className="p-2.5 font-bold">{req.id}</td>
                  <td className="p-2.5 font-sans font-medium">{req.title}</td>
                  <td className="p-2.5 font-sans">{req.requester.name}</td>
                  <td className="p-2.5">
                    <StatusBadge status={req.document.quarantineStatus} size="sm" />
                  </td>
                  <td className="p-2.5">
                    <StatusBadge status={req.state} size="sm" />
                  </td>
                  <td className="p-2.5 text-right space-x-1 font-sans">
                    <button
                      onClick={() => setSelectedReq(req)}
                      className="border border-black/20 px-2 py-1 text-[11px] hover:bg-neutral-100 dark:border-white/20 dark:hover:bg-neutral-900"
                    >
                      Inspect File
                    </button>
                    <button
                      onClick={() => handleSendReminder(req.id, req.requester.email)}
                      className="border border-black bg-black px-2 py-1 text-[11px] text-white hover:bg-neutral-800 dark:border-white dark:bg-white dark:text-black font-semibold"
                    >
                      Send Reminder
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Drawer */}
      <DetailsDrawer
        isOpen={!!selectedReq}
        onClose={() => setSelectedReq(null)}
        title={`Clerical Intake: ${selectedReq?.id}`}
        subtitle={selectedReq?.title}
      >
        {selectedReq && (
          <div className="space-y-4 text-xs">
            <div>
              <span className="text-[10px] uppercase font-mono text-neutral-400">Principal Requester</span>
              <p className="font-bold">{selectedReq.requesterName}</p>
              <p className="text-neutral-500">{selectedReq.requesterEmail}</p>
            </div>

            <div>
              <span className="text-[10px] uppercase font-mono text-neutral-400">Notarial Act Requested</span>
              <p className="font-semibold">{selectedReq.notarialAct} ({selectedReq.mode})</p>
            </div>

            <div>
              <span className="text-[10px] uppercase font-mono text-neutral-400">Clerical Document Checklist</span>
              <div className="mt-2 space-y-1.5 font-mono text-[11px]">
                <div className="flex items-center justify-between border border-black/10 p-2 bg-neutral-50 dark:bg-neutral-900">
                  <span>PDF/A Archival Conformance:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">VERIFIED (ISO 19005)</span>
                </div>
                <div className="flex items-center justify-between border border-black/10 p-2 bg-neutral-50 dark:bg-neutral-900">
                  <span>Antivirus Scanner Status:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">CLEARED (Clean)</span>
                </div>
                <div className="flex items-center justify-between border border-black/10 p-2 bg-neutral-50 dark:bg-neutral-900">
                  <span>Signatory Identification Upload:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">PhilSys ID Attached</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-black/10 dark:border-white/10 flex justify-between items-center">
              <span className="text-[10px] text-neutral-400 italic">
                Ready to transfer to ENP Docket
              </span>
              <button
                onClick={() => {
                  setSelectedReq(null);
                  handleSendReminder(selectedReq.id, selectedReq.requesterEmail);
                }}
                className="border border-black bg-black px-3 py-1.5 text-xs text-white font-semibold dark:border-white dark:bg-white dark:text-black"
              >
                Forward to Hearing Schedule
              </button>
            </div>
          </div>
        )}
      </DetailsDrawer>
    </div>
  );
};
