"use client"

import { useState } from "react"
import { DashboardShell } from "@/components/layout/dashboard-shell"
import { SmartCalendar } from "@/components/smart-calendar"
import { adminStats, enrollmentTrend, departmentDistribution, announcements, requests, campusFeedback, clashingSchedules, maintenanceTickets } from "@/lib/mock-data"
import { useAnnouncementsWithMutations, useRequests, useExamWithMutations, DataLoading } from "@/lib/hooks"
import { triggerMagicWriter } from "@/lib/mock-ai"
import { Megaphone, FileCheck, CalendarDays, Settings, Users, GraduationCap, Building2, Palette, Check, X, Clock, TrendingUp, ImagePlus, Upload, Sparkles, AlertTriangle, Send, CheckCircle2 } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { StudentLeaderboard } from "@/components/student-leaderboard"
import { AlertCircle, Zap, ShieldAlert, Cpu } from "lucide-react"

const sentimentData = [
  { name: 'Positive', value: campusFeedback.filter(f => f.sentiment === 'positive').length, color: 'oklch(0.62 0.17 146)' },
  { name: 'Neutral', value: campusFeedback.filter(f => f.sentiment === 'neutral').length, color: 'oklch(0.7 0.1 80)' },
  { name: 'Negative', value: campusFeedback.filter(f => f.sentiment === 'negative').length, color: 'oklch(0.6 0.2 25)' },
]

