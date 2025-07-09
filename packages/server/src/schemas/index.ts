import { z } from "zod";
import { MessageType } from "../services/message.service";


const emailSchema = z
  .string()
  .trim()
  .min(1, "Email is required")
  .email("Invalid email format");

const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters long")
  .max(100, "Password is too long");

const authSchema = z.object({
  email: emailSchema,
  password: passwordSchema
});

const baseMessageSchema = z.object({
  senderId: z.string().min(1, "senderId is required"),
  text: z.string().min(1, "Text is required"),
  type: z.nativeEnum(MessageType),
});

const userMessageSchema = baseMessageSchema.extend({
  type: z.literal(MessageType.USER),
  toId: z.string().min(1, "receiverId (toId) is required"),
});

const roomMessageSchema = baseMessageSchema.extend({
  type: z.literal(MessageType.ROOM),
  toId: z.string().min(1, "room (toId) is required"),
});

const nameSchema = z.string().min(1, "Name is required");

const sendMessageSchema = z.object({
    toId: z.string().length(24, "Invalid toId"),
    text: z.string().min(1, "Message text is required"),
    type: z.nativeEnum(MessageType),
});

const messageSchema = z.union([userMessageSchema, roomMessageSchema]);

export { messageSchema, authSchema, nameSchema, sendMessageSchema };