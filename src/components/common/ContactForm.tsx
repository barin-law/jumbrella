import React, { useState } from 'react';
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  ShieldAlert,
  Clock,
  MapPin,
  RefreshCw,
  FileText,
} from 'lucide-react';
import { siteContact } from '../../config/contactConfig';
import { inquiryService, PreferredContactMethod } from '../../services/inquiryService';

interface ContactFormProps {
  defaultCategory?: string;
  defaultSubject?: string;
  onSuccess?: (referenceNumber: string) => void;
  className?: string;
}

const INQUIRY_CATEGORIES = [
  'General Legal Inquiry',
  'Electronic Notarization Assistance',
  'Account & Profile Verification Support',
  'Document Review & Pre-clearance',
  'Appointment & Videoconference Scheduling',
  'Payment & Judicial Fee Inquiry',
  'Technical Support & Hardware Diagnostics',
  'Data Privacy & R.A. 10173 Request',
  'Other Inquiries',
];

export const ContactForm: React.FC<ContactFormProps> = ({
  defaultCategory = 'General Legal Inquiry',
  defaultSubject = '',
  onSuccess,
  className = '',
}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    preferredMethod: 'EMAIL' as PreferredContactMethod,
    category: defaultCategory,
    subject: defaultSubject,
    message: '',
    consentAgreed: false,
    honeypot: '', // anti-spam hidden field
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{
    referenceNumber: string;
    timestamp: string;
  } | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const maxMessageLength = 3000;

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      errs.fullName = 'Full legal name is required (minimum 2 characters).';
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      errs.email = 'Please provide a valid email address.';
    }

    const cleanedPhone = formData.phone.replace(/[\s\-().]/g, '');
    const phRegex = /^(\+639|09)\d{9}$/;
    const intlRegex = /^\+?[1-9]\d{7,14}$/;
    if (!formData.phone.trim() || (!phRegex.test(cleanedPhone) && !intlRegex.test(cleanedPhone))) {
      errs.phone = 'Valid phone number required (e.g., +63 917 966 8814 or international format).';
    }

    if (!formData.subject.trim() || formData.subject.trim().length < 4) {
      errs.subject = 'Subject line is required (minimum 4 characters).';
    }

    if (!formData.message.trim() || formData.message.trim().length < 10) {
      errs.message = 'Please provide a descriptive message (minimum 10 characters).';
    }

    if (formData.message.length > maxMessageLength) {
      errs.message = `Message exceeds the ${maxMessageLength} character limit.`;
    }

    if (!formData.consentAgreed) {
      errs.consentAgreed = 'You must acknowledge the non-representation and privacy terms.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionError(null);

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate safe client processing and rate limit verification
    try {
      await new Promise((resolve) => setTimeout(resolve, 750));

      const result = inquiryService.submitInquiry({
        senderName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        preferredContactMethod: formData.preferredMethod,
        category: formData.category,
        subject: formData.subject,
        message: formData.message,
        honeypot: formData.honeypot,
      });

      if (!result.success || !result.referenceNumber) {
        setSubmissionError(result.error || 'Failed to submit inquiry. Please try again.');
        setIsSubmitting(false);
        return;
      }

      setSubmissionResult({
        referenceNumber: result.referenceNumber,
        timestamp: new Date().toLocaleString('en-PH', { timeZone: 'Asia/Manila' }),
      });

      if (onSuccess) {
        onSuccess(result.referenceNumber);
      }
    } catch (err) {
      console.error(err);
      setSubmissionError('An unexpected client error occurred while preparing your inquiry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      preferredMethod: 'EMAIL',
      category: defaultCategory,
      subject: '',
      message: '',
      consentAgreed: false,
      honeypot: '',
    });
    setErrors({});
    setSubmissionResult(null);
    setSubmissionError(null);
  };

  return (
    <div
      className={`border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-6 sm:p-8 shadow-xs ${className}`}
    >
      <div className="border-b border-neutral-200 dark:border-neutral-800 pb-4 mb-6">
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-neutral-950 dark:text-neutral-50 tracking-tight">
          Contact Inquiry &amp; Support Intake
        </h2>
        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-1">
          Submit your matter or technical inquiry for official intake review by Supreme Court of the Philippines and administrator support.
        </p>
      </div>

      {/* Office Status & Location Metadata */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 p-3.5 bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 text-xs">
        <div className="flex items-start gap-2">
          <MapPin className="h-4 w-4 text-neutral-500 shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <span className="font-semibold text-neutral-800 dark:text-neutral-200">Office Address:</span>
            <p className="text-neutral-600 dark:text-neutral-400 italic">
              {siteContact.officeAddress}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Clock className="h-4 w-4 text-neutral-500 shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <span className="font-semibold text-neutral-800 dark:text-neutral-200">Office Hours:</span>
            <p className="text-neutral-600 dark:text-neutral-400 italic">
              {siteContact.officeHours}
            </p>
          </div>
        </div>
      </div>

      {submissionResult ? (
        <div className="space-y-5" role="status" aria-live="polite">
          <div className="border border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 p-4 sm:p-5 text-emerald-900 dark:text-emerald-100 space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <h3 className="text-base font-bold">Inquiry Reference Generated</h3>
            </div>
            <p className="text-xs leading-relaxed">
              Your inquiry has been cataloged in the local administration store for demonstration review under Reference Number:
            </p>
            <div className="p-2.5 bg-white dark:bg-neutral-900 border border-emerald-500/50 text-center">
              <span className="font-mono text-lg font-bold tracking-wider text-black dark:text-white">
                {submissionResult.referenceNumber}
              </span>
              <p className="text-[11px] text-neutral-500 mt-0.5">
                Timestamp: {submissionResult.timestamp} PHT
              </p>
            </div>
          </div>

          {/* Explicit Mandated Notice when no external backend/SMTP server is connected */}
          <div className="border border-amber-500 bg-amber-50 dark:bg-amber-950/40 p-4 text-amber-900 dark:text-amber-200 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold">
              <ShieldAlert className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>Direct Hotline &amp; Email Dispatch Required</span>
            </div>
            <p className="leading-relaxed font-medium">
              {siteContact.unconnectedNotice}
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href={siteContact.phoneLink}
                aria-label={siteContact.phoneAccessibleLabel}
                className="inline-flex items-center gap-1.5 border border-black bg-black px-3 py-1.5 text-xs font-semibold text-white hover:bg-neutral-800 dark:border-white dark:bg-white dark:text-black dark:hover:bg-neutral-200"
              >
                <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Call {siteContact.phoneDisplay}</span>
              </a>
              <a
                href={siteContact.emailLink}
                aria-label={siteContact.emailAccessibleLabel}
                className="inline-flex items-center gap-1.5 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-1.5 text-xs font-semibold text-neutral-800 dark:text-neutral-200 hover:border-black"
              >
                <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Email {siteContact.email}</span>
              </a>
            </div>
          </div>

          <div className="pt-3 flex justify-end">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-2 text-xs font-semibold hover:border-black dark:hover:border-white cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Submit Another Inquiry</span>
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {/* Honeypot field (hidden from sight and screen-readers for anti-spam protection) */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor="hp-website-address">Leave this field blank</label>
            <input
              type="text"
              id="hp-website-address"
              name="hp_website_address"
              tabIndex={-1}
              value={formData.honeypot}
              onChange={(e) => setFormData((prev) => ({ ...prev, honeypot: e.target.value }))}
              autoComplete="off"
            />
          </div>

          {submissionError && (
            <div
              role="alert"
              className="border border-red-500 bg-red-50 dark:bg-red-950/40 p-3 text-xs text-red-800 dark:text-red-300 flex items-start gap-2"
            >
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{submissionError}</span>
            </div>
          )}

          {/* Row 1: Category & Preferred Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label
                htmlFor="contact-category"
                className="block text-xs font-semibold text-neutral-800 dark:text-neutral-200"
              >
                Reason for Contact <span className="text-red-600">*</span>
              </label>
              <select
                id="contact-category"
                value={formData.category}
                onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                className="w-full border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-xs text-neutral-900 dark:text-neutral-100 focus:border-black dark:focus:border-white focus:outline-none"
              >
                {INQUIRY_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="contact-pref-method"
                className="block text-xs font-semibold text-neutral-800 dark:text-neutral-200"
              >
                Preferred Contact Method
              </label>
              <select
                id="contact-pref-method"
                value={formData.preferredMethod}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    preferredMethod: e.target.value as PreferredContactMethod,
                  }))
                }
                className="w-full border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-xs text-neutral-900 dark:text-neutral-100 focus:border-black dark:focus:border-white focus:outline-none"
              >
                <option value="EMAIL">Email Response</option>
                <option value="PHONE">Telephone Call / SMS</option>
                <option value="EITHER">Either Method</option>
              </select>
            </div>
          </div>

          {/* Row 2: Full Name */}
          <div className="space-y-1.5">
            <label
              htmlFor="contact-fullname"
              className="block text-xs font-semibold text-neutral-800 dark:text-neutral-200"
            >
              Full Legal Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="contact-fullname"
              value={formData.fullName}
              onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
              placeholder="e.g., Juan Dela Cruz"
              maxLength={120}
              aria-invalid={!!errors.fullName}
              aria-describedby={errors.fullName ? 'contact-fullname-error' : undefined}
              className={`w-full border px-3 py-2 text-xs text-neutral-900 dark:text-neutral-100 bg-white dark:bg-neutral-900 focus:outline-none ${
                errors.fullName
                  ? 'border-red-500 focus:border-red-600'
                  : 'border-neutral-300 dark:border-neutral-700 focus:border-black dark:focus:border-white'
              }`}
            />
            {errors.fullName && (
              <p id="contact-fullname-error" className="text-[11px] text-red-600 font-medium">
                {errors.fullName}
              </p>
            )}
          </div>

          {/* Row 3: Email & Telephone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label
                htmlFor="contact-email"
                className="block text-xs font-semibold text-neutral-800 dark:text-neutral-200"
              >
                Email Address <span className="text-red-600">*</span>
              </label>
              <input
                type="email"
                id="contact-email"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="name@example.ph"
                maxLength={120}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'contact-email-error' : undefined}
                className={`w-full border px-3 py-2 text-xs text-neutral-900 dark:text-neutral-100 bg-white dark:bg-neutral-900 focus:outline-none ${
                  errors.email
                    ? 'border-red-500 focus:border-red-600'
                    : 'border-neutral-300 dark:border-neutral-700 focus:border-black dark:focus:border-white'
                }`}
              />
              {errors.email && (
                <p id="contact-email-error" className="text-[11px] text-red-600 font-medium">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="contact-phone"
                className="block text-xs font-semibold text-neutral-800 dark:text-neutral-200"
              >
                Telephone / Mobile Number <span className="text-red-600">*</span>
              </label>
              <input
                type="tel"
                id="contact-phone"
                value={formData.phone}
                onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                placeholder="+63 917 966 8814"
                maxLength={30}
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? 'contact-phone-error' : undefined}
                className={`w-full border px-3 py-2 text-xs text-neutral-900 dark:text-neutral-100 bg-white dark:bg-neutral-900 focus:outline-none ${
                  errors.phone
                    ? 'border-red-500 focus:border-red-600'
                    : 'border-neutral-300 dark:border-neutral-700 focus:border-black dark:focus:border-white'
                }`}
              />
              {errors.phone && (
                <p id="contact-phone-error" className="text-[11px] text-red-600 font-medium">
                  {errors.phone}
                </p>
              )}
            </div>
          </div>

          {/* Row 4: Subject */}
          <div className="space-y-1.5">
            <label
              htmlFor="contact-subject"
              className="block text-xs font-semibold text-neutral-800 dark:text-neutral-200"
            >
              Subject <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="contact-subject"
              value={formData.subject}
              onChange={(e) => setFormData((prev) => ({ ...prev, subject: e.target.value }))}
              placeholder="Brief summary of your matter or inquiry"
              maxLength={150}
              aria-invalid={!!errors.subject}
              aria-describedby={errors.subject ? 'contact-subject-error' : undefined}
              className={`w-full border px-3 py-2 text-xs text-neutral-900 dark:text-neutral-100 bg-white dark:bg-neutral-900 focus:outline-none ${
                errors.subject
                  ? 'border-red-500 focus:border-red-600'
                  : 'border-neutral-300 dark:border-neutral-700 focus:border-black dark:focus:border-white'
              }`}
            />
            {errors.subject && (
              <p id="contact-subject-error" className="text-[11px] text-red-600 font-medium">
                {errors.subject}
              </p>
            )}
          </div>

          {/* Row 5: Message */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="contact-message"
                className="block text-xs font-semibold text-neutral-800 dark:text-neutral-200"
              >
                Inquiry Details <span className="text-red-600">*</span>
              </label>
              <span className="text-[11px] font-mono text-neutral-500">
                {formData.message.length}/{maxMessageLength}
              </span>
            </div>
            <textarea
              id="contact-message"
              rows={5}
              value={formData.message}
              onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
              placeholder="Please describe your inquiry, case background, or technical question..."
              maxLength={maxMessageLength}
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? 'contact-message-error' : undefined}
              className={`w-full border px-3 py-2 text-xs text-neutral-900 dark:text-neutral-100 bg-white dark:bg-neutral-900 focus:outline-none resize-y ${
                errors.message
                  ? 'border-red-500 focus:border-red-600'
                  : 'border-neutral-300 dark:border-neutral-700 focus:border-black dark:focus:border-white'
              }`}
            />
            {errors.message && (
              <p id="contact-message-error" className="text-[11px] text-red-600 font-medium">
                {errors.message}
              </p>
            )}
          </div>

          {/* Non-representation & Privacy Notice Requirement */}
          <div className="p-3.5 border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/40 space-y-2 text-[11px] text-neutral-600 dark:text-neutral-400">
            <div className="flex items-start gap-2">
              <ShieldAlert className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
              <p className="leading-relaxed">
                <strong>Legal Notice:</strong> {siteContact.disclaimerNotice}
              </p>
            </div>

            <div className="pt-2 border-t border-neutral-200 dark:border-neutral-700">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  id="contact-consent-checkbox"
                  checked={formData.consentAgreed}
                  onChange={(e) => setFormData((prev) => ({ ...prev, consentAgreed: e.target.checked }))}
                  className="mt-0.5 h-3.5 w-3.5 border-neutral-400 accent-black dark:accent-white"
                />
                <span className="text-neutral-800 dark:text-neutral-200 select-none">
                  I understand that submitting this inquiry does not create an attorney-client relationship and I consent to the processing of this contact information pursuant to the Data Privacy Act of 2012 (R.A. 10173). <span className="text-red-600">*</span>
                </span>
              </label>
              {errors.consentAgreed && (
                <p className="mt-1 text-[11px] text-red-600 font-medium pl-5">
                  {errors.consentAgreed}
                </p>
              )}
            </div>
          </div>

          {/* Submission Action Bar */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-neutral-200 dark:border-neutral-800">
            <p className="text-[11px] text-neutral-500 order-2 sm:order-1">
              Protected by client-side sanitization and duplicate rate limiting.
            </p>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-black bg-black px-6 py-2.5 text-xs font-semibold text-white hover:bg-neutral-800 dark:border-white dark:bg-white dark:text-black dark:hover:bg-neutral-200 transition-colors order-1 sm:order-2 ${
                isSubmitting ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                  <span>Processing Intake...</span>
                </>
              ) : (
                <>
                  <Send className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Submit Contact Inquiry</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
