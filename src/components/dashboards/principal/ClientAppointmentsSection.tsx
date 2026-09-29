/**
 * JuriMbrella — Philippine Electronic Notarization
 * Client Hearing Appointments Module
 * Non-technical, clean schedule with one-click videoconference room entry
 */

import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Video,
  UserCheck,
  MapPin,
  FileText,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { StatusBadge } from '../../common/StatusBadge';

interface AppointmentItem {
  id: string;
  referenceNumber: string;
  instrumentTitle: string;
  date: string;
  time: string;
  notaryName: string;
  commissionNo: string;
  jurisdiction: string;
  status: 'CONFIRMED' | 'PENDING_RESCHEDULE' | 'COMPLETED';
  meetingRoomId: string;
}

const INITIAL_APPOINTMENTS: AppointmentItem[] = [
  {
    id: 'apt-1',
    referenceNumber: 'ENF-2026-0814',
    instrumentTitle: 'Special Power of Attorney for Real Property',
    date: 'Tomorrow (Sep 20, 2026)',
    time: '10:00 AM – 10:30 AM PHT',
    notaryName: 'Atty. Juan Dela Cruz',
    commissionNo: 'NP-2025-0814-MKT',
    jurisdiction: 'RTC Makati City Branch 138',
    status: 'CONFIRMED',
    meetingRoomId: 'ENF-ROOM-9104-MKT',
  },
  {
    id: 'apt-2',
    referenceNumber: 'ENF-2026-0792',
    instrumentTitle: 'Affidavit of Non-Tenancy and Waiver',
    date: 'Sep 25, 2026',
    time: '2:00 PM – 2:30 PM PHT',
    notaryName: 'Atty. Maria Santos',
    commissionNo: 'NP-2025-0219-QC',
    jurisdiction: 'RTC Quezon City Branch 89',
    status: 'CONFIRMED',
    meetingRoomId: 'ENF-ROOM-3341-QC',
  },
];

interface ClientAppointmentsSectionProps {
  onEnterCeremonyRoom: (referenceNumber: string) => void;
}

