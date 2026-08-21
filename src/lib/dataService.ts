import { createClient } from './supabase/client';
import { Profile, DosenWali, Perwalian, UserRole } from './types';
import { INITIAL_PROFILES, INITIAL_DOSEN_WALI, INITIAL_PERWALIAN } from './mockData';

const IS_DEMO_MODE = !process.env.NEXT_PUBLIC_SUPABASE_URL || 
  process.env.NEXT_PUBLIC_SUPABASE_URL.includes('demo-stmik-bandung');

// Local storage keys for demo persistence
const KEY_PROFILES = 'stmik_perwalian_profiles';
const KEY_DOSEN_WALI = 'stmik_perwalian_dosen_wali';
const KEY_PERWALIAN = 'stmik_perwalian_records';
const KEY_CURRENT_USER = 'stmik_perwalian_active_user';

function getLocalData<T>(key: string, defaultVal: T): T {
  if (typeof window === 'undefined') return defaultVal;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultVal;
  } catch {
    return defaultVal;
  }
}

function setLocalData<T>(key: string, val: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (err) {
    console.error('Failed to save to localStorage', err);
  }
}

// Active user session manager
export function setDemoUser(user: Profile) {
  setLocalData(KEY_CURRENT_USER, user);
}

export function getDemoUser(): Profile {
  return getLocalData<Profile>(KEY_CURRENT_USER, INITIAL_PROFILES[0]);
}

export function logoutDemoUser() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(KEY_CURRENT_USER);
  }
}

// --- PROFILES API ---
export async function getProfiles(): Promise<Profile[]> {
  if (IS_DEMO_MODE) {
    return getLocalData<Profile[]>(KEY_PROFILES, INITIAL_PROFILES);
  }
  const supabase = createClient();
  const { data, error } = await supabase.from('profiles').select('*');
  if (error) {
    console.warn('Supabase getProfiles error, falling back to mock:', error);
    return getLocalData<Profile[]>(KEY_PROFILES, INITIAL_PROFILES);
  }
  return data || [];
}

export async function addProfilesBatch(newProfiles: Partial<Profile>[]): Promise<Profile[]> {
  if (IS_DEMO_MODE) {
    const existing = getLocalData<Profile[]>(KEY_PROFILES, INITIAL_PROFILES);
    const createdList: Profile[] = newProfiles.map((p) => ({
      id: crypto.randomUUID(),
      full_name: p.full_name || 'Tanpa Nama',
      role: p.role || 'mahasiswa',
      nim: p.nim || null,
      nidn: p.nidn || null,
      email: p.email || `${p.nim || p.nidn || Date.now()}@stmikbandung.ac.id`,
      created_at: new Date().toISOString(),
    }));
    const updated = [...existing, ...createdList];
    setLocalData(KEY_PROFILES, updated);
    return createdList;
  }

  const supabase = createClient();
  const { data, error } = await supabase.from('profiles').insert(newProfiles).select();
  if (error) throw new Error(error.message);
  return data || [];
}

