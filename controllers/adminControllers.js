const { username, password } = require('../config/adminConfig');
const fs = require('fs');
const path = require('path');

exports.login = (req, res) => {
  const { user, pass } = req.body;
  if (user === username && pass === password) {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, message: 'Login gagal' });
  }
};

exports.getAllData = (req, res) => {
  const orders = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/orders.json')));
  const bookings = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/bookings.json')));
  res.json({ orders, bookings });
};
