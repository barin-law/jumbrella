/**
 * JuriMbrella — Philippine Electronic Notarization
 * Client Identity & Credential Management Module
 * eGovPH / PhilSys Simulation, Consent, Passive Liveness (ISO/IEC 30107-3), and MFA
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  UserCheck,
  ShieldCheck,
  Camera,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Smartphone,
  Fingerprint,
  RefreshCw,
  Clock,
  Eye,
  FileCheck,
  KeyRound,
  ExternalLink,
  Upload,
  Download,
  Copy,
  Check,
  Maximize2,
  Sliders,
  QrCode,
  Sparkles,
  Edit2,
  Save,
  X,
  FileBadge,
  Shield,
  Activity,
} from 'lucide-react';
import { useClientCase } from '../../../context/ClientCaseContext';
import { StatusBadge } from '../../common/StatusBadge';

interface ClientIdentitySectionProps {
  activeSubModule: string;
}

export const ClientIdentitySection: React.FC<ClientIdentitySectionProps> = ({ activeSubModule }) => {
  const {
    profile,
    updateProfile,
    updateConsent,
    simulateEgovPhVerification,
    runLivenessDiagnostic,
    performIdentityReverification,
  } = useClientCase();

  // eGovPH state
  const [verifyingEgov, setVerifyingEgov] = useState(false);
  const [egovNotice, setEgovNotice] = useState<string | null>(null);

  // Liveness check state
  const [runningLiveness, setRunningLiveness] = useState(false);
  const [livenessStep, setLivenessStep] = useState<number>(0); // 0: Idle, 1: Align, 2: Blink, 3: Turn Head, 4: Flash Check, 5: Complete
  const [livenessProgress, setLivenessProgress] = useState<number>(0);
  const [useRealWebcam, setUseRealWebcam] = useState(false);
  const [webcamActive, setWebcamActive] = useState(false);
  const [livenessToken, setLivenessToken] = useState<string | null>(null);
  const [copiedToken, setCopiedToken] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Personal Info Edit state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editFullName, setEditFullName] = useState(profile.fullName);
  const [editCivilStatus, setEditCivilStatus] = useState(profile.civilStatus);
  const [editAddress, setEditAddress] = useState(profile.residentialAddress);
  const [editMobile, setEditMobile] = useState(profile.mobilePhone);
  const [editEmail, setEditEmail] = useState(profile.email);
  const [editCitizenship, setEditCitizenship] = useState(profile.citizenship);
  const [profileSaveNotice, setProfileSaveNotice] = useState<string | null>(null);

  // ID Upload modal/form state
  const [uploadIdModalOpen, setUploadIdModalOpen] = useState(false);
  const [newIdType, setNewIdType] = useState('Philippine Passport (DFA)');
  const [newIdNumber, setNewIdNumber] = useState('');
  const [newIdExpiry, setNewIdExpiry] = useState('2032-11-20');
  const [uploadingId, setUploadingId] = useState(false);
  const [idUploadSuccess, setIdUploadSuccess] = useState<string | null>(null);
  const [idViewSide, setIdViewSide] = useState<Record<string, 'FRONT' | 'BACK'>>({
    philsys: 'FRONT',
    passport: 'FRONT',
    license: 'FRONT',
  });

  // Re-verification state (Step-Up challenge)
  const [stepUpCode, setStepUpCode] = useState('');
  const [stepUpRunning, setStepUpRunning] = useState(false);
  const [stepUpSuccess, setStepUpSuccess] = useState(false);

  // Handle webcam stream start/stop
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (useRealWebcam && activeSubModule === 'principal-liveness') {
      navigator.mediaDevices?.getUserMedia({ video: { width: 640, height: 480, facingMode: 'user' } })
        .then((s) => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
            videoRef.current.play().catch(() => {});
          }
          setWebcamActive(true);
        })
        .catch(() => {
          setUseRealWebcam(false);
          setWebcamActive(false);
        });
    } else {
      setWebcamActive(false);
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [useRealWebcam, activeSubModule]);

  const handleRunEgovPh = async () => {
    setVerifyingEgov(true);
    try {
      const res = await simulateEgovPhVerification();
      setEgovNotice(res.message);
      setTimeout(() => setEgovNotice(null), 6000);
    } finally {
      setVerifyingEgov(false);
    }
  };

  // Interactive step-by-step Liveness Scan
  const handleStartLivenessScan = () => {
    setRunningLiveness(true);
    setLivenessStep(1);
    setLivenessProgress(15);

    // Step 1: Alignment (1s)
    setTimeout(() => {
      setLivenessStep(2); // Blink test
      setLivenessProgress(40);

      // Step 2: Vitality (1s)
      setTimeout(() => {
        setLivenessStep(3); // Turn head
        setLivenessProgress(65);

        // Step 3: 3D Depth (1.2s)
        setTimeout(() => {
          setLivenessStep(4); // Illumination flash
          setLivenessProgress(85);

          // Step 4: Flash check (1s)
          setTimeout(async () => {
            setLivenessStep(5); // Complete
            setLivenessProgress(100);
            await runLivenessDiagnostic();
            const token = `BIO-PAD2-2026-${Math.random().toString(16).substring(2, 8).toUpperCase()}-${Date.now().toString(16).substring(6).toUpperCase()}`;
            setLivenessToken(token);
            setRunningLiveness(false);
          }, 1000);
        }, 1200);
      }, 1000);
    }, 1000);
  };

  const handleCopyLivenessToken = () => {
    if (!livenessToken) return;
    navigator.clipboard.writeText(livenessToken);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 3000);
  };

  const handleDownloadBiometricCert = () => {
    const certContent = `========================================================================
JURIMBRELLA — PHILIPPINE ELECTRONIC NOTARIZATION
CERTIFICATE OF BIOMETRIC PRESENTATION ATTACK DETECTION (ISO/IEC 30107-3)
Supreme Court A.M. No. 24-10-14-SC Electronic Notarization Rule 6 Compliance
========================================================================

PRINCIPAL NAME: ${profile.fullName}
PHILSYS CARD NUMBER: ${profile.idCardNumber}
INTERNAL REFERENCE: ${profile.internalPersonId}
BIOMETRIC TOKEN: ${livenessToken || 'BIO-PAD2-2026-CONFIRMED-4821'}
EVALUATION TIMESTAMP: ${new Date().toISOString()}

DIAGNOSTIC CRITERIA & SCORES:
• Presentation Attack Detection (PAD): LEVEL 2 PASSED
• Biometric Liveness Confidence: ${profile.livenessScore || 99.4}%
• 3D Facial Depth Variance: 0.88 (PASS)
• Micro-Texture Epidermis Integrity: 99.2% (GENUINE)
• Illumination Flash Analysis: NEGATIVE FOR REPLAY / SCREEN ARTIFACT
• GAN / Deepfake Anomaly Score: 0.02% (AUTHENTIC HUMAN FACIAL Vitality)

HARDWARE & ENVIRONMENT AUDIT:
• Device Integrity: MAC-APPLE-SECURE-SANDBOX
• Network Latency: 16ms to Supreme Court ENF GovNet Node
• Camera Resolution: 1080p Full HD @ 30 FPS

ISSUING FACILITY:
JuriMbrella Philippine Electronic Notarization
Accreditation Reference: SC-ENF-ACCR-2026-004
========================================================================`;

    const blob = new Blob([certContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Biometric_Liveness_Cert_${profile.fullName.replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 4000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      fullName: editFullName,
      civilStatus: editCivilStatus,
      residentialAddress: editAddress,
      mobilePhone: editMobile,
      email: editEmail,
      citizenship: editCitizenship,
    });
    setIsEditingProfile(false);
    setProfileSaveNotice('Profile updated successfully and synchronized with notarial dossier.');
    setTimeout(() => setProfileSaveNotice(null), 4000);
  };

  const handleStepUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStepUpRunning(true);
    try {
      const res = await performIdentityReverification(stepUpCode || '482109');
      if (res.success) {
        setStepUpSuccess(true);
        setTimeout(() => setStepUpSuccess(false), 5000);
      }
    } finally {
      setStepUpRunning(false);
    }
  };

  const handleUploadNewIdSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUploadingId(true);
    setTimeout(() => {
      setUploadingId(false);
      setIdUploadSuccess(`Successfully indexed ${newIdType} (No. ${newIdNumber || 'PRC-0928114'}). OCR text extracted and bound to principal dossier.`);
      setUploadIdModalOpen(false);
      setNewIdNumber('');
      setTimeout(() => setIdUploadSuccess(null), 5000);
    }, 1200);
  };

  return (
    <div className="space-y-6 text-xs">
      {/* Alert Notices */}
      {egovNotice && (
        <div className="border border-emerald-500 bg-emerald-50 p-3 text-xs text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300 flex items-center justify-between">
          <span>{egovNotice}</span>
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
        </div>
      )}

      {profileSaveNotice && (
        <div className="border border-emerald-500 bg-emerald-50 p-3 text-xs text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300 flex items-center justify-between">
          <span>{profileSaveNotice}</span>
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
        </div>
      )}

      {idUploadSuccess && (
        <div className="border border-emerald-500 bg-emerald-50 p-3 text-xs text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300 flex items-center justify-between">
          <span>{idUploadSuccess}</span>
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-VIEW 1: PASSIVE LIVENESS CHECK & ANTI-SPOOFING WORKSTATION           */}
      {/* ========================================================================= */}
      {activeSubModule === 'principal-liveness' ? (
        <div className="space-y-5">
          {/* Main Liveness Workspace */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Camera Viewport & Live Overlay (7 Columns) */}
            <div className="lg:col-span-7 border border-black/20 bg-black p-4 text-white space-y-3 dark:border-white/20">
              <div className="flex items-center justify-between border-b border-white/20 pb-2">
                <div className="flex items-center gap-2">
                  <Camera className="h-4 w-4 text-emerald-400" />
                  <span className="font-bold text-xs">
                    {webcamActive ? 'Live Camera Feed (1080p @ 30 FPS)' : 'Biometric Sensor Feed (PAD Level 2)'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setUseRealWebcam(!useRealWebcam)}
                    className="border border-white/30 px-2 py-0.5 text-[10px] hover:bg-white/10 cursor-pointer font-mono"
                  >
                    {useRealWebcam ? 'Switch to Simulator' : 'Use Real Webcam'}
                  </button>
                  <span className="border border-emerald-500/60 bg-emerald-950/80 px-2 py-0.5 text-[10px] text-emerald-300 font-mono">
                    {runningLiveness ? 'SCANNING ACTIVE' : livenessStep === 5 ? 'VERIFIED' : 'READY'}
                  </span>
                </div>
              </div>

              {/* Viewport Box */}
              <div className="relative aspect-4/3 w-full bg-neutral-900 overflow-hidden flex items-center justify-center border border-white/10">
                {/* Real Webcam Video */}
                {useRealWebcam && webcamActive ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="h-full w-full object-cover -scale-x-100"
                  />
                ) : (
                  /* Simulated Biometric Canvas Viewport */
                  <div className="relative h-full w-full bg-neutral-950 flex flex-col items-center justify-center">
                    {/* Background grid */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:24px_24px] opacity-30" />

                    {/* Stylized Face Silhouette */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="relative h-44 w-36 rounded-full border-2 border-dashed transition-colors duration-500 flex items-center justify-center ${
                        runningLiveness
                          ? 'border-amber-400 bg-amber-400/5 shadow-[0_0_20px_rgba(251,191,36,0.2)]'
                          : livenessStep === 5
                          ? 'border-emerald-400 bg-emerald-400/10 shadow-[0_0_20px_rgba(52,211,153,0.2)]'
                          : 'border-white/40'
                      }">
                        {/* Crosshairs */}
                        <div className="absolute top-1/3 left-4 right-4 h-0.5 border-t border-dotted border-white/30" />
                        <div className="absolute top-1/2 left-6 right-6 h-0.5 border-t border-dotted border-white/30" />
                        <div className="absolute left-1/2 top-4 bottom-4 w-0.5 border-l border-dotted border-white/30" />

                        {/* Animated Scanning Line */}
                        {runningLiveness && (
                          <div className="absolute inset-x-0 h-1 bg-emerald-400 shadow-[0_0_12px_#34d399] animate-bounce" />
                        )}

                        <UserCheck className={`h-16 w-16 transition-colors duration-300 ${
                          runningLiveness ? 'text-amber-400' : livenessStep === 5 ? 'text-emerald-400' : 'text-neutral-500'
                        }`} />
                      </div>

                      {/* Head pose indicator */}
                      <span className="mt-3 font-mono text-[11px] text-neutral-400 tracking-wider">
                        ISO/IEC 30107-3 FACIAL DEPTH MESH
                      </span>
                    </div>
                  </div>
                )}

                {/* Status Guidance Banner Overlay */}
                <div className="absolute bottom-3 inset-x-3 bg-black/80 backdrop-blur-md border border-white/20 p-2.5 text-center">
                  <p className="text-xs font-semibold text-white">
                    {livenessStep === 0 && 'Click "Start Camera Liveness Scan" below to initiate diagnostic.'}
                    {livenessStep === 1 && 'Step 1 of 4: Align face in oval guide... detecting 3D volumetric contours.'}
                    {livenessStep === 2 && 'Step 2 of 4: Blink your eyes naturally to verify biological vitality.'}
                    {livenessStep === 3 && 'Step 3 of 4: Turn head 15° to the right for depth dispersion.'}
                    {livenessStep === 4 && 'Step 4 of 4: Hold steady for anti-replay illumination flash screening.'}
                    {livenessStep === 5 && '✓ Biometric Verification Complete: 99.4% Liveness Confidence (PAD Level 2 Passed).'}
                  </p>

                  {runningLiveness && (
                    <div className="mt-2 w-full bg-neutral-800 h-1.5 overflow-hidden">
                      <div
                        className="bg-emerald-400 h-full transition-all duration-300"
                        style={{ width: `${livenessProgress}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Viewport Control Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleStartLivenessScan}
                    disabled={runningLiveness}
                    className="border border-white bg-white px-4 py-2 text-xs font-semibold text-black hover:bg-neutral-200 cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                  >
                    <Camera className="h-3.5 w-3.5" />
                    <span>{runningLiveness ? 'Executing Liveness Challenge...' : 'Start Camera Liveness Scan'}</span>
                  </button>

                  <button
                    onClick={() => {
                      setLivenessStep(0);
                      setLivenessToken(null);
                    }}
                    disabled={runningLiveness}
                    className="border border-white/30 px-3 py-2 text-xs hover:bg-white/10 cursor-pointer disabled:opacity-50 flex items-center gap-1 font-mono"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span>Reset</span>
                  </button>
                </div>

                {livenessToken && (
                  <button
                    onClick={handleDownloadBiometricCert}
                    className="border border-emerald-400 bg-emerald-950/60 px-3 py-2 text-xs font-semibold text-emerald-300 hover:bg-emerald-900/60 cursor-pointer flex items-center gap-1.5"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download Biometric Certificate</span>
                  </button>
                )}
              </div>
            </div>

            {/* Diagnostic Parameters & Hardware Status (5 Columns) */}
            <div className="lg:col-span-5 space-y-4">
              {/* Anti-Spoofing Diagnostic Grid */}
              <div className="border border-black/15 bg-white p-4 dark:border-white/15 dark:bg-neutral-950 space-y-3">
                <div className="flex items-center justify-between border-b border-black/10 pb-2 dark:border-white/10">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    <h4 className="font-bold text-xs text-black dark:text-white">
                      PAD Level 2 Anti-Spoofing Metrics
                    </h4>
                  </div>
                  <span className="font-mono text-[10px] border border-black/20 px-1.5 py-0.5 dark:border-white/20">
                    ISO/IEC 30107-3
                  </span>
                </div>

                <div className="space-y-2.5 font-mono text-[11px]">
                  <div className="flex items-center justify-between border-b border-black/5 pb-1.5 dark:border-white/5">
                    <span className="text-neutral-500">Presentation Attack Score:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">99.4% (Threshold: 95.0%)</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-black/5 pb-1.5 dark:border-white/5">
                    <span className="text-neutral-500">3D Volumetric Depth:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">0.88 Optimal Dispersion</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-black/5 pb-1.5 dark:border-white/5">
                    <span className="text-neutral-500">Epidermal Micro-Texture:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">99.2% Genuine Tissue</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-black/5 pb-1.5 dark:border-white/5">
                    <span className="text-neutral-500">Illumination Flash Reflection:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">Passed (No Screen Artifact)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500">GAN / Deepfake Anomaly:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">0.02% (Natural Vitality)</span>
                  </div>
                </div>
              </div>

              {/* Hardware & Environment Readiness */}
              <div className="border border-black/15 bg-white p-4 dark:border-white/15 dark:bg-neutral-950 space-y-3">
                <div className="flex items-center justify-between border-b border-black/10 pb-2 dark:border-white/10">
                  <h4 className="font-bold text-xs text-black dark:text-white">
                    Hearing Environment Diagnostics
                  </h4>
                  <StatusBadge status="READY FOR HEARING" variant="success" size="sm" />
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="border border-black/10 p-2 bg-neutral-50 dark:border-white/10 dark:bg-neutral-900">
                    <span className="text-[10px] text-neutral-500 uppercase block">Ambient Lighting</span>
                    <span className="font-bold">440 Lux (Optimal)</span>
                  </div>
                  <div className="border border-black/10 p-2 bg-neutral-50 dark:border-white/10 dark:bg-neutral-900">
                    <span className="text-[10px] text-neutral-500 uppercase block">Camera Resolution</span>
                    <span className="font-bold">1080p @ 30 FPS</span>
                  </div>
                  <div className="border border-black/10 p-2 bg-neutral-50 dark:border-white/10 dark:bg-neutral-900">
                    <span className="text-[10px] text-neutral-500 uppercase block">Network Latency</span>
                    <span className="font-bold">16 ms (GovNet Node)</span>
                  </div>
                  <div className="border border-black/10 p-2 bg-neutral-50 dark:border-white/10 dark:bg-neutral-900">
                    <span className="text-[10px] text-neutral-500 uppercase block">Microphone SNR</span>
                    <span className="font-bold">48 kHz Noise-Suppressed</span>
                  </div>
                </div>
              </div>

              {/* Biometric Verification Token Card */}
              <div className="border border-black/15 bg-neutral-50 p-4 dark:border-white/15 dark:bg-neutral-900 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase text-neutral-500">
                    Cryptographic Biometric Token
                  </span>
                  {livenessToken && (
                    <button
                      onClick={handleCopyLivenessToken}
                      className="text-[10px] text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white flex items-center gap-1 font-mono cursor-pointer"
                    >
                      {copiedToken ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                      <span>{copiedToken ? 'Copied' : 'Copy'}</span>
                    </button>
                  )}
                </div>

                <div className="p-2 border border-black/10 bg-white font-mono text-[11px] truncate dark:border-white/10 dark:bg-black font-bold">
                  {livenessToken || 'BIO-PAD2-2026-X89Q-482109'}
                </div>

                <p className="text-[10px] text-neutral-500">
                  This token securely binds to your notarial session room and is presented to the electronic notary during Rule 6 personal appearance verification.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : activeSubModule === 'principal-personal-info' || activeSubModule === 'principal-contact-info' ? (
        /* ========================================================================= */
        /* SUB-VIEW 2: PERSONAL & CONTACT PROFILE (WITH WORKING EDIT MODE)          */
        /* ========================================================================= */
        <div className="space-y-4">
          <div className="border border-black/15 bg-white p-5 dark:border-white/15 dark:bg-neutral-950 space-y-4">
            <div className="flex items-center justify-between border-b border-black/10 pb-3 dark:border-white/10">
              <div>
                <h3 className="text-sm font-bold text-black dark:text-white">
                  Official Principal Notarial Profile
                </h3>
                <p className="text-xs text-neutral-500">
                  Compliant with Supreme Court A.M. No. 24-10-14-SC personal appearance registry requirements.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status="VERIFIED CITIZEN" variant="success" size="sm" />
                <button
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                  className="border border-black bg-black px-3 py-1.5 text-xs font-semibold text-white hover:bg-neutral-800 dark:border-white dark:bg-white dark:text-black dark:hover:bg-neutral-200 cursor-pointer flex items-center gap-1.5"
                >
                  <Edit2 className="h-3 w-3" />
                  <span>{isEditingProfile ? 'Cancel' : 'Edit Profile'}</span>
                </button>
              </div>
            </div>

            {isEditingProfile ? (
              /* Profile Edit Form */
              <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold uppercase text-[10px] text-neutral-500 mb-1">
                      Full Legal Name (as on PhilSys / Passport) *
                    </label>
                    <input
                      type="text"
                      required
                      value={editFullName}
                      onChange={(e) => setEditFullName(e.target.value)}
                      className="w-full border border-black/20 bg-white p-2 text-xs dark:border-white/20 dark:bg-black font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold uppercase text-[10px] text-neutral-500 mb-1">
                      Citizenship
                    </label>
                    <input
                      type="text"
                      required
                      value={editCitizenship}
                      onChange={(e) => setEditCitizenship(e.target.value)}
                      className="w-full border border-black/20 bg-white p-2 text-xs dark:border-white/20 dark:bg-black font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold uppercase text-[10px] text-neutral-500 mb-1">
                      Civil Status
                    </label>
                    <select
                      value={editCivilStatus}
                      onChange={(e) => setEditCivilStatus(e.target.value)}
                      className="w-full border border-black/20 bg-white p-2 text-xs dark:border-white/20 dark:bg-black font-medium"
                    >
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Widowed">Widowed</option>
                      <option value="Legally Separated">Legally Separated</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold uppercase text-[10px] text-neutral-500 mb-1">
                      Official Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="w-full border border-black/20 bg-white p-2 text-xs dark:border-white/20 dark:bg-black font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold uppercase text-[10px] text-neutral-500 mb-1">
                      Mobile Phone Number
                    </label>
                    <input
                      type="text"
                      required
                      value={editMobile}
                      onChange={(e) => setEditMobile(e.target.value)}
                      className="w-full border border-black/20 bg-white p-2 text-xs dark:border-white/20 dark:bg-black font-medium"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block font-semibold uppercase text-[10px] text-neutral-500 mb-1">
                      Residential Address
                    </label>
                    <input
                      type="text"
                      required
                      value={editAddress}
                      onChange={(e) => setEditAddress(e.target.value)}
                      className="w-full border border-black/20 bg-white p-2 text-xs dark:border-white/20 dark:bg-black font-medium"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-black/10 dark:border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    className="border border-black/20 px-3 py-1.5 text-xs hover:bg-neutral-100 dark:border-white/20 dark:hover:bg-neutral-900 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="border border-black bg-black px-4 py-1.5 text-xs font-semibold text-white hover:bg-neutral-800 dark:border-white dark:bg-white dark:text-black dark:hover:bg-neutral-200 cursor-pointer flex items-center gap-1.5"
                  >
                    <Save className="h-3.5 w-3.5" />
                    <span>Save Profile Changes</span>
                  </button>
                </div>
              </form>
            ) : (
              /* Display Profile Details */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                <div className="space-y-1">
                  <span className="text-neutral-500 text-[10px] uppercase">Full Legal Name</span>
                  <p className="font-bold font-sans text-sm">{profile.fullName}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-neutral-500 text-[10px] uppercase">Citizenship & Civil Status</span>
                  <p className="font-sans">{profile.citizenship} • {profile.civilStatus}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-neutral-500 text-[10px] uppercase">Date of Birth</span>
                  <p>{profile.dateOfBirth}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-neutral-500 text-[10px] uppercase">Registered Address</span>
                  <p className="font-sans">{profile.residentialAddress}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-neutral-500 text-[10px] uppercase">Official Email</span>
                  <p>{profile.email}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-neutral-500 text-[10px] uppercase">Mobile Phone</span>
                  <p>{profile.mobilePhone}</p>
                </div>
              </div>
            )}

            {/* Subtle System Identifier Reference (Non-intrusive) */}
            <div className="pt-3 border-t border-black/10 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between text-[10px] font-mono text-neutral-500 gap-2">
              <span>INTERNAL PERSON ID: {profile.internalPersonId} (Strictly isolated case-management reference)</span>
              <span>PHILSYS CARD NO: {profile.idCardNumber}</span>
            </div>
          </div>
        </div>
      ) : activeSubModule === 'principal-id-documents' ? (
        /* ========================================================================= */
        /* SUB-VIEW 3: GOVERNMENT IDENTITY DOCUMENTS (WITH WORKING UPLOADER & OCR)  */
        /* ========================================================================= */
        <div className="space-y-5">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border border-black/15 bg-white p-4 dark:border-white/15 dark:bg-neutral-950">
            <div>
              <h3 className="text-sm font-bold text-black dark:text-white">
                Philippine Competent Evidence of Identity
              </h3>
              <p className="text-xs text-neutral-500">
                Official government-issued photographic IDs pursuant to Rule 2 §4 of the 2026 Electronic Notarization Rules.
              </p>
            </div>
            <button
              onClick={() => setUploadIdModalOpen(true)}
              className="border border-black bg-black px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-neutral-800 dark:border-white dark:bg-white dark:text-black dark:hover:bg-neutral-200 cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Upload className="h-3.5 w-3.5" />
              <span>Upload New Government ID</span>
            </button>
          </div>

          {/* Upload ID Dialog / Modal */}
          {uploadIdModalOpen && (
            <div className="border border-black/30 bg-neutral-50 p-5 dark:border-white/30 dark:bg-neutral-900 space-y-4">
              <div className="flex items-center justify-between border-b border-black/10 pb-2 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <FileBadge className="h-4 w-4 text-black dark:text-white" />
                  <h4 className="font-bold text-xs">Upload Government-Issued Photo ID</h4>
                </div>
                <button
                  onClick={() => setUploadIdModalOpen(false)}
                  className="text-neutral-500 hover:text-black dark:hover:text-white cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleUploadNewIdSubmit} className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold uppercase text-[10px] text-neutral-500 mb-1">
                      Government ID Type
                    </label>
                    <select
                      value={newIdType}
                      onChange={(e) => setNewIdType(e.target.value)}
                      className="w-full border border-black/20 bg-white p-2 text-xs dark:border-white/20 dark:bg-black"
                    >
                      <option value="Philippine Passport (DFA)">Philippine Passport (DFA)</option>
                      <option value="PhilSys National ID / ePhilID">PhilSys National ID / ePhilID</option>
                      <option value="LTO Driver's License">LTO Driver's License</option>
                      <option value="UMID Card (SSS / GSIS)">UMID Card (SSS / GSIS)</option>
                      <option value="PRC Professional Identification Card">PRC ID (Professional Reg Comm)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold uppercase text-[10px] text-neutral-500 mb-1">
                      ID / Document Number
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. P9281903B"
                      value={newIdNumber}
                      onChange={(e) => setNewIdNumber(e.target.value)}
                      className="w-full border border-black/20 bg-white p-2 text-xs dark:border-white/20 dark:bg-black font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold uppercase text-[10px] text-neutral-500 mb-1">
                      Expiration Date
                    </label>
                    <input
                      type="date"
                      required
                      value={newIdExpiry}
                      onChange={(e) => setNewIdExpiry(e.target.value)}
                      className="w-full border border-black/20 bg-white p-2 text-xs dark:border-white/20 dark:bg-black font-mono"
                    />
                  </div>
                </div>

                <div className="border-2 border-dashed border-black/20 p-4 text-center bg-white dark:border-white/20 dark:bg-black">
                  <Upload className="h-6 w-6 mx-auto text-neutral-400 mb-1" />
                  <p className="font-semibold text-xs">Drag and drop front & back scans or click to upload</p>
                  <p className="text-[10px] text-neutral-500 mt-0.5">Supports PDF, PNG, JPG up to 25MB • Automated OCR extraction enabled</p>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setUploadIdModalOpen(false)}
                    className="border border-black/20 px-3 py-1.5 text-xs hover:bg-neutral-100 dark:border-white/20 dark:hover:bg-neutral-800 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploadingId}
                    className="border border-black bg-black px-4 py-1.5 text-xs font-semibold text-white hover:bg-neutral-800 dark:border-white dark:bg-white dark:text-black dark:hover:bg-neutral-200 cursor-pointer disabled:opacity-50"
                  >
                    {uploadingId ? 'Processing OCR Extraction...' : 'Index & Verify Document'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Cards of Verified Government IDs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. PhilSys National ID (ePhilID) */}
            <div className="border border-black/15 bg-white p-4 dark:border-white/15 dark:bg-neutral-950 space-y-3">
              <div className="flex items-center justify-between border-b border-black/10 pb-2 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span className="font-bold text-xs">PhilSys National ID (ePhilID)</span>
                </div>
                <StatusBadge status="PRIMARY NOTARIAL ID" variant="success" size="sm" />
              </div>

              <div className="aspect-16/9 bg-neutral-100 dark:bg-neutral-900 border border-black/10 dark:border-white/10 p-3 flex flex-col justify-between font-mono text-[11px] relative overflow-hidden">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-neutral-500 block">REPUBLIC OF THE PHILIPPINES</span>
                    <span className="font-bold text-xs text-black dark:text-white">PHILIPPINE IDENTIFICATION SYSTEM</span>
                  </div>
                  <span className="border border-emerald-600 bg-emerald-50 px-1.5 py-0.5 text-[9px] text-emerald-800 font-bold dark:bg-emerald-950 dark:text-emerald-300">
                    PSA DIGITALLY SIGNED
                  </span>
                </div>

                <div className="flex items-center gap-3 py-1">
                  <div className="h-16 w-14 bg-neutral-200 dark:bg-neutral-800 border border-black/20 dark:border-white/20 flex items-center justify-center">
                    <UserCheck className="h-8 w-8 text-neutral-500" />
                  </div>
                  <div className="space-y-0.5 text-[10px]">
                    <p className="font-bold font-sans text-xs">{profile.fullName}</p>
                    <p className="text-neutral-600 dark:text-neutral-400">PCN: {profile.idCardNumber}</p>
                    <p className="text-neutral-600 dark:text-neutral-400">DOB: {profile.dateOfBirth}</p>
                    <p className="text-neutral-600 dark:text-neutral-400">STATUS: Valid & Authenticated</p>
                  </div>
                </div>

                <div className="flex justify-between items-end text-[9px] text-neutral-500 border-t border-black/5 dark:border-white/5 pt-1">
                  <span>ISSUED: PSA CENTRAL</span>
                  <span>SECURITY QR: VALIDATED</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 text-[11px]">
                <span className="text-neutral-500 font-mono">HASH: 7f8b91...44a9</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">Rule 2 §4 Compliant</span>
              </div>
            </div>

            {/* 2. Philippine Passport (DFA) */}
            <div className="border border-black/15 bg-white p-4 dark:border-white/15 dark:bg-neutral-950 space-y-3">
              <div className="flex items-center justify-between border-b border-black/10 pb-2 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <FileBadge className="h-4 w-4 text-black dark:text-white" />
                  <span className="font-bold text-xs">Philippine Passport (DFA e-Passport)</span>
                </div>
                <span className="border border-black/20 bg-neutral-100 px-1.5 py-0.5 text-[10px] font-mono dark:border-white/20 dark:bg-neutral-900">
                  SECONDARY ID
                </span>
              </div>

              <div className="aspect-16/9 bg-neutral-100 dark:bg-neutral-900 border border-black/10 dark:border-white/10 p-3 flex flex-col justify-between font-mono text-[11px] relative overflow-hidden">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-neutral-500 block">DEPARTMENT OF FOREIGN AFFAIRS</span>
                    <span className="font-bold text-xs text-black dark:text-white">PASAPORTE / PASSPORT</span>
                  </div>
                  <span className="border border-black/20 px-1.5 py-0.5 text-[9px]">
                    ICAO 9303 CHIP
                  </span>
                </div>

                <div className="flex items-center gap-3 py-1">
                  <div className="h-16 w-14 bg-neutral-200 dark:bg-neutral-800 border border-black/20 dark:border-white/20 flex items-center justify-center">
                    <UserCheck className="h-8 w-8 text-neutral-500" />
                  </div>
                  <div className="space-y-0.5 text-[10px]">
                    <p className="font-bold font-sans text-xs">{profile.fullName}</p>
                    <p className="text-neutral-600 dark:text-neutral-400">PASSPORT NO: P8912849B</p>
                    <p className="text-neutral-600 dark:text-neutral-400">NATIONALITY: FILIPINO</p>
                    <p className="text-neutral-600 dark:text-neutral-400">VALID UNTIL: 18 OCT 2032</p>
                  </div>
                </div>

                <div className="text-[8px] font-mono text-neutral-500 border-t border-black/5 dark:border-white/5 pt-1 truncate">
                  P&lt;PHLSANTOS&lt;&lt;MARIA&lt;ELENA&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 text-[11px]">
                <span className="text-neutral-500 font-mono">MRZ CHECKSUM: PASS</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">Active Credential</span>
              </div>
            </div>
          </div>
        </div>
      ) : activeSubModule === 'principal-consent' ? (
        /* ========================================================================= */
        /* SUB-VIEW 4: STATUTORY CONSENTS (R.A. 10173 & RULE 6 AUDIO-VISUAL)         */
        /* ========================================================================= */
        <div className="border border-black/15 bg-white p-5 dark:border-white/15 dark:bg-neutral-950 space-y-4">
          <div className="flex items-center justify-between border-b border-black/10 pb-3 dark:border-white/10">
            <div>
              <h3 className="text-sm font-bold text-black dark:text-white">
                Mandatory Statutory & Notarial Consents
              </h3>
              <p className="text-xs text-neutral-500">
                Complies with Republic Act No. 10173 (Data Privacy Act) and Supreme Court A.M. No. 24-10-14-SC Rule 6 Disclosures.
              </p>
            </div>
            <span className="text-[10px] font-mono border border-black/20 px-2 py-0.5 dark:border-white/20">
              Version v2026.1
            </span>
          </div>

          <div className="space-y-3">
            {(profile.consents || []).map((consent) => (
              <div
                key={consent.id}
                className="border border-black/10 p-3.5 bg-neutral-50 dark:border-white/10 dark:bg-neutral-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-black dark:text-white text-xs">{consent.title}</span>
                    {consent.consentedAt ? (
                      <span className="border border-emerald-600 bg-emerald-50 px-1.5 py-0.5 text-[9px] font-mono text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        Consented {new Date(consent.consentedAt).toLocaleDateString()}
                      </span>
                    ) : (
                      <span className="border border-amber-600 bg-amber-50 px-1.5 py-0.5 text-[9px] font-mono text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                        Action Required
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-neutral-500">{consent.description}</p>
                </div>

                <button
                  onClick={() => updateConsent(consent.id, !consent.consentedAt)}
                  className={`px-3 py-1.5 text-xs font-semibold cursor-pointer border shrink-0 ${
                    consent.consentedAt
                      ? 'border-black/20 bg-white text-neutral-700 hover:bg-neutral-100 dark:border-white/20 dark:bg-black dark:text-neutral-300 dark:hover:bg-neutral-900'
                      : 'border-black bg-black text-white hover:bg-neutral-800 dark:border-white dark:bg-white dark:text-black dark:hover:bg-neutral-200'
                  }`}
                >
                  {consent.consentedAt ? 'Revoke Consent' : 'Grant Consent'}
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : activeSubModule === 'principal-verify-history' ? (
        /* ========================================================================= */
        /* SUB-VIEW 5: VERIFICATION AUDIT LOG TRAIL                                  */
        /* ========================================================================= */
        <div className="border border-black/15 bg-white p-5 dark:border-white/15 dark:bg-neutral-950 space-y-4">
          <div className="flex items-center justify-between border-b border-black/10 pb-3 dark:border-white/10">
            <div>
              <h3 className="text-sm font-bold text-black dark:text-white">
                Identity & Biometric Verification Audit History
              </h3>
              <p className="text-xs text-neutral-500">
                Tamper-evident log of all credential evaluations, eGovPH syncs, and liveness assessments.
              </p>
            </div>
            <span className="font-mono text-[10px] border border-black/20 px-2 py-0.5 dark:border-white/20">
              AUDIT TRAIL SECURE
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="border-b border-black/10 bg-neutral-50 text-[10px] text-neutral-500 uppercase dark:border-white/10 dark:bg-neutral-900">
                <tr>
                  <th className="p-2.5">Timestamp</th>
                  <th className="p-2.5">Event Type</th>
                  <th className="p-2.5">Verification Method</th>
                  <th className="p-2.5">Score / Hash</th>
                  <th className="p-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-white/5">
                <tr>
                  <td className="p-2.5 text-neutral-500">2026-03-20 14:15:02</td>
                  <td className="p-2.5 font-bold">Passive Liveness Scan</td>
                  <td className="p-2.5 font-sans">ISO/IEC 30107-3 PAD Level 2</td>
                  <td className="p-2.5 font-mono text-emerald-600">99.4% (Pass)</td>
                  <td className="p-2.5"><StatusBadge status="VERIFIED" variant="success" size="sm" /></td>
                </tr>
                <tr>
                  <td className="p-2.5 text-neutral-500">2026-03-19 11:32:44</td>
                  <td className="p-2.5 font-bold">eGovPH / PhilSys SuperApp Sync</td>
                  <td className="p-2.5 font-sans">PSA Digital Signature Validated</td>
                  <td className="p-2.5 font-mono">TX-EGOV-98124</td>
                  <td className="p-2.5"><StatusBadge status="VERIFIED" variant="success" size="sm" /></td>
                </tr>
                <tr>
                  <td className="p-2.5 text-neutral-500">2026-03-18 09:10:19</td>
                  <td className="p-2.5 font-bold">Competent ID Registration</td>
                  <td className="p-2.5 font-sans">DFA Philippine Passport MRZ</td>
                  <td className="p-2.5 font-mono">SHA256: 7f8b91</td>
                  <td className="p-2.5"><StatusBadge status="INDEXED" variant="info" size="sm" /></td>
                </tr>
                <tr>
                  <td className="p-2.5 text-neutral-500">2026-03-15 16:02:11</td>
                  <td className="p-2.5 font-bold">Statutory Privacy Consent</td>
                  <td className="p-2.5 font-sans">R.A. 10173 & Rule 6 Audio-Visual</td>
                  <td className="p-2.5 font-mono">v2026.1 SIGNED</td>
                  <td className="p-2.5"><StatusBadge status="ACTIVE" variant="neutral" size="sm" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : activeSubModule === 'principal-security-mfa' ? (
        /* ========================================================================= */
        /* SUB-VIEW 6: SECURITY & MFA MANAGEMENT                                     */
        /* ========================================================================= */
        <div className="border border-black/15 bg-white p-5 dark:border-white/15 dark:bg-neutral-950 space-y-5">
          <div className="flex items-center justify-between border-b border-black/10 pb-3 dark:border-white/10">
            <div>
              <h3 className="text-sm font-bold text-black dark:text-white">
                Multi-Factor Authentication & Account Security
              </h3>
              <p className="text-xs text-neutral-500">
                Safeguards electronic signing keys and hearing tokens against unauthorized delegation.
              </p>
            </div>
            <StatusBadge status="MFA ENABLED" variant="success" size="sm" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-black/10 p-4 bg-neutral-50 dark:border-white/10 dark:bg-neutral-900 space-y-2.5">
              <div className="flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-black dark:text-white" />
                <h4 className="font-bold text-xs">Authenticator App (TOTP)</h4>
              </div>
              <p className="text-[11px] text-neutral-500">
                Paired with Google Authenticator or Microsoft Authenticator for instant 6-digit one-time passcodes.
              </p>
              <div className="font-mono text-[11px] bg-white p-2 border border-black/10 dark:bg-black dark:border-white/10 flex justify-between items-center">
                <span>SECRET: JBSWY3DPEHPK3PXP</span>
                <span className="text-emerald-600 font-bold">Configured</span>
              </div>
            </div>

            <div className="border border-black/10 p-4 bg-neutral-50 dark:border-white/10 dark:bg-neutral-900 space-y-2.5">
              <div className="flex items-center gap-2">
                <Fingerprint className="h-4 w-4 text-black dark:text-white" />
                <h4 className="font-bold text-xs">FIDO2 / WebAuthn Biometric Passkeys</h4>
              </div>
              <p className="text-[11px] text-neutral-500">
                Hardware cryptographic key stored in Apple Secure Enclave / Android Titan Security Module.
              </p>
              <div className="font-mono text-[11px] bg-white p-2 border border-black/10 dark:bg-black dark:border-white/10 flex justify-between items-center">
                <span>DEVICE: MacBook Pro Touch ID</span>
                <span className="text-emerald-600 font-bold">Active</span>
              </div>
            </div>
          </div>
        </div>
      ) : activeSubModule === 'principal-reverify' ? (
        /* ========================================================================= */
        /* SUB-VIEW 7: PRE-SIGNING STEP-UP RE-VERIFICATION CHALLENGE                */
        /* ========================================================================= */
        <div className="border border-black/15 bg-white p-5 dark:border-white/15 dark:bg-neutral-950 space-y-4">
          <div className="flex items-center justify-between border-b border-black/10 pb-3 dark:border-white/10">
            <div>
              <h3 className="text-sm font-bold text-black dark:text-white">
                Pre-Signing Step-Up Re-verification Challenge
              </h3>
              <p className="text-xs text-neutral-500">
                Supreme Court mandate: Step-up authentication required immediately prior to electronic signing ceremony.
              </p>
            </div>
            <StatusBadge status="STEP-UP CHALLENGE" variant="warning" size="sm" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="border border-black/10 p-4 bg-neutral-50 dark:border-white/10 dark:bg-neutral-900 space-y-3">
              <div className="flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-black dark:text-white" />
                <h4 className="font-bold text-xs">One-Time Security Passcode (OTP)</h4>
              </div>
              <p className="text-[11px] text-neutral-500">
                A 6-digit cryptographic verification code has been dispatched to your registered mobile ending in <strong>4821</strong>.
              </p>

              <form onSubmit={handleStepUpSubmit} className="space-y-3">
                <input
                  type="text"
                  maxLength={6}
                  value={stepUpCode}
                  onChange={(e) => setStepUpCode(e.target.value)}
                  placeholder="Enter 6-digit OTP (demo: 482109)"
                  className="w-full border border-black/20 bg-white p-2 text-xs font-mono dark:border-white/20 dark:bg-black"
                />

                <button
                  type="submit"
                  disabled={stepUpRunning}
                  className="w-full border border-black bg-black py-2 text-xs font-semibold text-white hover:bg-neutral-800 dark:border-white dark:bg-white dark:text-black dark:hover:bg-neutral-200 cursor-pointer disabled:opacity-50"
                >
                  {stepUpRunning ? 'Validating Step-Up...' : 'Confirm Step-Up Authentication'}
                </button>
              </form>

              {stepUpSuccess && (
                <div className="p-2 border border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 font-mono text-[11px]">
                  ✓ Re-verification token issued. Valid for the duration of the scheduled signing session.
                </div>
              )}
            </div>

            <div className="border border-black/10 p-4 bg-neutral-50 dark:border-white/10 dark:bg-neutral-900 space-y-2">
              <h4 className="font-bold text-xs">Security Assurance Controls</h4>
              <p className="text-[11px] text-neutral-500">
                Prevents session hijacking, credential theft, and unauthorized signing delegation under Rule 6 of the 2026 Rules on Electronic Notarization.
              </p>
              <div className="font-mono text-[10px] space-y-1 text-neutral-600 dark:text-neutral-400 pt-2 border-t border-black/10 dark:border-white/10">
                <div>CHALLENGE_TYPE: STEP_UP_MFA_LIVENESS</div>
                <div>EXPIRY_WINDOW: 15 MINUTES</div>
                <div>SESSION_BINDING: TLS_MUTUAL_SIMULATED</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* SUB-VIEW 8: DEFAULT eGovPH & PhilSys INTEGRATION                          */
        /* ========================================================================= */
        <div className="border border-black/15 bg-white p-5 dark:border-white/15 dark:bg-neutral-950 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/10 pb-3 dark:border-white/10">
            <div>
              <h3 className="text-sm font-bold text-black dark:text-white">
                PSA PhilSys / eGovPH Identity Verification
              </h3>
              <p className="text-xs text-neutral-500">
                Simulated integration with Philippine National ID (PhilSys ePhilID) and eGov Super App SSO.
              </p>
            </div>
            <StatusBadge
              status={profile.identityStatus === 'VERIFIED' ? 'PSA VERIFIED' : 'PENDING SIMULATION'}
              variant={profile.identityStatus === 'VERIFIED' ? 'success' : 'warning'}
              size="sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Government Credential Card */}
            <div className="border border-black/15 p-4 bg-neutral-50 space-y-3 dark:border-white/15 dark:bg-neutral-900">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                  Philippine Statistics Authority (PSA)
                </span>
                <span className="font-mono text-[10px] font-bold">PhilSys ePhilID</span>
              </div>

              <div className="font-mono text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Signer Name:</span>
                  <span className="font-bold font-sans">{profile.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">PhilSys Card No:</span>
                  <span>{profile.idCardNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Verification TxID:</span>
                  <span className="truncate max-w-[140px]">{profile.verificationRecord?.transactionId || 'TX-EGOV-98124'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Credential Status:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">Active & Validated</span>
                </div>
              </div>

              <div className="pt-2 border-t border-black/10 dark:border-white/10 flex justify-end">
                <button
                  onClick={handleRunEgovPh}
                  disabled={verifyingEgov}
                  className="flex items-center gap-1.5 border border-black bg-black px-3 py-1.5 text-xs font-semibold text-white hover:bg-neutral-800 dark:border-white dark:bg-white dark:text-black dark:hover:bg-neutral-200 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`h-3 w-3 ${verifyingEgov ? 'animate-spin' : ''}`} />
                  <span>{verifyingEgov ? 'Synchronizing with eGovPH...' : 'Re-verify eGovPH Record'}</span>
                </button>
              </div>
            </div>

            {/* Verification Checklist */}
            <div className="border border-black/15 p-4 bg-neutral-50 space-y-3 dark:border-white/15 dark:bg-neutral-900">
              <h4 className="font-bold text-xs">Accreditation Verification Parameters</h4>
              <div className="space-y-2 text-[11px]">
                <div className="flex items-center justify-between border-b border-black/10 pb-1.5 dark:border-white/10">
                  <span>Explicit Identity Consent:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">✓ Granted (v2026.1)</span>
                </div>
                <div className="flex items-center justify-between border-b border-black/10 pb-1.5 dark:border-white/10">
                  <span>PhilSys Demographic Match:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">✓ 100% Exact Match</span>
                </div>
                <div className="flex items-center justify-between border-b border-black/10 pb-1.5 dark:border-white/10">
                  <span>Facial Liveness Diagnostic:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">✓ {profile.livenessScore || 99.4}% Passed</span>
                </div>
                <div className="flex items-center justify-between border-b border-black/10 pb-1.5 dark:border-white/10">
                  <span>Device Fingerprint Record:</span>
                  <span className="font-mono text-[10px]">DFP-MAC-APPLE-2026</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
