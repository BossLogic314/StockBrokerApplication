import express from 'express';
import bodyParser from 'body-parser';
import { getLoginUrl, getAccessTokenInCookie } from '../controllers/login.js';

const router = express.Router();
const jsonParser = bodyParser.json();

router.get('/getLoginUrl', jsonParser, getLoginUrl);
router.get('/getAccessTokenInCookie', jsonParser, getAccessTokenInCookie);

export default router;