import React, { useState } from 'react';
import { PageHeader } from '../common/PageHeader';
import { SummaryCard } from '../common/SummaryCard';
import { StatusBadge } from '../common/StatusBadge';
import { DetailsDrawer } from '../common/DetailsDrawer';
import { ConfirmationDialog } from '../common/ConfirmationDialog';
import { useNotarization } from '../../context/NotarizationContext';
import { useAuth } from '../../context/AuthContext';
import {
  Mail,
  UserCheck,
  Calendar,
  Activity,
  FileText,
  ShieldCheck,
  Video,
  CheckCircle,
  AlertTriangle,
  Clock,
  Eye,
  Camera,
  Mic,
  Wifi,
} from 'lucide-react';
import { NotarizationRequest } from '../../types';

interface WitnessDashboardProps {
  activeModuleId: string;
  onSelectModule: (id: string) => void;
}

export const WitnessDashboard: React.FC<WitnessDashboardProps> = ({
  activeModuleId,
  onSelectModule,
}) => {
  const { requests } = useNotarization();
  const { currentUser } = useAuth();

  const [selectedReq, setSelectedReq] = useState<NotarizationRequest | null>(null);
  const [readinessTested, setReadinessTested] = useState(false);
  const [testingReadiness, setTestingReadiness] = useState(false);
  const [showAcceptDialog, setShowAcceptDialog] = useState(false);
  const [acceptedNotice, setAcceptedNotice] = useState<string | null>(null);

  // Filter requests where witness is involved
  const witnessRequests = requests.filter(
    (r) => r.participants?.some((p) => p.name.includes('Cruz') || p.role === 'WITNESS') || r.id === 'BENF-2026-0002'
  );

  const runReadinessTest = () => {
    setTestingReadiness(true);
    setTimeout(() => {
      setTestingReadiness(false);
      setReadinessTested(true);
    }, 1000);
  };

  const handleAcceptInvitation = () => {
    setShowAcceptDialog(false);
    setAcceptedNotice('Invitation accepted. Your attendance confirmation has been logged.');
    setTimeout(() => setAcceptedNotice(null), 4000);
  };

  return (
    <div id="witness-dashboard-view" className="space-y-6">
      <PageHeader
        breadcrumbs={[{ label: 'Parties' }, { label: 'Instrumental Witness Workspace', active: true }]}
        title="Instrumental Witness Workspace"
        purpose="Review witness invitations, verify session readiness, and attest to document execution under the presence of the ENP and principal."
        statusBadge={<StatusBadge status="WITNESS ROLE" variant="info" />}
        primaryAction={{
          label: 'Test Session Readiness',
          icon: Activity,
          onClick: runReadinessTest,
        }}
      />

      {acceptedNotice && (
        <div className="border border-emerald-500 bg-emerald-50 p-3 text-xs text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
          {acceptedNotice}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          label="Pending Invitations"
          value={witnessRequests.filter((r) => r.state === 'SCHEDULED' || r.state === 'INTAKE_REVIEW').length || 1}
          subtext="Awaiting your acceptance"
          icon={Mail}
        />
        <SummaryCard
          label="Upcoming Hearings"
          value={witnessRequests.filter((r) => r.state === 'SCHEDULED').length || 1}
          subtext="Scheduled remote hearings"
          icon={Calendar}
        />
        <SummaryCard
          label="Identity Readiness"
          value="Verified"
          subtext="PSA PhilSys / Passport check"
          icon={UserCheck}
          trend={{ value: 'Demo profile ready', positive: true }}
        />
        <SummaryCard
          label="Hardware Diagnostics"
          value={readinessTested ? '100% Passed' : 'Test Pending'}
          subtext={readinessTested ? 'Webcam, mic, latency checked' : 'Run session readiness'}
          icon={Activity}
          trend={{ value: readinessTested ? 'Optimal' : 'Action needed', positive: readinessTested }}
        />
      </div>

      {/* Legal & Privacy Disclosure */}
      <div className="border border-black/15 bg-neutral-50 p-4 dark:border-white/15 dark:bg-neutral-950 text-xs">
        <div className="flex items-start gap-2.5">
          <ShieldCheck className="h-4 w-4 text-neutral-600 dark:text-neutral-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-neutral-600 dark:text-neutral-400">
            <p className="font-semibold text-black dark:text-white">
              Witness Role Boundary & Redacted Access
            </p>
            <p>
              Under Philippine notarial law, an instrumental witness attests solely to the voluntary execution of the instrument by the principal in the physical or virtual presence of the ENP. Witnesses do not have access to confidential contract details outside the attestation clause and witness signature lines.
            </p>
          </div>
        </div>
      </div>

      {/* Active Module Content */}
      {activeModuleId === 'witness-readiness' ? (
        /* Hardware & Network Readiness Module */
        <div className="border border-black/15 bg-white p-5 dark:border-white/15 dark:bg-neutral-950 space-y-4">
          <h3 className="text-sm font-bold text-black dark:text-white">
            Videoconference Readiness Diagnostics
          </h3>
          <p className="text-xs text-neutral-500">
            Verify device camera, microphone, and internet latency prior to entering the Remote Electronic Notarization (REN) session.
          </p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 pt-2">
            <div className="border border-black/10 p-4 dark:border-white/10 flex flex-col items-center text-center">
              <Camera className="h-6 w-6 text-neutral-600 dark:text-neutral-400 mb-2" />
              <span className="text-xs font-bold">Webcam Video Stream</span>
              <span className="text-[11px] text-neutral-500 mt-1">1080p Full HD Capable</span>
              <span className="mt-2 text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                {readinessTested ? 'READY (720p+ required)' : 'NOT TESTED'}
              </span>
            </div>

            <div className="border border-black/10 p-4 dark:border-white/10 flex flex-col items-center text-center">
              <Mic className="h-6 w-6 text-neutral-600 dark:text-neutral-400 mb-2" />
              <span className="text-xs font-bold">Audio Microphone</span>
              <span className="text-[11px] text-neutral-500 mt-1">Noise Cancellation Active</span>
              <span className="mt-2 text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                {readinessTested ? 'READY (Clear 48kHz)' : 'NOT TESTED'}
              </span>
            </div>

            <div className="border border-black/10 p-4 dark:border-white/10 flex flex-col items-center text-center">
              <Wifi className="h-6 w-6 text-neutral-600 dark:text-neutral-400 mb-2" />
              <span className="text-xs font-bold">Bandwidth & Latency</span>
              <span className="text-[11px] text-neutral-500 mt-1">Ping to Manila RTC Node</span>
              <span className="mt-2 text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                {readinessTested ? '24ms (<150ms required)' : 'NOT TESTED'}
              </span>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={runReadinessTest}
              disabled={testingReadiness}
              className="flex items-center gap-1.5 border border-black bg-black px-4 py-2 text-xs font-semibold text-white hover:bg-neutral-800 dark:border-white dark:bg-white dark:text-black dark:hover:bg-neutral-200 cursor-pointer"
            >
              <Activity className="h-3.5 w-3.5" />
              <span>{testingReadiness ? 'Testing Hardware...' : 'Run Diagnostics Test'}</span>
            </button>
          </div>
        </div>
      ) : activeModuleId === 'witness-documents' ? (
        /* Assigned Documents (Redacted View) */
        <div className="border border-black/15 bg-white p-5 dark:border-white/15 dark:bg-neutral-950 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-black dark:text-white">
                Assigned Attestation Clauses (Redacted View)
              </h3>
              <p className="text-xs text-neutral-500">
                Witness viewing permissions are limited to attestation clauses pursuant to privacy and notarial guidelines.
              </p>
            </div>
            <StatusBadge status="PRIVACY REDACTED" variant="warning" size="sm" />
          </div>

          <div className="border border-black/10 p-4 space-y-3 font-serif text-xs leading-relaxed text-neutral-700 dark:text-neutral-300 bg-neutral-50/50 dark:bg-neutral-900/40">
            <div className="font-sans text-[10px] uppercase font-mono text-neutral-400 mb-1">
              Instrument Reference: BENF-2026-0002 • Special Power of Attorney
            </div>
            <div className="bg-neutral-200 dark:bg-neutral-800 p-2 text-neutral-400 text-center font-sans text-[11px] italic">
              [Document body and principal financial recitals redacted pursuant to Data Privacy Act R.A. 10173]
            </div>
            <p className="pt-2 font-semibold">
              ATTESTATION CLAUSE:
            </p>
            <p>
              "We, the undersigned instrumental witnesses, hereby certify and attest that the foregoing Special Power of Attorney was on this day signed, published, and declared by the Principal, Maria Elena Santos, who is personally known to us or whose identity was established by competent evidence, in our presence and in the presence of the Electronic Notary Public..."
            </p>
            <div className="border-t border-neutral-300 pt-3 dark:border-neutral-700 flex justify-between items-end">
              <div>
                <span className="text-[10px] font-mono text-neutral-400">Witness Signature Line:</span>
                <div className="font-sans font-bold text-xs">{currentUser.name}</div>
              </div>
              <StatusBadge status="READY FOR SESSION" variant="demo" size="sm" />
            </div>
          </div>
        </div>
      ) : (
        /* Default / Invitations & Overview Table */
        <div className="border border-black/15 bg-white p-5 dark:border-white/15 dark:bg-neutral-950 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-black dark:text-white">
              Witness Invitations & Assigned Notarial Hearings
            </h3>
            <span className="text-xs font-mono text-neutral-500">
              Showing {witnessRequests.length} matters
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-black/20 bg-neutral-50 text-[11px] font-semibold text-neutral-600 dark:border-white/20 dark:bg-neutral-900 dark:text-neutral-400">
                <tr>
                  <th className="p-2.5">Filing ID</th>
                  <th className="p-2.5">Document Title</th>
                  <th className="p-2.5">Principal</th>
                  <th className="p-2.5">Scheduled Hearing</th>
                  <th className="p-2.5">Status</th>
                  <th className="p-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/10 dark:divide-white/10 font-mono text-[11px]">
                {witnessRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50">
                    <td className="p-2.5 font-bold">{req.id}</td>
                    <td className="p-2.5 font-sans font-medium">{req.title}</td>
                    <td className="p-2.5 font-sans">{req.requester.name}</td>
                    <td className="p-2.5">
                      {req.appointment?.scheduledStart
                        ? new Date(req.appointment.scheduledStart).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })
                        : 'Pending Scheduling'}
                    </td>
                    <td className="p-2.5">
                      <StatusBadge status={req.state} size="sm" />
                    </td>
                    <td className="p-2.5 text-right space-x-1 font-sans">
                      <button
                        onClick={() => setSelectedReq(req)}
                        className="border border-black/20 px-2 py-1 text-[11px] hover:bg-neutral-100 dark:border-white/20 dark:hover:bg-neutral-900"
                      >
                        Inspect
                      </button>
                      <button
                        onClick={() => setShowAcceptDialog(true)}
                        className="border border-black bg-black px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-neutral-800 dark:border-white dark:bg-white dark:text-black"
                      >
                        Accept
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Details Drawer */}
      <DetailsDrawer
        isOpen={!!selectedReq}
        onClose={() => setSelectedReq(null)}
        title={selectedReq?.id || 'Filing Details'}
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
              <span className="text-[10px] uppercase font-mono text-neutral-400">Document Type</span>
              <p>{selectedReq.documentType} ({selectedReq.notarialAct})</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono text-neutral-400">Cryptographic Hash</span>
              <p className="font-mono text-[10px] break-all border border-black/10 p-2 bg-neutral-50 dark:bg-neutral-900">
                {selectedReq.sha256Hash}
              </p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono text-neutral-400">Quarantine Status</span>
              <div className="mt-1">
                <StatusBadge status={selectedReq.quarantineStatus} size="sm" />
              </div>
            </div>
            <div className="pt-3 border-t border-black/10 dark:border-white/10 flex justify-end">
              <button
                onClick={() => {
                  setSelectedReq(null);
                  onSelectModule('witness-readiness');
                }}
                className="border border-black bg-black px-3 py-1.5 text-xs text-white dark:border-white dark:bg-white dark:text-black font-semibold"
              >
                Proceed to Session Readiness
              </button>
            </div>
          </div>
        )}
      </DetailsDrawer>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showAcceptDialog}
        title="Confirm Witness Attendance"
        message="By accepting, you confirm that you will be present via encrypted videoconference with your valid government-issued ID to witness the execution of the instrument."
        confirmLabel="Confirm Attendance"
        onConfirm={handleAcceptInvitation}
        onCancel={() => setShowAcceptDialog(false)}
      />
    </div>
  );
};
