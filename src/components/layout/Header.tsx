'use client';

import React, { useEffect, useState } from 'react';

export interface HeaderProps {
  title?: string;
  isDashboard?: boolean;
  icon?: React.ReactNode;
}

/**
 * Top Header component containing the page title, date, notifications, and user profile.
 * Now auth-aware: shows user info from localStorage.
 */
export function Header({ title = 'Dasbor Utama', isDashboard = false, icon }: HeaderProps) {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem('nutrimize_user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const today = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const initials = user?.fullName
    ? user.fullName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'B';

  const roleLabel: Record<string, string> = {
    KITCHEN_MANAGER: 'Pengelola Dapur',
    SUPPLIER: 'Supplier UMKM',
    GOVERNMENT_ADMIN: 'Admin Pemerintah',
  };

  if (isDashboard) {
    return (
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10" data-purpose="main-header">
        <div>
          <h1 className="text-sm font-medium text-slate-500">Welcome back,</h1>
          <p className="text-lg font-bold text-govDarkBlue">{user?.fullName || 'Dapur SPPG Banyuwangi'}</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-slate-900" id="current-date">{today}</p>
            <p className="text-xs text-slate-500">Status: Operational</p>
          </div>
          <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
            <button className="relative p-2 text-slate-400 hover:text-brandGreen transition-colors">
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
              </svg>
            </button>
            <div className="w-10 h-10 rounded-full bg-govBlue flex items-center justify-center text-white font-bold">
              {initials}
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="h-16 bg-white border-b border-[var(--color-border)] flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-2">
        {icon}
        <h1 className="text-xl font-bold text-[var(--color-text-primary)]">{title}</h1>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="text-sm font-medium text-slate-500 hidden md:block">
          {today}
        </div>
        
        <div className="flex items-center gap-4">
          <button className="text-slate-400 hover:text-slate-600 relative p-1 rounded-full hover:bg-slate-50 transition-colors">
            <span className="sr-only">Notifikasi</span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
          </button>
          
          <div className="h-8 w-px bg-slate-200"></div>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[var(--color-gov-blue)] text-white flex items-center justify-center font-bold text-sm">
              {initials}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-semibold text-slate-700 leading-none">{user?.fullName ?? 'User'}</p>
              <p className="text-xs text-slate-500 mt-1">{roleLabel[user?.role] ?? 'User'}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

