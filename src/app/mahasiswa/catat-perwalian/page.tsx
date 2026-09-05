'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { FileEdit, Calendar, UserCheck, CheckCircle2, AlertCircle, ArrowLeft, BookOpen } from 'lucide-react';
import { getDosenWaliList, addPerwalianRecord, getCurrentUserProfile } from '@/lib/dataService';
import { Profile, DosenWali } from '@/lib/types';

export default function MahasiswaCatatPerwalianPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [dosenWali, setDosenWali] = useState<DosenWali | null>(null);
  const [loading, setLoading] = useState(true);

  // Form states
  const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [semester, setSemester] = useState('Semester 5');
  const [mataKuliah, setMataKuliah] = useState('');
  const [keperluan, setKeperluan] = useState('');
  const [catatanHasil, setCatatanHasil] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const user = await getCurrentUserProfile();
      setCurrentUser(user);

      const dwData = await getDosenWaliList();
      const assigned = dwData.find(
        (dw) => (user?.id && dw.mahasiswa_id === user.id) || (user?.nim && dw.mahasiswa?.nim === user.nim)
      );
      setDosenWali(assigned || dwData[0] || null);
      setLoading(false);
    }
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!keperluan.trim()) {
      setFormError('Keperluan / Topik Perwalian wajib diisi.');
      return;
    }

    if (!dosenWali?.dosen_id) {
      setFormError('Dosen Wali belum ter-assign. Hubungi administrator.');
      return;
    }

    setSubmitting(true);
    try {
      await addPerwalianRecord({
        mahasiswa_id: currentUser?.id || '00000000-0000-0000-0000-000000000004',
        dosen_id: dosenWali.dosen_id,
        tanggal_perwalian: tanggal,
        semester: semester,
        mata_kuliah: mataKuliah.trim() || 'Umum / Non-Matkul',
        keperluan: keperluan,
        catatan_hasil: catatanHasil,
        status: 'selesai',
      });

      alert('Pencatatan perwalian berhasil disimpan!');
      router.push('/mahasiswa/histori');
    } catch (err: any) {
      setFormError(err.message || 'Gagal menyimpan data perwalian.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar role="mahasiswa" userName={currentUser?.full_name} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header user={currentUser} title="Catat Perwalian Mahasiswa" />

        <main className="flex-1 p-6 md:p-8 overflow-y-auto space-y-6 max-w-4xl">
          {/* Header Action Bar */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-xs flex items-center gap-2 transition-all shadow-2xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali</span>
            </button>
          </div>

          {/* Form Card */}
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
            <div>
              <h1 className="text-xl font-bold text-slate-800 tracking-tight">
                Formulir Pencatatan Perwalian
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Silakan lengkapi data di bawah ini untuk mencatat bimbingan perwalian akademik.
              </p>
            </div>

            {formError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* Auto Assigned Dosen Info (Read-only) */}
            <div className="p-4 bg-brand-50/50 border border-brand-100 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-600 text-white font-bold flex items-center justify-center">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-brand-600 tracking-wider">
                    Dosen Wali Terdaftar (Auto-Assigned)
                  </span>
                  <p className="font-bold text-slate-800 text-sm">
                    {dosenWali?.dosen?.full_name || 'Dr. Ahmad Fauzi, M.T.'}
                  </p>
                  <p className="font-mono text-slate-500 text-[11px]">
                    NIDN: {dosenWali?.dosen?.nidn || '0412038501'}
                  </p>
                </div>
              </div>

              <span className="px-3 py-1 bg-white border border-brand-200 text-brand-700 font-bold rounded-lg text-[11px]">
                {dosenWali?.tahun_akademik || '2025/2026 Ganjil'}
              </span>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">Nama Lengkap</label>
                  <input
                    type="text"
                    disabled
                    value={currentUser?.full_name || 'Budi Santoso'}
                    className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-700 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">NIM Mahasiswa</label>
                  <input
                    type="text"
                    disabled
                    value={currentUser?.nim || '10123001'}
                    className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-700 font-mono font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">Tanggal Perwalian</label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="date"
                      required
                      value={tanggal}
                      onChange={(e) => setTanggal(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:border-brand-500 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">Semester</label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:border-brand-500 font-medium"
                  >
                    <option value="Semester 1">Semester 1</option>
                    <option value="Semester 2">Semester 2</option>
                    <option value="Semester 3">Semester 3</option>
                    <option value="Semester 4">Semester 4</option>
                    <option value="Semester 5">Semester 5</option>
                    <option value="Semester 6">Semester 6</option>
                    <option value="Semester 7">Semester 7</option>
                    <option value="Semester 8">Semester 8</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Mata Kuliah (Optional / Terkait Bimbingan)
                </label>
                <div className="relative">
                  <BookOpen className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Contoh: Pemrograman Web II, Kecerdasan Buatan, Tugas Akhir / Skripsi..."
                    value={mataKuliah}
                    onChange={(e) => setMataKuliah(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:border-brand-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Keperluan / Topik Bimbingan
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Contoh: Konsultasi Rencana Studi (KRS) & Pengambilan 24 SKS Semester Ganjil..."
                  value={keperluan}
                  onChange={(e) => setKeperluan(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:border-brand-500 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Catatan Hasil Bimbingan / Arahan Dosen Wali
                </label>
                <textarea
                  rows={4}
                  placeholder="Tuliskan ringkasan hasil bimbingan atau arahan yang diberikan Dosen Wali..."
                  value={catatanHasil}
                  onChange={(e) => setCatatanHasil(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:border-brand-500 focus:bg-white transition-all"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{submitting ? 'Menyimpan...' : 'Simpan Perwalian'}</span>
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
