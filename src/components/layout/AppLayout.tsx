import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export interface AppLayoutProps {
  children: React.ReactNode;
  /**
   * Title to display in the Header
   */
  title?: string;
  isDashboard?: boolean;
  headerIcon?: React.ReactNode;
  isWide?: boolean;
}

/**
 * Main application layout wrapper.
 * Provides the Sidebar on the left, Header on the top, and scrollable content area.
 */
export function AppLayout({ children, title, isDashboard = false, headerIcon, isWide = false }: AppLayoutProps) {
  return (
    <div className="flex h-screen bg-[var(--color-background-alt)] overflow-hidden text-slate-800">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header title={title} isDashboard={isDashboard} icon={headerIcon} />
        {isDashboard || isWide ? (
          <main className="flex-1 overflow-y-auto p-8">
            {children}
          </main>
        ) : (
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              {children}
            </div>
          </main>
        )}
      </div>
    </div>
  );
}

