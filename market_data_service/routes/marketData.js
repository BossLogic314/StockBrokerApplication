import express from 'express';
import { getOHLCData, getScrips, getDataInInterval } from '../controllers/marketData.js';

const router = express.Router();

router.get('/getOHLCData', getOHLCData);
router.get('/getDataInInterval', getDataInInterval);
router.get('/getScrips', getScrips);

export default router;