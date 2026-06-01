/* =========================================================
   HABITFLOW - CONFIG.JS
   Konfigurasi global aplikasi
   
   ⚠️ SETUP SUPABASE:
   1. Baca file SETUP_SUPABASE.md untuk instruksi lengkap
   2. Buat project di https://supabase.com
   3. Isi SUPABASE_URL dan SUPABASE_ANON_KEY di bawah
   4. Jalankan SQL dari SETUP_SUPABASE.md di Supabase console
========================================================= */

const CONFIG = {
    // 🔑 SUPABASE CREDENTIALS - ISI DENGAN DATA PROJECT KAMU
    // Dapatkan dari: Supabase Console → Settings → API
    SUPABASE_URL: "https://YOUR_PROJECT_ID.supabase.co",
    SUPABASE_ANON_KEY: "YOUR_ANON_KEY_HERE",

    // App info
    APP_NAME: "HabitFlow",
    APP_VERSION: "1.0.0",

    // LocalStorage keys
    STORAGE_KEYS: {
        HABITS: "habitflow_habits",
        HISTORY: "habitflow_history",
        USER: "habitflow_user"
    },

    // Kategori habit
    CATEGORIES: ["Belajar", "Kesehatan", "Ibadah", "Produktivitas", "Lainnya"],

    // Prioritas habit
    PRIORITIES: ["Normal", "Penting", "Santai"],

    // Halaman aplikasi
    PAGES: {
        DASHBOARD: "index.html",
        HABIT: "habit.html",
        RIWAYAT: "riwayat.html",
        STATISTIK: "statistik.html",
        PROFILE: "profile.html",
        LOGIN: "login.html",
        REGISTER: "register.html"
    }
};
