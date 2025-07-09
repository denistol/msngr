import { getToken } from "@/lib/utils";
import { io, Socket } from "socket.io-client";

export enum SocketEventType {
    CONNECT = "connect",
    DISCONNECT = "disconnect",
    CONNECT_ERROR = "connect_error",
    USERS = "users",
    PRIVATE_MESSAGE = "private-message",
    ROOM_MESSAGE = "room-message",
    JOIN = "join",
    ME = "me",
}

type PrivateMessagePayload = { from: SocketUser; message: string };
type RoomMessagePayload = { room: string; message: string, from: SocketUser };
type ConnectSocketProps = {
    token?: string;
    onConnect: (socketId: string) => void;
    onError: () => void;
    onUsers: (users: SocketUser[]) => void;
    onDisconnect: () => void;
    onPrivateMessage: (data: PrivateMessagePayload) => void;
    onRoomMessage: (data: RoomMessagePayload) => void;
    onMe: (data: SocketUser) => void;
};

const IS_DEV = process.env.NODE_ENV === 'development'
const TRANSPORTS = ['websocket']

export class SocketClient {
    private readonly baseUrl: string;
    private socket: Socket | null = null;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    connect(props: ConnectSocketProps): Socket {
        if (this.socket) return this.socket;

        const {
            token,
            onConnect,
            onError,
            onUsers,
            onDisconnect,
            onPrivateMessage,
            onRoomMessage,
            onMe
        } = props;

        this.socket = io(this.baseUrl, {
            transports: TRANSPORTS,
            auth: { token: token || getToken() },
            withCredentials: true,
            autoConnect: true,
        });

        this.socket.on(SocketEventType.CONNECT, () => {
            if (this.socket?.id) onConnect(this.socket.id);
        });
        this.socket.on(SocketEventType.DISCONNECT, onDisconnect);
        this.socket.on(SocketEventType.CONNECT_ERROR, onError);
        this.socket.on(SocketEventType.USERS, onUsers);
        this.socket.on(SocketEventType.PRIVATE_MESSAGE, onPrivateMessage);
        this.socket.on(SocketEventType.ROOM_MESSAGE, onRoomMessage);
        this.socket.on(SocketEventType.ME, onMe);

        return this.socket;
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    getSocket(): Socket {
        if (!this.socket) throw new Error("Socket not connected.");
        return this.socket;
    }

    joinRoom(room: Room) {
        this.getSocket().emit(SocketEventType.JOIN, room.id, (status: string) => {
        });
    }

    privateMessage(to: SocketUser, message: string) {
        this.getSocket().emit(SocketEventType.PRIVATE_MESSAGE, { to, message });
    }

    roomMessage(room: Room, message: string) {
        this.getSocket().emit(SocketEventType.ROOM_MESSAGE, { room, message });
    }

    offAllListeners() {
        const socket = this.getSocket();
        socket.off(SocketEventType.PRIVATE_MESSAGE);
        socket.off(SocketEventType.ROOM_MESSAGE);
    }
}

export const socketClient = new SocketClient(
    IS_DEV ?
        process.env.NEXT_PUBLIC_API_HOST_DEV! :
        process.env.NEXT_PUBLIC_API_HOST_PROD!
);
