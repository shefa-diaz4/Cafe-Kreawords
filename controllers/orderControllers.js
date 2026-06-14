const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '../data/orders.json');

exports.getOrders = (req, res) => {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  res.json(data);
};

exports.addOrder = (req, res) => {
  const newOrder = req.body;
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  data.push(newOrder);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  res.json({ message: 'Order berhasil ditambahkan!' });
};
