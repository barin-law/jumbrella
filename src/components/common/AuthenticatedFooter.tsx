import React, { useState } from 'react';
import { ShieldCheck, Scale, Lock, Phone, Mail } from 'lucide-react';
import { UserRole } from '../../types';
import { siteContact } from '../../config/contactConfig';
import { LegalDocumentModal, LegalDocType } from './LegalDocumentModal';

interface AuthenticatedFooterProps {
  currentRole: UserRole;
  onOpenSupportModal?: () => void;
}

export const AuthenticatedFooter: React.FC<AuthenticatedFooterProps> = ({
  currentRole,
  onOpenSupportModal,
}) => {
  const [activeLegalModal, setActiveLegalModal] = useState<LegalDocType | null>(null);

  return (
    <>
      <footer
        id="authenticated-workspace-footer"
        role="contentinfo"
        aria-label="Authenticated System Information and Contact Support"
        className="border-t border-black/10 bg-neutral-50 px-4 py-4 text-xs text-neutral-600 transition-colors dark:border-white/10 dark:bg-neutral-950 dark:text-neutral-400"
      >
        <div className="mx-auto max-w-7xl space-y-3">
          {/* Top row: Approved Attorney, Developer & Temporary Contact Links */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 text-center md:text-left">
            <div className="space-y-0.5">
              <div className="font-serif font-bold text-neutral-950 dark:text-neutral-50">
                {siteContact.attorneyName}
              </div>
              <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
                {siteContact.developerAttribution}
              </div>
            </div>

            {/* Standardized Contact Links */}
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-4 gap-y-1.5 text-xs">
              <div className="inline-flex items-center gap-1.5">
                <Phone className="h-3 w-3 text-neutral-500" aria-hidden="true" />
                <span className="text-neutral-500">Contact Us:</span>
                <a
                  href={siteContact.phoneLink}
                  aria-label={siteContact.phoneAccessibleLabel}
                  className="font-mono font-semibold text-black dark:text-white underline hover:text-neutral-700"
                >
                  {siteContact.phoneDisplay}
                </a>
                <span className="text-[10px] font-mono text-neutral-500">
                  ({siteContact.phoneStatus})
                </span>
              </div>

              <span className="text-neutral-300 dark:text-neutral-700 hidden sm:inline">•</span>

              <div className="inline-flex items-center gap-1.5">
                <Mail className="h-3 w-3 text-neutral-500" aria-hidden="true" />
                <span className="text-neutral-500">Email:</span>
                <a
                  href={siteContact.emailLink}
                  aria-label={siteContact.emailAccessibleLabel}
                  className="font-mono font-semibold text-black dark:text-white underline hover:text-neutral-700"
                >
                  {siteContact.email}
                </a>
                <span className="text-[10px] font-mono text-neutral-500">
                  ({siteContact.emailStatus})
                </span>
              </div>

              {onOpenSupportModal && (
                <button
                  type="button"
                  onClick={onOpenSupportModal}
                  className="text-[11px] font-semibold text-black dark:text-white underline hover:opacity-80 ml-1 cursor-pointer"
                >
                  Need Help?
                </button>
              )}
            </div>
          </div>

          {/* Bottom row: System Accreditation, Legal Links, Session Role */}
          <div className="pt-2 border-t border-black/5 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-neutral-500">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                JuriMbrella Philippine Electronic Notarization
              </span>
              <span>•</span>
              <span className="font-mono text-[10px]">Session Role: {currentRole}</span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <Scale className="h-3 w-3" />
                <span>A.M. No. 24-10-14-SC</span>
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setActiveLegalModal('PRIVACY')}
                className="hover:text-black dark:hover:text-white underline cursor-pointer"
              >
                Privacy Policy
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => setActiveLegalModal('TERMS')}
                className="hover:text-black dark:hover:text-white underline cursor-pointer"
              >
                Terms
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => setActiveLegalModal('DISCLAIMER')}
                className="hover:text-black dark:hover:text-white underline cursor-pointer"
              >
                Disclaimer
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => setActiveLegalModal('ACCESSIBILITY')}
                className="hover:text-black dark:hover:text-white underline cursor-pointer"
              >
                Accessibility
              </button>
            </div>
          </div>
        </div>
      </footer>

      {activeLegalModal && (
        <LegalDocumentModal
          isOpen={true}
          onClose={() => setActiveLegalModal(null)}
          type={activeLegalModal}
        />
      )}
    </>
  );
};
