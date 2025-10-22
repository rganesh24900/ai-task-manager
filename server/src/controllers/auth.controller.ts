import { Request, Response } from "express"
import prisma from "../../prisma/client"
import { compare, hashPassword } from "../utils/password"
import { signJWT } from "../utils/jwt"
import { validationResult } from "express-validator"


export const register = async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { email, password, name } = req.body

        if (!email || !password) return res.status(400).send({ message: "Email and Password are required" })

        const existingUser = await prisma.user.findUnique({ where: { email } })
        if (existingUser) return res.status(409).send({ message: "User already exists" })

        const hashed = await hashPassword(password);
        const user = await prisma.user.create({
            data: {
                email,
                password: hashed,
                name
            }
            , select: { name: true, password: true, email: true, createdAt: true, id: true }
        })
        const token = signJWT({ email: user.email, userId: user.id })
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 1000, // 1 hour
        });
        return res.status(201).send({ user })


    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

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