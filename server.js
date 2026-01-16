
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/public', express.static(path.join(__dirname, 'public')));

// Import routes
const authRoutes = require('./routes/auth.routes');
const barangRoutes = require('./routes/barang.routes');
const tokoRoutes = require('./routes/toko.routes');
const orderRoutes = require('./routes/order.routes');
const invoiceRoutes = require('./routes/invoice.routes');

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/barang', barangRoutes);
app.use('/api/toko', tokoRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/invoice', invoiceRoutes);

// Root endpoint
app.get('/', (req, res) => {
	res.json({ message: 'Selamat datang di API Tugas Akhir PAM' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server berjalan pada port ${PORT}`);
});
app.listen(3000, '0.0.0.0', () => {
    console.log('Server running on port 3000');
});


app.use((err, req, res, next) => {
  console.error('Error:', err); // tampilkan error di terminal
  res.status(500).json({ message: 'Internal server error', error: err.message });
});