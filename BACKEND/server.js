const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { syncDatabase } = require('./models');
const path = require('path');
require('dotenv').config();

const app = express();

// Trust proxy for Render / Cloudflare rate-limiting & IP detection
app.set('trust proxy', 1);

// Security Headers
app.use(helmet({
  crossOriginResourcePolicy: false, // allow images to be served cross origin
}));

// CORS Configuration - Supports local development + Vercel Production Domains
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  ...(process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',').map(s => s.trim()) : []),
  ...(process.env.ADMIN_URL ? process.env.ADMIN_URL.split(',').map(s => s.trim()) : []),
  ...(process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',').map(s => s.trim()) : [])
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, server-to-server, Pulsetic)
    if (!origin) return callback(null, true);
    
    // Check if origin is allowed directly or via Vercel preview deploy pattern (*.vercel.app)
    const isAllowed = allowedOrigins.includes(origin) || 
                      origin.endsWith('.vercel.app') || 
                      origin.includes('localhost') ||
                      origin.includes('127.0.0.1');

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked for origin: ${origin}`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files for local uploads fallback
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health Check Endpoints (for Pulsetic Uptime Monitoring and Render keepalive)
app.get(['/health', '/api/health'], (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'Spinfyot API',
    uptime: `${Math.floor(process.uptime())}s`,
    timestamp: new Date().toISOString()
  });
});

// Rate limiting for public API forms
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per 15 mins
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests, please try again later.' }
});
app.use('/api/public/', apiLimiter);

// Setup Routes
app.use('/api/public', require('./routes/publicRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'API route not found' });
});

// Centralized error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
  });
});

// Start Server on 0.0.0.0 for Render
const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, async () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
  await syncDatabase();
});
