/* =========================================================
   HABITFLOW - AUTH.JS
   Logika autentikasi: login, register, logout
========================================================= */

/* =========================
   CEK STATUS LOGIN
========================= */

function getLoggedInUser() {
    return JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.USER)) || null;
}

function setLoggedInUser(user) {
    localStorage.setItem(CONFIG.STORAGE_KEYS.USER, JSON.stringify(user));
}

function clearLoggedInUser() {
    localStorage.removeItem(CONFIG.STORAGE_KEYS.USER);
}

function redirectIfNotLoggedIn() {
    const user = getLoggedInUser();
    if (!user) {
        window.location.href = CONFIG.PAGES.LOGIN;
    }
}

function redirectIfLoggedIn() {
    const user = getLoggedInUser();
    if (user) {
        window.location.href = CONFIG.PAGES.DASHBOARD;
    }
}

/* =========================
   REGISTER
========================= */

function initRegisterPage() {
    const form = document.getElementById("registerForm");
    if (!form) return;

    redirectIfLoggedIn();

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const name = document.getElementById("regName").value.trim();
        const email = document.getElementById("regEmail").value.trim();
        const password = document.getElementById("regPassword").value;
        const confirmPassword = document.getElementById("regConfirmPassword").value;

        const errorEl = document.getElementById("registerError");
        const successEl = document.getElementById("registerSuccess");

        if (errorEl) errorEl.classList.remove("show");
        if (successEl) successEl.classList.remove("show");

        if (!name || !email || !password || !confirmPassword) {
            showAuthError(errorEl, "Semua field wajib diisi.");
            return;
        }

        if (password !== confirmPassword) {
            showAuthError(errorEl, "Password dan konfirmasi tidak cocok.");
            return;
        }

        if (password.length < 6) {
            showAuthError(errorEl, "Password minimal 6 karakter.");
            return;
        }

        // Simpan user ke localStorage (simulasi tanpa backend)
        const users = JSON.parse(localStorage.getItem("habitflow_users")) || [];
        const existingUser = users.find(u => u.email === email);

        if (existingUser) {
            showAuthError(errorEl, "Email sudah terdaftar. Silakan login.");
            return;
        }

        const newUser = {
            id: generateId(),
            name: name,
            email: email,
            password: password, // Catatan: di produksi, password harus di-hash
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        localStorage.setItem("habitflow_users", JSON.stringify(users));

        if (successEl) {
            successEl.textContent = "Akun berhasil dibuat! Mengarahkan ke halaman login...";
            successEl.classList.add("show");
        }

        setTimeout(() => {
            window.location.href = CONFIG.PAGES.LOGIN;
        }, 1800);
    });
}

/* =========================
   LOGIN
========================= */

function initLoginPage() {
    const form = document.getElementById("loginForm");
    if (!form) return;

    redirectIfLoggedIn();

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value;

        const errorEl = document.getElementById("loginError");
        if (errorEl) errorEl.classList.remove("show");

        if (!email || !password) {
            showAuthError(errorEl, "Email dan password wajib diisi.");
            return;
        }

        const users = JSON.parse(localStorage.getItem("habitflow_users")) || [];
        const user = users.find(u => u.email === email && u.password === password);

        if (!user) {
            showAuthError(errorEl, "Email atau password salah.");
            return;
        }

        setLoggedInUser({ id: user.id, name: user.name, email: user.email });
        window.location.href = CONFIG.PAGES.DASHBOARD;
    });
}

/* =========================
   LOGOUT
========================= */

function logout() {
    clearLoggedInUser();
    window.location.href = CONFIG.PAGES.LOGIN;
}

/* =========================
   HELPER AUTH
========================= */

function showAuthError(el, message) {
    if (!el) return;
    el.textContent = message;
    el.classList.add("show");
}

function togglePasswordVisibility(inputId, btnEl) {
    const input = document.getElementById(inputId);
    if (!input) return;

    if (input.type === "password") {
        input.type = "text";
        btnEl.textContent = "visibility_off";
    } else {
        input.type = "password";
        btnEl.textContent = "visibility";
    }
}

/* =========================
   INIT
========================= */

document.addEventListener("DOMContentLoaded", function () {
    initLoginPage();
    initRegisterPage();
});
