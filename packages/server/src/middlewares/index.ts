import { Socket } from "socket.io";
import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import { AuthRequest } from "../types";

const authService = new AuthService();


export const authMiddlewareSocket = (socket: Socket, next: (err?: any) => void) => {
  let token = socket.handshake.auth.token as string | undefined;

  if (!token) {
    return next(new Error("Authentication error: token missing"));
  }

  if (token.startsWith("Bearer ")) {
    token = token.substring(7);
  }

  const payload = authService.validateToken(token);

  if (!payload || !payload.id) {
    return next(new Error("Authentication error: invalid token payload"));
  }

  socket.data.userId = payload.id;
  socket.data.email = payload.email;

  next();
};


export const authMiddlewareExpress = (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  let token = req.headers.authorization;

  if (!token || typeof token !== "string") {
    res.status(401).json({ message: "Authentication error: token missing" });
    return;
  }

  if (token.startsWith("Bearer ")) {
    token = token.substring(7);
  }

  const payload = authService.validateToken(token);

  if (!payload || !payload.id) {
    res.status(401).json({ message: "Authentication error: invalid token payload" });
    return;
  }

  (req as unknown as AuthRequest).user = {
    id: payload.id,
    email: payload.email,
  };

  next();
};