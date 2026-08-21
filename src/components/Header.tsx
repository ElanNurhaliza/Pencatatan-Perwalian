'use client';

import React, { useState } from 'react';
import { Search, Bell, User } from 'lucide-react';
import { Profile } from '@/lib/types';

interface HeaderProps {
  user?: Profile | null;
  onSearch?: (query: string) => void;
  title?: string;
}

export const Header: React.FC<HeaderProps> = ({ user, onSearch, title }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return 'ST';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-10 shadow-2xs">
      {/* Page Title or Search Input */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        {title ? (
          <h2 className="text-lg font-bold text-slate-800">{title}</h2>
        ) : (
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-9 pr-4 py-2 bg-slate-100/80 border border-transparent rounded-full text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-brand-500 focus:bg-white transition-all"
            />
          </div>
        )}
      </div>

      {/* Right User Actions */}
      <div className="flex items-center gap-4">
        {/* Notification Icon */}
        <button
          className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
          title="Notifikasi"
          onClick={() => alert('Tidak ada notifikasi baru')}
        >
          <Bell className="w-5 h-5" />
          <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1.5 right-1.5 ring-2 ring-white"></span>
        </button>


        {/* User Profile Badge */}
        <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
          <div className="w-9 h-9 rounded-full bg-brand-500 text-white font-bold text-xs flex items-center justify-center shadow-xs">
            {getInitials(user?.full_name)}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-bold text-slate-800 leading-tight">
              {user?.full_name || 'Pengguna STMIK'}
            </p>
            <p className="text-[11px] font-medium text-slate-500 capitalize">
              {user?.role || 'Guest'} {user?.nim ? `(${user.nim})` : user?.nidn ? `(${user.nidn})` : ''}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
