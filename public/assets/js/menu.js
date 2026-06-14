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

// Cart bar elements (bottom bar)
const cartBar = document.getElementById('cartBar');
// cart modal view state: 'cart' or 'payment'
let cartViewState = 'cart';
const cartBarText = document.getElementById('cartBarText');
const cartBarTotal = document.getElementById('cartBarTotal');

// ===============================
// FILTER MENU (Makanan / Minuman / All)
// ===============================
const filterBtns = document.querySelectorAll('.filter-btn');
if (filterBtns && filterBtns.length) {
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      menuCards.forEach(card => {
        if (filter === 'all' || (card.dataset.type && card.dataset.type === filter)) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// ===============================
// DETAIL MODAL / OPEN CARD
// ===============================
const detailModal = document.getElementById('detailModal');
const detailClose = document.getElementById('detailClose');
const detailImg = document.getElementById('detailImg');
const detailName = document.getElementById('detailName');
const detailPrice = document.getElementById('detailPrice');
const detailSubtotal = document.getElementById('detailSubtotal');
const qtyMinus = document.getElementById('qtyMinus');
const qtyPlus = document.getElementById('qtyPlus');
const qtyVal = document.getElementById('qtyVal');
const detailAddToCart = document.getElementById('detailAddToCart');

let currentItem = null;
let currentQty = 1;

// --- Configurable pricing / labels
const PRICES = {
  LARGE_SURCHARGE: 5000, // change here to adjust large size cost
  OAT_SURCHARGE: 2000    // change here to adjust oat milk cost
};

function formatIDR(v){ return `Rp ${v.toLocaleString('id-ID')}`; }

function getSelectedOptions(){
  const temp = document.querySelector('input[name="temp"]:checked')?.value || 'hot';
  const size = document.querySelector('input[name="size"]:checked')?.value || 'reguler';
  const milk = document.querySelector('input[name="milk"]:checked')?.value || 'milk';
  const sugar = document.querySelector('input[name="sugar"]:checked')?.value || 'normal';
  const iceLevel = document.querySelector('input[name="iceLevel"]:checked')?.value || 'normal';
  const nasi = document.querySelector('input[name="nasi"]:checked')?.value || 'dengan';
  const pedas = document.querySelector('input[name="pedas"]:checked')?.value || 'sedang';
  return { temp, size, milk, sugar, iceLevel, nasi, pedas };
}

function summarizeOptions(opts, type){
  if(!opts) return '';
  if(type === 'makanan'){
    const parts = [];
    if(opts.nasi && opts.nasi === 'tanpa') parts.push('Tanpa nasi');
    if(opts.pedas && opts.pedas !== 'sedang') parts.push(`Pedas: ${opts.pedas}`);
    return parts.join(' • ');
  }
  const parts = [];
  if(opts.size && opts.size !== 'reguler') parts.push(opts.size);
  if(opts.milk && opts.milk !== 'milk') parts.push(opts.milk);
  if(opts.temp && opts.temp !== 'hot') parts.push(opts.temp);
  if(opts.sugar && opts.sugar !== 'normal') parts.push(`s:${opts.sugar}`);
  return parts.join(' • ');
}

function updateDetailSubtotal(){
  if(!currentItem) return;
  const base = parseInt(currentItem.dataset.price) || 0;
  const opts = getSelectedOptions();
  let add = 0;
  if((currentItem.dataset.type || '') === 'minuman'){
    if(opts.size === 'large') add += PRICES.LARGE_SURCHARGE;
    if(opts.milk === 'oat') add += PRICES.OAT_SURCHARGE;
  }
  const subtotal = (base + add) * currentQty;
  if(detailSubtotal) detailSubtotal.textContent = formatIDR(subtotal);
}

function openDetail(card){
  currentItem = card;
  currentQty = 1;
  if(qtyVal) qtyVal.textContent = currentQty;
  const name = card.dataset.name || '';
  const price = parseInt(card.dataset.price) || 0;
  const img = card.querySelector('img')?.src || '';
  if(detailImg) detailImg.src = img;
  if(detailName) detailName.textContent = name;
  if(detailPrice) detailPrice.textContent = formatIDR(price);
  const type = card.dataset.type || 'all';
  document.querySelectorAll('.option-group').forEach(g => {
    const forType = g.dataset.for || 'both';
    if(forType === 'both' || forType === type) g.style.display = '';
    else g.style.display = 'none';
  });
  updateDetailSubtotal();
  if(detailModal){ detailModal.classList.add('show'); detailModal.setAttribute('aria-hidden','false'); }
}

function closeDetail(){ if(detailModal){ detailModal.classList.remove('show'); detailModal.setAttribute('aria-hidden','true'); } }

function updateCartUI() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  if (cartCount) cartCount.textContent = count;

  if (cartItems) {
    cartItems.innerHTML = '';
    let total = 0;
    cart.forEach(item => {
      const row = document.createElement('div');
      row.className = 'cart-item';
      const left = document.createElement('div'); left.className = 'left';
      if(item.image){
        const thumb = document.createElement('img');
        thumb.src = item.image;
        thumb.style.width = '48px'; thumb.style.height = '48px'; thumb.style.objectFit = 'cover'; thumb.style.borderRadius = '8px'; thumb.style.marginRight = '8px';
        left.appendChild(thumb);
      }
      const name = document.createElement('div'); name.className = 'name'; name.textContent = item.name;
      left.appendChild(name);
      const summary = summarizeOptions(item.options, item.type);
      if(summary){ const opts = document.createElement('div'); opts.className = 'opts'; opts.textContent = summary; left.appendChild(opts); }

      const qty = document.createElement('div'); qty.className = 'qty'; qty.textContent = `x${item.qty}`;
      const price = document.createElement('div'); price.className = 'price'; price.textContent = `Rp ${((item.price||0)*item.qty).toLocaleString('id-ID')}`;

      row.appendChild(left); row.appendChild(qty); row.appendChild(price);
      cartItems.appendChild(row);
      total += (item.price || 0) * item.qty;
    });
    if (cartTotal) cartTotal.textContent = `Total: Rp ${total.toLocaleString('id-ID')}`;

    // update bottom cart bar
    if(cartBarText) cartBarText.textContent = `${count} item`;
    if(cartBarTotal) cartBarTotal.textContent = `Rp ${total.toLocaleString('id-ID')}`;
  } else {
    const total = cart.reduce((s,i)=>(s + (i.price||0) * i.qty), 0);
    if(cartBarText) cartBarText.textContent = `${count} item`;
    if(cartBarTotal) cartBarTotal.textContent = `Rp ${total.toLocaleString('id-ID')}`;
  }

  // enable/disable checkout button if present
  const _cb = document.getElementById('checkoutBtn'); if(_cb) _cb.disabled = count === 0;
}

if(detailClose){ detailClose.addEventListener('click', closeDetail); }
if(detailModal){ detailModal.addEventListener('click', (e)=>{ if(e.target===detailModal) closeDetail(); }); }

if(qtyMinus) qtyMinus.addEventListener('click', ()=>{ if(currentQty>1) currentQty--; qtyVal.textContent=currentQty; updateDetailSubtotal(); });
if(qtyPlus) qtyPlus.addEventListener('click', ()=>{ currentQty++; qtyVal.textContent=currentQty; updateDetailSubtotal(); });

// update subtotal when options change
document.addEventListener('change', (e)=>{ if(detailModal.classList.contains('show')) updateDetailSubtotal(); });

if(detailAddToCart){
  detailAddToCart.addEventListener('click', ()=>{
    if(!currentItem) return;
    const name = currentItem.dataset.name;
    const base = parseInt(currentItem.dataset.price);
    const opts = getSelectedOptions();
    let price = base;
    if((currentItem.dataset.type || '') === 'minuman'){
      if(opts.size==='large') price += PRICES.LARGE_SURCHARGE;
      if(opts.milk==='oat') price += PRICES.OAT_SURCHARGE;
    }
    const imgSrc = currentItem.querySelector('img')?.src || '';
    const item = {
      name,
      price,
      qty: currentQty,
      options: opts,
      image: imgSrc,
      type: currentItem.dataset.type || ''
    };
    addToCart(item.name, item.price, item);
    closeDetail();
  });
}

function addToCart(name, price, fullItem) {
  if (fullItem && fullItem.options) {
    // create a key to differentiate same-name items with different options
    const key = name + '|' + JSON.stringify(fullItem.options);
    const existing = cart.find(item => item.key === key);
    if (existing) {
      existing.qty += fullItem.qty;
    } else {
      cart.push({ key, name, price: fullItem.price, qty: fullItem.qty, options: fullItem.options, image: fullItem.image || '', type: fullItem.type || '' });
    }
  } else {
    const existing = cart.find(item => item.name === name && !item.options);
    if (existing) {
      existing.qty++;
    } else {
      cart.push({ name, price, qty: 1 });
    }
  }
  saveCart();
  updateCartUI();
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// attach menu card click handlers (open detail modal)
menuCards.forEach(card => {
  card.addEventListener('click', () => openDetail(card));
});
// checkout and payment flow
const checkoutBtn = document.getElementById('checkoutBtn');
const paymentSection = document.getElementById('paymentSection');
const payBtn = document.getElementById('payBtn');
const payCancel = document.getElementById('payCancel');

if(checkoutBtn){
  checkoutBtn.addEventListener('click', ()=>{
    const count = cart.reduce((s,i)=>s+i.qty,0);
    if(count === 0){
      alert('Keranjang kosong. Tambahkan produk terlebih dahulu.');
      return;
    }
    // show payment section
    cartViewState = 'payment';
    if(paymentSection) paymentSection.classList.remove('hidden');
    // hide cart buttons while in payment
    const cb = document.querySelectorAll('.cart-buttons')[0]; if(cb) cb.classList.add('hidden');
  });
}

if(payCancel){
  payCancel.addEventListener('click', ()=>{
    // back to cart view
    cartViewState = 'cart';
    if(paymentSection) paymentSection.classList.add('hidden');
    const cb = document.querySelectorAll('.cart-buttons')[0]; if(cb) cb.classList.remove('hidden');
  });
}

if(payBtn){
  payBtn.addEventListener('click', ()=>{
    // simple simulation of payment then redirect to order page
    alert('Pembayaran berhasil. Pesanan dikonfirmasi.');
    window.location.href = 'order.html';
  });
}

// open cart via bottom bar
if(cartBar){
  cartBar.addEventListener('click', ()=>{
    cartModal.style.display = 'flex';
    setTimeout(()=>cartModal.style.opacity = '1',10);
    updateCartUI();
  });
}

// back icon in cart modal: if in payment view go back to cart, else close modal
const cartBack = document.getElementById('cartBack');
if(cartBack){
  cartBack.addEventListener('click', ()=>{
    if(cartViewState === 'payment'){
      // return to cart view
      cartViewState = 'cart';
      if(paymentSection) paymentSection.classList.add('hidden');
      const cb = document.querySelectorAll('.cart-buttons')[0]; if(cb) cb.classList.remove('hidden');
    } else {
      cartModal.style.opacity = '0';
      setTimeout(()=>cartModal.style.display = 'none',300);
    }
  });
}

// shipping option toggle
const shippingRadios = document.querySelectorAll('input[name="shipping"]');
const deliveryAddress = document.getElementById('deliveryAddress');
if(shippingRadios && shippingRadios.length){
  shippingRadios.forEach(r => r.addEventListener('change', ()=>{
    const val = document.querySelector('input[name="shipping"]:checked')?.value || 'pickup';
    if(deliveryAddress) {
      if(val === 'delivery') deliveryAddress.classList.remove('hidden');
      else deliveryAddress.classList.add('hidden');
    }
  }));
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
