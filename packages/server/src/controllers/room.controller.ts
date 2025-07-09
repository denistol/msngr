
import { Response } from "express";
import { nameSchema } from "../schemas";
import { AuthRequest } from "../types";
import { messageService } from "../services/message.service";

export const createRoom = async (req: AuthRequest, res: Response): Promise<void> => {
    const name = req.body?.room
    const parse = nameSchema.safeParse(name)

    if (!parse.success) {
        res.status(400).json({ error: parse.error.format() });
        return
    }

    const exists = await messageService.findRoom(name)

    if (exists) {
        res.status(500).json({ error: "Room exists" });
        return
    }

    try {
        const messages = await messageService.createRoom(name);
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: "Failed to create room" });
    }
}

export const getRooms = async (req: AuthRequest, res: Response): Promise<void> => {
    
    try {
        const rooms = await messageService.getRooms();
        res.json(rooms);
    } catch (err) {
        res.status(500).json({ error: "Failed to get rooms" });
    }
}