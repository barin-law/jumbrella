/**
 * JuriMbrella — Philippine Electronic Notarization
 * Client Consultation & Videoconference Workspace
 * Encrypted Messages, Consultation Notes, and Comprehensive Video Call Simulator
 */

import React, { useState } from 'react';
import {
  Video,
  Mic,
  MicOff,
  VideoOff,
  Share2,
  Lock,
  MessageSquare,
  Hand,
  Users,
  Send,
  Calendar,
  Clock,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Settings,
  ArrowRight,
  CheckSquare,
  Square,
  Plus,
  X,
  PhoneCall,
  Download,
} from 'lucide-react';
import { useClientCase } from '../../../context/ClientCaseContext';
import { StatusBadge } from '../../common/StatusBadge';

interface ClientConsultationSectionProps {
  activeSubModule: string;
  onNavigateModule?: (moduleId: string) => void;
}

interface ActionItem {
  id: string;
  title: string;
  dueDate: string;
  isDone: boolean;
}

const INITIAL_ACTION_ITEMS: ActionItem[] = [
  {
    id: 'act-1',
    title: 'Provide Certified True Copy (CTC) of Land Title TCT No. 149204',
    dueDate: 'Sep 21, 2026',
    isDone: false,
  },
  {
    id: 'act-2',
    title: 'Confirm primary identification card (PSA ePhilID) is unexpired',
    dueDate: 'Sep 20, 2026',
    isDone: true,
  },
  {
    id: 'act-3',
    title: 'Notify instrumental witness Atty. Cruz of morning hearing timecode',
    dueDate: 'Sep 20, 2026',
    isDone: false,
  },
];

