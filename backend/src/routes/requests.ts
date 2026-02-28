import { Router, Request, Response } from "express"
import { PrismaClient } from "@prisma/client"
import { authenticate } from "../middleware/auth"
import { requireRole } from "../middleware/rbac"
import { z } from "zod"

const router = Router()
const prisma = new PrismaClient()

// GET /api/requests – Admin sees all
router.get("/", authenticate, requireRole("ADMIN"), async (_req: Request, res: Response) => {
    try {
        const requests = await prisma.request.findMany({ orderBy: { date: "desc" } })
        res.json(requests)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Internal server error." })
    }
})

// POST /api/requests – Any authenticated user can submit
router.post("/", authenticate, async (req: Request, res: Response) => {
    try {
        const schema = z.object({
            type: z.string().min(1),
            fromName: z.string().min(1),
            date: z.string(),
            reason: z.string().min(1),
        })
        const data = schema.parse(req.body)
        const request = await prisma.request.create({
            data: { ...data, externalId: `REQ${Date.now()}` },
        })
        res.status(201).json(request)
    } catch (err) {
        if (err instanceof z.ZodError) {
            res.status(400).json({ error: "Invalid request", details: err.errors })
            return
        }
        console.error(err)
        res.status(500).json({ error: "Internal server error." })
    }
})

// PATCH /api/requests/:id – Admin can approve or reject
router.patch("/:id", authenticate, requireRole("ADMIN"), async (req: Request, res: Response) => {
    try {
        const schema = z.object({
            status: z.enum(["approved", "rejected", "pending"]),
        })
        const { status } = schema.parse(req.body)
        const request = await prisma.request.update({
            where: { id: req.params.id },
            data: { status },
        })
        res.json(request)
    } catch (err) {
        if (err instanceof z.ZodError) {
            res.status(400).json({ error: "Invalid request", details: err.errors })
            return
        }
        console.error(err)
        res.status(500).json({ error: "Internal server error." })
    }
})

// DELETE /api/requests/:id – Admin only
router.delete("/:id", authenticate, requireRole("ADMIN"), async (req: Request, res: Response) => {
    try {
        await prisma.request.delete({ where: { id: req.params.id } })
        res.json({ message: "Request deleted." })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Internal server error." })
    }
})

export default router
