import React from 'react';

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'brand';

export interface BadgeProps {
  children: React.ReactNode;
  /**
   * Color variant of the badge
   * @default 'neutral'
   */
  variant?: BadgeVariant;
  className?: string;
}

/**
 * Reusable Badge component for statuses, tags, and small indicators.
 * Features uppercase, wide-tracking typography per mockup design system.
 */
export function Badge({ children, variant = 'neutral', className = '' }: BadgeProps) {
  const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest';
  
  const variantClasses = {
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    neutral: 'bg-slate-100 text-slate-700',
    brand: 'bg-[var(--color-brand-light)] text-[var(--color-brand)]',
  };

  const classes = [
    baseClasses,
    variantClasses[variant],
    className
  ].filter(Boolean).join(' ');

  return (
    <span className={classes}>
      {children}
    </span>
  );
}
