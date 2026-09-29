import React from 'react';
import { Phone, Mail, ShieldAlert, ArrowRight, ExternalLink } from 'lucide-react';
import { siteContact } from '../../config/contactConfig';
import { ContactInformation } from './ContactInformation';

interface ContactAdminCardProps {
  title?: string;
  subtitle?: string;
  className?: string;
  onOpenHelpModal?: () => void;
  onNavigateContact?: () => void;
  showActions?: boolean;
}

/**
 * Standardized Contact Administrator Support Card
 *
 * Used inside protected dashboards, support panels, access restriction screens,
 * and profile menus to present approved attorney and developer contact details.
 */
export const ContactAdminCard: React.FC<ContactAdminCardProps> = ({
  title = 'Administrator Support & Legal Assistance',
  subtitle = 'Official attorney and developer contact directory. Temporary credentials.',
  className = '',
  onOpenHelpModal,
  onNavigateContact,
  showActions = true,
}) => {
  return (
    <div
      className={`border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-5 sm:p-6 shadow-xs ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-3 mb-4">
        <div>
          <h3 className="font-serif text-base font-bold text-neutral-950 dark:text-neutral-50 tracking-tight">
            {title}
          </h3>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
            {subtitle}
          </p>
        </div>
        <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-mono border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 self-start sm:self-center">
          Candidate Environment
        </span>
      </div>

      <ContactInformation
        variant="card"
        className="!border-0 !p-0 !shadow-none"
        showOfficeStatus={true}
        showTemporaryNote={true}
      />

      {showActions && (
        <div className="mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-800 flex flex-wrap items-center gap-2">
          <a
            href={siteContact.phoneLink}
            aria-label={siteContact.phoneAccessibleLabel}
            className="inline-flex items-center gap-1.5 border border-black bg-black px-3 py-1.5 text-xs font-semibold text-white hover:bg-neutral-800 dark:border-white dark:bg-white dark:text-black dark:hover:bg-neutral-200 transition-colors"
          >
            <Phone className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Call Administrator</span>
          </a>

          <a
            href={siteContact.emailLink}
            aria-label={siteContact.emailAccessibleLabel}
            className="inline-flex items-center gap-1.5 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-1.5 text-xs font-semibold text-neutral-800 dark:text-neutral-200 hover:border-black dark:hover:border-white transition-colors"
          >
            <Mail className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Email Administrator</span>
          </a>

          {onNavigateContact && (
            <button
              type="button"
              onClick={onNavigateContact}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white underline transition-colors cursor-pointer"
            >
              <span>Dedicated Contact Page</span>
              <ArrowRight className="h-3 w-3" aria-hidden="true" />
            </button>
          )}

          {onOpenHelpModal && (
            <button
              type="button"
              onClick={onOpenHelpModal}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white underline transition-colors cursor-pointer"
            >
              <span>Open Help Guide</span>
              <ExternalLink className="h-3 w-3" aria-hidden="true" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
