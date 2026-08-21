import { createClient } from './supabase/client';
import { Profile, DosenWali, Perwalian } from './types';

// Helper to get currently logged in user profile from Supabase Auth
export async function getCurrentUserProfile(): Promise<Profile | null> {
  const supabase = createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) return null;

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) return null;
  return profile as Profile;
}

// --- PROFILES API ---
export async function getProfiles(): Promise<Profile[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from('profiles').select('*');
  if (error) {
    console.error('Error fetching profiles from Supabase:', error);
    throw new Error(error.message);
  }
  return data || [];
}

export async function addProfilesBatch(newProfiles: Partial<Profile>[]): Promise<Profile[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from('profiles').insert(newProfiles).select();
  if (error) {
    console.error('Error adding profiles batch:', error);
    throw new Error(error.message);
  }
  return data || [];
}

// --- DOSEN WALI API ---
export async function getDosenWaliList(): Promise<DosenWali[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('dosen_wali')
    .select(`
      *,
      mahasiswa:profiles!dosen_wali_mahasiswa_id_fkey(*),
      dosen:profiles!dosen_wali_dosen_id_fkey(*)
    `);

  if (error) {
    console.error('Error fetching dosen_wali from Supabase:', error);
    throw new Error(error.message);
  }

  return data || [];
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
    console.error('Error fetching perwalian list from Supabase:', error);
    throw new Error(error.message);
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
  const supabase = createClient();
  const { data, error } = await supabase.from('perwalian').insert([record]).select().single();
  if (error) throw new Error(error.message);
  return data;
}
