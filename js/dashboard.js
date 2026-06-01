/* =========================================================
   HABITFLOW - DASHBOARD.JS
   Logika untuk halaman index.html / Dashboard
========================================================= */

let habits = [];
let history = [];
let isInitialized = false;

/* =========================
   DASHBOARD ELEMENTS
========================= */

const dashboardElements = {
    habitForm: null,
    habitName: null,
    habitCategory: null,
    habitTarget: null,
    editId: null,
    submitBtn: null,
    habitList: null,
    emptyState: null,
    historyTable: null,
    filterCategory: null,
    totalHabit: null,
    completedToday: null,
    pendingToday: null,
    streakCount: null,
    progressPercent: null,
    progressCircle: null,
    todayDate: null
};

/* =========================
   CACHE ELEMENTS
========================= */

function cacheElements() {
    dashboardElements.habitForm = document.getElementById("habitForm");
    dashboardElements.habitName = document.getElementById("habitName");
    dashboardElements.habitCategory = document.getElementById("habitCategory");
    dashboardElements.habitTarget = document.getElementById("habitTarget");
    dashboardElements.editId = document.getElementById("editId");
    dashboardElements.submitBtn = document.getElementById("submitBtn");
    dashboardElements.habitList = document.getElementById("habitList");
    dashboardElements.emptyState = document.getElementById("emptyState");
    dashboardElements.historyTable = document.getElementById("historyTable");
    dashboardElements.filterCategory = document.getElementById("filterCategory");
    dashboardElements.totalHabit = document.getElementById("totalHabit");
    dashboardElements.completedToday = document.getElementById("completedToday");
    dashboardElements.pendingToday = document.getElementById("pendingToday");
    dashboardElements.streakCount = document.getElementById("streakCount");
    dashboardElements.progressPercent = document.getElementById("progressPercent");
    dashboardElements.progressCircle = document.getElementById("progressCircle");
    dashboardElements.todayDate = document.getElementById("todayDate");
}

/* =========================
   INIT DASHBOARD
========================= */

function initDashboardPage() {
    // Define date variables
    const today = new Date();
    const todayKey = getLocalDateKey(today);
    const formattedToday = getFormattedDate(today);

    const {
        habitForm, habitName, habitCategory, habitTarget,
        editId, submitBtn, filterCategory, todayDate
    } = dashboardElements;

    if (!habitForm) return;

    if (todayDate) todayDate.textContent = formattedToday;

    habitForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = habitName.value.trim();
        const category = habitCategory.value;
        const target = habitTarget.value.trim();

        if (!name || !category || !target) {
            showToast("Semua field wajib diisi!", "error");
            return;
        }

        if (editId.value) {
            const habit = habits.find(item => item.id === editId.value);
            if (habit) {
                habit.name = name;
                habit.category = category;
                habit.target = target;
                history = syncHistoryAfterEdit(history, habit);
            }
            submitBtn.textContent = "Simpan Habit";
            editId.value = "";
            showToast("Habit berhasil diperbarui!");
        } else {
            const newHabit = {
                id: generateId(),
                name, category, target,
                priority: "Normal",
                completedDates: []
            };
            habits.unshift(newHabit);
            showToast("Habit baru berhasil ditambahkan!");
        }

        habitForm.reset();
        saveData(habits, history);
        refreshDashboard();
    });

    if (filterCategory) {
        filterCategory.addEventListener("change", renderDashboardHistory);
    }

    refreshDashboard();
}

/* =========================
   RENDER HABIT LIST
========================= */

function renderDashboardHabits() {
    const { habitList, emptyState } = dashboardElements;
    if (!habitList) return;

    habitList.innerHTML = "";

    if (habits.length === 0) {
        if (emptyState) emptyState.classList.add("show");
        return;
    }

    if (emptyState) emptyState.classList.remove("show");

    habits.forEach(habit => {
        const doneToday = isHabitDoneToday(habit);
        const habitCard = document.createElement("div");
        habitCard.className = `habit-card ${doneToday ? "done" : ""}`;

        habitCard.innerHTML = `
      <div class="habit-info">
        <span class="badge">${getCategoryClass(habit.category)}</span>
        <h3>${habit.name}</h3>
        <p>Target: ${habit.target}</p>
        <div class="habit-actions">
          <button class="icon-btn" onclick="editDashboardHabit('${habit.id}')" title="Edit">
            <span class="material-symbols-outlined">edit</span>
          </button>
          <button class="icon-btn delete" onclick="deleteDashboardHabit('${habit.id}')" title="Hapus">
            <span class="material-symbols-outlined">delete</span>
          </button>
        </div>
      </div>
      <button class="check-btn ${doneToday ? "done" : ""}" onclick="toggleDashboardHabit('${habit.id}')" title="Tandai selesai">
        <span class="material-symbols-outlined">${doneToday ? "check_circle" : "check"}</span>
      </button>
    `;

        habitList.appendChild(habitCard);
    });
}

