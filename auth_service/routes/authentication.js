import express from 'express';
import bodyParser from 'body-parser';
import { getLoginUrl, getAccessTokenInCookie, checkJwtToken, logoutUser } from '../controllers/authentication.js';

const router = express.Router();
const jsonParser = bodyParser.json();

router.get('/getLoginUrl', jsonParser, getLoginUrl);
router.post('/logout', jsonParser, logoutUser);
router.get('/getAccessTokenInCookie', jsonParser, getAccessTokenInCookie);
router.post('/checkJwtToken', jsonParser, checkJwtToken);

export default router;