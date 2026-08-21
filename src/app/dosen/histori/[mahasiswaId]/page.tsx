'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { Badge } from '@/components/Badge';
import { Modal } from '@/components/Modal';
import { ArrowLeft, User, Calendar, History, Eye, GraduationCap } from 'lucide-react';
import { getProfiles, getPerwalianList, getCurrentUserProfile } from '@/lib/dataService';
import { Profile, Perwalian } from '@/lib/types';

export default function DosenHistoriMahasiswaPage() {
  const router = useRouter();
  const params = useParams();
  const mahasiswaId = params.mahasiswaId as string;

  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [mahasiswa, setMahasiswa] = useState<Profile | null>(null);
  const [perwalianList, setPerwalianList] = useState<Perwalian[]>([]);
  const [selectedPerwalian, setSelectedPerwalian] = useState<Perwalian | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const user = await getCurrentUserProfile();
      setCurrentUser(user);

      const [profiles, pwData] = await Promise.all([getProfiles(), getPerwalianList()]);

      // Find target student profile
      const targetMhs = profiles.find((p) => p.id === mahasiswaId || p.nim === mahasiswaId);
      setMahasiswa(targetMhs || profiles.find((p) => p.role === 'mahasiswa') || null);

      // Filter perwalian entries for this specific student
      const mhsPerwalian = pwData.filter(
        (pw) => pw.mahasiswa_id === mahasiswaId || pw.mahasiswa?.id === mahasiswaId || pw.mahasiswa?.nim === targetMhs?.nim
      );
      setPerwalianList(mhsPerwalian);
      setLoading(false);
    }
    loadData();
  }, [mahasiswaId]);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar role="dosen" userName={currentUser?.full_name} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header user={currentUser} title="Histori Perwalian Mahasiswa Wali" />

        <main className="flex-1 p-6 md:p-8 overflow-y-auto space-y-6">
          {/* Back Button */}
          <div>
            <button
              onClick={() => router.back()}
              className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-xs flex items-center gap-2 transition-all shadow-2xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Dashboard Dosen</span>
            </button>
          </div>

          {/* Student Profile Card Header */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-brand-600 text-white font-bold text-lg flex items-center justify-center shadow-md">
                {mahasiswa?.full_name
                  ? mahasiswa.full_name
                      .split(' ')
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join('')
                  : 'M'}
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-100">
                  Mahasiswa Bimbingan
                </span>
                <h1 className="text-xl font-extrabold text-slate-800 tracking-tight mt-1">
                  {mahasiswa?.full_name || 'Budi Santoso'}
                </h1>
                <p className="text-xs font-mono text-slate-500">
                  NIM: {mahasiswa?.nim || '10123001'} | Email: {mahasiswa?.email || 'mahasiswa@stmikbandung.ac.id'}
                </p>
              </div>
            </div>

            <div className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <span className="text-slate-500 font-medium">Total Sesi Perwalian: </span>
              <span className="font-bold text-brand-600">{perwalianList.length} Log</span>
            </div>
          </div>

          {/* History Timeline / Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-brand-600" />
                <h3 className="text-sm font-bold text-slate-800">
                  Histori Kronologis Perwalian (Read-Only)
                </h3>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100 uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4 w-12">No</th>
                    <th className="py-3 px-4">Tanggal Perwalian</th>
                    <th className="py-3 px-4">Semester</th>
                    <th className="py-3 px-4">Keperluan / Topik Bimbingan</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-center">Aksi Detail</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        Memuat data riwayat perwalian...
                      </td>
                    </tr>
                  ) : perwalianList.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        Mahasiswa ini belum memiliki histori pencatatan perwalian.
                      </td>
                    </tr>
                  ) : (
                    perwalianList.map((pw, index) => (
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
                            title="Lihat Detail Sesi"
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

      {/* Modal Detail View */}
      <Modal isOpen={!!selectedPerwalian} onClose={() => setSelectedPerwalian(null)} title="Detail Bimbingan Perwalian Mahasiswa">
        {selectedPerwalian && (
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-2 gap-3">
              <div>
                <span className="text-slate-400 uppercase text-[10px] font-semibold">Mahasiswa</span>
                <p className="font-bold text-slate-800">{mahasiswa?.full_name}</p>
                <p className="font-mono text-slate-500">NIM: {mahasiswa?.nim}</p>
              </div>
              <div>
                <span className="text-slate-400 uppercase text-[10px] font-semibold">Dosen Wali</span>
                <p className="font-bold text-slate-800">{currentUser?.full_name}</p>
                <p className="font-mono text-slate-500">NIDN: {currentUser?.nidn}</p>
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
