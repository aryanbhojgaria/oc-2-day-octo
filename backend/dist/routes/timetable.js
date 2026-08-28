"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// GET /api/timetable – returns timetable based on user role
router.get("/", auth_1.authenticate, async (req, res) => {
    try {
        const role = req.user.role.toLowerCase();
        // Map role to timetable type (student or teacher)
        const timetableRole = role === "student" ? "student" : role === "teacher" ? "teacher" : "student";
        const rows = await prisma.timetable.findMany({
            where: { role: timetableRole },
            orderBy: { day: "asc" },
        });
        // Parse slots JSON string back into array
        const timetable = rows.map((r) => ({ ...r, slots: JSON.parse(r.slots) }));
        res.json(timetable);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error." });
    }
});
// GET /api/timetable/:role – explicit role
router.get("/:role", auth_1.authenticate, async (req, res) => {
    try {
        const rows = await prisma.timetable.findMany({
            where: { role: req.params.role.toLowerCase() },
            orderBy: { day: "asc" },
        });
        const timetable = rows.map((r) => ({ ...r, slots: JSON.parse(r.slots) }));
        res.json(timetable);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error." });
    }
});
exports.default = router;
//# sourceMappingURL=timetable.js.map