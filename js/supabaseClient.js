/* =========================================================
   HABITFLOW - SUPABASECLIENT.JS
   Inisialisasi Supabase client
   
   Setup: Lihat SETUP_SUPABASE.md untuk instruksi lengkap
========================================================= */

// Import Supabase dari CDN
const SUPABASE_SCRIPT = document.createElement('script');
SUPABASE_SCRIPT.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.3/+esm';
SUPABASE_SCRIPT.type = 'module';
SUPABASE_SCRIPT.textContent = `
    import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.3/+esm';
    window.supabase = { createClient };
`;
document.head.appendChild(SUPABASE_SCRIPT);

// Tunggu Supabase library siap, kemudian inisialisasi
function initSupabaseClient() {
    if (typeof window.supabase === 'undefined' || CONFIG.SUPABASE_URL === "https://YOUR_PROJECT_ID.supabase.co") {
        console.warn("⚠️ Supabase belum dikonfigurasi. Setup: buka SETUP_SUPABASE.md");
        return null;
    }

    try {
        const { createClient } = window.supabase;
        const client = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);
        console.log("✅ Supabase berhasil terhubung");
        return client;
    } catch (error) {
        console.error("❌ Error inisialisasi Supabase:", error.message);
        return null;
    }
}

// Inisialisasi dengan delay untuk tunggu library siap
let supabaseClient = null;
setTimeout(() => {
    supabaseClient = initSupabaseClient();
}, 1000);

/* =========================
   HELPER: CEK KONEKSI SUPABASE
========================= */

function isSupabaseReady() {
    return supabaseClient !== null && CONFIG.SUPABASE_URL !== "https://YOUR_PROJECT_ID.supabase.co";
}

/* =========================
   HELPER: VALIDASI EMAIL
========================= */

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/* =========================
   HELPER: GENERATE ID
========================= */

function generateId() {
    return 'id_' + Math.random().toString(36).substr(2, 9);
}

