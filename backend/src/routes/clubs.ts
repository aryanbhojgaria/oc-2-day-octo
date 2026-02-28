import { Router, Request, Response } from "express"
import { PrismaClient } from "@prisma/client"
import { authenticate } from "../middleware/auth"
import { requireRole } from "../middleware/rbac"
import { z } from "zod"

const router = Router()
const prisma = new PrismaClient()

const clubSchema = z.object({
    name: z.string().min(1),
    accent: z.string(),
    members: z.number().default(0),
    description: z.string(),
})

// GET /api/clubs
router.get("/", authenticate, async (_req: Request, res: Response) => {
    try {
        const clubs = await prisma.club.findMany({ orderBy: { name: "asc" } })
        res.json(clubs)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Internal server error." })
    }
})

// GET /api/clubs/:id
router.get("/:id", authenticate, async (req: Request, res: Response) => {
    try {
        const club = await prisma.club.findFirst({
            where: { OR: [{ id: req.params.id }, { externalId: req.params.id }] },
        })
        if (!club) { res.status(404).json({ error: "Club not found." }); return }
        res.json(club)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Internal server error." })
    }
})

// POST /api/clubs – Admin only
router.post("/", authenticate, requireRole("ADMIN"), async (req: Request, res: Response) => {
    try {
        const data = clubSchema.parse(req.body)
        const club = await prisma.club.create({ data: { ...data, externalId: `CLB${Date.now()}` } })
        res.status(201).json(club)
    } catch (err) {
        if (err instanceof z.ZodError) {
            res.status(400).json({ error: "Invalid request", details: err.errors })
            return
        }
        console.error(err)
        res.status(500).json({ error: "Internal server error." })
    }
})

// PUT /api/clubs/:id – Admin only
router.put("/:id", authenticate, requireRole("ADMIN"), async (req: Request, res: Response) => {
    try {
        const data = clubSchema.partial().parse(req.body)
        const club = await prisma.club.update({ where: { id: req.params.id }, data })
        res.json(club)
    } catch (err) {
        if (err instanceof z.ZodError) {
            res.status(400).json({ error: "Invalid request", details: err.errors })
            return
        }
        console.error(err)
        res.status(500).json({ error: "Internal server error." })
    }
})

// DELETE /api/clubs/:id – Admin only
router.delete("/:id", authenticate, requireRole("ADMIN"), async (req: Request, res: Response) => {
    try {
        await prisma.club.delete({ where: { id: req.params.id } })
        res.json({ message: "Club deleted." })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Internal server error." })
    }
})

export default router
