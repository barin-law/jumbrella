import React, { useState } from 'react';
import { Lock, ShieldCheck } from 'lucide-react';

interface ConsentModalProps {
  isOpen: boolean;
  onAgree: () => void;
  onCancel: () => void;
}

export const ConsentModal: React.FC<ConsentModalProps> = ({
  isOpen,
  onAgree,
  onCancel,
}) => {
  const [agreedDisclaimer, setAgreedDisclaimer] = useState(false);
  const [agreedPrivacy, setAgreedPrivacy] = useState(false);
  const [agreedNoPrivilege, setAgreedNoPrivilege] = useState(false);

  if (!isOpen) return null;

  const canProceed = agreedDisclaimer && agreedPrivacy && agreedNoPrivilege;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="consent-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
    >
      <div className="w-full max-w-lg border border-[#D9E1E8] bg-white p-6 shadow-2xl space-y-5 text-[#17212B] rounded-2xl">
        <div className="flex items-center gap-3 border-b border-[#D9E1E8] pb-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#002D5B] text-[#A8E063]">
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <h2 id="consent-dialog-title" className="text-base font-bold tracking-tight text-[#002D5B] font-sans">
              JuriMbrella Assistant • Terms &amp; Privacy Consent
            </h2>
            <p className="text-xs text-slate-500">
              Required acknowledgement prior to your first legal-information query
            </p>
          </div>
        </div>

        <div className="border border-[#D9E1E8] bg-[#F4F7F9] p-4 text-xs text-slate-700 space-y-2 leading-relaxed rounded-xl">
          <p className="font-semibold text-[#002D5B] flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-[#0078CE]" />
            <span>Notice on Legal Information &amp; Privileged Communications:</span>
          </p>
          <p>
            Using JuriMbrella Assistant does not create an attorney-client relationship. Do not submit
            confidential, privileged, or highly sensitive personal information unless an authorized
            secure client representation channel has been formally confirmed.
          </p>
        </div>

        <div className="space-y-3 text-xs">
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={agreedDisclaimer}
              onChange={(e) => setAgreedDisclaimer(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-[#002D5B]"
            />
            <span className="text-slate-700 leading-relaxed">
              I understand that JuriMbrella Assistant provides general Philippine legal information only,
              which is not a substitute for advice from a licensed lawyer.
            </span>
          </label>

          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={agreedPrivacy}
              onChange={(e) => setAgreedPrivacy(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-[#002D5B]"
            />
            <span className="text-slate-700 leading-relaxed">
              I consent to the processing of my submitted question by the application's configured
              service provider pursuant to R.A. 10173 (Data Privacy Act of 2012).
            </span>
          </label>

          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={agreedNoPrivilege}
              onChange={(e) => setAgreedNoPrivilege(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-[#002D5B]"
            />
            <span className="text-slate-700 leading-relaxed">
              I agree not to submit confidential trade secrets, attorney-client privileged facts, or
              sensitive unredacted personal identifiers.
            </span>
          </label>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#D9E1E8]">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-[#D9E1E8] bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-[#F4F7F9] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!canProceed}
            onClick={onAgree}
            className="rounded-lg bg-[#002D5B] px-5 py-2 text-xs font-semibold text-white hover:bg-[#0078CE] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs cursor-pointer"
          >
            Agree &amp; Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConsentModal;
