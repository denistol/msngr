import { IRoom, RoomModel } from "../models/room.model";
import { MessageModel, IMessage } from "../models/message.model";
import { toObjectId } from "../utils";

export enum MessageType {
    ROOM = 'ROOM',
    USER = 'USER'
}

interface SendMessageParams {
    senderId: string;
    toId: string;
    text: string;
    type: MessageType;
}

class MessageService {
    async send({ senderId, toId, text, type }: SendMessageParams) {

        return MessageModel.create({
            sender: toObjectId(senderId),
            text,
            room: type === MessageType.ROOM ? toObjectId(toId) : undefined,
            receiver: type === MessageType.USER ? toObjectId(toId) : undefined,
        });
    }

    async getMessagesWithUser(users: string[]): Promise<IMessage[]> {
        const currentUser = toObjectId(users[0])
        const targetUser = toObjectId(users[1])

        const messages = await MessageModel.find({
            $or: [
                { sender: currentUser, receiver: targetUser },
                { sender: targetUser, receiver: currentUser },
            ],
        })
            .populate(["sender", "receiver", "room"])
            .sort({ createdAt: 1 })
        return messages
    }

    async getRoomMessages(room: string): Promise<IMessage[]> {
        const messages = await MessageModel.find({ room: toObjectId(room) })
        .populate(["sender", "receiver", "room"]).sort({ createdAt: 1 })
        return messages
    }

    async findRoom(name: string): Promise<IRoom | undefined> {
        return RoomModel.findOne({ name })
    }
    async getRooms(): Promise<IRoom[]> {
        return RoomModel.find()
    }

    async createRoom(name: string): Promise<IRoom | undefined> {
        return RoomModel.create({ name });
    }
}

export const messageService = new MessageService()