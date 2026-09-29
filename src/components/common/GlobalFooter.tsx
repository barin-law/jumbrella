import React, { useState } from 'react';
import { Phone, Mail, Scale, ShieldCheck, Lock } from 'lucide-react';
import { siteContact } from '../../config/contactConfig';
import { BrandLogo } from './BrandLogo';
import { LegalDocumentModal, LegalDocType } from './LegalDocumentModal';

interface GlobalFooterProps {
  onNavigate?: (path: string) => void;
  className?: string;
  variant?: 'public' | 'compact';
}

export const GlobalFooter: React.FC<GlobalFooterProps> = ({
  onNavigate,
  className = '',
  variant = 'public',
}) => {
  const [activeLegalModal, setActiveLegalModal] = useState<LegalDocType | null>(null);

  const handleLinkClick = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      window.history.pushState({}, '', path);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  return (
    <>
      <footer
        id="global-application-footer"
        role="contentinfo"
        className={`border-t border-neutral-300 dark:border-neutral-800 bg-neutral-50/90 dark:bg-neutral-950 text-neutral-600 dark:text-neutral-400 transition-colors ${className}`}
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 lg:py-12">
          {/* Main Desktop Grid / Mobile Stack */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10">
            {/* Column 1: Brand & Regulatory Scope (5 cols) */}
            <div className="md:col-span-5 space-y-3.5">
              <div className="flex items-center gap-2.5">
                <BrandLogo
                  variant="compact"
                  height={32}
                  decorative
                  className="shrink-0"
                />
              </div>

              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-md">
                Candidate platform implementing Philippine Supreme Court Rules on Electronic Notarization (A.M. No. 24-10-14-SC) and the 2004 Rules on Notarial Practice.
              </p>

              <div className="flex flex-wrap items-center gap-3 text-[11px] text-neutral-500 font-mono pt-1">
                <span className="inline-flex items-center gap-1">
                  <Scale className="h-3 w-3" />
                  <span>A.M. No. 24-10-14-SC</span>
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1">
                  <Lock className="h-3 w-3" />
                  <span>R.A. 10173 Protected</span>
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" />
                  <span>R.A. 8792 Compliant</span>
                </span>
              </div>
            </div>

            {/* Column 2: Approved Attorney & Developer Contact Hierarchy (4 cols) */}
            <div className="md:col-span-4 space-y-2 border-t md:border-t-0 md:border-l border-neutral-200 dark:border-neutral-800 pt-6 md:pt-0 md:pl-6">
              <div className="space-y-0.5">
                <h4 className="font-serif text-sm font-bold text-neutral-950 dark:text-neutral-50">
                  {siteContact.attorneyName}
                </h4>
                <p className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400">
                  {siteContact.developerAttribution}
                </p>
              </div>

              <div className="pt-2 space-y-2 text-xs">
                {/* Contact Phone */}
                <div>
                  <div className="flex items-baseline gap-1.5 flex-wrap">
                    <span className="text-neutral-500 font-medium">Contact Us:</span>
                    <a
                      href={siteContact.phoneLink}
                      aria-label={siteContact.phoneAccessibleLabel}
                      className="font-mono font-semibold text-neutral-900 dark:text-neutral-100 hover:underline hover:text-black dark:hover:text-white"
                    >
                      {siteContact.phoneDisplay}
                    </a>
                  </div>
                  <span className="text-[10px] text-neutral-500 font-mono block">
                    {siteContact.phoneStatus}
                  </span>
                </div>

                {/* Email */}
                <div>
                  <div className="flex items-baseline gap-1.5 flex-wrap">
                    <span className="text-neutral-500 font-medium">Email:</span>
                    <a
                      href={siteContact.emailLink}
                      aria-label={siteContact.emailAccessibleLabel}
                      className="font-mono font-semibold text-neutral-900 dark:text-neutral-100 hover:underline hover:text-black dark:hover:text-white"
                    >
                      {siteContact.email}
                    </a>
                  </div>
                  <span className="text-[10px] text-neutral-500 font-mono block">
                    {siteContact.emailStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Column 3: Quick Navigation & Legal Disclosures (3 cols) */}
            <div className="md:col-span-3 space-y-2 border-t md:border-t-0 md:border-l border-neutral-200 dark:border-neutral-800 pt-6 md:pt-0 md:pl-6">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-900 dark:text-neutral-100 mb-2">
                Legal &amp; Support
              </h4>

              <ul className="space-y-1.5 text-xs">
                <li>
                  <button
                    type="button"
                    onClick={() => handleLinkClick('/enf')}
                    className="hover:text-neutral-950 dark:hover:text-neutral-100 hover:underline cursor-pointer text-left font-semibold text-[#002D5B] dark:text-[#A8E063] flex items-center gap-1"
                  >
                    <span>ENF Development Portal</span>
                    <span className="text-[10px] bg-[#2EAF4A]/20 text-[#1B6C2E] dark:text-[#A8E063] px-1 rounded">NEW</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => handleLinkClick('/contact')}
                    className="hover:text-neutral-950 dark:hover:text-neutral-100 hover:underline cursor-pointer text-left"
                  >
                    Contact Us / Inquiry Intake
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveLegalModal('PRIVACY')}
                    className="hover:text-neutral-950 dark:hover:text-neutral-100 hover:underline cursor-pointer text-left"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveLegalModal('TERMS')}
                    className="hover:text-neutral-950 dark:hover:text-neutral-100 hover:underline cursor-pointer text-left"
                  >
                    Terms and Conditions
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveLegalModal('DISCLAIMER')}
                    className="hover:text-neutral-950 dark:hover:text-neutral-100 hover:underline cursor-pointer text-left"
                  >
                    Legal Disclaimer
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveLegalModal('ACCESSIBILITY')}
                    className="hover:text-neutral-950 dark:hover:text-neutral-100 hover:underline cursor-pointer text-left"
                  >
                    Accessibility Statement
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveLegalModal('SITEMAP')}
                    className="hover:text-neutral-950 dark:hover:text-neutral-100 hover:underline cursor-pointer text-left"
                  >
                    Sitemap
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar: Copyright & Candidate Disclaimer */}
          <div className="mt-8 pt-6 border-t border-[#D9E1E8] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <p>
              &copy; {siteContact.copyrightYear} {siteContact.attorneyName} • JuriMbrella — Protection over every signature. All rights reserved.
            </p>
            <p className="text-[11px] font-mono text-slate-500">
              Official Developer: Ophireum Multimedia Production
            </p>
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
