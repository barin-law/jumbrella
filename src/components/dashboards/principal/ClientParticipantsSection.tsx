/**
 * JuriMbrella — Philippine Electronic Notarization
 * Client Participants & Witness Management Module
 * Authorization, Invitations, Role Conflict Checks, and Masked Internal Lookup
 */

import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  ShieldCheck,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Mail,
  Smartphone,
  Search,
  Key,
  Eye,
  FileCheck,
  ChevronDown,
  ChevronUp,
  Send,
  Trash2,
  Check,
  X,
  Lock,
  ExternalLink,
} from 'lucide-react';
import { useClientCase } from '../../../context/ClientCaseContext';
import { StatusBadge } from '../../common/StatusBadge';
import { CaseParticipantRole } from '../../../types/client-case';

interface ClientParticipantsSectionProps {
  activeSubModule: string;
  onNavigateModule?: (moduleId: string) => void;
}

interface PendingInvitation {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: CaseParticipantRole;
  invitedAt: string;
  expiresIn: string;
  status: 'PENDING' | 'ACCEPTED' | 'REVOKED';
}

const INITIAL_PENDING_INVITATIONS: PendingInvitation[] = [
  {
    id: 'inv-1',
    name: 'Atty. Roberto Cruz',
    email: 'roberto.cruz@lawfirm.ph',
    phone: '+63 917 555 1290',
    role: 'INSTRUMENT_WITNESS',
    invitedAt: '2 hours ago',
    expiresIn: '46 hours remaining',
    status: 'PENDING',
  },
  {
    id: 'inv-2',
    name: 'Engr. Daniel Ramos',
    email: 'daniel.ramos@geotech.ph',
    phone: '+63 918 222 4911',
    role: 'AUTHORIZED_REPRESENTATIVE',
    invitedAt: 'Yesterday',
    expiresIn: '22 hours remaining',
    status: 'PENDING',
  },
];

