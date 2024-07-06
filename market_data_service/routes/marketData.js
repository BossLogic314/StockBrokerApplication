import express from 'express';
import { getOHLCData, getScrips, getDataInInterval, loadData } from '../controllers/marketData.js';

const router = express.Router();

router.get('/getOHLCData', getOHLCData);
router.get('/getDataInInterval', getDataInInterval);
router.get('/getScrips', getScrips);
router.post('/loadData', loadData);

export default router;