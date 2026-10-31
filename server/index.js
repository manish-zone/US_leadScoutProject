import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import leadsRoutes from './routes/leadsRoutes.js';
import { initializeDatabase } from './initDb.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logger for development
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${req.method}] ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// API Routes
app.use('/api', leadsRoutes);

// Root informational endpoint
app.get('/', (req, res) => {
  res.json({
    app: 'LeadScout US Leads CRM Backend',
    runtime: 'Node.js',
    database: 'MySQL',
    endpoints: {
      health: '/api/health',
      stats: '/api/stats',
      leads: '/api/leads',
      createLead: 'POST /api/leads',
      updateLead: 'PUT /api/leads/:id',
      deleteLead: 'DELETE /api/leads/:id',
      batchScraperImport: 'POST /api/leads/batch',
      reset100Leads: 'POST /api/leads/reset'
    }
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.url} not found` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Error]:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message
  });
});

// Start Server after initializing MySQL
async function startServer() {
  try {
    console.log('[Node.js] Starting LeadScout backend server...');
    await initializeDatabase();
    
    const server = app.listen(PORT, () => {
      console.log(`=======================================================`);
      console.log(`🚀 Node.js Backend Server running on http://localhost:${PORT}`);
      console.log(`🗄️  MySQL Database connected: leadscout_db`);
      console.log(`📡 API Endpoints available at: http://localhost:${PORT}/api/leads`);
      console.log(`=======================================================`);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`[Server Error] Port ${PORT} is already in use by another process.`);
      } else {
        console.error('[Server Error]', err);
      }
    });
  } catch (err) {
    console.error('Failed to start server due to database initialization error:', err.message);
    process.exit(1);
  }
}

startServer();