export const ClientParticipantsSection: React.FC<ClientParticipantsSectionProps> = ({
  activeSubModule,
  onNavigateModule,
}) => {
  const {
    activeCase,
    inviteWitness,
    performMaskedInternalLookup,
  } = useClientCase();

  // Invite Witness Form State
  const [witnessName, setWitnessName] = useState('');
  const [witnessEmail, setWitnessEmail] = useState('');
  const [witnessPhone, setWitnessPhone] = useState('+63 917 555 1290');
  const [witnessRole, setWitnessRole] = useState<CaseParticipantRole>('INSTRUMENT_WITNESS');
  const [conflictWarning, setConflictWarning] = useState<string | null>(null);
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);

  // Pending Invitations State
  const [pendingInvites, setPendingInvites] = useState<PendingInvitation[]>(INITIAL_PENDING_INVITATIONS);

  // Masked Lookup State
  const [lookupOpen, setLookupOpen] = useState(false);
  const [lookupQuery, setLookupQuery] = useState('');
  const [lookupResult, setLookupResult] = useState<{
    found: boolean;
    maskedName?: string;
    maskedMobile?: string;
    internalPersonId?: string;
    disclaimer: string;
  } | null>(null);

  // Check role conflict when name or role changes
  const handleNameChange = (val: string) => {
    setWitnessName(val);
    if (
      val.toLowerCase().includes('maria') ||
      val.toLowerCase().includes('santos') ||
      val.toLowerCase().includes('jurimbrella') ||
      val.toLowerCase().includes('enp') ||
      val.toLowerCase().includes('beneficiary')
    ) {
      setConflictWarning('Potential role conflict detected — under Supreme Court rules, witnesses must be disinterested parties.');
    } else {
      setConflictWarning(null);
    }
  };

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!witnessName.trim() || !witnessEmail.trim() || !activeCase) return;

    inviteWitness(
      activeCase.caseId,
      witnessName.trim(),
      witnessEmail.trim(),
      witnessPhone,
      witnessRole
    );

    const newInvite: PendingInvitation = {
      id: `inv-${Date.now()}`,
      name: witnessName.trim(),
      email: witnessEmail.trim(),
      phone: witnessPhone,
      role: witnessRole,
      invitedAt: 'Just now',
      expiresIn: '48 hours remaining',
      status: 'PENDING',
    };

    setPendingInvites((prev) => [newInvite, ...prev]);
    setFeedbackNotice(
      `Invitation dispatched to ${witnessName}. A time-limited secure link (valid for 48 hours) has been generated.`
    );
    setWitnessName('');
    setWitnessEmail('');
    setTimeout(() => setFeedbackNotice(null), 5000);
  };

  const handleResendInvite = (invite: PendingInvitation) => {
    setFeedbackNotice(`Resent secure invitation link to ${invite.email}.`);
    setTimeout(() => setFeedbackNotice(null), 4000);
  };

  const handleRevokeInvite = (inviteId: string) => {
    setPendingInvites((prev) =>
      prev.map((i) => (i.id === inviteId ? { ...i, status: 'REVOKED' } : i))
    );
    setFeedbackNotice('Participant invitation has been revoked.');
    setTimeout(() => setFeedbackNotice(null), 4000);
  };

  const handleRunLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupQuery.trim()) return;
    const res = performMaskedInternalLookup(lookupQuery);
    setLookupResult(res);
  };

  if (!activeCase) {
    return (
      <div className="border border-black/15 bg-white p-6 dark:border-white/15 dark:bg-neutral-950 text-xs">
        Please select or create an active case to manage participants.
      </div>
    );
  }

  return (
    <div className="space-y-5 text-xs">
      {feedbackNotice && (
        <div className="border border-emerald-500 bg-emerald-50 p-3 text-xs text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300 flex items-center justify-between">
          <span>{feedbackNotice}</span>
          <button onClick={() => setFeedbackNotice(null)} className="text-emerald-700 hover:text-emerald-900">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Case Header Context */}
      <div className="border border-black/20 bg-white p-4 dark:border-white/20 dark:bg-neutral-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <span className="text-[10px] font-mono uppercase text-neutral-500">
            Case Matter Participants
          </span>
          <h4 className="text-sm font-bold text-black dark:text-white">
            {activeCase.caseReference} • {activeCase.title}
          </h4>
        </div>
        <div className="flex items-center gap-2">
          <span className="border border-black/20 bg-neutral-100 px-2 py-0.5 text-xs font-mono dark:border-white/20 dark:bg-neutral-900">
            {activeCase.participants.length} Active Participants
          </span>
          {onNavigateModule && activeSubModule !== 'principal-invite-witness' && (
            <button
              onClick={() => onNavigateModule('principal-invite-witness')}
              className="flex items-center gap-1 border border-black bg-black px-2.5 py-1 text-xs text-white dark:border-white dark:bg-white dark:text-black cursor-pointer"
            >
              <UserPlus className="h-3 w-3" />
              <span>Invite Witness</span>
            </button>
          )}
        </div>
      </div>

      {/* SUB-VIEW ROUTING */}
      {activeSubModule === 'principal-invite-witness' ? (
        /* Invite Witness Form */
        <div className="border border-black/15 bg-white p-5 dark:border-white/15 dark:bg-neutral-950 space-y-4">
          <div className="flex items-center justify-between border-b border-black/10 pb-3 dark:border-white/10">
            <div>
              <h3 className="text-sm font-bold text-black dark:text-white">
                Authorize & Invite Instrumental Witness
              </h3>
              <p className="text-xs text-neutral-500">
                Rule 6 A.M. No. 24-10-14-SC: Witnesses must be disinterested parties with verified government credentials.
              </p>
            </div>
            <StatusBadge status="WITNESS ONBOARDING" variant="info" size="sm" />
          </div>

          <form onSubmit={handleInviteSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold uppercase text-[10px] text-neutral-500 mb-1">
                  Witness Full Legal Name *
                </label>
                <input
                  type="text"
                  required
                  value={witnessName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g., Atty. Roberto Cruz"
                  className="w-full border border-black/20 bg-white p-2.5 text-xs dark:border-white/20 dark:bg-black"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase text-[10px] text-neutral-500 mb-1">
                  Participant Role
                </label>
                <select
                  value={witnessRole}
                  onChange={(e) => setWitnessRole(e.target.value as CaseParticipantRole)}
                  className="w-full border border-black/20 bg-white p-2.5 text-xs dark:border-white/20 dark:bg-black"
                >
                  <option value="INSTRUMENT_WITNESS">Instrumental Witness</option>
                  <option value="AUTHORIZED_REPRESENTATIVE">Authorized Representative</option>
                  <option value="SIGNER">Co-Signer</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold uppercase text-[10px] text-neutral-500 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={witnessEmail}
                  onChange={(e) => setWitnessEmail(e.target.value)}
                  placeholder="roberto.cruz@lawfirm.ph"
                  className="w-full border border-black/20 bg-white p-2.5 text-xs dark:border-white/20 dark:bg-black"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase text-[10px] text-neutral-500 mb-1">
                  Mobile Phone (SMS Dispatch)
                </label>
                <input
                  type="text"
                  value={witnessPhone}
                  onChange={(e) => setWitnessPhone(e.target.value)}
                  className="w-full border border-black/20 bg-white p-2.5 text-xs dark:border-white/20 dark:bg-black"
                />
              </div>
            </div>

            {/* Conflict of Interest Warning Banner */}
            {conflictWarning && (
              <div className="border border-amber-500 bg-amber-50 p-3 text-xs text-amber-900 dark:bg-amber-950/50 dark:text-amber-300 flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                <div>
                  <p className="font-bold">{conflictWarning}</p>
                  <p className="text-[11px] mt-0.5">
                    Under the 2004 Rules on Notarial Practice and Supreme Court ethical canons, an instrumental witness must not be a beneficiary, grantee, or attorney-in-fact in the instrument.
                  </p>
                </div>
              </div>
            )}

            <div className="border border-black/10 p-3 bg-neutral-50 dark:border-white/10 dark:bg-neutral-900 text-[11px] text-neutral-600 dark:text-neutral-400 space-y-1">
              <p className="font-semibold text-black dark:text-white">
                Witness Data Minimization & Privacy Safeguards
              </p>
              <p>
                Invited witnesses only receive access to the specific instrument clauses requiring their presence. They cannot view your internal person identifier, private payment data, or unrelated case files.
              </p>
            </div>

            <div className="pt-3 border-t border-black/10 dark:border-white/10 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-1.5 border border-black bg-black px-4 py-2 font-semibold text-white hover:bg-neutral-800 dark:border-white dark:bg-white dark:text-black dark:hover:bg-neutral-200 cursor-pointer"
              >
                <UserPlus className="h-3.5 w-3.5" />
                <span>Issue Secure Witness Invitation</span>
              </button>
            </div>
          </form>
        </div>
      ) : activeSubModule === 'principal-pending-invitations' ? (
        /* Pending Invitations View */
        <div className="border border-black/15 bg-white p-5 dark:border-white/15 dark:bg-neutral-950 space-y-4">
          <div className="flex items-center justify-between border-b border-black/10 pb-3 dark:border-white/10">
            <div>
              <h3 className="text-sm font-bold text-black dark:text-white">
                Pending Witness & Signatory Invitations
              </h3>
              <p className="text-xs text-neutral-500">
                Track pending registration invitations, time-to-expiry, and invitation links.
              </p>
            </div>
            <StatusBadge status="INVITATIONS ACTIVE" variant="info" size="sm" />
          </div>

          <div className="space-y-3">
            {pendingInvites.map((inv) => (
              <div
                key={inv.id}
                className="border border-black/10 p-4 bg-neutral-50 dark:border-white/10 dark:bg-neutral-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs">{inv.name}</span>
                    <span className="border border-black/20 px-1.5 py-0.2 text-[10px] font-mono">
                      {inv.role}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 ${
                        inv.status === 'PENDING'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      }`}
                    >
                      {inv.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-neutral-500 font-mono">
                    Email: {inv.email} • Phone: {inv.phone}
                  </div>
                  <div className="text-[10px] text-neutral-400 font-mono">
                    Invited: {inv.invitedAt} • Expiry: {inv.expiresIn}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {inv.status === 'PENDING' ? (
                    <>
                      <button
                        onClick={() => handleResendInvite(inv)}
                        className="flex items-center gap-1 border border-black/20 bg-white px-3 py-1.5 text-[11px] hover:bg-neutral-100 dark:border-white/20 dark:bg-black cursor-pointer"
                      >
                        <Send className="h-3 w-3" />
                        <span>Resend Link</span>
                      </button>
                      <button
                        onClick={() => handleRevokeInvite(inv.id)}
                        className="flex items-center gap-1 border border-rose-300 bg-white px-3 py-1.5 text-[11px] text-rose-600 hover:bg-rose-50 dark:border-rose-800 dark:bg-black dark:text-rose-400 cursor-pointer"
                      >
                        <X className="h-3 w-3" />
                        <span>Revoke</span>
                      </button>
                    </>
                  ) : (
                    <span className="text-[10px] text-neutral-400 italic">Invitation Inactive</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : activeSubModule === 'principal-id-requirements' ? (
        /* ID Requirements View */
        <div className="border border-black/15 bg-white p-5 dark:border-white/15 dark:bg-neutral-950 space-y-4">
          <div className="flex items-center justify-between border-b border-black/10 pb-3 dark:border-white/10">
            <div>
              <h3 className="text-sm font-bold text-black dark:text-white">
                Supreme Court Competent Evidence of Identity Criteria
              </h3>
              <p className="text-xs text-neutral-500">
                Rule 6 A.M. No. 24-10-14-SC and 2004 Rules on Notarial Practice requirements for all participating parties.
              </p>
            </div>
            <StatusBadge status="RULE 6 STANDARDS" variant="success" size="sm" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-black/10 p-4 bg-neutral-50 dark:border-white/10 dark:bg-neutral-900 space-y-2">
              <h4 className="font-bold text-xs flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Primary Accepted Government Credentials</span>
              </h4>
              <ul className="list-disc pl-5 space-y-1 text-[11px] text-neutral-600 dark:text-neutral-400">
                <li>Philippine National ID (PhilSys Card / ePhilID via eGovPH)</li>
                <li>DFA Philippine Passport (Valid or with extension notice)</li>
                <li>LTO Driver's License (Plastic Card or LTMS Digital ID)</li>
                <li>PRC Professional License Identification Card</li>
                <li>Unified Multi-Purpose ID (UMID)</li>
                <li>Comelec Voter's Identification Card or Certification</li>
              </ul>
            </div>

            <div className="border border-black/10 p-4 bg-neutral-50 dark:border-white/10 dark:bg-neutral-900 space-y-2">
              <h4 className="font-bold text-xs flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-neutral-700 dark:text-neutral-300" />
                <span>Mandatory Physical & Visual Features</span>
              </h4>
              <ul className="list-disc pl-5 space-y-1 text-[11px] text-neutral-600 dark:text-neutral-400">
                <li>Current, unexpired government agency issuance</li>
                <li>Clear photographic likeness of the affiant or witness</li>
                <li>Visible official signature or holographic seal</li>
                <li>Machine-readable barcode or QR code where applicable</li>
                <li>Consistent legal full name without unexplained aliases</li>
              </ul>
            </div>
          </div>
        </div>
      ) : activeSubModule === 'principal-participant-access' ? (
        /* Access Control Matrix */
        <div className="border border-black/15 bg-white p-5 dark:border-white/15 dark:bg-neutral-950 space-y-4">
          <div className="flex items-center justify-between border-b border-black/10 pb-3 dark:border-white/10">
            <div>
              <h3 className="text-sm font-bold text-black dark:text-white">
                Participant Access & Privacy Permissions Matrix
              </h3>
              <p className="text-xs text-neutral-500">
                Enforces least-privilege access under the Data Privacy Act of 2012 (RA 10173).
              </p>
            </div>
            <StatusBadge status="LEAST PRIVILEGE" variant="info" size="sm" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-black/20 bg-neutral-50 text-[11px] font-semibold text-neutral-600 dark:border-white/20 dark:bg-neutral-900 dark:text-neutral-400">
                <tr>
                  <th className="p-2.5">Participant Role</th>
                  <th className="p-2.5">View Draft Document</th>
                  <th className="p-2.5">Affix Signature</th>
                  <th className="p-2.5">Access Hearing Room</th>
                  <th className="p-2.5">View Canonical Certificate</th>
                  <th className="p-2.5">Billing & Payments</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/10 dark:divide-white/10 font-mono text-[11px]">
                <tr>
                  <td className="p-2.5 font-bold font-sans">Principal / Signer</td>
                  <td className="p-2.5 text-emerald-600 font-bold">✓ Full Instrument</td>
                  <td className="p-2.5 text-emerald-600 font-bold">✓ Authorized</td>
                  <td className="p-2.5 text-emerald-600 font-bold">✓ Full Hearing</td>
                  <td className="p-2.5 text-emerald-600 font-bold">✓ Authorized</td>
                  <td className="p-2.5 text-emerald-600 font-bold">✓ Full Access</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold font-sans">Instrumental Witness</td>
                  <td className="p-2.5 text-neutral-600 dark:text-neutral-400">Attestation Clause Only</td>
                  <td className="p-2.5 text-emerald-600 font-bold">✓ Witness Signature</td>
                  <td className="p-2.5 text-emerald-600 font-bold">✓ Witness Appearance</td>
                  <td className="p-2.5 text-neutral-400">Restricted</td>
                  <td className="p-2.5 text-rose-500">No Access</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold font-sans">Authorized Representative</td>
                  <td className="p-2.5 text-emerald-600 font-bold">✓ Full Instrument</td>
                  <td className="p-2.5 text-emerald-600 font-bold">✓ On Principal Behalf</td>
                  <td className="p-2.5 text-emerald-600 font-bold">✓ Full Hearing</td>
                  <td className="p-2.5 text-emerald-600 font-bold">✓ Authorized</td>
                  <td className="p-2.5 text-neutral-600 dark:text-neutral-400">View Only</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Participants Registry Table (Default View) */
        <div className="border border-black/15 bg-white p-5 dark:border-white/15 dark:bg-neutral-950 space-y-4">
          <div className="flex items-center justify-between border-b border-black/10 pb-3 dark:border-white/10">
            <div>
              <h3 className="text-sm font-bold text-black dark:text-white">
                Case Participants Registry
              </h3>
              <p className="text-xs text-neutral-500">
                Verified principals, signers, and disinterested witnesses authorized for this matter.
              </p>
            </div>
            <StatusBadge status="ACTIVE AUTHORIZATIONS" variant="success" size="sm" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-black/20 bg-neutral-50 text-[11px] font-semibold text-neutral-600 dark:border-white/20 dark:bg-neutral-900 dark:text-neutral-400">
                <tr>
                  <th className="p-2.5">Participant Name</th>
                  <th className="p-2.5">Case Role</th>
                  <th className="p-2.5">Contact Email</th>
                  <th className="p-2.5">Identity Status</th>
                  <th className="p-2.5">Authorization</th>
                  <th className="p-2.5 text-right">Privacy Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/10 dark:divide-white/10 font-mono text-[11px]">
                {(activeCase.participants || []).map((p) => (
                  <tr key={p.caseParticipantId} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50">
                    <td className="p-2.5 font-sans font-bold">{p.fullName}</td>
                    <td className="p-2.5 font-sans">
                      <span className="border border-black/20 px-1.5 py-0.5 text-[10px]">
                        {p.role}
                      </span>
                    </td>
                    <td className="p-2.5 text-neutral-500">{p.email}</td>
                    <td className="p-2.5">
                      <StatusBadge
                        status={p.status === 'ACTIVE' ? 'VERIFIED_EKYC' : 'PENDING_VERIFICATION'}
                        size="sm"
                      />
                    </td>
                    <td className="p-2.5">
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                        {p.status}
                      </span>
                    </td>
                    <td className="p-2.5 text-right font-sans text-neutral-500">
                      {p.role === 'PRINCIPAL' ? 'Full Case Access' : 'Minimally Scoped'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Collapsible Masked Internal Person Lookup Tool */}
      <div className="border border-black/15 bg-white p-4 dark:border-white/15 dark:bg-neutral-950 space-y-3">
        <button
          type="button"
          onClick={() => setLookupOpen(!lookupOpen)}
          className="w-full flex items-center justify-between text-left cursor-pointer"
        >
          <div>
            <h4 className="font-bold text-xs flex items-center gap-2 text-black dark:text-white">
              <span>Firm Masked Internal Person Lookup</span>
              <span className="font-mono text-[9px] border border-black/20 px-1.5 py-0.2 text-neutral-500">
                Privacy Filter Active
              </span>
            </h4>
            <p className="text-[11px] text-neutral-500 mt-0.5">
              Safely check for pre-registered persons or client records with automatic privacy masking.
            </p>
          </div>
          {lookupOpen ? (
            <ChevronUp className="h-4 w-4 text-neutral-500 shrink-0" />
          ) : (
            <ChevronDown className="h-4 w-4 text-neutral-500 shrink-0" />
          )}
        </button>

        {lookupOpen && (
          <div className="pt-3 border-t border-black/10 dark:border-white/10 space-y-3">
            <form onSubmit={handleRunLookup} className="flex gap-2">
              <input
                type="text"
                value={lookupQuery}
                onChange={(e) => setLookupQuery(e.target.value)}
                placeholder="Enter name, email, or internal person ID..."
                className="flex-1 border border-black/20 bg-white p-2 text-xs font-mono dark:border-white/20 dark:bg-black"
              />
              <button
                type="submit"
                className="flex items-center gap-1 border border-black bg-black px-4 py-2 font-semibold text-white hover:bg-neutral-800 dark:border-white dark:bg-white dark:text-black cursor-pointer"
              >
                <Search className="h-3.5 w-3.5" />
                <span>Search</span>
              </button>
            </form>

            {lookupResult && (
              <div className="border border-black/10 p-3 bg-neutral-50 dark:border-white/10 dark:bg-neutral-900 space-y-2">
                {lookupResult.found ? (
                  <div className="font-mono text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Masked Name:</span>
                      <span className="font-bold">{lookupResult.maskedName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Masked Mobile:</span>
                      <span>{lookupResult.maskedMobile}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Internal Reference:</span>
                      <span className="font-bold">{lookupResult.internalPersonId}</span>
                    </div>
                    <p className="text-[10px] text-amber-700 dark:text-amber-400 font-sans italic pt-1">
                      {lookupResult.disclaimer}
                    </p>
                  </div>
                ) : (
                  <div className="text-neutral-500 font-mono text-xs">
                    No matching internal record located for query.
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