/* =========================
   RENDER HISTORY TABLE
========================= */

function renderDashboardHistory() {
    const { historyTable, filterCategory } = dashboardElements;
    if (!historyTable) return;

    historyTable.innerHTML = "";

    const selectedCategory = filterCategory ? filterCategory.value : "Semua";
    let filteredHistory = history;

    if (selectedCategory !== "Semua") {
        filteredHistory = history.filter(item => item.category === selectedCategory);
    }

    if (filteredHistory.length === 0) {
        historyTable.innerHTML = `
      <tr>
        <td colspan="4" style="text-align:center;color:var(--text-muted);padding:24px;">
          Belum ada riwayat habit.
        </td>
      </tr>
    `;
        return;
    }

    filteredHistory.forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML = `
      <td>${item.date}</td>
      <td><strong>${item.name}</strong></td>
      <td><span class="badge">${item.category}</span></td>
      <td class="${item.status === "Selesai" ? "status-done" : "status-failed"}">${item.status}</td>
    `;
        historyTable.appendChild(row);
    });
}

/* =========================
   UPDATE SUMMARY
========================= */

function updateDashboardSummary() {
    const { totalHabit, completedToday, pendingToday, streakCount, progressPercent, progressCircle } = dashboardElements;

    const total = habits.length;
    const completed = habits.filter(habit => isHabitDoneToday(habit)).length;
    const pending = total - completed;
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

    if (totalHabit) totalHabit.textContent = total;
    if (completedToday) completedToday.textContent = completed;
    if (pendingToday) pendingToday.textContent = pending;
    if (streakCount) streakCount.textContent = calculateStreak(history);
    if (progressPercent) progressPercent.textContent = `${percent}%`;

    if (progressCircle) {
        const circleLength = 440;
        const offset = circleLength - (circleLength * percent) / 100;
        progressCircle.style.strokeDashoffset = offset;
    }
}

function refreshDashboard() {
    renderDashboardHabits();
    renderDashboardHistory();
    updateDashboardSummary();
}

/* =========================
   ACTIONS
========================= */

function toggleDashboardHabit(id) {
    const habit = habits.find(item => item.id === id);
    if (!habit) return;

    if (!Array.isArray(habit.completedDates)) habit.completedDates = [];

    const doneToday = isHabitDoneToday(habit);

    if (doneToday) {
        habit.completedDates = habit.completedDates.filter(date => date !== todayKey);
        history = removeTodayHistory(history, id);
    } else {
        habit.completedDates.push(todayKey);
        history = addOrUpdateHistory(history, habit, "Selesai");
        showToast(`"${habit.name}" selesai hari ini! 🎉`);
    }

    saveData(habits, history);
    refreshDashboard();
}

function deleteDashboardHabit(id) {
    if (!confirm("Yakin ingin menghapus habit ini?")) return;
    habits = habits.filter(item => item.id !== id);
    history = history.filter(item => item.habitId !== id);
    saveData(habits, history);
    refreshDashboard();
    showToast("Habit berhasil dihapus.");
}

function editDashboardHabit(id) {
    const { habitName, habitCategory, habitTarget, editId, submitBtn } = dashboardElements;
    const habit = habits.find(item => item.id === id);
    if (!habit) return;

    habitName.value = habit.name;
    habitCategory.value = habit.category;
    habitTarget.value = habit.target;
    editId.value = habit.id;
    submitBtn.textContent = "Update Habit";

    const habitSection = document.getElementById("habit");
    if (habitSection) {
        window.scrollTo({ top: habitSection.offsetTop - 80, behavior: "smooth" });
    }
}

/* =========================
   INIT
========================= */

document.addEventListener("DOMContentLoaded", async function () {
    // Check login dulu
    const isLoggedIn = await redirectIfNotLoggedIn();
    if (!isLoggedIn) return; // Jika tidak login, redirect akan handle

    if (isInitialized) return; // Prevent double init
    isInitialized = true;

    // Load data setelah login confirmed
    habits = getHabits();
    history = getHistory();

    // Cache elements
    cacheElements();

    // Init
    initDashboardPage();
});
