"use client"

import { useState } from "react"
import { DashboardShell } from "@/components/layout/dashboard-shell"
import { adminStats, enrollmentTrend, departmentDistribution } from "@/lib/mock-data"
import { useAnnouncementsWithMutations, useRequests, DataLoading } from "@/lib/hooks"
import { Megaphone, FileCheck, CalendarDays, Settings, Users, GraduationCap, Building2, Palette, Check, X, Clock, TrendingUp, ImagePlus, Upload } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { StudentLeaderboard } from "@/components/student-leaderboard"

const navItems = [
  { label: "Overview", href: "/dashboard/admin", icon: Building2 },
  { label: "Announcements", href: "/dashboard/admin", icon: Megaphone },
  { label: "Requests", href: "/dashboard/admin", icon: FileCheck },
  { label: "Calendar", href: "/dashboard/admin", icon: CalendarDays },
  { label: "Settings", href: "/dashboard/admin", icon: Settings },
]

const statCards = [
  { label: "Total Students", value: adminStats.totalStudents.toLocaleString(), icon: GraduationCap, change: "+120 this semester" },
  { label: "Total Teachers", value: adminStats.totalTeachers.toString(), icon: Users, change: "+8 new hires" },
  { label: "Departments", value: adminStats.totalDepartments.toString(), icon: Building2, change: "All active" },
  { label: "Active Clubs", value: adminStats.activeClubs.toString(), icon: Palette, change: "2 events this week" },
]

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-xl">
        <p className="text-xs font-semibold text-foreground">{label}</p>
        <p className="text-xs text-primary">{payload[0].value.toLocaleString()} students</p>
      </div>
    )
  }
  return null
}

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [announcementTitle, setAnnouncementTitle] = useState("")
  const [announcementContent, setAnnouncementContent] = useState("")
  const [announcementPhoto, setAnnouncementPhoto] = useState<string | null>(null)
  const [publishing, setPublishing] = useState(false)

  // ── Live data ──────────────────────────────────────────────────
  const annHook = useAnnouncementsWithMutations()
  const reqHook = useRequests()

  const liveAnnouncements = annHook.data ?? []
  const liveRequests = reqHook.data ?? []

  const handlePublish = async () => {
    if (!announcementTitle.trim()) return
    setPublishing(true)
    try {
      await annHook.create({
        title: announcementTitle,
        content: announcementContent,
        author: "Admin",
        date: new Date().toISOString().split("T")[0],
        priority: "medium",
      })
    } finally {
      setAnnouncementTitle("")
      setAnnouncementContent("")
      setAnnouncementPhoto(null)
      setPublishing(false)
    }
  }

  return (
    <DashboardShell role="admin" navItems={navItems} activeNav={activeTab} onNavClick={setActiveTab}>
      {/* Overview */}
      {activeTab === "overview" && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {statCards.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="rounded-xl border border-border bg-card p-5"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <stat.icon className="h-4 w-4 text-primary" />
                </div>
                <p className="mt-2 text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{stat.change}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="mt-6 grid gap-6 lg:grid-cols-2"
          >
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-semibold text-foreground">Enrollment Trend</h2>
                  <p className="text-xs text-muted-foreground">Student enrollment over 6 months</p>
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-1">
                  <TrendingUp className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">+12.4%</span>
                </div>
              </div>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={enrollmentTrend} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="enrollGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="oklch(0.55 0.22 25)" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="oklch(0.55 0.22 25)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="oklch(0.3 0.01 0 / 0.15)" strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "oklch(0.65 0 0)" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "oklch(0.65 0 0)" }} axisLine={false} tickLine={false} domain={["dataMin - 50", "dataMax + 50"]} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="students" stroke="oklch(0.55 0.22 25)" strokeWidth={2.5} fill="url(#enrollGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-5">
              <div className="mb-4">
                <h2 className="text-base font-semibold text-foreground">Department Distribution</h2>
                <p className="text-xs text-muted-foreground">Students per department</p>
              </div>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={departmentDistribution} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid stroke="oklch(0.3 0.01 0 / 0.15)" strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="department" tick={{ fontSize: 11, fill: "oklch(0.65 0 0)" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "oklch(0.65 0 0)" }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="students" fill="oklch(0.55 0.22 25)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>

          <div className="mt-6">
            <StudentLeaderboard />
          </div>
        </>
      )}

      {/* Announcements Tab */}
      {activeTab === "announcements" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-foreground">Recent Announcements</h2>
              {annHook.loading && <span className="text-xs text-muted-foreground animate-pulse">Loading…</span>}
              {annHook.data && <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{liveAnnouncements.length} total</span>}
            </div>

            {annHook.loading ? (
              <DataLoading rows={3} />
            ) : (
              <div className="space-y-3">
                {liveAnnouncements.slice(0, 6).map((ann) => (
                  <div key={ann.id} className="flex items-start gap-3 rounded-lg border border-border bg-secondary/30 p-3">
                    <div className={cn(
                      "mt-0.5 h-2 w-2 shrink-0 rounded-full",
                      ann.priority === "high" ? "bg-primary pulse-red" : ann.priority === "medium" ? "bg-primary/60" : "bg-muted-foreground/40"
                    )} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{ann.title}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{ann.content}</p>
                      <div className="mt-1.5 flex items-center gap-2">
                        <span className="text-xs text-muted-foreground/60">{ann.author}</span>
                        <span className="text-xs text-muted-foreground/40">{ann.date}</span>
                        <span className={cn(
                          "rounded-full px-1.5 py-0.5 text-[10px] font-medium",
                          ann.priority === "high" ? "bg-red-500/15 text-red-500" : ann.priority === "medium" ? "bg-amber-500/15 text-amber-500" : "bg-secondary text-muted-foreground"
                        )}>{ann.priority}</span>
                      </div>
                    </div>
                  </div>
                ))}
                {liveAnnouncements.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">No announcements yet.</p>
                )}
              </div>
            )}
          </div>

          {/* New Announcement Form */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="text-sm font-medium text-foreground mb-4">Post New Announcement</h3>
            <input
              value={announcementTitle}
              onChange={(e) => setAnnouncementTitle(e.target.value)}
              placeholder="Title"
              className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
            />
            <textarea
              value={announcementContent}
              onChange={(e) => setAnnouncementContent(e.target.value)}
              placeholder="Announcement content..."
              rows={4}
              className="mt-2 w-full resize-none rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
            />
            <label className="mt-2 flex items-center gap-2 rounded-lg border border-dashed border-border p-2.5 cursor-pointer hover:border-primary/40 transition-colors">
              <ImagePlus className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{announcementPhoto || "Attach a photo (optional)"}</span>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) setAnnouncementPhoto(file.name)
              }} />
            </label>
            {announcementPhoto && (
              <div className="mt-1 flex items-center gap-1">
                <span className="rounded bg-primary/10 px-2 py-0.5 text-[10px] text-primary">🖼️ {announcementPhoto}</span>
                <button onClick={() => setAnnouncementPhoto(null)} className="text-muted-foreground hover:text-foreground"><X className="h-3 w-3" /></button>
              </div>
            )}
            <button
              onClick={handlePublish}
              disabled={publishing || !announcementTitle.trim()}
              className="mt-3 flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {publishing ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              {publishing ? "Publishing…" : "Publish"}
            </button>
          </div>
        </div>
      )}

      {/* Requests Tab */}
      {activeTab === "requests" && (
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-foreground">Pending Requests</h2>
            <div className="flex items-center gap-2">
              {reqHook.loading && <span className="text-xs text-muted-foreground animate-pulse">Loading…</span>}
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary/20 px-1.5 text-xs font-bold text-primary">
                {liveRequests.filter((r) => r.status === "pending").length}
              </span>
            </div>
          </div>

          {reqHook.loading ? (
            <DataLoading rows={4} />
          ) : (
            <div className="space-y-3">
              {liveRequests.map((req) => (
                <div key={req.id} className="rounded-lg border border-border bg-secondary/30 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-primary">{req.type}</span>
                        <span className={cn(
                          "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium",
                          req.status === "pending" ? "bg-primary/15 text-primary" :
                            req.status === "approved" ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" :
                              "bg-red-500/15 text-red-600 dark:text-red-400"
                        )}>
                          {req.status === "pending" ? <Clock className="h-3 w-3" /> :
                            req.status === "approved" ? <Check className="h-3 w-3" /> :
                              <X className="h-3 w-3" />}
                          {req.status}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-foreground">{req.reason}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{req.fromName} — {req.date}</p>
                    </div>
                  </div>
                  {req.status === "pending" && (
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => reqHook.approve(req.id)}
                        className="rounded-lg bg-emerald-600/20 px-3 py-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:bg-emerald-600/30 transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => reqHook.reject(req.id)}
                        className="rounded-lg bg-red-600/20 px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-600/30 transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
              {liveRequests.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No requests found.</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Calendar Tab */}
      {activeTab === "calendar" && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-6 space-y-4">
          <div className="flex items-center justify-between rounded-xl border border-border bg-card p-5">
            <div>
              <h2 className="text-base font-semibold text-foreground">Academic Calendar</h2>
              <p className="text-xs text-muted-foreground">March 2026</p>
            </div>
            <div className="flex gap-2">
              <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card hover:bg-muted transition-colors">&lt;</button>
              <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card hover:bg-muted transition-colors">&gt;</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-6 items-start">
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="grid grid-cols-7 gap-2 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                  <div key={d} className="text-center text-xs font-semibold text-muted-foreground uppercase">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                  let eventType: "exam" | "holiday" | "event" | "deadline" | null = null
                  let eventName = ""
                  if (day >= 1 && day <= 5) { eventType = "exam"; eventName = "Mid-Sem Exams" }
                  else if (day === 10) { eventType = "holiday"; eventName = "Holi" }
                  else if (day === 15) { eventType = "event"; eventName = "Sports Week" }
                  else if (day === 20) { eventType = "deadline"; eventName = "Projects Due" }
                  return (
                    <div key={day} className={cn(
                      "aspect-square rounded-lg border border-border/50 p-1.5 sm:p-2 flex flex-col justify-between transition-colors",
                      eventType ? "bg-secondary/20 hover:bg-secondary/40 cursor-pointer" : "bg-card hover:bg-secondary/10",
                      day === 12 && "border-primary/50 bg-primary/5"
                    )}>
                      <span className={cn(
                        "text-xs sm:text-sm font-medium",
                        day === 12 ? "flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground" : "text-foreground"
                      )}>{day}</span>
                      {eventType && (
                        <div className="mt-1">
                          <div className={cn("h-1.5 w-1.5 rounded-full mb-1 sm:hidden", eventType === "exam" ? "bg-red-500" : eventType === "holiday" ? "bg-emerald-500" : eventType === "event" ? "bg-blue-500" : "bg-amber-500")} />
                          <div className={cn("hidden sm:block truncate rounded px-1.5 py-0.5 text-[9px] font-medium w-full text-left", eventType === "exam" ? "bg-red-500/15 text-red-600 dark:text-red-400" : eventType === "holiday" ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" : eventType === "event" ? "bg-blue-500/15 text-blue-600 dark:text-blue-400" : "bg-amber-500/15 text-amber-600 dark:text-amber-400")}>{eventName}</div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Upcoming Schedule</h3>
              <div className="space-y-4">
                {[
                  { date: "Mar 1-5", event: "Mid-Semester Exams", type: "exam" },
                  { date: "Mar 10", event: "Holi Holiday", type: "holiday" },
                  { date: "Mar 15", event: "Sports Week Begins", type: "event" },
                  { date: "Mar 20", event: "Project Submission Deadline", type: "deadline" },
                  { date: "Apr 1-15", event: "End-Semester Exams", type: "exam" },
                ].map((cal, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center pt-1">
                      <div className={cn("h-2.5 w-2.5 rounded-full shrink-0", cal.type === "exam" ? "bg-red-500" : cal.type === "holiday" ? "bg-emerald-500" : cal.type === "event" ? "bg-blue-500" : "bg-amber-500")} />
                      {i !== 4 && <div className="w-[1px] h-10 bg-border mt-1" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{cal.event}</p>
                      <p className="text-xs text-muted-foreground">{cal.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Settings Tab */}
      {activeTab === "settings" && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-base font-semibold text-foreground">⚙️ Admin Settings</h2>
          <div className="mt-4 space-y-4">
            {["Email Notifications", "Auto-approve leave requests < 2 days", "Show student rankings publicly", "Enable parent portal access"].map((setting) => (
              <div key={setting} className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-3">
                <span className="text-sm text-foreground">{setting}</span>
                <button className="h-5 w-9 rounded-full bg-primary/30 relative transition-colors">
                  <span className="absolute left-1 top-0.5 h-4 w-4 rounded-full bg-primary transition-transform" />
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </DashboardShell>
  )
}

