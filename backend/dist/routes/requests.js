"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const auth_1 = require("../middleware/auth");
const rbac_1 = require("../middleware/rbac");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// GET /api/requests – Admin sees all
router.get("/", auth_1.authenticate, (0, rbac_1.requireRole)("ADMIN"), async (_req, res) => {
    try {
        const requests = await prisma.request.findMany({ orderBy: { date: "desc" } });
        res.json(requests);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error." });
    }
});
// POST /api/requests – Any authenticated user can submit
router.post("/", auth_1.authenticate, async (req, res) => {
    try {
        const schema = zod_1.z.object({
            type: zod_1.z.string().min(1),
            fromName: zod_1.z.string().min(1),
            date: zod_1.z.string(),
            reason: zod_1.z.string().min(1),
        });
        const data = schema.parse(req.body);
        const request = await prisma.request.create({
            data: { ...data, externalId: `REQ${Date.now()}` },
        });
        res.status(201).json(request);
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
// PATCH /api/requests/:id – Admin can approve or reject
router.patch("/:id", auth_1.authenticate, (0, rbac_1.requireRole)("ADMIN"), async (req, res) => {
    try {
        const schema = zod_1.z.object({
            status: zod_1.z.enum(["approved", "rejected", "pending"]),
        });
        const { status } = schema.parse(req.body);
        const request = await prisma.request.update({
            where: { id: req.params.id },
            data: { status },
        });
        res.json(request);
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
// DELETE /api/requests/:id – Admin only
router.delete("/:id", auth_1.authenticate, (0, rbac_1.requireRole)("ADMIN"), async (req, res) => {
    try {
        await prisma.request.delete({ where: { id: req.params.id } });
        res.json({ message: "Request deleted." });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error." });
    }
});
exports.default = router;
//# sourceMappingURL=requests.js.map