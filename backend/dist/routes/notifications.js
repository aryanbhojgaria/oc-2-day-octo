"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// GET /api/notifications – Current user's notifications
router.get("/", auth_1.authenticate, async (req, res) => {
    try {
        const notifications = await prisma.notification.findMany({
            where: { userId: req.user.userId },
            orderBy: { createdAt: "desc" },
        });
        res.json(notifications);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error." });
    }
});
// PATCH /api/notifications/:id/read – Mark as read
router.patch("/:id/read", auth_1.authenticate, async (req, res) => {
    try {
        const notification = await prisma.notification.update({
            where: { id: req.params.id },
            data: { read: true },
        });
        res.json(notification);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error." });
    }
});
// PATCH /api/notifications/read-all – Mark all as read
router.patch("/read-all", auth_1.authenticate, async (req, res) => {
    try {
        await prisma.notification.updateMany({
            where: { userId: req.user.userId, read: false },
            data: { read: true },
        });
        res.json({ message: "All notifications marked as read." });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error." });
    }
});
exports.default = router;
//# sourceMappingURL=notifications.js.map