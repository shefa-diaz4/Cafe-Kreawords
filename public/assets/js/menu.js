// ===============================
// VARIABEL DASAR
// ===============================
const menuCards = document.querySelectorAll('.menu-card');
const cartBtn = document.getElementById('cartBtn');
const cartCount = document.getElementById('cartCount');
const cartModal = document.getElementById('cartModal');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');

let cart = JSON.parse(localStorage.getItem('cart')) || [];

// ===============================
// TAMBAH KE KERANJANG
// ===============================
menuCards.forEach(card => {
  const button = card.querySelector('button');
  button.addEventListener('click', e => {
    e.stopPropagation();
    const name = card.dataset.name;
    const price = parseInt(card.dataset.price);
    addToCart(name, price);
  });
});

function addToCart(name, price) {
  const existing = cart.find(item => item.name === name);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ name, price, qty: 1 });
  }
  saveCart();
  updateCartUI();
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartUI() {
  cartCount.textContent = cart.reduce((sum, item) => sum + item.qty, 0);
  cartItems.innerHTML = '';
  let total = 0;

  cart.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${item.name} x${item.qty} - Rp ${(
      item.price * item.qty
    ).toLocaleString('id-ID')}`;
    cartItems.appendChild(li);
    total += item.price * item.qty;
  });

  cartTotal.textContent = `Total: Rp ${total.toLocaleString('id-ID')}`;
}

if (cartBtn) {
  cartBtn.addEventListener('click', () => {
    if (cartModal.style.display === 'flex') {
      cartModal.style.opacity = '0';
      setTimeout(() => (cartModal.style.display = 'none'), 300);
    } else {
      cartModal.style.display = 'flex';
      setTimeout(() => (cartModal.style.opacity = '1'), 10);
      updateCartUI();
    }
  });
}

function closeCart() {
  cartModal.style.opacity = '0';
  setTimeout(() => (cartModal.style.display = 'none'), 300);
}

function clearCart() {
  cart = [];
  localStorage.removeItem('cart');
  updateCartUI();
  alert('Keranjang dikosongkan.');
}

updateCartUI();

// ...existing code...

// ===============================
// TOGGLE MENU MOBILE (IMPROVED)
// ===============================
(function initMobileToggle(){
  const menuBtn = document.getElementById("menuBtn");
  const mobileNav = document.getElementById("mobileNav");
  if (!menuBtn || !mobileNav) return;

  menuBtn.setAttribute('aria-expanded', 'false');

  menuBtn.addEventListener("click", (ev) => {
    ev.stopPropagation();
    const opened = mobileNav.classList.toggle("show");
    menuBtn.setAttribute('aria-expanded', opened ? 'true' : 'false');

    const svgPath = menuBtn.querySelector("svg path");
    if (svgPath) {
      svgPath.setAttribute("d", opened ? "M6 6l12 12M6 18L18 6" : "M4 6h16M4 12h16M4 18h16");
    }
  });

  // Close when clicking a link
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('show');
      menuBtn.setAttribute('aria-expanded', 'false');
      const svgPath = menuBtn.querySelector("svg path");
      if (svgPath) svgPath.setAttribute("d", "M4 6h16M4 12h16M4 18h16");
    });
  });

  // Close when clicking outside only if open
  document.addEventListener('click', (e) => {
    if (mobileNav.classList.contains('show') && !mobileNav.contains(e.target) && !menuBtn.contains(e.target)) {
      mobileNav.classList.remove('show');
      menuBtn.setAttribute('aria-expanded', 'false');
      const svgPath = menuBtn.querySelector("svg path");
      if (svgPath) svgPath.setAttribute("d", "M4 6h16M4 12h16M4 18h16");
    }
  });

  // Close on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('show')) {
      mobileNav.classList.remove('show');
      menuBtn.setAttribute('aria-expanded', 'false');
      const svgPath = menuBtn.querySelector("svg path");
      if (svgPath) svgPath.setAttribute("d", "M4 6h16M4 12h16M4 18h16");
    }
  });
})();


// ===============================
// ANIMASI FADE-IN MENU CARD
// ===============================
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

menuCards.forEach(card => {
  card.classList.add('hidden-card');
  observer.observe(card);
});
