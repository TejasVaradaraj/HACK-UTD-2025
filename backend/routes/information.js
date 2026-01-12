import express from 'express';
import { cache, CACHE_TTL } from '../utils/cache.js';

const router = express.Router();
const HACKUTD_API = 'https://hackutd2025.eog.systems';

// GET /api/information/market - Returns market location
router.get('/market', async (req, res) => {
  try {
    // Market is a fixed location in the network
    const market = {
      id: 'market_001',
      name: 'Enchanted Market',
      type: 'market',
      latitude: 32.9857,
      longitude: -96.7501,
      unload_time_min: 15
    };
    res.json(market);
  } catch (error) {
    console.error('Error fetching market info:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/information/cauldrons - Returns all cauldrons with locations
router.get('/cauldrons', async (req, res) => {
  try {
    const cauldrons = await cache.getOrFetch(
      'information:cauldrons',
      async () => {
        const response = await fetch(`${HACKUTD_API}/api/Information/cauldrons`);
        if (!response.ok) {
          throw new Error(`HackUTD API error: ${response.status}`);
        }
        return response.json();
      },
      CACHE_TTL.STATIC
    );
    res.json(cauldrons);
  } catch (error) {
    console.error('Error fetching cauldrons:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/information/network - Returns network edges (connections between nodes)
router.get('/network', async (req, res) => {
  try {
    const networkData = await cache.getOrFetch(
      'information:network',
      async () => {
        const response = await fetch(`${HACKUTD_API}/api/Information/network`);
        if (!response.ok) {
          throw new Error(`HackUTD API error: ${response.status}`);
        }
        return response.json();
      },
      CACHE_TTL.STATIC
    );
    res.json(networkData);
  } catch (error) {
    console.error('Error fetching network:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/information/couriers - Returns all available couriers/witches
router.get('/couriers', async (req, res) => {
  try {
    const couriers = await cache.getOrFetch(
      'information:couriers',
      async () => {
        const response = await fetch(`${HACKUTD_API}/api/Information/couriers`);
        if (!response.ok) {
          throw new Error(`HackUTD API error: ${response.status}`);
        }
        return response.json();
      },
      CACHE_TTL.STATIC
    );
    res.json(couriers);
  } catch (error) {
    console.error('Error fetching couriers:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
