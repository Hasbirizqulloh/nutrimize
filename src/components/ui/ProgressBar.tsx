import React from 'react';

export interface ProgressBarProps {
  label: string;
  valueText: string;
  percentage: number;
  /**
   * Color of the progress bar fill
   * @default 'brand'
   */
  color?: 'brand' | 'warning' | 'danger' | 'info';
  className?: string;
}

/**
 * Reusable Progress Bar for visualizing constraints and goals.
 * Used extensively in the AI Menu Calculator for cost, calorie, and protein visualization.
 */
export function ProgressBar({ label, valueText, percentage, color = 'brand', className = '' }: ProgressBarProps) {
  // Constrain percentage between 0 and 100
  const clampedPercentage = Math.min(Math.max(percentage, 0), 100);
  
  const colorClasses = {
    brand: 'bg-[var(--color-brand)]',
    warning: 'bg-yellow-500',
    danger: 'bg-red-500',
    info: 'bg-blue-500',
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-end mb-1">
        <span className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">{label}</span>
        <span className="text-sm font-semibold text-[var(--color-text-primary)]">{valueText}</span>
      </div>
      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
        <div 
          className={`h-2 rounded-full transition-all duration-500 ${colorClasses[color]}`} 
          style={{ width: `${clampedPercentage}%` }}
        ></div>
      </div>
    </div>
  );
}
