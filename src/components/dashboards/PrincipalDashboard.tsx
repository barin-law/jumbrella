import React, { useState } from 'react';
import { PageHeader } from '../common/PageHeader';
import { SummaryCard } from '../common/SummaryCard';
import { StatusBadge } from '../common/StatusBadge';
import { DetailsDrawer } from '../common/DetailsDrawer';
import { ConfirmationDialog } from '../common/ConfirmationDialog';
import {
  FilePlus,
  ShieldCheck,
  Video,
  VideoOff,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  UploadCloud,
  FileText,
  UserCheck,
  Send,
  Eye,
  Camera,
  RefreshCw,
  AlertCircle,
  Calendar,
  CreditCard,
  Download,
  HelpCircle,
  Lock,
  Search,
  CheckCircle,
  FileBadge,
  ChevronDown,
  ChevronUp,
  Mic,
  MicOff,
  Printer,
  QrCode,
  Copy,
  Check,
  LayoutDashboard,
} from 'lucide-react';
import { ROLE_NAVIGATION_MAP } from '../../data/navigationConfig';
import { useNotarization } from '../../context/NotarizationContext';
import { useAuth } from '../../context/AuthContext';
import { NotarizationMode, NotarialAct, NotarizationRequest } from '../../types';
import { truncateHash, sha256 } from '../../utils/crypto';
import { ClientJourneyTracker } from './principal/ClientJourneyTracker';
import { ClientIdentitySection } from './principal/ClientIdentitySection';
import { ClientCasesSection } from './principal/ClientCasesSection';
import { ClientParticipantsSection } from './principal/ClientParticipantsSection';
import { ClientEvidenceSection } from './principal/ClientEvidenceSection';
import { ClientConsultationSection } from './principal/ClientConsultationSection';
import { ClientNotarizationSection } from './principal/ClientNotarizationSection';
import { ClientAccountSection } from './principal/ClientAccountSection';
import { ClientTasksSection } from './principal/ClientTasksSection';
import { ClientActivitySection } from './principal/ClientActivitySection';
import { ClientNotificationsSection } from './principal/ClientNotificationsSection';
import { ClientAppointmentsSection } from './principal/ClientAppointmentsSection';
import { useClientCase } from '../../context/ClientCaseContext';

interface PrincipalDashboardProps {
  activeModuleId: string;
  onSelectModule: (id: string) => void;
}

