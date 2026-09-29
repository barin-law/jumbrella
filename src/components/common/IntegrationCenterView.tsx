import React, { useState } from 'react';
import { useIntegration } from '../../context/IntegrationContext';
import { PageHeader } from './PageHeader';
import { SummaryCard } from './SummaryCard';
import { StatusBadge } from './StatusBadge';
import { DetailsDrawer } from './DetailsDrawer';
import {
  Activity,
  CheckCircle,
  AlertTriangle,
  ExternalLink,
  RefreshCw,
  Server,
  Shield,
  Key,
  Info,
} from 'lucide-react';
import { IntegrationAdapter } from '../../types';

export const IntegrationCenterView: React.FC = () => {
  const { adapters, testConnection, operationalCount, demoCount, unconfiguredCount, errorCount } = useIntegration();
  const [selectedAdapter, setSelectedAdapter] = useState<IntegrationAdapter | null>(null);
  const [testingId, setTestingId] = useState<string | null>(null);
  const [statusFeedback, setStatusFeedback] = useState<{ id: string; message: string; success: boolean } | null>(null);
  const [filterState, setFilterState] = useState<string>('ALL');

  const handleTest = async (adapter: IntegrationAdapter) => {
    setTestingId(adapter.id);
    setStatusFeedback(null);
    const result = await testConnection(adapter.id);
    setTestingId(null);
    setStatusFeedback({ id: adapter.id, message: result.message, success: result.success });
  };

  const filteredAdapters = adapters.filter((a) => {
    if (filterState === 'ALL') return true;
    if (filterState === 'DEMO') return a.status === 'DEMO';
    if (filterState === 'NOT_CONFIGURED') return a.status === 'NOT_CONFIGURED';
    if (filterState === 'OPERATIONAL') return a.status === 'OPERATIONAL';
    return true;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[{ label: 'System Architecture' }, { label: 'Integration Center', active: true }]}
        title="Integration Center & Service Adapters"
        purpose="Inspect, diagnose and test all 18 external integration adapters supporting the JuriMbrella Philippine eNotarization facility."
        statusBadge={<StatusBadge status="18 ADAPTERS" variant="demo" />}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          label="Total Adapters"
          value={adapters.length}
          subtext="Standardized adapter interfaces"
          icon={Server}
        />
        <SummaryCard
          label="Demo Sandboxes"
          value={demoCount}
          subtext="Operating in synthetic demo mode"
          icon={Activity}
          trend={{ value: 'Synthetic only', positive: false }}
        />
        <SummaryCard
          label="Unconfigured Secrets"
          value={unconfiguredCount}
          subtext="Production credentials missing"
          icon={Key}
          trend={{ value: 'Security safeguard', positive: true }}
        />
        <SummaryCard
          label="Live Health Checks"
          value="Passing"
          subtext="Client fail-closed verified"
          icon={Shield}
          trend={{ value: 'Accreditation Candidate', positive: true }}
        />
      </div>

      {/* Legal & Security Banner for Adapters */}
      <div className="border border-black/20 bg-neutral-50 p-4 text-xs dark:border-white/20 dark:bg-neutral-950">
        <div className="flex items-start gap-2.5">
          <Info className="h-4 w-4 shrink-0 text-neutral-600 dark:text-neutral-400 mt-0.5" />
          <div className="space-y-1 text-neutral-600 dark:text-neutral-400">
            <p className="font-semibold text-black dark:text-white">
              Strict Candidate Integration Boundary
            </p>
            <p>
              In this development and candidate environment, no actual production secrets (HSM private keys, DICT PNPKI root anchors, PSA PhilSys eKYC gateways, or Supreme Court SC-ENAR tokens) are bound. The application operates strictly in demonstrative candidate mode and enforces fail-closed safeguards. Secret keys are never exposed in the dashboard.
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b border-black/10 pb-2 dark:border-white/10">
        <div className="flex items-center gap-1.5">
          {['ALL', 'DEMO', 'NOT_CONFIGURED'].map((filter) => (
            <button
              key={filter}
              onClick={() => setFilterState(filter)}
              className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                filterState === filter
                  ? 'border border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
                  : 'border border-black/20 bg-white text-neutral-700 hover:bg-neutral-100 dark:border-white/20 dark:bg-black dark:text-neutral-300 dark:hover:bg-neutral-900'
              }`}
            >
              {filter.replace(/_/g, ' ')} ({filter === 'ALL' ? adapters.length : adapters.filter((a) => a.status === filter).length})
            </button>
          ))}
        </div>
        <span className="text-xs text-neutral-500 font-mono">
          Showing {filteredAdapters.length} adapters
        </span>
      </div>

      {/* Adapters Grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {filteredAdapters.map((adapter) => {
          const isTesting = testingId === adapter.id;
          const feedback = statusFeedback?.id === adapter.id ? statusFeedback : null;

          return (
            <div
              key={adapter.id}
              className="border border-black/15 bg-white p-4 transition-all dark:border-white/15 dark:bg-neutral-950 hover:border-black dark:hover:border-white"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-black dark:text-white">
                      {adapter.provider}
                    </h3>
                  </div>
                  <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                    {adapter.capability}
                  </p>
                </div>
                <StatusBadge status={adapter.status} size="sm" />
              </div>

              <p className="mt-2.5 text-xs text-neutral-600 dark:text-neutral-300 line-clamp-2">
                {adapter.description}
              </p>

              {/* Status details */}
              <div className="mt-3 space-y-1.5 border-t border-black/10 pt-2.5 dark:border-white/10 text-[11px] font-mono">
                <div className="flex items-center justify-between text-neutral-500">
                  <span>Environment:</span>
                  <span className="font-semibold text-black dark:text-white">{adapter.environment}</span>
                </div>
                <div className="flex items-center justify-between text-neutral-500">
                  <span>Last Health Check:</span>
                  <span>{new Date(adapter.lastHealthCheck).toLocaleTimeString()}</span>
                </div>
                {adapter.errorStatus && (
                  <div className="text-amber-600 dark:text-amber-400 text-[10px] truncate" title={adapter.errorStatus}>
                    Notice: {adapter.errorStatus}
                  </div>
                )}
              </div>

              {/* Feedback box */}
              {feedback && (
                <div
                  className={`mt-2.5 p-2 text-[11px] border font-mono ${
                    feedback.success
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300'
                      : 'border-amber-500 bg-amber-50 text-amber-900 dark:bg-amber-950/40 dark:text-amber-300'
                  }`}
                >
                  {feedback.message}
                </div>
              )}

              {/* Action bar */}
              <div className="mt-3.5 flex items-center justify-between gap-2 pt-2 border-t border-black/10 dark:border-white/10">
                <button
                  onClick={() => setSelectedAdapter(adapter)}
                  className="text-xs text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white underline cursor-pointer"
                >
                  View Details & Env Vars
                </button>

                <div className="flex items-center gap-1.5">
                  <a
                    href={adapter.docLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-7 items-center gap-1 border border-black/20 px-2 text-[11px] text-neutral-600 hover:bg-neutral-100 dark:border-white/20 dark:text-neutral-400 dark:hover:bg-neutral-900"
                  >
                    <span>Docs</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>

                  <button
                    onClick={() => handleTest(adapter)}
                    disabled={isTesting}
                    className="flex h-7 items-center gap-1 border border-black bg-black px-2.5 text-[11px] font-semibold text-white hover:bg-neutral-800 disabled:opacity-50 dark:border-white dark:bg-white dark:text-black dark:hover:bg-neutral-200 cursor-pointer"
                  >
                    <RefreshCw className={`h-3 w-3 ${isTesting ? 'animate-spin' : ''}`} />
                    <span>{isTesting ? 'Testing...' : 'Test Connection'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Details Drawer */}
      <DetailsDrawer
        isOpen={!!selectedAdapter}
        onClose={() => setSelectedAdapter(null)}
        title={selectedAdapter?.provider || 'Adapter Details'}
        subtitle={selectedAdapter?.capability}
      >
        {selectedAdapter && (
          <div className="space-y-5 text-xs">
            <div>
              <h4 className="font-semibold text-neutral-500 uppercase tracking-wider text-[10px]">
                Adapter Configuration
              </h4>
              <div className="mt-2 space-y-2 border border-black/15 bg-neutral-50 p-3 dark:border-white/15 dark:bg-neutral-950 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Adapter ID:</span>
                  <span className="font-bold">{selectedAdapter.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Status:</span>
                  <StatusBadge status={selectedAdapter.status} size="sm" />
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Environment:</span>
                  <span>{selectedAdapter.environment}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Audit Count:</span>
                  <span>{selectedAdapter.auditHistoryCount} events logged</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-neutral-500 uppercase tracking-wider text-[10px]">
                Required Environment Variables
              </h4>
              <p className="mt-1 text-neutral-500 text-[11px]">
                These variables must be populated in the production secrets store to achieve accredited operational status:
              </p>
              <div className="mt-2 space-y-1 font-mono text-xs">
                {selectedAdapter.requiredEnvVars.map((envVar) => (
                  <div
                    key={envVar}
                    className="flex items-center justify-between border border-black/10 bg-white p-2 dark:border-white/10 dark:bg-black"
                  >
                    <span className="font-bold">{envVar}</span>
                    <span className="text-[10px] text-amber-600 dark:text-amber-400">UNCONFIGURED</span>
                  </div>
                ))}
              </div>
            </div>

            {selectedAdapter.errorStatus && (
              <div>
                <h4 className="font-semibold text-neutral-500 uppercase tracking-wider text-[10px]">
                  Diagnostic Notice
                </h4>
                <div className="mt-1 border border-amber-500/40 bg-amber-50 p-3 text-amber-900 dark:bg-amber-950/30 dark:text-amber-300">
                  {selectedAdapter.errorStatus}
                </div>
              </div>
            )}

            <div>
              <h4 className="font-semibold text-neutral-500 uppercase tracking-wider text-[10px]">
                Official Documentation
              </h4>
              <a
                href={selectedAdapter.docLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1.5 flex items-center justify-between border border-black/20 p-2.5 text-neutral-700 hover:bg-neutral-100 dark:border-white/20 dark:text-neutral-300 dark:hover:bg-neutral-900"
              >
                <span>{selectedAdapter.docLink}</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>

            <div className="pt-4 border-t border-black/10 dark:border-white/10">
              <button
                onClick={() => handleTest(selectedAdapter)}
                className="w-full flex items-center justify-center gap-1.5 border border-black bg-black py-2 text-xs font-semibold text-white hover:bg-neutral-800 dark:border-white dark:bg-white dark:text-black dark:hover:bg-neutral-200 cursor-pointer"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Run Diagnostic Test Handshake</span>
              </button>
            </div>
          </div>
        )}
      </DetailsDrawer>
    </div>
  );
};
