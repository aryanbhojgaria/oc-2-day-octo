"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const auth_1 = require("../middleware/auth");
const rbac_1 = require("../middleware/rbac");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// GET /api/attendance – Role-aware
router.get("/", auth_1.authenticate, async (req, res) => {
    try {
        if (req.user.role === "STUDENT") {
            const student = await prisma.student.findFirst({ where: { userId: req.user.userId } });
            if (!student) {
                res.status(404).json({ error: "Student profile not found." });
                return;
            }
            const records = await prisma.attendanceRecord.findMany({
                where: { studentId: student.id },
                orderBy: { date: "desc" },
            });
            res.json(records);
        }
        else if (req.user.role === "TEACHER" || req.user.role === "ADMIN") {
            const { studentId } = req.query;
            const records = await prisma.attendanceRecord.findMany({
                where: studentId ? { studentId: String(studentId) } : undefined,
                include: { student: { select: { name: true, externalId: true } } },
                orderBy: { date: "desc" },
            });
            res.json(records);
        }
        else {
            res.status(403).json({ error: "Access denied." });
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error." });
    }
});
// POST /api/attendance – Teacher marks attendance
router.post("/", auth_1.authenticate, (0, rbac_1.requireRole)("TEACHER", "ADMIN"), async (req, res) => {
    try {
        const schema = zod_1.z.object({
            studentId: zod_1.z.string(),
            date: zod_1.z.string(),
            subject: zod_1.z.string(),
            status: zod_1.z.enum(["present", "absent"]),
        });
        const data = schema.parse(req.body);
        const record = await prisma.attendanceRecord.create({ data });
        res.status(201).json(record);
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
// PATCH /api/attendance/:id – Teacher corrects attendance
router.patch("/:id", auth_1.authenticate, (0, rbac_1.requireRole)("TEACHER", "ADMIN"), async (req, res) => {
    try {
        const schema = zod_1.z.object({ status: zod_1.z.enum(["present", "absent"]) });
        const { status } = schema.parse(req.body);
        const record = await prisma.attendanceRecord.update({
            where: { id: req.params.id },
            data: { status },
        });
        res.json(record);
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
exports.default = router;
//# sourceMappingURL=attendance.js.map