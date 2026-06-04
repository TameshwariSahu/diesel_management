const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'diesel_management',
  port: process.env.DB_PORT || 3306,
  connectTimeout: 20000
});

db.connect(err => {
  if (err) {
    console.error('❌ Database Connection Failed:');
    console.error('Error Code:', err.code);
    console.error('Error Message:', err.message);
    console.error('Full Error:', err);
  } else {
    console.log('✅ MySQL Database Connected Successfully');
  }
});

module.exports = db;
