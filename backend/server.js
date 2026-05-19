const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./config/db');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('✅ Diesel Management System Backend is Running...');
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/masters', require('./routes/masterRoutes'));
app.use('/api/allocations', require('./routes/allocationRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});