/* =====================================================
   HABITFLOW - FINAL SCRIPT
   Bisa dipakai untuk:
   1. index.html / Dashboard
   2. habit.html / Halaman Habit
===================================================== */

/* =========================
   GLOBAL DATA
========================= */

let habits = JSON.parse(localStorage.getItem("habits")) || [];
let history = JSON.parse(localStorage.getItem("habitHistory")) || [];

const today = new Date();
const todayKey = getLocalDateKey(today);

const formattedToday = today.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
});

/* =========================
   HELPER FUNCTION
========================= */

function getLocalDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function saveData() {
    localStorage.setItem("habits", JSON.stringify(habits));
    localStorage.setItem("habitHistory", JSON.stringify(history));
}

function generateId() {
    return `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

function isHabitDoneToday(habit) {
    return Array.isArray(habit.completedDates) && habit.completedDates.includes(todayKey);
}

function getCategoryClass(category) {
    const allowedCategories = [
        "Belajar",
        "Kesehatan",
        "Ibadah",
        "Produktivitas",
        "Lainnya"
    ];

    return allowedCategories.includes(category) ? category : "Lainnya";
}

function getPriorityClass(priority) {
    if (priority === "Penting") return "priority-penting";
    if (priority === "Santai") return "priority-santai";
    return "priority-normal";
}

function addOrUpdateHistory(habit, status) {
    const existingHistory = history.find(item => {
        return item.habitId === habit.id && item.dateKey === todayKey;
    });

    if (existingHistory) {
        existingHistory.name = habit.name;
        existingHistory.category = habit.category;
        existingHistory.target = habit.target;
        existingHistory.status = status;
        existingHistory.date = formattedToday;
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
}

function removeTodayHistory(habitId) {
    history = history.filter(item => {
        return !(item.habitId === habitId && item.dateKey === todayKey);
    });
}

function syncHistoryAfterEdit(habit) {
    history = history.map(item => {
        if (item.habitId === habit.id) {
            return {
                ...item,
                name: habit.name,
                category: habit.category,
                target: habit.target
            };
        }

        return item;
    });
}

/* =========================
   DASHBOARD ELEMENTS
========================= */

const dashboardElements = {
    habitForm: document.getElementById("habitForm"),
    habitName: document.getElementById("habitName"),
    habitCategory: document.getElementById("habitCategory"),
    habitTarget: document.getElementById("habitTarget"),
    editId: document.getElementById("editId"),
    submitBtn: document.getElementById("submitBtn"),

    habitList: document.getElementById("habitList"),
    emptyState: document.getElementById("emptyState"),
    historyTable: document.getElementById("historyTable"),
    filterCategory: document.getElementById("filterCategory"),

    totalHabit: document.getElementById("totalHabit"),
    completedToday: document.getElementById("completedToday"),
    pendingToday: document.getElementById("pendingToday"),
    streakCount: document.getElementById("streakCount"),
    progressPercent: document.getElementById("progressPercent"),
    progressCircle: document.getElementById("progressCircle"),
    todayDate: document.getElementById("todayDate")
};

/* =========================
   HABIT PAGE ELEMENTS
========================= */

const habitPageElements = {
    habitPageForm: document.getElementById("habitPageForm"),
    habitEditId: document.getElementById("habitEditId"),
    habitPageName: document.getElementById("habitPageName"),
    habitPageCategory: document.getElementById("habitPageCategory"),
    habitPageTarget: document.getElementById("habitPageTarget"),
    habitPriority: document.getElementById("habitPriority"),
    habitPageSubmit: document.getElementById("habitPageSubmit"),
    cancelEditBtn: document.getElementById("cancelEditBtn"),
    formTitle: document.getElementById("formTitle"),

    habitPageList: document.getElementById("habitPageList"),
    habitPageEmpty: document.getElementById("habitPageEmpty"),
    categoryFilter: document.getElementById("categoryFilter"),
    searchHabit: document.getElementById("searchHabit"),

    habitTotal: document.getElementById("habitTotal"),
    habitDone: document.getElementById("habitDone"),
    habitPending: document.getElementById("habitPending"),
    heroProgress: document.getElementById("heroProgress")
};

/* =========================
   DASHBOARD FUNCTIONS
========================= */

function initDashboardPage() {
    const {
        habitForm,
        habitName,
        habitCategory,
        habitTarget,
        editId,
        submitBtn,
        filterCategory,
        todayDate
    } = dashboardElements;

    if (!habitForm) return;

    if (todayDate) {
        todayDate.textContent = formattedToday;
    }

    habitForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = habitName.value.trim();
        const category = habitCategory.value;
        const target = habitTarget.value.trim();

        if (!name || !category || !target) {
            alert("Semua field wajib diisi!");
            return;
        }

        if (editId.value) {
            const habit = habits.find(item => item.id === editId.value);

            if (habit) {
                habit.name = name;
                habit.category = category;
                habit.target = target;

                syncHistoryAfterEdit(habit);
            }

            submitBtn.textContent = "Simpan Habit";
            editId.value = "";
        } else {
            const newHabit = {
                id: generateId(),
                name: name,
                category: category,
                target: target,
                priority: "Normal",
                completedDates: []
            };

            habits.unshift(newHabit);
        }

        habitForm.reset();
        saveData();
        refreshDashboard();
    });

    if (filterCategory) {
        filterCategory.addEventListener("change", renderDashboardHistory);
    }

    refreshDashboard();
}

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

          <button class="icon-btn delete" onclick="deleteHabit('${habit.id}')" title="Hapus">
            <span class="material-symbols-outlined">delete</span>
          </button>
        </div>
      </div>

      <button class="check-btn ${doneToday ? "done" : ""}" onclick="toggleHabit('${habit.id}')" title="Tandai selesai">
        <span class="material-symbols-outlined">
          ${doneToday ? "check_circle" : "check"}
        </span>
      </button>
    `;

        habitList.appendChild(habitCard);
    });
}

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
        <td colspan="4" style="text-align: center; color: var(--text-muted); padding: 24px;">
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
      <td>
        <span class="badge">${item.category}</span>
      </td>
      <td class="${item.status === "Selesai" ? "status-done" : "status-failed"}">
        ${item.status}
      </td>
    `;

        historyTable.appendChild(row);
    });
}

function updateDashboardSummary() {
    const {
        totalHabit,
        completedToday,
        pendingToday,
        streakCount,
        progressPercent,
        progressCircle
    } = dashboardElements;

    const total = habits.length;
    const completed = habits.filter(habit => isHabitDoneToday(habit)).length;
    const pending = total - completed;

    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

    if (totalHabit) totalHabit.textContent = total;
    if (completedToday) completedToday.textContent = completed;
    if (pendingToday) pendingToday.textContent = pending;
    if (streakCount) streakCount.textContent = calculateSimpleStreak();
    if (progressPercent) progressPercent.textContent = `${percent}%`;

    if (progressCircle) {
        const circleLength = 440;
        const offset = circleLength - (circleLength * percent) / 100;
        progressCircle.style.strokeDashoffset = offset;
    }
}

function calculateSimpleStreak() {
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

function refreshDashboard() {
    renderDashboardHabits();
    renderDashboardHistory();
    updateDashboardSummary();
}

/* =========================
   HABIT PAGE FUNCTIONS
========================= */

function initHabitPage() {
    const {
        habitPageForm,
        categoryFilter,
        searchHabit,
        cancelEditBtn
    } = habitPageElements;

    if (!habitPageForm) return;

    habitPageForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const {
            habitEditId,
            habitPageName,
            habitPageCategory,
            habitPageTarget,
            habitPriority
        } = habitPageElements;

        const name = habitPageName.value.trim();
        const category = habitPageCategory.value;
        const target = habitPageTarget.value.trim();
        const priority = habitPriority ? habitPriority.value : "Normal";

        if (!name || !category || !target || !priority) {
            alert("Semua data habit wajib diisi!");
            return;
        }

        if (habitEditId.value) {
            const habit = habits.find(item => item.id === habitEditId.value);

            if (habit) {
                habit.name = name;
                habit.category = category;
                habit.target = target;
                habit.priority = priority;

                syncHistoryAfterEdit(habit);
            }

            resetHabitPageForm();
        } else {
            const newHabit = {
                id: generateId(),
                name: name,
                category: category,
                target: target,
                priority: priority,
                completedDates: []
            };

            habits.unshift(newHabit);
        }

        habitPageForm.reset();
        saveData();
        refreshHabitPage();
    });

    if (cancelEditBtn) {
        cancelEditBtn.addEventListener("click", function () {
            habitPageForm.reset();
            resetHabitPageForm();
        });
    }

    if (categoryFilter) {
        categoryFilter.addEventListener("change", renderHabitPageList);
    }

    if (searchHabit) {
        searchHabit.addEventListener("input", renderHabitPageList);
    }

    refreshHabitPage();
}

function renderHabitPageList() {
    const {
        habitPageList,
        habitPageEmpty,
        categoryFilter,
        searchHabit
    } = habitPageElements;

    if (!habitPageList) return;

    habitPageList.innerHTML = "";

    const selectedCategory = categoryFilter ? categoryFilter.value : "Semua";
    const keyword = searchHabit ? searchHabit.value.toLowerCase().trim() : "";

    let filteredHabits = habits;

    if (selectedCategory !== "Semua") {
        filteredHabits = filteredHabits.filter(habit => habit.category === selectedCategory);
    }

    if (keyword) {
        filteredHabits = filteredHabits.filter(habit => {
            return habit.name.toLowerCase().includes(keyword) ||
                habit.category.toLowerCase().includes(keyword) ||
                habit.target.toLowerCase().includes(keyword);
        });
    }

    if (filteredHabits.length === 0) {
        if (habitPageEmpty) habitPageEmpty.classList.add("show");
        return;
    }

    if (habitPageEmpty) habitPageEmpty.classList.remove("show");

    filteredHabits.forEach(habit => {
        const doneToday = isHabitDoneToday(habit);
        const priority = habit.priority || "Normal";

        const item = document.createElement("div");
        item.className = `habit-page-item ${doneToday ? "done" : ""}`;

        item.innerHTML = `
      <div class="habit-page-main">
        <div class="habit-page-top">
          <span class="badge">${habit.category}</span>
          <span class="priority-badge ${getPriorityClass(priority)}">${priority}</span>
        </div>

        <h3 class="habit-page-title">${habit.name}</h3>

        <div class="habit-page-desc">
          <span>
            <span class="material-symbols-outlined">flag</span>
            Target: ${habit.target}
          </span>

          <span>
            <span class="material-symbols-outlined">calendar_today</span>
            ${doneToday ? "Selesai hari ini" : "Belum selesai hari ini"}
          </span>
        </div>
      </div>

      <div class="habit-page-actions">
        <button class="habit-complete-btn ${doneToday ? "done" : ""}" onclick="toggleHabit('${habit.id}')" title="Tandai selesai">
          <span class="material-symbols-outlined">
            ${doneToday ? "check_circle" : "check"}
          </span>
        </button>

        <button class="habit-small-btn" onclick="startHabitPageEdit('${habit.id}')" title="Edit">
          <span class="material-symbols-outlined">edit</span>
        </button>

        <button class="habit-small-btn delete" onclick="deleteHabit('${habit.id}')" title="Hapus">
          <span class="material-symbols-outlined">delete</span>
        </button>
      </div>
    `;

        habitPageList.appendChild(item);
    });
}

function updateHabitPageSummary() {
    const {
        habitTotal,
        habitDone,
        habitPending,
        heroProgress
    } = habitPageElements;

    const total = habits.length;
    const done = habits.filter(habit => isHabitDoneToday(habit)).length;
    const pending = total - done;
    const progress = total === 0 ? 0 : Math.round((done / total) * 100);

    if (habitTotal) habitTotal.textContent = total;
    if (habitDone) habitDone.textContent = done;
    if (habitPending) habitPending.textContent = pending;
    if (heroProgress) heroProgress.textContent = `${progress}%`;
}

function refreshHabitPage() {
    renderHabitPageList();
    updateHabitPageSummary();
}

/* =========================
   SHARED ACTIONS
========================= */

function toggleHabit(id) {
    const habit = habits.find(item => item.id === id);

    if (!habit) return;

    if (!Array.isArray(habit.completedDates)) {
        habit.completedDates = [];
    }

    const doneToday = isHabitDoneToday(habit);

    if (doneToday) {
        habit.completedDates = habit.completedDates.filter(date => date !== todayKey);
        removeTodayHistory(id);
    } else {
        habit.completedDates.push(todayKey);
        addOrUpdateHistory(habit, "Selesai");
    }

    saveData();
    refreshAllPages();
}

function deleteHabit(id) {
    const confirmDelete = confirm("Yakin ingin menghapus habit ini?");

    if (!confirmDelete) return;

    habits = habits.filter(item => item.id !== id);
    history = history.filter(item => item.habitId !== id);

    saveData();
    refreshAllPages();
}

function editDashboardHabit(id) {
    const {
        habitName,
        habitCategory,
        habitTarget,
        editId,
        submitBtn
    } = dashboardElements;

    const habit = habits.find(item => item.id === id);

    if (!habit) return;

    if (!habitName || !habitCategory || !habitTarget || !editId || !submitBtn) return;

    habitName.value = habit.name;
    habitCategory.value = habit.category;
    habitTarget.value = habit.target;
    editId.value = habit.id;

    submitBtn.textContent = "Update Habit";

    const habitSection = document.getElementById("habit");

    if (habitSection) {
        window.scrollTo({
            top: habitSection.offsetTop - 80,
            behavior: "smooth"
        });
    }
}

function startHabitPageEdit(id) {
    const {
        habitEditId,
        habitPageName,
        habitPageCategory,
        habitPageTarget,
        habitPriority,
        formTitle,
        habitPageSubmit,
        cancelEditBtn
    } = habitPageElements;

    const habit = habits.find(item => item.id === id);

    if (!habit) return;

    habitEditId.value = habit.id;
    habitPageName.value = habit.name;
    habitPageCategory.value = habit.category;
    habitPageTarget.value = habit.target;

    if (habitPriority) {
        habitPriority.value = habit.priority || "Normal";
    }

    if (formTitle) {
        formTitle.textContent = "Edit Habit";
    }

    if (habitPageSubmit) {
        habitPageSubmit.innerHTML = `
      <span class="material-symbols-outlined">save</span>
      Update Habit
    `;
    }

    if (cancelEditBtn) {
        cancelEditBtn.classList.add("show");
    }

    const formCard = document.querySelector(".habit-create-card");

    if (formCard) {
        window.scrollTo({
            top: formCard.offsetTop - 90,
            behavior: "smooth"
        });
    }
}

function resetHabitPageForm() {
    const {
        habitEditId,
        formTitle,
        habitPageSubmit,
        cancelEditBtn
    } = habitPageElements;

    if (habitEditId) habitEditId.value = "";

    if (formTitle) {
        formTitle.textContent = "Tambah Habit";
    }

    if (habitPageSubmit) {
        habitPageSubmit.innerHTML = `
      <span class="material-symbols-outlined">add_circle</span>
      Simpan Habit
    `;
    }

    if (cancelEditBtn) {
        cancelEditBtn.classList.remove("show");
    }
}

function refreshAllPages() {
    refreshDashboard();
    refreshHabitPage();
}

/* =========================
   INIT
========================= */

document.addEventListener("DOMContentLoaded", function () {
    initDashboardPage();
    initHabitPage();
});