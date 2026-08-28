"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const auth_1 = require("../middleware/auth");
const rbac_1 = require("../middleware/rbac");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// GET /api/teachers
router.get("/", auth_1.authenticate, async (_req, res) => {
    try {
        const teachers = await prisma.teacher.findMany({
            include: { user: { select: { email: true } } },
            orderBy: { externalId: "asc" },
        });
        res.json(teachers);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error." });
    }
});
// GET /api/teachers/me – Current teacher's profile
router.get("/me", auth_1.authenticate, (0, rbac_1.requireRole)("TEACHER"), async (req, res) => {
    try {
        const teacher = await prisma.teacher.findFirst({
            where: { userId: req.user.userId },
            include: { user: { select: { email: true } } },
        });
        if (!teacher) {
            res.status(404).json({ error: "Teacher profile not found." });
            return;
        }
        res.json(teacher);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error." });
    }
});
// GET /api/teachers/:id
router.get("/:id", auth_1.authenticate, async (req, res) => {
    try {
        const teacher = await prisma.teacher.findFirst({
            where: {
                OR: [{ id: req.params.id }, { externalId: req.params.id }],
            },
            include: { user: { select: { email: true } } },
        });
        if (!teacher) {
            res.status(404).json({ error: "Teacher not found." });
            return;
        }
        res.json(teacher);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error." });
    }
});
exports.default = router;
//# sourceMappingURL=teachers.js.map