/* =========================================================
   HABITFLOW - STATISTIK.JS
   Logika untuk halaman statistik.html
========================================================= */

/* =========================
   INIT STATISTIK PAGE
========================= */

function initStatistikPage() {
    const statistikContainer = document.getElementById("statistikPage");
    if (!statistikContainer) return;

    renderStatistik();
}

/* =========================
   RENDER STATISTIK
========================= */

function renderStatistik() {
    const habits = getHabits();
    const history = getHistory();
    const today = new Date();
    const todayKey = getLocalDateKey(today);

    // Summary
    const total = habits.length;
    const completedToday = habits.filter(h => isHabitDoneToday(h)).length;
    const streak = calculateStreak(history);
    const completionRate = total === 0 ? 0 : Math.round((completedToday / total) * 100);

    const elTotal = document.getElementById("statTotal");
    const elCompleted = document.getElementById("statCompleted");
    const elStreak = document.getElementById("statStreak");
    const elRate = document.getElementById("statRate");

    if (elTotal) elTotal.textContent = total;
    if (elCompleted) elCompleted.textContent = completedToday;
    if (elStreak) elStreak.textContent = streak;
    if (elRate) elRate.textContent = `${completionRate}%`;

    // Progress circle
    const progressCircle = document.getElementById("statProgressCircle");
    const progressPercent = document.getElementById("statProgressPercent");
    if (progressCircle) {
        const circleLength = 440;
        const offset = circleLength - (circleLength * completionRate) / 100;
        progressCircle.style.strokeDashoffset = offset;
    }
    if (progressPercent) progressPercent.textContent = `${completionRate}%`;

    // 7 hari terakhir
    renderWeeklyChart(history, habits);

    // Kategori breakdown
    renderCategoryBreakdown(habits, history);
}

/* =========================
   WEEKLY CHART
========================= */

function renderWeeklyChart(history, habits) {
    const chartContainer = document.getElementById("weeklyChart");
    if (!chartContainer) return;

    chartContainer.innerHTML = "";

    const days = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);

        const dateKey = getLocalDateKey(date);
        const dayName = days[date.getDay()];
        const isToday = i === 0;

        const completedOnDay = history.filter(item => item.dateKey === dateKey && item.status === "Selesai").length;
        const totalHabits = habits.length || 1;
        const heightPercent = Math.round((completedOnDay / totalHabits) * 100);

        const barItem = document.createElement("div");
        barItem.className = "bar-item";
        barItem.innerHTML = `
      <div class="bar ${isToday ? "today-bar" : ""}" style="height:${Math.max(heightPercent, 5)}%;" title="${completedOnDay} selesai"></div>
      <span>${dayName}</span>
    `;

        chartContainer.appendChild(barItem);
    }
}

/* =========================
   KATEGORI BREAKDOWN
========================= */

function renderCategoryBreakdown(habits, history) {
    const container = document.getElementById("categoryBreakdown");
    if (!container) return;

    container.innerHTML = "";

    const categories = CONFIG.CATEGORIES;

    categories.forEach(cat => {
        const catHabits = habits.filter(h => h.category === cat);
        const catDone = catHabits.filter(h => isHabitDoneToday(h)).length;
        const catTotal = catHabits.length;
        const catRate = catTotal === 0 ? 0 : Math.round((catDone / catTotal) * 100);

        const row = document.createElement("div");
        row.className = "category-bar-row";
        row.innerHTML = `
      <div class="category-bar-label">
        <span>${cat}</span>
        <small>${catDone}/${catTotal}</small>
      </div>
      <div class="category-bar-track">
        <div class="category-bar-fill" style="width:${catRate}%"></div>
      </div>
    `;
        container.appendChild(row);
    });
}

/* =========================
   INIT
========================= */

document.addEventListener("DOMContentLoaded", function () {
    initStatistikPage();
});
