const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const orderRoutes = require('./routes/orderRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/orders', orderRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/admin', adminRoutes);

// Jalankan server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
