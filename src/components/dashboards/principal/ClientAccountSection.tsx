/**
 * JuriMbrella — Philippine Electronic Notarization
 * Client Account, Security, Devices, Privacy & Payments Module
 * Official Statutory Settlements, Device Authorizations & Support
 */

import React, { useState } from 'react';
import {
  CreditCard,
  Smartphone,
  Shield,
  HelpCircle,
  LogOut,
  CheckCircle2,
  Lock,
  ExternalLink,
  Receipt,
  FileText,
  Download,
  Key,
  ShieldCheck,
  Check,
  AlertCircle,
  Eye,
  Sliders,
} from 'lucide-react';
import { useClientCase } from '../../../context/ClientCaseContext';
import { useAuth } from '../../../context/AuthContext';
import { StatusBadge } from '../../common/StatusBadge';

interface ClientAccountSectionProps {
  activeSubModule: string;
  onNavigateModule: (moduleId: string) => void;
}

export const ClientAccountSection: React.FC<ClientAccountSectionProps> = ({
  activeSubModule,
  onNavigateModule,
}) => {
  const { profile } = useClientCase();
  const { currentUser, logout } = useAuth();

  const [simulatingPayment, setSimulatingPayment] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Security settings state
  const [sessionTimeout, setSessionTimeout] = useState('15');
  const [biometricPrompt, setBiometricPrompt] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);

  const handleSimulatePayment = () => {
    setSimulatingPayment(true);
    setTimeout(() => {
      setSimulatingPayment(false);
      setPaymentDone(true);
      setToastMessage('Statutory notarial fee of ₱500.00 settled via Maya Sandbox. Official Electronic Receipt #OER-2026-914 generated.');
      setTimeout(() => setToastMessage(null), 5000);
    }, 1200);
  };

  const handleExportData = () => {
    setToastMessage('Exporting GDPR & DPA compliant case audit archive (JSON/ZIP)... Download will commence shortly.');
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="space-y-5 text-xs">
      {toastMessage && (
        <div className="border border-emerald-500 bg-emerald-50 p-3 text-xs text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
          ✓ {toastMessage}
        </div>
      )}

      {/* SUB-VIEW ROUTING */}
      {activeSubModule === 'principal-payments' ? (
        /* STATUTORY PAYMENTS & RECEIPTS */
        <div className="border border-black/15 bg-white p-5 dark:border-white/15 dark:bg-neutral-950 space-y-4">
          <div className="flex items-center justify-between border-b border-black/10 pb-3 dark:border-white/10">
            <div>
              <h3 className="text-sm font-bold text-black dark:text-white">
                Statutory Notarial Fee Settlements
              </h3>
              <p className="text-xs text-neutral-500">
                Authorized electronic payment channels pursuant to Supreme Court 2004 Rules on Notarial Practice and A.M. No. 24-10-14-SC.
              </p>
            </div>
            <StatusBadge status="MAYA / GCASH INTEGRATION" variant="info" size="sm" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-black/20 bg-neutral-50 text-[11px] font-semibold text-neutral-600 dark:border-white/20 dark:bg-neutral-900 dark:text-neutral-400">
                <tr>
                  <th className="p-2.5">Billing Reference</th>
                  <th className="p-2.5">Item Description</th>
                  <th className="p-2.5">Statutory Amount</th>
                  <th className="p-2.5">Payment State</th>
                  <th className="p-2.5 text-right">Settlement Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/10 dark:divide-white/10 font-mono text-[11px]">
                <tr className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50">
                  <td className="p-2.5 font-bold">INV-2026-0814-01</td>
                  <td className="p-2.5 font-sans">Remote Notarization of Special Power of Attorney</td>
                  <td className="p-2.5 font-bold">₱500.00</td>
                  <td className="p-2.5">
                    <StatusBadge status={paymentDone ? 'SETTLED' : 'AWAITING_PAYMENT'} size="sm" />
                  </td>
                  <td className="p-2.5 text-right font-sans">
                    {!paymentDone ? (
                      <button
                        onClick={handleSimulatePayment}
                        disabled={simulatingPayment}
                        className="border border-black bg-black px-3 py-1 text-[11px] font-semibold text-white hover:bg-neutral-800 dark:border-white dark:bg-white dark:text-black cursor-pointer disabled:opacity-50"
                      >
                        {simulatingPayment ? 'Settling...' : 'Simulate Maya QR'}
                      </button>
                    ) : (
                      <span className="text-emerald-600 dark:text-emerald-400 font-mono text-[10px] font-bold">
                        Receipt #OER-2026-914
                      </span>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : activeSubModule === 'principal-privacy' ? (
        /* DATA PRIVACY & RA 10173 COMPLIANCE */
        <div className="border border-black/15 bg-white p-5 dark:border-white/15 dark:bg-neutral-950 space-y-4">
          <div className="flex items-center justify-between border-b border-black/10 pb-3 dark:border-white/10">
            <div>
              <h3 className="text-sm font-bold text-black dark:text-white">
                Data Privacy & Statutory Client Rights
              </h3>
              <p className="text-xs text-neutral-500">
                Compliance with Republic Act No. 10173 (Data Privacy Act of 2012) and Supreme Court confidentiality mandates.
              </p>
            </div>
            <StatusBadge status="NPC REGISTERED" variant="success" size="sm" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-black/10 p-4 bg-neutral-50 dark:border-white/10 dark:bg-neutral-900 space-y-2">
              <h4 className="font-bold text-xs">Your Statutory Privacy Rights</h4>
              <ul className="list-disc pl-5 space-y-1 text-[11px] text-neutral-600 dark:text-neutral-400">
                <li>Right to be Informed of data processing scope</li>
                <li>Right to Access stored identification records and hash digests</li>
                <li>Right to Rectification of inaccurate personal particulars</li>
                <li>Right to Data Portability for court-mandated records</li>
                <li>Confidentiality protected under Attorney-Client Privilege</li>
              </ul>
            </div>

            <div className="border border-black/10 p-4 bg-neutral-50 dark:border-white/10 dark:bg-neutral-900 space-y-3 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-xs">Data Portability & Audit Archive</h4>
                <p className="text-[11px] text-neutral-600 dark:text-neutral-400 mt-1">
                  Request an immutable extract of your personal transaction audit log, certificate tokens, and uploaded evidence manifests.
                </p>
              </div>

              <button
                onClick={handleExportData}
                className="flex items-center justify-center gap-1.5 border border-black bg-black py-2 font-semibold text-white hover:bg-neutral-800 dark:border-white dark:bg-white dark:text-black cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export Personal Data Package</span>
              </button>
            </div>
          </div>
        </div>
      ) : activeSubModule === 'principal-security-settings' ? (
        /* SECURITY & CREDENTIALS SETTINGS */
        <div className="border border-black/15 bg-white p-5 dark:border-white/15 dark:bg-neutral-950 space-y-4">
          <div className="flex items-center justify-between border-b border-black/10 pb-3 dark:border-white/10">
            <div>
              <h3 className="text-sm font-bold text-black dark:text-white">
                Account Security & Authentication Settings
              </h3>
              <p className="text-xs text-neutral-500">
                Multi-factor authentication, cryptographic key storage, and active session controls.
              </p>
            </div>
            <StatusBadge status="MFA PROTECTED" variant="success" size="sm" />
          </div>

          <div className="space-y-4">
            <div className="border border-black/10 p-4 bg-neutral-50 dark:border-white/10 dark:bg-neutral-900 flex items-center justify-between">
              <div>
                <div className="font-bold text-xs">Two-Factor Authentication (TOTP / SMS)</div>
                <div className="text-[11px] text-neutral-500">Enforces secondary one-time verification during signing sessions.</div>
              </div>
              <span className="text-emerald-600 font-bold text-xs border border-emerald-500 px-2 py-0.5">
                ENFORCED
              </span>
            </div>

            <div className="border border-black/10 p-4 bg-neutral-50 dark:border-white/10 dark:bg-neutral-900 flex items-center justify-between">
              <div>
                <div className="font-bold text-xs">Inactivity Session Timeout</div>
                <div className="text-[11px] text-neutral-500">Automatically terminates session if no mouse/keyboard interaction is detected.</div>
              </div>
              <select
                value={sessionTimeout}
                onChange={(e) => {
                  setSessionTimeout(e.target.value);
                  setToastMessage(`Session inactivity timeout adjusted to ${e.target.value} minutes.`);
                  setTimeout(() => setToastMessage(null), 3000);
                }}
                className="border border-black/20 bg-white p-1.5 text-xs font-mono dark:border-white/20 dark:bg-black"
              >
                <option value="15">15 Minutes</option>
                <option value="30">30 Minutes</option>
                <option value="60">60 Minutes</option>
              </select>
            </div>

            <div className="border border-black/10 p-4 bg-neutral-50 dark:border-white/10 dark:bg-neutral-900 flex items-center justify-between">
              <div>
                <div className="font-bold text-xs">Biometric Prompt for Document Signing</div>
                <div className="text-[11px] text-neutral-500">Require camera passive liveness re-check immediately prior to digital seal affixation.</div>
              </div>
              <button
                onClick={() => setBiometricPrompt(!biometricPrompt)}
                className={`px-3 py-1 font-semibold text-xs border cursor-pointer ${
                  biometricPrompt
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'border-neutral-400 text-neutral-500'
                }`}
              >
                {biometricPrompt ? 'Enabled' : 'Disabled'}
              </button>
            </div>
          </div>
        </div>
      ) : activeSubModule === 'principal-devices' ? (
        /* AUTHORIZED DEVICES */
        <div className="border border-black/15 bg-white p-5 dark:border-white/15 dark:bg-neutral-950 space-y-4">
          <div className="flex items-center justify-between border-b border-black/10 pb-3 dark:border-white/10">
            <div>
              <h3 className="text-sm font-bold text-black dark:text-white">
                Authorized Client Hardware & Trusted Devices
              </h3>
              <p className="text-xs text-neutral-500">
                Cryptographic hardware tokens and registered signing workstations.
              </p>
            </div>
            <StatusBadge status="SECURE ENCLAVE" variant="success" size="sm" />
          </div>

          <div className="space-y-3">
            <div className="border border-black/10 p-3 bg-neutral-50 dark:border-white/10 dark:bg-neutral-900 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="h-5 w-5" />
                <div>
                  <div className="font-bold text-xs">Apple MacBook Pro 16" (Current Session)</div>
                  <div className="text-[10px] font-mono text-neutral-500">
                    Fingerprint: DFP-MAC-APPLE-2026 • Last Active: Just now
                  </div>
                </div>
              </div>
              <span className="text-emerald-600 font-bold text-[10px] border border-emerald-500 px-2 py-0.5">
                PRIMARY TRUSTED
              </span>
            </div>
          </div>
        </div>
      ) : activeSubModule === 'principal-support' ? (
        /* HELP AND SUPPORT */
        <div className="border border-black/15 bg-white p-5 dark:border-white/15 dark:bg-neutral-950 space-y-4">
          <div className="flex items-center justify-between border-b border-black/10 pb-3 dark:border-white/10">
            <div>
              <h3 className="text-sm font-bold text-black dark:text-white">
                Client Support & Regulatory Assistance
              </h3>
              <p className="text-xs text-neutral-500">
                Guidance on Supreme Court A.M. No. 24-10-14-SC electronic notarization rules.
              </p>
            </div>
            <HelpCircle className="h-4 w-4 text-neutral-400" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-black/10 p-4 bg-neutral-50 dark:border-white/10 dark:bg-neutral-900 space-y-2">
              <h4 className="font-bold text-xs">Helpdesk Contacts</h4>
              <p className="text-[11px] text-neutral-600 dark:text-neutral-400">
                Email: support@jurimbrella.notary.ph
                <br />
                Direct Hotline: +63 (2) 8888-0814
                <br />
                Office Hours: Monday - Friday, 8:00 AM - 5:00 PM PHT
              </p>
            </div>

            <div className="border border-black/10 p-4 bg-neutral-50 dark:border-white/10 dark:bg-neutral-900 space-y-2">
              <h4 className="font-bold text-xs">Supreme Court Rules Repository</h4>
              <p className="text-[11px] text-neutral-600 dark:text-neutral-400">
                A.M. No. 24-10-14-SC establishes rules for Remote and In-Person Electronic Notarization across Philippine jurisdictions.
              </p>
            </div>
          </div>
        </div>
      ) : activeSubModule === 'principal-sign-out' ? (
        /* SIGN OUT */
        <div className="border border-black/15 bg-white p-6 dark:border-white/15 dark:bg-neutral-950 space-y-4 text-center max-w-md mx-auto">
          <LogOut className="h-8 w-8 mx-auto text-neutral-400" />
          <h3 className="text-sm font-bold text-black dark:text-white">
            Terminate Client Session
          </h3>
          <p className="text-xs text-neutral-500">
            Securely revoke local session keys and log out of the JuriMbrella Philippine Electronic Notarization platform.
          </p>
          <button
            onClick={() => {
              logout();
            }}
            className="w-full border border-black bg-black py-2.5 font-semibold text-white hover:bg-neutral-800 dark:border-white dark:bg-white dark:text-black cursor-pointer"
          >
            Confirm Sign Out
          </button>
        </div>
      ) : (
        /* DEFAULT PROFILE VIEW */
        <div className="border border-black/15 bg-white p-5 dark:border-white/15 dark:bg-neutral-950 space-y-4">
          <div className="flex items-center justify-between border-b border-black/10 pb-3 dark:border-white/10">
            <div>
              <h3 className="text-sm font-bold text-black dark:text-white">
                Account Settings & Credentials
              </h3>
              <p className="text-xs text-neutral-500">
                Manage personal profile, authenticated login identifiers, and privacy preferences.
              </p>
            </div>
            <StatusBadge status="ACTIVE ACCOUNT" variant="success" size="sm" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
            <div>
              <span className="text-neutral-500 text-[10px] uppercase">Account Holder:</span>
              <p className="font-bold font-sans text-sm">{currentUser.name}</p>
            </div>
            <div>
              <span className="text-neutral-500 text-[10px] uppercase">Official Email:</span>
              <p>{currentUser.email}</p>
            </div>
            <div>
              <span className="text-neutral-500 text-[10px] uppercase">Role:</span>
              <p>{currentUser.role}</p>
            </div>
            <div>
              <span className="text-neutral-500 text-[10px] uppercase">Internal Person Reference:</span>
              <p className="font-bold">{profile.internalPersonId}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
