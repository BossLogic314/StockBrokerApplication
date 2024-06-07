import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import loginRouter from './routes/authentication.js';

const app = express();
const PORT = 8085;

dotenv.config();

app.use(cors({
    credentials: true,
    origin: ["http://localhost:3000"]
}));
app.use(express.json());
app.use(cookieParser());
app.use('/auth', loginRouter);

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});