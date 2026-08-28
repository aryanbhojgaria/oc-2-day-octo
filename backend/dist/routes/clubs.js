"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const auth_1 = require("../middleware/auth");
const rbac_1 = require("../middleware/rbac");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
const clubSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    accent: zod_1.z.string(),
    members: zod_1.z.number().default(0),
    description: zod_1.z.string(),
});
// GET /api/clubs
router.get("/", auth_1.authenticate, async (_req, res) => {
    try {
        const clubs = await prisma.club.findMany({ orderBy: { name: "asc" } });
        res.json(clubs);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error." });
    }
});
// GET /api/clubs/:id
router.get("/:id", auth_1.authenticate, async (req, res) => {
    try {
        const club = await prisma.club.findFirst({
            where: { OR: [{ id: req.params.id }, { externalId: req.params.id }] },
        });
        if (!club) {
            res.status(404).json({ error: "Club not found." });
            return;
        }
        res.json(club);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error." });
    }
});
// POST /api/clubs – Admin only
router.post("/", auth_1.authenticate, (0, rbac_1.requireRole)("ADMIN"), async (req, res) => {
    try {
        const data = clubSchema.parse(req.body);
        const club = await prisma.club.create({ data: { ...data, externalId: `CLB${Date.now()}` } });
        res.status(201).json(club);
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
// PUT /api/clubs/:id – Admin only
router.put("/:id", auth_1.authenticate, (0, rbac_1.requireRole)("ADMIN"), async (req, res) => {
    try {
        const data = clubSchema.partial().parse(req.body);
        const club = await prisma.club.update({ where: { id: req.params.id }, data });
        res.json(club);
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
// DELETE /api/clubs/:id – Admin only
router.delete("/:id", auth_1.authenticate, (0, rbac_1.requireRole)("ADMIN"), async (req, res) => {
    try {
        await prisma.club.delete({ where: { id: req.params.id } });
        res.json({ message: "Club deleted." });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error." });
    }
});
exports.default = router;
//# sourceMappingURL=clubs.js.map