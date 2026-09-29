/**
 * Contact Inquiry Store & Management Service
 *
 * Provides persistent storage for incoming inquiries, admin audit trails,
 * reply histories, internal notes, rate-limiting, sanitization, and export capabilities.
 */

export type InquiryStatus =
  | 'OPEN'
  | 'IN_PROGRESS'
  | 'WAITING_CLIENT'
  | 'RESOLVED'
  | 'CLOSED'
  | 'SPAM';

export type InquiryPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type PreferredContactMethod = 'EMAIL' | 'PHONE' | 'EITHER';

export interface InquiryNote {
  id: string;
  author: string;
  text: string;
  timestamp: string;
}

export interface InquiryReply {
  id: string;
  author: string;
  text: string;
  channel: 'EMAIL' | 'PHONE';
  timestamp: string;
}

export interface InquiryAuditEntry {
  timestamp: string;
  actor: string;
  action: string;
}

export interface ContactInquiry {
  id: string; // Reference number e.g. INQ-2026-0041
  senderName: string;
  email: string;
  phone: string;
  preferredContactMethod: PreferredContactMethod;
  category: string;
  subject: string;
  message: string;
  createdAt: string;
  status: InquiryStatus;
  priority: InquiryPriority;
  assignedAdmin: string;
  attachmentStatus: 'NONE' | 'ATTACHED';
  internalNotes: InquiryNote[];
  replyHistory: InquiryReply[];
  auditTrail: InquiryAuditEntry[];
}

const STORAGE_KEY = 'jurimbrella_contact_inquiries_v1';
const RATE_LIMIT_KEY = 'jurimbrella_last_inquiry_submission_time';

// Initial demonstration inquiries for administration review
const INITIAL_INQUIRIES: ContactInquiry[] = [
  {
    id: 'INQ-2026-0041',
    senderName: 'Maria Santos',
    email: 'm.santos@demo-enterprise.ph',
    phone: '+63 918 123 4567',
    preferredContactMethod: 'EMAIL',
    category: 'Electronic Notarization Assistance',
    subject: 'Inquiry regarding Supreme Court A.M. 24-10-14-SC remote hearing',
    message: 'Good day. We need clarification on whether our corporate board resolution can be executed via REN while two board members are located in Cebu and Davao.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    status: 'OPEN',
    priority: 'HIGH',
    assignedAdmin: 'Atty. Enrico Morales',
    attachmentStatus: 'NONE',
    internalNotes: [
      {
        id: 'note-1',
        author: 'System Admin',
        text: 'Initial intake verified. Requester is enrolled as Principal persona.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
      },
    ],
    replyHistory: [],
    auditTrail: [
      {
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
        actor: 'Client (Maria Santos)',
        action: 'Inquiry submitted via portal',
      },
    ],
  },
  {
    id: 'INQ-2026-0042',
    senderName: 'Engr. Kenneth Tan',
    email: 'rtan@bayanilogistics.ph',
    phone: '+63 917 555 9876',
    preferredContactMethod: 'PHONE',
    category: 'Technical Issue',
    subject: 'Camera diagnostic failure during pre-call REN inspection',
    message: 'Hardware test in our boardroom PC fails on video frame capture under Firefox 125. Audio test passes successfully.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    status: 'IN_PROGRESS',
    priority: 'MEDIUM',
    assignedAdmin: 'Ophireum Support Desk',
    attachmentStatus: 'NONE',
    internalNotes: [
      {
        id: 'note-2',
        author: 'Ophireum Support Desk',
        text: 'Advised client to check WebRTC H.264 hardware acceleration flag in about:config.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
      },
    ],
    replyHistory: [
      {
        id: 'rep-1',
        author: 'Ophireum Support Desk',
        channel: 'EMAIL',
        text: 'Sent browser compatibility guide for Supreme Court A.M. 24-10-14-SC REN videoconferencing.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
      },
    ],
    auditTrail: [
      {
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
        actor: 'Client (Kenneth Tan)',
        action: 'Inquiry submitted',
      },
      {
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
        actor: 'Ophireum Support Desk',
        action: 'Status updated to IN_PROGRESS',
      },
    ],
  },
  {
    id: 'INQ-2026-0043',
    senderName: 'Atty. Cristina Legaspi',
    email: 'clegaspi@demo-lawchambers.ph',
    phone: '+63 920 888 1212',
    preferredContactMethod: 'EMAIL',
    category: 'Document Review',
    subject: 'Pre-clearance of Deed of Absolute Sale notarial certificate',
    message: 'Requesting review of notarial acknowledgment wording to confirm compliance with Supreme Court A.M. 24-10-14-SC Form Annex C.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    status: 'RESOLVED',
    priority: 'LOW',
    assignedAdmin: 'Atty. Enrico Morales',
    attachmentStatus: 'ATTACHED',
    internalNotes: [
      {
        id: 'note-3',
        author: 'Atty. Enrico Morales',
        text: 'Annex C conforms with the 2004 Rules and 2024 REN guidelines. Notice issued.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
      },
    ],
    replyHistory: [
      {
        id: 'rep-2',
        author: 'Atty. Enrico Morales',
        channel: 'EMAIL',
        text: 'Confirmed compliance with A.M. 24-10-14-SC. Draft certificate cleared.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
      },
    ],
    auditTrail: [
      {
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
        actor: 'Client (Atty. Cristina Legaspi)',
        action: 'Inquiry submitted',
      },
      {
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
        actor: 'Atty. Enrico Morales',
        action: 'Status updated to RESOLVED',
      },
    ],
  },
];

