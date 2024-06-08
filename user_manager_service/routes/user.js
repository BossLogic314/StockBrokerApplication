import express from 'express';
import bodyParser from 'body-parser';
import { getUserInformation } from '../controllers/user.js';

const router = express.Router();
const jsonParser = bodyParser.json();

router.get('/getUserInformation', jsonParser, getUserInformation);

export default router;