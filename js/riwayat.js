/* =========================================================
   HABITFLOW - RIWAYAT.JS
   Logika untuk halaman riwayat.html
========================================================= */

// Proteksi: Redirect jika belum login
window.addEventListener('DOMContentLoaded', async function() {
    const isLoggedIn = await redirectIfNotLoggedIn();
    if (!isLoggedIn) return;
});

/* =========================
   INIT RIWAYAT PAGE
========================= */

function initRiwayatPage() {
    const riwayatContainer = document.getElementById("riwayatTable");
    if (!riwayatContainer) return;

    const filterCategory = document.getElementById("riwayatFilterCategory");
    const filterStatus = document.getElementById("riwayatFilterStatus");
    const searchInput = document.getElementById("riwayatSearch");
    const clearBtn = document.getElementById("clearHistoryBtn");

    if (filterCategory) filterCategory.addEventListener("change", renderRiwayat);
    if (filterStatus) filterStatus.addEventListener("change", renderRiwayat);
    if (searchInput) searchInput.addEventListener("input", renderRiwayat);

    if (clearBtn) {
        clearBtn.addEventListener("click", function () {
            if (!confirm("Yakin ingin menghapus seluruh riwayat? Tindakan ini tidak bisa dibatalkan.")) return;
            saveHistory([]);
            renderRiwayat();
            showToast("Riwayat berhasil dihapus.");
        });
    }

    renderRiwayat();
}

/* =========================
   RENDER RIWAYAT
========================= */

function renderRiwayat() {
    const history = getHistory();
    const tbody = document.getElementById("riwayatTable");
    const totalEl = document.getElementById("riwayatTotal");
    const emptyEl = document.getElementById("riwayatEmpty");

    if (!tbody) return;

    tbody.innerHTML = "";

    const selectedCategory = document.getElementById("riwayatFilterCategory")?.value || "Semua";
    const selectedStatus = document.getElementById("riwayatFilterStatus")?.value || "Semua";
    const keyword = document.getElementById("riwayatSearch")?.value.toLowerCase().trim() || "";

    let filtered = history;

    if (selectedCategory !== "Semua") {
        filtered = filtered.filter(item => item.category === selectedCategory);
    }

    if (selectedStatus !== "Semua") {
        filtered = filtered.filter(item => item.status === selectedStatus);
    }

    if (keyword) {
        filtered = filtered.filter(item =>
            item.name.toLowerCase().includes(keyword) ||
            item.category.toLowerCase().includes(keyword)
        );
    }

    if (totalEl) totalEl.textContent = filtered.length;

    if (filtered.length === 0) {
        if (emptyEl) emptyEl.classList.add("show");
        tbody.innerHTML = `
      <tr>
        <td colspan="4" style="text-align:center;color:var(--text-muted);padding:32px;">
          Tidak ada riwayat yang cocok dengan filter.
        </td>
      </tr>
    `;
        return;
    }

    if (emptyEl) emptyEl.classList.remove("show");

    filtered.forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML = `
      <td>${item.date}</td>
      <td><strong>${item.name}</strong></td>
      <td><span class="badge">${item.category}</span></td>
      <td class="${item.status === "Selesai" ? "status-done" : "status-failed"}">${item.status}</td>
    `;
        tbody.appendChild(row);
    });
}

/* =========================
   INIT
========================= */

document.addEventListener("DOMContentLoaded", function () {
    initRiwayatPage();
});
