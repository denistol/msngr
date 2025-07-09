import { Router } from "express";
import {
    sendMessage,
    getUserMessages,
    getRoomMessages
} from "../controllers/message.controller";

const router = Router();

router.post("/", sendMessage);
router.get("/user", getUserMessages); // query: user
router.get("/room", getRoomMessages); // query: room

export default router;
