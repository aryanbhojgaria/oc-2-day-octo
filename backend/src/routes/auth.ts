import { Router, Request, Response } from "express"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { z } from "zod"
import { authenticate } from "../middleware/auth"

const router = Router()
const prisma = new PrismaClient()

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
})

// POST /api/auth/login
router.post("/login", async (req: Request, res: Response) => {
    try {
        const { email, password } = loginSchema.parse(req.body)

        const user = await prisma.user.findUnique({ where: { email } })
        if (!user) {
            res.status(401).json({ error: "Invalid email or password." })
            return
        }

        const valid = await bcrypt.compare(password, user.passwordHash)
        if (!valid) {
            res.status(401).json({ error: "Invalid email or password." })
            return
        }

        const token = jwt.sign(
            { userId: user.id, role: user.role, email: user.email },
            process.env.JWT_SECRET!,
            { expiresIn: "7d" }
        )

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
            },
        })
    } catch (err) {
        if (err instanceof z.ZodError) {
            res.status(400).json({ error: "Invalid request", details: err.errors })
            return
        }
        console.error(err)
        res.status(500).json({ error: "Internal server error." })
    }
})

// GET /api/auth/me
router.get("/me", authenticate, async (req: Request, res: Response) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user!.userId },
            select: { id: true, email: true, role: true, createdAt: true },
        })

        if (!user) {
            res.status(404).json({ error: "User not found." })
            return
        }

        res.json(user)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Internal server error." })
    }
})

export default router
