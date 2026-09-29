/**
 * Centralized Contact, Administrator Support, Attorney, and Developer Configuration
 *
 * Single source of truth for all contact details, legal attributions, and developer credentials.
 * Status labels indicate temporary status until production domain and hotlines are provisioned.
 */

export interface SiteContactConfig {
  attorneyName: string;
  developerName: string;
  developerStatus: string;
  developerAttribution: string;
  phoneDisplay: string;
  phoneLink: string;
  phoneHref: string;
  phoneStatus: string;
  phoneAccessibleLabel: string;
  email: string;
  emailLink: string;
  emailHref: string;
  emailStatus: string;
  emailAccessibleLabel: string;
  officeAddress: string;
  officeAddressStatus: string;
  officeHours: string;
  officeHoursStatus: string;
  disclaimerNotice: string;
  temporaryNotice: string;
  unconnectedNotice: string;
  copyrightYear: number;
}

export const siteContact: SiteContactConfig = {
  attorneyName: 'Supreme Court of the Philippines',
  developerName: 'Ophireum Multimedia Production',
  developerStatus: 'Official Developer',
  developerAttribution: 'Developed by: Ophireum Multimedia Production — Official Developer',
  phoneDisplay: '+63 917 966 8814',
  phoneLink: 'tel:+639179668814',
  phoneHref: 'tel:+639179668814',
  phoneStatus: 'Temporary Contact Number',
  phoneAccessibleLabel: 'Call temporary contact number',
  email: 'ophireum.admin@gmail.com',
  emailLink: 'mailto:ophireum.admin@gmail.com',
  emailHref: 'mailto:ophireum.admin@gmail.com',
  emailStatus: 'Temporary Email Address',
  emailAccessibleLabel: 'Email temporary administrator address',
  officeAddress: 'To be confirmed',
  officeAddressStatus: 'To be confirmed',
  officeHours: 'To be confirmed',
  officeHoursStatus: 'To be confirmed',
  disclaimerNotice:
    'Submitting this form does not automatically create an attorney-client relationship. Do not send highly confidential, privileged, or time-sensitive information until representation has been formally confirmed.',
  temporaryNotice:
    'Need assistance? Contact the administrator at +63 917 966 8814 or ophireum.admin@gmail.com. These are temporary contact details and may be updated later.',
  unconnectedNotice:
    'Contact submission service is not yet connected. Please call +63 917 966 8814 or email ophireum.admin@gmail.com.',
  copyrightYear: 2026,
};
