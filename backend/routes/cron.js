import express from 'express';

import { sql } from '../db/index.js';
import { applySeed } from '../db/seed.js';

const router = express.Router();

// Nightly Vercel Cron: restores the seed data so the public demo stays clean.
// Vercel sends `Authorization: Bearer $CRON_SECRET`; without the secret this
// endpoint refuses every request.
router.get('/reset', async (req, res, next) => {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.get('authorization') !== `Bearer ${secret}`) {
    return res.status(401).json({ message: 'Unauthorized.' });
  }
  try {
    await applySeed(sql, { reset: true });
    res.json({ message: 'Demo data reset.' });
  } catch (error) {
    next(error);
  }
});

export default router;
