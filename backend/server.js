const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./config/db');
const rateLimit = require('express-rate-limit');

dotenv.config();

const app = express();

// 1. MIDDLEWARES 
app.use(cors());
app.use(express.json());

// Rate Limiting Configuration
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, 
  max: 5, 
  message: "Too many requests from this IP, please try again after a minute."
});

// 2. TEST ROUTE
app.get('/', (req, res) => {
  res.send('✅ Diesel Management System Backend is Running...');
});

// 3. API ROUTES 
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/masters', require('./routes/masterRoutes'));
app.use('/api/allocations', require('./routes/allocationRoutes'));

// Rate limit 
app.use('/api/auth/login', limiter);


// ====================================================================
// 4. GLOBAL ERROR HANDLING 
// ====================================================================

// 404 Handler
app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server!`
  });
});

// General Error Handler
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// 6. PROCESS LEVEL SAFETY 
process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});