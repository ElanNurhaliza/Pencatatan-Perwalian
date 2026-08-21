import { Profile, DosenWali, Perwalian } from './types';

export const INITIAL_PROFILES: Profile[] = [
  {
    id: '00000000-0000-0000-0000-000000000001',
    full_name: 'Administrator STMIK Bandung',
    role: 'admin',
    email: 'admin@stmikbandung.ac.id',
    created_at: '2025-01-01T00:00:00Z',
  },
  {
    id: '00000000-0000-0000-0000-000000000002',
    full_name: 'Dr. Ahmad Fauzi, M.T.',
    role: 'dosen',
    nidn: '0412038501',
    email: 'ahmad.fauzi@stmikbandung.ac.id',
    created_at: '2025-01-01T00:00:00Z',
  },
  {
    id: '00000000-0000-0000-0000-000000000003',
    full_name: 'Nani Wijaya, S.Kom., M.Cs.',
    role: 'dosen',
    nidn: '0415088902',
    email: 'nani.wijaya@stmikbandung.ac.id',
    created_at: '2025-01-01T00:00:00Z',
  },
  {
    id: '00000000-0000-0000-0000-000000000004',
    full_name: 'Budi Santoso',
    role: 'mahasiswa',
    nim: '10123001',
    email: '10123001@stmikbandung.ac.id',
    created_at: '2025-01-01T00:00:00Z',
  },
  {
    id: '00000000-0000-0000-0000-000000000005',
    full_name: 'Siti Aminah',
    role: 'mahasiswa',
    nim: '10123045',
    email: '10123045@stmikbandung.ac.id',
    created_at: '2025-01-01T00:00:00Z',
  },
  {
    id: '00000000-0000-0000-0000-000000000006',
    full_name: 'Ahmad Fauzi',
    role: 'mahasiswa',
    nim: '10122102',
    email: '10122102@stmikbandung.ac.id',
    created_at: '2025-01-01T00:00:00Z',
  },
  {
    id: '00000000-0000-0000-0000-000000000007',
    full_name: 'Rina Herawati',
    role: 'mahasiswa',
    nim: '10123088',
    email: '10123088@stmikbandung.ac.id',
    created_at: '2025-01-01T00:00:00Z',
  },
  {
    id: '00000000-0000-0000-0000-000000000008',
    full_name: 'Dewi Lestari',
    role: 'mahasiswa',
    nim: '10123099',
    email: '10123099@stmikbandung.ac.id',
    created_at: '2025-01-01T00:00:00Z',
  },
];

export const INITIAL_DOSEN_WALI: DosenWali[] = [
  {
    id: 'dw-1',
    mahasiswa_id: '00000000-0000-0000-0000-000000000004', // Budi Santoso
    dosen_id: '00000000-0000-0000-0000-000000000002',     // Dr. Ahmad Fauzi
    tahun_akademik: '2025/2026 Ganjil',
    created_at: '2025-08-01T00:00:00Z',
  },
  {
    id: 'dw-2',
    mahasiswa_id: '00000000-0000-0000-0000-000000000005', // Siti Aminah
    dosen_id: '00000000-0000-0000-0000-000000000002',     // Dr. Ahmad Fauzi
    tahun_akademik: '2025/2026 Ganjil',
    created_at: '2025-08-01T00:00:00Z',
  },
  {
    id: 'dw-3',
    mahasiswa_id: '00000000-0000-0000-0000-000000000006', // Ahmad Fauzi
    dosen_id: '00000000-0000-0000-0000-000000000002',     // Dr. Ahmad Fauzi
    tahun_akademik: '2025/2026 Ganjil',
    created_at: '2025-08-01T00:00:00Z',
  },
  {
    id: 'dw-4',
    mahasiswa_id: '00000000-0000-0000-0000-000000000007', // Rina Herawati
    dosen_id: '00000000-0000-0000-0000-000000000003',     // Nani Wijaya
    tahun_akademik: '2025/2026 Ganjil',
    created_at: '2025-08-01T00:00:00Z',
  },
  {
    id: 'dw-5',
    mahasiswa_id: '00000000-0000-0000-0000-000000000008', // Dewi Lestari
    dosen_id: '00000000-0000-0000-0000-000000000003',     // Nani Wijaya
    tahun_akademik: '2025/2026 Ganjil',
    created_at: '2025-08-01T00:00:00Z',
  },
];

export const INITIAL_PERWALIAN: Perwalian[] = [
  {
    id: 'pw-1',
    mahasiswa_id: '00000000-0000-0000-0000-000000000004',
    dosen_id: '00000000-0000-0000-0000-000000000002',
    tanggal_perwalian: '2025-08-15',
    semester: 'Semester 5',
    keperluan: 'Konsultasi Pengambilan SKS & Rencana Judul Skripsi',
    catatan_hasil: 'Mahasiswa disetujui mengambil 24 SKS. Disarankan mulai konsultasi topik riset Artificial Intelligence.',
    status: 'selesai',
    created_at: '2025-08-15T09:30:00Z',
  },
  {
    id: 'pw-2',
    mahasiswa_id: '00000000-0000-0000-0000-000000000005',
    dosen_id: '00000000-0000-0000-0000-000000000002',
    tanggal_perwalian: '2025-08-16',
    semester: 'Semester 3',
    keperluan: 'Bimbingan Akademik & Pengajuan Izin Penelitian',
    catatan_hasil: 'Disetujui Surat Pengantar Penelitian ke PT Nusantara. Indeks Prestasi Kumulatif 3.75 memuaskan.',
    status: 'selesai',
    created_at: '2025-08-16T10:15:00Z',
  },
  {
    id: 'pw-3',
    mahasiswa_id: '00000000-0000-0000-0000-000000000006',
    dosen_id: '00000000-0000-0000-0000-000000000002',
    tanggal_perwalian: '2025-08-18',
    semester: 'Semester 7',
    keperluan: 'Permohonan Pengantar Magang MBKM',
    catatan_hasil: 'Dokumen magang diverifikasi. Mahasiswa siap terjun magang industri 6 bulan.',
    status: 'selesai',
    created_at: '2025-08-18T14:00:00Z',
  },
  {
    id: 'pw-4',
    mahasiswa_id: '00000000-0000-0000-0000-000000000007',
    dosen_id: '00000000-0000-0000-0000-000000000003',
    tanggal_perwalian: '2025-08-19',
    semester: 'Semester 1',
    keperluan: 'Konsultasi Perencanaan Studi Mahasiswa Baru',
    catatan_hasil: 'Mahasiswa beradaptasi dengan baik. Jadwal perkuliahan Paket Semester 1 disetujui 20 SKS.',
    status: 'selesai',
    created_at: '2025-08-19T11:00:00Z',
  },
  {
    id: 'pw-5',
    mahasiswa_id: '00000000-0000-0000-0000-000000000008',
    dosen_id: '00000000-0000-0000-0000-000000000003',
    tanggal_perwalian: '2025-08-20',
    semester: 'Semester 5',
    keperluan: 'Evaluasi Nilai Semester Lalu & Kendala SPP',
    catatan_hasil: 'Mahasiswa berkonsultasi mengenai permohonan dispensasi biaya dan perwalian susulan.',
    status: 'selesai',
    created_at: '2025-08-20T08:45:00Z',
  },
];
