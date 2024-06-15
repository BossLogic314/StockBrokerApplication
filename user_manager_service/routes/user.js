import express from 'express';
import bodyParser from 'body-parser';
import { getUserInformation, getAccessToken } from '../controllers/user.js';

const router = express.Router();
const jsonParser = bodyParser.json();

router.get('/getUserInformation', jsonParser, getUserInformation);
router.get('/getAccessToken', jsonParser, getAccessToken);

export default router;