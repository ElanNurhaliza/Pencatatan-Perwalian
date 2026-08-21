'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { StatCard } from '@/components/StatCard';
import { Users, FileText, History, ArrowRight, Search, GraduationCap } from 'lucide-react';
import { getProfiles, getDosenWaliList, getPerwalianList, getCurrentUserProfile } from '@/lib/dataService';
import { Profile, DosenWali, Perwalian } from '@/lib/types';

export default function DosenDashboardPage() {
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [myAdvisees, setMyAdvisees] = useState<DosenWali[]>([]);
  const [perwalianList, setPerwalianList] = useState<Perwalian[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const user = await getCurrentUserProfile();
      setCurrentUser(user);

      const [dwData, pwData] = await Promise.all([getDosenWaliList(), getPerwalianList()]);

      // Filter advisees for this lecturer
      const assigned = dwData.filter(
        (dw) => (user?.id && dw.dosen_id === user.id) || (user?.nidn && dw.dosen?.nidn === user.nidn)
      );
      setMyAdvisees(assigned);

      // Filter perwalian entries of advisees of this lecturer
      const ownPerwalian = pwData.filter(
        (pw) => (user?.id && pw.dosen_id === user.id) || (user?.nidn && pw.dosen?.nidn === user.nidn)
      );
      setPerwalianList(ownPerwalian);
      setLoading(false);
    }
    loadData();
  }, []);

  const filteredAdvisees = myAdvisees.filter((dw) => {
    const name = dw.mahasiswa?.full_name?.toLowerCase() || '';
    const nim = dw.mahasiswa?.nim?.toLowerCase() || '';
    const query = searchQuery.toLowerCase();
    return name.includes(query) || nim.includes(query);
  });

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar role="dosen" userName={currentUser?.full_name} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header user={currentUser} onSearch={setSearchQuery} title="Dashboard Dosen Wali" />

        <main className="flex-1 p-6 md:p-8 overflow-y-auto space-y-6">
          {/* Welcome Banner */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-brand-600 mb-1">
                <GraduationCap className="w-4 h-4" />
                <span>NIDN: {currentUser?.nidn || '0412038501'}</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                Selamat Datang, {currentUser?.full_name || 'Dosen Wali'}!
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Pantau perkembangan akademis dan riwayat perwalian dari seluruh mahasiswa bimbingan Anda.
              </p>
            </div>
          </div>

          {/* Stat Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <StatCard
              title="Mahasiswa Wali"
              value={myAdvisees.length}
              subtitle="Total anak wali diampu"
              icon={Users}
              iconBgColor="bg-blue-50"
              iconTextColor="text-brand-600"
            />
            <StatCard
              title="Total Perwalian Recorded"
              value={perwalianList.length}
              subtitle="Sesi bimbingan masuk"
              icon={FileText}
              iconBgColor="bg-emerald-50"
              iconTextColor="text-emerald-600"
            />
          </div>

          {/* Advisee Students List */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-brand-600" />
                <h3 className="text-sm font-bold text-slate-800">Daftar Mahasiswa Bimbingan (Anak Wali)</h3>
              </div>

              <div className="relative max-w-xs">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari mahasiswa / NIM..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-hidden focus:border-brand-500"
                />
              </div>
            </div>

            {/* Grid of Advisees */}
            <div className="p-6">
              {loading ? (
                <div className="py-12 text-center text-xs text-slate-400">
                  Memuat data mahasiswa bimbingan...
                </div>
              ) : filteredAdvisees.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400">
                  Belum ada mahasiswa bimbingan yang terdaftar.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredAdvisees.map((dw) => {
                    const mhs = dw.mahasiswa;
                    const mhsPerwalianCount = perwalianList.filter(
                      (pw) => pw.mahasiswa_id === dw.mahasiswa_id || pw.mahasiswa?.nim === mhs?.nim
                    ).length;

                    return (
                      <div
                        key={dw.id}
                        className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200 hover:border-brand-300 transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-brand-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                              {mhs?.full_name
                                ? mhs.full_name
                                    .split(' ')
                                    .map((n) => n[0])
                                    .slice(0, 2)
                                    .join('')
                                : 'M'}
                            </div>
                            <div>
                              <h4 className="font-bold text-sm text-slate-800 leading-tight">
                                {mhs?.full_name || 'N/A'}
                              </h4>
                              <p className="text-xs font-mono text-slate-500 mt-0.5">
                                NIM: {mhs?.nim || '-'}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-1.5 text-xs pt-2 border-t border-slate-200/60">
                            <div className="flex justify-between text-slate-600">
                              <span>Tahun Akademik:</span>
                              <span className="font-semibold text-slate-800">{dw.tahun_akademik}</span>
                            </div>
                            <div className="flex justify-between text-slate-600">
                              <span>Total Sesi Perwalian:</span>
                              <span className="font-bold text-brand-600">{mhsPerwalianCount} Perwalian</span>
                            </div>
                          </div>
                        </div>

                        <Link
                          href={`/dosen/histori/${mhs?.id || dw.mahasiswa_id}`}
                          className="mt-4 w-full py-2 bg-white hover:bg-brand-50 border border-slate-200 hover:border-brand-200 text-brand-700 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-2xs"
                        >
                          <History className="w-3.5 h-3.5" />
                          <span>Lihat Histori Perwalian</span>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
