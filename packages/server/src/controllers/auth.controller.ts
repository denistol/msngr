import type { NextFunction, Request, Response } from "express";
import { authSchema } from "../schemas";
import { authService } from "../services/auth.service";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const parsed = authSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({ message: "Invalid input", errors: parsed.error.errors });
      return;
    }

    const { email, password } = parsed.data;

    const user = await authService.register({ email, password });

    res.status(201).json({
      message: "User registered successfully",
      user: { email: user.email },
    });
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({ message: err.message });
      return;
    }
    next(err);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const parsed = authSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({ message: "Invalid input", errors: parsed.error.errors });
      return;
    }

    const { email, password } = parsed.data;

    const { token, user } = await authService.login({ email, password });
    
    res.json({
      message: "Login successful",
      data: {token, user}
    });

  } catch (err) {
    if (err instanceof Error) {
      res.status(401).json({ message: err.message });
      return;
    }
    next(err);
  }
};
