import express from 'express';
import express_graphql from 'express-graphql';
import { buildSchema } from 'graphql';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import marketDataRouter from './routes/marketData.js';
import { connectToOpenSearchService } from './opensearch/connect.js';

const app = express();
const PORT = 8086;

dotenv.config();

// Connecting to the open search service
connectToOpenSearchService();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: ["http://localhost:3000"]
}));

app.use('/marketData', marketDataRouter);

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});