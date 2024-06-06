import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

const app = express();
const PORT = 8086;

dotenv.config();

app.use(express.json());
app.use(cors({
    credentials: true,
    origin: ["http://localhost:3000"]
}));

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});