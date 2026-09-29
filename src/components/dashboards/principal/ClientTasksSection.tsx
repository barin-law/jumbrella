/**
 * JuriMbrella — Philippine Electronic Notarization
 * Client Tasks & Action Items Module
 * Clean, accessible, and fully functional task list for non-technical users
 */

import React, { useState } from 'react';
import {
  CheckSquare,
  Square,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Calendar,
  CreditCard,
  UserCheck,
  ArrowRight,
  Plus,
  Filter,
} from 'lucide-react';
import { StatusBadge } from '../../common/StatusBadge';

interface TaskItem {
  id: string;
  title: string;
  description: string;
  category: 'DOCUMENT' | 'IDENTITY' | 'HEARING' | 'PAYMENT';
  dueDate: string;
  isCompleted: boolean;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  actionLabel?: string;
  targetModuleId?: string;
}

interface ClientTasksSectionProps {
  onNavigateModule: (moduleId: string) => void;
}

const INITIAL_TASKS: TaskItem[] = [
  {
    id: 'task-1',
    title: 'Review and Approve SPA Draft Document v1.2',
    description: 'Atty. Roberto Cruz uploaded revised clauses for property description in Makati City.',
    category: 'DOCUMENT',
    dueDate: 'Today, 5:00 PM',
    isCompleted: false,
    priority: 'HIGH',
    actionLabel: 'Review Document',
    targetModuleId: 'principal-evidence-vault',
  },
  {
    id: 'task-2',
    title: 'Confirm Attendance for Remote Hearing #ENF-2026-0814',
    description: 'Videoconference session with Atty. Juan Dela Cruz scheduled for tomorrow at 10:00 AM PHT.',
    category: 'HEARING',
    dueDate: 'Tomorrow, 9:00 AM',
    isCompleted: false,
    priority: 'HIGH',
    actionLabel: 'Hearing Details',
    targetModuleId: 'principal-appointments',
  },
  {
    id: 'task-3',
    title: 'Verify Identity with Philippine National ID (PhilSys)',
    description: 'Complete passive camera liveness scan to validate biometric readiness prior to hearing.',
    category: 'IDENTITY',
    dueDate: 'Within 48 hours',
    isCompleted: true,
    priority: 'MEDIUM',
    actionLabel: 'View Credentials',
    targetModuleId: 'principal-identity-verification',
  },
  {
    id: 'task-4',
    title: 'Settle Demonstration Filing Fee (₱500.00)',
    description: 'Simulate e-wallet statutory payment settlement through simulated Maya / GCash sandbox.',
    category: 'PAYMENT',
    dueDate: 'Before hearing session',
    isCompleted: false,
    priority: 'MEDIUM',
    actionLabel: 'Settle Payment',
    targetModuleId: 'principal-payments',
  },
];

