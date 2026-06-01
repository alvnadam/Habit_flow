/* =========================================================
   HABITFLOW - HELPERS.JS
   Fungsi-fungsi utilitas yang dipakai di seluruh halaman
========================================================= */

/* =========================
   DATE HELPERS
========================= */

function getLocalDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function getFormattedDate(date) {
    return date.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}

function getShortDate(date) {
    return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });
}

/* =========================
   ID GENERATOR
========================= */

function generateId() {
    return `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

/* =========================
   STORAGE HELPERS
========================= */

function getHabits() {
    return JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.HABITS)) || [];
}

function getHistory() {
    return JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.HISTORY)) || [];
}

function saveHabits(habits) {
    localStorage.setItem(CONFIG.STORAGE_KEYS.HABITS, JSON.stringify(habits));
}

function saveHistory(history) {
    localStorage.setItem(CONFIG.STORAGE_KEYS.HISTORY, JSON.stringify(history));
}

function saveData(habits, history) {
    saveHabits(habits);
    saveHistory(history);
}

/* =========================
   HABIT HELPERS
========================= */

function isHabitDoneToday(habit) {
    const todayKey = getLocalDateKey(new Date());
    return Array.isArray(habit.completedDates) && habit.completedDates.includes(todayKey);
}

function getCategoryClass(category) {
    return CONFIG.CATEGORIES.includes(category) ? category : "Lainnya";
}

function getPriorityClass(priority) {
    if (priority === "Penting") return "priority-penting";
    if (priority === "Santai") return "priority-santai";
    return "priority-normal";
}

/* =========================
   STREAK CALCULATOR
========================= */

function calculateStreak(history) {
    if (history.length === 0) return 0;

    const completedDates = history
        .filter(item => item.status === "Selesai")
        .map(item => item.dateKey);

    const uniqueDates = [...new Set(completedDates)].sort().reverse();

    let streak = 0;
    const currentDate = new Date();

    for (let i = 0; i < uniqueDates.length; i++) {
        const dateKey = getLocalDateKey(currentDate);
        if (uniqueDates.includes(dateKey)) {
            streak++;
            currentDate.setDate(currentDate.getDate() - 1);
        } else {
            break;
        }
    }

    return streak;
}

/* =========================
   HISTORY HELPERS
========================= */

function addOrUpdateHistory(history, habit, status) {
    const todayKey = getLocalDateKey(new Date());
    const formattedToday = getFormattedDate(new Date());

    const existingIndex = history.findIndex(item => {
        return item.habitId === habit.id && item.dateKey === todayKey;
    });

    if (existingIndex !== -1) {
        history[existingIndex] = {
            ...history[existingIndex],
            name: habit.name,
            category: habit.category,
            target: habit.target,
            status: status,
            date: formattedToday
        };
    } else {
        history.unshift({
            id: generateId(),
            habitId: habit.id,
            name: habit.name,
            category: habit.category,
            target: habit.target,
            status: status,
            date: formattedToday,
            dateKey: todayKey
        });
    }

    return history;
}

function removeTodayHistory(history, habitId) {
    const todayKey = getLocalDateKey(new Date());
    return history.filter(item => !(item.habitId === habitId && item.dateKey === todayKey));
}

function syncHistoryAfterEdit(history, habit) {
    return history.map(item => {
        if (item.habitId === habit.id) {
            return { ...item, name: habit.name, category: habit.category, target: habit.target };
        }
        return item;
    });
}

/* =========================
   TOAST NOTIFICATION
========================= */

function showToast(message, type = "success") {
    const existing = document.getElementById("hf-toast");
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.id = "hf-toast";
    toast.style.cssText = `
        position: fixed;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%) translateY(20px);
        padding: 12px 22px;
        border-radius: 999px;
        background: ${type === "success" ? "var(--primary)" : "var(--danger)"};
        color: ${type === "success" ? "#003824" : "#fff"};
        font-size: 14px;
        font-weight: 700;
        z-index: 9999;
        opacity: 0;
        transition: all 0.3s ease;
        white-space: nowrap;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
        toast.style.opacity = "1";
        toast.style.transform = "translateX(-50%) translateY(0)";
    });

    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateX(-50%) translateY(20px)";
        setTimeout(() => toast.remove(), 300);
    }, 2800);
}

/* =========================
   NAVIGATION ACTIVE STATE
========================= */

function setActiveNav() {
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    const allLinks = document.querySelectorAll(".desktop-menu a, .mobile-menu a");

    allLinks.forEach(link => {
        const href = link.getAttribute("href");
        if (href === currentPage || (currentPage === "" && href === "index.html")) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });
}

document.addEventListener("DOMContentLoaded", setActiveNav);
