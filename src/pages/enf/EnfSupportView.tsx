import React, { useState } from 'react';
import {
  HelpCircle,
  Plus,
  Send,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  Paperclip,
  User,
  Shield,
} from 'lucide-react';
import { EnfStorageService } from '../../services/enf/enfStorageService';
import { ENFSupportTicket, ENFSupportCategory, ENFTicketPriority } from '../../types/enf';

interface EnfSupportViewProps {
  onNavigate: (path: string) => void;
  userId?: string;
}

export const EnfSupportView: React.FC<EnfSupportViewProps> = ({
  onNavigate,
  userId = 'demo-enf-owner-1',
}) => {
  const [tickets, setTickets] = useState<ENFSupportTicket[]>(() =>
    EnfStorageService.getTickets(userId)
  );
  const [activeTicket, setActiveTicket] = useState<ENFSupportTicket | null>(tickets[0] || null);
  const [replyText, setReplyText] = useState('');
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);

  // New ticket state
  const [category, setCategory] = useState<ENFSupportCategory>('ENF Development');
  const [priority, setPriority] = useState<ENFTicketPriority>('MEDIUM');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const reloadTickets = () => {
    const updated = EnfStorageService.getTickets(userId);
    setTickets(updated);
    if (activeTicket) {
      const freshActive = updated.find((t) => t.id === activeTicket.id);
      if (freshActive) setActiveTicket(freshActive);
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTicket || !replyText.trim()) return;

    EnfStorageService.replyToTicket(activeTicket.id, {
      sender: 'CUSTOMER',
      senderName: 'Atty. Maria Elena Santos',
      text: replyText,
    });

    setReplyText('');
    reloadTickets();
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    const newT = EnfStorageService.createTicket({
      customerId: userId,
      customerName: 'Atty. Maria Elena Santos, En.P.',
      customerEmail: 'atty.santos@santoslaw.ph',
      category,
      priority,
      status: 'OPEN',
      subject,
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: 'CUSTOMER',
          senderName: 'Atty. Maria Elena Santos',
          text: message,
          timestamp: new Date().toISOString(),
        },
      ],
      assignedStaff: 'Support Desk Queue',
    });

    setIsNewTicketOpen(false);
    setSubject('');
    setMessage('');
    reloadTickets();
    setActiveTicket(newT);
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
              <HelpCircle className="h-4 w-4 text-[#002D5B]" />
              <h1 className="text-base font-bold text-[#002D5B]">ENF Technical Support & Ticket Desk</h1>
            </div>
          </div>

          <button
            onClick={() => setIsNewTicketOpen(true)}
            className="rounded-lg bg-[#002D5B] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#0078CE] transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Create New Ticket</span>
          </button>
        </div>

        {/* 2-COLUMN LAYOUT: Ticket List & Thread */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Tickets */}
          <div className="lg:col-span-4 rounded-2xl border border-[#D9E1E8] bg-white p-4 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-[#002D5B] uppercase tracking-wider px-2 pt-1">
              My Support Tickets ({tickets.length})
            </h3>

            <div className="space-y-2">
              {tickets.map((t) => {
                const isSelected = activeTicket?.id === t.id;
                return (
                  <div
                    key={t.id}
                    onClick={() => setActiveTicket(t)}
                    className={`rounded-xl border p-3.5 cursor-pointer transition-all space-y-2 ${
                      isSelected
                        ? 'border-[#0078CE] bg-[#0078CE]/5'
                        : 'border-[#D9E1E8] hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-slate-400 font-bold">{t.id}</span>
                      <span
                        className={`rounded px-1.5 py-0.5 text-[9px] font-bold ${
                          t.status === 'OPEN'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {t.status}
                      </span>
                    </div>

                    <p className="text-xs font-bold text-[#002D5B] line-clamp-2">{t.subject}</p>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-100">
                      <span>{t.category}</span>
                      <span>{t.messages.length} replies</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Active Thread */}
          <div className="lg:col-span-8 rounded-2xl border border-[#D9E1E8] bg-white p-6 shadow-xs space-y-6">
            {activeTicket ? (
              <>
                <div className="border-b border-[#D9E1E8] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="font-mono text-xs text-slate-400 font-bold">{activeTicket.id}</span>
                    <h2 className="text-lg font-bold text-[#002D5B]">{activeTicket.subject}</h2>
                    <p className="text-xs text-slate-500">
                      Category: {activeTicket.category} • Priority: {activeTicket.priority} • Assigned: {activeTicket.assignedStaff}
                    </p>
                  </div>
                  <span className="rounded bg-[#0078CE]/10 px-3 py-1 text-xs font-bold text-[#002D5B] font-mono">
                    {activeTicket.status}
                  </span>
                </div>

                {/* Messages Feed */}
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                  {activeTicket.messages.map((m) => {
                    const isStaff = m.sender === 'SUPPORT_AGENT';
                    return (
                      <div
                        key={m.id}
                        className={`rounded-xl p-4 space-y-1 text-xs ${
                          isStaff
                            ? 'bg-[#0078CE]/5 border border-[#0078CE]/20 ml-6'
                            : 'bg-[#F4F7F9] border border-[#D9E1E8] mr-6'
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold text-[#002D5B]">
                          <span>{m.senderName} {isStaff && '(JuriMbrella Support Desk)'}</span>
                          <span className="text-[10px] text-slate-400 font-normal">
                            {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-slate-700 leading-relaxed pt-1">{m.text}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Reply Form */}
                <form onSubmit={handleSendReply} className="border-t border-[#D9E1E8] pt-4 space-y-3">
                  <textarea
                    rows={3}
                    required
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your response or update..."
                    className="w-full rounded-xl border border-[#D9E1E8] p-3 text-xs text-[#17212B] focus:border-[#0078CE] focus:outline-none"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="rounded-lg bg-[#002D5B] px-4 py-2 text-xs font-bold text-white hover:bg-[#0078CE] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>Send Response</span>
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <p className="text-xs text-slate-400 py-12 text-center">Select or create a support ticket.</p>
            )}
          </div>
        </div>

        {/* Create Ticket Modal */}
        {isNewTicketOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <form onSubmit={handleCreateTicket} className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl space-y-4 border border-[#D9E1E8]">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-[#002D5B]">Open Support Ticket</h3>
                <button type="button" onClick={() => setIsNewTicketOpen(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                  ✕
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#002D5B] mb-1">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ENFSupportCategory)}
                  className="w-full rounded-lg border border-[#D9E1E8] p-2 text-xs focus:border-[#0078CE] focus:outline-none"
                >
                  <option value="ENF Development">ENF Development (Subdomain, DNS, Branding)</option>
                  <option value="Payment">Payment & Bank Transfer Verification</option>
                  <option value="Account">Account, Roll Number, & IBP Accreditation</option>
                  <option value="Documents">Documents & Hash Escrow</option>
                  <option value="Technical">Technical Platform & API Adapters</option>
                  <option value="Research">Research & Statutory Questions</option>
                  <option value="Other">Other Inquiry</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#002D5B] mb-1">Subject *</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full rounded-lg border border-[#D9E1E8] p-2 text-xs focus:border-[#0078CE] focus:outline-none"
                  placeholder="Summary of inquiry or issue..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#002D5B] mb-1">Message Description *</label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full rounded-lg border border-[#D9E1E8] p-2 text-xs focus:border-[#0078CE] focus:outline-none"
                  placeholder="Provide complete details..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewTicketOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#002D5B] text-xs font-bold text-white hover:bg-[#0078CE] transition-all cursor-pointer"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
