import React, { useEffect, useState, useRef } from 'react';
import { X, Headphones, Phone, Mail, FileText, ArrowRight, ShieldCheck } from 'lucide-react';
import { siteContact } from '../../config/contactConfig';
import { ContactInformation } from './ContactInformation';
import { ContactForm } from './ContactForm';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCategory?: string;
  contextMessage?: string;
}

export const SupportModal: React.FC<SupportModalProps> = ({
  isOpen,
  onClose,
  defaultCategory = 'Electronic Notarization Assistance',
  contextMessage,
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'form'>('info');
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="support-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        ref={modalRef}
        className="relative flex max-h-[90vh] w-full max-w-2xl flex-col border border-black dark:border-white bg-white dark:bg-black text-black dark:text-white shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center border border-black bg-black text-white dark:border-white dark:bg-white dark:text-black">
              <Headphones className="h-4 w-4" />
            </div>
            <div>
              <h2 id="support-modal-title" className="text-base font-bold tracking-tight">
                Administrator Support &amp; Contact Desk
              </h2>
              <p className="text-[11px] text-neutral-500 font-mono">
                Candidate Environment • Supreme Court A.M. No. 24-10-14-SC
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close support dialog"
            className="flex h-8 w-8 items-center justify-center border border-black/20 hover:bg-neutral-100 dark:border-white/20 dark:hover:bg-neutral-900 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-black/10 dark:border-white/10 bg-neutral-50 dark:bg-neutral-950 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('info')}
            className={`flex-1 py-2.5 px-4 text-center font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'info'
                ? 'border-black dark:border-white text-black dark:text-white bg-white dark:bg-black'
                : 'border-transparent text-neutral-500 hover:text-black dark:hover:text-white'
            }`}
          >
            Official Contact Directory
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('form')}
            className={`flex-1 py-2.5 px-4 text-center font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'form'
                ? 'border-black dark:border-white text-black dark:text-white bg-white dark:bg-black'
                : 'border-transparent text-neutral-500 hover:text-black dark:hover:text-white'
            }`}
          >
            Submit Inquiry / Matter Intake
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          {contextMessage && (
            <div className="border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 p-3 text-xs text-neutral-700 dark:text-neutral-300">
              <span className="font-semibold text-neutral-900 dark:text-neutral-100">Workflow Note:</span>{' '}
              {contextMessage}
            </div>
          )}

          {activeTab === 'info' ? (
            <div className="space-y-4">
              <div className="border border-neutral-300 dark:border-neutral-700 p-5 bg-white dark:bg-neutral-900 space-y-4">
                <ContactInformation
                  variant="card"
                  showOfficeStatus={true}
                  showTemporaryNote={true}
                  className="!border-0 !p-0 !shadow-none"
                />

                <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 flex flex-wrap gap-2.5">
                  <a
                    href={siteContact.phoneLink}
                    aria-label={siteContact.phoneAccessibleLabel}
                    className="inline-flex items-center gap-1.5 border border-black bg-black px-4 py-2 text-xs font-semibold text-white hover:bg-neutral-800 dark:border-white dark:bg-white dark:text-black dark:hover:bg-neutral-200"
                  >
                    <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Call Hotline ({siteContact.phoneDisplay})</span>
                  </a>

                  <a
                    href={siteContact.emailLink}
                    aria-label={siteContact.emailAccessibleLabel}
                    className="inline-flex items-center gap-1.5 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-2 text-xs font-semibold text-neutral-800 dark:text-neutral-200 hover:border-black"
                  >
                    <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Email Support ({siteContact.email})</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => setActiveTab('form')}
                    className="inline-flex items-center gap-1.5 border border-neutral-300 dark:border-neutral-700 px-3.5 py-2 text-xs font-semibold hover:border-black dark:hover:border-white cursor-pointer"
                  >
                    <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Open Inquiry Form</span>
                  </button>
                </div>
              </div>

              <div className="border border-neutral-200 dark:border-neutral-800 p-3.5 text-[11px] text-neutral-500 space-y-1">
                <p className="font-semibold text-neutral-700 dark:text-neutral-300">
                  Data Privacy Act Compliance (R.A. 10173):
                </p>
                <p>
                  Inquiries submitted via telephone or email are logged strictly for notarial administrative support, dispute resolution, and regulatory compliance.
                </p>
              </div>
            </div>
          ) : (
            <ContactForm
              defaultCategory={defaultCategory}
              className="!border-0 !p-0 !shadow-none"
            />
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-black/10 dark:border-white/10 px-5 py-3 bg-neutral-50 dark:bg-neutral-950 text-xs">
          <span className="text-[11px] text-neutral-500">
            {siteContact.attorneyName} • {siteContact.developerAttribution}
          </span>
          <button
            onClick={onClose}
            className="border border-black bg-black px-4 py-1.5 text-xs font-semibold text-white hover:bg-neutral-800 dark:border-white dark:bg-white dark:text-black dark:hover:bg-neutral-200 cursor-pointer"
          >
            Close Dialog
          </button>
        </div>
      </div>
    </div>
  );
};
