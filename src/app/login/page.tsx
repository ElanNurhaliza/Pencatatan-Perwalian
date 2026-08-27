'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GraduationCap, Lock, Mail, Eye, EyeOff, ArrowRight, Info } from 'lucide-react';
import { authenticateUser } from '@/lib/dataService';

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const userProfile = await authenticateUser(identifier, password);

      if (userProfile.role === 'admin') router.push('/admin/dashboard');
      else if (userProfile.role === 'mahasiswa') router.push('/mahasiswa/dashboard');
      else if (userProfile.role === 'dosen') router.push('/dosen/dashboard');
      else router.push('/');
    } catch (err: any) {
      setErrorMsg(err.message || 'Login gagal. Periksa kembali NIM/NIDN/Email dan Password Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 border border-slate-200">
        
        {/* Left Branding Panel */}
        <div className="bg-gradient-to-br from-brand-600 to-brand-800 text-white p-10 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
          
          <div>
            <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center mb-8 border border-white/20">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            
            <h1 className="text-3xl font-extrabold tracking-tight mb-4 leading-tight">
              Sistem Perwalian Mahasiswa
            </h1>
            <p className="text-brand-100 text-sm leading-relaxed mb-6">
              Platform terpadu untuk pencatatan dan pemantauan perwalian akademik STMIK Bandung. Silakan masuk menggunakan akun terdaftar.
            </p>

            {/* Info Format Password Default */}
            <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-white mb-1">
                <Info className="w-4 h-4 text-brand-200" />
                <span>Format Login Akun:</span>
              </div>
              <p className="text-brand-100">
                • <strong>Mahasiswa</strong>: Username <code className="bg-black/20 px-1 rounded">NIM</code> | Password <code className="bg-black/20 px-1 rounded">NIM@mhsstmikbandung</code>
              </p>
              <p className="text-brand-100">
                • <strong>Dosen</strong>: Username <code className="bg-black/20 px-1 rounded">NIDN</code> | Password <code className="bg-black/20 px-1 rounded">NIDN@dosenstmikbandung</code>
              </p>
              <p className="text-brand-100">
                • <strong>Admin</strong>: Username <code className="bg-black/20 px-1 rounded">admin</code> | Password <code className="bg-black/20 px-1 rounded">admin123</code>
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-white/15">
            <p className="text-xs text-brand-200">
              © {new Date().getFullYear()} STMIK Bandung. All rights reserved.
            </p>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="p-8 md:p-10 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-brand-500 text-white flex items-center justify-center font-bold">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-slate-800">STMIK Bandung</h2>
            </div>

            <p className="text-xs text-slate-500 mb-6">
              Masuk menggunakan akun akademik Anda.
            </p>

            {errorMsg && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-medium">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  NPM / NIDN / EMAIL
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 10123001 atau 0412038501"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-hidden focus:border-brand-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  PASSWORD
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-hidden focus:border-brand-500 focus:bg-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                  <input type="checkbox" className="rounded-sm border-slate-300 text-brand-600 focus:ring-brand-500" />
                  <span>Ingat saya</span>
                </label>
                <button
                  type="button"
                  onClick={() => alert('Silakan hubungi bagian IT Akademik STMIK Bandung untuk me-reset password.')}
                  className="text-brand-600 hover:underline font-semibold"
                >
                  Lupa password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm mt-4 disabled:opacity-50"
              >
                {loading ? 'Memproses...' : 'Login ke Sistem'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          <div className="mt-8 text-center text-xs text-slate-500">
            Butuh bantuan?{' '}
            <button
              onClick={() => alert('Kontak Administrasi: admin@stmikbandung.ac.id')}
              className="text-brand-600 font-semibold hover:underline"
            >
              Hubungi Administrasi →
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
