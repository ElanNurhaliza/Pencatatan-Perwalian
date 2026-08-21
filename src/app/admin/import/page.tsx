'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { Upload, FileSpreadsheet, Download, CheckCircle2, AlertCircle } from 'lucide-react';
import { getDemoUser, addProfilesBatch } from '@/lib/dataService';
import { Profile } from '@/lib/types';
import Papa from 'papaparse';

interface ParsedCSVRow {
  full_name?: string;
  role?: string;
  nim?: string;
  nidn?: string;
  email?: string;
  [key: string]: any;
}

export default function AdminImportPage() {
  const currentUser = getDemoUser();
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedCSVRow[]>([]);
  const [importing, setImporting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    setSuccessMsg('');
    setErrorMsg('');

    Papa.parse<ParsedCSVRow>(uploadedFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          setErrorMsg('Terdapat format yang salah pada file CSV.');
        }
        setParsedData(results.data);
      },
      error: (err) => {
        setErrorMsg(`Gagal membaca file: ${err.message}`);
      },
    });
  };

  const handleDownloadTemplate = () => {
    const templateContent = `full_name,role,nim,nidn,email
Andi Wijaya,mahasiswa,10123101,,10123101@stmikbandung.ac.id
Budi Setiawan,mahasiswa,10123102,,10123102@stmikbandung.ac.id
Dr. Bambang Kusuma,dosen,,0418099001,bambang@stmikbandung.ac.id`;

    const blob = new Blob([templateContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'template_import_mahasiswa_dosen.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExecuteImport = async () => {
    if (parsedData.length === 0) {
      setErrorMsg('Belum ada data file CSV yang diunggah.');
      return;
    }

    setImporting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const profilesToAdd: Partial<Profile>[] = parsedData.map((row) => ({
        full_name: row.full_name || row['Nama Lengkap'] || row.nama || 'Tanpa Nama',
        role: (row.role?.toLowerCase() as any) || (row.nim ? 'mahasiswa' : 'dosen'),
        nim: row.nim || row.NIM || null,
        nidn: row.nidn || row.NIDN || null,
        email: row.email || `${row.nim || row.nidn || Date.now()}@stmikbandung.ac.id`,
      }));

      await addProfilesBatch(profilesToAdd);

      setSuccessMsg(`Berhasil mengimpor ${profilesToAdd.length} data profil pengguna baru!`);
      setFile(null);
      setParsedData([]);
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal mengimpor data pengguna.');
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar role="admin" userName={currentUser?.full_name} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header user={currentUser} title="Import Data Mahasiswa & Dosen" />

        <main className="flex-1 p-6 md:p-8 overflow-y-auto space-y-6">
          {/* Header Banner */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Import Data Massal</h1>
            <p className="text-xs text-slate-500 mt-1">
              Unggah file CSV untuk menambahkan data Mahasiswa & Dosen ke sistem perwalian secara cepat.
            </p>
          </div>

          {/* Upload & Preview Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Upload Area */}
            <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-brand-600" />
                  Upload File CSV
                </h3>

                {successMsg && (
                  <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{successMsg}</span>
                  </div>
                )}

                {errorMsg && (
                  <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Dropzone */}
                <label className="border-2 border-dashed border-slate-200 hover:border-brand-500 bg-slate-50 hover:bg-brand-50/30 p-8 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all text-center">
                  <div className="w-12 h-12 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center mb-3">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-bold text-slate-700">
                    {file ? file.name : 'Klik untuk unggah atau seret file ke sini'}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Maksimal ukuran file: 10MB (.csv format)
                  </p>
                  <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>

              {/* Controls */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleDownloadTemplate}
                  className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Unduh Template</span>
                </button>

                <button
                  type="button"
                  onClick={handleExecuteImport}
                  disabled={importing || parsedData.length === 0}
                  className="w-full sm:w-auto px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md disabled:opacity-50 transition-all"
                >
                  {importing ? 'Mengimpor...' : 'Mulai Import'}
                </button>
              </div>
            </div>

            {/* Preview Table */}
            <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-800">
                    Pratinjau Data {file ? `(${file.name})` : ''}
                  </h3>
                  {parsedData.length > 0 && (
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold">
                      {parsedData.length} baris terbaca
                    </span>
                  )}
                </div>

                <div className="overflow-x-auto max-h-96">
                  <table className="w-full text-left text-xs text-slate-600">
                    <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100 uppercase tracking-wider sticky top-0">
                      <tr>
                        <th className="py-2.5 px-3">No</th>
                        <th className="py-2.5 px-3">Nama Lengkap</th>
                        <th className="py-2.5 px-3">Role</th>
                        <th className="py-2.5 px-3">NIM / NIDN</th>
                        <th className="py-2.5 px-3">Email</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {parsedData.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-12 text-center text-slate-400">
                            Unggah file CSV untuk melihat pratinjau data.
                          </td>
                        </tr>
                      ) : (
                        parsedData.map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/80">
                            <td className="py-2.5 px-3 font-mono text-slate-400">{idx + 1}</td>
                            <td className="py-2.5 px-3 font-bold text-slate-800">
                              {row.full_name || row['Nama Lengkap'] || '-'}
                            </td>
                            <td className="py-2.5 px-3 font-medium capitalize text-slate-600">
                              {row.role || (row.nim ? 'mahasiswa' : 'dosen')}
                            </td>
                            <td className="py-2.5 px-3 font-mono text-slate-700">
                              {row.nim || row.nidn || '-'}
                            </td>
                            <td className="py-2.5 px-3 text-slate-500">{row.email || '-'}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {parsedData.length > 5 && (
                <p className="text-[11px] text-slate-400 mt-3 text-right">
                  Menampilkan pratinjau selengkapnya ({parsedData.length} baris)
                </p>
              )}
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
