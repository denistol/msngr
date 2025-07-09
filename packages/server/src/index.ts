import express from "express";
import cors from 'cors';
import http from "http";
import { Server } from "socket.io";
import authRouter from './routers/auth.router'
import messageRouter from './routers/message.router'
import roomRouter from './routers/room.router'
import { SocketService } from "./services/socket.service";
import { connectDB } from "./db";
import { authMiddlewareSocket, authMiddlewareExpress } from "./middlewares";

const port = Number(process.env.PORT_SERVER);
const host = '0.0.0.0'
const origins = [
    `http://${host}:${process.env.PORT_CLIENT}`,
    `http://localhost:${process.env.PORT_CLIENT}`
]

if (!port) {
    throw new Error('Server port not found!');
}

const app = express();
const server = http.createServer(app);

app.use(cors({
  origin: origins,
  credentials: true,
}));

app.use(express.json());

app.use('/auth/', authRouter);
app.use('/message', authMiddlewareExpress, messageRouter);
app.use('/room', authMiddlewareExpress, roomRouter);

async function startServer() {
  try {
    await connectDB();

    const io = new Server(server, { cors: { origin: origins } });
    io.use(authMiddlewareSocket);

    const socketService = new SocketService(io);
    socketService.init();

    server.listen(port, host, () => {
      console.info(`Server is running on ${host}:${port}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
}

startServer();
