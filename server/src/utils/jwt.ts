import dotEnv from 'dotenv'
import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken'

dotEnv.config();

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN: SignOptions['expiresIn'] = process.env.JWT_EXPIRES_IN ?? "1h";

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not set in env')
}

export interface AppJwtPayload extends JwtPayload {
    userId: string
    email: string
}

export const signJWT = (payload: AppJwtPayload, expiresIn = JWT_EXPIRES_IN): string | null => {
    try {
        const options: SignOptions = { expiresIn }
        return jwt.sign(payload, JWT_SECRET, options)
    } catch (error) {
        console.error("JWT verification failed:", error);
        return null
    }
}

export const verify = <T extends JwtPayload = AppJwtPayload>(token: string): T | null => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (typeof decoded === "string") return null; // unlikely, but safe guard
        return decoded as T;
    } catch (err) {
        console.error("JWT verification failed:", err);
        return null;
    }
}