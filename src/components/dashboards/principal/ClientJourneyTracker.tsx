/**
 * JuriMbrella — Philippine Electronic Notarization
 * Client Journey Progress Tracker & Step-by-Step Wizard
 * JuriMbrella 24-Step Operational Workflow — Aligned with A.M. No. 24-10-14-SC
 */

import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Shield,
  FileCheck,
  Scale,
  Info,
  X,
  FileText,
  Lock,
} from 'lucide-react';
import { ClientCase, ClientProfile } from '../../../types/client-case';
import { useClientCase } from '../../../context/ClientCaseContext';
import {
  OPERATIONAL_WORKFLOW_STEPS,
  OperationalWorkflowStep,
  WORKFLOW_ROADMAP_TITLE,
  RequirementType,
} from '../../../data/roadmapSteps';

// For backwards-compatibility
export const JOURNEY_STEPS = OPERATIONAL_WORKFLOW_STEPS.map((s) => ({
  id: s.stepNumber,
  label: s.stepTitle,
  moduleId: s.moduleId,
  responsible: s.responsibleRole,
}));

interface ClientJourneyTrackerProps {
  activeCase?: ClientCase;
  profile?: ClientProfile;
  onNavigateModule: (moduleId: string) => void;
}

export const ClientJourneyTracker: React.FC<ClientJourneyTrackerProps> = ({
  activeCase: propsActiveCase,
  profile: propsProfile,
  onNavigateModule,
}) => {
  const context = useClientCase();
  const profile = propsProfile || context.profile;
  const activeCase = propsActiveCase || context.activeCase;
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCardCollapsed, setIsCardCollapsed] = useState(false);
  const [selectedStepModal, setSelectedStepModal] = useState<OperationalWorkflowStep | null>(null);

  // Determine current step index based on active case status & profile
  const getCurrentStepIndex = (): number => {
    if (!profile.verificationRecord) return 3; // Step 4: Identity Verification Review
    if (!activeCase) return 4; // Step 5: Case Intake
    switch (activeCase.status) {
      case 'DRAFT':
      case 'ONBOARDING_PENDING':
        return 4; // Step 5: Request Intake
      case 'EVIDENCE_INTAKE':
        return 7; // Step 8: Antivirus Quarantine & Screening
      case 'LAWYER_REVIEW':
        return 10; // Step 11: Preliminary Legal Review
      case 'DOCUMENT_CORRECTION':
        return 12; // Step 13: Document Correction & Annotation
      case 'CLIENT_APPROVAL_PENDING':
        return 13; // Step 14: Client Pre-Appearance Final Approval
      case 'READY_FOR_SIGNING':
      case 'CEREMONY_SCHEDULED':
        return 14; // Step 15: Appearance Scheduling
      case 'IN_CEREMONY':
        return 16; // Step 17: Electronic Appearance
      case 'COMPLETED':
        return 23; // Step 24: Client Delivery
      default:
        return 4;
    }
  };

  const currentStep = getCurrentStepIndex();
  const currentStepObj = OPERATIONAL_WORKFLOW_STEPS[currentStep] || OPERATIONAL_WORKFLOW_STEPS[0];
  const percentComplete = Math.round(((currentStep + 1) / OPERATIONAL_WORKFLOW_STEPS.length) * 100);

  const getRequirementBadge = (type: RequirementType) => {
    switch (type) {
      case 'STATUTORY':
        return (
          <span className="border border-purple-300 bg-purple-50 text-purple-700 px-1.5 py-0.5 text-[9px] font-mono font-bold dark:border-purple-800 dark:bg-purple-950/50 dark:text-purple-300">
            Statutory
          </span>
        );
      case 'PROCEDURAL':
        return (
          <span className="border border-blue-300 bg-blue-50 text-blue-700 px-1.5 py-0.5 text-[9px] font-mono font-bold dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-300">
            Procedural
          </span>
        );
      case 'TECHNICAL':
        return (
          <span className="border border-amber-300 bg-amber-50 text-amber-700 px-1.5 py-0.5 text-[9px] font-mono font-bold dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-300">
            Technical
          </span>
        );
      case 'INTERNAL':
        return (
          <span className="border border-neutral-300 bg-neutral-100 text-neutral-700 px-1.5 py-0.5 text-[9px] font-mono font-bold dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
            Internal Policy
          </span>
        );
    }
  };

  if (isCardCollapsed) {
    return (
      <div className="border border-black/15 bg-white p-3 dark:border-white/15 dark:bg-neutral-950 text-xs flex items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2.5 truncate">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-black bg-black text-white text-[10px] font-bold dark:border-white dark:bg-white dark:text-black">
            {currentStep + 1}
          </span>
          <div className="truncate">
            <span className="text-[10px] font-mono text-neutral-500 mr-2 uppercase">Step {currentStep + 1}/24</span>
            <span className="font-semibold text-black dark:text-white truncate">{currentStepObj.stepTitle}</span>
            <span className="text-[10px] text-neutral-400 font-mono ml-2">({percentComplete}% done)</span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => onNavigateModule(currentStepObj.moduleId)}
            className="inline-flex items-center gap-1 border border-black bg-black px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-neutral-800 dark:border-white dark:bg-white dark:text-black dark:hover:bg-neutral-200 cursor-pointer"
          >
            <span>Action</span>
            <ArrowRight className="h-3 w-3" />
          </button>
          <button
            type="button"
            onClick={() => setIsCardCollapsed(false)}
            className="border border-black/20 px-2 py-1 text-[11px] hover:bg-neutral-100 dark:border-white/20 dark:hover:bg-neutral-900 cursor-pointer flex items-center gap-1 text-neutral-600 dark:text-neutral-400"
            title="Expand Journey Details"
          >
            <span>Expand</span>
            <ChevronDown className="h-3 w-3" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-black/15 bg-white p-4 dark:border-white/15 dark:bg-neutral-950 text-xs space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/10 pb-2.5 dark:border-white/10">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono uppercase text-[10px] tracking-wider text-neutral-600 dark:text-neutral-400 font-semibold">
              {WORKFLOW_ROADMAP_TITLE}
            </span>
            <span className="border border-black/20 bg-neutral-100 px-1.5 py-0.5 text-[10px] font-bold dark:border-white/20 dark:bg-neutral-900">
              Step {currentStep + 1} of 24
            </span>
            {getRequirementBadge(currentStepObj.requirementType)}
          </div>
          <h4 className="text-sm font-bold text-black dark:text-white mt-1">
            {currentStepObj.stepTitle}
          </h4>
          <p className="text-[11px] text-neutral-500 mt-0.5 max-w-2xl">
            {currentStepObj.operationalPurpose}
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-neutral-500 font-mono">Workflow Progress</span>
            <span className="font-bold text-xs font-mono">{percentComplete}% Completed</span>
          </div>
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 border border-black/20 px-2.5 py-1 text-[11px] hover:bg-neutral-100 dark:border-white/20 dark:hover:bg-neutral-900 cursor-pointer"
          >
            <span>{isExpanded ? 'Hide Steps' : 'View All 24 Steps'}</span>
            {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>
          <button
            type="button"
            onClick={() => setIsCardCollapsed(true)}
            className="flex items-center gap-1 border border-black/20 px-2 py-1 text-[11px] hover:bg-neutral-100 dark:border-white/20 dark:hover:bg-neutral-900 cursor-pointer text-neutral-500"
            title="Collapse to minimal bar"
          >
            <span>Minimize</span>
            <ChevronUp className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Visual Step Bar */}
      <div className="w-full bg-neutral-100 h-2 border border-black/10 dark:bg-neutral-900 dark:border-white/10 overflow-hidden">
        <div
          className="bg-black dark:bg-white h-full transition-all duration-300"
          style={{ width: `${percentComplete}%` }}
        />
      </div>

      {/* Active Step Quick Action Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-50 p-3 border border-black/10 dark:bg-neutral-900 dark:border-white/10">
        <div className="flex items-start gap-2.5">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center border border-black bg-black text-white dark:border-white dark:bg-white dark:text-black text-[10px] font-bold mt-0.5">
            {currentStep + 1}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-black dark:text-white">
                Active Step: {currentStepObj.stepTitle}
              </span>
              {getRequirementBadge(currentStepObj.requirementType)}
            </div>
            <div className="text-neutral-500 text-[11px] mt-0.5">
              <span>Responsible: <strong>{currentStepObj.responsibleRole}</strong></span>
              <span className="mx-1.5">•</span>
              <span className="font-mono text-[10px]">Citation: {currentStepObj.legalOrPolicyRef}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={() => setSelectedStepModal(currentStepObj)}
            className="inline-flex items-center gap-1 border border-neutral-300 bg-white px-2.5 py-1.5 text-xs text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 cursor-pointer"
          >
            <Info className="h-3 w-3" />
            <span>Step Details</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigateModule(currentStepObj.moduleId)}
            className="inline-flex items-center gap-1.5 border border-black bg-black px-3 py-1.5 text-xs font-semibold text-white hover:bg-neutral-800 dark:border-white dark:bg-white dark:text-black dark:hover:bg-neutral-200 cursor-pointer"
          >
            <span>Go to Module</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Expanded 24-step Grid View */}
      {isExpanded && (
        <div className="pt-2 border-t border-black/10 dark:border-white/10 space-y-3">
          <div className="flex items-center justify-between text-[11px] text-neutral-500">
            <span>Click any step to inspect legal citations, audit events, inputs, outputs, and blocking conditions.</span>
            <div className="flex items-center gap-2 font-mono text-[10px]">
              <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full" /> Completed
              <span className="inline-block w-2 h-2 bg-black dark:bg-white rounded-full ml-2" /> Current
              <span className="inline-block w-2 h-2 bg-neutral-300 dark:bg-neutral-700 rounded-full ml-2" /> Pending
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {OPERATIONAL_WORKFLOW_STEPS.map((step, idx) => {
              const isCompleted = idx < currentStep;
              const isCurrent = idx === currentStep;

              return (
                <div
                  key={step.stepNumber}
                  onClick={() => setSelectedStepModal(step)}
                  className={`p-2.5 border text-left cursor-pointer transition-all hover:shadow-xs relative ${
                    isCurrent
                      ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black font-medium'
                      : isCompleted
                      ? 'border-black/20 bg-neutral-50 text-neutral-800 dark:border-white/20 dark:bg-neutral-900/60 dark:text-neutral-200'
                      : 'border-black/10 bg-white text-neutral-500 dark:border-white/10 dark:bg-neutral-950 dark:text-neutral-500 opacity-90'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                    <span className="font-bold">Step {step.stepNumber}</span>
                    <div className="flex items-center gap-1.5">
                      {isCompleted ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                      ) : isCurrent ? (
                        <Clock className="h-3.5 w-3.5 animate-pulse text-amber-300" />
                      ) : (
                        <span className="text-[9px] uppercase">Pending</span>
                      )}
                    </div>
                  </div>
                  <div className="text-[11px] font-semibold line-clamp-2 leading-snug">
                    {step.stepTitle}
                  </div>
                  <div className="mt-1.5 flex items-center justify-between gap-1 text-[9px]">
                    <span className="truncate opacity-80">
                      {step.responsibleRole}
                    </span>
                    <span className="shrink-0 font-mono text-[8px] uppercase tracking-wider px-1 py-0.2 border border-current opacity-70">
                      {step.requirementType}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Step Detail Modal */}
      {selectedStepModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-xl border border-black bg-white p-5 dark:border-white dark:bg-neutral-950 space-y-4 max-h-[90vh] overflow-y-auto text-neutral-900 dark:text-neutral-100 shadow-xl">
            <div className="flex items-start justify-between gap-3 border-b border-black/10 pb-3 dark:border-white/10">
              <div>
                <div className="flex items-center gap-2">
                  <span className="border border-black bg-black text-white px-1.5 py-0.5 text-[10px] font-mono font-bold dark:border-white dark:bg-white dark:text-black">
                    Step {selectedStepModal.stepNumber} of 24
                  </span>
                  {getRequirementBadge(selectedStepModal.requirementType)}
                  <span className="text-[10px] font-mono text-neutral-500">
                    Status: {selectedStepModal.stepNumber - 1 < currentStep ? 'COMPLETED' : selectedStepModal.stepNumber - 1 === currentStep ? 'IN_PROGRESS' : 'PENDING'}
                  </span>
                </div>
                <h3 className="text-base font-bold mt-1.5">{selectedStepModal.stepTitle}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedStepModal(null)}
                className="border border-black/20 p-1 hover:bg-neutral-100 dark:border-white/20 dark:hover:bg-neutral-900 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="font-bold text-[10px] font-mono uppercase text-neutral-500">Operational Purpose</span>
                <p className="mt-0.5 text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  {selectedStepModal.operationalPurpose}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-neutral-50 p-2.5 border border-black/10 dark:bg-neutral-900 dark:border-white/10">
                <div>
                  <span className="font-bold text-[10px] font-mono uppercase text-neutral-500">Responsible Role</span>
                  <p className="font-semibold mt-0.5">{selectedStepModal.responsibleRole}</p>
                </div>
                <div>
                  <span className="font-bold text-[10px] font-mono uppercase text-neutral-500">Audit Event Key</span>
                  <p className="font-mono text-[11px] text-neutral-800 dark:text-neutral-200 mt-0.5">
                    {selectedStepModal.auditEvent}
                  </p>
                </div>
              </div>

              <div>
                <span className="font-bold text-[10px] font-mono uppercase text-neutral-500">
                  Applicable Legal / Policy Reference
                </span>
                <div className="mt-0.5 p-2 bg-neutral-100 dark:bg-neutral-900 font-mono text-[11px] border border-black/10 dark:border-white/10">
                  {selectedStepModal.legalOrPolicyRef}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="border border-black/10 p-2.5 dark:border-white/10">
                  <span className="font-bold text-[10px] font-mono uppercase text-emerald-700 dark:text-emerald-400">
                    Required Inputs
                  </span>
                  <ul className="mt-1 space-y-1 list-disc list-inside text-[11px] text-neutral-600 dark:text-neutral-400">
                    {selectedStepModal.requiredInputs.map((input, idx) => (
                      <li key={idx}>{input}</li>
                    ))}
                  </ul>
                </div>

                <div className="border border-black/10 p-2.5 dark:border-white/10">
                  <span className="font-bold text-[10px] font-mono uppercase text-blue-700 dark:text-blue-400">
                    Required Outputs
                  </span>
                  <ul className="mt-1 space-y-1 list-disc list-inside text-[11px] text-neutral-600 dark:text-neutral-400">
                    {selectedStepModal.requiredOutputs.map((output, idx) => (
                      <li key={idx}>{output}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="border border-red-200 bg-red-50/60 p-2.5 dark:border-red-900/60 dark:bg-red-950/30">
                <span className="font-bold text-[10px] font-mono uppercase text-red-700 dark:text-red-400">
                  Blocking Conditions
                </span>
                <ul className="mt-1 space-y-1 list-disc list-inside text-[11px] text-red-800 dark:text-red-300">
                  {selectedStepModal.blockingConditions.map((cond, idx) => (
                    <li key={idx}>{cond}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-black/10 dark:border-white/10">
              <button
                type="button"
                onClick={() => setSelectedStepModal(null)}
                className="border border-black/20 px-3 py-1.5 text-xs hover:bg-neutral-100 dark:border-white/20 dark:hover:bg-neutral-900 cursor-pointer"
              >
                Close Details
              </button>
              <button
                type="button"
                onClick={() => {
                  const mod = selectedStepModal.moduleId;
                  setSelectedStepModal(null);
                  onNavigateModule(mod);
                }}
                className="flex items-center gap-1.5 border border-black bg-black px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-neutral-800 dark:border-white dark:bg-white dark:text-black dark:hover:bg-neutral-200 cursor-pointer"
              >
                <span>Open Module Workspace</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
