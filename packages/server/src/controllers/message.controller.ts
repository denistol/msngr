import { Response } from "express";
import { messageService } from "../services/message.service";
import { AuthRequest } from "../types";
import { Types } from "mongoose";
import { sendMessageSchema } from "../schemas";

export const sendMessage = async (req: AuthRequest, res: Response): Promise<void> => {
    const parse = sendMessageSchema.safeParse(req.body);

    if (!parse.success) {
        res.status(400).json({ error: parse.error.format() });
        return
    }

    try {
        const msg = await messageService.send({
            senderId: req.user.id,
            text: parse.data.text,
            toId: parse.data.toId,
            type: parse.data.type
        });
        res.status(201).json(msg);
    } catch (err) {
        res.status(500).json({ error: "Failed to send message" });
    }
};

export const getUserMessages = async (req: AuthRequest & { query: { user: string } }, res: Response): Promise<void> => {
    const currentUserId = req.user.id;
    const targetUserId = req.query.user
    const isValid = Types.ObjectId.isValid(targetUserId)

    if (!isValid ) {
        res.status(400).json({ error: "Invalid ID" });
        return
    }
    try {
        const messages = await messageService.getMessagesWithUser([currentUserId, targetUserId]);
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: "Failed to get user messages" });
    }
}

export const getRoomMessages = async (req: AuthRequest & { query: { room: string } }, res: Response): Promise<void> => {
    const roomId = req.query.room;
    if (!roomId) {
        res.status(400).json({ error: "Invalid room ID" });
        return
    }

    try {
        const messages = await messageService.getRoomMessages(roomId);
        res.json(messages);
    } catch(err) {
        res.status(500).json({ error: "Failed to get room messages" });
    }
}

