import React, { useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = false,
  onConfirm,
  onCancel,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
    >
      <div className="relative w-full max-w-md border border-black bg-white p-6 shadow-2xl transition-colors dark:border-white dark:bg-black">
        <button
          onClick={onCancel}
          aria-label="Close dialog"
          className="absolute right-4 top-4 text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-start gap-3">
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border ${
              isDestructive
                ? 'border-red-500 bg-red-100 text-red-700 dark:border-red-500 dark:bg-red-950 dark:text-red-300'
                : 'border-amber-500 bg-amber-100 text-amber-700 dark:border-amber-500 dark:bg-amber-950 dark:text-amber-300'
            }`}
          >
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h2 id="confirm-dialog-title" className="text-base font-bold text-black dark:text-white">
              {title}
            </h2>
            <p className="mt-1.5 text-xs leading-relaxed text-neutral-600 dark:text-neutral-300">
              {message}
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2.5">
          <button
            onClick={onCancel}
            className="border border-black/20 px-3.5 py-1.5 text-xs font-semibold hover:bg-neutral-100 dark:border-white/20 dark:hover:bg-neutral-900"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`border px-4 py-1.5 text-xs font-semibold text-white ${
              isDestructive
                ? 'border-red-600 bg-red-600 hover:bg-red-700 dark:border-red-600 dark:bg-red-600'
                : 'border-black bg-black hover:bg-neutral-800 dark:border-white dark:bg-white dark:text-black dark:hover:bg-neutral-200'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
