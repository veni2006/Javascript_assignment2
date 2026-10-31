const path = require('path');
const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const studentRoutes = require('./routes/studentRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable Cross-Origin Resource Sharing for React frontend
app.use(cors());

// Parse incoming JSON requests
app.use(express.json());

// Root / Health check route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Student Management System API is running smoothly.',
  });
});

// Student REST API Routes
app.use('/api/students', studentRoutes);

// 404 Route Handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route '${req.originalUrl}' not found.`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Server Error]', err.stack || err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

// Start Express server
const server = app.listen(PORT, () => {
  console.log(`[Server] Server successfully started and running on http://localhost:${PORT}`);
});

// Connect to MongoDB Atlas
connectDB()
  .then(() => {
    console.log('[Database] Database is connected and ready for student operations.');
  })
  .catch((error) => {
    console.error('[Database Error] Failed to connect to MongoDB Atlas:');
    console.error(error.message);
    console.error('[Atlas Tip] Please verify that your current IP address is whitelisted in MongoDB Atlas Network Access (or set to 0.0.0.0/0).');
  });

module.exports = { app, server };
