import { Router } from "express";
import { createRoom, getRooms } from "../controllers/room.controller"

const router = Router();

router.get("/", getRooms);
router.post("/", createRoom);

export default router;
