import React from 'react';

export interface StatCardProps {
  title: string;
  value: string | number;
  /**
   * Optional icon to display next to the title (ReactNode, e.g., SVG or span)
   */
  icon?: React.ReactNode;
  /**
   * Trend direction and value, e.g., { direction: 'up', value: '5%' }
   */
  trend?: {
    direction: 'up' | 'down' | 'neutral';
    value: string;
    label?: string; // e.g. "vs minggu lalu"
  };
  className?: string;
}

/**
 * Reusable KPI Card component.
 * Features a clean layout with subtle shadows per the mockup design system.
 */
export function StatCard({ title, value, icon, trend, className = '' }: StatCardProps) {
  return (
    <div className={`bg-[var(--color-card)] rounded-xl border border-[var(--color-border)] p-5 shadow-sm hover:shadow-md transition-shadow ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-[var(--color-text-secondary)]">{title}</h3>
        {icon && <div className="text-[var(--color-text-secondary)]">{icon}</div>}
      </div>
      
      <div className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">
        {value}
      </div>
      
      {trend && (
        <div className="flex items-center text-xs mt-3">
          <span className={`font-medium flex items-center ${
            trend.direction === 'up' ? 'text-red-600' : 
            trend.direction === 'down' ? 'text-green-600' : 'text-slate-500'
          }`}>
            {trend.direction === 'up' ? (
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
            ) : trend.direction === 'down' ? (
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path></svg>
            ) : null}
            {trend.value}
          </span>
          {trend.label && <span className="text-[var(--color-text-secondary)] ml-1.5">{trend.label}</span>}
        </div>
      )}
    </div>
  );
}
