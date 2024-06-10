import express from 'express';
import bodyParser from 'body-parser';
import { getWatchLists, addStockToWatchList, deleteStockFromWatchList, addWatchList, deleteWatchList } from '../controllers/watchlists.js';

const router = express.Router();

const jsonParser = bodyParser.json();

router.get('/getWatchLists', jsonParser, getWatchLists);
router.post('/addStockToWatchList', jsonParser, addStockToWatchList);
router.post('/deleteStockFromWatchList', jsonParser, deleteStockFromWatchList);
router.post('/addWatchList', jsonParser, addWatchList);
router.post('/deleteWatchList', jsonParser, deleteWatchList);

export default router;