import React from 'react';
import { Button } from './Button';

export interface AIInsightCardProps {
  title?: string;
  insight: string;
  /**
   * Action buttons to render inside the card
   */
  actions?: React.ReactNode;
  className?: string;
}

/**
 * Reusable AI Insight Card for displaying Gemini's recommendations and reasoning.
 * Styled with the brand's light green background to stand out contextually.
 */
export function AIInsightCard({ title = 'Insight AI', insight, actions, className = '' }: AIInsightCardProps) {
  return (
    <div className={`bg-[var(--color-brand-light)] border border-[var(--color-brand)]/20 rounded-xl p-4 ${className}`}>
      <div className="flex items-start gap-3">
        <div className="bg-[var(--color-brand)]/10 p-2 rounded-lg text-[var(--color-brand)] shrink-0">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-bold text-[var(--color-brand-hover)] mb-1 uppercase tracking-wide">
            {title}
          </h4>
          <p className="text-sm text-slate-700 leading-relaxed">
            {insight}
          </p>
          
          {actions && (
            <div className="mt-4 flex flex-wrap gap-2">
              {actions}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
