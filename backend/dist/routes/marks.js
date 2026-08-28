"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const auth_1 = require("../middleware/auth");
const rbac_1 = require("../middleware/rbac");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// GET /api/marks – Student sees own marks, Teacher/Admin can query with studentId
router.get("/", auth_1.authenticate, async (req, res) => {
    try {
        if (req.user.role === "STUDENT") {
            const student = await prisma.student.findFirst({ where: { userId: req.user.userId } });
            if (!student) {
                res.status(404).json({ error: "Student profile not found." });
                return;
            }
            const marks = await prisma.mark.findMany({ where: { studentId: student.id } });
            res.json(marks);
        }
        else if (req.user.role === "TEACHER" || req.user.role === "ADMIN") {
            const { studentId } = req.query;
            const marks = await prisma.mark.findMany({
                where: studentId ? { studentId: String(studentId) } : undefined,
                include: { student: { select: { name: true, externalId: true } } },
            });
            res.json(marks);
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
// PUT /api/marks/:id – Teacher can update marks
router.put("/:id", auth_1.authenticate, (0, rbac_1.requireRole)("TEACHER", "ADMIN"), async (req, res) => {
    try {
        const schema = zod_1.z.object({
            internal1: zod_1.z.number().optional(),
            internal2: zod_1.z.number().optional(),
            assignment: zod_1.z.number().optional(),
            total: zod_1.z.number().optional(),
            grade: zod_1.z.string().optional(),
        });
        const data = schema.parse(req.body);
        const mark = await prisma.mark.update({ where: { id: req.params.id }, data });
        res.json(mark);
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
//# sourceMappingURL=marks.js.map