'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { StatCard } from '@/components/StatCard';
import { Badge } from '@/components/Badge';
import { Modal } from '@/components/Modal';
import { History, FileEdit, CheckCircle2, Clock, XCircle, Search, Eye } from 'lucide-react';
import { getPerwalianList, getCurrentUserProfile } from '@/lib/dataService';
import { Profile, Perwalian } from '@/lib/types';

export default function MahasiswaHistoriPage() {
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [perwalianList, setPerwalianList] = useState<Perwalian[]>([]);
  const [selectedPerwalian, setSelectedPerwalian] = useState<Perwalian | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const user = await getCurrentUserProfile();
      setCurrentUser(user);

      const pwData = await getPerwalianList();
      const ownPerwalian = pwData.filter(
        (pw) => (user?.id && pw.mahasiswa_id === user.id) || (user?.nim && pw.mahasiswa?.nim === user.nim)
      );
      setPerwalianList(ownPerwalian);
      setLoading(false);
    }
    loadData();
  }, []);

  const filteredList = perwalianList.filter((pw) => {
    const matchesSearch =
      pw.keperluan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pw.semester.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pw.tanggal_perwalian.includes(searchQuery);
    const matchesStatus = filterStatus === 'all' || pw.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const totalAll = perwalianList.length;
  const totalSelesai = perwalianList.filter((pw) => pw.status.toLowerCase() === 'selesai').length;
  const totalDiproses = perwalianList.filter((pw) => pw.status.toLowerCase() === 'diproses').length;
  const totalDitolak = perwalianList.filter((pw) => pw.status.toLowerCase() === 'ditolak').length;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar role="mahasiswa" userName={currentUser?.full_name} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header user={currentUser} onSearch={setSearchQuery} title="Riwayat Perwalian Saya" />

        <main className="flex-1 p-6 md:p-8 overflow-y-auto space-y-6">
          {/* Header Action Banner */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Riwayat Perwalian</h1>
              <p className="text-xs text-slate-500 mt-1">
                Kelola dan pantau seluruh catatan bimbingan perwalian milik Anda.
              </p>
            </div>

            <Link
              href="/mahasiswa/catat-perwalian"
              className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
            >
              <FileEdit className="w-4 h-4" />
              <span>+ Buat Perwalian Baru</span>
            </Link>
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Perwalian"
              value={totalAll}
              icon={History}
              iconBgColor="bg-blue-50"
              iconTextColor="text-brand-600"
            />
            <StatCard
              title="Diproses"
              value={totalDiproses}
              icon={Clock}
              iconBgColor="bg-indigo-50"
              iconTextColor="text-indigo-600"
            />
            <StatCard
              title="Selesai"
              value={totalSelesai}
              icon={CheckCircle2}
              iconBgColor="bg-emerald-50"
              iconTextColor="text-emerald-600"
            />
            <StatCard
              title="Ditolak"
              value={totalDitolak}
              icon={XCircle}
              iconBgColor="bg-rose-50"
              iconTextColor="text-rose-600"
            />
          </div>

          {/* Filter Bar & History Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-xs">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari topik perwalian..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-hidden focus:border-brand-500"
                />
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-hidden focus:border-brand-500"
                >
                  <option value="all">Semua Status</option>
                  <option value="selesai">Selesai</option>
                  <option value="diproses">Diproses</option>
                  <option value="ditolak">Ditolak</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100 uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4 w-12">No</th>
                    <th className="py-3 px-4">Tanggal Perwalian</th>
                    <th className="py-3 px-4">Semester</th>
                    <th className="py-3 px-4">Keperluan / Topik Bimbingan</th>
                    <th className="py-3 px-4">Dosen Wali</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400">
                        Memuat data riwayat...
                      </td>
                    </tr>
                  ) : filteredList.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400">
                        Tidak ada riwayat perwalian yang ditemukan.
                      </td>
                    </tr>
                  ) : (
                    filteredList.map((pw, index) => (
                      <tr key={pw.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-mono text-slate-400">{index + 1}</td>
                        <td className="py-3.5 px-4 font-medium text-slate-700 whitespace-nowrap">
                          {pw.tanggal_perwalian}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-800">{pw.semester}</td>
                        <td className="py-3.5 px-4 max-w-sm truncate text-slate-700">{pw.keperluan}</td>
                        <td className="py-3.5 px-4 font-medium text-slate-700">
                          {pw.dosen?.full_name || 'N/A'}
                        </td>
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
      <Modal isOpen={!!selectedPerwalian} onClose={() => setSelectedPerwalian(null)} title="Detail Log Perwalian">
        {selectedPerwalian && (
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 uppercase text-[10px] font-semibold">Dosen Wali</span>
              <p className="font-bold text-slate-800">{selectedPerwalian.dosen?.full_name}</p>
              <p className="font-mono text-slate-500">NIDN: {selectedPerwalian.dosen?.nidn}</p>
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
