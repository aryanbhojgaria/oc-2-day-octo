"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const auth_1 = require("../middleware/auth");
const rbac_1 = require("../middleware/rbac");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// GET /api/students – Admin or Teacher can list all students
router.get("/", auth_1.authenticate, (0, rbac_1.requireRole)("ADMIN", "TEACHER"), async (_req, res) => {
    try {
        const students = await prisma.student.findMany({
            include: { user: { select: { email: true } } },
            orderBy: { externalId: "asc" },
        });
        res.json(students);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error." });
    }
});
// GET /api/students/me – Current student's own profile
router.get("/me", auth_1.authenticate, (0, rbac_1.requireRole)("STUDENT"), async (req, res) => {
    try {
        const student = await prisma.student.findFirst({
            where: { userId: req.user.userId },
            include: {
                marks: true,
                attendanceRecords: true,
                user: { select: { email: true } },
            },
        });
        if (!student) {
            res.status(404).json({ error: "Student profile not found." });
            return;
        }
        res.json(student);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error." });
    }
});
// GET /api/students/:id – Single student
router.get("/:id", auth_1.authenticate, (0, rbac_1.requireRole)("ADMIN", "TEACHER"), async (req, res) => {
    try {
        const student = await prisma.student.findFirst({
            where: {
                OR: [{ id: req.params.id }, { externalId: req.params.id }],
            },
            include: {
                marks: true,
                attendanceRecords: true,
                user: { select: { email: true } },
            },
        });
        if (!student) {
            res.status(404).json({ error: "Student not found." });
            return;
        }
        res.json(student);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error." });
    }
});
// PUT /api/students/:id – Update student (Admin only)
router.put("/:id", auth_1.authenticate, (0, rbac_1.requireRole)("ADMIN"), async (req, res) => {
    try {
        const { name, department, year, hostel, attendance, cgpa, photo } = req.body;
        const student = await prisma.student.update({
            where: { id: req.params.id },
            data: { name, department, year, hostel, attendance, cgpa, photo },
        });
        res.json(student);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error." });
    }
});
exports.default = router;
//# sourceMappingURL=students.js.map