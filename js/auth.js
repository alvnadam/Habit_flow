/* =========================================================
   HABITFLOW - AUTH.JS
   Logika autentikasi: login, register, logout
   Support: Supabase + LocalStorage fallback
========================================================= */

/* =========================
   CEK STATUS LOGIN
========================= */

async function getLoggedInUser() {
    // Cek Supabase dulu
    if (isSupabaseReady() && supabaseClient) {
        try {
            const { data: { user } } = await supabaseClient.auth.getUser();
            if (user) {
                return {
                    id: user.id,
                    email: user.email,
                    name: user.user_metadata?.name || user.email.split('@')[0]
                };
            }
        } catch (error) {
            console.warn("Supabase check failed:", error.message);
        }
    }
    
    // Fallback: localStorage
    return JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.USER)) || null;
}

function setLoggedInUser(user) {
    localStorage.setItem(CONFIG.STORAGE_KEYS.USER, JSON.stringify(user));
}

function clearLoggedInUser() {
    localStorage.removeItem(CONFIG.STORAGE_KEYS.USER);
    
    // Logout dari Supabase juga
    if (isSupabaseReady() && supabaseClient) {
        supabaseClient.auth.signOut().catch(() => {});
    }
}

async function redirectIfNotLoggedIn() {
    const user = await getLoggedInUser();
    if (!user) {
        window.location.href = CONFIG.PAGES.LOGIN;
        return false;
    }
    return true;
}

async function redirectIfLoggedIn() {
    const user = await getLoggedInUser();
    if (user) {
        window.location.href = CONFIG.PAGES.DASHBOARD;
        return false;
    }
    return true;
}

/* =========================
   REGISTER
========================= */

function initRegisterPage() {
    const form = document.getElementById("registerForm");
    if (!form) return;

    redirectIfLoggedIn();

    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const name = document.getElementById("regName").value.trim();
        const email = document.getElementById("regEmail").value.trim();
        const password = document.getElementById("regPassword").value;
        const confirmPassword = document.getElementById("regConfirmPassword").value;

        const errorEl = document.getElementById("registerError");
        const successEl = document.getElementById("registerSuccess");
        const submitBtn = document.getElementById("registerSubmitBtn");

        if (errorEl) errorEl.classList.remove("show");
        if (successEl) successEl.classList.remove("show");

        // Validasi
        if (!name || !email || !password || !confirmPassword) {
            showAuthError(errorEl, "Semua field wajib diisi.");
            return;
        }

        if (!isValidEmail(email)) {
            showAuthError(errorEl, "Format email tidak valid.");
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

        submitBtn.disabled = true;
        submitBtn.textContent = "Membuat akun...";

        try {
            // Register via Supabase
            if (isSupabaseReady() && supabaseClient) {
                const { data, error } = await supabaseClient.auth.signUp({
                    email: email,
                    password: password,
                    options: {
                        data: {
                            name: name
                        }
                    }
                });

                if (error) {
                    showAuthError(errorEl, error.message || "Gagal membuat akun.");
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<span class="material-symbols-outlined">person_add</span> Buat Akun';
                    return;
                }

                if (successEl) {
                    successEl.innerHTML = "✅ Akun berhasil dibuat! Silakan cek email untuk verifikasi.";
                    successEl.classList.add("show");
                }

                setTimeout(() => {
                    window.location.href = CONFIG.PAGES.LOGIN;
                }, 2000);
            } else {
                // Fallback: localStorage
                const users = JSON.parse(localStorage.getItem("habitflow_users")) || [];
                const existingUser = users.find(u => u.email === email);

                if (existingUser) {
                    showAuthError(errorEl, "Email sudah terdaftar. Silakan login.");
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<span class="material-symbols-outlined">person_add</span> Buat Akun';
                    return;
                }

                const newUser = {
                    id: generateId(),
                    name: name,
                    email: email,
                    password: btoa(password),
                    createdAt: new Date().toISOString()
                };

                users.push(newUser);
                localStorage.setItem("habitflow_users", JSON.stringify(users));

                if (successEl) {
                    successEl.innerHTML = "✅ Akun berhasil dibuat! Mengarahkan ke login...";
                    successEl.classList.add("show");
                }

                setTimeout(() => {
                    window.location.href = CONFIG.PAGES.LOGIN;
                }, 1800);
            }
        } catch (error) {
            showAuthError(errorEl, "Terjadi kesalahan: " + error.message);
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span class="material-symbols-outlined">person_add</span> Buat Akun';
        }
    });
}

/* =========================
   LOGIN
========================= */

function initLoginPage() {
    const form = document.getElementById("loginForm");
    if (!form) return;

    redirectIfLoggedIn();

    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value;

        const errorEl = document.getElementById("loginError");
        const submitBtn = document.getElementById("loginSubmitBtn");

        if (errorEl) errorEl.classList.remove("show");

        if (!email || !password) {
            showAuthError(errorEl, "Email dan password wajib diisi.");
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = "Memproses...";

        try {
            // Login via Supabase
            if (isSupabaseReady() && supabaseClient) {
                const { data, error } = await supabaseClient.auth.signInWithPassword({
                    email: email,
                    password: password
                });

                if (error) {
                    showAuthError(errorEl, error.message || "Email atau password salah.");
                    submitBtn.disabled = false;
                    submitBtn.textContent = "Masuk";
                    return;
                }

                if (data.user) {
                    setLoggedInUser({
                        id: data.user.id,
                        email: data.user.email,
                        name: data.user.user_metadata?.name || email.split('@')[0]
                    });
                    window.location.href = CONFIG.PAGES.DASHBOARD;
                }
            } else {
                // Fallback: localStorage - Allow login dengan any email/password untuk testing
                // Dalam production, harus registrasi dulu
                if (!email || !password) {
                    showAuthError(errorEl, "Email dan password wajib diisi.");
                    submitBtn.disabled = false;
                    submitBtn.textContent = "Masuk";
                    return;
                }

                // Cek apakah user sudah terdaftar
                const users = JSON.parse(localStorage.getItem("habitflow_users")) || [];
                let user = users.find(u => u.email === email && u.password === btoa(password));

                // Jika tidak terdaftar, create user baru untuk fallback (development mode)
                if (!user) {
                    user = {
                        id: generateId(),
                        name: email.split('@')[0],
                        email: email,
                        password: btoa(password)
                    };
                    users.push(user);
                    localStorage.setItem("habitflow_users", JSON.stringify(users));
                }

                setLoggedInUser({
                    id: user.id,
                    name: user.name,
                    email: user.email
                });
                window.location.href = CONFIG.PAGES.DASHBOARD;
            }
        } catch (error) {
            showAuthError(errorEl, "Terjadi kesalahan: " + error.message);
            submitBtn.disabled = false;
            submitBtn.textContent = "Masuk";
        }
    });
}

/* =========================
   LOGOUT
========================= */

async function logout() {
    if (isSupabaseReady() && supabaseClient) {
        await supabaseClient.auth.signOut();
    }
    
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
        btnEl.innerHTML = '<span class="material-symbols-outlined">visibility_off</span>';
    } else {
        input.type = "password";
        btnEl.innerHTML = '<span class="material-symbols-outlined">visibility</span>';
    }
}

/* =========================
   INIT
========================= */

document.addEventListener("DOMContentLoaded", function () {
    initLoginPage();
    initRegisterPage();
});
