import { NextFunction, Request, Response } from "express";
import { AppJwtPayload, verify } from "../utils/jwt";
import prisma from "../../prisma/client";

export interface AuthedRequest extends Request {
    user?: { id: string }
}

export const requireAuth = (req: AuthedRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies?.token;
        console.log({token})
        if (!token) return res.status(401).json({ message: 'No token provided' });

        const decoded = verify(token) as { userId: string };
        req.user = { id: decoded.userId };

        next();
    } catch (err) {
        console.error('Auth error:', err);
        res.status(401).json({ message: 'Unauthorized' });
    }
};