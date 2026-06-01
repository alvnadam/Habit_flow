/* =========================================================
   HABITFLOW - HABIT.JS
   Logika untuk halaman habit.html / Habit Manager
========================================================= */

// Proteksi: Redirect jika belum login
window.addEventListener('DOMContentLoaded', async function() {
    const isLoggedIn = await redirectIfNotLoggedIn();
    if (!isLoggedIn) return;
});

let habits = getHabits();
let history = getHistory();

const today = new Date();
const todayKey = getLocalDateKey(today);

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
   INIT HABIT PAGE
========================= */

function initHabitPage() {
    const { habitPageForm, categoryFilter, searchHabit, cancelEditBtn } = habitPageElements;
    if (!habitPageForm) return;

    habitPageForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const { habitEditId, habitPageName, habitPageCategory, habitPageTarget, habitPriority } = habitPageElements;

        const name = habitPageName.value.trim();
        const category = habitPageCategory.value;
        const target = habitPageTarget.value.trim();
        const priority = habitPriority ? habitPriority.value : "Normal";

        if (!name || !category || !target) {
            showToast("Semua data habit wajib diisi!", "error");
            return;
        }

        if (habitEditId.value) {
            const habit = habits.find(item => item.id === habitEditId.value);
            if (habit) {
                habit.name = name;
                habit.category = category;
                habit.target = target;
                habit.priority = priority;
                history = syncHistoryAfterEdit(history, habit);
            }
            resetHabitPageForm();
            showToast("Habit berhasil diperbarui!");
        } else {
            const newHabit = {
                id: generateId(),
                name, category, target, priority,
                completedDates: []
            };
            habits.unshift(newHabit);
            showToast("Habit baru berhasil ditambahkan!");
        }

        habitPageForm.reset();
        saveData(habits, history);
        refreshHabitPage();
    });

    if (cancelEditBtn) {
        cancelEditBtn.addEventListener("click", function () {
            habitPageForm.reset();
            resetHabitPageForm();
        });
    }

    if (categoryFilter) categoryFilter.addEventListener("change", renderHabitPageList);
    if (searchHabit) searchHabit.addEventListener("input", renderHabitPageList);

    refreshHabitPage();
}

/* =========================
   RENDER HABIT LIST
========================= */

function renderHabitPageList() {
    const { habitPageList, habitPageEmpty, categoryFilter, searchHabit } = habitPageElements;
    if (!habitPageList) return;

    habitPageList.innerHTML = "";

    const selectedCategory = categoryFilter ? categoryFilter.value : "Semua";
    const keyword = searchHabit ? searchHabit.value.toLowerCase().trim() : "";

    let filteredHabits = habits;

    if (selectedCategory !== "Semua") {
        filteredHabits = filteredHabits.filter(habit => habit.category === selectedCategory);
    }

    if (keyword) {
        filteredHabits = filteredHabits.filter(habit =>
            habit.name.toLowerCase().includes(keyword) ||
            habit.category.toLowerCase().includes(keyword) ||
            habit.target.toLowerCase().includes(keyword)
        );
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
          <span class="material-symbols-outlined">${doneToday ? "check_circle" : "check"}</span>
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

/* =========================
   UPDATE SUMMARY
========================= */

function updateHabitPageSummary() {
    const { habitTotal, habitDone, habitPending, heroProgress } = habitPageElements;

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
   ACTIONS
========================= */

function toggleHabit(id) {
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
    refreshHabitPage();
}

function deleteHabit(id) {
    if (!confirm("Yakin ingin menghapus habit ini?")) return;
    habits = habits.filter(item => item.id !== id);
    history = history.filter(item => item.habitId !== id);
    saveData(habits, history);
    refreshHabitPage();
    showToast("Habit berhasil dihapus.");
}

function startHabitPageEdit(id) {
    const {
        habitEditId, habitPageName, habitPageCategory, habitPageTarget,
        habitPriority, formTitle, habitPageSubmit, cancelEditBtn
    } = habitPageElements;

    const habit = habits.find(item => item.id === id);
    if (!habit) return;

    habitEditId.value = habit.id;
    habitPageName.value = habit.name;
    habitPageCategory.value = habit.category;
    habitPageTarget.value = habit.target;

    if (habitPriority) habitPriority.value = habit.priority || "Normal";
    if (formTitle) formTitle.textContent = "Edit Habit";

    if (habitPageSubmit) {
        habitPageSubmit.innerHTML = `
      <span class="material-symbols-outlined">save</span>
      Update Habit
    `;
    }

    if (cancelEditBtn) cancelEditBtn.classList.add("show");

    const formCard = document.querySelector(".habit-create-card");
    if (formCard) {
        window.scrollTo({ top: formCard.offsetTop - 90, behavior: "smooth" });
    }
}

function resetHabitPageForm() {
    const { habitEditId, formTitle, habitPageSubmit, cancelEditBtn } = habitPageElements;

    if (habitEditId) habitEditId.value = "";
    if (formTitle) formTitle.textContent = "Tambah Habit";

    if (habitPageSubmit) {
        habitPageSubmit.innerHTML = `
      <span class="material-symbols-outlined">add_circle</span>
      Simpan Habit
    `;
    }

    if (cancelEditBtn) cancelEditBtn.classList.remove("show");
}

/* =========================
   INIT
========================= */

document.addEventListener("DOMContentLoaded", function () {
    initHabitPage();
});
