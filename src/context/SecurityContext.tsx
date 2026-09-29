import React, { createContext, useContext, useState } from 'react';
import { AuditEvent, ThreatAlert, ThreatType, SecurityNotificationConfig } from '../types';
import { INITIAL_AUDIT_LOGS, INITIAL_THREAT_ALERTS } from '../data/initialData';
import { computeAuditEventHash, verifyAuditChainIntegrity } from '../utils/crypto';

interface SecurityContextType {
  auditLogs: AuditEvent[];
  threatAlerts: ThreatAlert[];
  notificationConfig: SecurityNotificationConfig;
  chainIntegrity: { isValid: boolean; tamperedIndex?: number };
  addAuditEvent: (eventData: Omit<AuditEvent, 'id' | 'prevHash' | 'hash' | 'tamperVerified'>) => Promise<AuditEvent>;
  verifyChain: () => Promise<boolean>;
  tamperSimulateChain: () => void;
  resetChain: () => void;
  updateThreatStatus: (threatId: string, newStatus: ThreatAlert['status']) => void;
  updateNotificationConfig: (newConfig: Partial<SecurityNotificationConfig>) => void;
  simulateThreat: (type: ThreatType) => Promise<void>;
  exportSiemLogs: (format: 'CEF' | 'JSON' | 'SYSLOG') => string;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export const SecurityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [auditLogs, setAuditLogs] = useState<AuditEvent[]>(INITIAL_AUDIT_LOGS);
  const [threatAlerts, setThreatAlerts] = useState<ThreatAlert[]>(INITIAL_THREAT_ALERTS);
  const [chainIntegrity, setChainIntegrity] = useState<{ isValid: boolean; tamperedIndex?: number }>({
    isValid: true,
  });

  const [notificationConfig, setNotificationConfig] = useState<SecurityNotificationConfig>({
    emailAlertsEnabled: true,
    alertEmailRecipient: 'security-response@jurimbrella.notary.ph',
    slackAlertsEnabled: true,
    slackWebhookConfigured: true,
    pushNotificationsEnabled: true,
    failedLoginThreshold: 5,
    impossibleTravelKmThreshold: 900,
    notifyOnCriticalOnly: false,
    autoQuarantineOnThreat: true,
  });

  const addAuditEvent = async (
    eventData: Omit<AuditEvent, 'id' | 'prevHash' | 'hash' | 'tamperVerified'>
  ): Promise<AuditEvent> => {
    const prevHash = auditLogs.length > 0 ? auditLogs[auditLogs.length - 1].hash : '0'.repeat(64);
    const newHash = await computeAuditEventHash(prevHash, {
      timestamp: eventData.timestamp,
      actorUid: eventData.actor.uid,
      action: eventData.action,
      resource: eventData.resource,
      severity: eventData.severity,
      ipAddress: eventData.ipAddress,
    });

    const newEvent: AuditEvent = {
      ...eventData,
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      prevHash,
      hash: newHash,
      tamperVerified: true,
    };

    setAuditLogs((prev) => [...prev, newEvent]);
    return newEvent;
  };

  const verifyChain = async (): Promise<boolean> => {
    const result = await verifyAuditChainIntegrity(auditLogs);
    setChainIntegrity(result);
    return result.isValid;
  };

  const tamperSimulateChain = () => {
    // Deliberately alter an action in the middle of the chain to show instant tamper-detection
    if (auditLogs.length > 2) {
      const copy = [...auditLogs];
      copy[1] = {
        ...copy[1],
        action: 'FORGED_ADMIN_MODIFICATION_UNAUTHORIZED',
      };
      setAuditLogs(copy);
      setChainIntegrity({ isValid: false, tamperedIndex: 1 });
    }
  };

  const resetChain = () => {
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setChainIntegrity({ isValid: true });
  };

  const updateThreatStatus = (threatId: string, newStatus: ThreatAlert['status']) => {
    setThreatAlerts((prev) =>
      prev.map((t) => (t.id === threatId ? { ...t, status: newStatus } : t))
    );
  };

  const updateNotificationConfig = (newConfig: Partial<SecurityNotificationConfig>) => {
    setNotificationConfig((prev) => ({ ...prev, ...newConfig }));
  };

