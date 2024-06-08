import express from 'express';
import { getOHLCData } from '../controllers/marketData.js';

const router = express.Router();

router.get('/getOHLCData', getOHLCData);

export default router;