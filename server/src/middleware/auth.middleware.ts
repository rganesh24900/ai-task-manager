import { NextFunction, Request, Response } from "express";
import { AppJwtPayload, verify } from "../utils/jwt";
import prisma from "../../prisma/client";

export interface AuthedRequest extends Request {
    user?: { id: string, email: string }
}

export const requireAuth = async (req: AuthedRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith("Bearer ")) return res.status(401).json({ message: "Unauthorized" });
        const token = authHeader.split(" ")[1]
        const payload = verify<AppJwtPayload>(token);
        const user = await prisma.user.findUnique({ where: { id: payload?.userId } });
        if (!user) return res.status(401).json({ message: "Unauthorized" })
        req.user = { id: user.id, email: user.email }
        return next();
    } catch (error) {
        console.error(error)
        return res.status(401).json({ message: "Invalid or expired token" })
    }
}