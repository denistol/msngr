import { Router } from "express";
import {
    sendMessage,
    getUserMessages,
    getRoomMessages
} from "../controllers/message.controller";

const router = Router();

router.post("/", sendMessage);
router.get("/user", getUserMessages);
router.get("/room", getRoomMessages);

export default router;
