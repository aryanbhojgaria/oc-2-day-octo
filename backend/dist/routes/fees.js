"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const auth_1 = require("../middleware/auth");
const rbac_1 = require("../middleware/rbac");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// GET /api/fees – Student sees their own fees
router.get("/", auth_1.authenticate, (0, rbac_1.requireRole)("STUDENT", "PARENT"), async (req, res) => {
    try {
        const fees = await prisma.fee.findMany({
            where: { userId: req.user.userId },
            orderBy: { dueDate: "asc" },
        });
        res.json(fees);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error." });
    }
});
// GET /api/fees/all – Admin sees all fees
router.get("/all", auth_1.authenticate, (0, rbac_1.requireRole)("ADMIN"), async (_req, res) => {
    try {
        const fees = await prisma.fee.findMany({
            include: { user: { select: { email: true, role: true } } },
            orderBy: { dueDate: "asc" },
        });
        res.json(fees);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error." });
    }
});
// PATCH /api/fees/:id/pay – Student can mark as paid
router.patch("/:id/pay", auth_1.authenticate, (0, rbac_1.requireRole)("STUDENT"), async (req, res) => {
    try {
        const fee = await prisma.fee.findFirst({
            where: { id: req.params.id, userId: req.user.userId },
        });
        if (!fee) {
            res.status(404).json({ error: "Fee not found." });
            return;
        }
        const updated = await prisma.fee.update({
            where: { id: req.params.id },
            data: { status: "paid" },
        });
        res.json(updated);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error." });
    }
});
exports.default = router;
//# sourceMappingURL=fees.js.map