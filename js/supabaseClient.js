/* =========================================================
   HABITFLOW - SUPABASECLIENT.JS
   Inisialisasi Supabase client
   
   Cara pakai:
   1. Buka https://supabase.com dan buat project baru
   2. Salin URL dan Anon Key ke config.js
   3. Uncomment bagian import di bawah
========================================================= */

// Import Supabase dari CDN (uncomment jika menggunakan Supabase)
// const { createClient } = supabase;

// Inisialisasi client
// const supabaseClient = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);

// Untuk saat ini, aplikasi menggunakan localStorage
// Uncomment baris di atas dan hapus localStorage jika sudah integrasi Supabase

const supabaseClient = null; // Placeholder

/* =========================
   HELPER: CEK KONEKSI SUPABASE
========================= */

function isSupabaseReady() {
    return supabaseClient !== null;
}
