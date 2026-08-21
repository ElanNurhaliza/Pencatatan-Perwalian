'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUserProfile } from '@/lib/dataService';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    async function checkAuthAndRedirect() {
      const profile = await getCurrentUserProfile();
      if (!profile) {
        router.push('/login');
      } else if (profile.role === 'admin') {
        router.push('/admin/dashboard');
      } else if (profile.role === 'mahasiswa') {
        router.push('/mahasiswa/dashboard');
      } else if (profile.role === 'dosen') {
        router.push('/dosen/dashboard');
      } else {
        router.push('/login');
      }
    }
    checkAuthAndRedirect();
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-sm font-semibold text-slate-600">Mengarahkan ke Sistem Perwalian STMIK Bandung...</p>
      </div>
    </div>
  );
}