const navItems = [
  { label: "Overview", href: "/dashboard/admin", icon: Building2 },
  { label: "Announcements", href: "/dashboard/admin", icon: Megaphone },
  { label: "Requests", href: "/dashboard/admin", icon: FileCheck },
  { label: "Calendar", href: "/dashboard/admin", icon: CalendarDays },
  { label: "Schedule AI", href: "/dashboard/admin", icon: Cpu },
  { label: "Exams", href: "/dashboard/admin", icon: FileCheck },
  { label: "Helpdesk", href: "/dashboard/admin", icon: AlertTriangle },
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
  const [isEnhancing, setIsEnhancing] = useState(false)

  const [adminSettings, setAdminSettings] = useState<Record<string, boolean>>({
    "Email Notifications": true,
    "Auto-approve leave requests < 2 days": false,
    "Show student rankings publicly": true,
    "Enable parent portal access": true,
  })

  // Scheduler state
  const [isResolving, setIsResolving] = useState(false)
  const [scheduleResolved, setScheduleResolved] = useState(false)

  // Helpdesk State
  const [resolvedTickets, setResolvedTickets] = useState<Record<string, boolean>>({})

  const toggleSetting = (setting: string) => {
    setAdminSettings((prev) => ({ ...prev, [setting]: !prev[setting] }))
  }

  const markTicketResolved = (id: string) => {
    setResolvedTickets(prev => ({ ...prev, [id]: true }))
  }

  // ── Live data ──────────────────────────────────────────────────
  const annHook = useAnnouncementsWithMutations()
  const reqHook = useRequests()
  const { data: exams, generateSeating, loading: examsLoading } = useExamWithMutations()

  const liveAnnouncements = annHook.data && annHook.data.length > 0 ? annHook.data : (announcements as any[])
  const liveRequests = reqHook.data && reqHook.data.length > 0 ? reqHook.data : (requests as any[])

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

          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_300px]">
            <StudentLeaderboard />

            {/* AI Sentiment Analysis Widget */}
            <div className="rounded-xl border border-border bg-card p-5 flex flex-col">
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <h2 className="text-base font-semibold text-foreground">AI Sentiment Analysis</h2>
                </div>
                <p className="text-xs text-muted-foreground">Live campus feedback mood</p>
              </div>

              <div className="h-40 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sentimentData}
                      cx="50%"
                      cy="100%"
                      startAngle={180}
                      endAngle={0}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {sentimentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "0.5rem", fontSize: "12px" }}
                      itemStyle={{ color: "var(--foreground)" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute top-[60%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                  <span className="text-2xl font-bold text-foreground">
                    {Math.round((sentimentData[0].value / campusFeedback.length) * 100)}%
                  </span>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Positive</p>
                </div>
              </div>

              <div className="mt-4 flex-1 space-y-3 overflow-auto max-h-[250px] pr-2 custom-scrollbar">
                {campusFeedback.map(fb => (
                  <div key={fb.id} className="rounded-lg border border-border bg-secondary/30 p-2 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className={cn(
                        "rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase",
                        fb.sentiment === 'positive' ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" :
                          fb.sentiment === 'negative' ? "bg-red-500/10 text-red-600 dark:text-red-400" :
                            "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                      )}>
                        {fb.sentiment}
                      </span>
                    </div>
                    <p className="text-muted-foreground line-clamp-2">{fb.text}</p>
                  </div>
                ))}
              </div>
            </div>
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

            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={handlePublish}
                disabled={publishing || !announcementTitle.trim()}
                className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {publishing ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                {publishing ? "Publishing…" : "Publish"}
              </button>

              <button
                onClick={async () => {
                  if (!announcementContent.trim() || isEnhancing) return
                  setIsEnhancing(true)
                  const enhanced = await triggerMagicWriter(announcementContent)
                  setAnnouncementContent(enhanced)
                  setIsEnhancing(false)
                }}
                disabled={isEnhancing || !announcementContent.trim()}
                className="flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm font-medium text-amber-600 hover:bg-amber-500/20 transition-colors disabled:opacity-50"
                title="AI Magic Writer: Type a short prompt and auto-expand into a formal announcement"
              >
                <Sparkles className={cn("h-4 w-4 fill-current", isEnhancing && "animate-pulse")} />
                {isEnhancing ? "Enhancing..." : "Magic Writer"}
              </button>
            </div>
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
        <SmartCalendar role="admin" />
      )}

      {/* Schedule AI Tab */}
      {activeTab === "schedule ai" && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="flex items-center justify-between rounded-xl border border-border bg-card p-5">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-foreground">AI Clash Detector</h2>
                {!scheduleResolved && (
                  <span className="flex items-center gap-1 rounded bg-red-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
                    <AlertCircle className="h-3 w-3" /> 2 Conflicts
                  </span>
                )}
                {scheduleResolved && (
                  <span className="flex items-center gap-1 rounded bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    <Check className="h-3 w-3" /> Resolved
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Smart scheduling identifies overlapping faculty and room bookings.</p>
            </div>

            <button
              onClick={() => {
                setIsResolving(true)
                setTimeout(() => {
                  setScheduleResolved(true)
                  setIsResolving(false)
                }, 1500)
              }}
              disabled={isResolving || scheduleResolved}
              className={cn(
                "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50",
                scheduleResolved
                  ? "bg-secondary text-muted-foreground"
                  : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20"
              )}
            >
              {isResolving ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : scheduleResolved ? (
                <Check className="h-4 w-4" />
              ) : (
                <Zap className="h-4 w-4 fill-current" />
              )}
              {isResolving ? "Resolving Schedule..." : scheduleResolved ? "Optimized" : "AI Auto-Resolve"}
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-border bg-card">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary/20">
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Time Slot</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Subject</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Faculty</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Assigned Room</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody className="relative">
                {/* Visual grouping line for conflict */}
                {!scheduleResolved && (
                  <div className="absolute left-0 top-[49px] bottom-[49px] w-1 bg-red-500 rounded-r shadow-[0_0_10px_rgba(239,68,68,0.5)] z-10 animate-pulse" />
                )}

                {clashingSchedules.map((slot, index) => {
                  const isClash = !scheduleResolved && slot.defaultStatus === "clash"
                  const roomToDisplay = scheduleResolved ? slot.resolvedRoom : slot.room
                  const isModifiedRow = scheduleResolved && slot.defaultStatus === "clash" && slot.room !== slot.resolvedRoom

                  return (
                    <tr
                      key={slot.id}
                      className={cn(
                        "border-b border-border/50 transition-colors duration-500",
                        isClash ? "bg-red-500/5 hover:bg-red-500/10" : "hover:bg-muted/30",
                        isModifiedRow && "bg-emerald-500/5"
                      )}
                    >
                      <td className="px-5 py-4 text-sm font-medium text-foreground whitespace-nowrap">
                        <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-muted-foreground" /> {slot.time}</span>
                      </td>
                      <td className="px-5 py-4 text-sm text-foreground">{slot.subject}</td>
                      <td className={cn(
                        "px-5 py-4 text-sm font-semibold",
                        isClash ? "text-red-600 dark:text-red-400" : "text-muted-foreground"
                      )}>
                        <div className="flex items-center gap-1.5">
                          {isClash && <ShieldAlert className="h-3.5 w-3.5" />}
                          {slot.teacher}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={cn(
                          "rounded px-2.5 py-1 text-xs font-medium font-mono border",
                          isClash
                            ? "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400"
                            : isModifiedRow
                              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                              : "border-border bg-secondary text-foreground"
                        )}>
                          {roomToDisplay}
                        </span>
                        {isModifiedRow && <span className="ml-2 text-[10px] text-emerald-500 font-medium tracking-wide uppercase">Re-routed</span>}
                      </td>
                      <td className="px-5 py-4">
                        {isClash ? (
                          <span className="flex items-center gap-1.5 text-xs font-bold text-red-600 dark:text-red-400 animate-pulse">
                            Overlap Detected
                          </span>
                        ) : (
                          <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                            <Check className="h-3.5 w-3.5" /> Normal
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Exams Tab */}
      {activeTab === "exams" && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="flex items-center justify-between rounded-xl border border-border bg-card p-5">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-foreground">Smart Exam & Seating Arranger</h2>
                <span className="flex items-center gap-1 rounded bg-blue-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  <Sparkles className="h-3 w-3" /> Live DB
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Manage examinations and auto-generate clash-free seating arrangements.</p>
            </div>
          </div>

          <div className="grid gap-6">
            {examsLoading ? (
              <DataLoading rows={2} />
            ) : exams?.length === 0 ? (
              <p className="text-sm text-foreground">No exams found.</p>
            ) : (
              exams?.map(exam => (
                <div key={exam.id} className="rounded-xl border border-border bg-card overflow-hidden">
                  <div className="flex items-center justify-between p-5 border-b border-border/50 bg-secondary/10">
                    <div>
                      <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                        {exam.subject}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {exam.date} • {exam.time} • {exam.duration} mins
                      </p>
                    </div>
                    <button
                      onClick={() => generateSeating(exam.id)}
                      className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                      <Sparkles className="h-4 w-4 fill-current" /> Generate Seating Plan
                    </button>
                  </div>

                  <div className="p-5">
                    {exam.seatingPlans && exam.seatingPlans.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                        {exam.seatingPlans.map(plan => (
                          <div key={plan.id} className="rounded-lg border border-primary/20 bg-primary/5 p-4 relative">
                            <h4 className="font-semibold text-foreground">{plan.room}</h4>
                            <p className="text-xs text-muted-foreground mt-1">
                              Capacity: {plan.totalSeats} seats
                            </p>
                            <div className="mt-4 flex items-center justify-between">
                              <span className="text-sm font-medium text-primary">{plan.assigned} Students Assigned</span>
                              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-6 text-center border-2 border-dashed border-border rounded-lg bg-secondary/20">
                        <Users className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">No seating plan generated yet.</p>
                        <p className="text-xs text-muted-foreground/70 mt-1">Click the generate button to auto-assign rooms.</p>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      )}

      {/* AI Helpdesk Tab */}
      {activeTab === "helpdesk" && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="flex items-center justify-between rounded-xl border border-border bg-card p-5">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-foreground">AI-Assisted Helpdesk</h2>
                <span className="flex items-center gap-1 rounded bg-primary/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                  <Sparkles className="h-3 w-3" /> Auto-Triage Active
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Student grievances are automatically categorized and drafted with AI.</p>
            </div>
            <div className="flex items-center gap-4 text-sm font-medium">
              <div className="flex flex-col items-center">
                <span className="text-xl text-amber-500 font-bold">{maintenanceTickets.filter(t => t.status === "Open" && !resolvedTickets[t.id]).length}</span>
                <span className="text-xs text-muted-foreground">Open</span>
              </div>
              <div className="w-px h-8 bg-border"></div>
              <div className="flex flex-col items-center">
                <span className="text-xl text-emerald-500 font-bold">{maintenanceTickets.filter(t => t.status === "Resolved" || resolvedTickets[t.id]).length}</span>
                <span className="text-xs text-muted-foreground">Resolved</span>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            {maintenanceTickets.map((ticket, i) => {
              const isResolvedLocally = resolvedTickets[ticket.id] || ticket.status === "Resolved"

              return (
                <div key={ticket.id} className={cn(
                  "rounded-xl border bg-card overflow-hidden transition-all",
                  isResolvedLocally ? "border-border/60 opacity-70" : "border-primary/20 shadow-md shadow-primary/5"
                )}>
                  {/* Priority Header Stripe */}
                  <div className={cn(
                    "h-1 w-full",
                    isResolvedLocally ? "bg-emerald-500" : ticket.ai_priority === "Urgent" ? "bg-red-500 animate-pulse" : ticket.ai_priority === "High" ? "bg-amber-500" : "bg-blue-500"
                  )} />

                  <div className="p-5 flex flex-col md:flex-row gap-6">
                    {/* Left: Ticket Info */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                            {ticket.location}
                            {isResolvedLocally && <Check className="h-4 w-4 text-emerald-500" />}
                          </h3>
                          <p className="text-xs text-muted-foreground">Reported by {ticket.student} • {ticket.date}</p>
                        </div>
                        {!isResolvedLocally && (
                          <div className="flex gap-2">
                            <span className="rounded bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary border border-primary/20">
                              {ticket.ai_category}
                            </span>
                            <span className={cn(
                              "rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border",
                              ticket.ai_priority === "Urgent" ? "bg-red-500/10 text-red-500 border-red-500/20" : ticket.ai_priority === "High" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                            )}>
                              {ticket.ai_priority}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="rounded-lg bg-secondary/30 p-3 border border-border/50">
                        <p className="text-sm font-medium text-foreground">&quot;{ticket.issue}&quot;</p>
                      </div>
                    </div>

                    {/* Right: AI Actions */}
                    {!isResolvedLocally ? (
                      <div className="flex-[0.8] rounded-lg border-2 border-primary/10 bg-primary/5 p-4 flex flex-col relative">
                        <div className="absolute top-2 right-2 text-primary/20"><Sparkles className="h-4 w-4" /></div>
                        <p className="text-[10px] uppercase font-bold text-primary mb-2">AI Drafted Resolution</p>
                        <p className="text-sm text-foreground/90 italic flex-1 border-l-2 border-primary/30 pl-3 py-1 mb-4">
                          {ticket.ai_draft_response}
                        </p>
                        <button
                          onClick={() => markTicketResolved(ticket.id)}
                          className="flex items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors w-full mt-auto shadow-sm"
                        >
                          <Send className="h-4 w-4" /> Send & Mark Resolved
                        </button>
                      </div>
                    ) : (
                      <div className="flex-[0.8] flex items-center justify-center flex-col text-muted-foreground border-l border-border/50 pl-6">
                        <CheckCircle2 className="h-8 w-8 text-emerald-500/50 mb-2" />
                        <p className="text-sm font-medium">Ticket Resolved</p>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>
      )}

      {/* Settings Tab */}
      {activeTab === "settings" && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-base font-semibold text-foreground">⚙️ Admin Settings</h2>
          <div className="mt-4 space-y-4">
            {Object.entries(adminSettings).map(([setting, isEnabled]) => (
              <div key={setting} className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-3">
                <span className="text-sm text-foreground">{setting}</span>
                <button
                  onClick={() => toggleSetting(setting)}
                  className={cn(
                    "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background",
                    isEnabled ? "bg-primary" : "bg-muted-foreground/30"
                  )}
                >
                  <span
                    className={cn(
                      "pointer-events-none absolute left-0.5 top-0.5 inline-block h-4 w-4 transform rounded-full bg-background shadow ring-0 transition duration-200 ease-in-out",
                      isEnabled ? "translate-x-4" : "translate-x-0"
                    )}
                  />
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </DashboardShell>
  )
}

