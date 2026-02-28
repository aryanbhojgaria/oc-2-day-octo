import { Router, Request, Response } from "express"
import { PrismaClient } from "@prisma/client"
import { authenticate } from "../middleware/auth"
import { requireRole } from "../middleware/rbac"
import { z } from "zod"

const router = Router()
const prisma = new PrismaClient()

const createSchema = z.object({
    title: z.string().min(1),
    content: z.string().min(1),
    author: z.string().min(1),
    date: z.string(),
    priority: z.enum(["low", "medium", "high"]).default("medium"),
})

// GET /api/announcements – All users can read
router.get("/", authenticate, async (_req: Request, res: Response) => {
    try {
        const announcements = await prisma.announcement.findMany({
            orderBy: { date: "desc" },
        })
        res.json(announcements)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Internal server error." })
    }
})

// GET /api/announcements/:id
router.get("/:id", authenticate, async (req: Request, res: Response) => {
    try {
        const announcement = await prisma.announcement.findFirst({
            where: { OR: [{ id: req.params.id }, { externalId: req.params.id }] },
        })
        if (!announcement) {
            res.status(404).json({ error: "Announcement not found." })
            return
        }
        res.json(announcement)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Internal server error." })
    }
})

// POST /api/announcements – Admin only
router.post("/", authenticate, requireRole("ADMIN"), async (req: Request, res: Response) => {
    try {
        const data = createSchema.parse(req.body)
        const announcement = await prisma.announcement.create({
            data: {
                ...data,
                externalId: `ANN${Date.now()}`,
            },
        })
        res.status(201).json(announcement)
    } catch (err) {
        if (err instanceof z.ZodError) {
            res.status(400).json({ error: "Invalid request", details: err.errors })
            return
        }
        console.error(err)
        res.status(500).json({ error: "Internal server error." })
    }
})

// DELETE /api/announcements/:id – Admin only
router.delete("/:id", authenticate, requireRole("ADMIN"), async (req: Request, res: Response) => {
    try {
        await prisma.announcement.delete({ where: { id: req.params.id } })
        res.json({ message: "Announcement deleted." })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Internal server error." })
    }
})

export default router
