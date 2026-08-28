"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_1 = __importDefault(require("./routes/auth"));
const students_1 = __importDefault(require("./routes/students"));
const teachers_1 = __importDefault(require("./routes/teachers"));
const announcements_1 = __importDefault(require("./routes/announcements"));
const events_1 = __importDefault(require("./routes/events"));
const requests_1 = __importDefault(require("./routes/requests"));
const fees_1 = __importDefault(require("./routes/fees"));
const marks_1 = __importDefault(require("./routes/marks"));
const attendance_1 = __importDefault(require("./routes/attendance"));
const clubs_1 = __importDefault(require("./routes/clubs"));
const timetable_1 = __importDefault(require("./routes/timetable"));
const notifications_1 = __importDefault(require("./routes/notifications"));
const app = (0, express_1.default)();
const PORT = process.env.PORT_BACKEND || 4000;
// ─── Middleware ───────────────────────────────────────────────────
app.use((0, cors_1.default)({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// ─── Health Check ─────────────────────────────────────────────────
app.get("/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString(), service: "OctoCampus API" });
});
// ─── API Routes ───────────────────────────────────────────────────
app.use("/api/auth", auth_1.default);
app.use("/api/students", students_1.default);
app.use("/api/teachers", teachers_1.default);
app.use("/api/announcements", announcements_1.default);
app.use("/api/events", events_1.default);
app.use("/api/requests", requests_1.default);
app.use("/api/fees", fees_1.default);
app.use("/api/marks", marks_1.default);
app.use("/api/attendance", attendance_1.default);
app.use("/api/clubs", clubs_1.default);
app.use("/api/timetable", timetable_1.default);
app.use("/api/notifications", notifications_1.default);
// ─── 404 Handler ──────────────────────────────────────────────────
app.use((_req, res) => {
    res.status(404).json({ error: "Route not found." });
});
// ─── Global Error Handler ─────────────────────────────────────────
app.use((err, _req, res, _next) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ error: "Internal server error." });
});
// ─── Start ────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`\n🐙 OctoCampus API running on http://localhost:${PORT}`);
    console.log(`   Health: http://localhost:${PORT}/health`);
    console.log(`   Auth:   http://localhost:${PORT}/api/auth/login\n`);
});
exports.default = app;
//# sourceMappingURL=index.js.map