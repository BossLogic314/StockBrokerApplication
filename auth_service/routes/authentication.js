import express from 'express';
import bodyParser from 'body-parser';
import { getLoginUrl, getAccessTokenInCookie, checkJwtToken } from '../controllers/authentication.js';

const router = express.Router();
const jsonParser = bodyParser.json();

router.get('/getLoginUrl', jsonParser, getLoginUrl);
router.get('/getAccessTokenInCookie', jsonParser, getAccessTokenInCookie);
router.get('/verifyJwtToken', jsonParser, checkJwtToken);

export default router;