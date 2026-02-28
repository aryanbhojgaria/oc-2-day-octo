import { Router, Request, Response } from "express"
import { PrismaClient } from "@prisma/client"
import { authenticate } from "../middleware/auth"
import { requireRole } from "../middleware/rbac"

const router = Router()
const prisma = new PrismaClient()

// GET /api/students – Admin or Teacher can list all students
router.get("/", authenticate, requireRole("ADMIN", "TEACHER"), async (_req: Request, res: Response) => {
    try {
        const students = await prisma.student.findMany({
            include: { user: { select: { email: true } } },
            orderBy: { externalId: "asc" },
        })
        res.json(students)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Internal server error." })
    }
})

// GET /api/students/me – Current student's own profile
router.get("/me", authenticate, requireRole("STUDENT"), async (req: Request, res: Response) => {
    try {
        const student = await prisma.student.findFirst({
            where: { userId: req.user!.userId },
            include: {
                marks: true,
                attendanceRecords: true,
                user: { select: { email: true } },
            },
        })

        if (!student) {
            res.status(404).json({ error: "Student profile not found." })
            return
        }

        res.json(student)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Internal server error." })
    }
})

// GET /api/students/:id – Single student
router.get("/:id", authenticate, requireRole("ADMIN", "TEACHER"), async (req: Request, res: Response) => {
    try {
        const student = await prisma.student.findFirst({
            where: {
                OR: [{ id: req.params.id }, { externalId: req.params.id }],
            },
            include: {
                marks: true,
                attendanceRecords: true,
                user: { select: { email: true } },
            },
        })

        if (!student) {
            res.status(404).json({ error: "Student not found." })
            return
        }

        res.json(student)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Internal server error." })
    }
})

// PUT /api/students/:id – Update student (Admin only)
router.put("/:id", authenticate, requireRole("ADMIN"), async (req: Request, res: Response) => {
    try {
        const { name, department, year, hostel, attendance, cgpa, photo } = req.body
        const student = await prisma.student.update({
            where: { id: req.params.id },
            data: { name, department, year, hostel, attendance, cgpa, photo },
        })
        res.json(student)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Internal server error." })
    }
})

export default router
