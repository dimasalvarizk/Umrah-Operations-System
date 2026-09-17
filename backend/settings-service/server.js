const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { initDb } = require('./config/db');
const systemListsRoutes = require('./routes/systemListsRoutes');
const teamRoutes = require('./routes/teamRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const activityLogRoutes = require('./routes/activityLogRoutes');
const NotificationFeedModel = require('./models/notificationFeedModel');
const ActivityLogModel = require('./models/activityLogModel');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;

// Enable trust proxy for Coolify / Docker / Traefik reverse proxy environments
app.set('trust proxy', true);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({
    service: 'settings-service',
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes (supporting both /api/settings/... and root paths for proxy flexibility)
app.use('/api/settings/lists', systemListsRoutes);
app.use('/lists', systemListsRoutes);

app.use('/api/settings/team', teamRoutes);
app.use('/team', teamRoutes);

app.use('/api/settings/activity-logs', activityLogRoutes);
app.use('/api/activity-logs', activityLogRoutes);
app.use('/api/settings/notifications', notificationRoutes);
app.use('/notifications', notificationRoutes);
app.use('/api/notifications', notificationRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found on settings-service`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled error on settings-service:', err);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Initialize database and start server
async function startServer() {
  await initDb();
  await NotificationFeedModel.seedInitialIfEmpty();
  await ActivityLogModel.seedInitialIfEmpty();
  app.listen(PORT, () => {
    console.log(`🚀 Settings Service is running on http://localhost:${PORT}`);
  });
}

startServer();