export const PrincipalDashboard: React.FC<PrincipalDashboardProps> = ({
  activeModuleId,
  onSelectModule,
}) => {
  const { requests, updateState, applyDemoSeal } = useNotarization();
  const { currentUser } = useAuth();

  const [requestCreatedNotice, setRequestCreatedNotice] = useState<string | null>(null);

  // Selected Request for Viewing / Signing Simulation
  const [selectedRequest, setSelectedRequest] = useState<NotarizationRequest | null>(null);
  const [sessionRoomOpen, setSessionRoomOpen] = useState(false);
  const [hasSigned, setHasSigned] = useState(false);
  const [witnessSigned, setWitnessSigned] = useState(false);
  const [isSealing, setIsSealing] = useState(false);
  const [sealSuccessNotice, setSealSuccessNotice] = useState<string | null>(null);
  const [livenessScore, setLivenessScore] = useState<number | null>(98.6);
  const [paidReqId, setPaidReqId] = useState<string | null>(null);
  const [filterState, setFilterState] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSimulatePayment = (reqId: string) => {
    setPaidReqId(reqId);
    setTimeout(() => {
      updateState(reqId, 'SCHEDULED', 'Statutory notarial fee settled via Maya sandbox.');
      setPaidReqId(null);
    }, 800);
  };

  // UI Collapse States for Clean Minimalism
  const [showDemoNoticeDetails, setShowDemoNoticeDetails] = useState(false);
  const [isFilingsPortfolioOpen, setIsFilingsPortfolioOpen] = useState(true);
  const [showJourneyTracker, setShowJourneyTracker] = useState(false);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  // Check if current view is the root Overview/Dashboard
  const isOverview =
    !activeModuleId ||
    activeModuleId === 'principal-overview' ||
    activeModuleId === 'principal-dashboard';

  const activeNavItem = ROLE_NAVIGATION_MAP.PRINCIPAL?.find((item) => item.id === activeModuleId);

  // Video Ceremony Controls
  const [micMuted, setMicMuted] = useState(false);
  const [cameraActive, setCameraActive] = useState(true);

  // 8-Category Navigation Matchers
  const isIdentityModule = [
    'principal-personal-info',
    'principal-contact-info',
    'principal-id-documents',
    'principal-identity',
    'principal-liveness',
    'principal-consent',
    'principal-verify-history',
    'principal-security-mfa',
  ].includes(activeModuleId);

  const isCasesModule = [
    'principal-requests',
    'principal-start',
    'principal-active-cases',
    'principal-awaiting-client',
    'principal-awaiting-lawyer',
    'principal-ready-signing',
    'principal-completed',
    'principal-refused',
    'principal-archived',
  ].includes(activeModuleId);

  const isParticipantsModule = [
    'principal-participants',
    'principal-invite-witness',
    'principal-pending-invitations',
    'principal-participation-requests',
    'principal-id-requirements',
    'principal-participant-access',
  ].includes(activeModuleId);

  const isEvidenceModule = [
    'principal-documents',
    'principal-upload-docs',
    'principal-camera-capture',
    'principal-photographs',
    'principal-audio-evidence',
    'principal-video-evidence',
    'principal-testimonies',
    'principal-supporting-docs',
    'principal-ai-organized',
    'principal-duplicate-review',
    'principal-shared-lawyer',
  ].includes(activeModuleId);

  const isConsultationModule = [
    'principal-lawyer-messages',
    'principal-calendar',
    'principal-live-sessions',
    'principal-meeting-history',
    'principal-shared-screen',
    'principal-consultation-notes',
    'principal-action-items',
  ].includes(activeModuleId);

  const isNotarizationModule = [
    'principal-notarization-requests',
    'principal-appearance-reqs',
    'principal-signing-session',
    'principal-reverify',
    'principal-notarial-status',
    'principal-completed-docs',
    'principal-hash-qr',
  ].includes(activeModuleId);

  const isAccountModule = [
    'principal-profile',
    'principal-privacy',
    'principal-devices',
    'principal-security-settings',
    'principal-payments',
    'principal-support',
    'principal-sign-out',
  ].includes(activeModuleId);

  // Filter requests
  const filteredRequests = requests.filter((r) => {
    if (filterState !== 'ALL' && r.state !== filterState) return false;
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

  const completedRequests = requests.filter((r) => r.state === 'COMPLETED');
  const scheduledRequests = requests.filter((r) => r.state === 'SCHEDULED');
  const pendingRequests = requests.filter(
    (r) => r.state !== 'COMPLETED' && r.state !== 'REFUSED' && r.state !== 'CANCELLED'
  );

  return (
    <div id="principal-dashboard-view" className="space-y-6">
      {isOverview ? (
        <>
          <PageHeader
            breadcrumbs={[{ label: 'Parties' }, { label: 'Signer & Principal Workspace', active: true }]}
            title="Signer & Principal Workspace"
            purpose="Initiate demonstrative notarial filings, complete identity preparation, track quarantine screening, and participate in scheduled videoconference hearings."
            statusBadge={<StatusBadge status="PRINCIPAL ROLE" variant="info" />}
            primaryAction={{
              label: 'Start Notarization Request (Demo)',
              icon: FilePlus,
              onClick: () => onSelectModule('principal-start'),
            }}
            secondaryActions={[
              {
                label: 'My Documents',
                icon: FileText,
                onClick: () => onSelectModule('principal-documents'),
              },
            ]}
          />

          {requestCreatedNotice && (
            <div className="border border-emerald-500 bg-emerald-50 p-3 text-xs text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
              {requestCreatedNotice}
            </div>
          )}

          {/* Summary Cards with Interactive Navigation */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div
              onClick={() => onSelectModule('principal-active-cases')}
              className="cursor-pointer transition-transform hover:-translate-y-0.5 focus:outline-hidden"
              role="button"
              tabIndex={0}
              title="Click to view active filings"
            >
              <SummaryCard
                label="Active Filings"
                value={pendingRequests.length}
                subtext="In review or processing"
                icon={FileText}
              />
            </div>
            <div
              onClick={() => onSelectModule('principal-appointments')}
              className="cursor-pointer transition-transform hover:-translate-y-0.5 focus:outline-hidden"
              role="button"
              tabIndex={0}
              title="Click to view scheduled hearings"
            >
              <SummaryCard
                label="Scheduled Hearings"
                value={scheduledRequests.length}
                subtext="Awaiting videoconference slot"
                icon={Calendar}
                trend={{ value: 'Awaiting hearing', positive: true }}
              />
            </div>
            <div
              onClick={() => onSelectModule('principal-completed')}
              className="cursor-pointer transition-transform hover:-translate-y-0.5 focus:outline-hidden"
              role="button"
              tabIndex={0}
              title="Click to view completed instruments"
            >
              <SummaryCard
                label="Completed Instruments"
                value={completedRequests.length}
                subtext="Demo notarial certificates"
                icon={CheckCircle2}
              />
            </div>
            <div
              onClick={() => onSelectModule('principal-liveness')}
              className="cursor-pointer transition-transform hover:-translate-y-0.5 focus:outline-hidden"
              role="button"
              tabIndex={0}
              title="Click to view identity readiness"
            >
              <SummaryCard
                label="Identity Readiness"
                value={livenessScore ? `${livenessScore}% Passed` : 'eKYC Prepared'}
                subtext="PhilSys ePhilID active"
                icon={UserCheck}
                trend={{ value: 'Demo profile ready', positive: true }}
              />
            </div>
          </div>

          {/* Legal & Security Safeguard Banner (Collapsible & Minimalist) */}
          <div className="border border-black/20 bg-neutral-100 p-3 dark:border-white/20 dark:bg-neutral-900 text-xs transition-all">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 truncate">
                <ShieldCheck className="h-4 w-4 text-black dark:text-white shrink-0" />
                <span className="font-bold text-black dark:text-white font-mono text-[11px] uppercase tracking-wider truncate">
                  Demonstration Environment
                </span>
                <span className="text-[11px] text-neutral-600 dark:text-neutral-400 hidden sm:inline truncate">
                  • Simulated mode pursuant to Supreme Court A.M. No. 24-10-14-SC demo parameters.
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] font-mono border border-black/20 px-1.5 py-0.5 dark:border-white/20 hidden md:inline">
                  A.M. No. 24-10-14-SC
                </span>
                <button
                  onClick={() => setShowDemoNoticeDetails(!showDemoNoticeDetails)}
                  className="border border-black/20 px-2 py-0.5 text-[11px] hover:bg-neutral-200 dark:border-white/20 dark:hover:bg-neutral-800 cursor-pointer flex items-center gap-1 font-mono"
                >
                  <span>{showDemoNoticeDetails ? 'Hide Info' : 'Demo Info'}</span>
                  {showDemoNoticeDetails ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                </button>
              </div>
            </div>

            {showDemoNoticeDetails && (
              <div className="mt-2.5 pt-2.5 border-t border-black/10 dark:border-white/10 space-y-2">
                <p className="text-neutral-600 dark:text-neutral-400 text-[11px]">
                  This function uses simulated demonstration data and does not create a legally valid identity verification, signature, notarization, certificate, seal, payment, or government record. All operations are local and purely for procedural review.
                </p>
                <div className="flex flex-wrap gap-2 text-[10px] font-mono text-neutral-500 pt-1">
                  <span>APP_ENV=demo</span>
                  <span>•</span>
                  <span>DEMO_MODE=true</span>
                  <span>•</span>
                  <span>DEMO_LEGAL_VALIDITY=false</span>
                  <span>•</span>
                  <span>EGOVPH=simulated</span>
                  <span>•</span>
                  <span>PHILSYS=simulated</span>
                  <span>•</span>
                  <span>MALWARE_SCANNER=simulated</span>
                  <span>•</span>
                  <span>NOTARIZATION=simulated</span>
                </div>
              </div>
            )}
          </div>

          {/* 24-Step Client Journey Tracker with clean collapse toggle */}
          <div className="border border-black/15 bg-white p-3.5 dark:border-white/15 dark:bg-neutral-950 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-black dark:text-white tracking-tight">
                  JuriMbrella 24-Step Operational Workflow — Aligned with A.M. No. 24-10-14-SC
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 border border-black/20 dark:border-white/20 text-neutral-500">
                  24 Operational Milestones
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowJourneyTracker(!showJourneyTracker)}
                className="text-xs border border-black/20 px-2.5 py-1 hover:bg-neutral-100 dark:border-white/20 dark:hover:bg-neutral-900 cursor-pointer flex items-center gap-1 font-mono text-neutral-700 dark:text-neutral-300"
              >
                <span>{showJourneyTracker ? 'Hide Roadmap' : 'Show Roadmap Steps'}</span>
                {showJourneyTracker ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              </button>
            </div>
            {showJourneyTracker && (
              <div className="pt-2 border-t border-black/10 dark:border-white/10">
                <ClientJourneyTracker onNavigateModule={onSelectModule} />
              </div>
            )}
          </div>
        </>
      ) : (
        /* Contextual Clean Header for Specific Active Module */
        <PageHeader
          breadcrumbs={[
            { label: 'Workspace' },
            { label: activeNavItem?.category || 'Active View' },
            { label: activeNavItem?.label || 'Module', active: true },
          ]}
          title={activeNavItem?.label || 'Workspace Module'}
          purpose={
            activeNavItem?.description ||
            'Manage operational workflows, electronic notarization files, and case records.'
          }
          statusBadge={
            activeNavItem?.statusBadge ? (
              <StatusBadge status={activeNavItem.statusBadge} variant="success" size="sm" />
            ) : (
              <StatusBadge status={activeNavItem?.category?.toUpperCase() || 'MODULE'} variant="info" size="sm" />
            )
          }
          secondaryActions={[
            {
              label: 'Back to Dashboard',
              icon: LayoutDashboard,
              onClick: () => onSelectModule('principal-overview'),
            },
          ]}
        />
      )}

      {/* SUB-VIEWS */}
      {isIdentityModule ? (
        <ClientIdentitySection activeSubModule={activeModuleId} />
      ) : isCasesModule ? (
        <ClientCasesSection activeSubModule={activeModuleId} onNavigateModule={onSelectModule} />
      ) : isParticipantsModule ? (
        <ClientParticipantsSection activeSubModule={activeModuleId} onNavigateModule={onSelectModule} />
      ) : isEvidenceModule ? (
        <ClientEvidenceSection activeSubModule={activeModuleId} />
      ) : isConsultationModule ? (
        <ClientConsultationSection activeSubModule={activeModuleId} onNavigateModule={onSelectModule} />
      ) : isNotarizationModule ? (
        <ClientNotarizationSection activeSubModule={activeModuleId} onNavigateModule={onSelectModule} />
      ) : isAccountModule ? (
        <ClientAccountSection activeSubModule={activeModuleId} onNavigateModule={onSelectModule} />
      ) : activeModuleId === 'principal-tasks' ? (
        <ClientTasksSection onNavigateModule={onSelectModule} />
      ) : activeModuleId === 'principal-activity' ? (
        <ClientActivitySection />
      ) : activeModuleId === 'principal-notifications' ? (
        <ClientNotificationsSection onNavigateModule={onSelectModule} />
      ) : activeModuleId === 'principal-appointments' ? (
        <ClientAppointmentsSection
          onEnterCeremonyRoom={(ref) => {
            const req = requests.find((r) => r.referenceNumber === ref) || requests[0];
            if (req) {
              setSelectedRequest(req);
              setHasSigned(req.state === 'COMPLETED');
              setWitnessSigned(req.state === 'COMPLETED');
              setSessionRoomOpen(true);
            }
          }}
        />
      ) : isOverview ? (
        /* Default / All Requests Overview (Clean, Minimalist & Collapsible) */
        <div className="border border-black/15 bg-white p-5 dark:border-white/15 dark:bg-neutral-950 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-black/10 pb-3 dark:border-white/10">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-black dark:text-white">
                My Notarization Filings Portfolio
              </h3>
              <span className="text-xs font-mono text-neutral-500">
                ({filteredRequests.length} filings)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative w-56">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-neutral-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search filings..."
                  className="w-full border border-black/20 bg-white py-1.5 pl-8 pr-2.5 text-xs dark:border-white/20 dark:bg-black"
                />
              </div>
              <button
                onClick={() => setIsFilingsPortfolioOpen(!isFilingsPortfolioOpen)}
                className="border border-black/20 px-2.5 py-1 text-xs hover:bg-neutral-100 dark:border-white/20 dark:hover:bg-neutral-900 cursor-pointer flex items-center gap-1 font-mono"
              >
                <span>{isFilingsPortfolioOpen ? 'Collapse' : 'Expand'}</span>
                {isFilingsPortfolioOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              </button>
            </div>
          </div>

          {isFilingsPortfolioOpen && (
            <>
              {/* Quick Filter Tabs for Easy Navigation */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  onClick={() => setFilterState('ALL')}
                  className={`px-3 py-1 text-[11px] font-semibold border transition-colors cursor-pointer ${
                    filterState === 'ALL'
                      ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
                      : 'border-black/20 text-neutral-600 hover:bg-neutral-100 dark:border-white/20 dark:text-neutral-400 dark:hover:bg-neutral-900'
                  }`}
                >
                  All ({requests.length})
                </button>
                <button
                  onClick={() => setFilterState('INTAKE_REVIEW')}
                  className={`px-3 py-1 text-[11px] font-semibold border transition-colors cursor-pointer ${
                    filterState === 'INTAKE_REVIEW'
                      ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
                      : 'border-black/20 text-neutral-600 hover:bg-neutral-100 dark:border-white/20 dark:text-neutral-400 dark:hover:bg-neutral-900'
                  }`}
                >
                  In Review ({requests.filter((r) => r.state === 'INTAKE_REVIEW' || r.state === 'UPLOADED_QUARANTINED').length})
                </button>
                <button
                  onClick={() => setFilterState('SCHEDULED')}
                  className={`px-3 py-1 text-[11px] font-semibold border transition-colors cursor-pointer ${
                    filterState === 'SCHEDULED'
                      ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
                      : 'border-black/20 text-neutral-600 hover:bg-neutral-100 dark:border-white/20 dark:text-neutral-400 dark:hover:bg-neutral-900'
                  }`}
                >
                  Scheduled ({scheduledRequests.length})
                </button>
                <button
                  onClick={() => setFilterState('COMPLETED')}
                  className={`px-3 py-1 text-[11px] font-semibold border transition-colors cursor-pointer ${
                    filterState === 'COMPLETED'
                      ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
                      : 'border-black/20 text-neutral-600 hover:bg-neutral-100 dark:border-white/20 dark:text-neutral-400 dark:hover:bg-neutral-900'
                  }`}
                >
                  Completed ({completedRequests.length})
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-black/20 bg-neutral-50 text-[11px] font-semibold text-neutral-600 dark:border-white/20 dark:bg-neutral-900 dark:text-neutral-400">
                    <tr>
                      <th className="p-2.5">Reference No.</th>
                      <th className="p-2.5">Instrument Title</th>
                      <th className="p-2.5">Mode & Act</th>
                      <th className="p-2.5">Quarantine & Hash</th>
                      <th className="p-2.5">State</th>
                      <th className="p-2.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/10 dark:divide-white/10 font-mono text-[11px]">
                    {filteredRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50">
                        <td className="p-2.5 font-bold">{req.referenceNumber}</td>
                        <td className="p-2.5 font-sans">
                          <div className="font-semibold text-black dark:text-white">{req.title}</div>
                          <div className="text-[10px] text-neutral-500">{req.documentType}</div>
                        </td>
                        <td className="p-2.5 font-sans">
                          <span className="font-semibold">{req.mode}</span> • {req.notarialAct}
                        </td>
                        <td className="p-2.5">
                          <div className="flex items-center gap-1 text-[11px]">
                            <ShieldCheck className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                            <span className="font-mono">{truncateHash(req.document.pdfaSha256, 6, 4)}</span>
                          </div>
                          <span className="text-[10px] text-neutral-500">PDF/A Clean</span>
                        </td>
                        <td className="p-2.5">
                          <StatusBadge status={req.state} size="sm" />
                        </td>
                        <td className="p-2.5 text-right font-sans space-x-1">
                          <button
                            onClick={() => setSelectedRequest(req)}
                            className="border border-black/20 px-2 py-1 text-[11px] hover:bg-neutral-100 dark:border-white/20 dark:hover:bg-neutral-900 cursor-pointer"
                          >
                            Inspect
                          </button>
                          <button
                            onClick={() => {
                              setSelectedRequest(req);
                              setHasSigned(req.state === 'COMPLETED');
                              setWitnessSigned(req.state === 'COMPLETED');
                              setSessionRoomOpen(true);
                            }}
                            className="border border-black bg-black px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-neutral-800 dark:border-white dark:bg-white dark:text-black cursor-pointer"
                          >
                            Ceremony
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      ) : null}

      {/* Details Drawer */}
      <DetailsDrawer
        isOpen={!!selectedRequest && !sessionRoomOpen}
        onClose={() => setSelectedRequest(null)}
        title={selectedRequest?.referenceNumber || 'Filing Details'}
        subtitle={selectedRequest?.title}
      >
        {selectedRequest && (
          <div className="space-y-5 text-xs">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono text-neutral-400">Document Type & Notarial Act</span>
              <p className="font-bold text-sm text-black dark:text-white">{selectedRequest.documentType}</p>
              <span className="text-[11px] text-neutral-600 dark:text-neutral-400 font-mono">
                Act: {selectedRequest.notarialAct} • Mode: {selectedRequest.mode}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono text-neutral-400">Filing Status</span>
              <div>
                <StatusBadge status={selectedRequest.state} size="sm" />
              </div>
            </div>

            <div className="space-y-1 font-mono">
              <span className="text-[10px] uppercase text-neutral-400">PDF/A Cryptographic Hash (SHA-256)</span>
              <p className="border border-black/10 p-2 text-[10px] break-all bg-neutral-50 dark:bg-neutral-900">
                {selectedRequest.document.pdfaSha256}
              </p>
            </div>

            <div className="space-y-2 border-t border-black/10 pt-3 dark:border-white/10">
              <span className="text-[10px] uppercase font-mono text-neutral-400">Participants & Witnesses</span>
              <div className="space-y-1 font-mono text-[11px]">
                <div className="flex items-center justify-between border border-black/10 p-2 bg-white dark:border-white/10 dark:bg-black">
                  <span>Signer: {selectedRequest.requester.name}</span>
                  <span className="text-emerald-600 font-bold">READY</span>
                </div>
                <div className="flex items-center justify-between border border-black/10 p-2 bg-white dark:border-white/10 dark:bg-black">
                  <span>Presiding: Atty. Juan Dela Cruz (ENP)</span>
                  <span className="text-blue-600 font-bold">ASSIGNED</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-black/10 dark:border-white/10 flex flex-col gap-2">
              <button
                onClick={() => {
                  setHasSigned(selectedRequest.state === 'COMPLETED');
                  setWitnessSigned(selectedRequest.state === 'COMPLETED');
                  setSessionRoomOpen(true);
                }}
                className="w-full border border-black bg-black px-4 py-2 text-xs text-white font-semibold hover:bg-neutral-800 dark:border-white dark:bg-white dark:text-black dark:hover:bg-neutral-200 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Video className="h-3.5 w-3.5" />
                <span>Enter Ceremony Workspace</span>
              </button>

              {selectedRequest.state !== 'COMPLETED' && selectedRequest.state !== 'SCHEDULED' && (
                <button
                  onClick={() => handleSimulatePayment(selectedRequest.id)}
                  className="w-full border border-black/30 bg-neutral-100 px-4 py-2 text-xs font-semibold hover:bg-neutral-200 dark:border-white/30 dark:bg-neutral-900 dark:hover:bg-neutral-800 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <CreditCard className="h-3.5 w-3.5" />
                  <span>
                    {paidReqId === selectedRequest.id ? 'Processing Sandbox Payment...' : 'Simulate Fee Settlement (₱500)'}
                  </span>
                </button>
              )}

              <button
                onClick={() => {
                  setRequestCreatedNotice(`Filing summary PDF downloaded for ${selectedRequest.referenceNumber} (Demo).`);
                  setTimeout(() => setRequestCreatedNotice(null), 4000);
                }}
                className="w-full border border-black/20 px-4 py-1.5 text-xs hover:bg-neutral-100 dark:border-white/20 dark:hover:bg-neutral-900 cursor-pointer flex items-center justify-center gap-1.5 text-neutral-600 dark:text-neutral-400"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download Filing Summary (Demo)</span>
              </button>
            </div>
          </div>
        )}
      </DetailsDrawer>

      {/* Interactive Ceremony & Document Signing Modal */}
      {sessionRoomOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
          <div className="w-full max-w-5xl border border-black bg-white p-6 shadow-2xl max-h-[92vh] overflow-y-auto dark:border-white dark:bg-black space-y-6">
            <div className="flex items-center justify-between border-b border-black/15 pb-3 dark:border-white/15">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-500">
                  {selectedRequest.mode} Remote Ceremony Workspace • {selectedRequest.referenceNumber}
                </span>
                <h3 className="text-base font-bold text-black dark:text-white">{selectedRequest.title}</h3>
              </div>
              <button
                onClick={() => {
                  setSessionRoomOpen(false);
                  setSealSuccessNotice(null);
                }}
                className="border border-black px-2.5 py-1 text-xs hover:bg-neutral-100 dark:border-white dark:hover:bg-neutral-900 cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            {sealSuccessNotice && (
              <div className="border border-emerald-500 bg-emerald-50 p-3 text-xs text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>{sealSuccessNotice}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left 2 Cols: Document Viewer with Watermark */}
              <div className="md:col-span-2 border border-black/20 p-5 bg-neutral-50 space-y-4 dark:border-white/20 dark:bg-neutral-900">
                <div className="flex items-center justify-between border-b border-black/10 pb-2 dark:border-white/10">
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Synchronized PDF/A Document Viewer
                  </span>
                  <span className="text-[10px] font-mono text-neutral-500">
                    Pages: 1 of {selectedRequest.document.pagesCount}
                  </span>
                </div>

                <div className="relative bg-white p-6 border border-neutral-300 min-h-[280px] text-xs font-serif leading-relaxed dark:bg-neutral-950 dark:border-neutral-700 text-black dark:text-white space-y-3">
                  <div className="absolute top-2 right-2 border border-black bg-black px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white dark:border-white dark:bg-white dark:text-black font-mono">
                    DEMO — NOT LEGALLY VALID
                  </div>
                  <div className="text-center font-bold tracking-wider uppercase border-b pb-2">
                    REPUBLIC OF THE PHILIPPINES) S.S.
                    <br />
                    CITY OF MAKATI)
                  </div>
                  <p className="font-bold text-center underline">{selectedRequest.title}</p>
                  <p>
                    KNOW ALL MEN BY THESE PRESENTS: That I,{' '}
                    <strong>{selectedRequest.requester.name}</strong>, of legal age, Filipino, do
                    hereby name, constitute, and appoint the Attorney-in-Fact herein named to act in my name and stead...
                  </p>
                  <div className="pt-4 border-t border-dashed space-y-1 text-[11px] font-mono">
                    <p>DOCUMENT SHA-256: {selectedRequest.document.pdfaSha256}</p>
                    <p>ACT: {selectedRequest.notarialAct}</p>
                    <p>STATUS: {selectedRequest.state}</p>
                  </div>

                  {/* Principal Signature */}
                  {hasSigned && (
                    <div className="mt-4 border border-black p-2.5 bg-neutral-100 dark:border-white dark:bg-neutral-800 text-[11px] font-mono">
                      <div className="flex items-center gap-1.5 font-bold text-black dark:text-white">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        DIGITAL SIGNATURE DEMO APPLIED (NOT LEGALLY VALID)
                      </div>
                      <p className="text-[10px] text-neutral-600 dark:text-neutral-400 mt-1">
                        Signer: {currentUser.name} • Timestamp: {new Date().toLocaleTimeString()} PHT
                      </p>
                    </div>
                  )}

                  {/* Instrumental Witness Signature */}
                  {witnessSigned && (
                    <div className="mt-2 border border-black/30 p-2.5 bg-neutral-100 dark:border-white/30 dark:bg-neutral-800 text-[11px] font-mono">
                      <div className="flex items-center gap-1.5 font-bold text-black dark:text-white">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        WITNESS ATTESTATION APPLIED (DEMO)
                      </div>
                      <p className="text-[10px] text-neutral-600 dark:text-neutral-400 mt-1">
                        Witness: Atty. Roberto Cruz • Instrumental Witness • Verified in Session
                      </p>
                    </div>
                  )}

                  {/* Presiding ENP Seal */}
                  {selectedRequest.state === 'COMPLETED' && (
                    <div className="mt-4 border-2 border-black p-4 bg-white dark:border-white dark:bg-neutral-900 font-mono space-y-2">
                      <div className="flex items-center justify-between border-b border-black/10 pb-2 dark:border-white/10">
                        <div className="flex items-center gap-2">
                          <FileBadge className="h-5 w-5 text-emerald-600" />
                          <span className="font-bold text-xs uppercase tracking-wider text-black dark:text-white">
                            ELECTRONIC NOTARIAL CERTIFICATE (DEMO)
                          </span>
                        </div>
                        <span className="text-[10px] bg-black text-white px-2 py-0.5 dark:bg-white dark:text-black font-bold">
                          SEALED
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-700 dark:text-neutral-300">
                        Presiding Notary: <strong>Atty. Juan Dela Cruz</strong> • Commission NP-2025-0814-MKT
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-[10px] text-neutral-600 dark:text-neutral-400 pt-1">
                        <div>Book: XIV</div>
                        <div>Page: 89</div>
                        <div>Doc No.: 413</div>
                        <div>Series: 2026</div>
                      </div>
                      <p className="text-[9px] text-neutral-500 pt-1 border-t border-black/10 dark:border-white/10">
                        DEMO MODE ONLY — A.M. No. 24-10-14-SC Simulated Compliance Verification
                      </p>
                    </div>
                  )}
                </div>

                {/* Signing & Sealing Controls */}
                <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-black/10 dark:border-white/10">
                  <div className="text-[11px] text-neutral-500 font-mono">
                    {selectedRequest.state === 'COMPLETED' ? 'Instrument fully notarized (Demo)' : 'Awaiting required endorsements'}
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {!hasSigned && selectedRequest.state !== 'COMPLETED' && (
                      <button
                        onClick={() => setHasSigned(true)}
                        className="border border-black bg-black px-4 py-1.5 text-xs font-semibold text-white hover:bg-neutral-800 dark:border-white dark:bg-white dark:text-black dark:hover:bg-neutral-200 cursor-pointer"
                      >
                        Affix Principal Digital Signature (Demo)
                      </button>
                    )}

                    {hasSigned && !witnessSigned && selectedRequest.state !== 'COMPLETED' && (
                      <button
                        onClick={() => setWitnessSigned(true)}
                        className="border border-black/30 bg-neutral-200 px-3 py-1.5 text-xs font-semibold text-black hover:bg-neutral-300 dark:border-white/30 dark:bg-neutral-800 dark:text-white cursor-pointer"
                      >
                        Simulate Witness Signature (Demo)
                      </button>
                    )}

                    {hasSigned && selectedRequest.state !== 'COMPLETED' && (
                      <button
                        disabled={isSealing}
                        onClick={async () => {
                          setIsSealing(true);
                          try {
                            const res = await applyDemoSeal(selectedRequest.id, currentUser.uid);
                            if (res.success) {
                              setSealSuccessNotice('Demonstration notarial seal applied by Atty. Juan Dela Cruz.');
                              setSelectedRequest({ ...selectedRequest, state: 'COMPLETED' });
                            }
                          } finally {
                            setIsSealing(false);
                          }
                        }}
                        className="border border-emerald-600 bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 cursor-pointer"
                      >
                        {isSealing ? 'Applying Electronic Seal...' : 'Presiding ENP Seal & Complete (Demo)'}
                      </button>
                    )}

                    {selectedRequest.state === 'COMPLETED' && (
                      <>
                        <button
                          onClick={() => {
                            setSealSuccessNotice('Certified document PDF downloaded for demo review.');
                            setTimeout(() => setSealSuccessNotice(null), 3500);
                          }}
                          className="border border-black px-3 py-1.5 text-xs hover:bg-neutral-100 dark:border-white dark:hover:bg-neutral-900 cursor-pointer flex items-center gap-1.5"
                        >
                          <Download className="h-3.5 w-3.5" />
                          <span>Download Certified PDF</span>
                        </button>
                        <button
                          onClick={() => {
                            setSealSuccessNotice('Document sent to print spooler (Demo).');
                            setTimeout(() => setSealSuccessNotice(null), 3500);
                          }}
                          className="border border-black px-3 py-1.5 text-xs hover:bg-neutral-100 dark:border-white dark:hover:bg-neutral-900 cursor-pointer flex items-center gap-1.5"
                        >
                          <Printer className="h-3.5 w-3.5" />
                          <span>Print</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Col: Video Streams & Controls */}
              <div className="space-y-4">
                {/* Live Video Feeds */}
                <div className="border border-black/20 p-4 space-y-3 dark:border-white/20 bg-neutral-50 dark:bg-neutral-900">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-black dark:text-white">
                      Live Video Hearing
                    </h4>
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                      <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
                      REC ON
                    </span>
                  </div>

                  {/* Signer Stream Box */}
                  <div className="relative aspect-video border border-black/30 bg-neutral-800 text-white flex flex-col items-center justify-center p-2 text-center overflow-hidden">
                    {cameraActive ? (
                      <div className="space-y-1">
                        <UserCheck className="h-8 w-8 mx-auto text-emerald-400" />
                        <span className="text-[11px] font-bold block">{currentUser.name}</span>
                        <span className="text-[9px] text-neutral-400">Signer Video Active</span>
                      </div>
                    ) : (
                      <div className="space-y-1 text-neutral-400">
                        <VideoOff className="h-8 w-8 mx-auto" />
                        <span className="text-[10px]">Camera Disabled</span>
                      </div>
                    )}
                    <div className="absolute bottom-1 left-2 text-[9px] bg-black/60 px-1.5 py-0.5 rounded-sm">
                      You ({currentUser.name})
                    </div>
                  </div>

                  {/* Presiding Notary Stream Box */}
                  <div className="relative aspect-video border border-black/30 bg-neutral-800 text-white flex flex-col items-center justify-center p-2 text-center overflow-hidden">
                    <div className="space-y-1">
                      <ShieldCheck className="h-8 w-8 mx-auto text-blue-400" />
                      <span className="text-[11px] font-bold block">Atty. Juan Dela Cruz</span>
                      <span className="text-[9px] text-neutral-400">Presiding Notary Public (ENP)</span>
                    </div>
                    <div className="absolute bottom-1 left-2 text-[9px] bg-black/60 px-1.5 py-0.5 rounded-sm">
                      ENP Presiding
                    </div>
                  </div>

                  {/* Stream Controls */}
                  <div className="flex items-center justify-center gap-2 pt-2 border-t border-black/10 dark:border-white/10">
                    <button
                      onClick={() => setMicMuted(!micMuted)}
                      className={`p-2 border text-xs flex items-center gap-1 cursor-pointer ${
                        micMuted
                          ? 'border-red-500 bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300'
                          : 'border-black/20 hover:bg-neutral-100 dark:border-white/20 dark:hover:bg-neutral-800'
                      }`}
                      title={micMuted ? 'Unmute microphone' : 'Mute microphone'}
                    >
                      {micMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                      <span className="text-[10px] font-bold">{micMuted ? 'Muted' : 'Mic On'}</span>
                    </button>

                    <button
                      onClick={() => setCameraActive(!cameraActive)}
                      className={`p-2 border text-xs flex items-center gap-1 cursor-pointer ${
                        !cameraActive
                          ? 'border-red-500 bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300'
                          : 'border-black/20 hover:bg-neutral-100 dark:border-white/20 dark:hover:bg-neutral-800'
                      }`}
                      title={cameraActive ? 'Turn off camera' : 'Turn on camera'}
                    >
                      {cameraActive ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                      <span className="text-[10px] font-bold">{cameraActive ? 'Cam On' : 'Cam Off'}</span>
                    </button>
                  </div>
                </div>

                {/* Ceremony Attendees */}
                <div className="border border-black/20 p-4 space-y-3 dark:border-white/20 bg-neutral-50 dark:bg-neutral-900">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-black dark:text-white">
                    Ceremony Participants
                  </h4>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between border border-black/10 p-2 bg-white dark:border-white/10 dark:bg-black">
                      <span>{currentUser.name} (Signer)</span>
                      <StatusBadge status="CONNECTED" variant="success" size="sm" />
                    </div>
                    <div className="flex items-center justify-between border border-black/10 p-2 bg-white dark:border-white/10 dark:bg-black">
                      <span>Atty. Juan Dela Cruz (ENP)</span>
                      <StatusBadge status="PRESIDING" variant="info" size="sm" />
                    </div>
                    <div className="flex items-center justify-between border border-black/10 p-2 bg-white dark:border-white/10 dark:bg-black">
                      <span>Atty. Roberto Cruz (Witness)</span>
                      <StatusBadge status="CONNECTED" variant="success" size="sm" />
                    </div>
                  </div>
                </div>

                {/* ENP Commission Credentials */}
                <div className="border border-black/20 p-4 space-y-2 text-xs dark:border-white/20">
                  <h4 className="font-bold uppercase tracking-wider text-xs">ENP Commission</h4>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    Atty. Juan Dela Cruz • Commission NP-2025-0814-MKT
                  </p>
                  <p className="text-[10px] text-neutral-500 font-mono">
                    Jurisdiction: Regional Trial Court (RTC) Makati City
                  </p>
                  <div className="pt-2 border-t border-black/10 text-[10px] text-neutral-500 flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3 text-emerald-600" />
                    <span>Roll of Attorneys No. 58914 • IBP Lifetime #1094</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
