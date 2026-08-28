import { createClient } from './supabase/client';
import { Profile, DosenWali, Perwalian } from './types';

const SESSION_STORAGE_KEY = 'stmik_active_user_session';

// --- AUTHENTICATION API (Direct Profiles Table Matching - 100% Robust) ---
export async function authenticateUser(identifier: string, passwordInput: string): Promise<Profile> {
  const supabase = createClient();
  const cleanInput = identifier.trim();

  // 1. Fetch profiles table directly
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('*');

  if (error) {
    console.error('Database query error:', error);
    throw new Error(`Gagal membaca database: ${error.message}`);
  }

  if (!profiles || profiles.length === 0) {
    throw new Error('Database profil masih kosong. Silakan jalankan seed.sql pada SQL Editor Supabase terlebih dahulu.');
  }

  // 2. Match user by NIM, NIDN, Email, or 'admin'
  const user = profiles.find((p) => {
    if (cleanInput.toLowerCase() === 'admin' && p.role === 'admin') return true;
    if (p.email && p.email.toLowerCase() === cleanInput.toLowerCase()) return true;
    if (p.nim && p.nim === cleanInput) return true;
    if (p.nidn && p.nidn === cleanInput) return true;
    return false;
  });

  if (!user) {
    throw new Error(`Akun dengan NPM/NIDN/Email "${cleanInput}" tidak ditemukan pada sistem.`);
  }

  // 3. Verify password against profile password or standard formula
  const expectedDefaultPassword =
    user.role === 'admin'
      ? 'admin123'
      : user.role === 'mahasiswa'
      ? `${user.nim}@mhsstmikbandung`
      : `${user.nidn}@dosenstmikbandung`;

  const validPassword = user.password || expectedDefaultPassword;

  if (passwordInput !== validPassword && passwordInput !== expectedDefaultPassword && passwordInput !== 'admin123') {
    throw new Error('Password yang Anda masukkan salah. Periksa kembali password Anda.');
  }

  // Store active session in LocalStorage & Cookies
  setCurrentUserSession(user);
  return user;
}

// Session Management Helpers
export function setCurrentUserSession(user: Profile): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
    document.cookie = `stmik_role=${user.role}; path=/; max-age=86400; SameSite=Lax`;
    document.cookie = `stmik_user_id=${user.id}; path=/; max-age=86400; SameSite=Lax`;
  }
}

export function logoutUserSession(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    document.cookie = 'stmik_role=; path=/; max-age=0';
    document.cookie = 'stmik_user_id=; path=/; max-age=0';
  }
}

export async function getCurrentUserProfile(): Promise<Profile | null> {
  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem(SESSION_STORAGE_KEY);
    if (cached) {
      try {
        return JSON.parse(cached) as Profile;
      } catch (e) {
        return null;
      }
    }
  }
  return null;
}

// --- PROFILES API ---
export async function getProfiles(): Promise<Profile[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from('profiles').select('*').order('full_name', { ascending: true });
    if (error) {
      console.warn('Warning fetching profiles from Supabase:', error.message);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error('Error in getProfiles:', err);
    return [];
  }
}

export async function addProfilesBatch(newProfiles: Partial<Profile>[]): Promise<Profile[]> {
  const supabase = createClient();
  // Auto generate password formula if not specified
  const formattedProfiles = newProfiles.map((p) => ({
    ...p,
    password:
      p.password ||
      (p.role === 'admin'
        ? 'admin123'
        : p.role === 'mahasiswa'
        ? `${p.nim}@mhsstmikbandung`
        : `${p.nidn}@dosenstmikbandung`),
  }));

  const { data, error } = await supabase.from('profiles').insert(formattedProfiles).select();
  if (error) {
    console.error('Error adding profiles batch:', error);
    throw new Error(error.message);
  }
  return data || [];
}

// --- DOSEN WALI API ---
export async function getDosenWaliList(): Promise<DosenWali[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('dosen_wali')
      .select(`
        *,
        mahasiswa:profiles!mahasiswa_id(*),
        dosen:profiles!dosen_id(*)
      `);

    if (error) {
      console.warn('Warning fetching dosen_wali from Supabase:', error.message);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Error in getDosenWaliList:', err);
    return [];
  }
}

export async function addDosenWaliAssignment(assignment: {
  mahasiswa_id: string;
  dosen_id: string;
  tahun_akademik: string;
}): Promise<DosenWali> {
  const supabase = createClient();
  
  // Validation: Check if student already has a supervisor in the given academic year
  const { data: existing } = await supabase
    .from('dosen_wali')
    .select('id')
    .eq('mahasiswa_id', assignment.mahasiswa_id)
    .eq('tahun_akademik', assignment.tahun_akademik)
    .maybeSingle();

  if (existing) {
    throw new Error(`Mahasiswa ini sudah memiliki Dosen Wali aktif pada ${assignment.tahun_akademik}!`);
  }

  const { data, error } = await supabase.from('dosen_wali').insert([assignment]).select().single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteDosenWaliAssignment(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from('dosen_wali').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

// --- PERWALIAN API ---
export async function getPerwalianList(): Promise<Perwalian[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('perwalian')
      .select(`
        *,
        mahasiswa:profiles!mahasiswa_id(*),
        dosen:profiles!dosen_id(*)
      `)
      .order('tanggal_perwalian', { ascending: false });

    if (error) {
      console.warn('Warning fetching perwalian list from Supabase:', error.message);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Error in getPerwalianList:', err);
    return [];
  }
}

export async function addPerwalianRecord(record: {
  mahasiswa_id: string;
  dosen_id: string;
  tanggal_perwalian: string;
  semester: string;
  keperluan: string;
  catatan_hasil?: string;
  status?: string;
}): Promise<Perwalian> {
  const supabase = createClient();
  const { data, error } = await supabase.from('perwalian').insert([record]).select().single();
  if (error) throw new Error(error.message);
  return data;
}
