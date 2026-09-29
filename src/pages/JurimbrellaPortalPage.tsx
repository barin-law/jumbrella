import React, { useState } from 'react';
import { BrandLogo, BrandMark } from '../components/common/BrandLogo';
import {
  Menu,
  X,
  MessageSquare,
  ShieldCheck,
  FileCheck2,
  Lock,
  ArrowRight,
} from 'lucide-react';
import { JurimbrellaAssistantWorkspace } from '../components/jurimbrella-assistant/JurimbrellaAssistantWorkspace';
import { GlobalFooter } from '../components/common/GlobalFooter';
import { SupportModal } from '../components/common/SupportModal';
import { ContactInformation } from '../components/common/ContactInformation';
import { ContactForm } from '../components/common/ContactForm';

interface JurimbrellaPortalPageProps {
  onNavigate?: (path: string) => void;
}

export const JurimbrellaPortalPage: React.FC<JurimbrellaPortalPageProps> = ({
  onNavigate,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);

  const handleNav = (path: string) => {
    setIsMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(path);
    } else {
      window.history.pushState({}, '', path);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  const scrollToAssistant = () => {
    const el = document.getElementById('jurimbrella-assistant-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToSection = (sectionId: string) => {
    setIsMobileMenuOpen(false);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      id="jurimbrella-portal-page"
      className="min-h-screen bg-[#F4F7F9] text-[#17212B] selection:bg-[#002D5B] selection:text-white font-sans antialiased"
    >
      {/* 1. Header */}
      <header className="sticky top-0 z-40 border-b border-[#D9E1E8] bg-white/95 backdrop-blur-xs shadow-xs">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div
            onClick={() => scrollToSection('top-intro')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <BrandLogo
              variant="compact"
              height={38}
              priority
              alt="JuriMbrella Philippine eNotarization"
            />
          </div>

          {/* Right Navigation (Desktop) */}
          <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-6 text-xs font-medium">
            <button
              onClick={() => handleNav('/')}
              className="text-slate-600 hover:text-[#002D5B] transition-colors"
            >
              Public Home
            </button>
            <button
              onClick={() => scrollToSection('about-section')}
              className="text-slate-600 hover:text-[#002D5B] transition-colors"
            >
              Platform Overview
            </button>
            <button
              onClick={scrollToAssistant}
              className="text-slate-600 hover:text-[#002D5B] transition-colors"
            >
              Assistant
            </button>
            <button
              onClick={() => scrollToSection('contact-section')}
              className="text-slate-600 hover:text-[#002D5B] transition-colors"
            >
              Contact Desk
            </button>
            <button
              onClick={() => handleNav('/sign-in')}
              className="rounded-lg bg-[#002D5B] px-4 py-2 text-white hover:bg-[#0078CE] transition-all font-semibold shadow-xs cursor-pointer"
            >
              Sign In
            </button>
          </nav>

          {/* Mobile menu trigger */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#D9E1E8] md:hidden cursor-pointer"
          >
            {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>

        {/* Mobile Dropdown Navigation */}
        {isMobileMenuOpen && (
          <div className="border-b border-[#D9E1E8] bg-white px-4 py-3 md:hidden space-y-2 text-xs">
            <button
              onClick={() => handleNav('/')}
              className="block w-full text-left py-1.5 text-slate-700 font-medium"
            >
              Public Home
            </button>
            <button
              onClick={() => scrollToSection('about-section')}
              className="block w-full text-left py-1.5 text-slate-700 font-medium"
            >
              Platform Overview
            </button>
            <button
              onClick={scrollToAssistant}
              className="block w-full text-left py-1.5 text-slate-700 font-medium"
            >
              Assistant
            </button>
            <button
              onClick={() => scrollToSection('contact-section')}
              className="block w-full text-left py-1.5 text-slate-700 font-medium"
            >
              Contact Desk
            </button>
            <div className="pt-2 border-t border-[#D9E1E8]">
              <button
                onClick={() => handleNav('/sign-in')}
                className="w-full rounded-lg bg-[#002D5B] py-2 text-center text-white font-semibold cursor-pointer"
              >
                Sign In
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-10 sm:py-16 space-y-16">
        {/* 2. Main Introduction */}
        <section id="top-intro" className="text-center max-w-3xl mx-auto space-y-6">
          <div className="flex justify-center">
            <BrandMark size={96} />
          </div>

          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 border border-[#2EAF4A]/40 bg-white px-3.5 py-1 text-xs text-[#002D5B] rounded-full shadow-xs">
              <span className="h-2 w-2 rounded-full bg-[#2EAF4A]" />
              <span className="font-bold">PHILIPPINE eNOTARIZATION</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#002D5B] font-sans">
              <span>Juri</span><span className="text-[#2EAF4A]">Mbrella</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-600 font-normal tracking-wide max-w-xl mx-auto leading-relaxed">
              Protection over every signature. Secure, compliant, traceable, and professionally controlled digital notarization workflows.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={scrollToAssistant}
              className="w-full sm:w-auto rounded-lg bg-[#002D5B] px-6 py-3 text-xs font-semibold text-white hover:bg-[#0078CE] transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
            >
              <MessageSquare className="h-4 w-4 text-[#A8E063]" />
              <span>Consult JuriMbrella Assistant</span>
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('contact-section')}
              className="w-full sm:w-auto rounded-lg border border-[#002D5B] bg-white px-6 py-3 text-xs font-semibold text-[#002D5B] hover:bg-[#F4F7F9] transition-all shadow-xs cursor-pointer"
            >
              Contact Support Desk
            </button>
          </div>
        </section>

        {/* 3. About Section */}
        <section
          id="about-section"
          className="bg-white rounded-xl border border-[#D9E1E8] p-8 max-w-3xl mx-auto space-y-4 shadow-xs"
        >
          <div className="flex items-center gap-2 text-xs font-mono text-[#0078CE] uppercase tracking-wider font-bold">
            <ShieldCheck className="h-4 w-4" />
            <span>Platform Overview</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-[#002D5B] font-sans">
            About JuriMbrella Electronic Notarization
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed font-normal">
            JuriMbrella is an institutional Philippine electronic notarization platform engineered in alignment
            with Supreme Court Administrative Matter No. 24-10-14-SC (Rules on Electronic Notarization).
            It provides seamless cryptographic verification, tamper-evident audit logging, and role-segregated
            workflows for Principals, Electronic Notaries Public, and verifying parties.
          </p>
        </section>

        {/* 4. Assistant Section */}
        <section id="jurimbrella-assistant-section" className="space-y-6">
          <div className="max-w-3xl mx-auto text-center sm:text-left space-y-2">
            <div className="inline-flex items-center gap-2 border border-[#2EAF4A]/40 bg-white px-3 py-1 text-xs text-[#002D5B] rounded-full">
              <MessageSquare className="h-3.5 w-3.5 text-[#2EAF4A]" />
              <span className="font-semibold">Interactive Procedural Assistant</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#002D5B] font-sans">
              JuriMbrella Assistant
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              Inquire regarding Philippine statutes, Supreme Court issuances, notarial requirements under
              A.M. No. 24-10-14-SC, or prepare for notarial appearance.
            </p>
          </div>

          <JurimbrellaAssistantWorkspace
            onSignInClick={() => handleNav('/sign-in')}
            onContactAdminClick={() => scrollToSection('contact-section')}
          />
        </section>

        {/* 5. Contact Section */}
        <section
          id="contact-section"
          className="space-y-6 max-w-4xl mx-auto text-left"
        >
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight text-[#002D5B] font-sans">
              Contact JuriMbrella Legal &amp; Administrative Support
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Our administration desk is available for questions regarding platform functionality,
              accreditation alignment, or procedural consultations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
            <div className="space-y-4">
              <ContactInformation />
            </div>

            <div className="border border-[#D9E1E8] bg-white p-6 rounded-xl shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#002D5B] font-mono mb-3">
                Send an Inquiry
              </h3>
              <ContactForm
                onSuccess={() => {}}
                className="space-y-3"
              />
            </div>
          </div>
        </section>
      </main>

      {/* Global Public Footer */}
      <GlobalFooter
        onNavigate={handleNav}
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

export default JurimbrellaPortalPage;
