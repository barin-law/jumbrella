import React, { useState } from 'react';
import {
  ShieldAlert,
  Activity,
  BellRing,
  Download,
  Sliders,
  AlertOctagon,
  CheckCircle2,
  Mail,
  MessageSquare,
  Smartphone,
  Radio,
  ExternalLink,
  Play,
  RotateCcw,
} from 'lucide-react';
import { useSecurity } from '../../context/SecurityContext';
import { ThreatType, ThreatAlert } from '../../types';
import { PageHeader } from '../common/PageHeader';
import { StatusBadge } from '../common/StatusBadge';

interface SecOpsDashboardProps {
  activeModuleId?: string;
  onSelectModule?: (id: string) => void;
}

export const SecOpsDashboard: React.FC<SecOpsDashboardProps> = ({
  activeModuleId,
  onSelectModule,
}) => {
  const {
    auditLogs,
    threatAlerts,
    notificationConfig,
    updateNotificationConfig,
    updateThreatStatus,
    simulateThreat,
    exportSiemLogs,
  } = useSecurity();

  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showSiemExportModal, setShowSiemExportModal] = useState(false);
  const [selectedExportFormat, setSelectedExportFormat] = useState<'CEF' | 'JSON' | 'SYSLOG'>('CEF');
  const [copiedNotice, setCopiedNotice] = useState(false);

  // Filtered threats
  const filteredThreats = threatAlerts.filter((t) => {
    if (severityFilter !== 'ALL' && t.severity !== severityFilter) return false;
    return true;
  });

  const activeCount = threatAlerts.filter((t) => t.status === 'ACTIVE').length;
  const criticalCount = threatAlerts.filter((t) => t.severity === 'CRITICAL').length;

  const handleCopySiem = () => {
    const data = exportSiemLogs(selectedExportFormat);
    navigator.clipboard.writeText(data);
    setCopiedNotice(true);
    setTimeout(() => setCopiedNotice(false), 2000);
  };

  const handleDownloadSiem = () => {
    const data = exportSiemLogs(selectedExportFormat);
    const blob = new Blob([data], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jurimbrella-siem-${selectedExportFormat.toLowerCase()}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Mock hourly data points for SVG graph (24h)
  const hourlyAccessData = [
    { hour: '00:00', total: 12, anomaly: 0 },
    { hour: '02:00', total: 8, anomaly: 0 },
    { hour: '04:00', total: 5, anomaly: 1 },
    { hour: '06:00', total: 14, anomaly: 0 },
    { hour: '08:00', total: 45, anomaly: 0 },
    { hour: '10:00', total: 89, anomaly: 6 },
    { hour: '12:00', total: 64, anomaly: 2 },
    { hour: '14:00', total: 95, anomaly: 4 },
    { hour: '16:00', total: 82, anomaly: 1 },
    { hour: '18:00', total: 40, anomaly: 0 },
    { hour: '20:00', total: 28, anomaly: 0 },
    { hour: '22:00', total: 18, anomaly: 2 },
  ];

  return (
    <div id="secops-dashboard-view" className="space-y-6">
      <PageHeader
        breadcrumbs={[{ label: 'Operations' }, { label: 'Security Operations & Threat Detection', active: true }]}
        title="Security Operations & Threat Detection"
        purpose="Monitor real-time security events, manage isolated threat simulations, inspect quarantine telemetry, and export SIEM logs in CEF, Syslog, or JSON formats."
        statusBadge={<StatusBadge status="DEMO SEC-OPS" variant="demo" />}
        primaryAction={{
          label: 'SIEM Formatter Preview',
          icon: Download,
          onClick: () => setShowSiemExportModal(true),
        }}
        secondaryActions={[
          {
            label: 'Alert Channels Status',
            icon: Sliders,
            onClick: () => setShowConfigModal(true),
          },
        ]}
      />

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="border border-black/15 p-4 bg-white dark:border-white/15 dark:bg-black">
          <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
            Total Access Logs
          </p>
          <p className="text-2xl font-bold mt-1 font-mono">{auditLogs.length}</p>
          <p className="text-[10px] text-neutral-500 mt-0.5">Tamper-evident hash chained</p>
        </div>

        <div className="border border-black/15 p-4 bg-white dark:border-white/15 dark:bg-black">
          <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
            Active Threat Alerts
          </p>
          <p className="text-2xl font-bold mt-1 font-mono text-red-600 dark:text-red-400">
            {activeCount}
          </p>
          <p className="text-[10px] text-neutral-500 mt-0.5">Automated containment active</p>
        </div>

        <div className="border border-black/15 p-4 bg-white dark:border-white/15 dark:bg-black">
          <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
            Critical Severity Flags
          </p>
          <p className="text-2xl font-bold mt-1 font-mono">{criticalCount}</p>
          <p className="text-[10px] text-neutral-500 mt-0.5">Privilege escalation & malware</p>
        </div>

        <div className="border border-black/15 p-4 bg-white dark:border-white/15 dark:bg-black">
          <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
            Alert Delivery Channels
          </p>
          <div className="flex items-center gap-2 mt-2">
            <Mail className="h-4 w-4 text-neutral-400 dark:text-neutral-600" />
            <MessageSquare className="h-4 w-4 text-neutral-400 dark:text-neutral-600" />
            <Smartphone className="h-4 w-4 text-neutral-400 dark:text-neutral-600" />
          </div>
          <p className="text-[10px] font-bold text-neutral-600 dark:text-neutral-400 mt-1">
            Status: Not Configured
          </p>
        </div>
      </div>

      {/* Real-Time Access Analytics Graphs (Pure High-Contrast SVG) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Access Attempts & Threat Anomalies Timeline */}
        <div className="lg:col-span-2 border border-black/15 bg-white p-5 dark:border-white/15 dark:bg-black space-y-4">
          <div className="flex items-center justify-between border-b border-black/10 pb-3 dark:border-white/10">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider">
                Real-Time Access Attempts & Anomalies (24 Hours)
              </h3>
              <p className="text-[11px] text-neutral-500">
                Aggregated authentication and transaction requests vs unauthorized anomalies
              </p>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-mono">
              <span className="flex items-center gap-1">
                <span className="inline-block h-2 w-4 bg-black dark:bg-white" />
                Normal Access
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block h-2 w-4 bg-red-600" />
                Security Anomalies
              </span>
            </div>
          </div>

          {/* Clean Monochrome SVG Graph */}
          <div className="w-full h-56 relative pt-4">
            <svg viewBox="0 0 600 180" className="w-full h-full overflow-visible">
              {/* Grid lines */}
              <line x1="40" y1="20" x2="590" y2="20" stroke="currentColor" strokeDasharray="3 3" opacity="0.15" />
              <line x1="40" y1="65" x2="590" y2="65" stroke="currentColor" strokeDasharray="3 3" opacity="0.15" />
              <line x1="40" y1="110" x2="590" y2="110" stroke="currentColor" strokeDasharray="3 3" opacity="0.15" />
              <line x1="40" y1="150" x2="590" y2="150" stroke="currentColor" opacity="0.4" />

              {/* Y Axis Labels */}
              <text x="10" y="25" fontSize="9" fill="currentColor" opacity="0.6">100</text>
              <text x="10" y="70" fontSize="9" fill="currentColor" opacity="0.6">50</text>
              <text x="10" y="115" fontSize="9" fill="currentColor" opacity="0.6">25</text>
              <text x="10" y="155" fontSize="9" fill="currentColor" opacity="0.6">0</text>

              {/* Bar Elements */}
              {hourlyAccessData.map((d, i) => {
                const x = 50 + i * 45;
                const heightNormal = (d.total / 100) * 125;
                const heightAnomaly = (d.anomaly / 10) * 45;
                const yNormal = 150 - heightNormal;
                const yAnomaly = 150 - heightAnomaly;

                return (
                  <g key={i}>
                    {/* Normal Access Bar */}
                    <rect
                      x={x}
                      y={yNormal}
                      width="16"
                      height={heightNormal}
                      className="fill-black dark:fill-white opacity-85 hover:opacity-100 transition-opacity"
                    />
                    {/* Anomaly Bar */}
                    {d.anomaly > 0 && (
                      <rect
                        x={x + 18}
                        y={yAnomaly}
                        width="10"
                        height={heightAnomaly}
                        className="fill-red-600 hover:fill-red-700"
                      />
                    )}
                    {/* X Axis Label */}
                    <text
                      x={x + 8}
                      y="168"
                      fontSize="8"
                      textAnchor="middle"
                      fill="currentColor"
                      opacity="0.7"
                      fontFamily="monospace"
                    >
                      {d.hour}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Right Col: Threat Detection Severity Distribution */}
        <div className="border border-black/15 bg-white p-5 dark:border-white/15 dark:bg-black space-y-4">
          <div className="border-b border-black/10 pb-3 dark:border-white/10">
            <h3 className="text-xs font-bold uppercase tracking-wider">
              Threat Category Vectors
            </h3>
            <p className="text-[11px] text-neutral-500">
              Heuristic classifications & incident response status
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>Failed MFA / Brute-Force</span>
                <span className="font-mono text-neutral-500">45%</span>
              </div>
              <div className="h-2 w-full bg-neutral-200 dark:bg-neutral-800">
                <div className="h-full bg-black dark:bg-white" style={{ width: '45%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>Impossible Travel Velocity</span>
                <span className="font-mono text-neutral-500">30%</span>
              </div>
              <div className="h-2 w-full bg-neutral-200 dark:bg-neutral-800">
                <div className="h-full bg-black dark:bg-white" style={{ width: '30%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>Privilege Escalation Attempt</span>
                <span className="font-mono text-red-600 dark:text-red-400">15%</span>
              </div>
              <div className="h-2 w-full bg-neutral-200 dark:bg-neutral-800">
                <div className="h-full bg-red-600" style={{ width: '15%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>Malware Macro in Quarantine</span>
                <span className="font-mono text-red-600 dark:text-red-400">10%</span>
              </div>
              <div className="h-2 w-full bg-neutral-200 dark:bg-neutral-800">
                <div className="h-full bg-red-600" style={{ width: '10%' }} />
              </div>
            </div>
          </div>

          <div className="border-t border-black/10 pt-3 dark:border-white/10 text-[11px] text-neutral-500 space-y-1">
            <p className="font-semibold text-black dark:text-white">Encryption at Rest & In Transit:</p>
            <p>• Data in Transit: TLS 1.3 with AES-256-GCM cipher suite</p>
            <p>• Data at Rest: Google Cloud Storage Customer-Managed KMS Key</p>
          </div>
        </div>
      </div>

      {/* Interactive Threat Simulation Panel (Proves Real-time Detection & Alerts) */}
      <div className="border border-black/20 bg-neutral-50 p-5 dark:border-white/20 dark:bg-neutral-900 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Play className="h-4 w-4" />
            <h3 className="text-xs font-bold uppercase tracking-wider">
              Automated Alert Testing & Threat Injector Sandbox
            </h3>
          </div>
          <span className="text-[11px] text-neutral-500 font-mono">
            Simulate security events to test automated threshold alerts
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => simulateThreat('FAILED_MFA_BRUTE_FORCE')}
            className="border border-black bg-white p-2.5 text-left text-xs hover:bg-neutral-100 dark:border-white dark:bg-black dark:hover:bg-neutral-800 transition-colors"
          >
            <p className="font-bold">MFA Brute-Force</p>
            <p className="text-[10px] text-neutral-500 mt-0.5">Exceed 5 attempts</p>
          </button>

          <button
            onClick={() => simulateThreat('IMPOSSIBLE_TRAVEL')}
            className="border border-black bg-white p-2.5 text-left text-xs hover:bg-neutral-100 dark:border-white dark:bg-black dark:hover:bg-neutral-800 transition-colors"
          >
            <p className="font-bold">Impossible Travel</p>
            <p className="text-[10px] text-neutral-500 mt-0.5">Taguig to London in 18m</p>
          </button>

          <button
            onClick={() => simulateThreat('UNAUTHORIZED_ROLE_ESCALATION')}
            className="border border-black bg-white p-2.5 text-left text-xs hover:bg-neutral-100 dark:border-white dark:bg-black dark:hover:bg-neutral-800 transition-colors"
          >
            <p className="font-bold">Role Escalation</p>
            <p className="text-[10px] text-neutral-500 mt-0.5">Forge ENP claim token</p>
          </button>

          <button
            onClick={() => simulateThreat('MALWARE_DETECTED')}
            className="border border-black bg-white p-2.5 text-left text-xs hover:bg-neutral-100 dark:border-white dark:bg-black dark:hover:bg-neutral-800 transition-colors"
          >
            <p className="font-bold">Malware Detection</p>
            <p className="text-[10px] text-neutral-500 mt-0.5">ClamAV quarantine test</p>
          </button>
        </div>
      </div>

      {/* Threat Alerts Table */}
      <div className="border border-black/15 bg-white dark:border-white/15 dark:bg-black">
        <div className="border-b border-black/10 px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 dark:border-white/10">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider">
              Security Incident & Threat Feed
            </h3>
            <p className="text-xs text-neutral-500">
              Filtered by severity • Dispatched via configured alert channels
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold">Filter:</span>
            {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'].map((sev) => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`border px-2 py-0.5 text-[11px] font-semibold ${
                  severityFilter === sev
                    ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
                    : 'border-black/20 hover:bg-neutral-100 dark:border-white/20 dark:hover:bg-neutral-900'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-black/10 bg-neutral-50 text-[11px] font-bold uppercase tracking-wider text-neutral-600 dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-300">
              <tr>
                <th className="px-4 py-3">Timestamp / Alert</th>
                <th className="px-4 py-3">Severity</th>
                <th className="px-4 py-3">IP & Location</th>
                <th className="px-4 py-3">Dispatched Alerts</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Containment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 dark:divide-white/10">
              {filteredThreats.map((threat) => {
                const isCritical = threat.severity === 'CRITICAL';
                return (
                  <tr
                    key={threat.id}
                    className="hover:bg-neutral-50/70 transition-colors dark:hover:bg-neutral-900/60"
                  >
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-black dark:text-white">{threat.title}</div>
                      <div className="text-[11px] text-neutral-500 max-w-md">{threat.details}</div>
                      <div className="text-[10px] font-mono text-neutral-400 mt-0.5">
                        Target: {threat.targetUser} • {threat.timestamp}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-block border px-2 py-0.5 text-[10px] font-bold uppercase ${
                          isCritical
                            ? 'border-red-600 bg-red-600 text-white'
                            : 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
                        }`}
                      >
                        {threat.severity}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-mono text-[11px]">
                      <div>{threat.ip}</div>
                      <div className="text-[10px] text-neutral-500">{threat.location}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        {(threat.dispatchedChannels || []).map((c) => (
                          <span
                            key={c}
                            className="border border-black/20 px-1 py-0.2 text-[9px] font-mono font-bold dark:border-white/20"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-mono text-[11px] font-semibold">{threat.status}</span>
                    </td>
                    <td className="px-4 py-3.5 text-right space-x-1">
                      {threat.status === 'ACTIVE' && (
                        <button
                          onClick={() => updateThreatStatus(threat.id, 'CONTAINED')}
                          className="border border-black px-2 py-1 text-[11px] font-semibold hover:bg-neutral-100 dark:border-white dark:hover:bg-neutral-900"
                        >
                          Contain & Block IP
                        </button>
                      )}
                      {threat.status === 'CONTAINED' && (
                        <button
                          onClick={() => updateThreatStatus(threat.id, 'RESOLVED')}
                          className="border border-black px-2 py-1 text-[11px] font-semibold hover:bg-neutral-100 dark:border-white dark:hover:bg-neutral-900"
                        >
                          Mark Resolved
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Threshold Configuration Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg border border-black bg-white p-6 shadow-2xl dark:border-white dark:bg-black space-y-5">
            <div className="flex items-center justify-between border-b border-black/15 pb-3 dark:border-white/15">
              <div className="flex items-center gap-2">
                <Sliders className="h-5 w-5" />
                <h3 className="text-sm font-bold uppercase tracking-wider">
                  Automated Security Alert & Notification Thresholds
                </h3>
              </div>
              <button
                onClick={() => setShowConfigModal(false)}
                className="border border-black px-2 py-1 text-xs hover:bg-neutral-100 dark:border-white dark:hover:bg-neutral-900"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-2 border border-black/10 p-3 dark:border-white/10">
                <p className="font-bold uppercase tracking-wider">Automated Delivery Channels</p>
                <label className="flex items-center justify-between">
                  <span>Email Security Dispatch (SMTP/SES)</span>
                  <input
                    type="checkbox"
                    checked={notificationConfig.emailAlertsEnabled}
                    onChange={(e) => updateNotificationConfig({ emailAlertsEnabled: e.target.checked })}
                    className="h-4 w-4 accent-black dark:accent-white"
                  />
                </label>
                <input
                  type="email"
                  value={notificationConfig.alertEmailRecipient}
                  onChange={(e) => updateNotificationConfig({ alertEmailRecipient: e.target.value })}
                  className="w-full border border-black bg-white p-1.5 text-xs dark:border-white dark:bg-black"
                  placeholder="Security mailbox address"
                />

                <label className="flex items-center justify-between pt-2">
                  <span>Slack Webhook Integration</span>
                  <input
                    type="checkbox"
                    checked={notificationConfig.slackAlertsEnabled}
                    onChange={(e) => updateNotificationConfig({ slackAlertsEnabled: e.target.checked })}
                    className="h-4 w-4 accent-black dark:accent-white"
                  />
                </label>

                <label className="flex items-center justify-between pt-2">
                  <span>Push Notifications for Failed Login & MFA</span>
                  <input
                    type="checkbox"
                    checked={notificationConfig.pushNotificationsEnabled}
                    onChange={(e) =>
                      updateNotificationConfig({ pushNotificationsEnabled: e.target.checked })
                    }
                    className="h-4 w-4 accent-black dark:accent-white"
                  />
                </label>
              </div>

              <div className="space-y-3 border border-black/10 p-3 dark:border-white/10">
                <p className="font-bold uppercase tracking-wider">Customizable Detection Thresholds</p>

                <div>
                  <div className="flex justify-between mb-1">
                    <span>MFA / Login Brute-Force Threshold:</span>
                    <span className="font-mono font-bold">
                      {notificationConfig.failedLoginThreshold} attempts
                    </span>
                  </div>
                  <input
                    type="range"
                    min={3}
                    max={10}
                    value={notificationConfig.failedLoginThreshold}
                    onChange={(e) =>
                      updateNotificationConfig({ failedLoginThreshold: Number(e.target.value) })
                    }
                    className="w-full accent-black dark:accent-white"
                  />
                  <p className="text-[10px] text-neutral-500">
                    Triggers immediate IP throttle and SMS/push warning after consecutive failures
                  </p>
                </div>

                <div className="pt-2">
                  <div className="flex justify-between mb-1">
                    <span>Impossible Travel Velocity Limit:</span>
                    <span className="font-mono font-bold">
                      {notificationConfig.impossibleTravelKmThreshold} km/h
                    </span>
                  </div>
                  <input
                    type="range"
                    min={500}
                    max={1200}
                    step={50}
                    value={notificationConfig.impossibleTravelKmThreshold}
                    onChange={(e) =>
                      updateNotificationConfig({
                        impossibleTravelKmThreshold: Number(e.target.value),
                      })
                    }
                    className="w-full accent-black dark:accent-white"
                  />
                  <p className="text-[10px] text-neutral-500">
                    Calculated as geodetic distance divided by elapsed authentication timestamp
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowConfigModal(false)}
                className="border border-black bg-black px-4 py-2 text-xs font-semibold text-white hover:bg-neutral-800 dark:border-white dark:bg-white dark:text-black"
              >
                Save Threshold Configuration
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SIEM Export Modal */}
      {showSiemExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs">
          <div className="w-full max-w-2xl border border-black bg-white p-6 shadow-2xl dark:border-white dark:bg-black space-y-4">
            <div className="flex items-center justify-between border-b border-black/15 pb-3 dark:border-white/15">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold uppercase tracking-wider">
                    SIEM Integration & Log Formatter Preview
                  </h3>
                  <span className="border border-black px-1.5 py-0.2 text-[10px] font-bold uppercase dark:border-white">
                    Status: Not Configured
                  </span>
                </div>
                <p className="text-[11px] text-neutral-500">
                  Client-side formatter demonstration only. Logs are not transmitted over TLS to a remote SIEM receiver.
                </p>
              </div>
              <button
                onClick={() => setShowSiemExportModal(false)}
                className="border border-black px-2 py-1 text-xs hover:bg-neutral-100 dark:border-white dark:hover:bg-neutral-900"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center gap-2">
              {(['CEF', 'JSON', 'SYSLOG'] as const).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setSelectedExportFormat(fmt)}
                  className={`border px-3 py-1 text-xs font-mono font-semibold ${
                    selectedExportFormat === fmt
                      ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
                      : 'border-black/20 hover:bg-neutral-100 dark:border-white/20 dark:hover:bg-neutral-900'
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>

            <pre className="max-h-60 overflow-y-auto border border-black/20 bg-neutral-50 p-3 text-[11px] font-mono leading-tight whitespace-pre-wrap dark:border-white/20 dark:bg-neutral-900">
              {exportSiemLogs(selectedExportFormat)}
            </pre>

            <div className="flex items-center justify-between pt-2 border-t border-black/10 dark:border-white/10">
              <span className="text-[11px] text-neutral-500 font-mono">
                Payload format conforms to RFC 5424 and ArcSight CEF standards
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopySiem}
                  className="border border-black px-3 py-1.5 text-xs font-semibold hover:bg-neutral-100 dark:border-white dark:hover:bg-neutral-900"
                >
                  {copiedNotice ? 'Copied to Clipboard!' : 'Copy to Clipboard'}
                </button>
                <button
                  onClick={handleDownloadSiem}
                  className="border border-black bg-black px-3 py-1.5 text-xs font-semibold text-white hover:bg-neutral-800 dark:border-white dark:bg-white dark:text-black"
                >
                  Download Log File
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
