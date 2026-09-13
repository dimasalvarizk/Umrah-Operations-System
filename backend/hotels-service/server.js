const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { initDb } = require('./config/db');
const hotelRoutes = require('./routes/hotelRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5005;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'hotels-service', port: PORT });
});

// Routes
app.use('/api/hotels', hotelRoutes);
app.use('/', hotelRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found in hotels-service` });
});

// Start server
async function startServer() {
  await initDb();
  app.listen(PORT, () => {
    console.log(`🚀 Hotels Service is running on http://localhost:${PORT}`);
  });
}

startServer();
