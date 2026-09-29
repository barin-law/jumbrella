import React, { createContext, useContext, useState } from 'react';
import { UserRole } from '../types';
import { SYSTEM_ROLES } from '../data/initialData';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  mfaEnabled: boolean;
  commissionNo?: string;
  jurisdiction?: string;
  commissionExpiry?: string;
  organization?: string;
}

const PRESET_USERS: Record<UserRole, UserProfile> = {
  PRINCIPAL: {
    uid: 'demo-principal-01',
    name: 'Maria Elena Santos (Demo Principal)',
    email: 'm.santos@demo-enterprise.ph',
    role: 'PRINCIPAL',
    mfaEnabled: true,
    organization: 'Santos Holdings Corp. (Demo)',
  },
  WITNESS: {
    uid: 'demo-witness-01',
    name: 'Atty. Roberto Cruz (Demo Witness)',
    email: 'rcruz@demo-lawchambers.ph',
    role: 'WITNESS',
    mfaEnabled: true,
  },
  ORG_REQUESTER: {
    uid: 'demo-org-requester-01',
    name: 'Andrea Dimatulac (Demo Requester)',
    email: 'a.dimatulac@demo-logistics.ph',
    role: 'ORG_REQUESTER',
    mfaEnabled: true,
    organization: 'Bayani Logistics Corp. (Demo)',
  },
  ORG_ADMIN: {
    uid: 'demo-org-admin-01',
    name: 'Carlos Mendoza, CPA (Demo Org Admin)',
    email: 'cmendoza@demo-holdings.ph',
    role: 'ORG_ADMIN',
    mfaEnabled: true,
    organization: 'Santos Holdings Corp. (Demo)',
  },
  ENP: {
    uid: 'demo-enp-101',
    name: 'Atty. Juan Dela Cruz, En.P. (Demo ENP Candidate)',
    email: 'atty.delacruz@demo-enp.ph',
    role: 'ENP',
    mfaEnabled: true,
    commissionNo: 'DEMO-NP-2026-0814-CANDIDATE',
    jurisdiction: 'RTC Makati Branch 138 (Candidate)',
    commissionExpiry: '2026-12-31',
  },
  ENP_ASSISTANT: {
    uid: 'demo-assistant-01',
    name: 'Joy Bautista (Demo Notary Assistant)',
    email: 'assistant@demo-enp.ph',
    role: 'ENP_ASSISTANT',
    mfaEnabled: true,
  },
  COMPLIANCE_REVIEWER: {
    uid: 'demo-comp-01',
    name: 'Atty. Cristina Legaspi (Demo Compliance)',
    email: 'compliance@demo-enf.gov.ph',
    role: 'COMPLIANCE_REVIEWER',
    mfaEnabled: true,
  },
  DPO: {
    uid: 'demo-dpo-01',
    name: 'Dean Miguel De Castro, CIPP/E (Demo DPO)',
    email: 'dpo@demo-enf.gov.ph',
    role: 'DPO',
    mfaEnabled: true,
  },
  SECOPS_ANALYST: {
    uid: 'demo-secops-01',
    name: 'Engr. Kenneth Tan, CISSP (Demo SecOps)',
    email: 'secops@demo-enf.gov.ph',
    role: 'SECOPS_ANALYST',
    mfaEnabled: true,
  },
  FINANCE_OFFICER: {
    uid: 'demo-finance-01',
    name: 'Rowena Garcia (Demo Finance Officer)',
    email: 'finance@demo-enf.gov.ph',
    role: 'FINANCE_OFFICER',
    mfaEnabled: true,
  },
  SUPPORT_AGENT: {
    uid: 'demo-support-01',
    name: 'Mark Lester Aquino (Demo Support)',
    email: 'support@demo-enf.gov.ph',
    role: 'SUPPORT_AGENT',
    mfaEnabled: true,
  },
  ENF_ADMIN: {
    uid: 'demo-enf-admin-01',
    name: 'Engr. Paul Valdez (Demo ENF Admin)',
    email: 'sysadmin@demo-enf.gov.ph',
    role: 'ENF_ADMIN',
    mfaEnabled: true,
  },
  INTERNAL_AUDITOR: {
    uid: 'demo-aud-01',
    name: 'Victoria Solis, CIA, CISA (Demo Auditor)',
    email: 'auditor@demo-enf.gov.ph',
    role: 'INTERNAL_AUDITOR',
    mfaEnabled: true,
  },
  COURT_AUDITOR: {
    uid: 'demo-court-01',
    name: 'Hon. Judicial Inspector (Demo SC-ENAR)',
    email: 'notary.administrator@demo-sc.gov.ph',
    role: 'COURT_AUDITOR',
    mfaEnabled: true,
  },
};

interface AuthContextType {
  currentUser: UserProfile;
  activeRole: UserRole;
  switchRole: (newRole: UserRole) => void;
  availableRoles: typeof SYSTEM_ROLES;
  mfaVerifiedForSession: boolean;
  requestStepUpMfa: () => Promise<boolean>;
  resetMfaSession: () => void;
  isEnp: boolean;
  isSecOps: boolean;
  isAuditor: boolean;
  isPrincipal: boolean;
  isOrgAdmin: boolean;
  canExecuteSeal: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(PRESET_USERS['ENP']);
  const [mfaVerifiedForSession, setMfaVerifiedForSession] = useState<boolean>(true);

  const switchRole = (newRole: UserRole) => {
    const user = PRESET_USERS[newRole];
    if (user) {
      setCurrentUser(user);
    }
  };

  const logout = () => {
    setCurrentUser(PRESET_USERS['PRINCIPAL']);
    setMfaVerifiedForSession(true);
  };

  const requestStepUpMfa = async (): Promise<boolean> => {
    // Simulates an immediate step-up MFA challenge check
    setMfaVerifiedForSession(true);
    return true;
  };

  const resetMfaSession = () => {
    setMfaVerifiedForSession(false);
  };

  const isEnp = currentUser.role === 'ENP';
  const isSecOps = currentUser.role === 'SECOPS_ANALYST';
  const isAuditor = currentUser.role === 'INTERNAL_AUDITOR' || currentUser.role === 'COURT_AUDITOR';
  const isPrincipal = currentUser.role === 'PRINCIPAL';
  const isOrgAdmin = currentUser.role === 'ORG_ADMIN';
  const canExecuteSeal = isEnp && mfaVerifiedForSession;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        activeRole: currentUser.role,
        switchRole,
        availableRoles: SYSTEM_ROLES,
        mfaVerifiedForSession,
        requestStepUpMfa,
        resetMfaSession,
        isEnp,
        isSecOps,
        isAuditor,
        isPrincipal,
        isOrgAdmin,
        canExecuteSeal,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
