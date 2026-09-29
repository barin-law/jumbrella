import React, { useState } from 'react';
import { PageHeader } from '../common/PageHeader';
import { SummaryCard } from '../common/SummaryCard';
import { StatusBadge } from '../common/StatusBadge';
import { DetailsDrawer } from '../common/DetailsDrawer';
import { ConfirmationDialog } from '../common/ConfirmationDialog';
import { useNotarization } from '../../context/NotarizationContext';
import { useAuth } from '../../context/AuthContext';
import {
  Building2,
  FilePlus,
  Files,
  Users,
  FileBadge,
  CreditCard,
  CheckCircle,
  BarChart3,
  Code,
  Webhook,
  Shield,
  Key,
  Archive,
  RefreshCw,
  Plus,
  Copy,
  Trash2,
  AlertTriangle,
} from 'lucide-react';

interface OrgDashboardProps {
  activeModuleId: string;
  onSelectModule: (id: string) => void;
}

export const OrgDashboard: React.FC<OrgDashboardProps> = ({
  activeModuleId,
  onSelectModule,
}) => {
  const { requests, createRequest } = useNotarization();
  const { currentUser } = useAuth();
  const isOrgAdmin = currentUser.role === 'ORG_ADMIN';

  // Batch Request / Template State
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [batchTitle, setBatchTitle] = useState('');
  const [batchTemplate, setBatchTemplate] = useState("Secretary's Certificate — Board Resolution");
  const [batchCount, setBatchCount] = useState(3);
  const [batchNotice, setBatchNotice] = useState<string | null>(null);

  // Webhook State
  const [webhookUrl, setWebhookUrl] = useState('https://api.demo-holdings.ph/webhooks/notary-events');
  const [webhookSecret] = useState('whsec_demo_9824f8a02bd81c9a1708');
  const [webhookSaved, setWebhookSaved] = useState(false);

  // API Key State
  const [apiKeyCopied, setApiKeyCopied] = useState(false);

  const orgRequests = requests.filter(
    (r) => r.requester.name.includes('Santos') || r.title.includes('Resolution') || r.title.includes('Power') || r.id === 'BENF-2026-0001'
  );

  const handleCreateBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchTitle.trim()) return;

    for (let i = 1; i <= batchCount; i++) {
      await createRequest({
        title: `${batchTitle} (Batch #${i})`,
        documentType: batchTemplate,
        mode: 'REN',
        notarialAct: 'ACKNOWLEDGMENT',
        originalFilename: `Corporate_Execution_Batch_${i}.pdf`,
        fileSize: 420000 + i * 50000,
        requesterName: currentUser.name,
        requesterEmail: currentUser.email,
        participantNames: [currentUser.name, 'Atty. Roberto Cruz (Witness)'],
      });
    }

    setBatchNotice(`Successfully staged batch of ${batchCount} corporate filings.`);
    setShowBatchModal(false);
    setBatchTitle('');
    setTimeout(() => setBatchNotice(null), 4000);
  };

  const handleCopyKey = () => {
    setApiKeyCopied(true);
    navigator.clipboard?.writeText('benf_test_sk_78a8f192cb91024e4c9a8');
    setTimeout(() => setApiKeyCopied(false), 2000);
  };

  return (
    <div id="org-dashboard-view" className="space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: 'Enterprise' },
          { label: isOrgAdmin ? 'Organization Administrator Workspace' : 'Organization Requester Workspace', active: true },
        ]}
        title={isOrgAdmin ? 'Enterprise Organization Administrator' : 'Enterprise Organization Requester'}
        purpose="Manage corporate notarial filings, pre-approved board resolution templates, bulk submissions, API keys, and departmental authorizations."
        statusBadge={
          <StatusBadge
            status={isOrgAdmin ? 'ORG ADMIN PRIVILEGED' : 'ORG REQUESTER'}
            variant="info"
          />
        }
        primaryAction={{
          label: 'Create Corporate Request',
          icon: FilePlus,
          onClick: () => setShowBatchModal(true),
        }}
        secondaryActions={[
          {
            label: 'Approved Templates',
            icon: FileBadge,
            onClick: () => onSelectModule('org-templates'),
          },
        ]}
      />

      {batchNotice && (
        <div className="border border-emerald-500 bg-emerald-50 p-3 text-xs text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
          {batchNotice}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          label="Corporate Filings"
          value={orgRequests.length}
          subtext="Active corporate matters"
          icon={Building2}
        />
        <SummaryCard
          label="Approved Templates"
          value="6"
          subtext="Board resolutions & contracts"
          icon={FileBadge}
        />
        <SummaryCard
          label="Escrow Balance"
          value="₱48,500.00"
          subtext="Corporate prepaid notarial balance"
          icon={CreditCard}
          trend={{ value: 'Demo Balance', positive: true }}
        />
        <SummaryCard
          label="API Sandbox"
          value="Operational"
          subtext="REST & Webhooks active"
          icon={Code}
          trend={{ value: 'HMAC-SHA256', positive: true }}
        />
      </div>

      {/* Sub-view Content based on activeModuleId */}
      {activeModuleId === 'org-templates' ? (
        /* Approved Templates Module */
        <div className="border border-black/15 bg-white p-5 dark:border-white/15 dark:bg-neutral-950 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-black dark:text-white">
                Enterprise Approved Instrument Templates
              </h3>
              <p className="text-xs text-neutral-500">
                Pre-vetted legal forms authorized by Corporate Legal Counsel for expedited electronic notarization.
              </p>
            </div>
            <button
              onClick={() => setShowBatchModal(true)}
              className="border border-black bg-black px-3 py-1.5 text-xs text-white dark:border-white dark:bg-white dark:text-black font-semibold"
            >
              Use Template in Request
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 pt-2">
            {[
              { title: "Secretary's Certificate — Board Resolution", type: 'JURAT', version: 'v3.2', updated: '2026-08-15' },
              { title: 'Special Power of Attorney — Bank Transactions', type: 'ACKNOWLEDGMENT', version: 'v2.1', updated: '2026-07-20' },
              { title: 'Corporate Non-Disclosure Agreement (Bilingual)', type: 'ACKNOWLEDGMENT', version: 'v4.0', updated: '2026-09-01' },
              { title: 'Commercial Real Estate Lease Extension', type: 'ACKNOWLEDGMENT', version: 'v1.8', updated: '2026-06-11' },
              { title: 'Affidavit of Authorized Corporate Representative', type: 'JURAT', version: 'v2.4', updated: '2026-08-30' },
              { title: 'Deed of Absolute Assignment of Shares', type: 'ACKNOWLEDGMENT', version: 'v1.5', updated: '2026-05-18' },
            ].map((tmpl, idx) => (
              <div
                key={idx}
                className="border border-black/10 p-3.5 space-y-2 hover:border-black dark:border-white/10 dark:hover:border-white transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs font-bold text-black dark:text-white leading-snug">
                    {tmpl.title}
                  </h4>
                  <StatusBadge status={tmpl.type} size="sm" />
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500">
                  <span>Version: {tmpl.version}</span>
                  <span>Rev: {tmpl.updated}</span>
                </div>
                <div className="pt-2 border-t border-black/10 dark:border-white/10 flex justify-end">
                  <button
                    onClick={() => {
                      setBatchTemplate(tmpl.title);
                      setShowBatchModal(true);
                    }}
                    className="text-xs text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white underline cursor-pointer"
                  >
                    Initiate with Template &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : activeModuleId === 'org-api' || activeModuleId === 'org-webhooks' ? (
        /* API Integration & Webhooks Module */
        <div className="space-y-4">
          <div className="border border-black/15 bg-white p-5 dark:border-white/15 dark:bg-neutral-950 space-y-4">
            <h3 className="text-sm font-bold text-black dark:text-white">
              Enterprise REST API Credentials (Sandbox)
            </h3>
            <p className="text-xs text-neutral-500">
              Integrate corporate ERP / Document Management systems with the JuriMbrella API endpoint.
            </p>

            <div className="border border-black/10 p-3 bg-neutral-50 dark:bg-neutral-900 font-mono text-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] text-neutral-400 uppercase">Sandbox API Key:</span>
                <div className="font-bold">benf_test_sk_78a8f192cb91024e4c9a8</div>
              </div>
              <button
                onClick={handleCopyKey}
                className="flex items-center gap-1 border border-black/20 px-2.5 py-1 text-xs hover:bg-neutral-200 dark:border-white/20 dark:hover:bg-neutral-800"
              >
                <Copy className="h-3 w-3" />
                <span>{apiKeyCopied ? 'Copied!' : 'Copy Key'}</span>
              </button>
            </div>
          </div>

          <div className="border border-black/15 bg-white p-5 dark:border-white/15 dark:bg-neutral-950 space-y-4">
            <h3 className="text-sm font-bold text-black dark:text-white">
              Enterprise Webhook Configuration
            </h3>
            <p className="text-xs text-neutral-500">
              Receive signed JSON payloads for transaction events (`FILING_SUBMITTED`, `SEAL_APPLIED`, `NOTARIAL_REFUSED`).
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold uppercase text-neutral-500 mb-1">
                  Callback Endpoint URL
                </label>
                <input
                  type="url"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="w-full border border-black/20 bg-white p-2 text-xs dark:border-white/20 dark:bg-black font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-neutral-500 mb-1">
                  Webhook Signature Secret (HMAC-SHA256)
                </label>
                <input
                  type="text"
                  readOnly
                  value={webhookSecret}
                  className="w-full border border-black/10 bg-neutral-100 p-2 text-xs dark:border-white/10 dark:bg-neutral-900 font-mono text-neutral-500"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => {
                    setWebhookSaved(true);
                    setTimeout(() => setWebhookSaved(false), 3000);
                  }}
                  className="border border-black bg-black px-4 py-2 text-xs font-semibold text-white dark:border-white dark:bg-white dark:text-black"
                >
                  {webhookSaved ? 'Configuration Saved!' : 'Save Webhook Settings'}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : activeModuleId === 'org-team-management' && isOrgAdmin ? (
        /* Team Management Module (Org Admin) */
        <div className="border border-black/15 bg-white p-5 dark:border-white/15 dark:bg-neutral-950 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-black dark:text-white">
                Enterprise Authorized Signatories & Staff Seats
              </h3>
              <p className="text-xs text-neutral-500">
                Grant or revoke corporate filing and signing privileges for corporate officers.
              </p>
            </div>
            <button className="flex items-center gap-1 border border-black bg-black px-3 py-1.5 text-xs text-white dark:border-white dark:bg-white dark:text-black font-semibold">
              <Plus className="h-3.5 w-3.5" />
              <span>Invite Member</span>
            </button>
          </div>

          <div className="overflow-x-auto pt-2">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-black/20 bg-neutral-50 text-[11px] font-semibold text-neutral-600 dark:border-white/20 dark:bg-neutral-900 dark:text-neutral-400">
                <tr>
                  <th className="p-2.5">Name</th>
                  <th className="p-2.5">Corporate Role</th>
                  <th className="p-2.5">MFA Status</th>
                  <th className="p-2.5">Signing Limit</th>
                  <th className="p-2.5">Status</th>
                  <th className="p-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/10 dark:divide-white/10 font-mono text-[11px]">
                {[
                  { name: 'Maria Elena Santos', role: 'Chief Executive Officer', mfa: 'Enforced', limit: '₱50,000,000', status: 'ACTIVE' },
                  { name: 'Carlos Mendoza, CPA', role: 'Organization Administrator', mfa: 'Enforced', limit: 'Admin Access', status: 'ACTIVE' },
                  { name: 'Andrea Dimatulac', role: 'Corporate Paralegal', mfa: 'Enforced', limit: 'Intake Only', status: 'ACTIVE' },
                  { name: 'Atty. Roberto Cruz', role: 'Retained General Counsel', mfa: 'Enforced', limit: 'Witness Only', status: 'ACTIVE' },
                ].map((member, idx) => (
                  <tr key={idx} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50">
                    <td className="p-2.5 font-bold font-sans">{member.name}</td>
                    <td className="p-2.5 font-sans">{member.role}</td>
                    <td className="p-2.5 text-emerald-600 dark:text-emerald-400 font-bold">{member.mfa}</td>
                    <td className="p-2.5">{member.limit}</td>
                    <td className="p-2.5">
                      <StatusBadge status={member.status} size="sm" />
                    </td>
                    <td className="p-2.5 text-right font-sans">
                      <button className="text-neutral-500 hover:text-black dark:hover:text-white text-xs underline">
                        Edit Limits
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Default / Corporate Requests Log */
        <div className="border border-black/15 bg-white p-5 dark:border-white/15 dark:bg-neutral-950 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-black dark:text-white">
              Corporate Notarization Portfolio
            </h3>
            <span className="text-xs font-mono text-neutral-500">
              Showing {orgRequests.length} matters
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-black/20 bg-neutral-50 text-[11px] font-semibold text-neutral-600 dark:border-white/20 dark:bg-neutral-900 dark:text-neutral-400">
                <tr>
                  <th className="p-2.5">Filing ID</th>
                  <th className="p-2.5">Document Title</th>
                  <th className="p-2.5">Type</th>
                  <th className="p-2.5">Signatory</th>
                  <th className="p-2.5">Quarantine</th>
                  <th className="p-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/10 dark:divide-white/10 font-mono text-[11px]">
                {orgRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50">
                    <td className="p-2.5 font-bold">{req.id}</td>
                    <td className="p-2.5 font-sans font-medium">{req.title}</td>
                    <td className="p-2.5">{req.documentType}</td>
                    <td className="p-2.5 font-sans">{req.requester.name}</td>
                    <td className="p-2.5">
                      <StatusBadge status={req.document.quarantineStatus} size="sm" />
                    </td>
                    <td className="p-2.5">
                      <StatusBadge status={req.state} size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Batch Create Modal */}
      {showBatchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg border border-black bg-white p-6 shadow-2xl dark:border-white dark:bg-black text-black dark:text-white">
            <h3 className="text-base font-bold">Initiate Corporate Filings</h3>
            <p className="mt-1 text-xs text-neutral-500">
              Stage individual or batch transactions using pre-approved corporate templates.
            </p>

            <form onSubmit={handleCreateBatch} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold uppercase text-neutral-500 text-[10px] mb-1">
                  Transaction Title Prefix
                </label>
                <input
                  type="text"
                  required
                  value={batchTitle}
                  onChange={(e) => setBatchTitle(e.target.value)}
                  placeholder="e.g., Q3 Board Resolution on Credit Facility"
                  className="w-full border border-black/20 p-2 text-xs bg-white dark:bg-black dark:border-white/20"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase text-neutral-500 text-[10px] mb-1">
                  Approved Legal Template
                </label>
                <select
                  value={batchTemplate}
                  onChange={(e) => setBatchTemplate(e.target.value)}
                  className="w-full border border-black/20 p-2 text-xs bg-white dark:bg-black dark:border-white/20"
                >
                  <option>Secretary's Certificate — Board Resolution</option>
                  <option>Special Power of Attorney — Bank Transactions</option>
                  <option>Corporate Non-Disclosure Agreement (Bilingual)</option>
                  <option>Commercial Real Estate Lease Extension</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold uppercase text-neutral-500 text-[10px] mb-1">
                  Batch Execution Count
                </label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={batchCount}
                  onChange={(e) => setBatchCount(parseInt(e.target.value) || 1)}
                  className="w-full border border-black/20 p-2 text-xs bg-white dark:bg-black dark:border-white/20"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-black/10 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setShowBatchModal(false)}
                  className="border border-black/20 px-3 py-1.5 text-xs hover:bg-neutral-100 dark:border-white/20 dark:hover:bg-neutral-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="border border-black bg-black px-4 py-1.5 text-xs text-white font-semibold hover:bg-neutral-800 dark:border-white dark:bg-white dark:text-black"
                >
                  Create Batch Filings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
