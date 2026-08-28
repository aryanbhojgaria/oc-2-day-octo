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
    content: zod_1.z.string().min(1),
    author: zod_1.z.string().min(1),
    date: zod_1.z.string(),
    priority: zod_1.z.enum(["low", "medium", "high"]).default("medium"),
});
// GET /api/announcements – All users can read
router.get("/", auth_1.authenticate, async (_req, res) => {
    try {
        const announcements = await prisma.announcement.findMany({
            orderBy: { date: "desc" },
        });
        res.json(announcements);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error." });
    }
});
// GET /api/announcements/:id
router.get("/:id", auth_1.authenticate, async (req, res) => {
    try {
        const announcement = await prisma.announcement.findFirst({
            where: { OR: [{ id: req.params.id }, { externalId: req.params.id }] },
        });
        if (!announcement) {
            res.status(404).json({ error: "Announcement not found." });
            return;
        }
        res.json(announcement);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error." });
    }
});
// POST /api/announcements – Admin only
router.post("/", auth_1.authenticate, (0, rbac_1.requireRole)("ADMIN"), async (req, res) => {
    try {
        const data = createSchema.parse(req.body);
        const announcement = await prisma.announcement.create({
            data: {
                ...data,
                externalId: `ANN${Date.now()}`,
            },
        });
        res.status(201).json(announcement);
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
// DELETE /api/announcements/:id – Admin only
router.delete("/:id", auth_1.authenticate, (0, rbac_1.requireRole)("ADMIN"), async (req, res) => {
    try {
        await prisma.announcement.delete({ where: { id: req.params.id } });
        res.json({ message: "Announcement deleted." });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error." });
    }
});
exports.default = router;
//# sourceMappingURL=announcements.js.map