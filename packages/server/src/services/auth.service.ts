import { Request } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from 'bcrypt';
import { UserModel, type IUser } from "../models/user.model";

interface AuthPayload extends JwtPayload {
    id: string
    email: string
}

export class AuthService {
    private readonly key: string;

    constructor() {
        const secret = process.env.SECRET_KEY;
        if (!secret) {
            throw new Error("JWT secret is not defined in environment variables.");
        }
        this.key = secret;
    }

    generate(payload: IUser) {
        return jwt.sign(payload, this.key, { expiresIn: '7d' });
    }

    validateToken(token: string) {
        const payload = jwt.verify(token, this.key) as AuthPayload;
        return { ...payload, token }
    }

    validate(req: Request): AuthPayload | null {
        const authHeader = req.headers.authorization || "";
        const match = authHeader.match(/^Bearer\s+(.+)$/);

        if (!match) return null;

        const token = match[1];

        try {
            return this.validateToken(token)
        } catch {
            return null;
        }

    }

    async login(props: { email: string; password: string }): Promise<{ token: string; user: IUser }> {
        const { email, password } = props;

        const user = await UserModel.findOne({ email });
        if (!user) {
            throw new Error("User not found");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error("Invalid credentials");
        }

        const token = this.generate(user.toObject());

        return { token, user };
    }

    async register({ email, password }: { email: string, password: string }) {

        const existing = await UserModel.findOne({ email });

        if (existing) throw new Error("User already exists");

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new UserModel({ email, password: hashedPassword });

        return await user.save();
    }
}

export const authService = new AuthService()