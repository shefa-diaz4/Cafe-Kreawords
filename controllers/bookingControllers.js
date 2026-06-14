const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '../data/bookings.json');

exports.getBookings = (req, res) => {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  res.json(data);
};

exports.addBooking = (req, res) => {
  const newBooking = req.body;
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  data.push(newBooking);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  res.json({ message: 'Booking berhasil ditambahkan!' });
};
