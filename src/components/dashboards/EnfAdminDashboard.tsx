import React, { useState } from 'react';
import { PageHeader } from '../common/PageHeader';
import { SummaryCard } from '../common/SummaryCard';
import { StatusBadge } from '../common/StatusBadge';
import { DetailsDrawer } from '../common/DetailsDrawer';
import { ConfirmationDialog } from '../common/ConfirmationDialog';
import {
  Cpu,
  Users,
  ShieldCheck,
  Building,
  Award,
  Sliders,
  Activity,
  FolderLock,
  RefreshCw,
  Key,
  AlertTriangle,
  Server,
  Lock,
  Mail,
} from 'lucide-react';
import { ContactInquiriesManager } from '../admin/ContactInquiriesManager';

interface EnfAdminDashboardProps {
  activeModuleId?: string;
  onSelectModule?: (id: string) => void;
  onOpenIntegrationCenter?: () => void;
}

export const EnfAdminDashboard: React.FC<EnfAdminDashboardProps> = ({
  activeModuleId,
  onSelectModule,
  onOpenIntegrationCenter,
}) => {
  const [adminTab, setAdminTab] = useState<'CLUSTER' | 'INQUIRIES'>('CLUSTER');
  const [showMfaStepUp, setShowMfaStepUp] = useState(false);
  const [selectedRoleReq, setSelectedRoleReq] = useState<any | null>(null);
  const [adminNotice, setAdminNotice] = useState<string | null>(null);

  const roleRequests = [
    { id: 'REQ-ROLE-104', user: 'Engr. Kenneth Tan', requestedRole: 'SECOPS_ANALYST', currentRole: 'INTERNAL_AUDITOR', rationale: 'Promoted to Lead Threat Analyst; requires SIEM configuration access.', firstApproval: 'Atty. Cristina Legaspi (Compliance)', status: 'PENDING_SECOND_APPROVAL' },
    { id: 'REQ-ROLE-105', user: 'Andrea Dimatulac', requestedRole: 'ORG_ADMIN', currentRole: 'ORG_REQUESTER', rationale: 'Designated corporate administrator for Bayani Logistics Corp.', firstApproval: 'Pending', status: 'AWAITING_FIRST_APPROVAL' },
  ];

  const handleDualApprove = () => {
    setShowMfaStepUp(false);
    setSelectedRoleReq(null);
    setAdminNotice('Dual-custody authorization confirmed with step-up verification. Role permissions updated.');
    setTimeout(() => setAdminNotice(null), 4000);
  };

  return (
    <div id="enf-admin-dashboard-view" className="space-y-6">
      <PageHeader
        breadcrumbs={[{ label: 'Infrastructure' }, { label: 'ENF System Administrator Workspace', active: true }]}
        title="ENF System Administrator Workspace"
        purpose="Platform infrastructure operations, container cluster telemetry, dual-approval role requests, enterprise tenant onboarding, and integration adapter management."
        statusBadge={<StatusBadge status="SYSADMIN PRIVILEGED" variant="error" />}
        primaryAction={
          onOpenIntegrationCenter
            ? {
                label: 'Integration Center (18 Adapters)',
                icon: Cpu,
                onClick: onOpenIntegrationCenter,
              }
            : undefined
        }
        secondaryActions={
          onSelectModule
            ? [
                {
                  label: 'Role Upgrade Requests',
                  icon: ShieldCheck,
                  onClick: () => onSelectModule('admin-role-requests'),
                },
              ]
            : undefined
        }
      />

      {adminNotice && (
        <div className="border border-emerald-500 bg-emerald-50 p-3 text-xs text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
          {adminNotice}
        </div>
      )}

      {/* Admin Workspace Tabs: Cluster & Infrastructure vs Contact Inquiries */}
      <div className="flex items-center gap-2 border-b border-neutral-300 dark:border-neutral-700 pb-2">
        <button
          type="button"
          onClick={() => setAdminTab('CLUSTER')}
          className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold border transition-colors cursor-pointer ${
            adminTab === 'CLUSTER'
              ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
              : 'border-neutral-200 bg-white text-neutral-600 hover:border-black dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300'
          }`}
        >
          <Server className="h-3.5 w-3.5" />
          <span>Infrastructure &amp; Cluster Operations</span>
        </button>
        <button
          type="button"
          onClick={() => setAdminTab('INQUIRIES')}
          className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold border transition-colors cursor-pointer ${
            adminTab === 'INQUIRIES'
              ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
              : 'border-neutral-200 bg-white text-neutral-600 hover:border-black dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300'
          }`}
        >
          <Mail className="h-3.5 w-3.5" />
          <span>Contact &amp; Public Inquiries</span>
        </button>
      </div>

      {adminTab === 'INQUIRIES' ? (
        <ContactInquiriesManager currentUserName="Supreme Court of the Philippines" />
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <SummaryCard
              label="Cluster Service Health"
              value="100%"
              subtext="Cloud Run container nodes"
              icon={Activity}
              trend={{ value: 'Operational', positive: true }}
            />
            <SummaryCard
              label="Dual-Approval Requests"
              value={roleRequests.length}
              subtext="Pending 2-person integrity check"
              icon={ShieldCheck}
              trend={{ value: 'Action Required', positive: false }}
            />
            <SummaryCard
              label="Enterprise Tenants"
              value="4"
              subtext="Onboarded organizations"
              icon={Building}
            />
            <SummaryCard
              label="Adapters Monitored"
              value="18"
              subtext="Standardized interfaces"
              icon={Cpu}
              trend={{ value: 'All Active', positive: true }}
            />
          </div>

          {/* Dual Custody Safeguard Notice */}
          <div className="border border-black/15 bg-neutral-50 p-4 dark:border-white/15 dark:bg-neutral-950 text-xs">
            <div className="flex items-start gap-2.5">
              <Lock className="h-4 w-4 text-neutral-600 dark:text-neutral-400 shrink-0 mt-0.5" />
              <div className="space-y-1 text-neutral-600 dark:text-neutral-400">
                <p className="font-semibold text-black dark:text-white">
                  Two-Person Integrity &amp; Step-Up MFA Safeguard
                </p>
                <p>
                  To eliminate single points of administrative compromise, all privileged role elevations and emergency audit access requests require <strong>dual approval</strong> from independent authorities (Admin + Compliance) and hardware step-up authentication.
                </p>
              </div>
            </div>
          </div>

          {/* Dual-Approval Role Upgrade Queue */}
          <div className="border border-black/15 bg-white p-5 dark:border-white/15 dark:bg-neutral-950 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-black dark:text-white">
                  Privileged Role Upgrade Requests (Dual-Approval Workflow)
                </h3>
                <p className="text-xs text-neutral-500">
                  Requires independent sign-off from both Infrastructure Admin and Compliance Reviewer.
                </p>
              </div>
              <span className="text-xs font-mono text-neutral-500">
                {roleRequests.length} Pending
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-black/20 bg-neutral-50 text-[11px] font-semibold text-neutral-600 dark:border-white/20 dark:bg-neutral-900 dark:text-neutral-400">
                  <tr>
                    <th className="p-2.5">Request ID</th>
                    <th className="p-2.5">Candidate User</th>
                    <th className="p-2.5">Target Role</th>
                    <th className="p-2.5">First Approval</th>
                    <th className="p-2.5">Status</th>
                    <th className="p-2.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/10 dark:divide-white/10 font-mono text-[11px]">
                  {roleRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50">
                      <td className="p-2.5 font-bold">{req.id}</td>
                      <td className="p-2.5 font-sans font-medium">{req.user}</td>
                      <td className="p-2.5 font-bold">{req.requestedRole}</td>
                      <td className="p-2.5 font-sans text-neutral-600 dark:text-neutral-400">{req.firstApproval}</td>
                      <td className="p-2.5">
                        <StatusBadge status={req.status} size="sm" />
                      </td>
                      <td className="p-2.5 text-right font-sans">
                        <button
                          onClick={() => {
                            setSelectedRoleReq(req);
                            setShowMfaStepUp(true);
                          }}
                          className="border border-black bg-black px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-neutral-800 dark:border-white dark:bg-white dark:text-black"
                        >
                          Step-Up &amp; Approve
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Feature Flags & Platform Controls */}
          <div className="border border-black/15 bg-white p-5 dark:border-white/15 dark:bg-neutral-950 space-y-4">
            <h3 className="text-sm font-bold text-black dark:text-white">
              Accreditation Candidate Feature Toggles
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 font-mono text-xs">
              {[
                { flag: 'ENABLE_REMOTE_REN_CEREMONY', status: 'ACTIVE (DEMO)', desc: 'Enables WebRTC remote notarial hearings.' },
                { flag: 'ENFORCE_PHILSYS_EKYC_FAIL_CLOSED', status: 'ENFORCED', desc: 'Fails closed when PSA government gateway is unconfigured.' },
                { flag: 'STRICT_TAMPER_CHAIN_VERIFICATION', status: 'ENFORCED', desc: 'Computes SHA-256 block hash for all transaction state transitions.' },
                { flag: 'EXPORT_CEF_SIEM_STREAMING', status: 'ACTIVE (DEMO)', desc: 'Streams ArcSight CEF threat alerts to SecOps preview.' },
                { flag: 'ENABLE_CORPORATE_BATCH_EXECUTIONS', status: 'ACTIVE (DEMO)', desc: 'Allows enterprise organizations to stage multi-signatory packages.' },
                { flag: 'SUPREME_COURT_SC_ENAR_REGULATORY_SYNC', status: 'AWAITING SPEC', desc: 'Judicial sync suspended pending official court specification.' },
              ].map((item, idx) => (
                <div key={idx} className="border border-black/10 p-3 space-y-1 bg-neutral-50 dark:bg-neutral-900">
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-[11px]">{item.flag}</span>
                    <span className="text-[10px] text-neutral-500">{item.status}</span>
                  </div>
                  <p className="font-sans text-[11px] text-neutral-600 dark:text-neutral-400">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Confirmation Dialog with MFA Step-up */}
      <ConfirmationDialog
        isOpen={showMfaStepUp}
        title="Privileged Dual-Custody Approval Required"
        message={`You are approving elevation of ${selectedRoleReq?.user} to privileged role ${selectedRoleReq?.requestedRole}. Step-up authentication challenge will be verified against your administrative hardware key.`}
        confirmLabel="Verify Step-Up & Grant"
        onConfirm={handleDualApprove}
        onCancel={() => setShowMfaStepUp(false)}
      />
    </div>
  );
};
