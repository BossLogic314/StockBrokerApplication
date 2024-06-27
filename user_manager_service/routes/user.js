import express from 'express';
import bodyParser from 'body-parser';
import { getUserInformation, getAccessToken, getOrderBook, getHoldings, getFundsAndMargin } from '../controllers/user.js';

const router = express.Router();
const jsonParser = bodyParser.json();

router.get('/getUserInformation', jsonParser, getUserInformation);
router.get('/getAccessToken', jsonParser, getAccessToken);
router.get('/getOrderBook', jsonParser, getOrderBook);
router.get('/getHoldings', jsonParser, getHoldings);
router.get('/getFundsAndMargin', jsonParser, getFundsAndMargin);

export default router;