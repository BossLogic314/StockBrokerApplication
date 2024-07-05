import express from 'express';
import express_graphql from 'express-graphql';
import { buildSchema } from 'graphql';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import marketDataRouter from './routes/marketData.js';
import http from "http";
import { connectToOpenSearchService } from './opensearch/connect.js';
import { Server } from 'socket.io';
import { getMarketDataFeed } from './utils/marketDataAPI.js';

const app = express();
const server = http.createServer(app);
const PORT = 8086;

dotenv.config();

// Connecting to the open search service
connectToOpenSearchService();

const io = new Server(server, {
    cors: {
        allowedHeaders: ["*"],
        origin: "*"
    }
});

let keyToSocketMap = {};

io.on('connection', (socket) => {
    console.log('Client connected');

    const key = socket.handshake.query.key;
    keyToSocketMap[key] = socket;

    socket.on('market data', ({accessToken, key, instrumentKeys}) => {
        getMarketDataFeed(accessToken, key, instrumentKeys,
        (
            (data) => {
                socket.emit('market data', data);
            }
        ));
    })
});

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: ["http://localhost:3000"]
}));

app.use('/marketData', marketDataRouter);

server.listen(PORT, (req, res) => {
    console.log(`Server listening on port ${PORT}`);
});