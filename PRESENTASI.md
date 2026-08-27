# 🎤 Naskah Transkrip Presentasi
## Sistem Pencatatan Perwalian Mahasiswa STMIK Bandung

Naskah ini dirancang khusus agar **mudah dipahami dan dihafal di luar kepala** untuk persiapan presentasi tugas/sidang proyek akhir Anda.

---

## 📌 RINGKASAN CEPAT (Hafalan 3 Poin Utama)
> 1. **APA INI?** Aplikasi web full-stack untuk digitalisasi pencatatan bimbingan perwalian akademik di STMIK Bandung.
> 2. **SIAPA GUNA KAN?** **Admin** (Kelola data & rekap), **Mahasiswa** (Catat perwalian), **Dosen** (Lihat riwayat anak wali).
> 3. **TEKNOLOGI?** Next.js 14 (App Router) + Tailwind CSS + Supabase (Postgres Database, Auth, RLS) + Hosting Vercel.

---

## 🏛️ STRUKTUR NASKAH PRESENTASI (Langkah demi Langkah)

### BAGIAN 1: PEMBUKAAN & LATAR BELAKANG (1 Menit)

**Teks Presentasi:**
> *"Selamat pagi/siang Bapak/Ibu dan rekan-rekan sekalian.*
> 
> *Pada kesempatan kali ini, saya akan mempresentasikan aplikasi **Sistem Pencatatan Perwalian Mahasiswa STMIK Bandung**.*
> 
> *Latar belakang dibentuknya sistem ini adalah untuk mengubah proses perwalian yang dulunya berbasis kertas/manual menjadi digital secara real-time. Dengan sistem ini, seluruh sesi bimbingan antara mahasiswa dan dosen wali tercatat rapi, terpusat, dan dapat dipantau langsung oleh pihak kampus."*

---

### BAGIAN 2: TECH STACK / TEKNOLOGI (45 Detik)

**Teks Presentasi:**
> *"Untuk membangun aplikasi full-stack yang modern, cepat, dan handal, saya menggunakan teknologi berikut:*
> 
> 1. **Frontend**: **Next.js 14** dengan App Router dan TypeScript, dipadukan dengan **Tailwind CSS** untuk desain antarmuka bernuansa biru akademik STMIK Bandung.
> 2. **Backend & Database**: Menggunakan **Supabase** (PostgreSQL) untuk penyimpanan data, **Supabase Auth** untuk autentikasi keamanan pengguna, serta **Row Level Security (RLS)** untuk hak akses data.
> 3. **Deployment**: Frontend di-hosting di **Vercel** dan database berjalan di **Supabase Cloud free-tier**."*

---

### BAGIAN 3: ALUR SISTEM & 3 ROLE AKTOR (2 Menit)

**Teks Presentasi:**
> *"Sistem ini memiliki 3 aktor dengan hak akses spesifik (Role-Based Access Control):*
> 
> 1. **Role Admin**:
>    - Mengisi & mengelola penugasan Dosen Wali ke Mahasiswa per Tahun Akademik.
>    - Mengimpor data massal Mahasiswa & Dosen via file CSV.
>    - Melihat rekapitulasi seluruh perwalian dan mengekspornya ke format Excel (`.xlsx`).
> 
> 2. **Role Mahasiswa**:
>    - Login dan otomatis melihat nama Dosen Wali yang di-assign oleh Admin (Read-only, mahasiswa tidak pilih sendiri).
>    - Mengisi form pencatatan perwalian (Tanggal, Semester, Keperluan/Topik Bimbingan, dan Catatan Hasil).
>    - Melihat riwayat perwalian miliknya sendiri dari yang terbaru.
> 
> 3. **Role Dosen Wali**:
>    - Login dan melihat daftar mahasiswa bimbingan (anak wali) yang diampunya.
>    - Meninjau histori catatan perwalian masing-masing mahasiswa secara *read-only*."*

---

