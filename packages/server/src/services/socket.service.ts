import { Server, Socket } from "socket.io";
import { messageService, MessageType } from "../services/message.service";
import { loggerService } from "./logger.service";
import { uniqBy } from "../utils";

export enum SocketEventType {
  CONNECTION = "connection",
  DISCONNECT = "disconnect",
  CONNECT_ERROR = "connect_error",
  USERS = "users",
  PRIVATE_MESSAGE = "private-message",
  ROOM_MESSAGE = "room-message",
  JOIN = "join",
  ME = "me",
}

interface PrivateMessagePayload {
  to: { userId: string; socketId: string };
  message: string;
}

interface RoomMessagePayload {
  room: { id: string; name: string };
  message: string;
}

export class SocketService {
  private readonly messageService = messageService;
  private readonly logger = loggerService;

  constructor(private readonly io: Server) { }

  public init() {
    this.io.on(SocketEventType.CONNECTION, (socket) => {
      const senderId = socket.data.userId as string;
      const email = socket.data.email as string;

      this.logger.info(`Client connected: ${socket.id}, Sender ID: ${senderId}`);

      socket.emit(SocketEventType.ME, { socketId: socket.id, userId: senderId, email });

      this.setupHandlers(socket);
      this.broadcastUsers();
    });
  }

  private setupHandlers(socket: Socket) {
    this.handleJoin(socket);
    this.handlePrivateMessage(socket);
    this.handleRoomMessage(socket);
    this.handleDisconnect(socket);
  }

private getSocketUserData(socket: Socket) {
  return {
    userId: socket.data.userId as string,
    email: socket.data.email as string,
    socketId: socket.id,
  };
}

  private broadcastUsers() {
    const users = Array.from(this.io.sockets.sockets.values()).map((socket) => (this.getSocketUserData(socket)));
    this.io.emit(SocketEventType.USERS, users);
  }

  private handleJoin(socket: Socket) {
    socket.on(SocketEventType.JOIN, (roomId: string) => {
      socket.join(roomId);
      this.logger.info(`User ${socket.id} joined room ${roomId}`);
    });
  }

  private handlePrivateMessage(socket: Socket) {
    socket.on(SocketEventType.PRIVATE_MESSAGE, async (data: PrivateMessagePayload) => {
      const socketUserData = this.getSocketUserData(socket)

      if (!socketUserData.userId) {
        return this.logger.error("User not authenticated in socket");
      }
      this.io.to(data.to.socketId).emit(SocketEventType.PRIVATE_MESSAGE, { from: socketUserData, message: data.message });

      try {
        await this.messageService.send({
          senderId: socketUserData.userId,
          toId: data.to.userId,
          text: data.message,
          type: MessageType.USER,
        });
      } catch (err) {
        this.logger.error("Failed to save private message");
      }
    });
  }

  private handleRoomMessage(socket: Socket) {
    socket.on(SocketEventType.ROOM_MESSAGE, async (data: RoomMessagePayload) => {

      const socketUserData = this.getSocketUserData(socket)

      if (!socketUserData.userId) {
        return this.logger.error("User not authenticated in socket");
      }

      socket.to(data.room.id).emit(SocketEventType.ROOM_MESSAGE, { from: socketUserData, message: data.message });

      try {
        await this.messageService.send({
          senderId: socketUserData.userId,
          toId: data.room.id,
          text: data.message,
          type: MessageType.ROOM,
        });
      } catch (err) {
        this.logger.error("Failed to save room message");
      }
    });
  }

  private handleDisconnect(socket: Socket) {
    socket.on(SocketEventType.DISCONNECT, () => {
      this.logger.info(`Client disconnected: ${socket.id}`);
    });
  }
}
