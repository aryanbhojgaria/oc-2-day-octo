import { Router, Request, Response } from "express"
import { PrismaClient } from "@prisma/client"
import { authenticate } from "../middleware/auth"
import { requireRole } from "../middleware/rbac"
import { z } from "zod"

const router = Router()
const prisma = new PrismaClient()

// GET /api/marks – Student sees own marks, Teacher/Admin can query with studentId
router.get("/", authenticate, async (req: Request, res: Response) => {
    try {
        if (req.user!.role === "STUDENT") {
            const student = await prisma.student.findFirst({ where: { userId: req.user!.userId } })
            if (!student) { res.status(404).json({ error: "Student profile not found." }); return }
            const marks = await prisma.mark.findMany({ where: { studentId: student.id } })
            res.json(marks)
        } else if (req.user!.role === "TEACHER" || req.user!.role === "ADMIN") {
            const { studentId } = req.query
            const marks = await prisma.mark.findMany({
                where: studentId ? { studentId: String(studentId) } : undefined,
                include: { student: { select: { name: true, externalId: true } } },
            })
            res.json(marks)
        } else {
            res.status(403).json({ error: "Access denied." })
        }
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Internal server error." })
    }
})

// PUT /api/marks/:id – Teacher can update marks
router.put("/:id", authenticate, requireRole("TEACHER", "ADMIN"), async (req: Request, res: Response) => {
    try {
        const schema = z.object({
            internal1: z.number().optional(),
            internal2: z.number().optional(),
            assignment: z.number().optional(),
            total: z.number().optional(),
            grade: z.string().optional(),
        })
        const data = schema.parse(req.body)
        const mark = await prisma.mark.update({ where: { id: req.params.id }, data })
        res.json(mark)
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
