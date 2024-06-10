import express from 'express';
import { getOHLCData, getScrips } from '../controllers/marketData.js';

const router = express.Router();

router.get('/getOHLCData', getOHLCData);
router.get('/getScrips', getScrips);

export default router;