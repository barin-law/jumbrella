import { UserRole } from '../types';

export interface RouteRoleMapping {
  path: string;
  role: UserRole;
  title: string;
}

export const ROLE_ROUTE_MAP: Record<UserRole, string> = {
  PRINCIPAL: '/portal/signer',
  WITNESS: '/portal/witness',
  ORG_REQUESTER: '/portal/organization/requester',
  ORG_ADMIN: '/portal/organization/admin',
  ENP: '/enp/workspace',
  ENP_ASSISTANT: '/enp/assistant',
  SECOPS_ANALYST: '/security/operations',
  COMPLIANCE_REVIEWER: '/compliance/reviewer',
  DPO: '/privacy/dpo',
  INTERNAL_AUDITOR: '/audit/internal',
  COURT_AUDITOR: '/regulatory/auditor',
  FINANCE_OFFICER: '/finance',
  SUPPORT_AGENT: '/support',
  ENF_ADMIN: '/admin/system',
};

export const ROUTE_ROLE_MAP: Record<string, UserRole> = {
  '/portal/signer': 'PRINCIPAL',
  '/portal/witness': 'WITNESS',
  '/portal/organization/requester': 'ORG_REQUESTER',
  '/portal/organization/admin': 'ORG_ADMIN',
  '/enp/workspace': 'ENP',
  '/enp/assistant': 'ENP_ASSISTANT',
  '/security/operations': 'SECOPS_ANALYST',
  '/compliance/reviewer': 'COMPLIANCE_REVIEWER',
  '/privacy/dpo': 'DPO',
  '/audit/internal': 'INTERNAL_AUDITOR',
  '/regulatory/auditor': 'COURT_AUDITOR',
  '/finance': 'FINANCE_OFFICER',
  '/support': 'SUPPORT_AGENT',
  '/admin/system': 'ENF_ADMIN',
};

export const PUBLIC_ROUTES = [
  '/',
  '/jurimbrella-portal',
  '/legal-information',
  '/dhenze-law-firm',
  '/barin-law-firm',
  '/verify',
  '/sign-in',
  '/contact',
  '/contact-us',
];
