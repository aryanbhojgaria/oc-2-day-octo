import { Router, Request, Response } from "express"
import { PrismaClient } from "@prisma/client"
import { authenticate } from "../middleware/auth"
import { requireRole } from "../middleware/rbac"

const router = Router()
const prisma = new PrismaClient()

// GET /api/fees – Student sees their own fees
router.get("/", authenticate, requireRole("STUDENT", "PARENT"), async (req: Request, res: Response) => {
    try {
        const fees = await prisma.fee.findMany({
            where: { userId: req.user!.userId },
            orderBy: { dueDate: "asc" },
        })
        res.json(fees)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Internal server error." })
    }
})

// GET /api/fees/all – Admin sees all fees
router.get("/all", authenticate, requireRole("ADMIN"), async (_req: Request, res: Response) => {
    try {
        const fees = await prisma.fee.findMany({
            include: { user: { select: { email: true, role: true } } },
            orderBy: { dueDate: "asc" },
        })
        res.json(fees)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Internal server error." })
    }
})

// PATCH /api/fees/:id/pay – Student can mark as paid
router.patch("/:id/pay", authenticate, requireRole("STUDENT"), async (req: Request, res: Response) => {
    try {
        const fee = await prisma.fee.findFirst({
            where: { id: req.params.id, userId: req.user!.userId },
        })
        if (!fee) {
            res.status(404).json({ error: "Fee not found." })
            return
        }
        const updated = await prisma.fee.update({
            where: { id: req.params.id },
            data: { status: "paid" },
        })
        res.json(updated)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Internal server error." })
    }
})

export default router
