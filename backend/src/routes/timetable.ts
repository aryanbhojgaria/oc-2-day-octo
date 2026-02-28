import { Router, Request, Response } from "express"
import { PrismaClient } from "@prisma/client"
import { authenticate } from "../middleware/auth"

const router = Router()
const prisma = new PrismaClient()

// GET /api/timetable – returns timetable based on user role
router.get("/", authenticate, async (req: Request, res: Response) => {
    try {
        const role = req.user!.role.toLowerCase()
        // Map role to timetable type (student or teacher)
        const timetableRole = role === "student" ? "student" : role === "teacher" ? "teacher" : "student"

        const rows = await prisma.timetable.findMany({
            where: { role: timetableRole },
            orderBy: { day: "asc" },
        })
        // Parse slots JSON string back into array
        const timetable = rows.map((r: { id: string; role: string; day: string; slots: string; createdAt: Date }) => ({ ...r, slots: JSON.parse(r.slots) }))
        res.json(timetable)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Internal server error." })
    }
})

// GET /api/timetable/:role – explicit role
router.get("/:role", authenticate, async (req: Request, res: Response) => {
    try {
        const rows = await prisma.timetable.findMany({
            where: { role: req.params.role.toLowerCase() },
            orderBy: { day: "asc" },
        })
        const timetable = rows.map((r: any) => ({ ...r, slots: JSON.parse(r.slots) }))
        res.json(timetable)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Internal server error." })
    }
})

export default router
