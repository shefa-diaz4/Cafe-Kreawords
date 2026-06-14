document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("bookingForm");
  const tableBody = document.querySelector("#bookingTable tbody");
  const clearBtn = document.getElementById("clearBookings");
  const toast = document.getElementById("toast");

  // Ambil data dari localStorage
  let bookings = JSON.parse(localStorage.getItem("bookings")) || [];
  renderTable();

  // Submit Form
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("bk_name").value.trim();
    const phone = document.getElementById("bk_phone").value.trim();
    const datetime = document.getElementById("bk_datetime").value;
    const people = document.getElementById("bk_people").value;
    const note = document.getElementById("bk_note").value.trim();
    const address = document.getElementById("bk_address").value.trim();

    if (!name || !phone || !datetime || !address) {
      showToast("⚠️ Semua kolom wajib diisi!");
      return;
    }

    const newBooking = { name, phone, datetime, people, note, address };
    bookings.push(newBooking);
    localStorage.setItem("bookings", JSON.stringify(bookings));

    form.reset();
    showToast(`✅ Booking berhasil disimpan untuk ${name}`);
    renderTable();
  });

  // Hapus Semua Booking
  clearBtn.addEventListener("click", () => {
    if (confirm("Yakin ingin menghapus semua booking?")) {
      localStorage.removeItem("bookings");
      bookings = [];
      showToast("🗑️ Semua booking berhasil dihapus!");
      renderTable();
    }
  });

  // Render Tabel
  function renderTable() {
    tableBody.innerHTML = "";
    if (bookings.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="6">Belum ada data booking</td></tr>`;
      return;
    }

    bookings.forEach((b) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${b.name}</td>
        <td>${b.phone}</td>
        <td>${new Date(b.datetime).toLocaleString("id-ID")}</td>
        <td>${b.people}</td>
        <td>${b.note || "-"}</td>
        <td><a href="https://maps.app.goo.gl/SgaYhtgshfxWE227A" =${encodeURIComponent(b.address)}" target="_blank">${b.address}</a></td>
      `;
      tableBody.appendChild(tr);
    });
  }

  // Toast Notification
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 3000);
  }
});

// ===============================
// TOGGLE MENU UNTUK MOBILE
// ===============================
// Update toggle menu code
const menuBtn = document.getElementById("menuBtn");
const mobileNav = document.getElementById("mobileNav");

if (menuBtn && mobileNav) {
  menuBtn.addEventListener("click", () => {
    mobileNav.classList.toggle("show");
    
    // Toggle icon
    const svgPath = menuBtn.querySelector("svg path");
    if (mobileNav.classList.contains("show")) {
      svgPath.setAttribute("d", "M6 6l12 12M6 18L18 6"); // X icon
    } else {
      svgPath.setAttribute("d", "M4 6h16M4 12h16M4 18h16"); // Menu icon
    }
  });
}

// Close mobile nav when clicking links
document.querySelectorAll('#mobileNav a').forEach(link => {
  link.addEventListener('click', () => {
    mobileNav.classList.remove('show');
    const svgPath = menuBtn.querySelector("svg path");
    svgPath.setAttribute("d", "M4 6h16M4 12h16M4 18h16");
  });
});

// Close mobile nav when clicking outside
document.addEventListener('click', (e) => {
  if (!mobileNav.contains(e.target) && !menuBtn.contains(e.target)) {
    mobileNav.classList.remove('show');
    const svgPath = menuBtn.querySelector("svg path");
    svgPath.setAttribute("d", "M4 6h16M4 12h16M4 18h16");
  }
});