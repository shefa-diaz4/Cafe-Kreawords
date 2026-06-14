document.addEventListener('DOMContentLoaded', () => {
  const btnTable = document.getElementById('btnTable');
  const paymentSection = document.getElementById('paymentSection');
  const paymentButtons = document.querySelectorAll('.btn.pay');
  const paymentInfo = document.getElementById('paymentInfo');

  // ensure payment hidden initially
  if (paymentSection) paymentSection.style.display = 'none';

  btnTable && btnTable.addEventListener('click', () => {
    if (!paymentSection) return;
    paymentSection.style.display = 'block';
    paymentSection.classList.add('animate');
    paymentInfo.classList.remove('show');
    paymentInfo.innerHTML = '';
    paymentSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  paymentButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const method = btn.dataset.method;
      paymentInfo.classList.remove('show');
      paymentInfo.innerHTML = '';

      setTimeout(() => {
        if (method === 'bca') {
          paymentInfo.innerHTML = `
            <div class="bank-card" id="bankCard">
              <h4>Bank BCA (Virtual Account)</h4>
              <p>No. Rek: <strong>1234567890</strong></p>
              <p>a.n Cafe Informatika</p>
            </div>`;
        } else if (method === 'mandiri') {
          paymentInfo.innerHTML = `
            <div class="bank-card" id="bankCard">
              <h4>Bank Mandiri (Virtual Account)</h4>
              <p>No. Rek: <strong>9876543210</strong></p>
              <p>a.n Cafe Informatika</p>
            </div>`;
        } else if (method === 'qris') {
          paymentInfo.innerHTML = `<h4>Scan QRIS</h4><img src="assets/img/payment/qris.png" alt="QRIS" loading="lazy" style="max-width:180px">`;
        } else if (method === 'crypto') {
          paymentInfo.innerHTML = `
            <h4>Pilih Koin Cryptocurrency</h4>
            <div style="display:flex;gap:8px;justify-content:center;margin-top:8px">
              <button class="btn crypto-btn" data-coin="btc">Bitcoin</button>
              <button class="btn crypto-btn" data-coin="eth">Ethereum</button>
            </div>
            <div id="walletInfo" style="margin-top:12px"></div>`;
        }

        paymentInfo.classList.add('show');

        const bankCard = document.getElementById('bankCard');
        if (bankCard) {
          bankCard.classList.remove('pulse');
          void bankCard.offsetWidth;
          bankCard.classList.add('pulse');
        }

        paymentInfo.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 50);
    });
  });

  // Back & Help behavior (Option A)
  const backBtn = document.getElementById('backBtn');
  const helpBtn = document.getElementById('helpBtn');
  const helpModal = document.getElementById('helpModal');
  const closeHelp = document.getElementById('closeHelp');

  if (backBtn) {
    backBtn.addEventListener('click', () => {
      if (window.history.length > 1) window.history.back();
      else window.location.href = 'index.html';
    });
  }

  if (helpBtn && helpModal) {
    helpBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = helpModal.getAttribute('aria-hidden') === 'true';
      helpModal.setAttribute('aria-hidden', open ? 'false' : 'true');
    });
    closeHelp && closeHelp.addEventListener('click', () => helpModal.setAttribute('aria-hidden', 'true'));

    // close when click outside content
    helpModal.addEventListener('click', (e) => {
      if (e.target === helpModal) helpModal.setAttribute('aria-hidden', 'true');
    });

    // ESC to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && helpModal.getAttribute('aria-hidden') === 'false') {
        helpModal.setAttribute('aria-hidden', 'true');
      }
    });
  }

  // crypto button behavior (delegated)
  document.addEventListener('click', (e) => {
    if (e.target && e.target.matches('.crypto-btn')) {
      const coin = e.target.dataset.coin;
      const walletInfo = document.getElementById('walletInfo');
      if (!walletInfo) return;
      walletInfo.innerHTML = coin === 'btc'
        ? `<p>Wallet BTC: <strong>bc1qxyz987654abc123</strong></p>`
        : `<p>Wallet ETH: <strong>0xAbCdEf1234567890</strong></p>`;
    }
  });
});