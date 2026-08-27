-- SEED DATA FOR STMIK BANDUNG ADVISORY SYSTEM

DO $$
DECLARE
  v_admin_id uuid := '00000000-0000-0000-0000-000000000001';
  v_dosen1_id uuid := '00000000-0000-0000-0000-000000000002';
  v_dosen2_id uuid := '00000000-0000-0000-0000-000000000003';
  v_mhs1_id uuid := '00000000-0000-0000-0000-000000000004';
  v_mhs2_id uuid := '00000000-0000-0000-0000-000000000005';
  v_mhs3_id uuid := '00000000-0000-0000-0000-000000000006';
  v_mhs4_id uuid := '00000000-0000-0000-0000-000000000007';
  v_mhs5_id uuid := '00000000-0000-0000-0000-000000000008';
BEGIN

  -- Clean old data
  DELETE FROM public.perwalian;
  DELETE FROM public.dosen_wali;
  DELETE FROM public.profiles;

  -- 1. PUBLIC PROFILES DATA
  -- Admin: admin123
  -- Dosen: NIDN@dosenstmikbandung
  -- Mahasiswa: NIM@mhsstmikbandung
  INSERT INTO public.profiles (id, full_name, role, nim, nidn, email, password) VALUES
    (v_admin_id, 'Administrator Akademik', 'admin', NULL, NULL, 'admin@stmikbandung.ac.id', 'admin123'),
    (v_dosen1_id, 'Dr. Ahmad Fauzi, M.T.', 'dosen', NULL, '0412038501', 'ahmad.fauzi@stmikbandung.ac.id', '0412038501@dosenstmikbandung'),
    (v_dosen2_id, 'Nani Wijaya, S.Kom., M.Cs.', 'dosen', NULL, '0415088902', 'nani.wijaya@stmikbandung.ac.id', '0415088902@dosenstmikbandung'),
    (v_mhs1_id, 'Budi Santoso', 'mahasiswa', '10123001', NULL, '10123001@stmikbandung.ac.id', '10123001@mhsstmikbandung'),
    (v_mhs2_id, 'Siti Aminah', 'mahasiswa', '10123045', NULL, '10123045@stmikbandung.ac.id', '10123045@mhsstmikbandung'),
    (v_mhs3_id, 'Ahmad Fauzi', 'mahasiswa', '10122102', NULL, '10122102@stmikbandung.ac.id', '10122102@mhsstmikbandung'),
    (v_mhs4_id, 'Rina Herawati', 'mahasiswa', '10123088', NULL, '10123088@stmikbandung.ac.id', '10123088@mhsstmikbandung'),
    (v_mhs5_id, 'Dewi Lestari', 'mahasiswa', '10123099', NULL, '10123099@stmikbandung.ac.id', '10123099@mhsstmikbandung')
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    nim = EXCLUDED.nim,
    nidn = EXCLUDED.nidn,
    email = EXCLUDED.email,
    password = EXCLUDED.password;

  -- 2. DOSEN WALI ASSIGNMENTS
  INSERT INTO public.dosen_wali (mahasiswa_id, dosen_id, tahun_akademik) VALUES
    (v_mhs1_id, v_dosen1_id, '2025/2026 Ganjil'),
    (v_mhs2_id, v_dosen1_id, '2025/2026 Ganjil'),
    (v_mhs3_id, v_dosen1_id, '2025/2026 Ganjil'),
    (v_mhs4_id, v_dosen2_id, '2025/2026 Ganjil'),
    (v_mhs5_id, v_dosen2_id, '2025/2026 Ganjil')
  ON CONFLICT (mahasiswa_id, tahun_akademik) DO UPDATE SET
    dosen_id = EXCLUDED.dosen_id;

  -- 3. PERWALIAN LOGS
  INSERT INTO public.perwalian (mahasiswa_id, dosen_id, tanggal_perwalian, semester, keperluan, catatan_hasil, status) VALUES
    (v_mhs1_id, v_dosen1_id, '2025-08-15', 'Semester 5', 'Konsultasi Pengambilan SKS & Rencana Judul Skripsi', 'Mahasiswa disetujui mengambil 24 SKS. Disarankan mulai konsultasi topik riset Artificial Intelligence.', 'selesai'),
    (v_mhs2_id, v_dosen1_id, '2025-08-16', 'Semester 3', 'Bimbingan Akademik & Pengajuan Izin Penelitian', 'Disetujui Surat Pengantar Penelitian ke PT Nusantara. Indeks Prestasi Kumulatif 3.75 memuaskan.', 'selesai'),
    (v_mhs3_id, v_dosen1_id, '2025-08-18', 'Semester 7', 'Permohonan Pengantar Magang MBKM', 'Dokumen magang diverifikasi. Mahasiswa siap terjun magang industri 6 bulan.', 'selesai'),
    (v_mhs4_id, v_dosen2_id, '2025-08-19', 'Semester 1', 'Konsultasi Perencanaan Studi Mahasiswa Baru', 'Mahasiswa beradaptasi dengan baik. Jadwal perkuliahan Paket Semester 1 disetujui 20 SKS.', 'selesai'),
    (v_mhs5_id, v_dosen2_id, '2025-08-20', 'Semester 5', 'Evaluasi Nilai Semester Lalu & Pengajuan Cuti Akademik', 'Mahasiswa berkonsultasi mengenai permohonan dispensasi biaya dan perwalian lanjutan.', 'selesai');

END $$;
