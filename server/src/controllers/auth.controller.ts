import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { compare, hashPassword } from '../utils/password';
import { signJWT } from '../utils/jwt';
import prisma from '../prisma/client';

export const register = async (req: Request, res: Response) => {
    try {
        // 1️⃣ Validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password, name } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and Password are required' });
        }

        // 2️⃣ Check if user exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }

        // 3️⃣ Hash password (ensure it's string)
        const hashed = await hashPassword(password);
        if (!hashed) {
            throw new Error('Password hashing failed');
        }

        // 4️⃣ Create user
        const user = await prisma.user.create({
            data: {
                email,
                password: hashed,
                name,
            },
            select: { id: true, email: true, name: true, createdAt: true, password: true },
        });

        // 5️⃣ Sign JWT (ensure token is not null)
        const token = signJWT({ email: user.email, userId: user.id });
        if (!token) {
            throw new Error('JWT generation failed');
        }

        // 6️⃣ Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 1000, // 1 hour
        });

        return res.status(201).json({ user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


export const login = async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { email, password } = req.body
        if (!email || !password) return res.status(400).send({ message: "Email and Password are required" })

        const user = await prisma.user.findUnique({
            where: { email }
        })
        if (!user) return res.status(401).json({ message: "Invalid credentials" })

        const valid = await compare(password, user.password);
        if (!valid) return res.status(401).json({ message: "Invalid credentials" });

        const token = signJWT({ userId: user.id, email: user.email })
        const safeUser = { id: user.id, email: user.email, name: user.name, createdAt: user.createdAt };
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 1000,
        });
        res.json({ message: 'Logged in successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }

}


export const logout = (req: Request, res: Response) => {
    try {
        // Clear the JWT cookie
        res.clearCookie("token", {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
        });

        return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Logout error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};