import React from 'react';
import { Headphones } from 'lucide-react';

interface SupportButtonProps {
  onClick: () => void;
  variant?: 'button' | 'docked' | 'compact';
  className?: string;
  label?: string;
}

export const SupportButton: React.FC<SupportButtonProps> = ({
  onClick,
  variant = 'button',
  className = '',
  label = 'Contact Admin / Support',
}) => {
  if (variant === 'compact') {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label="Open support and administrator contact dialog"
        className={`inline-flex items-center gap-1.5 border border-black/20 dark:border-white/20 px-2.5 py-1 text-xs text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors cursor-pointer ${className}`}
      >
        <Headphones className="h-3.5 w-3.5" aria-hidden="true" />
        <span>{label}</span>
      </button>
    );
  }

  if (variant === 'docked') {
    // Docked at the bottom-right corner, non-obtrusive, above footer
    return (
      <aside
        aria-label="Technical Support Quick Action"
        className={`fixed bottom-4 right-4 z-40 ${className}`}
      >
        <button
          type="button"
          onClick={onClick}
          aria-label="Contact Administrator and Technical Support"
          className="flex items-center gap-2 border border-black bg-black text-white px-3.5 py-2 text-xs font-semibold shadow-lg hover:bg-neutral-800 dark:border-white dark:bg-white dark:text-black dark:hover:bg-neutral-200 transition-transform active:scale-95 cursor-pointer"
        >
          <Headphones className="h-4 w-4" aria-hidden="true" />
          <span>Support &amp; Admin</span>
        </button>
      </aside>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Open contact and support dialog"
      className={`inline-flex items-center gap-2 border border-black bg-black px-3.5 py-2 text-xs font-semibold text-white hover:bg-neutral-800 dark:border-white dark:bg-white dark:text-black dark:hover:bg-neutral-200 transition-colors cursor-pointer ${className}`}
    >
      <Headphones className="h-3.5 w-3.5" aria-hidden="true" />
      <span>{label}</span>
    </button>
  );
};
