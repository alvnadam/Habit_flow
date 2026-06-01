/* =========================================================
   HABITFLOW - PROFILE.JS
   Logika untuk halaman profile.html
========================================================= */

let isInitialized = false;

// Proteksi: Redirect jika belum login
document.addEventListener("DOMContentLoaded", async function () {
    const isLoggedIn = await redirectIfNotLoggedIn();
    if (!isLoggedIn) return;

    if (isInitialized) return;
    isInitialized = true;

    initProfilePage();
});

/* =========================
   INIT PROFILE PAGE
========================= */

function initProfilePage() {
    loadProfileData();

    const profileForm = document.getElementById("profileForm");
    if (profileForm) {
        profileForm.addEventListener("submit", function (e) {
            e.preventDefault();
            saveProfileData();
        });
    }

    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            if (confirm("Yakin ingin keluar?")) {
                logout();
            }
        });
    }

    const clearDataBtn = document.getElementById("clearDataBtn");
    if (clearDataBtn) {
        clearDataBtn.addEventListener("click", function () {
            if (confirm("Yakin ingin menghapus SEMUA data habit dan riwayat? Tindakan ini tidak bisa dibatalkan!")) {
                saveHabits([]);
                saveHistory([]);
                showToast("Semua data habit berhasil dihapus.");
                renderProfileStats();
            }
        });
    }

    renderProfileStats();
}

/* =========================
   LOAD PROFILE DATA
========================= */

function loadProfileData() {
    const user = getLoggedInUser() || { name: "Pengguna", email: "pengguna@habitflow.app" };

    const nameEl = document.getElementById("profileNameDisplay");
    const emailEl = document.getElementById("profileEmailDisplay");
    const nameInput = document.getElementById("profileNameInput");
    const emailInput = document.getElementById("profileEmailInput");

    if (nameEl) nameEl.textContent = user.name;
    if (emailEl) emailEl.textContent = user.email;
    if (nameInput) nameInput.value = user.name;
    if (emailInput) emailInput.value = user.email;
}

/* =========================
   SAVE PROFILE DATA
========================= */

function saveProfileData() {
    const nameInput = document.getElementById("profileNameInput");
    const emailInput = document.getElementById("profileEmailInput");

    if (!nameInput || !emailInput) return;

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();

    if (!name || !email) {
        showToast("Nama dan email wajib diisi.", "error");
        return;
    }

    const user = getLoggedInUser() || {};
    const updatedUser = { ...user, name, email };
    setLoggedInUser(updatedUser);

    const nameEl = document.getElementById("profileNameDisplay");
    const emailEl = document.getElementById("profileEmailDisplay");

    if (nameEl) nameEl.textContent = name;
    if (emailEl) emailEl.textContent = email;

    showToast("Profil berhasil diperbarui!");
}

/* =========================
   RENDER PROFILE STATS
========================= */

function renderProfileStats() {
    const habits = getHabits();
    const history = getHistory();

    const totalHabits = habits.length;
    const completedAll = history.filter(item => item.status === "Selesai").length;
    const streak = calculateStreak(history);

    const uniqueDays = new Set(
        history.filter(i => i.status === "Selesai").map(i => i.dateKey)
    ).size;

    const elHabits = document.getElementById("profileStatHabits");
    const elCompleted = document.getElementById("profileStatCompleted");
    const elStreak = document.getElementById("profileStatStreak");
    const elDays = document.getElementById("profileStatDays");

    if (elHabits) elHabits.textContent = totalHabits;
    if (elCompleted) elCompleted.textContent = completedAll;
    if (elStreak) elStreak.textContent = streak;
    if (elDays) elDays.textContent = uniqueDays;
}

/* =========================
   INIT
========================= */



