import React from 'react';
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldAlert,
  Scale,
  Code2,
  ExternalLink,
} from 'lucide-react';
import { siteContact } from '../config/contactConfig';
import { BrandLogo } from '../components/common/BrandLogo';
import { ContactForm } from '../components/common/ContactForm';
import { GlobalFooter } from '../components/common/GlobalFooter';

interface ContactUsPageProps {
  onNavigate: (path: string) => void;
}

export const ContactUsPage: React.FC<ContactUsPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-black text-neutral-900 dark:text-neutral-100 flex flex-col font-sans selection:bg-neutral-900 selection:text-white dark:selection:bg-white dark:selection:text-black">
      {/* 1. Top Header */}
      <header className="sticky top-0 z-30 border-b border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-black/95 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('/')}
              aria-label="Return to homepage"
              className="flex items-center gap-2.5 text-neutral-900 dark:text-neutral-100 hover:opacity-80 transition-opacity cursor-pointer"
            >
              <BrandLogo
                variant="compact"
                height={34}
                decorative
                className="shrink-0"
              />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('/verify')}
              className="text-xs text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white hidden sm:inline-block cursor-pointer"
            >
              Verify Hash
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/jurimbrella-portal')}
              className="text-xs text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white hidden sm:inline-block cursor-pointer"
            >
              Legal Information
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/sign-in')}
              className="border border-black bg-black px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-neutral-800 dark:border-white dark:bg-white dark:text-black dark:hover:bg-neutral-200 transition-colors cursor-pointer"
            >
              Demo Sign In
            </button>
          </div>
        </div>
      </header>

      {/* 2. Main Content */}
      <main className="flex-1 mx-auto max-w-6xl w-full px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        {/* Navigation Breadcrumb */}
        <div>
          <button
            type="button"
            onClick={() => onNavigate('/')}
            className="inline-flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Return to Public Home</span>
          </button>
        </div>

        {/* Page Banner */}
        <div className="border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-6 sm:p-8 space-y-3">
          <div className="inline-flex items-center gap-1.5 border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
            <Scale className="h-3 w-3" aria-hidden="true" />
            <span>Official Communications Desk</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight text-neutral-950 dark:text-neutral-50">
            Contact JuriMbrella Support &amp; Legal Desk
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-3xl leading-relaxed">
            Reach our administrative and legal assistance desk for inquiries concerning electronic notarization under Supreme Court A.M. No. 24-10-14-SC, consultation scheduling, or technical support assistance.
          </p>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Official Contact Hierarchy & Office Details (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Approved Hierarchy Card */}
            <div className="border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-6 space-y-4 shadow-xs">
              <div>
                <h2 className="font-serif text-xl font-bold text-neutral-950 dark:text-neutral-50">
                  {siteContact.attorneyName}
                </h2>
                <div className="flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                  <Code2 className="h-3.5 w-3.5 text-neutral-500" aria-hidden="true" />
                  <span>{siteContact.developerAttribution}</span>
                </div>
              </div>

              <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4 space-y-3">
                {/* Telephone */}
                <div className="p-3 border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50 space-y-1">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-neutral-600 dark:text-neutral-400" aria-hidden="true" />
                    <span className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">Contact Us:</span>
                    <a
                      href={siteContact.phoneLink}
                      aria-label={siteContact.phoneAccessibleLabel}
                      className="text-xs font-mono font-bold text-black dark:text-white hover:underline"
                    >
                      {siteContact.phoneDisplay}
                    </a>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-500 block pl-6">
                    Status: {siteContact.phoneStatus}
                  </span>
                </div>

                {/* Email */}
                <div className="p-3 border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50 space-y-1">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-neutral-600 dark:text-neutral-400" aria-hidden="true" />
                    <span className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">Email:</span>
                    <a
                      href={siteContact.emailLink}
                      aria-label={siteContact.emailAccessibleLabel}
                      className="text-xs font-mono font-bold text-black dark:text-white hover:underline"
                    >
                      {siteContact.email}
                    </a>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-500 block pl-6">
                    Status: {siteContact.emailStatus}
                  </span>
                </div>
              </div>

              {/* Action Buttons for Mobile & Desktop */}
              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <a
                  href={siteContact.phoneLink}
                  aria-label={siteContact.phoneAccessibleLabel}
                  className="flex-1 inline-flex items-center justify-center gap-2 border border-black bg-black px-4 py-2.5 text-xs font-semibold text-white hover:bg-neutral-800 dark:border-white dark:bg-white dark:text-black dark:hover:bg-neutral-200 transition-colors"
                >
                  <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Call Temporary Number</span>
                </a>
                <a
                  href={siteContact.emailLink}
                  aria-label={siteContact.emailAccessibleLabel}
                  className="flex-1 inline-flex items-center justify-center gap-2 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-2.5 text-xs font-semibold text-neutral-800 dark:text-neutral-200 hover:border-black transition-colors"
                >
                  <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Email Administrator</span>
                </a>
              </div>
            </div>

            {/* Office & Verification Status (Strictly unverified markers per instruction) */}
            <div className="border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-6 space-y-3.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
                Facility Directory &amp; Schedule
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-2.5">
                  <MapPin className="h-4 w-4 text-neutral-500 shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                      Physical Office Address:
                    </span>
                    <p className="text-neutral-600 dark:text-neutral-400 italic mt-0.5">
                      {siteContact.officeAddress}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Clock className="h-4 w-4 text-neutral-500 shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                      Official Operating Hours:
                    </span>
                    <p className="text-neutral-600 dark:text-neutral-400 italic mt-0.5">
                      {siteContact.officeHours}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 text-[11px] text-neutral-500 leading-relaxed">
                In strict compliance with Philippine Supreme Court directives, no unconfirmed Bar roll numbers, PTR registrations, or unverified physical premises are published.
              </div>
            </div>

            {/* Legal Notice */}
            <div className="border border-amber-300 dark:border-amber-800/60 bg-amber-50 dark:bg-amber-950/30 p-4 text-xs text-amber-950 dark:text-amber-200 space-y-2">
              <div className="flex items-center gap-1.5 font-bold">
                <ShieldAlert className="h-4 w-4 text-amber-700 dark:text-amber-400 shrink-0" aria-hidden="true" />
                <span>Notice Concerning Attorney-Client Privilege</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                {siteContact.disclaimerNotice}
              </p>
            </div>
          </div>

          {/* Right Column: Interactive Working Contact Form (7 cols) */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>
      </main>

      {/* 3. Standardized Global Footer */}
      <GlobalFooter onNavigate={onNavigate} />
    </div>
  );
};
