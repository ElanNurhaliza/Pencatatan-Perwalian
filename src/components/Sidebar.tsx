'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  FileSpreadsheet,
  FileEdit,
  History,
  GraduationCap,
  LogOut,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface SidebarProps {
  role: 'admin' | 'mahasiswa' | 'dosen';
  userName?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ role, userName }) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch (e) {
      console.error('Error signing out:', e);
    }
    router.push('/login');
  };

  const navItems = {
    admin: [
      { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
      { name: 'Data Dosen Wali', href: '/admin/dosen-wali', icon: Users },
      { name: 'Import Data', href: '/admin/import', icon: FileSpreadsheet },
    ],
    mahasiswa: [
      { name: 'Dashboard', href: '/mahasiswa/dashboard', icon: LayoutDashboard },
      { name: 'Catat Perwalian', href: '/mahasiswa/catat-perwalian', icon: FileEdit },
      { name: 'Riwayat Perwalian', href: '/mahasiswa/histori', icon: History },
    ],
    dosen: [
      { name: 'Dashboard Wali', href: '/dosen/dashboard', icon: LayoutDashboard },
    ],
  };

  const currentNav = navItems[role] || [];

  return (
    <aside className="w-64 bg-slate-50 border-r border-slate-200 min-h-screen flex flex-col justify-between p-4 select-none">
      <div>
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-2 py-4 mb-4 border-b border-slate-200">
          <div className="w-10 h-10 rounded-xl bg-brand-500 text-white flex items-center justify-center shadow-md font-bold text-xl">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-slate-800 text-base leading-tight">STMIK Bandung</h1>
            <p className="text-xs font-medium text-slate-500">Sistem Perwalian</p>
          </div>
        </div>

        {/* Role Badge Tag */}
        <div className="px-2 mb-4">
          <div className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase mb-2">
            Akses Sebagai
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-brand-600 uppercase flex items-center justify-between shadow-2xs">
            <span>{role}</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1 mt-4">
          {currentNav.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-brand-500 text-white shadow-sm font-semibold'
                    : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer & Logout */}
      <div className="pt-4 border-t border-slate-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors"
        >
          <LogOut className="w-5 h-5 text-rose-500" />
          <span>Keluar</span>
        </button>
      </div>
    </aside>
  );
};
