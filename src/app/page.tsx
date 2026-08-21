'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getDemoUser } from '@/lib/dataService';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const user = getDemoUser();
    if (!user) {
      router.push('/login');
    } else if (user.role === 'admin') {
      router.push('/admin/dashboard');
    } else if (user.role === 'mahasiswa') {
      router.push('/mahasiswa/dashboard');
    } else if (user.role === 'dosen') {
      router.push('/dosen/dashboard');
    } else {
      router.push('/login');
    }
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
