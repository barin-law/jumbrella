import React, { useEffect } from 'react';
import { X, ShieldCheck, Scale, Lock, FileText, Globe } from 'lucide-react';
import { siteContact } from '../../config/contactConfig';

export type LegalDocType = 'PRIVACY' | 'TERMS' | 'DISCLAIMER' | 'ACCESSIBILITY' | 'SITEMAP';

interface LegalDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: LegalDocType;
}

export const LegalDocumentModal: React.FC<LegalDocumentModalProps> = ({
  isOpen,
  onClose,
  type,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const renderContent = () => {
    switch (type) {
      case 'PRIVACY':
        return (
          <div className="space-y-4 text-xs leading-relaxed text-neutral-700 dark:text-neutral-300">
            <div className="border border-black/10 bg-neutral-50 dark:bg-neutral-900 p-3.5 space-y-1">
              <span className="font-bold text-black dark:text-white">Republic Act No. 10173 (Data Privacy Act of 2012) Policy</span>
              <p className="text-[11px] text-neutral-600 dark:text-neutral-400">
                Data Controller: {siteContact.attorneyName} • Developer: {siteContact.developerAttribution}
              </p>
            </div>

            <div>
              <h4 className="font-bold text-neutral-900 dark:text-neutral-100 mb-1">1. Scope and Collection of Information</h4>
              <p>
                We collect personal information necessary to facilitate candidate electronic notarization under Supreme Court A.M. No. 24-10-14-SC, including government identification documents, biometric verification records, teleconference recording archives, cryptographic certificate hashes, and contact inquiry details.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-neutral-900 dark:text-neutral-100 mb-1">2. Data Retention Rules</h4>
              <p>
                Pursuant to Section 2, Rule VI of the 2004 Rules on Notarial Practice and Supreme Court A.M. No. 24-10-14-SC, notarial register entries, document cryptographic digests, and electronic audio-video recording archives are preserved for the statutory retention period mandated by the Supreme Court of the Philippines. Transient contact form inquiries are retained for ninety (90) days following inquiry resolution.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-neutral-900 dark:text-neutral-100 mb-1">3. Secure Deletion and Disposal Process</h4>
              <p>
                Non-statutory inquiries, temporary session tokens, and expired identity cache records are securely purged using cryptographic overwriting and zeroization. Statutory notarial records are shielded against unauthorized deletion.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-neutral-900 dark:text-neutral-100 mb-1">4. Privacy Requests &amp; Data Protection Contact</h4>
              <p>
                Data subjects may exercise statutory rights to information, object, access, rectify, or erase non-notarial personal data by submitting a formal privacy request to our designated Data Protection Officer via email at{' '}
                <a href={siteContact.emailLink} className="font-mono font-semibold underline">
                  {siteContact.email}
                </a>{' '}
                or calling{' '}
                <a href={siteContact.phoneLink} className="font-mono font-semibold underline">
                  {siteContact.phoneDisplay}
                </a>.
              </p>
            </div>
          </div>
        );

      case 'TERMS':
        return (
          <div className="space-y-4 text-xs leading-relaxed text-neutral-700 dark:text-neutral-300">
            <div className="border border-black/10 bg-neutral-50 dark:bg-neutral-900 p-3.5 space-y-1">
              <span className="font-bold text-black dark:text-white">Terms and Conditions of Platform Access</span>
              <p className="text-[11px] text-neutral-600 dark:text-neutral-400">
                Effective: 2026 • Supreme Court of the Philippines A.M. No. 24-10-14-SC Candidate
              </p>
            </div>

            <div>
              <h4 className="font-bold text-neutral-900 dark:text-neutral-100 mb-1">1. Operational Status</h4>
              <p>
                JuriMbrella is deployed as a Philippine electronic notarization platform candidate aligning with Supreme Court A.M. No. 24-10-14-SC. Nothing in this preview constitutes final administrative accreditation until certified by the Supreme Court of the Philippines.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-neutral-900 dark:text-neutral-100 mb-1">2. Permitted Use &amp; Principle of Least Privilege</h4>
              <p>
                Platform access is governed strictly by assigned institutional roles (Principal, Instrumental Witness, Electronic Notary Public, DPO, SecOps, Regulatory Auditor, and Administrator). Attempting to bypass role boundaries or inject malicious payload into notarial documents is strictly prohibited and cryptographically audited.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-neutral-900 dark:text-neutral-100 mb-1">3. Intellectual Property &amp; Attribution</h4>
              <p>
                Official development, architectural implementation, and cryptographic instrumentation are provided by {siteContact.developerAttribution}.
              </p>
            </div>
          </div>
        );

      case 'DISCLAIMER':
        return (
          <div className="space-y-4 text-xs leading-relaxed text-neutral-700 dark:text-neutral-300">
            <div className="border border-amber-400 bg-amber-50 dark:bg-amber-950/40 p-3.5 space-y-1 text-amber-900 dark:text-amber-200">
              <span className="font-bold">Official Legal Disclaimer &amp; Non-Representation Notice</span>
              <p className="text-[11px]">
                Republic of the Philippines • JuriMbrella Electronic Notarization
              </p>
            </div>

            <div>
              <h4 className="font-bold text-neutral-900 dark:text-neutral-100 mb-1">No Attorney-Client Relationship</h4>
              <p className="leading-relaxed">
                {siteContact.disclaimerNotice} Accessing this website, submitting an inquiry, or interacting with the JuriMbrella Assistant does not create an attorney-client relationship between you and {siteContact.attorneyName} or platform counsel.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-neutral-900 dark:text-neutral-100 mb-1">Informational Purpose Only</h4>
              <p>
                The materials, regulatory citations, statutory summaries, and notarial checklists presented on this facility are for educational and workflow demonstration purposes only. They do not constitute formal legal opinions or binding judicial determinations.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-neutral-900 dark:text-neutral-100 mb-1">Unverified Credentials Notice</h4>
              <p>
                In compliance with Supreme Court advertising guidelines, no unverified claims of judicial outcomes, government accreditations, or unconfirmed roll records are made. Office address and hours are currently marked: {siteContact.officeAddress}.
              </p>
            </div>
          </div>
        );

      case 'ACCESSIBILITY':
        return (
          <div className="space-y-4 text-xs leading-relaxed text-neutral-700 dark:text-neutral-300">
            <div className="border border-black/10 bg-neutral-50 dark:bg-neutral-900 p-3.5 space-y-1">
              <span className="font-bold text-black dark:text-white">Accessibility Commitment (WCAG 2.1 AA)</span>
              <p className="text-[11px] text-neutral-600 dark:text-neutral-400">
                Equal access for persons with disabilities in remote notarial procedures.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-neutral-900 dark:text-neutral-100 mb-1">Implemented Standards</h4>
              <ul className="list-disc pl-4 space-y-1">
                <li>High contrast monochrome visual palette compliant with WCAG AA ratios (minimum 4.5:1 for body copy).</li>
                <li>Full keyboard navigability with visible focus indicators and escape-key dialog dismissal.</li>
                <li>Screen-reader accessible ARIA landmarks, dialog roles, and descriptive link labels (no ambiguous 'Click here' links).</li>
                <li>Substantial mobile touch targets (minimum 44x44px) across all contact actions and navigation menus.</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-neutral-900 dark:text-neutral-100 mb-1">Accessibility Feedback</h4>
              <p>
                If you encounter any difficulty accessing notarial documents or features, please contact technical support directly at{' '}
                <a href={siteContact.emailLink} className="font-mono font-semibold underline">
                  {siteContact.email}
                </a>{' '}
                or call{' '}
                <a href={siteContact.phoneLink} className="font-mono font-semibold underline">
                  {siteContact.phoneDisplay}
                </a>.
              </p>
            </div>
          </div>
        );

      case 'SITEMAP':
        return (
          <div className="space-y-4 text-xs leading-relaxed text-neutral-700 dark:text-neutral-300">
            <div className="border border-black/10 bg-neutral-50 dark:bg-neutral-900 p-3.5 space-y-1">
              <span className="font-bold text-black dark:text-white">Platform Navigation Sitemap</span>
              <p className="text-[11px] text-neutral-600 dark:text-neutral-400">
                Index of public gateways, role portals, and utility registries.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h4 className="font-bold text-neutral-900 dark:text-neutral-100 mb-1.5 border-b border-neutral-200 dark:border-neutral-800 pb-1">
                  Public Gateways
                </h4>
                <ul className="space-y-1 text-[11px]">
                  <li>• / — JuriMbrella Public Homepage</li>
                  <li>• /contact — Official Contact Us &amp; Inquiry Intake</li>
                  <li>• /jurimbrella-portal — JuriMbrella Legal Information &amp; Assistant</li>
                  <li>• /verify — Cryptographic Document Hash Verification</li>
                  <li>• /sign-in — Demo Persona Switcher &amp; Authentication</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-neutral-900 dark:text-neutral-100 mb-1.5 border-b border-neutral-200 dark:border-neutral-800 pb-1">
                  Protected Portals (A.M. No. 24-10-14-SC)
                </h4>
                <ul className="space-y-1 text-[11px]">
                  <li>• /portal/signer — Principal Signatory Workspace</li>
                  <li>• /portal/witness — Instrumental Witness Waiting Room</li>
                  <li>• /portal/organization/admin — Corporate Enterprise Admin</li>
                  <li>• /enp/workspace — Electronic Notary Public Chamber</li>
                  <li>• /enp/assistant — Notarial Legal Assistant Support</li>
                  <li>• /admin/system — ENF System Administrator &amp; Inquiries</li>
                  <li>• /support — Customer Support Help Desk</li>
                </ul>
              </div>
            </div>
          </div>
        );
    }
  };

  const titles: Record<LegalDocType, string> = {
    PRIVACY: 'Privacy Policy & R.A. 10173 Notice',
    TERMS: 'Terms & Conditions of Service',
    DISCLAIMER: 'Legal Disclaimer & Non-Representation Notice',
    ACCESSIBILITY: 'Accessibility Statement',
    SITEMAP: 'Platform Sitemap & Route Directory',
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div className="relative flex max-h-[85vh] w-full max-w-xl flex-col border border-black dark:border-white bg-white dark:bg-black text-black dark:text-white shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 px-5 py-4">
          <div className="flex items-center gap-2">
            <Scale className="h-4 w-4" />
            <h3 id="legal-modal-title" className="text-sm font-bold tracking-tight">
              {titles[type]}
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close document dialog"
            className="flex h-7 w-7 items-center justify-center border border-black/20 hover:bg-neutral-100 dark:border-white/20 dark:hover:bg-neutral-900 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 sm:p-6">{renderContent()}</div>

        <div className="flex items-center justify-between border-t border-black/10 dark:border-white/10 px-5 py-3 bg-neutral-50 dark:bg-neutral-950 text-xs">
          <span className="text-[11px] text-neutral-500 font-mono">
            JuriMbrella • {siteContact.developerAttribution}
          </span>
          <button
            onClick={onClose}
            className="border border-black bg-black px-3.5 py-1 text-xs font-semibold text-white hover:bg-neutral-800 dark:border-white dark:bg-white dark:text-black cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
