import dotenv from 'dotenv';
import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error('JWT_SECRET is not set in env');

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? '1h';

export interface AppJwtPayload extends JwtPayload {
    userId: string;
    email: string;
}

export const signJWT = (
    payload: AppJwtPayload,
    expiresIn: string | number = JWT_EXPIRES_IN
): string | null => {
    try {
        return jwt.sign(payload, JWT_SECRET, { expiresIn: expiresIn as SignOptions["expiresIn"] });
    } catch (err) {
        console.error('JWT signing failed:', err);
        return null;
    }
};

export const verifyJWT = <T extends JwtPayload = AppJwtPayload>(token: string): T | null => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (typeof decoded === 'string') return null;
        return decoded as T;
    } catch (err) {
        console.error('JWT verification failed:', err);
        return null;
    }
};
