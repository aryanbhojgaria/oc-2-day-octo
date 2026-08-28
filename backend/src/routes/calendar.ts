import { Router } from "express"
import { PrismaClient } from "@prisma/client"

const router = Router()
const prisma = new PrismaClient()

// ─── List Calendar Events ─────────────────────────────────────────
// Returns all official events + personal events for the requesting user
router.get("/", async (req, res) => {
    try {
        const userId = (req.query.userId as string) || null

        const where: any = {}
        if (userId) {
            // Return official events + personal events belonging to this user
            where.OR = [
                { type: { not: "personal" } },
                { type: "personal", userId },
            ]
        } else {
            // Return only official (non-personal) events
            where.type = { not: "personal" }
        }

        const events = await prisma.calendarEvent.findMany({
            where,
            orderBy: { date: "asc" },
        })
        res.json(events)
    } catch (error) {
        console.error("Error fetching calendar events:", error)
        res.status(500).json({ error: "Failed to fetch calendar events" })
    }
})

// ─── Create Calendar Event ────────────────────────────────────────
router.post("/", async (req, res) => {
    try {
        const { title, description, date, endDate, type, color, createdBy, userId } = req.body

        if (!title || !date || !type) {
            return res.status(400).json({ error: "title, date, and type are required" })
        }

        const event = await prisma.calendarEvent.create({
            data: {
                title,
                description: description || "",
                date,
                endDate: endDate || null,
                type,
                color: color || null,
                createdBy: createdBy || "ADMIN",
                userId: userId || null,
            },
        })
        res.status(201).json(event)
    } catch (error) {
        console.error("Error creating calendar event:", error)
        res.status(500).json({ error: "Failed to create calendar event" })
    }
})

// ─── Update Calendar Event ────────────────────────────────────────
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params
        const { title, description, date, endDate, type, color } = req.body

        const event = await prisma.calendarEvent.update({
            where: { id },
            data: {
                ...(title !== undefined && { title }),
                ...(description !== undefined && { description }),
                ...(date !== undefined && { date }),
                ...(endDate !== undefined && { endDate }),
                ...(type !== undefined && { type }),
                ...(color !== undefined && { color }),
            },
        })
        res.json(event)
    } catch (error) {
        console.error("Error updating calendar event:", error)
        res.status(500).json({ error: "Failed to update calendar event" })
    }
})

// ─── Delete Calendar Event ────────────────────────────────────────
router.delete("/:id", async (req, res) => {
    try {
        await prisma.calendarEvent.delete({ where: { id: req.params.id } })
        res.json({ message: "Calendar event deleted" })
    } catch (error) {
        console.error("Error deleting calendar event:", error)
        res.status(500).json({ error: "Failed to delete calendar event" })
    }
})

// ─── Detect Conflicts ────────────────────────────────────────────
// Returns groups of events that overlap on the same date
router.get("/conflicts", async (req, res) => {
    try {
        const userId = (req.query.userId as string) || null

        const where: any = {}
        if (userId) {
            where.OR = [
                { type: { not: "personal" } },
                { type: "personal", userId },
            ]
        }

        const events = await prisma.calendarEvent.findMany({
            where,
            orderBy: { date: "asc" },
        })

        // Group events by date and find dates with > 1 event
        const byDate: Record<string, typeof events> = {}
        for (const event of events) {
            const d = event.date
            if (!byDate[d]) byDate[d] = []
            byDate[d].push(event)

            // If event has an end date, mark all intermediate dates too
            if (event.endDate && event.endDate !== event.date) {
                const start = new Date(event.date)
                const end = new Date(event.endDate)
                const cursor = new Date(start)
                cursor.setDate(cursor.getDate() + 1)
                while (cursor <= end) {
                    const key = cursor.toISOString().split("T")[0]
                    if (!byDate[key]) byDate[key] = []
                    byDate[key].push(event)
                    cursor.setDate(cursor.getDate() + 1)
                }
            }
        }

        const conflicts = Object.entries(byDate)
            .filter(([_, evts]) => evts.length > 1)
            .map(([date, evts]) => ({ date, events: evts }))

        res.json(conflicts)
    } catch (error) {
        console.error("Error detecting conflicts:", error)
        res.status(500).json({ error: "Failed to detect conflicts" })
    }
})

export default router
