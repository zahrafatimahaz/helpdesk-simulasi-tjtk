<<<<<<< HEAD
# HelpDesk Pro — Versi 1.1 (Login, Registrasi, Bootstrap Admin)

**Belum production-ready.** MVP Supabase/React, belum semua fitur Master Prompt V2.0.

## Instalasi

1. Buat proyek Supabase. Di SQL Editor jalankan `supabase/migrations/001_init.sql` kemudian `002_admin_roles.sql` (jika migrasi 001 sudah pernah dijalankan, jalankan hanya 002).
2. `cp .env.example .env` lalu isi `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` dari Supabase. Jangan masukkan service-role key ke `.env` frontend.
3. `npm install && npm run dev`. Buka alamat yang ditampilkan Vite.
4. Pada halaman login, klik **Buat akun baru**. Akun publik selalu berstatus `CUSTOMER`; jika konfirmasi email diaktifkan di Supabase, verifikasi email dahulu.

## Buat akun SUPER_ADMIN pertama (aman, bukan hardcoded)

1. Salin `cp .env.admin.example .env.admin`. Isi `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, dan `ADMIN_EMAIL` dengan alamat email admin pilihan Anda. Key ini hanya di komputer admin, **jangan** upload ke GitHub atau Vercel.
2. Jalankan `npm run admin:create` pada terminal komputer tepercaya. Script membuat password acak kuat bila `ADMIN_PASSWORD` tidak diisi, dan menampilkannya sekali di terminal. Simpan di password manager.
3. Login dengan **email admin dan password yang dihasilkan**. Admin bisa mengubah role pengguna lain melalui menu **Pengguna**.
4. Jika email admin sudah terdaftar, script tidak menimpa akun tersebut. Gunakan email baru atau tetapkan role akun yang sudah diverifikasi melalui Supabase SQL Editor oleh operator tepercaya.
5. Aktifkan MFA untuk admin sebelum produksi dan batasi siapa yang memiliki akses service-role.

## Login dan pendaftaran

- Login memakai email + password (bukan username bebas).
- Pendaftaran mandiri customer melalui tombol **Buat akun baru** di login.
- Link **Lupa password** mengirim reset email; alur pemilihan password baru setelah membuka tautan belum dibuat dalam MVP ini.
- Pembuatan akun staf melalui pendaftaran customer kemudian promosi role oleh Super Admin. Ini tidak mengizinkan pendaftar memilih role admin.

## Deploy

Build: `npm run build`. Untuk Vercel set `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY`. Atur Supabase Auth URL Configuration untuk domain Vercel dan redirect URL yang diizinkan. Jangan upload `.env.admin`.

## Batasan

Belum ada Express API, worker SLA, lampiran, penilaian TJKT, MFA enforcement, audit role-change, dan tes integrasi. Uji RLS dan proses login sebelum penggunaan nyata.
=======
# HelpDesk Pro — Tahap 1 (MVP)

Aplikasi React + Vite + TypeScript dengan Supabase Auth, PostgreSQL, RLS dan RPC terkontrol. **Ini belum sistem produksi lengkap**. Tidak mencakup backend Express, worker SLA, lampiran, modul pembelajaran, laporan atau semua SOP dari Master Prompt V2.0.

## Instalasi Ubuntu/Linux

1. Instal Node.js LTS (disarankan versi 22 atau lebih baru) dan npm.
2. Buat proyek Supabase, buka SQL Editor, jalankan `supabase/migrations/001_init.sql`.
3. Di Supabase Authentication → Users, buat akun pengguna dengan email dan password. Profil otomatis dibuat dengan role `CUSTOMER`.
4. Untuk menetapkan administrator pertama, gunakan SQL Editor tepercaya (ganti UUID):

```sql
update public.profiles set role='SUPER_ADMIN' where id='UUID_ADMIN_DARI_AUTH_USERS';
```

5. Untuk teknisi, ubah role melalui SQL Editor ke `TECHNICIAN` atau `NOC_ENGINEER`. Jangan mengizinkan pengguna mengubah role sendiri.
6. Salin `.env.example` menjadi `.env`, isi URL dan **anon/publishable key** Supabase (jangan pernah service_role key).
7. Jalankan:

```bash
npm install
npm run dev
```

8. Buka URL lokal yang dicetak Vite. Untuk build: `npm run build`.

## Deployment Vercel

Push ke GitHub tanpa `.env`, import repo di Vercel (framework Vite), tambahkan `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` melalui Environment Variables, deploy. Atur Supabase Auth Site URL untuk domain deployment bila diperlukan.

## Alur yang tersedia

- Login dan logout menggunakan Supabase Auth
- Dashboard ringkas, daftar tiket dan filter sisi klien (maksimal 200 tiket)
- Pelanggan membuat tiket; nomor unik dihasilkan sequence PostgreSQL
- Help Desk/Supervisor/Admin membuka tiket, menugaskan teknisi, menutup tiket resolved
- Teknisi menerima tugas dengan status IN_PROGRESS, pending, eskalasi, resolve
- Customer dapat reopen tiket resolved
- Semua transisi tercatat di ticket_activities
- RLS membatasi SELECT; mutasi tiket via RPC dengan pemeriksaan role

## Keterbatasan yang wajib diperbaiki sebelum produksi

- MVP ini belum mengimplementasikan seluruh tabel, fitur, dan keamanan Master Prompt V2.0.
- Tidak ada backend Express, MFA enforcement, rate limiting, audit eksternal, file upload, SLA worker, notifikasi, atau penilaian TJKT.
- Proses resolve baru memerlukan catatan 10 karakter; belum ada validasi bukti troubleshooting lengkap.
- Belum ada pengujian otomatis terhadap RLS dan race condition; wajib diuji sebelum digunakan dengan data asli.
- Halaman list mengambil maksimal 200 tiket dan perlu pagination server-side.
- Akun staf harus disiapkan melalui SQL Editor/admin terotorisasi.
- Belum ada multi-workspace; gunakan hanya data simulasi dan jangan masukkan data pelanggan nyata.
# helpdesk-simulasi-tjtk
# helpdesk-simulasi-tjtk
# helpdesk-simulasi-tjtk
>>>>>>> origin/main
