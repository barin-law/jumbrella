import React, { useState } from 'react';
import { BookOpen, Shield, Code, Cpu, FileText, CheckCircle2, Copy } from 'lucide-react';

export const DocumentationView: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'ARCH' | 'LEGAL' | 'SECURITY' | 'RBAC' | 'ONBOARDING'>('ARCH');

  return (
    <div id="documentation-view" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/15 pb-5 dark:border-white/15">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight">System Architecture & Onboarding Guide</h2>
            <span className="border border-black px-2 py-0.5 text-[10px] font-mono font-bold uppercase dark:border-white">
              v1.0.0 Spec
            </span>
          </div>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
            Architectural guidelines, statutory compliance models, and engineering onboarding for the JuriMbrella Philippine Electronic Notarization platform.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-neutral-500">Document ID: JURIMBRELLA-ARCH-2026</span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-black/10 pb-3 dark:border-white/10">
        {[
          { id: 'ARCH', label: '1. Architecture & Core Pipeline', icon: Cpu },
          { id: 'LEGAL', label: '2. Supreme Court Legal Baseline', icon: FileText },
          { id: 'SECURITY', label: '3. Cryptography & SIEM Model', icon: Shield },
          { id: 'RBAC', label: '4. RBAC & State Machine', icon: Code },
          { id: 'ONBOARDING', label: '5. Engineering Onboarding', icon: BookOpen },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id as any)}
              className={`flex items-center gap-2 border px-3 py-1.5 text-xs font-semibold ${
                activeSection === item.id
                  ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
                  : 'border-black/20 hover:bg-neutral-100 dark:border-white/20 dark:hover:bg-neutral-900'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      <div className="border border-black/15 bg-white p-6 dark:border-white/15 dark:bg-black text-xs leading-relaxed space-y-6">
        {activeSection === 'ARCH' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider">
              1. System Architecture & Ingestion Pipeline
            </h3>
            <p>
              JuriMbrella is engineered as an enterprise-grade, fail-closed platform designed specifically for Philippine Electronic Notarization (IEN for Integrated In-Person Electronic Notarization and REN for Remote Electronic Notarization).
            </p>

            <div className="border border-black/20 bg-neutral-50 p-4 dark:border-white/20 dark:bg-neutral-900 space-y-2 font-mono text-[11px]">
              <p className="font-bold text-black dark:text-white">High-Level Architectural Components:</p>
              <p>• <strong>Client Presentation Layer:</strong> React 18 with TypeScript, Tailwind CSS, Strict Black-and-White Minimalist High-Contrast Palette with Dark Mode.</p>
              <p>• <strong>Document Intake & Quarantine:</strong> Multi-engine antivirus scanning (ClamAV) isolates all uploaded instruments into a staging quarantine bucket prior to PDF/A normalization.</p>
              <p>• <strong>Cryptographic Engine:</strong> Built on the W3C Web Crypto API (`crypto.subtle`), ensuring standard NIST FIPS 180-4 SHA-256 digests for all documents and audit blocks.</p>
              <p>• <strong>Append-Only Audit Log:</strong> Cryptographically linked hash chain (`prevHash` -&gt; `hash`), preventing retro-active log modification.</p>
              <p>• <strong>Electronic Notarial Book:</strong> Sequential, concurrency-locked registry recording Doc No., Page No., Book No., and Series Year per Supreme Court Rule V.</p>
            </div>
          </div>
        )}

        {activeSection === 'LEGAL' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider">
              2. Supreme Court Legal & Regulatory Baseline
            </h3>
            <p>
              The application strictly enforces statutory constraints mandated by Philippine jurisprudence:
            </p>

            <div className="space-y-3">
              <div className="border border-black/10 p-3 dark:border-white/10">
                <p className="font-bold">A.M. No. 24-10-14-SC (Rules on Electronic Notarization)</p>
                <p className="text-neutral-600 dark:text-neutral-400 mt-1">
                  Mandates the Solo Prerogative of the commissioned Electronic Notary Public (ENP). System logic cannot automatically notarize or bypass human legal sufficiency determination. Also strictly excludes holographic wills, testamentary instruments, and specific civil status deeds from electronic notarization.
                </p>
              </div>

              <div className="border border-black/10 p-3 dark:border-white/10">
                <p className="font-bold">Republic Act No. 8792 (Electronic Commerce Act of 2000)</p>
                <p className="text-neutral-600 dark:text-neutral-400 mt-1">
                  Provides legal recognition of electronic data messages, electronic documents, and digital signatures. Requires verifiable document integrity from creation to archiving.
                </p>
              </div>

              <div className="border border-black/10 p-3 dark:border-white/10">
                <p className="font-bold">Republic Act No. 10173 (Data Privacy Act of 2012)</p>
                <p className="text-neutral-600 dark:text-neutral-400 mt-1">
                  Enforces data minimization. The public verification endpoint specifically masks citizen national ID numbers, selfie biometrics, and sensitive contract content.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'SECURITY' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider">
              3. Cryptography & SIEM Integration Model
            </h3>
            <p>
              JuriMbrella deploys continuous security telemetry and automated threat detection:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-black/15 p-3 space-y-1 dark:border-white/15">
                <p className="font-bold">Tamper-Evident Hash Chaining</p>
                <p className="text-neutral-600 dark:text-neutral-400">
                  Each event payload is combined with the previous block's SHA-256 hash. If any adversary alters an existing database row, traversing the chain immediately flags the exact index where mathematical equivalence breaks.
                </p>
              </div>

              <div className="border border-black/15 p-3 space-y-1 dark:border-white/15">
                <p className="font-bold">Automated Threat Detection</p>
                <p className="text-neutral-600 dark:text-neutral-400">
                  Heuristic rules monitor consecutive failed MFA attempts, impossible travel velocities (&gt;800 km/h between logins), and forged role claim tokens. Dispatches instant notifications to Email and Slack webhooks.
                </p>
              </div>

              <div className="border border-black/15 p-3 space-y-1 dark:border-white/15">
                <p className="font-bold">SIEM Multi-Format Telemetry</p>
                <p className="text-neutral-600 dark:text-neutral-400">
                  Native export in ArcSight Common Event Format (CEF), RFC 5424 Syslog, and JSON for seamless integration with Splunk, Microsoft Sentinel, IBM QRadar, and Elastic.
                </p>
              </div>

              <div className="border border-black/15 p-3 space-y-1 dark:border-white/15">
                <p className="font-bold">Encryption at Rest & In Transit</p>
                <p className="text-neutral-600 dark:text-neutral-400">
                  Enforces TLS 1.3 with AES-256-GCM cipher suite for all data in transit, paired with Cloud Key Management Service (KMS) Customer-Managed Keys for resting storage.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'RBAC' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider">
              4. Role-Based Access Control (RBAC) & State Machine
            </h3>
            <p>
              Access boundaries are strictly segmented across 5 standard personas:
            </p>

            <div className="border border-black/15 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-black/10 bg-neutral-50 dark:border-white/10 dark:bg-neutral-900">
                  <tr>
                    <th className="p-3">Role</th>
                    <th className="p-3">Primary Responsibilities</th>
                    <th className="p-3">Permissions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/10 dark:divide-white/10">
                  <tr>
                    <td className="p-3 font-mono font-bold">PRINCIPAL</td>
                    <td className="p-3">Instrument requester / signatory</td>
                    <td className="p-3">Create requests, upload documents, execute digital signature</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold">ENP</td>
                    <td className="p-3">Commissioned Electronic Notary Public</td>
                    <td className="p-3">Solo legal prerogative, examine identity, apply notarial seal, record formal refusal</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold">SECOPS_ANALYST</td>
                    <td className="p-3">Security monitoring & incident containment</td>
                    <td className="p-3">View threat alerts, configure notification thresholds, export SIEM feeds, trigger containment</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold">DPO</td>
                    <td className="p-3">Data Protection Officer (R.A. 10173)</td>
                    <td className="p-3">Monitor data minimization, audit PII masking, review access logs</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold">COURT_AUDITOR</td>
                    <td className="p-3">Supreme Court Judicial Inspector</td>
                    <td className="p-3">Verify notarial book sequential integrity, inspect cryptographic proofs</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeSection === 'ONBOARDING' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider">
              5. Engineering Onboarding & Contribution Guidelines
            </h3>
            <p>
              Welcome to the JuriMbrella engineering team. Please follow these conventions when contributing code:
            </p>

            <div className="space-y-2 border border-black/15 p-4 bg-neutral-50 dark:border-white/15 dark:bg-neutral-900">
              <p className="font-bold">Strict Aesthetic Standard:</p>
              <p>• Black and white palette only (no color accents for decoration, red used exclusively for critical security alerts or legal refusals).</p>
              <p>• Clean sans-serif typography, high legibility, generous whitespace.</p>
              <p>• All components must support full Dark Mode inversion.</p>
            </div>

            <div className="space-y-2 border border-black/15 p-4 bg-neutral-50 dark:border-white/15 dark:bg-neutral-900">
              <p className="font-bold">Testing & Verification Protocol:</p>
              <p>• Every state machine transition or cryptographic modification MUST have an automated unit test in `src/data/unitTests.ts`.</p>
              <p>• Run the automated unit tests via the "Test Suite" tab or `npm test` before submitting changes.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
