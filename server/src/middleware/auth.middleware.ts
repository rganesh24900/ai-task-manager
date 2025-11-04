import { NextFunction, Request, Response } from "express";
import { AppJwtPayload, verify } from "../utils/jwt";
import prisma from "../../prisma/client";

export interface AuthedRequest extends Request {
    user?: { id: string }
}

export const requireAuth = async (req: AuthedRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies?.token;

        if (!token) return res.status(401).json({ message: "No token provided" });

        const decoded = verify(token) as { userId: string };

        // 🔍 Verify user exists in DB
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true },
        });

        if (!user) {
            return res.status(401).json({ message: "User not found (invalid or deleted)" });
        }

        req.user = { id: user.id };
        next();
    } catch (err) {
        console.error("Auth error:", err);
        res.status(401).json({ message: "Unauthorized" });
    }
};
