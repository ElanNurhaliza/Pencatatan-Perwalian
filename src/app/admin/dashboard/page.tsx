'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { StatCard } from '@/components/StatCard';
import { Badge } from '@/components/Badge';
import { Modal } from '@/components/Modal';
import { Users, FileText, CheckCircle2, Download, Filter, Search, Eye, Calendar, UserCheck } from 'lucide-react';
import { getProfiles, getDosenWaliList, getPerwalianList, getDemoUser } from '@/lib/dataService';
import { Profile, DosenWali, Perwalian } from '@/lib/types';
import * as XLSX from 'xlsx';

export default function AdminDashboardPage() {
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [dosenWaliList, setDosenWaliList] = useState<DosenWali[]>([]);
  const [perwalianList, setPerwalianList] = useState<Perwalian[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDosen, setFilterDosen] = useState('all');
  const [filterSemester, setFilterSemester] = useState('all');
  const [selectedPerwalian, setSelectedPerwalian] = useState<Perwalian | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const user = getDemoUser();
      setCurrentUser(user);

      const [pData, dwData, pwData] = await Promise.all([
        getProfiles(),
        getDosenWaliList(),
        getPerwalianList(),
      ]);

      setProfiles(pData);
      setDosenWaliList(dwData);
      setPerwalianList(pwData);
      setLoading(false);
    }
    loadData();
  }, []);

  const dosenList = profiles.filter((p) => p.role === 'dosen');
  const mahasiswaList = profiles.filter((p) => p.role === 'mahasiswa');

  // Filtered perwalian logs
  const filteredPerwalian = perwalianList.filter((pw) => {
    const mhsName = pw.mahasiswa?.full_name?.toLowerCase() || '';
    const mhsNim = pw.mahasiswa?.nim?.toLowerCase() || '';
    const dsnName = pw.dosen?.full_name?.toLowerCase() || '';
    const query = searchQuery.toLowerCase();

    const matchesSearch =
      mhsName.includes(query) || mhsNim.includes(query) || dsnName.includes(query) || pw.keperluan.toLowerCase().includes(query);
    const matchesDosen = filterDosen === 'all' || pw.dosen_id === filterDosen;
    const matchesSemester = filterSemester === 'all' || pw.semester === filterSemester;

    return matchesSearch && matchesDosen && matchesSemester;
  });

  // Export CSV/Excel Function
  const handleExportCSV = () => {
    if (filteredPerwalian.length === 0) {
      alert('Tidak ada data perwalian yang dapat diekspor.');
      return;
    }

    const exportData = filteredPerwalian.map((pw, index) => ({
      No: index + 1,
      'NIM Mahasiswa': pw.mahasiswa?.nim || '-',
      'Nama Mahasiswa': pw.mahasiswa?.full_name || '-',
      'Dosen Wali': pw.dosen?.full_name || '-',
      'NIDN Dosen': pw.dosen?.nidn || '-',
      'Tanggal Perwalian': pw.tanggal_perwalian,
      Semester: pw.semester,
      Keperluan: pw.keperluan,
      'Catatan Hasil Bimbingan': pw.catatan_hasil || '-',
      Status: pw.status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Rekap Perwalian');
    XLSX.writeFile(workbook, `Rekap_Perwalian_STMIK_Bandung_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar role="admin" userName={currentUser?.full_name} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header user={currentUser} onSearch={setSearchQuery} title="Dashboard Admin - Rekap Perwalian" />

        <main className="flex-1 p-6 md:p-8 overflow-y-auto space-y-6">
          {/* Header Banner */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Rekapitulasi Data Perwalian</h1>
              <p className="text-xs text-slate-500 mt-1">
                Ringkasan pelaksanaan perwalian antara dosen wali dan mahasiswa STMIK Bandung.
              </p>
            </div>

            <button
              onClick={handleExportCSV}
              className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Export ke Excel / CSV</span>
            </button>
          </div>

          {/* Stat Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Mahasiswa"
              value={mahasiswaList.length}
              subtitle="Terdaftar di sistem"
              icon={Users}
              iconBgColor="bg-blue-50"
              iconTextColor="text-brand-600"
            />
            <StatCard
              title="Total Perwalian"
              value={perwalianList.length}
              subtitle="Sesi perwalian tercatat"
              icon={FileText}
              iconBgColor="bg-indigo-50"
              iconTextColor="text-indigo-600"
            />
            <StatCard
              title="Dosen Wali Aktif"
              value={dosenList.length}
              subtitle="Dosen pembimbing"
              icon={UserCheck}
              iconBgColor="bg-emerald-50"
              iconTextColor="text-emerald-600"
            />
            <StatCard
              title="Penugasan Wali"
              value={dosenWaliList.length}
              subtitle="Mahasiswa ter-assign"
              icon={CheckCircle2}
              iconBgColor="bg-amber-50"
              iconTextColor="text-amber-600"
            />
          </div>

          {/* Dosen Summary Stat Cards */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-brand-600" />
              Ringkasan Mahasiswa Wali per Dosen
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {dosenList.map((dosen) => {
                const assignedCount = dosenWaliList.filter((dw) => dw.dosen_id === dosen.id).length;
                const perwalianCount = perwalianList.filter((pw) => pw.dosen_id === dosen.id).length;

                return (
                  <div key={dosen.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-slate-800">{dosen.full_name}</h4>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">NIDN: {dosen.nidn || '-'}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-slate-500">Anak Wali: </span>
                        <span className="font-bold text-slate-800">{assignedCount} Mahasiswa</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Sesi: </span>
                        <span className="font-bold text-brand-600">{perwalianCount} Perwalian</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Filter Bar & Table Section */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <h3 className="text-sm font-bold text-slate-800">Daftar Rekapitulasi Perwalian</h3>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-3">
                <select
                  value={filterDosen}
                  onChange={(e) => setFilterDosen(e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-hidden focus:border-brand-500"
                >
                  <option value="all">Semua Dosen Wali</option>
                  {dosenList.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.full_name}
                    </option>
                  ))}
                </select>

                <select
                  value={filterSemester}
                  onChange={(e) => setFilterSemester(e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-hidden focus:border-brand-500"
                >
                  <option value="all">Semua Semester</option>
                  <option value="Semester 1">Semester 1</option>
                  <option value="Semester 3">Semester 3</option>
                  <option value="Semester 5">Semester 5</option>
                  <option value="Semester 7">Semester 7</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100 uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4 w-12">No</th>
                    <th className="py-3 px-4">Mahasiswa</th>
                    <th className="py-3 px-4">Dosen Wali</th>
                    <th className="py-3 px-4">Tanggal</th>
                    <th className="py-3 px-4">Semester</th>
                    <th className="py-3 px-4">Keperluan / Topik</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-400">
                        Memuat data perwalian...
                      </td>
                    </tr>
                  ) : filteredPerwalian.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-400">
                        Tidak ada data perwalian yang cocok dengan filter.
                      </td>
                    </tr>
                  ) : (
                    filteredPerwalian.map((pw, index) => (
                      <tr key={pw.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-medium text-slate-400">{index + 1}</td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-800">{pw.mahasiswa?.full_name || 'N/A'}</div>
                          <div className="font-mono text-[11px] text-slate-400">NIM: {pw.mahasiswa?.nim || '-'}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-slate-700">{pw.dosen?.full_name || 'N/A'}</div>
                          <div className="font-mono text-[11px] text-slate-400">NIDN: {pw.dosen?.nidn || '-'}</div>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 text-slate-700">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>{pw.tanggal_perwalian}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-medium text-slate-700">{pw.semester}</td>
                        <td className="py-3.5 px-4 max-w-xs truncate text-slate-700">{pw.keperluan}</td>
                        <td className="py-3.5 px-4">
                          <Badge status={pw.status} />
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <button
                            onClick={() => setSelectedPerwalian(pw)}
                            className="p-1.5 rounded-lg text-brand-600 hover:bg-brand-50 transition-colors"
                            title="Lihat Detail Log"
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

      {/* Detail Perwalian Modal */}
      <Modal
        isOpen={!!selectedPerwalian}
        onClose={() => setSelectedPerwalian(null)}
        title="Detail Sesi Perwalian Mahasiswa"
      >
        {selectedPerwalian && (
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-2 gap-3">
              <div>
                <span className="text-slate-400 uppercase text-[10px] font-semibold">Mahasiswa</span>
                <p className="font-bold text-slate-800">{selectedPerwalian.mahasiswa?.full_name}</p>
                <p className="font-mono text-slate-500">NIM: {selectedPerwalian.mahasiswa?.nim}</p>
              </div>

              <div>
                <span className="text-slate-400 uppercase text-[10px] font-semibold">Dosen Wali</span>
                <p className="font-bold text-slate-800">{selectedPerwalian.dosen?.full_name}</p>
                <p className="font-mono text-slate-500">NIDN: {selectedPerwalian.dosen?.nidn}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-slate-400 uppercase text-[10px] font-semibold">Tanggal Sesi</span>
                <p className="font-medium text-slate-800">{selectedPerwalian.tanggal_perwalian}</p>
              </div>
              <div>
                <span className="text-slate-400 uppercase text-[10px] font-semibold">Semester</span>
                <p className="font-medium text-slate-800">{selectedPerwalian.semester}</p>
              </div>
            </div>

            <div>
              <span className="text-slate-400 uppercase text-[10px] font-semibold">Keperluan / Topik Bimbingan</span>
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
