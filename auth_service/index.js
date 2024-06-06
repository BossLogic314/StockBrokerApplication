import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import loginRouter from './routes/login.js';

const app = express();
const PORT = 8085;

dotenv.config();

app.use(express.json());
app.use(cors({
    credentials: true,
    origin: ["http://localhost:3000"]
}));
app.use('/login', loginRouter);

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});