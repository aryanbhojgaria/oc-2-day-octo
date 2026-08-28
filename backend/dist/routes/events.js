"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const auth_1 = require("../middleware/auth");
const rbac_1 = require("../middleware/rbac");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
const createSchema = zod_1.z.object({
    title: zod_1.z.string().min(1),
    club: zod_1.z.string().min(1),
    date: zod_1.z.string(),
    description: zod_1.z.string().min(1),
    status: zod_1.z.enum(["upcoming", "past", "ongoing"]).default("upcoming"),
    registrations: zod_1.z.number().default(0),
});
const updateSchema = createSchema.partial().extend({
    registrations: zod_1.z.number().optional(),
});
// GET /api/events
router.get("/", auth_1.authenticate, async (_req, res) => {
    try {
        const events = await prisma.event.findMany({ orderBy: { date: "asc" } });
        res.json(events);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error." });
    }
});
// GET /api/events/:id
router.get("/:id", auth_1.authenticate, async (req, res) => {
    try {
        const event = await prisma.event.findFirst({
            where: { OR: [{ id: req.params.id }, { externalId: req.params.id }] },
        });
        if (!event) {
            res.status(404).json({ error: "Event not found." });
            return;
        }
        res.json(event);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error." });
    }
});
// POST /api/events – Admin or Club
router.post("/", auth_1.authenticate, (0, rbac_1.requireRole)("ADMIN", "CLUB"), async (req, res) => {
    try {
        const data = createSchema.parse(req.body);
        const event = await prisma.event.create({
            data: { ...data, externalId: `EVT${Date.now()}` },
        });
        res.status(201).json(event);
    }
    catch (err) {
        if (err instanceof zod_1.z.ZodError) {
            res.status(400).json({ error: "Invalid request", details: err.errors });
            return;
        }
        console.error(err);
        res.status(500).json({ error: "Internal server error." });
    }
});
// PUT /api/events/:id – Admin or Club
router.put("/:id", auth_1.authenticate, (0, rbac_1.requireRole)("ADMIN", "CLUB"), async (req, res) => {
    try {
        const data = updateSchema.parse(req.body);
        const event = await prisma.event.update({ where: { id: req.params.id }, data });
        res.json(event);
    }
    catch (err) {
        if (err instanceof zod_1.z.ZodError) {
            res.status(400).json({ error: "Invalid request", details: err.errors });
            return;
        }
        console.error(err);
        res.status(500).json({ error: "Internal server error." });
    }
});
// DELETE /api/events/:id – Admin only
router.delete("/:id", auth_1.authenticate, (0, rbac_1.requireRole)("ADMIN"), async (req, res) => {
    try {
        await prisma.event.delete({ where: { id: req.params.id } });
        res.json({ message: "Event deleted." });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error." });
    }
});
exports.default = router;
//# sourceMappingURL=events.js.map