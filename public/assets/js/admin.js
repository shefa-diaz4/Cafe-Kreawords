document.addEventListener('DOMContentLoaded', () => {
  const loginBtn = document.getElementById('adminLogin');
  const loginMsg = document.getElementById('loginMsg');
  const adminPanel = document.getElementById('adminPanel');

  loginBtn.addEventListener('click', () => {
    const user = document.getElementById('adminUser').value;
    const pass = document.getElementById('adminPass').value;

    if (user === 'admin' && pass === 'password123') {
      loginMsg.textContent = '';
      adminPanel.style.display = 'block';
      loginBtn.style.display = 'none';
    } else {
      loginMsg.textContent = 'Username atau password salah.';
    }
  });
});
