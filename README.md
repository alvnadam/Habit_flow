# HabitFlow 🌿

> Aplikasi pelacak kebiasaan harian yang modern, ringan, dan berfokus pada produktivitas mahasiswa.

---

## 📁 Struktur Proyek

```
habitflow/
│
├── index.html          ← Dashboard utama
├── habit.html          ← Manajemen habit
├── riwayat.html        ← Riwayat aktivitas
├── statistik.html      ← Statistik & analisis
├── profile.html        ← Profil pengguna
├── login.html          ← Halaman login
├── register.html       ← Halaman registrasi
│
├── css/
│   ├── style.css       ← Style utama semua halaman
│   ├── auth.css        ← Style khusus login & register
│   └── responsive.css  ← Responsive overrides halaman tambahan
│
├── js/
│   ├── config.js       ← Konfigurasi global (URL, keys, konstanta)
│   ├── supabaseClient.js ← Inisialisasi Supabase (opsional)
│   ├── auth.js         ← Login, register, logout
│   ├── dashboard.js    ← Logika halaman dashboard
│   ├── habit.js        ← Logika halaman habit manager
│   ├── riwayat.js      ← Logika halaman riwayat
│   ├── statistik.js    ← Logika halaman statistik
│   ├── profile.js      ← Logika halaman profil
│   └── helpers.js      ← Fungsi utilitas bersama
│
├── sql/
│   ├── 01_create_tables.sql ← Buat tabel Supabase
│   ├── 02_enable_rls.sql    ← Aktifkan Row Level Security
│   └── 03_policies.sql      ← Kebijakan akses data
│
├── assets/
│   ├── images/
│   │   ├── habit-hero.png   ← Gambar hero halaman habit
│   │   └── empty-state.png  ← Gambar state kosong
│   └── icons/
│       └── logo.png         ← Logo aplikasi
│
└── README.md
```

---

## 🚀 Cara Menjalankan

### Tanpa Backend (LocalStorage)
Cukup buka `index.html` di browser. Semua data tersimpan di `localStorage`.

### Dengan Supabase (Opsional)
1. Buat project baru di [supabase.com](https://supabase.com)
2. Jalankan file SQL secara berurutan:
   - `sql/01_create_tables.sql`
   - `sql/02_enable_rls.sql`
   - `sql/03_policies.sql`
3. Salin **Project URL** dan **Anon Key** dari Settings → API
4. Isi nilai tersebut di `js/config.js`:
   ```js
   SUPABASE_URL: "https://YOUR_PROJECT_ID.supabase.co",
   SUPABASE_ANON_KEY: "YOUR_ANON_KEY_HERE",
   ```
5. Uncomment baris inisialisasi di `js/supabaseClient.js`

---

## ✨ Fitur

- ✅ **Dashboard** – Ringkasan habit hari ini, streak, dan progres
- ✅ **Habit Manager** – Tambah, edit, hapus habit dengan prioritas & kategori
- ✅ **Riwayat** – Rekam jejak aktivitas dengan filter dan pencarian
- ✅ **Statistik** – Grafik 7 hari, breakdown kategori, progress circle
- ✅ **Profil** – Edit profil, lihat statistik akun, logout
- ✅ **Auth** – Login & registrasi (LocalStorage / Supabase)
- ✅ **Responsive** – Tampilan optimal di desktop, tablet, dan mobile
- ✅ **Dark Mode** – UI gelap premium dengan aksen hijau

---

## 🎨 Teknologi

| Layer | Tech |
|-------|------|
| HTML | HTML5 Semantic |
| CSS | Vanilla CSS (Dark Mode, Glassmorphism) |
| JavaScript | Vanilla JS (ES6+) |
| Font | Inter + Manrope (Google Fonts) |
| Icons | Material Symbols Outlined |
| Backend (opsional) | Supabase |

---

## 📝 Catatan

- Data disimpan di `localStorage` secara default
- Untuk produksi, gunakan Supabase dan hash password dengan `bcrypt`
- File `sql/` hanya dibutuhkan jika menggunakan Supabase

---

**© 2026 HabitFlow — Student-focused productivity.**
