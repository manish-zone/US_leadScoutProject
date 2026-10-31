import express from 'express';
import {
  getAllLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  batchCreateLeads,
  resetDefaultLeads,
  addNoteToLead,
  getStats
} from '../controllers/leadsController.js';
import { checkConnection } from '../config/db.js';
import { performLiveRadarSweep } from '../services/scraperEngine.js';

const router = express.Router();

// Health check endpoint
router.get('/health', async (req, res) => {
  const dbHealth = await checkConnection();
  res.json({
    status: dbHealth.success ? 'healthy' : 'degraded',
    server: 'Node.js Express',
    database: 'MySQL',
    dbDetails: dbHealth
  });
});

// Stats endpoint
router.get('/stats', getStats);

// Lead endpoints
router.get('/leads', getAllLeads);
router.get('/leads/:id', getLeadById);
router.post('/leads', createLead);
router.put('/leads/:id', updateLead);
router.delete('/leads/:id', deleteLead);

// Batch & Reset endpoints
router.post('/leads/batch', batchCreateLeads);
router.post('/leads/reset', resetDefaultLeads);

// Notes endpoint
router.post('/leads/:id/notes', addNoteToLead);

// Live 3D Radar Scraper endpoint
router.post('/scraper/live-sweep', async (req, res) => {
  try {
    const { category, location, keyword, minReviews } = req.body;
    const result = await performLiveRadarSweep({ category, location, keyword, minReviews });
    res.json(result);
  } catch (error) {
    console.error('Error in radar sweep:', error);
    res.status(500).json({ success: false, message: 'Radar sweep failed', error: error.message });
  }
});

export default router;

