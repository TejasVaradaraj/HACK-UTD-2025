import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
import cauldronRoutes from './routes/cauldrons.js';
import ticketRoutes from './routes/tickets.js';
import levelRoutes from './routes/levels.js';
import reconcileRoutes from './routes/reconcile.js';
import informationRoutes from './routes/information.js';
import levelDetailRoutes from './routes/levelDetail.js';

app.use('/api/cauldrons', cauldronRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/levels', levelRoutes);
app.use('/api/reconcile', reconcileRoutes);
app.use('/api/information', informationRoutes);
app.use('/api/level', levelDetailRoutes);

// Import cache for stats endpoint
import { cache } from './utils/cache.js';

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'PotionFlow API is running',
    upstreamAPI: 'https://hackutd2025.eog.systems'
  });
});

// Cache stats endpoint (for debugging)
app.get('/api/cache/stats', (req, res) => {
  res.json({
    status: 'ok',
    cache: cache.stats()
  });
});

// Clear cache endpoint (for debugging)
app.post('/api/cache/clear', (req, res) => {
  cache.clear();
  res.json({ status: 'ok', message: 'Cache cleared' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🧙‍♀️ PotionFlow API running on http://localhost:${PORT}`);
  console.log(`📡 Proxying HackUTD API: https://hackutd2025.eog.systems`);
});
