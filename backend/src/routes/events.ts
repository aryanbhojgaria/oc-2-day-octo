import { Router, Request, Response } from "express"
import { PrismaClient } from "@prisma/client"
import { authenticate } from "../middleware/auth"
import { requireRole } from "../middleware/rbac"
import { z } from "zod"

const router = Router()
const prisma = new PrismaClient()

const createSchema = z.object({
    title: z.string().min(1),
    club: z.string().min(1),
    date: z.string(),
    description: z.string().min(1),
    status: z.enum(["upcoming", "past", "ongoing"]).default("upcoming"),
    registrations: z.number().default(0),
})

const updateSchema = createSchema.partial().extend({
    registrations: z.number().optional(),
})

// GET /api/events
router.get("/", authenticate, async (_req: Request, res: Response) => {
    try {
        const events = await prisma.event.findMany({ orderBy: { date: "asc" } })
        res.json(events)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Internal server error." })
    }
})

// GET /api/events/:id
router.get("/:id", authenticate, async (req: Request, res: Response) => {
    try {
        const event = await prisma.event.findFirst({
            where: { OR: [{ id: req.params.id }, { externalId: req.params.id }] },
        })
        if (!event) {
            res.status(404).json({ error: "Event not found." })
            return
        }
        res.json(event)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Internal server error." })
    }
})

// POST /api/events – Admin or Club
router.post("/", authenticate, requireRole("ADMIN", "CLUB"), async (req: Request, res: Response) => {
    try {
        const data = createSchema.parse(req.body)
        const event = await prisma.event.create({
            data: { ...data, externalId: `EVT${Date.now()}` },
        })
        res.status(201).json(event)
    } catch (err) {
        if (err instanceof z.ZodError) {
            res.status(400).json({ error: "Invalid request", details: err.errors })
            return
        }
        console.error(err)
        res.status(500).json({ error: "Internal server error." })
    }
})

// PUT /api/events/:id – Admin or Club
router.put("/:id", authenticate, requireRole("ADMIN", "CLUB"), async (req: Request, res: Response) => {
    try {
        const data = updateSchema.parse(req.body)
        const event = await prisma.event.update({ where: { id: req.params.id }, data })
        res.json(event)
    } catch (err) {
        if (err instanceof z.ZodError) {
            res.status(400).json({ error: "Invalid request", details: err.errors })
            return
        }
        console.error(err)
        res.status(500).json({ error: "Internal server error." })
    }
})

// DELETE /api/events/:id – Admin only
router.delete("/:id", authenticate, requireRole("ADMIN"), async (req: Request, res: Response) => {
    try {
        await prisma.event.delete({ where: { id: req.params.id } })
        res.json({ message: "Event deleted." })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Internal server error." })
    }
})

export default router
