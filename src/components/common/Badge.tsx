

import React, { memo } from 'react';

type BadgeVariant =
  | 'emerald'
  | 'amber'
  | 'rose'
  | 'sky'
  | 'indigo'
  | 'purple'
  | 'slate';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLSpanElement>) => void;
}

export const Badge: React.FC<BadgeProps> = memo(({
  children,
  variant = 'slate',
  size = 'md',
  dot = false,
  className = '',
  onClick,
}) => {
  const variantStyles: Record<BadgeVariant, string> = {
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/40',
    amber: 'bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/40',
    rose: 'bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/40',
    sky: 'bg-sky-50 text-sky-700 border-sky-200/80 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800/40',
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200/80 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800/40',
    purple: 'bg-purple-50 text-purple-700 border-purple-200/80 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800/40',
    slate: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
  };

  const dotColors: Record<BadgeVariant, string> = {
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    rose: 'bg-rose-500',
    sky: 'bg-sky-500',
    indigo: 'bg-indigo-500',
    purple: 'bg-purple-500',
    slate: 'bg-slate-500',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs font-medium',
    md: 'px-2.5 py-1 text-xs font-semibold',
  };

  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full border whitespace-nowrap ${variantStyles[variant]} ${sizeStyles[size]} ${onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />}
      {children}
    </span>
  );
});

Badge.displayName = 'Badge';
