import express, { Request, Response } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import database from './config/db';
import { registerPollHandlers } from './socket/pollHandler';
import { getPolls } from './controllers/PollController';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*", // Allow all for now, lock down later
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send('Polling System API is running');
});

app.get('/api/polls', getPolls);

// Socket connection
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Register handlers
    registerPollHandlers(io, socket);

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, async () => {
    console.log(`Server listening on port ${PORT}`);
    await database();
});
