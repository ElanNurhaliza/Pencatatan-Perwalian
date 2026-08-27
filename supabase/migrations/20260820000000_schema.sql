-- Migration file for STMIK Bandung Advisory System (Direct Profile Auth Schema)

-- Drop existing objects for clean setup
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();
drop function if exists public.is_admin();

drop table if exists public.perwalian cascade;
drop table if exists public.dosen_wali cascade;
drop table if exists public.profiles cascade;

-- Create extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- 1. PROFILES TABLE (Independent Standalone Profile Table)
create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  role text not null check (role in ('admin', 'mahasiswa', 'dosen')),
  nim text unique,          -- Only for role = 'mahasiswa'
  nidn text unique,         -- Only for role = 'dosen'
  email text unique,
  password text not null default 'stmik123',
  created_at timestamptz default now()
);

-- Indexing profiles
create index idx_profiles_role on public.profiles(role);
create index idx_profiles_nim on public.profiles(nim);
create index idx_profiles_nidn on public.profiles(nidn);
create index idx_profiles_email on public.profiles(email);

-- 2. DOSEN_WALI TABLE (Relasi Mahasiswa <-> Dosen)
create table public.dosen_wali (
  id uuid primary key default gen_random_uuid(),
  mahasiswa_id uuid not null references public.profiles(id) on delete cascade,
  dosen_id uuid not null references public.profiles(id) on delete cascade,
  tahun_akademik text not null, -- e.g. '2025/2026 Ganjil'
  created_at timestamptz default now(),
  constraint unique_mahasiswa_tahun_akademik unique(mahasiswa_id, tahun_akademik)
);

-- Indexing dosen_wali
create index idx_dosen_wali_mahasiswa on public.dosen_wali(mahasiswa_id);
create index idx_dosen_wali_dosen on public.dosen_wali(dosen_id);
create index idx_dosen_wali_tahun on public.dosen_wali(tahun_akademik);

-- 3. PERWALIAN TABLE (Log Perwalian)
create table public.perwalian (
  id uuid primary key default gen_random_uuid(),
  mahasiswa_id uuid not null references public.profiles(id) on delete cascade,
  dosen_id uuid not null references public.profiles(id) on delete cascade,
  tanggal_perwalian date not null default CURRENT_DATE,
  semester text not null,
  keperluan text not null,
  catatan_hasil text,
  status text default 'selesai',
  created_at timestamptz default now()
);

-- Indexing perwalian
create index idx_perwalian_mahasiswa on public.perwalian(mahasiswa_id);
create index idx_perwalian_dosen on public.perwalian(dosen_id);
create index idx_perwalian_tanggal on public.perwalian(tanggal_perwalian);

-- Disable Row Level Security (RLS) for zero friction
alter table public.profiles disable row level security;
alter table public.dosen_wali disable row level security;
alter table public.perwalian disable row level security;

-- Grant permissions on tables to all roles
grant all on public.profiles to postgres, anon, authenticated, service_role;
grant all on public.dosen_wali to postgres, anon, authenticated, service_role;
grant all on public.perwalian to postgres, anon, authenticated, service_role;
