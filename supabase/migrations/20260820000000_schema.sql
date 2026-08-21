-- Migration file for STMIK Bandung Advisory System (Sistem Perwalian Mahasiswa)

-- Create extension if not exists
create extension if not exists "uuid-ossp";

-- 1. PROFILES TABLE (Extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role text not null check (role in ('admin', 'mahasiswa', 'dosen')),
  nim text unique,          -- Only for role = 'mahasiswa'
  nidn text unique,         -- Only for role = 'dosen'
  email text,
  created_at timestamptz default now()
);

-- Indexing profiles
create index if not exists idx_profiles_role on public.profiles(role);
create index if not exists idx_profiles_nim on public.profiles(nim);
create index if not exists idx_profiles_nidn on public.profiles(nidn);

-- 2. DOSEN_WALI TABLE (Relasi Mahasiswa <-> Dosen)
create table if not exists public.dosen_wali (
  id uuid primary key default gen_random_uuid(),
  mahasiswa_id uuid not null references public.profiles(id) on delete cascade,
  dosen_id uuid not null references public.profiles(id) on delete cascade,
  tahun_akademik text not null, -- e.g. '2025/2026 Ganjil'
  created_at timestamptz default now(),
  constraint unique_mahasiswa_tahun_akademik unique(mahasiswa_id, tahun_akademik)
);

-- Indexing dosen_wali
create index if not exists idx_dosen_wali_mahasiswa on public.dosen_wali(mahasiswa_id);
create index if not exists idx_dosen_wali_dosen on public.dosen_wali(dosen_id);
create index if not exists idx_dosen_wali_tahun on public.dosen_wali(tahun_akademik);

-- 3. PERWALIAN TABLE (Log Perwalian)
create table if not exists public.perwalian (
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
create index if not exists idx_perwalian_mahasiswa on public.perwalian(mahasiswa_id);
create index if not exists idx_perwalian_dosen on public.perwalian(dosen_id);
create index if not exists idx_perwalian_tanggal on public.perwalian(tanggal_perwalian);

-- Enable Row Level Security (RLS) on all tables
alter table public.profiles enable row level security;
alter table public.dosen_wali enable row level security;
alter table public.perwalian enable row level security;

-- Helper function to check if current user is Admin
create or replace function public.is_admin()
returns boolean language sql security definer as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- RLS POLICIES: PROFILES
-- Admin: Full Access
create policy "Admin full access to profiles"
  on public.profiles for all
  using (public.is_admin());

-- Authenticated Users: Read profiles (to display advisor/advisee details)
create policy "Authenticated users can select profiles"
  on public.profiles for select
  to authenticated
  using (true);

-- User can update their own profile
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- RLS POLICIES: DOSEN_WALI
-- Admin: Full access
create policy "Admin full access to dosen_wali"
  on public.dosen_wali for all
  using (public.is_admin());

-- Mahasiswa: Select where mahasiswa_id = auth.uid()
create policy "Mahasiswa select own dosen_wali"
  on public.dosen_wali for select
  to authenticated
  using (mahasiswa_id = auth.uid());

-- Dosen: Select where dosen_id = auth.uid()
create policy "Dosen select own advisees"
  on public.dosen_wali for select
  to authenticated
  using (dosen_id = auth.uid());

-- RLS POLICIES: PERWALIAN
-- Admin: Full access
create policy "Admin full access to perwalian"
  on public.perwalian for all
  using (public.is_admin());

-- Mahasiswa: Select & Insert own perwalian
create policy "Mahasiswa select own perwalian"
  on public.perwalian for select
  to authenticated
  using (mahasiswa_id = auth.uid());

create policy "Mahasiswa insert own perwalian"
  on public.perwalian for insert
  to authenticated
  with check (mahasiswa_id = auth.uid());

-- Dosen: Select perwalian of their assigned students
create policy "Dosen select assigned perwalian"
  on public.perwalian for select
  to authenticated
  using (dosen_id = auth.uid());

-- TRIGGER FOR SYNCING NEW USERS TO PROFILES
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, full_name, role, nim, nidn, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', 'Pengguna Baru'),
    coalesce(new.raw_user_meta_data->>'role', 'mahasiswa'),
    new.raw_user_meta_data->>'nim',
    new.raw_user_meta_data->>'nidn',
    new.email
  )
  on conflict (id) do update set
    full_name = excluded.full_name,
    role = excluded.role,
    nim = excluded.nim,
    nidn = excluded.nidn,
    email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
