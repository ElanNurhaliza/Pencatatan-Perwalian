# Sistem Pencatatan Perwalian Mahasiswa STMIK Bandung

Aplikasi web full-stack untuk mengelola dan mencatat aktivitas **perwalian akademik** antara mahasiswa dan dosen wali di **STMIK Bandung**.

Sistem ini mendukung 3 hak akses utama (Role-Based Access Control):
- **Admin**: Mengelola assignment Dosen Wali ke Mahasiswa, mengimpor data massal Mahasiswa & Dosen via CSV, serta melihat & mengekspor rekapitulasi data perwalian ke Excel/CSV.
- **Mahasiswa**: Melihat Dosen Wali yang otomatis ter-assign, mencatat sesi perwalian (tanggal, semester, keperluan, catatan hasil bimbingan), dan melihat histori perwalian pribadi.
- **Dosen Wali**: Melihat daftar mahasiswa bimbingan (anak wali) dan meninjau histori perwalian kronologis masing-masing mahasiswa secara read-only.

---

## 🛠️ Tech Stack

| Layer | Teknologi |
|---|---|
| **Frontend Framework** | **Next.js 14** (App Router) + TypeScript |
| **Styling** | **Tailwind CSS** (Warna Biru STMIK Bandung `#1D4ED8`) |
| **Icons & UI** | Lucide React + Modals & Custom Components |
| **Database & Auth** | **Supabase** (PostgreSQL + Supabase Auth + Row Level Security) |
| **ORM / Client** | `@supabase/supabase-js` + `@supabase/ssr` |
| **Data Parsing & Export** | `PapaParse` (CSV Import) + `xlsx` (Excel Export) |

---

## 📁 Struktur Direktori

```text
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   ├── dashboard/          # Rekapitulasi perwalian & export CSV/Excel
│   │   │   ├── dosen-wali/         # CRUD assignment Dosen Wali - Mahasiswa
│   │   │   └── import/             # Import data massal Mahasiswa & Dosen via CSV
│   │   ├── mahasiswa/
│   │   │   ├── dashboard/          # Info Dosen Wali ter-assign & tombol catat
│   │   │   ├── catat-perwalian/    # Form pencatatan bimbingan perwalian
│   │   │   └── histori/            # Riwayat perwalian milik sendiri
│   │   ├── dosen/
│   │   │   ├── dashboard/          # Daftar mahasiswa wali (anak bimbingan)
│   │   │   └── histori/[mahasiswaId]/ # Histori perwalian per mahasiswa
│   │   ├── login/                  # Halaman Login (Supabase Auth / Demo Mode)
│   │   ├── layout.tsx              # Root Layout & Font Inter
│   │   └── page.tsx                # Auto-redirect berdasarkan role
│   ├── components/                 # Sidebar, Header, StatCard, Badge, Modal
│   └── lib/
│       ├── supabase/               # Client, Server, & Middleware helpers
│       ├── dataService.ts          # Unified service layer (Supabase + Demo Fallback)
│       └── types.ts                # TypeScript interfaces
├── supabase/
│   ├── migrations/
│   │   └── 20260820000000_schema.sql # Skema Postgres + RLS Policies + Triggers
│   └── seed.sql                    # Data dummy (Admin, Dosen, Mahasiswa, Log)
├── README.md
└── package.json
```

---

## 🚀 Cara Setup & Menjalankan Aplikasi

### 1. Clone & Install Dependencies

```bash
# Clone repository ini (atau buka folder mp2)
cd mp2

# Install seluruh dependencies
npm install
```

---

### 2. Setup Supabase Project (Database & RLS)

1. Buat proyek baru di [Supabase Cloud](https://supabase.com/).
2. Buka menu **SQL Editor** di dashboard Supabase Anda.
3. Eksekusi script SQL yang berada pada file:
   - `supabase/migrations/20260820000000_schema.sql` (untuk membuat tabel `profiles`, `dosen_wali`, `perwalian`, dan kebijakan RLS).
   - `supabase/seed.sql` (opsional: untuk mengisikan data dummy sampel admin, dosen, mahasiswa, dan log perwalian).

---

### 3. Konfigurasi Environment Variables

Buat file `.env.local` di root proyek dan tambahkan kredensial Supabase Anda:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

*(Catatan: Jika `.env.local` dibiarkan default, aplikasi otomatis berjalan dalam **Mode Demo Interaktif** yang siap diuji secara instant).*

---

### 4. Jalankan Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) pada browser Anda.

---

## 🔑 Akun Demo Pengujian (Quick Login)

Pada halaman login (`/login`), Anda dapat langsung menggunakan tombol **Quick Login** atau memasukkan kredensial berikut:

| Role | Identitas / Email | Password | Hak Akses |
|---|---|---|---|
| **Admin** | `admin@stmikbandung.ac.id` (atau `admin`) | `admin123` | Rekapitulasi, CRUD Dosen Wali, CSV Import, Export Excel |
| **Dosen Wali** | `ahmad.fauzi@stmikbandung.ac.id` (NIDN: `0412038501`) | `dosen123` | Melihat anak wali & histori perwalian |
| **Mahasiswa** | `10123001@stmikbandung.ac.id` (NIM: `10123001`) | `mhs123` | Melihat Dosen Wali, Catat Perwalian, Histori |

---

## 🔒 Keamanan (Row Level Security)

Sistem menerapkan aturan **Row Level Security (RLS)** pada Supabase:
- `admin` -> Memiliki hak akses penuh (`ALL`) ke tabel `profiles`, `dosen_wali`, dan `perwalian`.
- `mahasiswa` -> Hanya dapat membaca (`SELECT`) data `dosen_wali` miliknya dan menambah/membaca (`SELECT`/`INSERT`) data `perwalian` miliknya (`mahasiswa_id = auth.uid()`).
- `dosen` -> Hanya dapat membaca (`SELECT`) data `dosen_wali` dan `perwalian` untuk mahasiswa bimbingannya (`dosen_id = auth.uid()`).