  const simulateThreat = async (type: ThreatType) => {
    const id = `thr-${Date.now().toString().slice(-4)}`;
    const now = new Date().toISOString();

    let title = 'Unauthorized Security Anomaly';
    let details = 'A simulated security deviation was detected by the host intrusion prevention module.';
    let severity: ThreatAlert['severity'] = 'HIGH';
    let ip = '185.220.101.44';
    let location = 'Tor Exit Relay / Autonomous System 60729';
    let targetUser = 'Atty. Leandro V. Morales (ENP)';

    if (type === 'FAILED_MFA_BRUTE_FORCE') {
      title = `Repeated Failed MFA Verification (${notificationConfig.failedLoginThreshold + 1} attempts)`;
      details = `Threshold exceeded: ${notificationConfig.failedLoginThreshold + 1} failed step-up OTP attempts from IP 198.51.100.22 targeting ENP session token.`;
      severity = 'HIGH';
      ip = '198.51.100.22';
      location = 'Bucharest, Romania';
    } else if (type === 'IMPOSSIBLE_TRAVEL') {
      title = 'Impossible Travel Velocity Detected (14,200 km/h)';
      details = `Signer authenticated from Taguig City, PH (14.5378, 121.0505) and 14 minutes later made request from San Jose, USA (37.3382, -121.8863).`;
      severity = 'HIGH';
      ip = '203.0.113.89';
      location = 'San Jose, California, USA';
      targetUser = 'Danilo Ramos Flores';
    } else if (type === 'UNAUTHORIZED_ROLE_ESCALATION') {
      title = 'Critical Privilege Escalation Attempt to ENP';
      details = 'Client modified JWT signature claim locally and sent authenticated request to /api/enp/seal. Rejected fail-closed by RBAC kernel.';
      severity = 'CRITICAL';
      ip = '192.0.2.140';
      location = 'Unknown Proxy / VPN';
      targetUser = 'Role Enforcement Controller';
    } else if (type === 'MALWARE_DETECTED') {
      title = 'Malicious Macro Signature Detected in Quarantine';
      details = 'ClamAV scanner identified Win32.Trojan.Heuristic in uploaded notarization attachment. Upload blocked, host isolated.';
      severity = 'CRITICAL';
      ip = '112.198.24.11';
      location = 'Cebu City, Philippines';
      targetUser = 'Document Ingestion Queue';
    }

    const dispatchedChannels: Array<'EMAIL' | 'SLACK' | 'PUSH'> = [];
    if (notificationConfig.emailAlertsEnabled) dispatchedChannels.push('EMAIL');
    if (notificationConfig.slackAlertsEnabled) dispatchedChannels.push('SLACK');
    if (notificationConfig.pushNotificationsEnabled) dispatchedChannels.push('PUSH');

    const newThreat: ThreatAlert = {
      id,
      timestamp: now,
      title,
      type,
      severity,
      details,
      status: 'ACTIVE',
      ip,
      location,
      targetUser,
      dispatchedChannels,
    };

    setThreatAlerts((prev) => [newThreat, ...prev]);

    // Add corresponding audit event
    await addAuditEvent({
      timestamp: now,
      actor: {
        uid: 'secops-engine',
        name: 'Automated Threat Detection Engine',
        role: 'SECOPS_ANALYST',
        email: 'alerts@jurimbrella.notary.ph',
      },
      action: `SECURITY_ALERT_${type}`,
      resource: 'SecurityKernel/IntrusionDetection',
      resourceId: id,
      severity,
      ipAddress: ip,
      userAgent: 'JuriMbrellaSecurityEngine/2.4',
      location,
      metadata: { threatId: id, dispatchedChannels },
    });
  };

  const exportSiemLogs = (format: 'CEF' | 'JSON' | 'SYSLOG'): string => {
    if (format === 'JSON') {
      return JSON.stringify(
        {
          facility: 'JuriMbrella Philippine Electronic Notarization',
          accreditationCandidate: true,
          exportTimestamp: new Date().toISOString(),
          totalEvents: auditLogs.length,
          events: auditLogs,
        },
        null,
        2
      );
    }

    if (format === 'CEF') {
      // ArcSight Common Event Format (CEF)
      return auditLogs
        .map((log) => {
          const epoch = new Date(log.timestamp).getTime();
          return `CEF:0|JuriMbrella|ElectronicNotarizationFacility|1.0|${log.action}|${log.action}|${
            log.severity === 'CRITICAL' ? 10 : log.severity === 'HIGH' ? 8 : log.severity === 'MEDIUM' ? 5 : 2
          }|rt=${epoch} src=${log.ipAddress} suser=${log.actor.email} msg=${log.action} on ${log.resource} cs1Label=Hash cs1=${log.hash} cs2Label=PrevHash cs2=${log.prevHash}`;
        })
        .join('\n');
    }

    // RFC 5424 Syslog format
    return auditLogs
      .map((log) => {
        const pri = log.severity === 'CRITICAL' ? 11 : log.severity === 'HIGH' ? 12 : log.severity === 'MEDIUM' ? 14 : 16;
        return `<${pri}>1 ${log.timestamp} jurimbrella.notary.ph JuriMbrella - - [audit@48210 action="${log.action}" actor="${log.actor.email}" hash="${log.hash}"] ${log.action} executed on ${log.resource}`;
      })
      .join('\n');
  };

  return (
    <SecurityContext.Provider
      value={{
        auditLogs,
        threatAlerts,
        notificationConfig,
        chainIntegrity,
        addAuditEvent,
        verifyChain,
        tamperSimulateChain,
        resetChain,
        updateThreatStatus,
        updateNotificationConfig,
        simulateThreat,
        exportSiemLogs,
      }}
    >
      {children}
    </SecurityContext.Provider>
  );
};

export function useSecurity(): SecurityContextType {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
}