export const ClientAppointmentsSection: React.FC<ClientAppointmentsSectionProps> = ({
  onEnterCeremonyRoom,
}) => {
  const [appointments, setAppointments] = useState<AppointmentItem[]>(INITIAL_APPOINTMENTS);
  const [showRescheduleModal, setShowRescheduleModal] = useState<AppointmentItem | null>(null);
  const [rescheduleReason, setRescheduleReason] = useState('');
  const [proposedDate, setProposedDate] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleAddToCalendar = (apt: AppointmentItem) => {
    setToastMessage(`Calendar invite (.ics) generated for ${apt.referenceNumber}.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleRescheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showRescheduleModal) return;

    setAppointments((prev) =>
      prev.map((a) =>
        a.id === showRescheduleModal.id ? { ...a, status: 'PENDING_RESCHEDULE' } : a
      )
    );

    setToastMessage(
      `Reschedule request submitted for ${showRescheduleModal.referenceNumber}. Presiding notary will review.`
    );
    setShowRescheduleModal(null);
    setRescheduleReason('');
    setProposedDate('');
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="space-y-4 text-xs">
      {toastMessage && (
        <div className="border border-emerald-500 bg-emerald-50 p-3 text-xs text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Card */}
      <div className="border border-black/15 bg-white p-4 dark:border-white/15 dark:bg-neutral-950 space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/10 pb-3 dark:border-white/10">
          <div>
            <h3 className="text-sm font-bold text-black dark:text-white">
              Upcoming Videoconference Hearings
            </h3>
            <p className="text-neutral-500 text-[11px]">
              Scheduled remote notarial hearings pursuant to Supreme Court A.M. No. 24-10-14-SC.
            </p>
          </div>
          <span className="border border-black/20 bg-neutral-100 px-2 py-0.5 text-[10px] font-mono font-bold dark:border-white/20 dark:bg-neutral-900 self-start sm:self-auto">
            {appointments.length} Confirmed Slots
          </span>
        </div>

        <p className="text-neutral-600 dark:text-neutral-400 text-xs">
          Please join your video hearing 5 minutes before scheduled time with your Philippine government ID ready for biometric alignment.
        </p>
      </div>

      {/* Appointments List */}
      <div className="space-y-3">
        {appointments.map((apt) => (
          <div
            key={apt.id}
            className="border border-black/20 bg-white p-5 dark:border-white/20 dark:bg-neutral-950 shadow-xs space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/10 pb-3 dark:border-white/10">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono font-bold text-xs">{apt.referenceNumber}</span>
                  <span className="font-bold text-sm text-black dark:text-white">
                    {apt.instrumentTitle}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 text-xs">
                  <UserCheck className="h-3.5 w-3.5" />
                  <span>Presiding: {apt.notaryName}</span>
                  <span>•</span>
                  <span className="font-mono text-[11px] text-neutral-500">
                    {apt.commissionNo}
                  </span>
                </div>
              </div>

              <div className="self-start sm:self-auto">
                <StatusBadge
                  status={apt.status === 'CONFIRMED' ? 'HEARING_CONFIRMED' : 'RESCHEDULE_PENDING'}
                  size="sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-neutral-50 p-3 border border-black/10 dark:bg-neutral-900/60 dark:border-white/10 text-xs">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-neutral-500 shrink-0" />
                <div>
                  <span className="text-[10px] uppercase font-mono text-neutral-500 block">Date</span>
                  <span className="font-semibold">{apt.date}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-neutral-500 shrink-0" />
                <div>
                  <span className="text-[10px] uppercase font-mono text-neutral-500 block">Time (PHT)</span>
                  <span className="font-semibold">{apt.time}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-neutral-500 shrink-0" />
                <div>
                  <span className="text-[10px] uppercase font-mono text-neutral-500 block">Jurisdiction</span>
                  <span className="font-semibold">{apt.jurisdiction}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-2 text-[11px] text-neutral-500 font-mono">
                <Video className="h-3.5 w-3.5" />
                <span>Room Code: {apt.meetingRoomId}</span>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => handleAddToCalendar(apt)}
                  className="border border-black/20 px-3 py-1.5 text-xs hover:bg-neutral-100 dark:border-white/20 dark:hover:bg-neutral-900 cursor-pointer"
                >
                  Add to Calendar (Demo)
                </button>
                <button
                  onClick={() => setShowRescheduleModal(apt)}
                  className="border border-black/20 px-3 py-1.5 text-xs hover:bg-neutral-100 dark:border-white/20 dark:hover:bg-neutral-900 cursor-pointer text-neutral-600 dark:text-neutral-400"
                >
                  Request Reschedule
                </button>
                <button
                  onClick={() => onEnterCeremonyRoom(apt.referenceNumber)}
                  className="inline-flex items-center gap-1.5 border border-black bg-black px-4 py-1.5 text-xs font-semibold text-white hover:bg-neutral-800 dark:border-white dark:bg-white dark:text-black dark:hover:bg-neutral-200 cursor-pointer"
                >
                  <Video className="h-3.5 w-3.5" />
                  <span>Enter Video Hearing Room (Demo)</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Reschedule Modal */}
      {showRescheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md border border-black bg-white p-5 dark:border-white dark:bg-neutral-950 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-black/10 pb-2 dark:border-white/10">
              <h4 className="text-sm font-bold text-black dark:text-white">
                Request Hearing Reschedule (Demo)
              </h4>
              <button
                onClick={() => setShowRescheduleModal(null)}
                className="text-neutral-500 hover:text-black dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRescheduleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold uppercase text-[10px] text-neutral-500 mb-1">
                  Proposed New Date & Time
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Next Monday at 2:00 PM PHT"
                  value={proposedDate}
                  onChange={(e) => setProposedDate(e.target.value)}
                  className="w-full border border-black/20 bg-white p-2 text-xs dark:border-white/20 dark:bg-black"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase text-[10px] text-neutral-500 mb-1">
                  Reason for Rescheduling
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g., Unavoidable scheduling conflict or technical preparation..."
                  value={rescheduleReason}
                  onChange={(e) => setRescheduleReason(e.target.value)}
                  className="w-full border border-black/20 bg-white p-2 text-xs dark:border-white/20 dark:bg-black"
                />
              </div>

              <div className="pt-2 border-t border-black/10 dark:border-white/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowRescheduleModal(null)}
                  className="border border-black/20 px-3 py-1.5 hover:bg-neutral-100 dark:border-white/20 dark:hover:bg-neutral-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="border border-black bg-black px-4 py-1.5 text-xs font-semibold text-white hover:bg-neutral-800 dark:border-white dark:bg-white dark:text-black cursor-pointer"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
