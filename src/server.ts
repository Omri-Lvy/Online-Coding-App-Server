import express, { Application } from 'express';
import http from 'http';
import { Server } from 'socket.io';
import {connectDB, disconnectDB} from "./config/db";
import codeBlocksRouter from "./routes/codeBlocksRouter";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const origin = process.env.ENV === 'development' ? '*' : 'https://code-blocks.vercel.app';

const server: Application = express();
const httpServer = http.createServer(server);
const io = new Server(httpServer, {
    cors: {
        origin: origin,
        methods: ['GET', 'POST'],
    }
});

connectDB("codeblocks");

server.use(express.json());
server.use(cors());

server.use('/code-blocks', codeBlocksRouter);

const userRoles: { [codeBlockId: string]: { mentor?: string, student?: string, watchers?: string[] } } = {};

io.on('connection', (socket) => {
    console.log('a user connected with socket id:', socket.id);

    socket.on('joinCodeBlock', (codeBlockId: string) => {
        console.log(`User ${socket.id} joining code block ${codeBlockId}`);

        if (!userRoles[codeBlockId]) {
            userRoles[codeBlockId] = { watchers: [] };
        }

        if (userRoles[codeBlockId] && !userRoles[codeBlockId].mentor) {
            userRoles[codeBlockId].mentor = socket.id;
            console.log(`User ${socket.id} joined code block ${codeBlockId} as mentor`);
            socket.emit('role', 'mentor');
        } else if (!userRoles[codeBlockId].student) {
            userRoles[codeBlockId].student = socket.id;
            console.log(`User ${socket.id} joined code block ${codeBlockId} as student`);
            socket.emit('role', 'student');
        } else {
            userRoles[codeBlockId].watchers?.push(socket.id);
            console.log(`User ${socket.id} joined code block ${codeBlockId} as watcher`);
            socket.emit('role', 'watcher');
        }

        socket.join(codeBlockId);
    });

    socket.on('codeChange', (data: { codeBlockId: string, code: string }) => {
        socket.to(data.codeBlockId).emit('codeUpdate', data);
    });

    socket.on('leaveCodeBlock', (codeBlockId: string) => {
        if (userRoles[codeBlockId] && userRoles[codeBlockId].mentor === socket.id) {
            console.log(`Mentor ${socket.id} left code block ${codeBlockId}`);
            // Disconnect everyone in the room
            if (userRoles[codeBlockId].student) {
                const studentSocket = io.sockets.sockets.get(userRoles[codeBlockId].student);
                if (studentSocket) {
                    console.log(`Disconnecting student ${userRoles[codeBlockId].student}`);
                    studentSocket.disconnect(true);
                }
            }
            if (userRoles[codeBlockId].watchers) {
                userRoles[codeBlockId].watchers.forEach((watcherId) => {
                    const watcherSocket = io.sockets.sockets.get(watcherId);
                    if (watcherSocket) {
                        console.log(`Disconnecting watcher ${watcherId}`);
                        watcherSocket.disconnect(true);
                    }
                });
            }
            // Clean up all roles
            delete userRoles[codeBlockId];
        } else if (userRoles[codeBlockId] && userRoles[codeBlockId].student === socket.id) {
            console.log(`Student ${socket.id} left code block ${codeBlockId}`);
            delete userRoles[codeBlockId].student;
        } else if (userRoles[codeBlockId] && userRoles[codeBlockId].watchers?.includes(socket.id)) {
            console.log(`Watcher ${socket.id} left code block ${codeBlockId}`);
            userRoles[codeBlockId].watchers = userRoles[codeBlockId].watchers?.filter(watcherId => watcherId !== socket.id);
        }
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
        for (const codeBlockId in userRoles) {
            if (userRoles[codeBlockId].mentor === socket.id) {
                console.log(`Mentor ${socket.id} disconnected`);
                // Disconnect everyone in the room
                if (userRoles[codeBlockId].student) {
                    const studentSocket = io.sockets.sockets.get(userRoles[codeBlockId].student);
                    if (studentSocket) {
                        console.log(`Disconnecting student ${userRoles[codeBlockId].student}`);
                        studentSocket.disconnect(true);
                    }
                }
                if (userRoles[codeBlockId].watchers) {
                    userRoles[codeBlockId].watchers.forEach((watcherId) => {
                        const watcherSocket = io.sockets.sockets.get(watcherId);
                        if (watcherSocket) {
                            console.log(`Disconnecting watcher ${watcherId}`);
                            watcherSocket.disconnect(true);
                        }
                    });
                }
                // Clean up all roles
                delete userRoles[codeBlockId];
            } else if (userRoles[codeBlockId].student === socket.id) {
                console.log(`Student ${socket.id} disconnected`);
                delete userRoles[codeBlockId].student;
            } else if (userRoles[codeBlockId].watchers?.includes(socket.id)) {
                console.log(`Watcher ${socket.id} disconnected`);
                userRoles[codeBlockId].watchers = userRoles[codeBlockId].watchers?.filter(watcherId => watcherId !== socket.id);
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

export default server;
export { httpServer };
