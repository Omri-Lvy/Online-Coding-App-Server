import express, { Application, Request, Response } from 'express';
import http from 'http';
import { Server } from 'socket.io';
import {connectDB, disconnectDB} from "./config/db";
import codeBlocksRouter from "./routes/codeBlocksRouter";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app: Application = express();
const server = http.createServer(app);
const io = new Server(server);

connectDB(process.env.ENV as string === 'development' ? 'test' : 'code-blocks');

app.use(express.json());
app.use(cors());

app.use('/code-blocks', codeBlocksRouter);

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('codeChange', (data) => {
        socket.broadcast.emit('codeChange', data);
    });
});

const PORT: string | number = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const shutdown = () => {
    server.close(() => {
        console.log('Server closed');
        disconnectDB();
    });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

export default app;