// Helper: Sanitize inputs against script injection & HTML tags
export function sanitizeInput(input: string): string {
  if (!input) return '';
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/[<>]/g, '')
    .trim();
}

// Helper: Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim());
}

// Helper: Validate Philippine or International phone number
export function isValidPhone(phone: string): boolean {
  if (!phone) return false;
  // Accepts +63 9XX XXX XXXX, 09XX XXX XXXX, or international +[country code] [digits]
  const cleaned = phone.replace(/[\s\-().]/g, '');
  const phRegex = /^(\+639|09)\d{9}$/;
  const intlRegex = /^\+?[1-9]\d{7,14}$/;
  return phRegex.test(cleaned) || intlRegex.test(cleaned);
}

class InquiryService {
  private getStore(): ContactInquiry[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_INQUIRIES));
        return INITIAL_INQUIRIES;
      }
      return JSON.parse(raw);
    } catch {
      return INITIAL_INQUIRIES;
    }
  }

  private saveStore(inquiries: ContactInquiry[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(inquiries));
    } catch (e) {
      console.error('Failed to save inquiries store', e);
    }
  }

  /**
   * Check submission rate limit (minimum 20 seconds between submissions from same browser)
   */
  public checkRateLimit(): { allowed: boolean; remainingSeconds?: number } {
    try {
      const last = localStorage.getItem(RATE_LIMIT_KEY);
      if (!last) return { allowed: true };
      const elapsed = Date.now() - parseInt(last, 10);
      const minIntervalMs = 20000;
      if (elapsed < minIntervalMs) {
        return {
          allowed: false,
          remainingSeconds: Math.ceil((minIntervalMs - elapsed) / 1000),
        };
      }
    } catch {
      // Fallback
    }
    return { allowed: true };
  }

  /**
   * Submit an inquiry from the public or protected contact form
   */
  public submitInquiry(data: {
    senderName: string;
    email: string;
    phone: string;
    preferredContactMethod: PreferredContactMethod;
    category: string;
    subject: string;
    message: string;
    honeypot?: string;
  }): { success: boolean; error?: string; referenceNumber?: string; inquiry?: ContactInquiry } {
    // 1. Spam protection honeypot
    if (data.honeypot && data.honeypot.trim() !== '') {
      return { success: false, error: 'Spam submission detected.' };
    }

    // 2. Rate limiting
    const rateCheck = this.checkRateLimit();
    if (!rateCheck.allowed) {
      return {
        success: false,
        error: `Please wait ${rateCheck.remainingSeconds} seconds before submitting another inquiry.`,
      };
    }

    // 3. Validation
    const cleanName = sanitizeInput(data.senderName);
    const cleanEmail = sanitizeInput(data.email).toLowerCase();
    const cleanPhone = sanitizeInput(data.phone);
    const cleanSubject = sanitizeInput(data.subject);
    const cleanMessage = sanitizeInput(data.message);

    if (!cleanName || cleanName.length < 2) {
      return { success: false, error: 'Full name is required (minimum 2 characters).' };
    }
    if (!cleanEmail || !isValidEmail(cleanEmail)) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    if (!cleanPhone || !isValidPhone(cleanPhone)) {
      return { success: false, error: 'Please enter a valid Philippine (+63 9XX XXX XXXX) or international telephone number.' };
    }
    if (!cleanSubject || cleanSubject.length < 4) {
      return { success: false, error: 'Subject is required (minimum 4 characters).' };
    }
    if (!cleanMessage || cleanMessage.length < 10) {
      return { success: false, error: 'Message is required (minimum 10 characters).' };
    }
    if (cleanMessage.length > 3000) {
      return { success: false, error: 'Message exceeds the maximum limit of 3,000 characters.' };
    }

    // 4. Duplicate check against existing inquiries
    const existing = this.getStore();
    const isDuplicate = existing.some(
      (inq) =>
        inq.email === cleanEmail &&
        inq.subject.toLowerCase() === cleanSubject.toLowerCase() &&
        Date.now() - new Date(inq.createdAt).getTime() < 1000 * 60 * 10
    );
    if (isDuplicate) {
      return {
        success: false,
        error: 'A duplicate inquiry with this subject was recently submitted. Please allow our team time to review.',
      };
    }

    // 5. Generate official Reference Number
    const year = new Date().getFullYear();
    const randomSeq = Math.floor(1000 + Math.random() * 9000);
    const refId = `INQ-${year}-${randomSeq}`;

    const newInquiry: ContactInquiry = {
      id: refId,
      senderName: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      preferredContactMethod: data.preferredContactMethod || 'EMAIL',
      category: data.category || 'General Legal Inquiry',
      subject: cleanSubject,
      message: cleanMessage,
      createdAt: new Date().toISOString(),
      status: 'OPEN',
      priority: 'MEDIUM',
      assignedAdmin: 'Atty. Enrico Morales',
      attachmentStatus: 'NONE',
      internalNotes: [],
      replyHistory: [],
      auditTrail: [
        {
          timestamp: new Date().toISOString(),
          actor: `Sender (${cleanName})`,
          action: `Submitted inquiry via Contact Form [Ref: ${refId}]`,
        },
      ],
    };

    const updated = [newInquiry, ...existing];
    this.saveStore(updated);

    // Record last submission time for rate limit
    try {
      localStorage.setItem(RATE_LIMIT_KEY, Date.now().toString());
    } catch {}

    return {
      success: true,
      referenceNumber: refId,
      inquiry: newInquiry,
    };
  }

  /**
   * Get all inquiries (accessible to ENF_ADMIN and SUPPORT_AGENT)
   */
  public getAllInquiries(): ContactInquiry[] {
    return this.getStore();
  }

  /**
   * Get inquiries filtered by user email for client isolation
   */
  public getInquiriesByUserEmail(email: string): ContactInquiry[] {
    if (!email) return [];
    const normalized = email.toLowerCase().trim();
    return this.getStore().filter((inq) => inq.email.toLowerCase() === normalized);
  }

  /**
   * Update inquiry status
   */
  public updateStatus(inquiryId: string, newStatus: InquiryStatus, actorName: string): boolean {
    const list = this.getStore();
    const idx = list.findIndex((i) => i.id === inquiryId);
    if (idx === -1) return false;

    const oldStatus = list[idx].status;
    list[idx].status = newStatus;
    list[idx].auditTrail.push({
      timestamp: new Date().toISOString(),
      actor: actorName,
      action: `Status transitioned from ${oldStatus} to ${newStatus}`,
    });

    this.saveStore(list);
    return true;
  }

  /**
   * Update priority
   */
  public updatePriority(inquiryId: string, newPriority: InquiryPriority, actorName: string): boolean {
    const list = this.getStore();
    const idx = list.findIndex((i) => i.id === inquiryId);
    if (idx === -1) return false;

    const oldPriority = list[idx].priority;
    list[idx].priority = newPriority;
    list[idx].auditTrail.push({
      timestamp: new Date().toISOString(),
      actor: actorName,
      action: `Priority changed from ${oldPriority} to ${newPriority}`,
    });

    this.saveStore(list);
    return true;
  }

  /**
   * Add internal staff note
   */
  public addInternalNote(inquiryId: string, author: string, text: string): boolean {
    const cleanText = sanitizeInput(text);
    if (!cleanText) return false;

    const list = this.getStore();
    const idx = list.findIndex((i) => i.id === inquiryId);
    if (idx === -1) return false;

    list[idx].internalNotes.push({
      id: `note-${Date.now()}`,
      author,
      text: cleanText,
      timestamp: new Date().toISOString(),
    });

    list[idx].auditTrail.push({
      timestamp: new Date().toISOString(),
      actor: author,
      action: 'Added internal note',
    });

    this.saveStore(list);
    return true;
  }

  /**
   * Record a reply to client
   */
  public recordReply(
    inquiryId: string,
    author: string,
    channel: 'EMAIL' | 'PHONE',
    text: string
  ): boolean {
    const cleanText = sanitizeInput(text);
    if (!cleanText) return false;

    const list = this.getStore();
    const idx = list.findIndex((i) => i.id === inquiryId);
    if (idx === -1) return false;

    list[idx].replyHistory.push({
      id: `rep-${Date.now()}`,
      author,
      channel,
      text: cleanText,
      timestamp: new Date().toISOString(),
    });

    if (list[idx].status === 'OPEN') {
      list[idx].status = 'IN_PROGRESS';
    }

    list[idx].auditTrail.push({
      timestamp: new Date().toISOString(),
      actor: author,
      action: `Dispatched reply to client via ${channel}`,
    });

    this.saveStore(list);
    return true;
  }

  /**
   * Export inquiries as CSV
   */
  public exportAsCsv(): string {
    const items = this.getStore();
    const headers = [
      'Reference Number',
      'Sender Name',
      'Email',
      'Phone',
      'Category',
      'Subject',
      'Status',
      'Priority',
      'Assigned Admin',
      'Created Date',
    ];

    const rows = items.map((i) => [
      i.id,
      `"${i.senderName.replace(/"/g, '""')}"`,
      i.email,
      i.phone,
      `"${i.category}"`,
      `"${i.subject.replace(/"/g, '""')}"`,
      i.status,
      i.priority,
      `"${i.assignedAdmin}"`,
      i.createdAt,
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }

  /**
   * Export inquiries as JSON
   */
  public exportAsJson(): string {
    return JSON.stringify(this.getStore(), null, 2);
  }
}

export const inquiryService = new InquiryService();
