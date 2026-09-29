import React from 'react';
import { HelpCircle, Phone, Mail } from 'lucide-react';
import { siteContact } from '../../config/contactConfig';

interface ErrorSupportMessageProps {
  context?: string;
  className?: string;
  onOpenSupportModal?: () => void;
}

/**
 * Standardized Privacy-Safe Error & Access Support Message
 *
 * Renders the approved temporary assistance notice across authentication,
 * access control (403), 404, session expiration, and error boundaries.
 */
export const ErrorSupportMessage: React.FC<ErrorSupportMessageProps> = ({
  context,
  className = '',
  onOpenSupportModal,
}) => {
  return (
    <div
      role="note"
      aria-label="Support and Administrator Contact Assistance"
      className={`border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900/60 p-3.5 text-xs text-neutral-700 dark:text-neutral-300 space-y-2 ${className}`}
    >
      <div className="flex items-start gap-2">
        <HelpCircle
          className="h-4 w-4 text-neutral-600 dark:text-neutral-400 shrink-0 mt-0.5"
          aria-hidden="true"
        />
        <div className="space-y-1 text-left">
          {context && (
            <p className="font-semibold text-neutral-900 dark:text-neutral-100">
              {context}
            </p>
          )}
          <p className="leading-relaxed">
            Need assistance? Contact the administrator at{' '}
            <a
              href={siteContact.phoneLink}
              aria-label={siteContact.phoneAccessibleLabel}
              className="font-mono font-semibold text-black dark:text-white underline hover:text-neutral-700 dark:hover:text-neutral-300"
            >
              {siteContact.phoneDisplay}
            </a>{' '}
            or{' '}
            <a
              href={siteContact.emailLink}
              aria-label={siteContact.emailAccessibleLabel}
              className="font-mono font-semibold text-black dark:text-white underline hover:text-neutral-700 dark:hover:text-neutral-300"
            >
              {siteContact.email}
            </a>
            . These are temporary contact details and may be updated later.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 pt-1.5 border-t border-neutral-200 dark:border-neutral-800 text-[11px] text-neutral-500">
        <span>{siteContact.attorneyName} • {siteContact.developerAttribution}</span>
        {onOpenSupportModal && (
          <button
            type="button"
            onClick={onOpenSupportModal}
            className="text-neutral-800 dark:text-neutral-200 underline font-medium hover:text-black dark:hover:text-white cursor-pointer"
          >
            Open Help &amp; Support Dialog
          </button>
        )}
      </div>
    </div>
  );
};
