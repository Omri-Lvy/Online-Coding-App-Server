import express, { Application, Request, Response } from 'express';
import http from 'http';
import { Server } from 'socket.io';
import {connectDB, disconnectDB} from "./config/db";
import codeBlocksRouter from "./routes/codeBlocksRouter";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const origin = process.env.ENV === 'development' ? '*' : 'https://code-blocks.vercel.app';

const app: Application = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: origin,
        methods: ['GET', 'POST'],
    }
});

connectDB("codeblocks");

app.use(express.json());
app.use(cors());

app.use('/code-blocks', codeBlocksRouter);

const userRoles: { [codeBlockId: string]: { mentor?: string, student?: string } } = {};

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('joinCodeBlock', (codeBlockId: string) => {
        if (!userRoles[codeBlockId]) {
            userRoles[codeBlockId] = {};
        }

        if (!userRoles[codeBlockId].mentor) {
            userRoles[codeBlockId].mentor = socket.id;
            socket.emit('role', 'mentor');
        } else if (!userRoles[codeBlockId].student) {
            userRoles[codeBlockId].student = socket.id;
            socket.emit('role', 'student');
        } else {
            socket.emit('role', 'full');
            return;
        }

        socket.join(codeBlockId);
        console.log(`User ${socket.id} joined code block ${codeBlockId} as ${userRoles[codeBlockId].mentor === socket.id ? 'mentor' : 'student'}`);
    });

    socket.on('codeChange', (data: { codeBlockId: string, code: string }) => {
        socket.to(data.codeBlockId).emit('codeUpdate', data);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
        for (const codeBlockId in userRoles) {
            if (userRoles[codeBlockId].mentor === socket.id) {
                console.log(`Mentor ${socket.id} left code block ${codeBlockId}`)
                delete userRoles[codeBlockId].mentor; // Clean up the mentor role
                if (userRoles[codeBlockId].student) {
                    const studentSocket = io.sockets.sockets.get(userRoles[codeBlockId].student);
                    if (studentSocket) {
                        console.log(`Disconnecting student ${userRoles[codeBlockId].student}`)
                        studentSocket.disconnect(true); // Disconnect user if mentor leaves
                        delete userRoles[codeBlockId].student; // Clean up the student role
                    }
                }
            } else if (userRoles[codeBlockId].student === socket.id) {
                console.log(`Student ${socket.id} left code block ${codeBlockId}`)
                const studentSocket = io.sockets.sockets.get(userRoles[codeBlockId].student);
                delete userRoles[codeBlockId].student;
                studentSocket?.disconnect(true); // Disconnect user if student leaves
            }
        }
    });
});

const PORT: string | number = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'test') {
    httpServer.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}


const shutdown = () => {
    return new Promise((resolve, reject) => {
        io.close(() => {
            if (httpServer.listening) {
                httpServer.close((err) => {
                    if (err) {
                        console.error('Error closing the server:', err);
                        reject(err);
                        return;
                    }
                    disconnectDB().then(resolve).catch(reject);
                    console.log('Server and DB connections closed');
                });
            }
        });
    });
};

process.on('SIGINT', () => shutdown().then(() => process.exit()));
process.on('SIGTERM', () => shutdown().then(() => process.exit()));

export default app;
export { httpServer };
