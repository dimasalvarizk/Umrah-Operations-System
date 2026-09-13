const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { initDb } = require('./config/db');
const groupRoutes = require('./routes/groupRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5003;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({
    service: 'groups-service',
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes (supporting both /api/groups and / for reverse proxy flexibility)
app.use('/api/groups', groupRoutes);
app.use('/', groupRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found on groups-service`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled error on groups-service:', err);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Initialize database and start server
async function startServer() {
  await initDb();
  app.listen(PORT, () => {
    console.log(`🚀 Groups Service is running on http://localhost:${PORT}`);
  });
}

startServer();
