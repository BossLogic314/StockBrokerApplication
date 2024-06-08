import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectToDb from './db/connect.js';
import watchListsRouter from './routes/watchlists.js';

const app = express();
const PORT = 8087;

dotenv.config();

// Connecting to the open search service
connectToDb();

app.use(cors({
	credentials: true,
    origin: ["http://localhost:3000"]
}));
app.use(express.json());
app.use(cookieParser());

app.use('/watchLists', watchListsRouter);

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});