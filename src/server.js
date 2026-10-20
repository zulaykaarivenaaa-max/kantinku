const express = require('express');
const path = require('path');
const dotenv = require('dotenv');

// Memuat konfigurasi dari file .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware untuk memparsing JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Panggil koneksi database
const db = require('./config/db');

// Panggil Routes
const menuRoutes = require('./routes/menuRoutes');
const orderRoutes = require('./routes/orderRouters');

// Konfigurasi Static Folder untuk Frontend & Uploads
app.use(express.static(path.join(__dirname, '../public')));
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Endpoint API
app.use('/api/menus', menuRoutes);
app.use('/api/orders', orderRoutes);

// Rute Utama untuk menampilkan index.html secara eksplisit
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Fallback Route untuk route lainnya
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Jalankan Server
app.listen(PORT, () => {
    console.log('============================================');
    console.log(`🚀 Server KantinKu berjalan di http://localhost:${PORT}`);
    console.log('📂 Database Terhubung: db_kantinku');
    console.log('============================================');
});