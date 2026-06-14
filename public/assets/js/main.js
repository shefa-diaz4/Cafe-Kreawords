// ===============================
// LAZY LOADING GAMBAR
// ===============================
document.querySelectorAll('img[loading="lazy"]').forEach(img => {
  img.addEventListener('load', () => {
    img.dataset.loaded = 'true';
  });
});

// ===============================
// SMOOTH SCROLL KE SECTION
// ===============================
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
}

// ===============================
// EFEK RIPPLE UNTUK TOMBOL
// ===============================
document.querySelectorAll('.btn, .btn-outline').forEach(btn => {
  btn.style.position = 'relative';
  btn.style.overflow = 'hidden';

  btn.addEventListener('click', function (e) {
    const circle = document.createElement('span');
    const diameter = Math.max(btn.clientWidth, btn.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - btn.offsetLeft - radius}px`;
    circle.style.top = `${e.clientY - btn.offsetTop - radius}px`;
    circle.classList.add('ripple');

    const ripple = btn.getElementsByClassName('ripple')[0];
    if (ripple) ripple.remove();

    btn.appendChild(circle);

    // animasi kecil saat tombol ditekan
    btn.style.transform = 'scale(0.96)';
    setTimeout(() => {
      btn.style.transform = 'scale(1)';
    }, 150);
  });
});

// ===============================
// TOGGLE MENU UNTUK MOBILE
// ===============================
const menuBtn = document.getElementById("menuBtn");
const mobileNav = document.getElementById("mobileNav");

if (menuBtn && mobileNav) {
  menuBtn.addEventListener("click", () => {
    mobileNav.classList.toggle("hidden");

    // Ganti ikon toggle antara ☰ dan ✖
    const svgPath = menuBtn.querySelector("svg path");
    if (mobileNav.classList.contains("hidden")) {
      svgPath.setAttribute("d", "M4 6h16M4 12h16M4 18h16"); // ikon menu
    } else {
      svgPath.setAttribute("d", "M6 6l12 12M6 18L18 6"); // ikon X
    }
  });
}

// Tutup menu otomatis jika link di mobile diklik
document.querySelectorAll('#mobileNav a').forEach(link => {
  link.addEventListener('click', () => {
    mobileNav.classList.add('hidden');
    const svgPath = menuBtn.querySelector("svg path");
    svgPath.setAttribute("d", "M4 6h16M4 12h16M4 18h16");
  });
});
