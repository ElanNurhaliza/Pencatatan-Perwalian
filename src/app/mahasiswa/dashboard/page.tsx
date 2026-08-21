'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { StatCard } from '@/components/StatCard';
import { Badge } from '@/components/Badge';
import { Modal } from '@/components/Modal';
import { UserCheck, FileEdit, History, Calendar, CheckCircle2, Eye, ArrowRight, GraduationCap } from 'lucide-react';
import { getDosenWaliList, getPerwalianList, getDemoUser } from '@/lib/dataService';
import { Profile, DosenWali, Perwalian } from '@/lib/types';

export default function MahasiswaDashboardPage() {
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [dosenWali, setDosenWali] = useState<DosenWali | null>(null);
  const [perwalianList, setPerwalianList] = useState<Perwalian[]>([]);
  const [selectedPerwalian, setSelectedPerwalian] = useState<Perwalian | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const user = getDemoUser();
      setCurrentUser(user);

      const [dwData, pwData] = await Promise.all([getDosenWaliList(), getPerwalianList()]);

      // Find assigned dosen wali for current user
      const assigned = dwData.find((dw) => dw.mahasiswa_id === user.id || dw.mahasiswa?.nim === user.nim);
      setDosenWali(assigned || dwData[0] || null);

      // Filter perwalian belonging to current student
      const ownPerwalian = pwData.filter(
        (pw) => pw.mahasiswa_id === user.id || pw.mahasiswa?.nim === user.nim
      );
      setPerwalianList(ownPerwalian);
      setLoading(false);
    }
    loadData();
  }, []);

  const totalPerwalian = perwalianList.length;
  const totalSelesai = perwalianList.filter((pw) => pw.status.toLowerCase() === 'selesai').length;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar role="mahasiswa" userName={currentUser?.full_name} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header user={currentUser} title="Dashboard Mahasiswa" />

        <main className="flex-1 p-6 md:p-8 overflow-y-auto space-y-6">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-brand-600 to-brand-700 p-6 md:p-8 rounded-3xl text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-medium text-brand-100 mb-3 border border-white/20">
                <GraduationCap className="w-4 h-4" />
                <span>NIM: {currentUser?.nim || '10123001'}</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                Halo, {currentUser?.full_name || 'Mahasiswa'}!
              </h1>
              <p className="text-xs md:text-sm text-brand-100 mt-1 max-w-xl">
                Pantau status perwalian akademik Anda dan catat bimbingan secara langsung di sini.
              </p>
            </div>

            <Link
              href="/mahasiswa/catat-perwalian"
              className="px-5 py-3 bg-white text-brand-700 hover:bg-brand-50 font-bold rounded-2xl text-xs shadow-lg flex items-center gap-2 transition-all flex-shrink-0"
            >
              <FileEdit className="w-4 h-4" />
              <span>Catat Perwalian Baru</span>
            </Link>
          </div>

          {/* Dosen Wali Info Card & Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Assigned Dosen Wali Card */}
            <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Dosen Wali Anda
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                    Aktif
                  </span>
                </div>

                {dosenWali?.dosen ? (
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-700 font-bold text-base flex items-center justify-center flex-shrink-0">
                      {dosenWali.dosen.full_name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                    </div>
                    <div>
                      <h4 className="font-bold text-base text-slate-800 leading-tight">
                        {dosenWali.dosen.full_name}
                      </h4>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">
                        NIDN: {dosenWali.dosen.nidn || '-'}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Email: {dosenWali.dosen.email || 'dosen@stmikbandung.ac.id'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">Belum ada Dosen Wali yang di-assign oleh Admin.</p>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Tahun Akademik:</span>
                <span className="font-bold text-slate-700">
                  {dosenWali?.tahun_akademik || '2025/2026 Ganjil'}
                </span>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <StatCard
                title="Total Perwalian"
                value={totalPerwalian}
                subtitle="Sesi bimbingan tercatat"
                icon={History}
                iconBgColor="bg-blue-50"
                iconTextColor="text-brand-600"
              />
              <StatCard
                title="Selesai"
                value={totalSelesai}
                subtitle="Telah disetujui"
                icon={CheckCircle2}
                iconBgColor="bg-emerald-50"
                iconTextColor="text-emerald-600"
              />
            </div>

          </div>

          {/* Recent Advisory History Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800">Riwayat Perwalian Terbaru</h3>
              <Link
                href="/mahasiswa/histori"
                className="text-xs font-bold text-brand-600 hover:underline flex items-center gap-1"
              >
                <span>Lihat Semua</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100 uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4 w-12">No</th>
                    <th className="py-3 px-4">Tanggal</th>
                    <th className="py-3 px-4">Semester</th>
                    <th className="py-3 px-4">Keperluan / Topik Bimbingan</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        Memuat riwayat perwalian...
                      </td>
                    </tr>
                  ) : perwalianList.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        Belum ada catatan perwalian. Klik tombol "Catat Perwalian Baru" di atas untuk mencatat.
                      </td>
                    </tr>
                  ) : (
                    perwalianList.slice(0, 5).map((pw, index) => (
                      <tr key={pw.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-mono text-slate-400">{index + 1}</td>
                        <td className="py-3.5 px-4 font-medium text-slate-700 whitespace-nowrap">
                          {pw.tanggal_perwalian}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-800">{pw.semester}</td>
                        <td className="py-3.5 px-4 max-w-sm truncate text-slate-700">{pw.keperluan}</td>
                        <td className="py-3.5 px-4">
                          <Badge status={pw.status} />
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <button
                            onClick={() => setSelectedPerwalian(pw)}
                            className="p-1.5 rounded-lg text-brand-600 hover:bg-brand-50 transition-colors"
                            title="Detail Bimbingan"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Modal Detail */}
      <Modal isOpen={!!selectedPerwalian} onClose={() => setSelectedPerwalian(null)} title="Detail Bimbingan Perwalian">
        {selectedPerwalian && (
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 uppercase text-[10px] font-semibold">Dosen Wali</span>
              <p className="font-bold text-slate-800">{selectedPerwalian.dosen?.full_name}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-slate-400 uppercase text-[10px] font-semibold">Tanggal</span>
                <p className="font-medium text-slate-800">{selectedPerwalian.tanggal_perwalian}</p>
              </div>
              <div>
                <span className="text-slate-400 uppercase text-[10px] font-semibold">Semester</span>
                <p className="font-medium text-slate-800">{selectedPerwalian.semester}</p>
              </div>
            </div>

            <div>
              <span className="text-slate-400 uppercase text-[10px] font-semibold">Keperluan</span>
              <p className="font-medium text-slate-800 mt-1 p-2.5 bg-white border border-slate-200 rounded-lg">
                {selectedPerwalian.keperluan}
              </p>
            </div>

            <div>
              <span className="text-slate-400 uppercase text-[10px] font-semibold">Catatan Hasil Bimbingan</span>
              <p className="font-medium text-slate-800 mt-1 p-2.5 bg-slate-50 border border-slate-200 rounded-lg whitespace-pre-line leading-relaxed">
                {selectedPerwalian.catatan_hasil || 'Tidak ada catatan khusus.'}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
