import { Router, Request, Response } from "express"
import { PrismaClient } from "@prisma/client"
import { authenticate } from "../middleware/auth"
import { requireRole } from "../middleware/rbac"

const router = Router()
const prisma = new PrismaClient()

// GET /api/teachers
router.get("/", authenticate, async (_req: Request, res: Response) => {
    try {
        const teachers = await prisma.teacher.findMany({
            include: { user: { select: { email: true } } },
            orderBy: { externalId: "asc" },
        })
        res.json(teachers)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Internal server error." })
    }
})

// GET /api/teachers/me – Current teacher's profile
router.get("/me", authenticate, requireRole("TEACHER"), async (req: Request, res: Response) => {
    try {
        const teacher = await prisma.teacher.findFirst({
            where: { userId: req.user!.userId },
            include: { user: { select: { email: true } } },
        })
        if (!teacher) {
            res.status(404).json({ error: "Teacher profile not found." })
            return
        }
        res.json(teacher)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Internal server error." })
    }
})

// GET /api/teachers/:id
router.get("/:id", authenticate, async (req: Request, res: Response) => {
    try {
        const teacher = await prisma.teacher.findFirst({
            where: {
                OR: [{ id: req.params.id }, { externalId: req.params.id }],
            },
            include: { user: { select: { email: true } } },
        })
        if (!teacher) {
            res.status(404).json({ error: "Teacher not found." })
            return
        }
        res.json(teacher)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Internal server error." })
    }
})

export default router
