import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { VerifyPortal } from '../components/dashboards/VerifyPortal';
import { BrandLogo } from '../components/common/BrandLogo';
import { GlobalFooter } from '../components/common/GlobalFooter';
import { SupportModal } from '../components/common/SupportModal';

interface PublicVerifyPageProps {
  onNavigate: (path: string) => void;
}

export const PublicVerifyPage: React.FC<PublicVerifyPageProps> = ({ onNavigate }) => {
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F4F7F9] text-[#17212B] font-sans antialiased selection:bg-[#002D5B] selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-[#D9E1E8] bg-white/95 backdrop-blur-xs">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div
            onClick={() => onNavigate('/')}
            className="flex items-center gap-3 cursor-pointer select-none"
            title="JuriMbrella — Protection over every signature"
          >
            <BrandLogo
              variant="compact"
              height={38}
              priority
              alt="JuriMbrella Emblem"
              className="shrink-0"
            />
          </div>

          <div className="flex items-center gap-2 sm:gap-5 text-xs font-medium">
            <button
              type="button"
              onClick={() => onNavigate('/')}
              className="text-slate-600 hover:text-[#002D5B] transition-colors hidden sm:inline-block cursor-pointer"
            >
              Public Home
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/jurimbrella-portal')}
              className="text-slate-600 hover:text-[#002D5B] transition-colors hidden md:inline-block cursor-pointer"
            >
              Legal Information
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/contact')}
              className="text-slate-600 hover:text-[#002D5B] transition-colors hidden sm:inline-block cursor-pointer"
            >
              Contact Us
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/sign-in')}
              className="rounded-lg bg-[#002D5B] px-3.5 py-1.5 sm:px-4 sm:py-2 text-white font-semibold hover:bg-[#0078CE] transition-all cursor-pointer shadow-xs text-xs"
            >
              Sign In
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-10 sm:py-16">
        <div className="mb-6">
          <button
            type="button"
            onClick={() => onNavigate('/')}
            className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-black cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return to Public Home</span>
          </button>
        </div>

        <VerifyPortal />
      </main>

      {/* Standardized Global Public Footer */}
      <GlobalFooter
        onNavigate={onNavigate}
        onOpenSupportModal={() => setIsSupportModalOpen(true)}
      />

      {/* Support Modal */}
      <SupportModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
        defaultTopic="verification"
      />
    </div>
  );
};
