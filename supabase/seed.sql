-- SEED DATA FOR STMIK BANDUNG ADVISORY SYSTEM
CREATE EXTENSION IF NOT EXISTS pgcrypto;

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

  -- 1. INSERT INTO AUTH.USERS
  INSERT INTO auth.users (
    id, instance_id, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role, aud
  ) VALUES
    (v_admin_id, '00000000-0000-0000-0000-000000000000', 'admin@stmikbandung.ac.id', crypt('admin123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Administrator Akademik","role":"admin"}', now(), now(), 'authenticated', 'authenticated'),
    (v_dosen1_id, '00000000-0000-0000-0000-000000000000', 'ahmad.fauzi@stmikbandung.ac.id', crypt('dosen123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Dr. Ahmad Fauzi, M.T.","role":"dosen","nidn":"0412038501"}', now(), now(), 'authenticated', 'authenticated'),
    (v_dosen2_id, '00000000-0000-0000-0000-000000000000', 'nani.wijaya@stmikbandung.ac.id', crypt('dosen123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Nani Wijaya, S.Kom., M.Cs.","role":"dosen","nidn":"0415088902"}', now(), now(), 'authenticated', 'authenticated'),
    (v_mhs1_id, '00000000-0000-0000-0000-000000000000', '10123001@stmikbandung.ac.id', crypt('mhs123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Budi Santoso","role":"mahasiswa","nim":"10123001"}', now(), now(), 'authenticated', 'authenticated'),
    (v_mhs2_id, '00000000-0000-0000-0000-000000000000', '10123045@stmikbandung.ac.id', crypt('mhs123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Siti Aminah","role":"mahasiswa","nim":"10123045"}', now(), now(), 'authenticated', 'authenticated'),
    (v_mhs3_id, '00000000-0000-0000-0000-000000000000', '10122102@stmikbandung.ac.id', crypt('mhs123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Ahmad Fauzi","role":"mahasiswa","nim":"10122102"}', now(), now(), 'authenticated', 'authenticated'),
    (v_mhs4_id, '00000000-0000-0000-0000-000000000000', '10123088@stmikbandung.ac.id', crypt('mhs123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Rina Herawati","role":"mahasiswa","nim":"10123088"}', now(), now(), 'authenticated', 'authenticated'),
    (v_mhs5_id, '00000000-0000-0000-0000-000000000000', '10123099@stmikbandung.ac.id', crypt('mhs123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Dewi Lestari","role":"mahasiswa","nim":"10123099"}', now(), now(), 'authenticated', 'authenticated')
  ON CONFLICT (id) DO UPDATE SET
    encrypted_password = EXCLUDED.encrypted_password,
    raw_user_meta_data = EXCLUDED.raw_user_meta_data;

  -- 2. INSERT INTO AUTH.IDENTITIES (with provider_id populated)
  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES
    (v_admin_id, v_admin_id, format('{"sub":"%s","email":"%s"}', v_admin_id, 'admin@stmikbandung.ac.id')::jsonb, 'email', v_admin_id::text, now(), now(), now()),
    (v_dosen1_id, v_dosen1_id, format('{"sub":"%s","email":"%s"}', v_dosen1_id, 'ahmad.fauzi@stmikbandung.ac.id')::jsonb, 'email', v_dosen1_id::text, now(), now(), now()),
    (v_dosen2_id, v_dosen2_id, format('{"sub":"%s","email":"%s"}', v_dosen2_id, 'nani.wijaya@stmikbandung.ac.id')::jsonb, 'email', v_dosen2_id::text, now(), now(), now()),
    (v_mhs1_id, v_mhs1_id, format('{"sub":"%s","email":"%s"}', v_mhs1_id, '10123001@stmikbandung.ac.id')::jsonb, 'email', v_mhs1_id::text, now(), now(), now()),
    (v_mhs2_id, v_mhs2_id, format('{"sub":"%s","email":"%s"}', v_mhs2_id, '10123045@stmikbandung.ac.id')::jsonb, 'email', v_mhs2_id::text, now(), now(), now()),
    (v_mhs3_id, v_mhs3_id, format('{"sub":"%s","email":"%s"}', v_mhs3_id, '10122102@stmikbandung.ac.id')::jsonb, 'email', v_mhs3_id::text, now(), now(), now()),
    (v_mhs4_id, v_mhs4_id, format('{"sub":"%s","email":"%s"}', v_mhs4_id, '10123088@stmikbandung.ac.id')::jsonb, 'email', v_mhs4_id::text, now(), now(), now()),
    (v_mhs5_id, v_mhs5_id, format('{"sub":"%s","email":"%s"}', v_mhs5_id, '10123099@stmikbandung.ac.id')::jsonb, 'email', v_mhs5_id::text, now(), now(), now())
  ON CONFLICT (id) DO NOTHING;

  -- 3. PUBLIC PROFILES
  INSERT INTO public.profiles (id, full_name, role, nim, nidn, email) VALUES
    (v_admin_id, 'Administrator Akademik', 'admin', NULL, NULL, 'admin@stmikbandung.ac.id'),
    (v_dosen1_id, 'Dr. Ahmad Fauzi, M.T.', 'dosen', NULL, '0412038501', 'ahmad.fauzi@stmikbandung.ac.id'),
    (v_dosen2_id, 'Nani Wijaya, S.Kom., M.Cs.', 'dosen', NULL, '0415088902', 'nani.wijaya@stmikbandung.ac.id'),
    (v_mhs1_id, 'Budi Santoso', 'mahasiswa', '10123001', NULL, '10123001@stmikbandung.ac.id'),
    (v_mhs2_id, 'Siti Aminah', 'mahasiswa', '10123045', NULL, '10123045@stmikbandung.ac.id'),
    (v_mhs3_id, 'Ahmad Fauzi', 'mahasiswa', '10122102', NULL, '10122102@stmikbandung.ac.id'),
    (v_mhs4_id, 'Rina Herawati', 'mahasiswa', '10123088', NULL, '10123088@stmikbandung.ac.id'),
    (v_mhs5_id, 'Dewi Lestari', 'mahasiswa', '10123099', NULL, '10123099@stmikbandung.ac.id')
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    nim = EXCLUDED.nim,
    nidn = EXCLUDED.nidn,
    email = EXCLUDED.email;

  -- 4. DOSEN WALI
  INSERT INTO public.dosen_wali (mahasiswa_id, dosen_id, tahun_akademik) VALUES
    (v_mhs1_id, v_dosen1_id, '2025/2026 Ganjil'),
    (v_mhs2_id, v_dosen1_id, '2025/2026 Ganjil'),
    (v_mhs3_id, v_dosen1_id, '2025/2026 Ganjil'),
    (v_mhs4_id, v_dosen2_id, '2025/2026 Ganjil'),
    (v_mhs5_id, v_dosen2_id, '2025/2026 Ganjil')
  ON CONFLICT (mahasiswa_id, tahun_akademik) DO UPDATE SET
    dosen_id = EXCLUDED.dosen_id;

  -- 5. PERWALIAN LOGS
  INSERT INTO public.perwalian (mahasiswa_id, dosen_id, tanggal_perwalian, semester, keperluan, catatan_hasil, status) VALUES
    (v_mhs1_id, v_dosen1_id, '2025-08-15', 'Semester 5', 'Konsultasi Pengambilan SKS & Rencana Judul Skripsi', 'Mahasiswa disetujui mengambil 24 SKS. Disarankan mulai konsultasi topik riset Artificial Intelligence.', 'selesai'),
    (v_mhs2_id, v_dosen1_id, '2025-08-16', 'Semester 3', 'Bimbingan Akademik & Pengajuan Izin Penelitian', 'Disetujui Surat Pengantar Penelitian ke PT Nusantara. Indeks Prestasi Kumulatif 3.75 memuaskan.', 'selesai'),
    (v_mhs3_id, v_dosen1_id, '2025-08-18', 'Semester 7', 'Permohonan Pengantar Magang MBKM', 'Dokumen magang diverifikasi. Mahasiswa siap terjun magang industri 6 bulan.', 'selesai'),
    (v_mhs4_id, v_dosen2_id, '2025-08-19', 'Semester 1', 'Konsultasi Perencanaan Studi Mahasiswa Baru', 'Mahasiswa beradaptasi dengan baik. Jadwal perkuliahan Paket Semester 1 disetujui 20 SKS.', 'selesai'),
    (v_mhs5_id, v_dosen2_id, '2025-08-20', 'Semester 5', 'Evaluasi Nilai Semester Lalu & Pengajuan Cuti Akademik', 'Mahasiswa berkonsultasi mengenai permohonan dispensasi biaya dan perwalian lanjutan.', 'selesai');

END $$;
