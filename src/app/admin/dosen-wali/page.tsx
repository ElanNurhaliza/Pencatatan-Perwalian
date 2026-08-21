'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { Modal } from '@/components/Modal';
import { Users, UserPlus, Trash2, Search, Check, AlertCircle } from 'lucide-react';
import {
  getProfiles,
  getDosenWaliList,
  addDosenWaliAssignment,
  deleteDosenWaliAssignment,
  getDemoUser,
} from '@/lib/dataService';
import { Profile, DosenWali } from '@/lib/types';

export default function AdminDosenWaliPage() {
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [dosenWaliList, setDosenWaliList] = useState<DosenWali[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMahasiswaId, setSelectedMahasiswaId] = useState('');
  const [selectedDosenId, setSelectedDosenId] = useState('');
  const [tahunAkademik, setTahunAkademik] = useState('2025/2026 Ganjil');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setCurrentUser(getDemoUser());
    const [pData, dwData] = await Promise.all([getProfiles(), getDosenWaliList()]);
    setProfiles(pData);
    setDosenWaliList(dwData);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const mahasiswaList = profiles.filter((p) => p.role === 'mahasiswa');
  const dosenList = profiles.filter((p) => p.role === 'dosen');

  const filteredAssignments = dosenWaliList.filter((dw) => {
    const mhsName = dw.mahasiswa?.full_name?.toLowerCase() || '';
    const mhsNim = dw.mahasiswa?.nim?.toLowerCase() || '';
    const dsnName = dw.dosen?.full_name?.toLowerCase() || '';
    const query = searchQuery.toLowerCase();
    return mhsName.includes(query) || mhsNim.includes(query) || dsnName.includes(query);
  });

  const handleAddAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!selectedMahasiswaId || !selectedDosenId || !tahunAkademik) {
      setFormError('Semua kolom formulir wajib diisi.');
      return;
    }

    setSubmitting(true);
    try {
      await addDosenWaliAssignment({
        mahasiswa_id: selectedMahasiswaId,
        dosen_id: selectedDosenId,
        tahun_akademik: tahunAkademik,
      });

      setIsModalOpen(false);
      setSelectedMahasiswaId('');
      setSelectedDosenId('');
      await loadData();
      alert('Penugasan Dosen Wali berhasil disimpan!');
    } catch (err: any) {
      setFormError(err.message || 'Gagal menyimpan penugasan dosen wali.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name?: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus penugasan Dosen Wali untuk ${name || 'mahasiswa ini'}?`)) {
      try {
        await deleteDosenWaliAssignment(id);
        await loadData();
      } catch (err: any) {
        alert(err.message || 'Gagal menghapus penugasan.');
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar role="admin" userName={currentUser?.full_name} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header user={currentUser} onSearch={setSearchQuery} title="Pengelolaan Data Dosen Wali" />

        <main className="flex-1 p-6 md:p-8 overflow-y-auto space-y-6">
          {/* Action Header */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Data Penugasan Dosen Wali</h1>
              <p className="text-xs text-slate-500 mt-1">
                Kelola pemetaan Dosen Wali ke Mahasiswa untuk setiap tahun akademik.
              </p>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Assign Dosen Wali</span>
            </button>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-brand-600" />
                <h3 className="text-sm font-bold text-slate-800">Daftar Assignment Mahasiswa & Dosen Wali</h3>
              </div>
              <span className="text-xs font-medium text-slate-500">
                Total: {filteredAssignments.length} Penugasan
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100 uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4 w-12">No</th>
                    <th className="py-3 px-4">Mahasiswa Bimbingan</th>
                    <th className="py-3 px-4">Dosen Wali</th>
                    <th className="py-3 px-4">Tahun Akademik</th>
                    <th className="py-3 px-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400">
                        Memuat data penugasan...
                      </td>
                    </tr>
                  ) : filteredAssignments.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400">
                        Belum ada data penugasan Dosen Wali. Klik tombol di atas untuk menambah penugasan.
                      </td>
                    </tr>
                  ) : (
                    filteredAssignments.map((dw, index) => (
                      <tr key={dw.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-mono text-slate-400">{index + 1}</td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-800">{dw.mahasiswa?.full_name || 'Unknown'}</div>
                          <div className="font-mono text-[11px] text-slate-400">NIM: {dw.mahasiswa?.nim || '-'}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-slate-700">{dw.dosen?.full_name || 'Unknown'}</div>
                          <div className="font-mono text-[11px] text-slate-400">NIDN: {dw.dosen?.nidn || '-'}</div>
                        </td>
                        <td className="py-3.5 px-4 font-medium text-slate-700">{dw.tahun_akademik}</td>
                        <td className="py-3.5 px-4 text-center">
                          <button
                            onClick={() => handleDelete(dw.id, dw.mahasiswa?.full_name)}
                            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Hapus Penugasan"
                          >
                            <Trash2 className="w-4 h-4" />
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

      {/* Modal Add Assignment */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Tambah Penugasan Dosen Wali">
        <form onSubmit={handleAddAssignment} className="space-y-4 text-xs">
          {formError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Pilih Mahasiswa</label>
            <select
              required
              value={selectedMahasiswaId}
              onChange={(e) => setSelectedMahasiswaId(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:border-brand-500"
            >
              <option value="">-- Pilih Mahasiswa --</option>
              {mahasiswaList.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.full_name} ({m.nim})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Pilih Dosen Wali</label>
            <select
              required
              value={selectedDosenId}
              onChange={(e) => setSelectedDosenId(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:border-brand-500"
            >
              <option value="">-- Pilih Dosen --</option>
              {dosenList.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.full_name} (NIDN: {d.nidn})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Tahun Akademik</label>
            <select
              value={tahunAkademik}
              onChange={(e) => setTahunAkademik(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:border-brand-500"
            >
              <option value="2025/2026 Ganjil">2025/2026 Ganjil</option>
              <option value="2025/2026 Genap">2025/2026 Genap</option>
              <option value="2026/2027 Ganjil">2026/2027 Ganjil</option>
            </select>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl shadow-xs disabled:opacity-50"
            >
              {submitting ? 'Menyimpan...' : 'Simpan Penugasan'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
