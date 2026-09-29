import React, { createContext, useContext, useState } from 'react';
import { IntegrationAdapter, AdapterState } from '../types';
import { INITIAL_INTEGRATION_ADAPTERS } from '../data/integrationAdapters';
import { useSecurity } from './SecurityContext';
import { useAuth } from './AuthContext';

interface IntegrationContextType {
  adapters: IntegrationAdapter[];
  testConnection: (adapterId: string) => Promise<{ success: boolean; message: string; newState: AdapterState }>;
  getAdapter: (adapterId: string) => IntegrationAdapter | undefined;
  operationalCount: number;
  demoCount: number;
  unconfiguredCount: number;
  errorCount: number;
}

const IntegrationContext = createContext<IntegrationContextType | undefined>(undefined);

export const IntegrationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adapters, setAdapters] = useState<IntegrationAdapter[]>(INITIAL_INTEGRATION_ADAPTERS);
  const { addAuditEvent } = useSecurity();
  const { currentUser } = useAuth();

  const testConnection = async (
    adapterId: string
  ): Promise<{ success: boolean; message: string; newState: AdapterState }> => {
    const target = adapters.find((a) => a.id === adapterId);
    if (!target) {
      return { success: false, message: 'Adapter not found', newState: 'ERROR' };
    }

    // Set temporary connecting state
    setAdapters((prev) =>
      prev.map((a) => (a.id === adapterId ? { ...a, status: 'CONNECTING' } : a))
    );

    // Simulate network handshake latency
    await new Promise((res) => setTimeout(res, 800));

    const now = new Date().toISOString();

    // Check behavior based on adapter type
    if (adapterId === 'adapter-sc-enar') {
      const msg = 'Supreme Court integration: Awaiting official specification and credential issuance.';
      setAdapters((prev) =>
        prev.map((a) =>
          a.id === adapterId
            ? {
                ...a,
                status: 'NOT_CONFIGURED',
                lastHealthCheck: now,
                errorStatus: msg,
                auditHistoryCount: a.auditHistoryCount + 1,
              }
            : a
        )
      );
      await addAuditEvent({
        timestamp: now,
        actor: { uid: currentUser.uid, name: currentUser.name, role: currentUser.role, email: currentUser.email },
        action: 'ADAPTER_HEALTHCHECK_SC_ENAR_PENDING_SPEC',
        resource: 'IntegrationCenter/SupremeCourt',
        resourceId: adapterId,
        severity: 'LOW',
        ipAddress: '127.0.0.1',
        userAgent: navigator.userAgent,
        metadata: { status: 'NOT_CONFIGURED', detail: msg },
      });
      return { success: false, message: msg, newState: 'NOT_CONFIGURED' };
    }

    if (target.status === 'NOT_CONFIGURED') {
      const msg = `Configuration missing: ${target.requiredEnvVars.join(', ')} are not defined in environment secrets.`;
      setAdapters((prev) =>
        prev.map((a) =>
          a.id === adapterId
            ? {
                ...a,
                status: 'NOT_CONFIGURED',
                lastHealthCheck: now,
                errorStatus: msg,
                auditHistoryCount: a.auditHistoryCount + 1,
              }
            : a
        )
      );
      await addAuditEvent({
        timestamp: now,
        actor: { uid: currentUser.uid, name: currentUser.name, role: currentUser.role, email: currentUser.email },
        action: 'ADAPTER_HEALTHCHECK_UNCONFIGURED',
        resource: 'IntegrationCenter/Adapter',
        resourceId: adapterId,
        severity: 'LOW',
        ipAddress: '127.0.0.1',
        userAgent: navigator.userAgent,
        metadata: { provider: target.provider, missingVars: target.requiredEnvVars },
      });
      return { success: false, message: msg, newState: 'NOT_CONFIGURED' };
    }

    // For demo adapters
    const msg = `Demo sandbox operational: Verified synthetic handshake with ${target.provider}.`;
    setAdapters((prev) =>
      prev.map((a) =>
        a.id === adapterId
          ? {
              ...a,
              status: 'DEMO',
              lastHealthCheck: now,
              lastSuccessfulRequest: now,
              errorStatus: undefined,
              auditHistoryCount: a.auditHistoryCount + 1,
            }
          : a
      )
    );

    await addAuditEvent({
      timestamp: now,
      actor: { uid: currentUser.uid, name: currentUser.name, role: currentUser.role, email: currentUser.email },
      action: 'ADAPTER_HEALTHCHECK_DEMO_VERIFIED',
      resource: 'IntegrationCenter/Adapter',
      resourceId: adapterId,
      severity: 'INFO',
      ipAddress: '127.0.0.1',
      userAgent: navigator.userAgent,
      metadata: { provider: target.provider, status: 'DEMO' },
    });

    return { success: true, message: msg, newState: 'DEMO' };
  };

  const getAdapter = (adapterId: string) => adapters.find((a) => a.id === adapterId);

  const operationalCount = adapters.filter((a) => a.status === 'OPERATIONAL').length;
  const demoCount = adapters.filter((a) => a.status === 'DEMO').length;
  const unconfiguredCount = adapters.filter((a) => a.status === 'NOT_CONFIGURED').length;
  const errorCount = adapters.filter((a) => a.status === 'ERROR' || a.status === 'DEGRADED').length;

  return (
    <IntegrationContext.Provider
      value={{
        adapters,
        testConnection,
        getAdapter,
        operationalCount,
        demoCount,
        unconfiguredCount,
        errorCount,
      }}
    >
      {children}
    </IntegrationContext.Provider>
  );
};

export function useIntegration(): IntegrationContextType {
  const context = useContext(IntegrationContext);
  if (!context) {
    throw new Error('useIntegration must be used within an IntegrationProvider');
  }
  return context;
}
