/* =========================================================
   HABITFLOW - CONFIG.JS
   Konfigurasi global aplikasi
========================================================= */

const CONFIG = {
    // Supabase credentials (isi sesuai project kamu)
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
