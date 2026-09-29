import React, { useState } from 'react';
import {
  Compass,
  Palette,
  FileCheck2,
  Sliders,
  Shield,
  Upload,
  CheckCircle2,
  ExternalLink,
  Eye,
  Save,
  ArrowRight,
  ArrowLeft,
  Lock,
} from 'lucide-react';
import { EnfStorageService } from '../../services/enf/enfStorageService';
import { ENFConfiguration } from '../../types/enf';
import { BrandLogo } from '../../components/common/BrandLogo';

interface EnfBuilderViewProps {
  onNavigate: (path: string) => void;
  userId?: string;
}

export const EnfBuilderView: React.FC<EnfBuilderViewProps> = ({
  onNavigate,
  userId = 'demo-enf-owner-1',
}) => {
  const [config, setConfig] = useState<ENFConfiguration>(() =>
    EnfStorageService.getENFConfig(userId)
  );
  const [savedNotification, setSavedNotification] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(1);

  const COLOR_PALETTES = [
    { name: 'JuriMbrella Official (Deep Blue & Emerald)', primary: '#002D5B', secondary: '#0078CE', accent: '#2EAF4A' },
    { name: 'Classic Judicial Navy & Gold', primary: '#0A192F', secondary: '#1E3A8A', accent: '#D4AF37' },
    { name: 'Modern Forest & Slate', primary: '#1B4D3E', secondary: '#2EAF4A', accent: '#A8E063' },
    { name: 'Metro Institutional Charcoal', primary: '#17212B', secondary: '#334155', accent: '#0078CE' },
  ];

  const ALL_NOTARIAL_SERVICES = [
    { id: 'AFFIDAVIT', name: 'General Affidavits & Sworn Declarations' },
    { id: 'DEED_OF_SALE', name: 'Deed of Absolute Sale (Real & Personal Property)' },
    { id: 'SPECIAL_POWER_OF_ATTORNEY', name: 'Special Power of Attorney (SPA)' },
    { id: 'BOARD_RESOLUTION', name: 'Corporate Secretary Certificate & Board Resolutions' },
    { id: 'LOAN_AGREEMENT', name: 'Loan & Chattel Mortgage Agreements' },
    { id: 'CONTRACT_OF_LEASE', name: 'Commercial & Residential Lease Contracts' },
  ];

  const handleToggleService = (serviceId: string) => {
    setConfig((prev) => {
      const exists = prev.allowedServices.includes(serviceId);
      const nextServices = exists
        ? prev.allowedServices.filter((s) => s !== serviceId)
        : [...prev.allowedServices, serviceId];
      return { ...prev, allowedServices: nextServices };
    });
  };

  const handleSave = () => {
    EnfStorageService.saveENFConfig(config);
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#F4F7F9] text-[#17212B] font-sans antialiased py-6 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D9E1E8] pb-5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('/enf/dashboard')}
              className="text-xs font-semibold text-[#0078CE] hover:underline cursor-pointer"
            >
              ← Back to Dashboard
            </button>
            <span className="text-slate-300">/</span>
            <div className="flex items-center gap-2">
              <Compass className="h-4 w-4 text-[#002D5B]" />
              <h1 className="text-base font-bold text-[#002D5B]">CUSTOMIZE MY ENF (Facility Builder)</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className="rounded-lg bg-[#002D5B] px-4 py-2 text-xs font-bold text-white hover:bg-[#0078CE] transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="h-3.5 w-3.5" />
              <span>Save Facility Configuration</span>
            </button>
          </div>
        </div>

        {savedNotification && (
          <div className="rounded-xl border border-[#2EAF4A]/40 bg-[#2EAF4A]/10 p-3 text-xs text-[#1B6C2E] flex items-center gap-2 font-semibold">
            <CheckCircle2 className="h-4 w-4 text-[#2EAF4A]" />
            <span>ENF configuration successfully saved and deployed to edge subdomain.</span>
          </div>
        )}

        {/* Wizard Steps Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-white p-2 rounded-xl border border-[#D9E1E8] shadow-2xs text-xs">
          <button
            onClick={() => setActiveStep(1)}
            className={`p-2.5 rounded-lg font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors ${
              activeStep === 1 ? 'bg-[#002D5B] text-white' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span>1. Practice Identity</span>
          </button>
          <button
            onClick={() => setActiveStep(2)}
            className={`p-2.5 rounded-lg font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors ${
              activeStep === 2 ? 'bg-[#002D5B] text-white' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span>2. Branding & Colors</span>
          </button>
          <button
            onClick={() => setActiveStep(3)}
            className={`p-2.5 rounded-lg font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors ${
              activeStep === 3 ? 'bg-[#002D5B] text-white' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span>3. Workflows & Rules</span>
          </button>
          <button
            onClick={() => setActiveStep(4)}
            className={`p-2.5 rounded-lg font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors ${
              activeStep === 4 ? 'bg-[#002D5B] text-white' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span>4. Live Portal Preview</span>
          </button>
        </div>

        {/* 2-COLUMN LAYOUT: Configuration Form & Live Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Column */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-[#D9E1E8] p-6 shadow-xs space-y-6">
            {activeStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-[#002D5B] border-b border-slate-100 pb-2">
                  Practice Identity & Domain
                </h3>

                <div>
                  <label className="block text-xs font-bold text-[#002D5B] mb-1">
                    Facility Name (Shown to Signers)
                  </label>
                  <input
                    type="text"
                    value={config.facilityName}
                    onChange={(e) => setConfig({ ...config, facilityName: e.target.value })}
                    className="w-full rounded-lg border border-[#D9E1E8] p-2.5 text-xs text-[#17212B] focus:border-[#0078CE] focus:outline-none"
                    placeholder="e.g. Santos Electronic Notarial Facility"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#002D5B] mb-1">
                    Custom Subdomain Slug
                  </label>
                  <div className="flex items-center rounded-lg border border-[#D9E1E8] overflow-hidden">
                    <span className="bg-[#F4F7F9] px-3 py-2.5 text-xs text-slate-500 font-mono border-r border-[#D9E1E8]">
                      https://
                    </span>
                    <input
                      type="text"
                      value={config.domainSlug}
                      onChange={(e) => setConfig({ ...config, domainSlug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                      className="flex-1 p-2.5 text-xs font-mono text-[#002D5B] focus:outline-none"
                    />
                    <span className="bg-[#F4F7F9] px-3 py-2.5 text-xs text-slate-500 font-mono border-l border-[#D9E1E8]">
                      .enf.jurimbrella.ph
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Clients access your dedicated queue through this secured link.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#002D5B] mb-1">
                    Document Header Banner Text
                  </label>
                  <input
                    type="text"
                    value={config.documentHeaderTemplate}
                    onChange={(e) => setConfig({ ...config, documentHeaderTemplate: e.target.value })}
                    className="w-full rounded-lg border border-[#D9E1E8] p-2.5 text-xs text-[#17212B] focus:border-[#0078CE] focus:outline-none"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Embedded into the top margin of all executed notarial certificates.
                  </p>
                </div>
              </div>
            )}

            {activeStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-[#002D5B] border-b border-slate-100 pb-2">
                  Brand Colors & Visual Identity
                </h3>

                <p className="text-xs text-slate-500">
                  Select a pre-designed corporate palette or customize hex colors:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {COLOR_PALETTES.map((pal, idx) => (
                    <div
                      key={idx}
                      onClick={() =>
                        setConfig({
                          ...config,
                          primaryColor: pal.primary,
                          secondaryColor: pal.secondary,
                          accentColor: pal.accent,
                        })
                      }
                      className="rounded-xl border border-[#D9E1E8] p-3 cursor-pointer hover:border-[#0078CE] transition-all space-y-2 bg-[#F4F7F9]"
                    >
                      <p className="text-xs font-bold text-[#002D5B]">{pal.name}</p>
                      <div className="flex gap-2">
                        <div className="h-6 flex-1 rounded" style={{ backgroundColor: pal.primary }} />
                        <div className="h-6 flex-1 rounded" style={{ backgroundColor: pal.secondary }} />
                        <div className="h-6 flex-1 rounded" style={{ backgroundColor: pal.accent }} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div>
                    <label className="block text-[11px] font-bold text-[#002D5B] mb-1">Primary Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={config.primaryColor}
                        onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
                        className="h-8 w-8 rounded border border-slate-200 cursor-pointer"
                      />
                      <span className="font-mono text-xs">{config.primaryColor}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#002D5B] mb-1">Secondary Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={config.secondaryColor}
                        onChange={(e) => setConfig({ ...config, secondaryColor: e.target.value })}
                        className="h-8 w-8 rounded border border-slate-200 cursor-pointer"
                      />
                      <span className="font-mono text-xs">{config.secondaryColor}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#002D5B] mb-1">Accent Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={config.accentColor}
                        onChange={(e) => setConfig({ ...config, accentColor: e.target.value })}
                        className="h-8 w-8 rounded border border-slate-200 cursor-pointer"
                      />
                      <span className="font-mono text-xs">{config.accentColor}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeStep === 3 && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-[#002D5B] border-b border-slate-100 pb-2">
                  Services & Workflow Security Rules
                </h3>

                <div>
                  <p className="text-xs font-bold text-[#002D5B] mb-2">
                    Instruments Permitted for Online Submission:
                  </p>
                  <div className="space-y-2">
                    {ALL_NOTARIAL_SERVICES.map((srv) => {
                      const isAllowed = config.allowedServices.includes(srv.id);
                      return (
                        <label
                          key={srv.id}
                          className="flex items-center gap-3 p-2.5 rounded-lg border border-[#D9E1E8] hover:bg-slate-50 cursor-pointer text-xs"
                        >
                          <input
                            type="checkbox"
                            checked={isAllowed}
                            onChange={() => handleToggleService(srv.id)}
                            className="rounded text-[#002D5B] focus:ring-[#0078CE]"
                          />
                          <span className="font-medium text-slate-800">{srv.name}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-3 space-y-2">
                  <p className="text-xs font-bold text-[#002D5B]">Security & Notification Rules:</p>
                  <label className="flex items-center gap-3 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.twoFactorRequiredForClients}
                      onChange={(e) => setConfig({ ...config, twoFactorRequiredForClients: e.target.checked })}
                      className="rounded"
                    />
                    <span>Require 2FA SMS / Email OTP for external signers</span>
                  </label>
                  <label className="flex items-center gap-3 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.emailAlertsEnabled}
                      onChange={(e) => setConfig({ ...config, emailAlertsEnabled: e.target.checked })}
                      className="rounded"
                    />
                    <span>Send automatic email notifications to signers upon document seal</span>
                  </label>
                </div>
              </div>
            )}

            {activeStep === 4 && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-[#002D5B] border-b border-slate-100 pb-2">
                  Ready to Deploy Facility
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Your customized Electronic Notarial Facility has been compiled and is ready for client intake under Supreme Court A.M. No. 24-10-14-SC rules.
                </p>

                <div className="rounded-xl border border-[#2EAF4A]/40 bg-[#2EAF4A]/10 p-4 space-y-2 text-xs">
                  <p className="font-bold text-[#1B6C2E]">Live Subdomain Deployment Endpoint:</p>
                  <p className="font-mono text-xs text-[#002D5B]">
                    https://{config.domainSlug}.enf.jurimbrella.ph
                  </p>
                </div>

                <button
                  onClick={handleSave}
                  className="w-full rounded-xl bg-[#002D5B] py-3 text-xs font-bold text-white hover:bg-[#0078CE] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Save className="h-4 w-4" />
                  <span>Save & Push All Changes to Live Portal</span>
                </button>
              </div>
            )}

            {/* Stepper Footer Buttons */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-4">
              <button
                type="button"
                disabled={activeStep === 1}
                onClick={() => setActiveStep((prev) => Math.max(1, prev - 1))}
                className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer disabled:opacity-40"
              >
                Previous Step
              </button>

              <button
                type="button"
                disabled={activeStep === 4}
                onClick={() => setActiveStep((prev) => Math.min(4, prev + 1))}
                className="px-4 py-2 rounded-lg bg-[#0078CE] text-xs font-bold text-white hover:bg-[#0060A8] cursor-pointer disabled:opacity-40"
              >
                Next Step →
              </button>
            </div>
          </div>

          {/* Right Column: Live Interactive Portal Preview */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#002D5B] uppercase tracking-wider flex items-center gap-1.5">
                <Eye className="h-3.5 w-3.5 text-[#0078CE]" />
                <span>Live Client View Preview</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400">Desktop & Mobile Frame</span>
            </div>

            {/* Browser Mockup Window */}
            <div className="rounded-2xl border-2 border-[#D9E1E8] bg-white shadow-xl overflow-hidden">
              {/* Fake Browser Toolbar */}
              <div className="bg-slate-100 px-3 py-2 border-b border-slate-200 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                  <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </div>
                <div className="flex-1 bg-white rounded-md px-2 py-0.5 text-[10px] font-mono text-slate-500 border border-slate-200 truncate">
                  https://{config.domainSlug}.enf.jurimbrella.ph
                </div>
              </div>

              {/* Rendered Custom ENF Portal */}
              <div className="p-5 space-y-5" style={{ color: config.primaryColor }}>
                {/* Header */}
                <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: `${config.secondaryColor}30` }}>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-8 w-8 rounded-lg text-white flex items-center justify-center font-bold text-xs shadow-xs"
                      style={{ backgroundColor: config.primaryColor }}
                    >
                      {config.facilityName.slice(0, 2).toUpperCase() || 'EN'}
                    </div>
                    <div>
                      <p className="text-xs font-bold leading-tight" style={{ color: config.primaryColor }}>
                        {config.facilityName}
                      </p>
                      <p className="text-[9px] text-slate-400">Electronic Notarial Facility</p>
                    </div>
                  </div>
                  <span
                    className="rounded px-2 py-0.5 text-[9px] font-bold text-white"
                    style={{ backgroundColor: config.accentColor }}
                  >
                    Online
                  </span>
                </div>

                {/* Banner */}
                <div
                  className="rounded-xl p-4 text-white space-y-2 shadow-xs"
                  style={{
                    background: `linear-gradient(135deg, ${config.primaryColor} 0%, ${config.secondaryColor} 100%)`,
                  }}
                >
                  <p className="text-[10px] font-bold uppercase tracking-wider text-white/80">
                    Supreme Court A.M. 24-10-14-SC Compliant
                  </p>
                  <h4 className="text-sm font-extrabold font-sans">
                    Submit Instrument for Electronic Notarization
                  </h4>
                  <p className="text-[10px] text-white/80 leading-relaxed">
                    Verify government ID, sign electronically, and join your scheduled notarial videoconference hearing.
                  </p>
                </div>

                {/* Document Header Template Preview */}
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-[10px] text-slate-600 font-mono">
                  <p className="font-bold text-slate-800 uppercase text-[9px] mb-0.5">Document Seal Header:</p>
                  <p>{config.documentHeaderTemplate}</p>
                </div>

                {/* Service Selection Mockup */}
                <div className="space-y-1.5">
                  <p className="text-[10px] font-bold text-slate-500 uppercase">Available Online Instruments:</p>
                  <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                    {config.allowedServices.slice(0, 4).map((s) => (
                      <div key={s} className="rounded border border-slate-200 p-1.5 bg-white truncate">
                        ✓ {s.replace(/_/g, ' ')}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <button
                  type="button"
                  className="w-full rounded-lg py-2.5 text-xs font-bold text-white shadow-xs cursor-default"
                  style={{ backgroundColor: config.primaryColor }}
                >
                  Start Electronic Notarization Filing
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