### BAGIAN 4: DEMO SKENARIO PRESENTASI (3 Menit)

Saat demo aplikasi live di depan penguji/dosen:

#### Skenario A: Tampilan Admin
> *"Pertama, saya login sebagai **Admin** (`admin@stmikbandung.ac.id` / `admin123`).*
> *Di dashboard admin, kita bisa melihat statistik total mahasiswa, perwalian, dan dosen wali aktif.*
> *Admin dapat memetakan mahasiswa ke dosen wali di menu **Data Dosen Wali**, serta mengunduh rekap perwalian ke Excel."*

#### Skenario B: Tampilan Mahasiswa
> *"Kedua, saya login sebagai **Mahasiswa** (`10123001@stmikbandung.ac.id` / `mhs123`).*
> *Di dashboard mahasiswa, nama Dosen Wali otomatis muncul. Mahasiswa mengklik **Catat Perwalian Baru**, mengisi topik bimbingan misal 'Pengambilan SKS Semester 5', lalu simpan. Data tersebut langsung masuk ke halaman **Riwayat Perwalian**."*

#### Skenario C: Tampilan Dosen Wali
> *"Ketiga, saya login sebagai **Dosen Wali** (`ahmad.fauzi@stmikbandung.ac.id` / `dosen123`).*
> *Dosen dapat melihat kartu mahasiswa bimbingannya (Budi Santoso, Siti Aminah, dll) dan mengklik **Lihat Histori Perwalian** untuk membaca catatan bimbingan yang telah dimasukkan oleh mahasiswa tersebut."*

---

### BAGIAN 5: KEAMANAN & SKEMA DATABASE (45 Detik)

**Teks Presentasi:**
> *"Keamanan data dijaga menggunakan **Row Level Security (RLS)** pada PostgreSQL Supabase:*
> - Mahasiswa **hanya** bisa melihat & menginput log perwalian milik dirinya sendiri.
> - Dosen **hanya** bisa melihat data mahasiswa yang menjadi anak walinya.
> - Admin memiliki akses penuh untuk rekapitulasi data seluruh kampus."*

---

### BAGIAN 6: PENUTUP (30 Detik)

**Teks Presentasi:**
> *"Kesimpulannya, aplikasi Sistem Pencatatan Perwalian STMIK Bandung ini mempermudah transparansi dan efisiensi akademik kampus secara efisien, aman, dan mudah digunakan.*
> 
> *Sekian presentasi dari saya, terima kasih atas perhatian Bapak/Ibu. Saya persilakan jika ada pertanyaan."*

---

## 💡 TIPS MENGHADAPI PERTANYAAN DOSEN/PENGUJI

1. **Pertanyaan: "Mengapa tidak pakai Express/NestJS backend?"**
   - **Jawaban:** *"Karena Next.js 14 App Router sudah memiliki integrasi Server Actions dan Route Handlers yang dikombinasikan dengan Supabase SDK, sehingga arsitektur aplikasi lebih ringkas, aman, ramah biaya (gratis di free-tier), dan efisien tanpa perlu me-maintain server terpisah."*

2. **Pertanyaan: "Bagaimana jika 1 mahasiswa punya dosen wali beda tiap semester?"**
   - **Jawaban:** *"Di tabel `dosen_wali`, ada constraint `UNIQUE(mahasiswa_id, tahun_akademik)`. Jadi 1 mahasiswa hanya bisa memiliki 1 Dosen Wali aktif di tahun akademik tertentu, namun bisa diperbarui jika ada pergantian di tahun akademik berikutnya."*

3. **Pertanyaan: "Bagaimana cara memastikan data tidak tertukar?"**
   - **Jawaban:** *"Dengan mekanisme Supabase Row Level Security (RLS) berbasis `auth.uid()`, query database diverifikasi langsung di tingkat database Postgres, sehingga pengguna tidak bisa membaca data milik pengguna lain walaupun mencoba mengubah URL."*
