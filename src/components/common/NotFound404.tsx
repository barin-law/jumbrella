import React, { useState } from 'react';
import { FileQuestion, ArrowLeft, Home, Headphones } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { ErrorSupportMessage } from './ErrorSupportMessage';
import { SupportModal } from './SupportModal';
import { GlobalFooter } from './GlobalFooter';

interface NotFound404Props {
  onNavigate: (path: string) => void;
}

export const NotFound404: React.FC<NotFound404Props> = ({ onNavigate }) => {
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col justify-between font-sans text-neutral-900">
      {/* Header */}
      <header className="border-b border-neutral-200 bg-white px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div
            onClick={() => onNavigate('/')}
            className="flex items-center cursor-pointer select-none"
            title="JuriMbrella Philippine Electronic Notarization"
          >
            <BrandLogo
              variant="compact"
              height={36}
              priority
              alt="JuriMbrella"
              className="max-h-[42px]"
            />
          </div>
          <button
            type="button"
            onClick={() => onNavigate('/')}
            className="text-xs text-neutral-600 hover:text-black font-medium"
          >
            Return to Public Home
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-xl w-full mx-auto px-4 py-12 flex items-center justify-center">
        <div className="w-full border border-neutral-300 bg-white p-6 sm:p-8 shadow-xs space-y-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center border border-neutral-300 bg-neutral-100 text-neutral-700">
            <FileQuestion className="h-7 w-7" />
          </div>

          <div className="space-y-2">
            <span className="border border-neutral-300 bg-neutral-100 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-neutral-600">
              HTTP 404 — Resource Not Found
            </span>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight font-serif text-neutral-950">
              Page Not Found
            </h1>
            <p className="text-xs text-neutral-600 max-w-md mx-auto leading-relaxed">
              The requested URL could not be located on the JuriMbrella Philippine Electronic Notarization system. The document or route may have been relocated, or your link may be invalid.
            </p>
          </div>

          <ErrorSupportMessage
            errorType="general"
            customTitle="Need Assistance Locating a Record or Page?"
            onOpenSupport={() => setIsSupportModalOpen(true)}
          />

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => onNavigate('/')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-black bg-black px-4 py-2 text-xs font-semibold text-white hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <Home className="h-3.5 w-3.5" />
              <span>Public Homepage</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/contact')}
              className="w-full sm:w-auto border border-neutral-300 bg-white px-4 py-2 text-xs font-semibold text-neutral-800 hover:border-black transition-colors cursor-pointer"
            >
              Contact Support
            </button>
          </div>
        </div>
      </main>

      {/* Global Footer */}
      <GlobalFooter
        onNavigate={onNavigate}
        onOpenSupportModal={() => setIsSupportModalOpen(true)}
      />

      {/* Support Modal */}
      <SupportModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
        defaultTopic="general"
      />
    </div>
  );
};
