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
