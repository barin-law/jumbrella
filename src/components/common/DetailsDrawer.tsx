import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface DetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  width?: string;
}

export const DetailsDrawer: React.FC<DetailsDrawerProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  width = 'max-w-md sm:max-w-lg',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
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
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`relative z-10 flex h-full w-full ${width} flex-col border-l border-black bg-white text-black shadow-2xl transition-all dark:border-white dark:bg-black dark:text-white`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between border-b border-black/10 px-5 py-4 dark:border-white/10">
          <div>
            <h2 className="text-base font-bold tracking-tight text-black dark:text-white">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                {subtitle}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close details"
            className="flex h-8 w-8 items-center justify-center border border-black/20 hover:bg-neutral-100 dark:border-white/20 dark:hover:bg-neutral-900 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Drawer body */}
        <div className="flex-1 overflow-y-auto p-5 scrollbar-thin">
          {children}
        </div>
      </div>
    </div>
  );
};