// --- DOSEN WALI API ---
export async function getDosenWaliList(): Promise<DosenWali[]> {
  const profiles = await getProfiles();
  
  if (IS_DEMO_MODE) {
    const rawList = getLocalData<DosenWali[]>(KEY_DOSEN_WALI, INITIAL_DOSEN_WALI);
    return rawList.map((dw) => ({
      ...dw,
      mahasiswa: profiles.find((p) => p.id === dw.mahasiswa_id),
      dosen: profiles.find((p) => p.id === dw.dosen_id),
    }));
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from('dosen_wali')
    .select(`
      *,
      mahasiswa:profiles!dosen_wali_mahasiswa_id_fkey(*),
      dosen:profiles!dosen_wali_dosen_id_fkey(*)
    `);

  if (error) {
    console.warn('Supabase getDosenWaliList error, using mock:', error);
    const rawList = getLocalData<DosenWali[]>(KEY_DOSEN_WALI, INITIAL_DOSEN_WALI);
    return rawList.map((dw) => ({
      ...dw,
      mahasiswa: profiles.find((p) => p.id === dw.mahasiswa_id),
      dosen: profiles.find((p) => p.id === dw.dosen_id),
    }));
  }

  return data || [];
}

export async function addDosenWaliAssignment(assignment: {
  mahasiswa_id: string;
  dosen_id: string;
  tahun_akademik: string;
}): Promise<DosenWali> {
  const currentAssignments = await getDosenWaliList();
  
  // Validation: Check if student already has a supervisor in the given academic year
  const exists = currentAssignments.find(
    (dw) => dw.mahasiswa_id === assignment.mahasiswa_id && dw.tahun_akademik === assignment.tahun_akademik
  );
  if (exists) {
    throw new Error(`Mahasiswa ini sudah memiliki Dosen Wali aktif pada ${assignment.tahun_akademik}!`);
  }

  if (IS_DEMO_MODE) {
    const rawList = getLocalData<DosenWali[]>(KEY_DOSEN_WALI, INITIAL_DOSEN_WALI);
    const newEntry: DosenWali = {
      id: `dw-${Date.now()}`,
      mahasiswa_id: assignment.mahasiswa_id,
      dosen_id: assignment.dosen_id,
      tahun_akademik: assignment.tahun_akademik,
      created_at: new Date().toISOString(),
    };
    const updated = [newEntry, ...rawList];
    setLocalData(KEY_DOSEN_WALI, updated);
    
    const profiles = await getProfiles();
    return {
      ...newEntry,
      mahasiswa: profiles.find((p) => p.id === newEntry.mahasiswa_id),
      dosen: profiles.find((p) => p.id === newEntry.dosen_id),
    };
  }

  const supabase = createClient();
  const { data, error } = await supabase.from('dosen_wali').insert([assignment]).select().single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteDosenWaliAssignment(id: string): Promise<void> {
  if (IS_DEMO_MODE) {
    const rawList = getLocalData<DosenWali[]>(KEY_DOSEN_WALI, INITIAL_DOSEN_WALI);
    const updated = rawList.filter((item) => item.id !== id);
    setLocalData(KEY_DOSEN_WALI, updated);
    return;
  }

  const supabase = createClient();
  const { error } = await supabase.from('dosen_wali').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

// --- PERWALIAN API ---
export async function getPerwalianList(): Promise<Perwalian[]> {
  const profiles = await getProfiles();

  if (IS_DEMO_MODE) {
    const rawList = getLocalData<Perwalian[]>(KEY_PERWALIAN, INITIAL_PERWALIAN);
    return rawList.map((pw) => ({
      ...pw,
      mahasiswa: profiles.find((p) => p.id === pw.mahasiswa_id),
      dosen: profiles.find((p) => p.id === pw.dosen_id),
    })).sort((a, b) => new Date(b.tanggal_perwalian).getTime() - new Date(a.tanggal_perwalian).getTime());
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from('perwalian')
    .select(`
      *,
      mahasiswa:profiles!perwalian_mahasiswa_id_fkey(*),
      dosen:profiles!perwalian_dosen_id_fkey(*)
    `)
    .order('tanggal_perwalian', { ascending: false });

  if (error) {
    console.warn('Supabase getPerwalianList error, using mock:', error);
    const rawList = getLocalData<Perwalian[]>(KEY_PERWALIAN, INITIAL_PERWALIAN);
    return rawList.map((pw) => ({
      ...pw,
      mahasiswa: profiles.find((p) => p.id === pw.mahasiswa_id),
      dosen: profiles.find((p) => p.id === pw.dosen_id),
    })).sort((a, b) => new Date(b.tanggal_perwalian).getTime() - new Date(a.tanggal_perwalian).getTime());
  }

  return data || [];
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
  if (IS_DEMO_MODE) {
    const rawList = getLocalData<Perwalian[]>(KEY_PERWALIAN, INITIAL_PERWALIAN);
    const newEntry: Perwalian = {
      id: `pw-${Date.now()}`,
      mahasiswa_id: record.mahasiswa_id,
      dosen_id: record.dosen_id,
      tanggal_perwalian: record.tanggal_perwalian,
      semester: record.semester,
      keperluan: record.keperluan,
      catatan_hasil: record.catatan_hasil || null,
      status: record.status || 'selesai',
      created_at: new Date().toISOString(),
    };
    const updated = [newEntry, ...rawList];
    setLocalData(KEY_PERWALIAN, updated);
    
    const profiles = await getProfiles();
    return {
      ...newEntry,
      mahasiswa: profiles.find((p) => p.id === newEntry.mahasiswa_id),
      dosen: profiles.find((p) => p.id === newEntry.dosen_id),
    };
  }

  const supabase = createClient();
  const { data, error } = await supabase.from('perwalian').insert([record]).select().single();
  if (error) throw new Error(error.message);
  return data;
}
