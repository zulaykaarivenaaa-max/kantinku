const mysql = require('mysql2');
require('dotenv').config();

// Membuat pool koneksi ke MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'db_kantinku',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Menggunakan promise agar mendukung async/await
module.exports = pool.promise();