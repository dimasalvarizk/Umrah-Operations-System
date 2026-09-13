const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { initDb } = require('./config/db');
const contractRoutes = require('./routes/contractRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5007;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'contracts-service', port: PORT });
});

// Routes
app.use('/api/contracts', contractRoutes);
app.use('/', contractRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found in contracts-service` });
});

// Start server
async function startServer() {
  await initDb();
  app.listen(PORT, () => {
    console.log(`🚀 Contracts Service is running on http://localhost:${PORT}`);
  });
}

startServer();
