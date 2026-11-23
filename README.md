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