export const ClientTasksSection: React.FC<ClientTasksSectionProps> = ({ onNavigateModule }) => {
  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_TASKS);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'COMPLETED'>('ALL');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const toggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const nextState = !t.isCompleted;
          setFeedbackMessage(
            nextState ? `Marked "${t.title}" as completed.` : `Reopened "${t.title}".`
          );
          setTimeout(() => setFeedbackMessage(null), 3000);
          return { ...t, isCompleted: nextState };
        }
        return t;
      })
    );
  };

  const completeAllTasks = () => {
    setTasks((prev) => prev.map((t) => ({ ...t, isCompleted: true })));
    setFeedbackMessage('All tasks marked as completed.');
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'PENDING') return !t.isCompleted;
    if (filter === 'COMPLETED') return t.isCompleted;
    return true;
  });

  const completedCount = tasks.filter((t) => t.isCompleted).length;
  const progressPercent = Math.round((completedCount / tasks.length) * 100);

  const getCategoryIcon = (category: TaskItem['category']) => {
    switch (category) {
      case 'DOCUMENT':
        return <FileCheck className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />;
      case 'IDENTITY':
        return <UserCheck className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />;
      case 'HEARING':
        return <Calendar className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />;
      case 'PAYMENT':
        return <CreditCard className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />;
    }
  };

  return (
    <div className="space-y-4 text-xs">
      {feedbackMessage && (
        <div className="border border-emerald-500 bg-emerald-50 p-3 text-xs text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* Header & Progress Card */}
      <div className="border border-black/15 bg-white p-4 dark:border-white/15 dark:bg-neutral-950 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/10 pb-3 dark:border-white/10">
          <div>
            <h3 className="text-sm font-bold text-black dark:text-white">
              My Action Items & Required Tasks
            </h3>
            <p className="text-neutral-500 text-[11px]">
              Follow these simple steps to prepare your documents and identity for notarial certification.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-black dark:text-white">
              {completedCount} of {tasks.length} Done ({progressPercent}%)
            </span>
            {completedCount < tasks.length && (
              <button
                onClick={completeAllTasks}
                className="border border-black/20 px-2.5 py-1 text-[11px] hover:bg-neutral-100 dark:border-white/20 dark:hover:bg-neutral-900 cursor-pointer"
              >
                Mark All as Done
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-neutral-100 h-2 border border-black/10 dark:bg-neutral-900 dark:border-white/10 overflow-hidden">
          <div
            className="bg-black dark:bg-white h-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5">
            {(['ALL', 'PENDING', 'COMPLETED'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setFilter(mode)}
                className={`px-2.5 py-1 text-[11px] font-semibold border transition-colors cursor-pointer ${
                  filter === mode
                    ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
                    : 'border-black/20 text-neutral-600 hover:bg-neutral-100 dark:border-white/20 dark:text-neutral-400 dark:hover:bg-neutral-900'
                }`}
              >
                {mode === 'ALL'
                  ? `All Tasks (${tasks.length})`
                  : mode === 'PENDING'
                  ? `To Do (${tasks.length - completedCount})`
                  : `Completed (${completedCount})`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-2">
        {filteredTasks.length === 0 ? (
          <div className="border border-black/15 bg-white p-8 text-center dark:border-white/15 dark:bg-neutral-950 space-y-2">
            <CheckCircle2 className="h-8 w-8 mx-auto text-neutral-400" />
            <h4 className="font-bold text-black dark:text-white">No tasks found</h4>
            <p className="text-neutral-500 text-xs">
              {filter === 'PENDING'
                ? 'Great job! You have completed all required action items.'
                : 'No tasks match the selected filter.'}
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`border p-4 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                task.isCompleted
                  ? 'border-black/10 bg-neutral-50/70 dark:border-white/10 dark:bg-neutral-900/40 opacity-75'
                  : 'border-black/20 bg-white dark:border-white/20 dark:bg-neutral-950 shadow-xs'
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  onClick={() => toggleTask(task.id)}
                  className="mt-0.5 text-neutral-500 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
                  title={task.isCompleted ? 'Mark incomplete' : 'Mark complete'}
                >
                  {task.isCompleted ? (
                    <CheckSquare className="h-5 w-5 text-black dark:text-white" />
                  ) : (
                    <Square className="h-5 w-5" />
                  )}
                </button>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`font-bold text-xs ${
                        task.isCompleted
                          ? 'line-through text-neutral-500 dark:text-neutral-400'
                          : 'text-black dark:text-white'
                      }`}
                    >
                      {task.title}
                    </span>
                    <span className="flex items-center gap-1 border border-black/10 bg-neutral-100 px-1.5 py-0.2 text-[10px] font-mono dark:border-white/10 dark:bg-neutral-900">
                      {getCategoryIcon(task.category)}
                      <span>{task.category}</span>
                    </span>
                    {task.priority === 'HIGH' && !task.isCompleted && (
                      <span className="border border-red-500/40 bg-red-50 px-1.5 py-0.2 text-[10px] font-bold text-red-700 dark:bg-red-950/40 dark:text-red-300">
                        High Priority
                      </span>
                    )}
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-400 text-[11px]">
                    {task.description}
                  </p>
                  <div className="flex items-center gap-2 text-[10px] text-neutral-500 font-mono">
                    <Clock className="h-3 w-3" />
                    <span>Due: {task.dueDate}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                {task.actionLabel && task.targetModuleId && (
                  <button
                    onClick={() => onNavigateModule(task.targetModuleId!)}
                    className="inline-flex items-center gap-1 border border-black bg-black px-3 py-1.5 text-xs font-semibold text-white hover:bg-neutral-800 dark:border-white dark:bg-white dark:text-black dark:hover:bg-neutral-200 cursor-pointer"
                  >
                    <span>{task.actionLabel}</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                )}
                <button
                  onClick={() => toggleTask(task.id)}
                  className="border border-black/20 px-2.5 py-1.5 text-xs hover:bg-neutral-100 dark:border-white/20 dark:hover:bg-neutral-900 cursor-pointer"
                >
                  {task.isCompleted ? 'Reopen' : 'Done'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
