const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { createProxyMiddleware } = require('http-proxy-middleware');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:5001';
const SETTINGS_SERVICE_URL = process.env.SETTINGS_SERVICE_URL || 'http://localhost:5002';
const GROUPS_SERVICE_URL = process.env.GROUPS_SERVICE_URL || 'http://localhost:5003';
const TRIPS_SERVICE_URL = process.env.TRIPS_SERVICE_URL || 'http://localhost:5004';
const HOTELS_SERVICE_URL = process.env.HOTELS_SERVICE_URL || 'http://localhost:5005';
const TRANSPORT_SERVICE_URL = process.env.TRANSPORT_SERVICE_URL || 'http://localhost:5006';
const CONTRACTS_SERVICE_URL = process.env.CONTRACTS_SERVICE_URL || 'http://localhost:5007';
const NOTES_SERVICE_URL = process.env.NOTES_SERVICE_URL || 'http://localhost:5008';

// Global CORS Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// API Gateway Health Check
app.get('/health', (req, res) => {
  res.status(200).json({
    service: 'api-gateway',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    routes: {
      auth: `${AUTH_SERVICE_URL}/api/auth`,
      settings: `${SETTINGS_SERVICE_URL}/api/settings`,
      groups: `${GROUPS_SERVICE_URL}/api/groups`,
      trips: `${TRIPS_SERVICE_URL}/api/trips`,
      hotels: `${HOTELS_SERVICE_URL}/api/hotels`,
      transport: `${TRANSPORT_SERVICE_URL}/api/transport`,
      contracts: `${CONTRACTS_SERVICE_URL}/api/contracts`,
      notes: `${NOTES_SERVICE_URL}/api/notes`,
    },
  });
});

function createServiceProxy(targetUrl, serviceName) {
  return createProxyMiddleware({
    target: targetUrl,
    changeOrigin: true,
    on: {
      error: (err, req, res) => {
        console.error(`❌ Proxy error to ${serviceName}:`, err.message);
        res.status(502).json({
          success: false,
          message: `${serviceName} is currently unreachable. Please ensure the microservice is running.`,
          error: err.message,
        });
      },
    },
  });
}

// Proxies for microservices
app.use('/api/auth', createServiceProxy(AUTH_SERVICE_URL, 'Auth Service'));
app.use('/api/settings', createServiceProxy(SETTINGS_SERVICE_URL, 'Settings Service'));
app.use('/api/notifications', createServiceProxy(`${SETTINGS_SERVICE_URL}/api/notifications`, 'Notifications Service'));
app.use('/api/activity-logs', createServiceProxy(`${SETTINGS_SERVICE_URL}/api/activity-logs`, 'Activity Logs Service'));
app.use('/api/groups', createServiceProxy(GROUPS_SERVICE_URL, 'Groups Service'));
app.use('/api/trips', createServiceProxy(TRIPS_SERVICE_URL, 'Trips Service'));
app.use('/api/hotels', createServiceProxy(HOTELS_SERVICE_URL, 'Hotels Service'));
app.use('/api/transport', createServiceProxy(TRANSPORT_SERVICE_URL, 'Transport Service'));
app.use('/api/contracts', createServiceProxy(CONTRACTS_SERVICE_URL, 'Contracts Service'));
app.use('/api/notes', createServiceProxy(NOTES_SERVICE_URL, 'Notes Service'));

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API Route ${req.originalUrl} not found on API Gateway`,
  });
});

// Start Gateway
app.listen(PORT, () => {
  console.log(`\n=================================================`);
  console.log(`🌐 Umrah API Gateway running on http://localhost:${PORT}`);
  console.log(`🔗 Routes configured: auth(5001), settings(5002), groups(5003), trips(5004), hotels(5005), transport(5006), contracts(5007), notes(5008)`);
  console.log(`=================================================\n`);
});
