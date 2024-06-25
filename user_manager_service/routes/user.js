import express from 'express';
import bodyParser from 'body-parser';
import { getUserInformation, getAccessToken, getOrderBook, getHoldings } from '../controllers/user.js';

const router = express.Router();
const jsonParser = bodyParser.json();

router.get('/getUserInformation', jsonParser, getUserInformation);
router.get('/getAccessToken', jsonParser, getAccessToken);
router.get('/getOrderBook', jsonParser, getOrderBook);
router.get('/getHoldings', jsonParser, getHoldings);

export default router;