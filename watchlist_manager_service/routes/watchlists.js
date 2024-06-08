import express from 'express';
import bodyParser from 'body-parser';
import { getWatchLists } from '../controllers/watchlists.js';

const router = express.Router();

const jsonParser = bodyParser.json();

router.get('/getWatchLists', jsonParser, getWatchLists);

export default router;