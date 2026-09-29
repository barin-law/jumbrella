import React from 'react';
import { Phone, Mail, User, Code2, ShieldAlert } from 'lucide-react';
import { siteContact } from '../../config/contactConfig';

export type ContactInfoVariant = 'standard' | 'card' | 'compact' | 'footer' | 'banner';

interface ContactInformationProps {
  variant?: ContactInfoVariant;
  className?: string;
  showOfficeStatus?: boolean;
  showTemporaryNote?: boolean;
}

/**
 * Standardized Contact Information Component
 *
 * Implements the approved organizational hierarchy:
 * 1. Supreme Court of the Philippines
 * 2. Developed by: Ophireum Multimedia Production — Official Developer
 * 3. Contact Us: +63 917 966 8814 (Temporary Contact Number)
 * 4. Email: ophireum.admin@gmail.com (Temporary Email Address)
 */
export const ContactInformation: React.FC<ContactInformationProps> = ({
  variant = 'standard',
  className = '',
  showOfficeStatus = false,
  showTemporaryNote = false,
}) => {
  if (variant === 'compact') {
    return (
      <div className={`text-xs space-y-1 ${className}`}>
        <div className="font-semibold text-neutral-900 dark:text-neutral-100">
          {siteContact.attorneyName}
        </div>
        <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
          {siteContact.developerAttribution}
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 text-[11px]">
          <div className="inline-flex items-center gap-1">
            <span className="text-neutral-600 dark:text-neutral-300">Contact Us:</span>
            <a
              href={siteContact.phoneLink}
              aria-label={siteContact.phoneAccessibleLabel}
              className="font-medium text-black dark:text-white underline hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
            >
              {siteContact.phoneDisplay}
            </a>
            <span className="text-[10px] text-neutral-500 font-mono">({siteContact.phoneStatus})</span>
          </div>
          <span className="text-neutral-300 dark:text-neutral-700">•</span>
          <div className="inline-flex items-center gap-1">
            <span className="text-neutral-600 dark:text-neutral-300">Email:</span>
            <a
              href={siteContact.emailLink}
              aria-label={siteContact.emailAccessibleLabel}
              className="font-medium text-black dark:text-white underline hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
            >
              {siteContact.email}
            </a>
            <span className="text-[10px] text-neutral-500 font-mono">({siteContact.emailStatus})</span>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className={`space-y-2 text-xs text-neutral-600 dark:text-neutral-400 ${className}`}>
        <div className="font-serif font-bold text-neutral-950 dark:text-neutral-100 text-sm">
          {siteContact.attorneyName}
        </div>
        <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
          {siteContact.developerAttribution}
        </div>

        <div className="space-y-1 pt-1">
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
            <span className="font-medium text-neutral-800 dark:text-neutral-200">Contact Us:</span>
            <a
              href={siteContact.phoneLink}
              aria-label={siteContact.phoneAccessibleLabel}
              className="font-medium text-black dark:text-white hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black dark:focus-visible:outline-white"
            >
              {siteContact.phoneDisplay}
            </a>
            <span className="text-[10px] text-neutral-500 font-mono">
              — {siteContact.phoneStatus}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
            <span className="font-medium text-neutral-800 dark:text-neutral-200">Email:</span>
            <a
              href={siteContact.emailLink}
              aria-label={siteContact.emailAccessibleLabel}
              className="font-medium text-black dark:text-white hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black dark:focus-visible:outline-white"
            >
              {siteContact.email}
            </a>
            <span className="text-[10px] text-neutral-500 font-mono">
              — {siteContact.emailStatus}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Standard & Card variants
  return (
    <div
      className={`${
        variant === 'card'
          ? 'border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-5 sm:p-6 shadow-xs'
          : 'space-y-3'
      } ${className}`}
    >
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-neutral-700 dark:text-neutral-300" aria-hidden="true" />
          <h3 className="font-serif text-base sm:text-lg font-bold text-neutral-950 dark:text-neutral-50 tracking-tight">
            {siteContact.attorneyName}
          </h3>
        </div>
        <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400 pl-6">
          <Code2 className="h-3.5 w-3.5 text-neutral-400" aria-hidden="true" />
          <span>{siteContact.developerAttribution}</span>
        </div>
      </div>

      <div className="border-t border-neutral-200 dark:border-neutral-800 pt-3 space-y-2.5 text-xs">
        {/* Contact Number */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-2 bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-700/80">
          <div className="flex items-center gap-2">
            <Phone className="h-3.5 w-3.5 text-neutral-600 dark:text-neutral-400 shrink-0" aria-hidden="true" />
            <span className="text-neutral-600 dark:text-neutral-300">Contact Us:</span>
            <a
              href={siteContact.phoneLink}
              aria-label={siteContact.phoneAccessibleLabel}
              className="font-mono font-semibold text-black dark:text-white hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black dark:focus-visible:outline-white"
            >
              {siteContact.phoneDisplay}
            </a>
          </div>
          <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-mono border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400">
            {siteContact.phoneStatus}
          </span>
        </div>

        {/* Email Address */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-2 bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-700/80">
          <div className="flex items-center gap-2">
            <Mail className="h-3.5 w-3.5 text-neutral-600 dark:text-neutral-400 shrink-0" aria-hidden="true" />
            <span className="text-neutral-600 dark:text-neutral-300">Email:</span>
            <a
              href={siteContact.emailLink}
              aria-label={siteContact.emailAccessibleLabel}
              className="font-mono font-semibold text-black dark:text-white hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black dark:focus-visible:outline-white"
            >
              {siteContact.email}
            </a>
          </div>
          <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-mono border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400">
            {siteContact.emailStatus}
          </span>
        </div>

        {showOfficeStatus && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px] text-neutral-500 dark:text-neutral-400">
            <div>
              <span className="font-semibold text-neutral-700 dark:text-neutral-300">Office Address:</span>{' '}
              <span className="italic">{siteContact.officeAddress}</span>
            </div>
            <div>
              <span className="font-semibold text-neutral-700 dark:text-neutral-300">Office Hours:</span>{' '}
              <span className="italic">{siteContact.officeHours}</span>
            </div>
          </div>
        )}

        {showTemporaryNote && (
          <div className="flex items-start gap-1.5 pt-1 text-[11px] text-neutral-500 dark:text-neutral-400">
            <ShieldAlert className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
            <span>These are temporary contact details and may be updated later.</span>
          </div>
        )}
      </div>
    </div>
  );
};
