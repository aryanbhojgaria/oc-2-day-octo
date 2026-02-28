import { Router, Request, Response } from "express"
import { PrismaClient } from "@prisma/client"
import { authenticate } from "../middleware/auth"

const router = Router()
const prisma = new PrismaClient()

// GET /api/notifications – Current user's notifications
router.get("/", authenticate, async (req: Request, res: Response) => {
    try {
        const notifications = await prisma.notification.findMany({
            where: { userId: req.user!.userId },
            orderBy: { createdAt: "desc" },
        })
        res.json(notifications)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Internal server error." })
    }
})

// PATCH /api/notifications/:id/read – Mark as read
router.patch("/:id/read", authenticate, async (req: Request, res: Response) => {
    try {
        const notification = await prisma.notification.update({
            where: { id: req.params.id },
            data: { read: true },
        })
        res.json(notification)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Internal server error." })
    }
})

// PATCH /api/notifications/read-all – Mark all as read
router.patch("/read-all", authenticate, async (req: Request, res: Response) => {
    try {
        await prisma.notification.updateMany({
            where: { userId: req.user!.userId, read: false },
            data: { read: true },
        })
        res.json({ message: "All notifications marked as read." })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Internal server error." })
    }
})

export default router