export const ClientConsultationSection: React.FC<ClientConsultationSectionProps> = ({
  activeSubModule,
  onNavigateModule,
}) => {
  const { activeCase, sendLawyerMessage } = useClientCase();

  // Chat message state
  const [chatInput, setChatInput] = useState('');

  // Waiting Room state
  const [inWaitingRoom, setInWaitingRoom] = useState(false);
  const [waitingTime, setWaitingTime] = useState('02:15');
  const [admittedNotice, setAdmittedNotice] = useState(false);

  // Video call controls
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [inCallChatOpen, setInCallChatOpen] = useState(false);
  const [inCallMessage, setInCallMessage] = useState('');
  const [inCallMessages, setInCallMessages] = useState<Array<{ sender: string; text: string; time: string }>>([
    { sender: 'Atty. Juan Dela Cruz', text: 'Good morning everyone. We will commence the notarial oath shortly.', time: '10:02 AM' },
  ]);

  // Consultation Notes state
  const [notes, setNotes] = useState<string>(
    '1. Special Power of Attorney strictly designates authority for legal representation regarding the Makati property.\n2. Principal has confirmed personal appearance from Makati City.\n3. Digital signature will be affixed using standard PhilSys cryptographic certificate token.'
  );
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notesSavedNotice, setNotesSavedNotice] = useState(false);

  // Action Items state
  const [actionItems, setActionItems] = useState<ActionItem[]>(INITIAL_ACTION_ITEMS);
  const [newActionTitle, setNewActionTitle] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!activeCase) {
    return (
      <div className="border border-black/15 bg-white p-6 dark:border-white/15 dark:bg-neutral-950 text-xs">
        Please select or create an active case to access consultation features.
      </div>
    );
  }

  const handleSendLawyerMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    sendLawyerMessage(activeCase.caseId, chatInput.trim());
    setChatInput('');
  };

  const handleSendInCallChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inCallMessage.trim()) return;

    setInCallMessages((prev) => [
      ...prev,
      {
        sender: 'Maria Elena Santos (You)',
        text: inCallMessage.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setInCallMessage('');
  };

  const handleSaveNotes = () => {
    setIsEditingNotes(false);
    setNotesSavedNotice(true);
    setTimeout(() => setNotesSavedNotice(false), 3000);
  };

  const toggleActionItem = (id: string) => {
    setActionItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isDone: !item.isDone } : item))
    );
  };

  const handleAddActionItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActionTitle.trim()) return;
    const newItem: ActionItem = {
      id: `act-${Date.now()}`,
      title: newActionTitle.trim(),
      dueDate: 'Sep 24, 2026',
      isDone: false,
    };
    setActionItems((prev) => [...prev, newItem]);
    setNewActionTitle('');
  };

  const handleEnterWaitingRoom = () => {
    setInWaitingRoom(true);
    setToastMessage('Connected to Waiting Room. Notary Public has been alerted.');
    setTimeout(() => {
      setAdmittedNotice(true);
    }, 2500);
  };

  return (
    <div className="space-y-5 text-xs">
      {toastMessage && (
        <div className="border border-emerald-500 bg-emerald-50 p-3 text-xs text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300 flex items-center justify-between">
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-emerald-700 hover:text-emerald-900">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Case Header */}
      <div className="border border-black/20 bg-white p-4 dark:border-white/20 dark:bg-neutral-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <span className="text-[10px] font-mono uppercase text-neutral-500">
            Legal Consultation & Hearing Facility
          </span>
          <h4 className="text-sm font-bold text-black dark:text-white">
            {activeCase.caseReference} • {activeCase.assignedLawyer?.name || 'Atty. Roberto Cruz'}
          </h4>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status="PRIVILEGED_COMMUNICATION" variant="success" size="sm" />
          {onNavigateModule && activeSubModule !== 'principal-live-sessions' && (
            <button
              onClick={() => onNavigateModule('principal-live-sessions')}
              className="flex items-center gap-1 border border-black bg-black px-2.5 py-1 text-xs text-white dark:border-white dark:bg-white dark:text-black cursor-pointer"
            >
              <Video className="h-3 w-3" />
              <span>Enter Hearing Room</span>
            </button>
          )}
        </div>
      </div>

      {/* SUB-VIEW ROUTING */}
      {activeSubModule === 'principal-calendar' ? (
        /* APPOINTMENT CALENDAR */
        <div className="border border-black/15 bg-white p-5 dark:border-white/15 dark:bg-neutral-950 space-y-4">
          <div className="flex items-center justify-between border-b border-black/10 pb-3 dark:border-white/10">
            <div>
              <h3 className="text-sm font-bold text-black dark:text-white">
                Upcoming Hearing & Consultation Calendar
              </h3>
              <p className="text-xs text-neutral-500">
                Scheduled videoconference appearances and notarization ceremonies.
              </p>
            </div>
            <StatusBadge status="SLOTS CONFIRMED" variant="info" size="sm" />
          </div>

          <div className="space-y-4">
            <div className="border border-black/10 p-4 bg-neutral-50 dark:border-white/10 dark:bg-neutral-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-emerald-600" />
                  <span className="font-bold text-xs">Pre-Ceremony Case Strategy Consultation</span>
                  <span className="border border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[9px] px-1.5 py-0.2 font-mono">
                    CONFIRMED
                  </span>
                </div>
                <p className="text-[11px] text-neutral-500">
                  Presided by {activeCase.assignedLawyer?.name || 'Atty. Roberto Cruz'} • Encrypted Room #413-MKT
                </p>
                <div className="font-mono text-[10px] text-neutral-400">
                  Date: September 20, 2026 • Time: 10:00 AM - 10:30 AM PHT
                </div>
              </div>

              <div className="flex items-center gap-2">
                {!inWaitingRoom ? (
                  <button
                    onClick={handleEnterWaitingRoom}
                    className="border border-black bg-black px-4 py-2 font-semibold text-white hover:bg-neutral-800 dark:border-white dark:bg-white dark:text-black cursor-pointer"
                  >
                    Enter Waiting Room
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                      In Waiting Room ({waitingTime})
                    </span>
                    {admittedNotice && onNavigateModule && (
                      <button
                        onClick={() => onNavigateModule('principal-live-sessions')}
                        className="border border-emerald-600 bg-emerald-600 px-3 py-1.5 font-semibold text-white hover:bg-emerald-700 cursor-pointer animate-bounce"
                      >
                        Admit to Live Hearing →
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Waiting Room Status Card */}
            {inWaitingRoom && (
              <div className="border border-emerald-500/40 bg-emerald-50/50 dark:bg-emerald-950/20 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>Secure Waiting Room Check</span>
                  </span>
                  <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-300">
                    Host: Atty. Juan Dela Cruz
                  </span>
                </div>
                <p className="text-[11px] text-neutral-600 dark:text-neutral-400">
                  Your camera, microphone, and encryption handshakes have been validated. Please stay on this screen. The notary will admit you once the docket is ready.
                </p>
                {admittedNotice && (
                  <div className="p-2.5 bg-emerald-100 dark:bg-emerald-900/60 border border-emerald-500 text-emerald-900 dark:text-emerald-100 flex items-center justify-between">
                    <span className="font-semibold text-xs">The Presiding Notary has admitted you to the live hearing room.</span>
                    {onNavigateModule && (
                      <button
                        onClick={() => onNavigateModule('principal-live-sessions')}
                        className="border border-black bg-black px-3 py-1 text-white dark:border-white dark:bg-white dark:text-black cursor-pointer text-xs font-bold"
                      >
                        Join Now
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : activeSubModule === 'principal-live-sessions' ? (
        /* SECURE VIDEO CALL SIMULATOR (Section 28) */
        <div className="border border-black/15 bg-neutral-950 text-white p-5 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
              <h3 className="text-xs font-mono font-bold tracking-wider uppercase">
                Synchronous Encrypted Notarial Videoconference Room
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="border border-neutral-700 px-2 py-0.5 text-[9px] font-mono">
                TLS 1.3 • WebRTC DTLS-SRTP
              </span>
              <span className="border border-emerald-500/40 bg-emerald-950/60 px-2 py-0.5 text-[9px] font-mono text-emerald-400">
                ROOM LOCKED
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Primary Video Canvas */}
            <div className="md:col-span-2 relative bg-neutral-900 border border-neutral-800 min-h-[320px] flex flex-col justify-between p-4">
              <div className="flex justify-between items-center text-[10px] font-mono text-neutral-400">
                <span>ENP: Atty. Juan Dela Cruz (Presiding Notary)</span>
                <span>Signal: 1080p 30fps (Optimal)</span>
              </div>

              {/* Watermark Banner */}
              <div className="self-center border border-white/20 bg-black/60 px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-neutral-300 text-center">
                DEMONSTRATION VIDEOCONFERENCE — NOT A LEGALLY VALID HEARING
              </div>

              {/* Screen Share Overlay if toggled */}
              {isScreenSharing && (
                <div className="absolute inset-4 bg-neutral-950/95 border border-white/20 p-4 flex flex-col justify-between z-10">
                  <div className="flex justify-between items-center text-[10px] font-mono text-neutral-300 border-b border-neutral-800 pb-2">
                    <span>[DOCUMENT PRESENTATION MODE: {activeCase.title}]</span>
                    <button
                      onClick={() => setIsScreenSharing(false)}
                      className="border border-white/30 px-2 py-0.5 text-[10px] hover:bg-neutral-800 cursor-pointer"
                    >
                      Stop Presentation
                    </button>
                  </div>
                  <div className="text-center font-serif text-neutral-200 text-xs py-8 space-y-2">
                    <p className="font-bold uppercase tracking-wider">SPECIAL POWER OF ATTORNEY</p>
                    <p className="max-w-md mx-auto text-[11px] text-neutral-400 italic">
                      "KNOW ALL MEN BY THESE PRESENTS: That I, Maria Elena Santos, of legal age, Filipino citizen, do hereby name, constitute, and appoint..."
                    </p>
                  </div>
                  <div className="text-[10px] font-mono text-neutral-500 text-center">
                    Shared with: Atty. Juan Dela Cruz (ENP), Atty. Roberto Cruz (Witness)
                  </div>
                </div>
              )}

              {/* Self View Floating Window */}
              <div className="self-end border border-neutral-700 bg-neutral-950 p-2 w-40 space-y-1">
                <div className="text-[9px] text-neutral-400 font-mono flex items-center justify-between">
                  <span>You (Principal)</span>
                  {isMicMuted && <span className="text-rose-400 font-bold">MUTED</span>}
                </div>
                <div className="h-16 bg-neutral-800 flex flex-col items-center justify-center text-[9px] text-neutral-400 font-mono">
                  {isVideoOff ? (
                    <span>[CAMERA OFF]</span>
                  ) : (
                    <div className="text-center">
                      <div className="text-emerald-400 font-bold">LIVE STREAM</div>
                      <div className="text-[8px] text-neutral-500">PhilSys Liveness Ready</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* In-Call Controls & Attendees */}
            <div className="border border-neutral-800 bg-neutral-900 p-4 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs font-mono uppercase tracking-wider text-neutral-400">
                    Attendees (3)
                  </h4>
                  <button
                    onClick={() => setInCallChatOpen(!inCallChatOpen)}
                    className="flex items-center gap-1 text-[10px] text-neutral-400 hover:text-white"
                  >
                    <MessageSquare className="h-3 w-3" />
                    <span>{inCallChatOpen ? 'Hide Chat' : 'Show Chat'}</span>
                  </button>
                </div>

                {!inCallChatOpen ? (
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between border border-neutral-800 p-2 bg-neutral-950">
                      <div>
                        <div className="font-bold">Atty. Juan Dela Cruz</div>
                        <div className="text-[9px] text-neutral-500 font-mono">Branch 138 Notary</div>
                      </div>
                      <span className="text-[9px] text-emerald-400 font-mono">ENP PRESIDING</span>
                    </div>
                    <div className="flex items-center justify-between border border-neutral-800 p-2 bg-neutral-950">
                      <div>
                        <div className="font-bold">Maria Elena Santos</div>
                        <div className="text-[9px] text-neutral-500 font-mono">Affiant / Signer</div>
                      </div>
                      <span className="text-[9px] text-neutral-400 font-mono">YOU</span>
                    </div>
                    <div className="flex items-center justify-between border border-neutral-800 p-2 bg-neutral-950">
                      <div>
                        <div className="font-bold">Atty. Roberto Cruz</div>
                        <div className="text-[9px] text-neutral-500 font-mono">Disinterested Party</div>
                      </div>
                      <span className="text-[9px] text-neutral-400 font-mono">WITNESS</span>
                    </div>
                  </div>
                ) : (
                  /* In-Call Chat */
                  <div className="space-y-2">
                    <div className="border border-neutral-800 p-2 bg-neutral-950 h-32 overflow-y-auto space-y-1.5 text-[10px]">
                      {inCallMessages.map((m, idx) => (
                        <div key={idx} className="border-b border-neutral-900 pb-1">
                          <span className="font-bold text-neutral-300">{m.sender}: </span>
                          <span className="text-neutral-400">{m.text}</span>
                          <span className="text-neutral-600 text-[8px] block font-mono">{m.time}</span>
                        </div>
                      ))}
                    </div>
                    <form onSubmit={handleSendInCallChat} className="flex gap-1">
                      <input
                        type="text"
                        value={inCallMessage}
                        onChange={(e) => setInCallMessage(e.target.value)}
                        placeholder="Type room message..."
                        className="flex-1 bg-neutral-950 border border-neutral-700 p-1.5 text-[10px] text-white"
                      />
                      <button
                        type="submit"
                        className="border border-neutral-700 bg-neutral-800 px-2 py-1 text-[10px] hover:bg-neutral-700"
                      >
                        Send
                      </button>
                    </form>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-3 border-t border-neutral-800">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setIsMicMuted(!isMicMuted)}
                    className={`flex items-center justify-center gap-1.5 p-2 text-xs font-mono border cursor-pointer ${
                      isMicMuted
                        ? 'border-rose-500 bg-rose-950/60 text-rose-300'
                        : 'border-neutral-700 bg-neutral-950 text-neutral-200 hover:bg-neutral-800'
                    }`}
                  >
                    {isMicMuted ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
                    <span>{isMicMuted ? 'Unmute' : 'Mute'}</span>
                  </button>

                  <button
                    onClick={() => setIsVideoOff(!isVideoOff)}
                    className={`flex items-center justify-center gap-1.5 p-2 text-xs font-mono border cursor-pointer ${
                      isVideoOff
                        ? 'border-rose-500 bg-rose-950/60 text-rose-300'
                        : 'border-neutral-700 bg-neutral-950 text-neutral-200 hover:bg-neutral-800'
                    }`}
                  >
                    {isVideoOff ? <VideoOff className="h-3.5 w-3.5" /> : <Video className="h-3.5 w-3.5" />}
                    <span>{isVideoOff ? 'Start Cam' : 'Stop Cam'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setIsScreenSharing(!isScreenSharing)}
                    className={`flex items-center justify-center gap-1.5 p-2 text-xs font-mono border cursor-pointer ${
                      isScreenSharing
                        ? 'border-blue-500 bg-blue-950/60 text-blue-300'
                        : 'border-neutral-700 bg-neutral-950 text-neutral-200 hover:bg-neutral-800'
                    }`}
                  >
                    <Share2 className="h-3.5 w-3.5" />
                    <span>{isScreenSharing ? 'Stop Share' : 'Present Doc'}</span>
                  </button>

                  <button
                    onClick={() => setIsHandRaised(!isHandRaised)}
                    className={`flex items-center justify-center gap-1.5 p-2 text-xs font-mono border cursor-pointer ${
                      isHandRaised
                        ? 'border-amber-500 bg-amber-950/60 text-amber-300'
                        : 'border-neutral-700 bg-neutral-950 text-neutral-200 hover:bg-neutral-800'
                    }`}
                  >
                    <Hand className="h-3.5 w-3.5" />
                    <span>{isHandRaised ? 'Hand Raised' : 'Raise Hand'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : activeSubModule === 'principal-meeting-history' ? (
        /* MEETING HISTORY */
        <div className="border border-black/15 bg-white p-5 dark:border-white/15 dark:bg-neutral-950 space-y-4">
          <div className="flex items-center justify-between border-b border-black/10 pb-3 dark:border-white/10">
            <div>
              <h3 className="text-sm font-bold text-black dark:text-white">
                Hearing & Videoconference Session History
              </h3>
              <p className="text-xs text-neutral-500">
                Archived videoconference recordings, attendance logs, and cryptographic SHA-256 session digests.
              </p>
            </div>
            <StatusBadge status="AUDITED SESSIONS" variant="success" size="sm" />
          </div>

          <div className="space-y-3">
            {[
              {
                id: 'sess-1',
                title: 'Preliminary Appearance & Document Integrity Review',
                date: 'September 18, 2026',
                duration: '18 mins 42 secs',
                notary: 'Atty. Juan Dela Cruz',
                hash: 'sha256:7f9a8820cb12b...99a0e',
              },
              {
                id: 'sess-2',
                title: 'Principal Pre-Screening & Biometric Readiness Check',
                date: 'September 15, 2026',
                duration: '11 mins 05 secs',
                notary: 'Atty. Roberto Cruz',
                hash: 'sha256:1a2c3d4e5f6a7...8810b',
              },
            ].map((sess) => (
              <div
                key={sess.id}
                className="border border-black/10 p-4 bg-neutral-50 dark:border-white/10 dark:bg-neutral-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="font-bold text-xs">{sess.title}</div>
                  <div className="text-[11px] text-neutral-500">
                    Conducted by {sess.notary} • Date: {sess.date} • Duration: {sess.duration}
                  </div>
                  <div className="text-[10px] font-mono text-neutral-400">
                    Session Audit Digest: {sess.hash}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setToastMessage(`Downloaded session attendance manifest for ${sess.id}.`);
                      setTimeout(() => setToastMessage(null), 3000);
                    }}
                    className="flex items-center gap-1 border border-black/20 bg-white px-3 py-1.5 text-[11px] hover:bg-neutral-100 dark:border-white/20 dark:bg-black cursor-pointer"
                  >
                    <Download className="h-3 w-3" />
                    <span>Attendance Log</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : activeSubModule === 'principal-consultation-notes' ? (
        /* CONSULTATION NOTES */
        <div className="border border-black/15 bg-white p-5 dark:border-white/15 dark:bg-neutral-950 space-y-4">
          <div className="flex items-center justify-between border-b border-black/10 pb-3 dark:border-white/10">
            <div>
              <h3 className="text-sm font-bold text-black dark:text-white">
                Case Legal Consultation Notes
              </h3>
              <p className="text-xs text-neutral-500">
                Privileged notes and strategic remarks agreed upon with assigned counsel.
              </p>
            </div>
            <StatusBadge status="PRIVILEGED" variant="info" size="sm" />
          </div>

          <div className="space-y-3">
            {isEditingNotes ? (
              <div className="space-y-2">
                <textarea
                  rows={8}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full border border-black/20 bg-white p-3 font-mono text-xs leading-relaxed dark:border-white/20 dark:bg-black"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setIsEditingNotes(false)}
                    className="border border-black/20 px-3 py-1 text-xs hover:bg-neutral-100 dark:border-white/20 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveNotes}
                    className="border border-black bg-black px-4 py-1 text-xs font-semibold text-white hover:bg-neutral-800 dark:border-white dark:bg-white dark:text-black cursor-pointer"
                  >
                    Save Notes
                  </button>
                </div>
              </div>
            ) : (
              <div className="border border-black/10 p-4 bg-neutral-50 dark:border-white/10 dark:bg-neutral-900 space-y-3">
                <div className="font-mono text-xs whitespace-pre-wrap leading-relaxed">
                  {notes}
                </div>
                <div className="pt-2 border-t border-black/10 dark:border-white/10 flex justify-end">
                  <button
                    onClick={() => setIsEditingNotes(true)}
                    className="border border-black/20 bg-white px-3 py-1.5 text-xs hover:bg-neutral-100 dark:border-white/20 dark:bg-black cursor-pointer"
                  >
                    Edit Notes
                  </button>
                </div>
              </div>
            )}
            {notesSavedNotice && (
              <p className="text-emerald-600 text-[11px] font-mono">
                ✓ Consultation notes updated and saved to case file.
              </p>
            )}
          </div>
        </div>
      ) : activeSubModule === 'principal-action-items' ? (
        /* ACTION ITEMS CHECKLIST */
        <div className="border border-black/15 bg-white p-5 dark:border-white/15 dark:bg-neutral-950 space-y-4">
          <div className="flex items-center justify-between border-b border-black/10 pb-3 dark:border-white/10">
            <div>
              <h3 className="text-sm font-bold text-black dark:text-white">
                Post-Consultation Deliverables & Action Items
              </h3>
              <p className="text-xs text-neutral-500">
                Checklist of items required before the notarial sealing ceremony.
              </p>
            </div>
            <span className="font-mono text-[10px] border border-black/20 px-2 py-0.5">
              {actionItems.filter((i) => i.isDone).length} / {actionItems.length} Completed
            </span>
          </div>

          <div className="space-y-2">
            {actionItems.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleActionItem(item.id)}
                className="border border-black/10 p-3 bg-neutral-50 dark:border-white/10 dark:bg-neutral-900 flex items-center justify-between cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800/60"
              >
                <div className="flex items-center gap-3">
                  {item.isDone ? (
                    <CheckSquare className="h-4 w-4 text-emerald-600 shrink-0" />
                  ) : (
                    <Square className="h-4 w-4 text-neutral-400 shrink-0" />
                  )}
                  <span className={`text-xs ${item.isDone ? 'line-through text-neutral-400' : 'font-semibold'}`}>
                    {item.title}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-neutral-500 shrink-0">
                  Due: {item.dueDate}
                </span>
              </div>
            ))}
          </div>

          {/* Add New Action Item Form */}
          <form onSubmit={handleAddActionItem} className="flex gap-2 pt-2">
            <input
              type="text"
              value={newActionTitle}
              onChange={(e) => setNewActionTitle(e.target.value)}
              placeholder="Add client action item..."
              className="flex-1 border border-black/20 bg-white p-2 text-xs dark:border-white/20 dark:bg-black"
            />
            <button
              type="submit"
              className="flex items-center gap-1 border border-black bg-black px-4 py-2 font-semibold text-white hover:bg-neutral-800 dark:border-white dark:bg-white dark:text-black cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Item</span>
            </button>
          </form>
        </div>
      ) : (
        /* LAWYER MESSAGES & NOTES (Default View) */
        <div className="border border-black/15 bg-white p-5 dark:border-white/15 dark:bg-neutral-950 space-y-4">
          <div className="flex items-center justify-between border-b border-black/10 pb-3 dark:border-white/10">
            <div>
              <h3 className="text-sm font-bold text-black dark:text-white">
                Privileged Counsel Messaging Thread
              </h3>
              <p className="text-xs text-neutral-500">
                Direct communication with assigned legal counsel regarding revisions and hearing instructions.
              </p>
            </div>
            <StatusBadge status="END-TO-END ENCRYPTED" variant="info" size="sm" />
          </div>

          {/* Messages Feed */}
          <div className="space-y-3 max-h-72 overflow-y-auto p-3 border border-black/10 bg-neutral-50 dark:border-white/10 dark:bg-neutral-900">
            {(activeCase.messages || []).map((msg) => (
              <div
                key={msg.id}
                className={`p-3 max-w-[85%] space-y-1 ${
                  msg.senderRole === 'CLIENT'
                    ? 'ml-auto bg-black text-white dark:bg-white dark:text-black'
                    : 'bg-white text-black border border-black/15 dark:bg-black dark:text-white dark:border-white/15'
                }`}
              >
                <div className="flex items-center justify-between gap-4 text-[10px] opacity-75">
                  <span className="font-bold">{msg.senderName} ({msg.senderRole})</span>
                  <span className="font-mono">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <p className="text-xs leading-relaxed">{msg.message}</p>
              </div>
            ))}
          </div>

          {/* Compose Form */}
          <form onSubmit={handleSendLawyerMessage} className="flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Send message to legal counsel..."
              className="flex-1 border border-black/20 bg-white p-2.5 text-xs dark:border-white/20 dark:bg-black"
            />
            <button
              type="submit"
              className="flex items-center gap-1.5 border border-black bg-black px-4 py-2 text-xs font-semibold text-white hover:bg-neutral-800 dark:border-white dark:bg-white dark:text-black dark:hover:bg-neutral-200 cursor-pointer"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
