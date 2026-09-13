const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { initDb } = require('./config/db');
const tripRoutes = require('./routes/tripRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5004;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'trips-service', port: PORT });
});

// Routes
app.use('/api/trips', tripRoutes);
app.use('/', tripRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found in trips-service` });
});

// Start server
async function startServer() {
  await initDb();
  app.listen(PORT, () => {
    console.log(`🚀 Trips Service is running on http://localhost:${PORT}`);
  });
}

startServer();
