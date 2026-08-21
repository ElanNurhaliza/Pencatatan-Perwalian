export type UserRole = 'admin' | 'mahasiswa' | 'dosen';

export interface Profile {
  id: string;
  full_name: string;
  role: UserRole;
  nim?: string | null;
  nidn?: string | null;
  email?: string | null;
  created_at?: string;
}

export interface DosenWali {
  id: string;
  mahasiswa_id: string;
  dosen_id: string;
  tahun_akademik: string;
  created_at?: string;
  mahasiswa?: Profile;
  dosen?: Profile;
}

export interface Perwalian {
  id: string;
  mahasiswa_id: string;
  dosen_id: string;
  tanggal_perwalian: string;
  semester: string;
  keperluan: string;
  catatan_hasil?: string | null;
  status: 'selesai' | 'diproses' | 'ditolak' | string;
  created_at?: string;
  mahasiswa?: Profile;
  dosen?: Profile;
}
