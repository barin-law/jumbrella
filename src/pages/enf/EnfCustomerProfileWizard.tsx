import React, { useState } from 'react';
import {
  User,
  Building,
  Award,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Save,
  Briefcase,
  Shield,
  FileCheck2,
  Check,
} from 'lucide-react';
import { EnfStorageService } from '../../services/enf/enfStorageService';
import { ENFCustomerProfile } from '../../types/enf';

interface EnfCustomerProfileWizardProps {
  onNavigate: (path: string) => void;
  userId?: string;
}

export const EnfCustomerProfileWizard: React.FC<EnfCustomerProfileWizardProps> = ({
  onNavigate,
  userId = 'demo-enf-owner-1',
}) => {
  const [profile, setProfile] = useState<ENFCustomerProfile>(() =>
    EnfStorageService.getProfile(userId)
  );
  const [step, setStep] = useState<number>(profile.onboardingStep || 1);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const PRACTICE_AREA_OPTIONS = [
    'Electronic Notarization',
    'Corporate & Securities',
    'Real Estate & Conveyancing',
    'Banking, Finance & Fintech',
    'Labor & Employment',
    'Litigation & Dispute Resolution',
    'Estate Planning & Probate',
    'Government & Public Utilities',
  ];

  const SERVICE_OPTIONS = [
    'Remote Videoconference Notarization',
    'Corporate Secretary Batch Filings',
    'Credible Witness Remote Affirmation',
    'Rule 7 Electronic Register Auto-Escrow',
    'Court Auditor Forensic Audit Packet',
    'AI-Assisted Legal Citation Grounding',
  ];

  const handleTogglePractice = (area: string) => {
    setProfile((prev) => {
      const exists = prev.practiceAreas.includes(area);
      const next = exists ? prev.practiceAreas.filter((a) => a !== area) : [...prev.practiceAreas, area];
      return { ...prev, practiceAreas: next };
    });
  };

  const handleToggleService = (srv: string) => {
    setProfile((prev) => {
      const exists = prev.selectedServices.includes(srv);
      const next = exists ? prev.selectedServices.filter((s) => s !== srv) : [...prev.selectedServices, srv];
      return { ...prev, selectedServices: next };
    });
  };

  const handleSaveAndNext = (e: React.FormEvent) => {
    e.preventDefault();
    const nextStep = Math.min(4, step + 1);
    const updated = {
      ...profile,
      onboardingStep: Math.max(profile.onboardingStep, nextStep),
      onboardingCompleted: nextStep === 4,
    };
    EnfStorageService.updateProfile(updated);
    setProfile(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);

    if (step < 4) {
      setStep(nextStep);
    } else {
      onNavigate('/enf/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7F9] text-[#17212B] font-sans antialiased py-6 sm:py-10">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between border-b border-[#D9E1E8] pb-5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('/enf/dashboard')}
              className="text-xs font-semibold text-[#0078CE] hover:underline cursor-pointer"
            >
              ← Back to Dashboard
            </button>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-bold text-[#002D5B]">ENF Customer Profile Wizard</span>
          </div>

          <span className="text-xs font-mono font-bold text-[#002D5B] bg-white px-2.5 py-1 rounded-md border border-[#D9E1E8]">
            Step {step} of 4
          </span>
        </div>

        {savedSuccess && (
          <div className="rounded-xl border border-[#2EAF4A]/40 bg-[#2EAF4A]/10 p-3 text-xs text-[#1B6C2E] flex items-center gap-2 font-bold shadow-xs">
            <CheckCircle2 className="h-4 w-4 text-[#2EAF4A]" />
            <span>Profile section successfully saved.</span>
          </div>
        )}

        {/* Wizard Progress Bar */}
        <div className="grid grid-cols-4 gap-2 bg-white p-2 rounded-xl border border-[#D9E1E8] shadow-2xs text-center text-xs font-bold">
          <button
            onClick={() => setStep(1)}
            className={`py-2 rounded-lg cursor-pointer transition-colors ${
              step === 1 ? 'bg-[#002D5B] text-white' : 'text-slate-500'
            }`}
          >
            1. Personal & Contact
          </button>
          <button
            onClick={() => setStep(2)}
            className={`py-2 rounded-lg cursor-pointer transition-colors ${
              step === 2 ? 'bg-[#002D5B] text-white' : 'text-slate-500'
            }`}
          >
            2. Professional & IBP
          </button>
          <button
            onClick={() => setStep(3)}
            className={`py-2 rounded-lg cursor-pointer transition-colors ${
              step === 3 ? 'bg-[#002D5B] text-white' : 'text-slate-500'
            }`}
          >
            3. Office & Practice
          </button>
          <button
            onClick={() => setStep(4)}
            className={`py-2 rounded-lg cursor-pointer transition-colors ${
              step === 4 ? 'bg-[#002D5B] text-white' : 'text-slate-500'
            }`}
          >
            4. Services & Usage
          </button>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSaveAndNext} className="rounded-2xl border border-[#D9E1E8] bg-white p-6 sm:p-8 shadow-xs space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-base font-bold text-[#002D5B]">1. Personal & Contact Information</h2>
                <p className="text-xs text-slate-500">Official contact records for the commissioning notary or authorized administrator.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#002D5B] mb-1">Full Legal Name *</label>
                  <input
                    type="text"
                    required
                    value={profile.fullName}
                    onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                    className="w-full rounded-lg border border-[#D9E1E8] p-2.5 text-xs text-[#17212B] focus:border-[#0078CE] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#002D5B] mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full rounded-lg border border-[#D9E1E8] p-2.5 text-xs text-[#17212B] focus:border-[#0078CE] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#002D5B] mb-1">Direct Phone / Mobile *</label>
                  <input
                    type="tel"
                    required
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full rounded-lg border border-[#D9E1E8] p-2.5 text-xs text-[#17212B] focus:border-[#0078CE] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#002D5B] mb-1">Organization / Firm Entity</label>
                  <input
                    type="text"
                    value={profile.organizationName || ''}
                    onChange={(e) => setProfile({ ...profile, organizationName: e.target.value })}
                    placeholder="e.g. Santos & Partners Law Offices"
                    className="w-full rounded-lg border border-[#D9E1E8] p-2.5 text-xs text-[#17212B] focus:border-[#0078CE] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-base font-bold text-[#002D5B]">2. Professional & IBP Accreditation Information</h2>
                <p className="text-xs text-slate-500">Statutory credentials under the 2004 Rules on Notarial Practice and Supreme Court A.M. 24-10-14-SC.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#002D5B] mb-1">Roll of Attorneys Number *</label>
                  <input
                    type="text"
                    required
                    value={profile.rollNumber || ''}
                    onChange={(e) => setProfile({ ...profile, rollNumber: e.target.value })}
                    placeholder="e.g. 71829"
                    className="w-full rounded-lg border border-[#D9E1E8] p-2.5 text-xs font-mono focus:border-[#0078CE] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#002D5B] mb-1">IBP Chapter *</label>
                  <input
                    type="text"
                    required
                    value={profile.ibpChapter || ''}
                    onChange={(e) => setProfile({ ...profile, ibpChapter: e.target.value })}
                    placeholder="e.g. Makati City Chapter"
                    className="w-full rounded-lg border border-[#D9E1E8] p-2.5 text-xs focus:border-[#0078CE] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#002D5B] mb-1">Notarial Commission Number</label>
                  <input
                    type="text"
                    value={profile.commissionNumber || ''}
                    onChange={(e) => setProfile({ ...profile, commissionNumber: e.target.value })}
                    placeholder="e.g. NP-2026-0814-MKT"
                    className="w-full rounded-lg border border-[#D9E1E8] p-2.5 text-xs font-mono focus:border-[#0078CE] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#002D5B] mb-1">Commissioned Territorial Jurisdiction</label>
                  <input
                    type="text"
                    value={profile.jurisdictionCity || ''}
                    onChange={(e) => setProfile({ ...profile, jurisdictionCity: e.target.value })}
                    placeholder="e.g. Makati City & Pasay City"
                    className="w-full rounded-lg border border-[#D9E1E8] p-2.5 text-xs focus:border-[#0078CE] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-base font-bold text-[#002D5B]">3. Office Address & Practice Areas</h2>
                <p className="text-xs text-slate-500">Physical office details for statutory presence requirements (Rule 4, Section 2).</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#002D5B] mb-1">Physical Office Address *</label>
                  <textarea
                    rows={2}
                    required
                    value={profile.officeAddress}
                    onChange={(e) => setProfile({ ...profile, officeAddress: e.target.value })}
                    placeholder="Unit / Floor, Building Name, Street, Barangay, City"
                    className="w-full rounded-lg border border-[#D9E1E8] p-2.5 text-xs focus:border-[#0078CE] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#002D5B] mb-2">Practice Specialties:</label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {PRACTICE_AREA_OPTIONS.map((area) => {
                      const selected = profile.practiceAreas.includes(area);
                      return (
                        <div
                          key={area}
                          onClick={() => handleTogglePractice(area)}
                          className={`p-2.5 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                            selected
                              ? 'border-[#0078CE] bg-[#0078CE]/10 font-bold text-[#002D5B]'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <span>{area}</span>
                          {selected && <Check className="h-3.5 w-3.5 text-[#0078CE]" />}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-base font-bold text-[#002D5B]">4. Expected Volume & Selected Facility Services</h2>
                <p className="text-xs text-slate-500">Helps JuriMbrella allocate dedicated server-authoritative resources.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#002D5B] mb-1">Expected Monthly Notarizations</label>
                  <select
                    value={profile.expectedMonthlyNotarizations}
                    onChange={(e) => setProfile({ ...profile, expectedMonthlyNotarizations: e.target.value })}
                    className="w-full rounded-lg border border-[#D9E1E8] p-2.5 text-xs focus:border-[#0078CE] focus:outline-none"
                  >
                    <option value="20 to 50 documents / month">20 to 50 instruments / month</option>
                    <option value="50 to 100 documents / month">50 to 100 instruments / month</option>
                    <option value="100 to 250 documents / month">100 to 250 instruments / month</option>
                    <option value="250 to 1000+ documents / month">250 to 1000+ instruments / month</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#002D5B] mb-1">Legal & Administrative Staff Team Size</label>
                  <select
                    value={profile.teamSize}
                    onChange={(e) => setProfile({ ...profile, teamSize: e.target.value })}
                    className="w-full rounded-lg border border-[#D9E1E8] p-2.5 text-xs focus:border-[#0078CE] focus:outline-none"
                  >
                    <option value="Solo Practitioner">Solo Practitioner</option>
                    <option value="2 to 5 staff members">2 to 5 staff members</option>
                    <option value="5 to 10 legal & administrative personnel">5 to 10 personnel</option>
                    <option value="10+ enterprise legal department">10+ enterprise legal department</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <label className="block text-xs font-bold text-[#002D5B]">Desired Platform Features:</label>
                <div className="space-y-2">
                  {SERVICE_OPTIONS.map((srv) => {
                    const checked = profile.selectedServices.includes(srv);
                    return (
                      <label key={srv} className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => handleToggleService(srv)}
                          className="rounded text-[#002D5B] focus:ring-[#0078CE]"
                        />
                        <span className={checked ? 'font-bold text-[#002D5B]' : ''}>{srv}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Wizard Footer Controls */}
          <div className="flex items-center justify-between border-t border-slate-100 pt-4">
            <button
              type="button"
              disabled={step === 1}
              onClick={() => setStep((prev) => Math.max(1, prev - 1))}
              className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer disabled:opacity-40"
            >
              Previous
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg bg-[#002D5B] text-xs font-bold text-white hover:bg-[#0078CE] transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <span>{step === 4 ? 'Save Profile & Return to Dashboard' : 'Save & Continue'}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
