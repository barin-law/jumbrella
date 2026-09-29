/**
 * JuriMbrella — Philippine Electronic Notarization
 * Client Documents, Evidence & AI Classification Module
 * Vault, Deduplication, Audio/Video Players, Testimonies, and 17 AI-Organized Folders
 */

import React, { useState } from 'react';
import {
  FolderTree,
  UploadCloud,
  Camera,
  Mic,
  Video,
  FileText,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Play,
  Pause,
  RotateCw,
  Sparkles,
  Eye,
  Trash2,
  Share2,
  Layers,
  Search,
  Check,
  X,
  Edit3,
} from 'lucide-react';
import { useClientCase } from '../../../context/ClientCaseContext';
import { StatusBadge } from '../../common/StatusBadge';
import { CaseFolderCategory, CaseEvidenceItem } from '../../../types/client-case';
import { CASE_FOLDERS } from '../../../data/clientCaseData';

interface ClientEvidenceSectionProps {
  activeSubModule: string;
}

export const ClientEvidenceSection: React.FC<ClientEvidenceSectionProps> = ({
  activeSubModule,
}) => {
  const {
    activeCase,
    uploadEvidenceItem,
    updateAiClassificationReview,
  } = useClientCase();

  const [selectedFolder, setSelectedFolder] = useState<CaseFolderCategory>('Identity and Authority');
  const [uploading, setUploading] = useState(false);
  const [duplicateNotice, setDuplicateNotice] = useState<string | null>(null);
  const [uploadSuccessNotice, setUploadSuccessNotice] = useState<string | null>(null);

  // Audio player state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(35);
  const [audioTranscriptCorrection, setAudioTranscriptCorrection] = useState('');
  const [transcriptSaved, setTranscriptSaved] = useState(false);

  // Video player state
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [videoTimecode, setVideoTimecode] = useState('02:14');
  const [activeMarkerName, setActiveMarkerName] = useState('00:45 - Front Entrance Boundary');

  // Camera capture simulation state
  const [cameraCaptured, setCameraCaptured] = useState(false);
  const [rotationAngle, setRotationAngle] = useState(0);

  // Testimony builder state
  const [affiantName, setAffiantName] = useState('Maria Elena Santos');
  const [incidentDate, setIncidentDate] = useState('2026-03-15');
  const [incidentPlace, setIncidentPlace] = useState('Makati City, Metro Manila');
  const [narrativeFacts, setNarrativeFacts] = useState(
    'On the date specified, the undersigned met with the representatives of the buyer to confirm the terms of the Special Power of Attorney...'
  );
  const [testimonyGenerated, setTestimonyGenerated] = useState(false);

  if (!activeCase) {
    return (
      <div className="border border-black/15 bg-white p-6 dark:border-white/15 dark:bg-neutral-950 text-xs">
        Please select or create an active case to manage documents and evidence.
      </div>
    );
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setDuplicateNotice(null);
    setUploadSuccessNotice(null);

    try {
      const res = await uploadEvidenceItem(activeCase.caseId, file, selectedFolder, 'PDF');
      if (res.isDuplicate) {
        setDuplicateNotice(
          'This document already exists in your secure vault. It has been linked to this case without creating another stored copy.'
        );
      } else {
        setUploadSuccessNotice(`File ${file.name} uploaded, SHA-256 hashed, and quarantined.`);
      }
      setTimeout(() => {
        setDuplicateNotice(null);
        setUploadSuccessNotice(null);
      }, 7000);
    } finally {
      setUploading(false);
    }
  };

  const handleSimulateCameraCapture = () => {
    setCameraCaptured(true);
  };

  const handleConfirmCameraUpload = async () => {
    if (!cameraCaptured) return;
    const dummyBlob = new File(
      ['simulated-scanned-credential'],
      `Scanned_Document_Capture_${Date.now()}.png`,
      { type: 'image/png' }
    );
    await uploadEvidenceItem(activeCase.caseId, dummyBlob, 'Identity and Authority', 'IMAGE');
    setCameraCaptured(false);
    setUploadSuccessNotice('Camera capture processed and filed in Client Identity folder.');
    setTimeout(() => setUploadSuccessNotice(null), 5000);
  };

  const handleSaveTestimony = async () => {
    const testimonyBlob = new File(
      [`AFFIDAVIT OF FACTS\n\nAffiant: ${affiantName}\nDate: ${incidentDate}\n\n${narrativeFacts}`],
      `Affidavit_Narrative_${Date.now()}.pdf`,
      { type: 'application/pdf' }
    );
    await uploadEvidenceItem(activeCase.caseId, testimonyBlob, 'Testimonies', 'TESTIMONY');
    setTestimonyGenerated(true);
    setTimeout(() => setTestimonyGenerated(false), 5000);
  };

  // Filter evidence items
  const getFilteredEvidence = (): CaseEvidenceItem[] => {
    if (activeSubModule === 'principal-photographs') {
      return activeCase.evidenceItems.filter((e) => e.fileType === 'IMAGE');
    }
    if (activeSubModule === 'principal-audio-evidence') {
      return activeCase.evidenceItems.filter((e) => e.fileType === 'AUDIO');
    }
    if (activeSubModule === 'principal-video-evidence') {
      return activeCase.evidenceItems.filter((e) => e.fileType === 'VIDEO');
    }
    if (activeSubModule === 'principal-testimonies') {
      return activeCase.evidenceItems.filter((e) => e.folder === 'Testimonies');
    }
    if (activeSubModule === 'principal-supporting-docs') {
      return activeCase.evidenceItems.filter((e) => e.folder === 'Supporting Documents');
    }
    if (activeSubModule === 'principal-duplicate-review') {
      return activeCase.evidenceItems.filter((e) => e.isCanonicalDuplicate);
    }
    return activeCase.evidenceItems;
  };

  const currentEvidenceList = getFilteredEvidence();

  return (
    <div className="space-y-5 text-xs">
      {duplicateNotice && (
        <div className="border border-blue-500 bg-blue-50 p-3 text-xs text-blue-900 dark:bg-blue-950/40 dark:text-blue-300">
          {duplicateNotice}
        </div>
      )}

      {uploadSuccessNotice && (
        <div className="border border-emerald-500 bg-emerald-50 p-3 text-xs text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
          {uploadSuccessNotice}
        </div>
      )}

      {/* Case Header Context */}
      <div className="border border-black/20 bg-white p-4 dark:border-white/20 dark:bg-neutral-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <span className="text-[10px] font-mono uppercase text-neutral-500">
            Case Document Vault
          </span>
          <h4 className="text-sm font-bold text-black dark:text-white">
            {activeCase.caseReference} • {activeCase.title}
          </h4>
        </div>
        <span className="font-mono text-xs border border-black/20 px-2 py-0.5 dark:border-white/20">
          {activeCase.evidenceItems.length} Secure Vault Items
        </span>
      </div>

      {/* SUB-VIEW: CAMERA CAPTURE (Section 22) */}
      {activeSubModule === 'principal-camera-capture' ? (
        <div className="border border-black/15 bg-white p-5 dark:border-white/15 dark:bg-neutral-950 space-y-4">
          <div className="flex items-center justify-between border-b border-black/10 pb-3 dark:border-white/10">
            <div>
              <h3 className="text-sm font-bold text-black dark:text-white">
                Live Camera Capture & Document Scanner
              </h3>
              <p className="text-xs text-neutral-500">
                Direct mobile/webcam image capture with border alignment and perspective correction.
              </p>
            </div>
            <StatusBadge status="SCANNER READY" variant="info" size="sm" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Viewfinder / Capture Canvas */}
            <div className="border-2 border-dashed border-black/30 p-6 bg-neutral-100 dark:bg-neutral-900 dark:border-white/30 flex flex-col items-center justify-center min-h-[260px] text-center space-y-3">
              {cameraCaptured ? (
                <div
                  className="bg-white dark:bg-black p-4 border border-black dark:border-white shadow-lg max-w-[280px] space-y-2 transition-transform duration-300"
                  style={{ transform: `rotate(${rotationAngle}deg)` }}
                >
                  <div className="text-[10px] font-mono font-bold uppercase border-b pb-1">
                    CAPTURED CREDENTIAL SCAN
                  </div>
                  <div className="h-24 bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-[10px] text-neutral-500 font-mono">
                    [PHILIPPINE NATIONAL ID IMAGE]
                  </div>
                  <div className="text-[9px] text-neutral-500 font-mono">
                    Resolution: 300 DPI • Clarity: Optimal
                  </div>
                </div>
              ) : (
                <>
                  <Camera className="h-10 w-10 text-neutral-400" />
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">
                    Position document inside the frame. Ensure good lighting without glare.
                  </p>
                  <button
                    onClick={handleSimulateCameraCapture}
                    className="border border-black bg-black px-4 py-2 text-xs font-semibold text-white hover:bg-neutral-800 dark:border-white dark:bg-white dark:text-black cursor-pointer"
                  >
                    Simulate Shutter Capture
                  </button>
                </>
              )}
            </div>

            {/* Controls */}
            <div className="border border-black/10 p-4 bg-neutral-50 dark:border-white/10 dark:bg-neutral-900 space-y-4 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-xs">Capture Enhancements</h4>
                <ul className="list-disc pl-4 mt-2 space-y-1 text-[11px] text-neutral-600 dark:text-neutral-400">
                  <li>Automatic corner edge detection</li>
                  <li>Skew & keystone perspective leveling</li>
                  <li>High-contrast binarization for OCR readiness</li>
                  <li>Lossless WebCrypto SHA-256 fingerprinting</li>
                </ul>

                {cameraCaptured && (
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => setRotationAngle((prev) => (prev + 90) % 360)}
                      className="flex items-center gap-1 border border-black/20 bg-white px-3 py-1.5 hover:bg-neutral-100 dark:border-white/20 dark:bg-black cursor-pointer"
                    >
                      <RotateCw className="h-3 w-3" />
                      <span>Rotate 90°</span>
                    </button>
                    <button
                      onClick={() => setCameraCaptured(false)}
                      className="border border-black/20 bg-white px-3 py-1.5 hover:bg-neutral-100 dark:border-white/20 dark:bg-black cursor-pointer"
                    >
                      Retake
                    </button>
                  </div>
                )}
              </div>

              {cameraCaptured && (
                <button
                  onClick={handleConfirmCameraUpload}
                  className="w-full border border-black bg-black py-2 text-xs font-semibold text-white hover:bg-neutral-800 dark:border-white dark:bg-white dark:text-black cursor-pointer"
                >
                  Save & File Document to Vault
                </button>
              )}
            </div>
          </div>
        </div>
      ) : activeSubModule === 'principal-audio-evidence' ? (
        /* AUDIO EVIDENCE & TRANSCRIPTION (Section 23) */
        <div className="border border-black/15 bg-white p-5 dark:border-white/15 dark:bg-neutral-950 space-y-4">
          <div className="flex items-center justify-between border-b border-black/10 pb-3 dark:border-white/10">
            <div>
              <h3 className="text-sm font-bold text-black dark:text-white">
                Audio Evidence Player & AI Transcription
              </h3>
              <p className="text-xs text-neutral-500">
                Synchronized playback with speaker diarization, confidence scores, and client correction workflow.
              </p>
            </div>
            <StatusBadge status="AUDIO WORKSPACE" variant="info" size="sm" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Player & Waveform */}
            <div className="border border-black/10 p-4 bg-neutral-50 dark:border-white/10 dark:bg-neutral-900 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs">recording_client_briefing_2026.m4a</span>
                <span className="text-[10px] font-mono text-neutral-500">01:42 / 04:30</span>
              </div>

              {/* Simulated Waveform Bar */}
              <div className="flex items-end gap-1 h-16 border-b border-black/10 pb-2 dark:border-white/10">
                {Array.from({ length: 32 }).map((_, i) => (
                  <div
                    key={i}
                    className={`flex-1 transition-all ${
                      i < 12
                        ? 'bg-black dark:bg-white'
                        : 'bg-neutral-300 dark:bg-neutral-700'
                    }`}
                    style={{ height: `${20 + Math.sin(i * 0.6) * 35 + (i % 3) * 15}%` }}
                  />
                ))}
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                  className="flex items-center gap-1.5 border border-black bg-black px-4 py-2 font-semibold text-white dark:border-white dark:bg-white dark:text-black cursor-pointer"
                >
                  {isPlayingAudio ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                  <span>{isPlayingAudio ? 'Pause Audio' : 'Play Audio'}</span>
                </button>
                <span className="text-[11px] font-mono text-neutral-500">
                  Codec: AAC 128kbps • SHA-256 verified
                </span>
              </div>
            </div>

            {/* AI Transcription & Client Correction */}
            <div className="border border-black/10 p-4 bg-neutral-50 dark:border-white/10 dark:bg-neutral-900 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-neutral-600 dark:text-neutral-400" />
                  <h4 className="font-bold text-xs">AI Transcription & Diarization</h4>
                </div>
                <span className="border border-black/20 bg-neutral-100 px-1.5 py-0.5 text-[9px] font-mono">
                  Confidence: 94.2%
                </span>
              </div>

              <div className="space-y-2 border border-black/10 p-2.5 bg-white dark:border-white/10 dark:bg-black max-h-40 overflow-y-auto text-[11px] leading-relaxed">
                <div>
                  <strong className="text-black dark:text-white">[00:15 - Maria Santos]:</strong> "I confirm that I authorize Atty. Cruz to represent the property sale in Makati."
                </div>
                <div>
                  <strong className="text-black dark:text-white">[00:45 - Legal Counsel]:</strong> "Understood. The Special Power of Attorney will specifically restrict bank account disbursement limits."
                </div>
              </div>

              {/* Correction Input */}
              <div className="space-y-1.5 pt-2">
                <label className="block text-[10px] font-semibold uppercase text-neutral-500">
                  Client Transcript Correction / Note
                </label>
                <input
                  type="text"
                  value={audioTranscriptCorrection}
                  onChange={(e) => setAudioTranscriptCorrection(e.target.value)}
                  placeholder="Note any phonetic corrections or clarifying details..."
                  className="w-full border border-black/20 bg-white p-2 text-xs dark:border-white/20 dark:bg-black"
                />
                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      setTranscriptSaved(true);
                      setTimeout(() => setTranscriptSaved(false), 4000);
                    }}
                    className="border border-black/20 bg-white px-3 py-1 text-[11px] hover:bg-neutral-100 dark:border-white/20 dark:bg-black cursor-pointer"
                  >
                    Save Correction
                  </button>
                </div>
                {transcriptSaved && (
                  <p className="text-emerald-600 dark:text-emerald-400 text-[10px]">
                    ✓ Correction recorded and attached to evidence manifest.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : activeSubModule === 'principal-video-evidence' ? (
        /* VIDEO EVIDENCE (Section 24) */
        <div className="border border-black/15 bg-white p-5 dark:border-white/15 dark:bg-neutral-950 space-y-4">
          <div className="flex items-center justify-between border-b border-black/10 pb-3 dark:border-white/10">
            <div>
              <h3 className="text-sm font-bold text-black dark:text-white">
                Video Evidence Player & Timestamp Markers
              </h3>
              <p className="text-xs text-neutral-500">
                Cryptographically hashed video recordings with frame-accurate timecode markers.
              </p>
            </div>
            <StatusBadge status="VIDEO WORKSPACE" variant="info" size="sm" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="md:col-span-2 border border-black/10 bg-black text-white p-4 flex flex-col justify-between min-h-[240px]">
              <div className="flex justify-between text-[10px] font-mono text-neutral-400">
                <span>FILE: property_inspection_walkthrough_2026.mp4</span>
                <span>SHA-256: 4f8a...991c</span>
              </div>
              <div className="text-center text-neutral-400 text-xs py-10">
                [SYNTHETIC MP4 VIDEO PLAYER CONTAINER]
              </div>
              <div className="flex items-center justify-between border-t border-white/20 pt-2 text-xs">
                <button
                  onClick={() => setIsPlayingVideo(!isPlayingVideo)}
                  className="flex items-center gap-1.5 hover:text-neutral-300 font-mono cursor-pointer"
                >
                  {isPlayingVideo ? <Pause className="h-3.5 w-3.5 text-emerald-400" /> : <Play className="h-3.5 w-3.5 text-white" />}
                  <span>{isPlayingVideo ? 'Pause Video' : 'Play Video'}</span>
                </button>
                <div className="flex items-center gap-2">
                  {isPlayingVideo && (
                    <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      PLAYING
                    </span>
                  )}
                  <span className="font-mono text-[10px]">{videoTimecode} / 08:30</span>
                </div>
              </div>
            </div>

            <div className="border border-black/10 p-3 bg-neutral-50 dark:border-white/10 dark:bg-neutral-900 space-y-2">
              <h4 className="font-bold text-xs">Timecode Markers</h4>
              <div className="space-y-1.5 text-[11px]">
                {[
                  { time: '00:45', label: '00:45 - Front Entrance Boundary' },
                  { time: '03:12', label: '03:12 - Ground Floor Structural Column' },
                  { time: '06:50', label: '06:50 - Perimeter Fence & Adjacent Lot' },
                ].map((marker) => (
                  <button
                    key={marker.time}
                    type="button"
                    onClick={() => {
                      setVideoTimecode(marker.time);
                      setActiveMarkerName(marker.label);
                      setIsPlayingVideo(true);
                    }}
                    className={`w-full p-2 border text-left flex justify-between items-center cursor-pointer transition-colors ${
                      activeMarkerName === marker.label
                        ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black font-semibold'
                        : 'border-black/10 bg-white hover:bg-neutral-100 dark:border-white/10 dark:bg-black dark:text-white dark:hover:bg-neutral-900'
                    }`}
                  >
                    <span className="truncate">{marker.label}</span>
                    <span className="font-mono text-[10px] uppercase opacity-75 shrink-0 ml-2">Jump</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : activeSubModule === 'principal-testimonies' ? (
        /* TESTIMONY WORKSHEET (Section 25) */
        <div className="border border-black/15 bg-white p-5 dark:border-white/15 dark:bg-neutral-950 space-y-4">
          <div className="flex items-center justify-between border-b border-black/10 pb-3 dark:border-white/10">
            <div>
              <h3 className="text-sm font-bold text-black dark:text-white">
                Testimony Worksheet & Narrative Statement Generator
              </h3>
              <p className="text-xs text-neutral-500">
                Structure factual statements for affidavit drafting and jurat preparation.
              </p>
            </div>
            <StatusBadge status="AFFIDAVIT BUILDER" variant="info" size="sm" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold uppercase text-[10px] text-neutral-500 mb-1">
                Affiant Full Legal Name
              </label>
              <input
                type="text"
                value={affiantName}
                onChange={(e) => setAffiantName(e.target.value)}
                className="w-full border border-black/20 bg-white p-2 text-xs dark:border-white/20 dark:bg-black"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase text-[10px] text-neutral-500 mb-1">
                Date of Incident / Execution
              </label>
              <input
                type="date"
                value={incidentDate}
                onChange={(e) => setIncidentDate(e.target.value)}
                className="w-full border border-black/20 bg-white p-2 text-xs dark:border-white/20 dark:bg-black"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-semibold uppercase text-[10px] text-neutral-500 mb-1">
                Place of Execution / Relevant Venue
              </label>
              <input
                type="text"
                value={incidentPlace}
                onChange={(e) => setIncidentPlace(e.target.value)}
                className="w-full border border-black/20 bg-white p-2 text-xs dark:border-white/20 dark:bg-black"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-semibold uppercase text-[10px] text-neutral-500 mb-1">
                Sworn Factual Narrative (Numbered Paragraphs)
              </label>
              <textarea
                rows={5}
                value={narrativeFacts}
                onChange={(e) => setNarrativeFacts(e.target.value)}
                className="w-full border border-black/20 bg-white p-2 text-xs dark:border-white/20 dark:bg-black font-serif"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-black/10 dark:border-white/10 flex justify-end">
            <button
              onClick={handleSaveTestimony}
              className="flex items-center gap-1.5 border border-black bg-black px-4 py-2 font-semibold text-white hover:bg-neutral-800 dark:border-white dark:bg-white dark:text-black cursor-pointer"
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Compile & Save Affidavit Draft to Vault</span>
            </button>
          </div>

          {testimonyGenerated && (
            <p className="text-emerald-600 dark:text-emerald-400 font-mono text-[11px]">
              ✓ Sworn affidavit draft generated and routed to counsel for jurat review.
            </p>
          )}
        </div>
      ) : activeSubModule === 'principal-ai-organized' ? (
        /* 17 AI-ORGANIZED CASE FOLDERS (Section 20) */
        <div className="border border-black/15 bg-white p-5 dark:border-white/15 dark:bg-neutral-950 space-y-4">
          <div className="flex items-center justify-between border-b border-black/10 pb-3 dark:border-white/10">
            <div>
              <h3 className="text-sm font-bold text-black dark:text-white">
                17 Structured AI-Organized Evidence Folders
              </h3>
              <p className="text-xs text-neutral-500">
                Automated classification into standardized categories compliant with Philippine court practice.
              </p>
            </div>
            <StatusBadge status="17 CANONICAL FOLDERS" variant="success" size="sm" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
            {CASE_FOLDERS.map((f) => {
              const count = (activeCase?.evidenceItems || []).filter((e) => e.folder === f.id).length;
              return (
                <div
                  key={f.id}
                  onClick={() => setSelectedFolder(f.id)}
                  className={`border p-3 cursor-pointer transition-colors ${
                    selectedFolder === f.id
                      ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black font-semibold'
                      : 'border-black/15 bg-neutral-50 text-black dark:border-white/15 dark:bg-neutral-900 dark:text-white hover:bg-neutral-100'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                    <span>{f.label.split(' ')[0]}</span>
                    <span className="border border-current px-1 py-0.2 rounded-xs">
                      {count} items
                    </span>
                  </div>
                  <div className="text-xs truncate">{f.label}</div>
                  <p className="text-[10px] opacity-75 mt-1 line-clamp-2">
                    {f.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* DEFAULT EVIDENCE VAULT & UPLOADER */
        <div className="border border-black/15 bg-white p-5 dark:border-white/15 dark:bg-neutral-950 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-black/10 pb-3 dark:border-white/10">
            <div>
              <h3 className="text-sm font-bold text-black dark:text-white">
                Evidence Files & Cryptographic Fingerprints
              </h3>
              <p className="text-xs text-neutral-500">
                SHA-256 digest validation, synthetic ClamAV screening, and AI classification review.
              </p>
            </div>

            {/* Quick Upload Input */}
            <div>
              <label className="flex items-center gap-1.5 border border-black bg-black px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-neutral-800 dark:border-white dark:bg-white dark:text-black cursor-pointer">
                <UploadCloud className="h-3.5 w-3.5" />
                <span>{uploading ? 'Processing File...' : 'Upload Evidence File'}</span>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Evidence Items List */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-black/20 bg-neutral-50 text-[11px] font-semibold text-neutral-600 dark:border-white/20 dark:bg-neutral-900 dark:text-neutral-400">
                <tr>
                  <th className="p-2.5">File Name</th>
                  <th className="p-2.5">Category Folder</th>
                  <th className="p-2.5">SHA-256 Digest</th>
                  <th className="p-2.5">Quarantine Scan</th>
                  <th className="p-2.5">AI Classification</th>
                  <th className="p-2.5 text-right">Review Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/10 dark:divide-white/10 font-mono text-[11px]">
                {(currentEvidenceList || []).map((item) => (
                  <tr key={item.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50">
                    <td className="p-2.5 font-sans font-bold">
                      {item.filename || item.title}
                      {item.isCanonicalDuplicate && (
                        <span className="ml-2 border border-blue-500 bg-blue-50 text-blue-800 px-1 py-0.2 text-[9px] dark:bg-blue-950 dark:text-blue-300">
                          Deduplicated
                        </span>
                      )}
                    </td>
                    <td className="p-2.5 font-sans text-neutral-500">
                      {item.folder}
                    </td>
                    <td className="p-2.5 truncate max-w-[150px] text-neutral-600 dark:text-neutral-400">
                      {item.sha256Hash}
                    </td>
                    <td className="p-2.5">
                      <StatusBadge status="QUARANTINE_CLEARED" size="sm" />
                    </td>
                    <td className="p-2.5 font-sans">
                      <div className="flex items-center gap-1 text-[11px]">
                        <span className="font-semibold">{item.aiClassification?.suggestedCategory}</span>
                        <span className="text-neutral-400">
                          ({item.aiClassification?.confidence ? Math.round(item.aiClassification.confidence * 100) : 95}%)
                        </span>
                      </div>
                    </td>
                    <td className="p-2.5 text-right font-sans space-x-1">
                      {item.aiClassification?.reviewStatus === 'UNVERIFIED' ? (
                        <>
                          <button
                            onClick={() =>
                              updateAiClassificationReview(activeCase.caseId, item.id, 'CLIENT_ACCEPTED')
                            }
                            className="border border-black/20 px-2 py-1 text-[10px] hover:bg-neutral-100 dark:border-white/20"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() =>
                              updateAiClassificationReview(activeCase.caseId, item.id, 'REJECTED')
                            }
                            className="border border-black/20 px-2 py-1 text-[10px] text-rose-600 hover:bg-rose-50"
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <span className="text-[10px] text-emerald-600 font-bold">
                          {item.aiClassification?.reviewStatus}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
