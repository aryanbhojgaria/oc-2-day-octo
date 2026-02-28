import { Router, Request, Response } from "express"
import { PrismaClient } from "@prisma/client"
import { authenticate } from "../middleware/auth"
import { requireRole } from "../middleware/rbac"
import { z } from "zod"

const router = Router()
const prisma = new PrismaClient()

// GET /api/attendance – Role-aware
router.get("/", authenticate, async (req: Request, res: Response) => {
    try {
        if (req.user!.role === "STUDENT") {
            const student = await prisma.student.findFirst({ where: { userId: req.user!.userId } })
            if (!student) { res.status(404).json({ error: "Student profile not found." }); return }
            const records = await prisma.attendanceRecord.findMany({
                where: { studentId: student.id },
                orderBy: { date: "desc" },
            })
            res.json(records)
        } else if (req.user!.role === "TEACHER" || req.user!.role === "ADMIN") {
            const { studentId } = req.query
            const records = await prisma.attendanceRecord.findMany({
                where: studentId ? { studentId: String(studentId) } : undefined,
                include: { student: { select: { name: true, externalId: true } } },
                orderBy: { date: "desc" },
            })
            res.json(records)
        } else {
            res.status(403).json({ error: "Access denied." })
        }
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Internal server error." })
    }
})

// POST /api/attendance – Teacher marks attendance
router.post("/", authenticate, requireRole("TEACHER", "ADMIN"), async (req: Request, res: Response) => {
    try {
        const schema = z.object({
            studentId: z.string(),
            date: z.string(),
            subject: z.string(),
            status: z.enum(["present", "absent"]),
        })
        const data = schema.parse(req.body)
        const record = await prisma.attendanceRecord.create({ data })
        res.status(201).json(record)
    } catch (err) {
        if (err instanceof z.ZodError) {
            res.status(400).json({ error: "Invalid request", details: err.errors })
            return
        }
        console.error(err)
        res.status(500).json({ error: "Internal server error." })
    }
})

// PATCH /api/attendance/:id – Teacher corrects attendance
router.patch("/:id", authenticate, requireRole("TEACHER", "ADMIN"), async (req: Request, res: Response) => {
    try {
        const schema = z.object({ status: z.enum(["present", "absent"]) })
        const { status } = schema.parse(req.body)
        const record = await prisma.attendanceRecord.update({
            where: { id: req.params.id },
            data: { status },
        })
        res.json(record)
    } catch (err) {
        if (err instanceof z.ZodError) {
            res.status(400).json({ error: "Invalid request", details: err.errors })
            return
        }
        console.error(err)
        res.status(500).json({ error: "Internal server error." })
    }
})

export default router
