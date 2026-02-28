import "dotenv/config"
import express from "express"
import cors from "cors"
import authRouter from "./routes/auth"
import studentsRouter from "./routes/students"
import teachersRouter from "./routes/teachers"
import announcementsRouter from "./routes/announcements"
import eventsRouter from "./routes/events"
import requestsRouter from "./routes/requests"
import feesRouter from "./routes/fees"
import marksRouter from "./routes/marks"
import attendanceRouter from "./routes/attendance"
import clubsRouter from "./routes/clubs"
import timetableRouter from "./routes/timetable"
import notificationsRouter from "./routes/notifications"

const app = express()
const PORT = process.env.PORT || 4000

// ─── Middleware ───────────────────────────────────────────────────
app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ─── Health Check ─────────────────────────────────────────────────
app.get("/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString(), service: "OctoCampus API" })
})

// ─── API Routes ───────────────────────────────────────────────────
app.use("/api/auth", authRouter)
app.use("/api/students", studentsRouter)
app.use("/api/teachers", teachersRouter)
app.use("/api/announcements", announcementsRouter)
app.use("/api/events", eventsRouter)
app.use("/api/requests", requestsRouter)
app.use("/api/fees", feesRouter)
app.use("/api/marks", marksRouter)
app.use("/api/attendance", attendanceRouter)
app.use("/api/clubs", clubsRouter)
app.use("/api/timetable", timetableRouter)
app.use("/api/notifications", notificationsRouter)

// ─── 404 Handler ──────────────────────────────────────────────────
app.use((_req, res) => {
    res.status(404).json({ error: "Route not found." })
})

// ─── Global Error Handler ─────────────────────────────────────────
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error("Unhandled error:", err)
    res.status(500).json({ error: "Internal server error." })
})

// ─── Start ────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`\n🐙 OctoCampus API running on http://localhost:${PORT}`)
    console.log(`   Health: http://localhost:${PORT}/health`)
    console.log(`   Auth:   http://localhost:${PORT}/api/auth/login\n`)
})

export default app
