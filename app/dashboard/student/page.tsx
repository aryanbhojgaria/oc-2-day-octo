"use client"

import { useState } from "react"
import { DashboardShell } from "@/components/layout/dashboard-shell"
import { students, messMenuExtended, wardenNotices, teachers, attendanceTrend, studentTimetable } from "@/lib/mock-data"
import { useStudentMe, useMarks, useTimetable, useEvents, useClubs, DataLoading } from "@/lib/hooks"
import { BookOpen, UtensilsCrossed, User, Star, Ticket, QrCode, CheckCircle2, X, Home, Coffee, Sunrise, Sun, Moon, TrendingUp, FileText, Shield, Map, Award, Calendar, Clock, MapPin, Bookmark, Palette, CalendarDays, Users, Filter } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { ReportCard } from "@/components/report-card"
import { AssignmentPortal } from "@/components/assignment-portal"
import { FeedbackPanel } from "@/components/feedback-panel"
import { CampusMap } from "@/components/campus-map"
import { EventRSVP } from "@/components/event-rsvp"

const navItems = [
  { label: "Academic", href: "/dashboard/student", icon: BookOpen },
  { label: "Timetable", href: "/dashboard/student", icon: Clock },
  { label: "Calendar", href: "/dashboard/student", icon: Calendar },
  { label: "Mess Menu", href: "/dashboard/student", icon: UtensilsCrossed },
  { label: "Hostel", href: "/dashboard/student", icon: Home },
  { label: "Assignments", href: "/dashboard/student", icon: FileText },
  { label: "Report Card", href: "/dashboard/student", icon: Award },
  { label: "Events", href: "/dashboard/student", icon: CalendarDays },
  { label: "Campus Map", href: "/dashboard/student", icon: Map },
  { label: "Feedback", href: "/dashboard/student", icon: Shield },
  { label: "Profile", href: "/dashboard/student", icon: User },
]

const student = students[0]

const mealIcons: Record<string, typeof Sunrise> = {
  breakfast: Sunrise,
  lunch: Sun,
  snacks: Coffee,
  dinner: Moon,
}

const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
const todayIndex = new Date().getDay()
const todayName = daysOfWeek[todayIndex]

export default function StudentDashboardPage() {
  const [activeTab, setActiveTab] = useState("academic")
  const [qrVisible, setQrVisible] = useState(false)
  const [leaveForm, setLeaveForm] = useState({ from: "", to: "", reason: "" })
  const [leaveSubmitted, setLeaveSubmitted] = useState(false)

  // Live data
  const studentHook = useStudentMe()
  const marksHook = useMarks()
  const timetableHook = useTimetable("STUDENT")

  // Fallbacks to mock if API not available (no token / not logged in as student)
  const student = studentHook.data ?? students[0]
  const liveMarks = marksHook.data ?? []
  const liveTimetable = timetableHook.data ?? studentTimetable
  const eventsHook = useEvents()
  const clubsHook = useClubs()
  const liveEvents = eventsHook.data ?? []
  const liveClubs = clubsHook.data ?? []

  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [ticketDialog, setTicketDialog] = useState(false)
  const [selectedDay, setSelectedDay] = useState(todayName)
  const [markedForReview, setMarkedForReview] = useState<Set<string>>(new Set())
  const [eventFilter, setEventFilter] = useState<"all" | "upcoming" | "past">("all")

  // Filter events
  const filteredEvents = liveEvents.filter((e) => eventFilter === "all" || e.status === eventFilter)

  const toggleReview = (subject: string) => {
    setMarkedForReview(prev => {
      const next = new Set(prev)
      if (next.has(subject)) next.delete(subject)
      else next.add(subject)
      return next
    })
  }

  const handleBuyTicket = () => {
    setTicketDialog(true)
    setPaymentSuccess(false)
    setTimeout(() => setPaymentSuccess(true), 1500)
  }

  const todayMenu = messMenuExtended.find((m) => m.day === selectedDay)

  return (
    <DashboardShell role="student" navItems={navItems} activeNav={activeTab} onNavClick={(label) => setActiveTab(label as typeof activeTab)}>
      {/* Tab Switcher */}
      <div className="mb-6 flex flex-wrap gap-2">
        {(["academic", "timetable", "calendar", "mess menu", "hostel", "assignments", "report card", "campus map", "feedback", "profile"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium capitalize transition-colors",
              activeTab === tab
                ? "bg-primary/15 text-primary"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Academic Tab */}
      {activeTab === "academic" && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Summary cards */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-card p-5">
              <p className="text-sm text-muted-foreground">Attendance</p>
              <p className="mt-1 text-3xl font-bold text-foreground">{student.attendance}%</p>
              <div className="mt-2 h-2 rounded-full bg-secondary">
                <div
                  className="h-2 rounded-full bg-primary"
                  style={{ width: `${student.attendance}%` }}
                />
              </div>
              <p className="mt-1.5 text-xs text-muted-foreground">
                {student.attendance >= 85 ? "Good standing" : "Below 85% - Attend more classes"}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-5">
              <p className="text-sm text-muted-foreground">CGPA</p>
              <p className="mt-1 text-3xl font-bold text-foreground">{student.cgpa}</p>
              <p className="mt-1.5 text-xs text-muted-foreground">Out of 10.0</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-5">
              <p className="text-sm text-muted-foreground">Year</p>
              <p className="mt-1 text-3xl font-bold text-foreground">{student.year}<span className="text-lg text-muted-foreground">rd</span></p>
              <p className="mt-1.5 text-xs text-muted-foreground">{student.department}</p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-border bg-card">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <h2 className="text-base font-semibold text-foreground">Marks Overview</h2>
              {markedForReview.size > 0 && (
                <span className="flex items-center gap-1.5 text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-500/10 rounded-full px-2.5 py-1">
                  <Bookmark className="h-3 w-3 fill-current" /> {markedForReview.size} marked for review
                </span>
              )}
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Subject</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Internal 1</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Internal 2</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Assignment</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Grade</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Review</th>
                </tr>
              </thead>
              <tbody>
                {(liveMarks.length > 0 ? liveMarks : []).map((m) => (
                  <tr key={m.subject} className={cn(
                    "border-b border-border/50 last:border-0 transition-colors",
                    markedForReview.has(m.subject) ? "bg-amber-500/5" : ""
                  )}>
                    <td className="px-5 py-3 text-sm font-medium text-foreground">{m.subject}</td>
                    <td className="px-5 py-3 text-sm text-muted-foreground">{m.internal1}/50</td>
                    <td className="px-5 py-3 text-sm text-muted-foreground">{m.internal2}/50</td>
                    <td className="px-5 py-3 text-sm text-muted-foreground">{m.assignment}/20</td>
                    <td className="px-5 py-3 text-sm font-medium text-foreground">{m.total}</td>
                    <td className="px-5 py-3">
                      <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">{m.grade}</span>
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => toggleReview(m.subject)}
                        title={markedForReview.has(m.subject) ? "Remove from review" : "Mark for review"}
                        className={cn(
                          "flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium transition-all",
                          markedForReview.has(m.subject)
                            ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                            : "text-muted-foreground hover:bg-secondary"
                        )}
                      >
                        <Bookmark className={cn("h-3.5 w-3.5", markedForReview.has(m.subject) && "fill-current")} />
                        <span className="hidden sm:inline">{markedForReview.has(m.subject) ? "Marked" : "Review"}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Attendance Trend Chart */}
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-semibold text-foreground">Attendance Trend</h2>
                <p className="text-xs text-muted-foreground">Weekly attendance percentage</p>
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-1">
                <TrendingUp className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">+9% from W1</span>
              </div>
            </div>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={attendanceTrend} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid stroke="oklch(0.3 0.01 0 / 0.15)" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="week" tick={{ fontSize: 11, fill: "oklch(0.65 0 0)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "oklch(0.65 0 0)" }} axisLine={false} tickLine={false} domain={[70, 100]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "0.5rem", fontSize: "12px" }}
                    labelStyle={{ color: "var(--foreground)", fontWeight: 600 }}
                    itemStyle={{ color: "oklch(0.55 0.22 25)" }}
                    formatter={(value: number) => [`${value}%`, "Attendance"]}
                  />
                  <Line type="monotone" dataKey="percentage" stroke="oklch(0.55 0.22 25)" strokeWidth={2.5} dot={{ r: 4, fill: "oklch(0.55 0.22 25)", strokeWidth: 0 }} activeDot={{ r: 6, fill: "oklch(0.55 0.22 25)" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Faculty Review */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="text-base font-semibold text-foreground">Faculty</h2>
            <div className="mt-4 space-y-3">
              {teachers.map((t) => (
                <div key={t.id} className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
                      {t.name.split(" ").filter(n => n.length > 1).map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.subject} - {t.department}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className={cn("h-3.5 w-3.5", star <= 4 ? "fill-primary text-primary" : "text-muted-foreground/30")} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}



      {/* Timetable Tab */}
      {activeTab === "timetable" && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="flex items-center justify-between rounded-xl border border-border bg-card p-5">
            <div>
              <h2 className="text-base font-semibold text-foreground">Weekly Timetable</h2>
              <p className="text-xs text-muted-foreground">Class schedule and room assignments</p>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-1.5">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Semester 6</span>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-border bg-card">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground w-32 border-r border-border/50">Day</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground border-r border-border/50">9:00 - 10:00</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground border-r border-border/50">10:00 - 11:00</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground border-r border-border/50">11:00 - 11:15</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground border-r border-border/50">11:15 - 1:15</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">2:00 - 4:00</th>
                </tr>
              </thead>
              <tbody>
                {studentTimetable.map((dayPlan, i) => (
                  <tr key={i} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-4 border-r border-border/50">
                      <span className={cn(
                        "text-sm font-medium",
                        dayPlan.day === selectedDay ? "text-primary" : "text-foreground"
                      )}>{dayPlan.day}</span>
                    </td>
                    {dayPlan.slots.map((slot, j) => (
                      <td key={j} className="px-2 py-3 border-r border-border/50 last:border-0">
                        {slot.subject === "Break" ? (
                          <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-secondary/50 text-muted-foreground h-full min-h-[60px]">
                            <Coffee className="h-4 w-4 mb-1 opacity-50" />
                            <span className="text-[10px] font-medium uppercase tracking-widest">{slot.subject}</span>
                          </div>
                        ) : (
                          <div className={cn(
                            "flex flex-col items-center justify-center p-2 rounded-lg h-full min-h-[60px] text-center border transition-colors",
                            slot.subject.includes("Lab") || slot.subject.includes("Project")
                              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-400"
                              : slot.subject.includes("Elective")
                                ? "bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-400"
                                : "bg-primary/10 border-primary/20 text-primary"
                          )}>
                            <span className="text-xs font-semibold mb-1 line-clamp-2">{slot.subject}</span>
                            <div className="flex items-center gap-1 text-[10px] opacity-80 mt-auto">
                              <MapPin className="h-2.5 w-2.5" />
                              {slot.room}
                            </div>
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Mess Menu Tab - ENHANCED */}
      {activeTab === "mess menu" && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Today's highlight */}
          <div className="rounded-xl border-2 border-primary/30 bg-card p-5 glow-red">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                  {"Today's"} Menu - {todayName}
                </p>
                <h2 className="mt-1 text-xl font-bold text-foreground">What{"'"}s Cooking</h2>
              </div>
              <UtensilsCrossed className="h-8 w-8 text-primary/40" />
            </div>

            {/* Today's meals as cards */}
            {todayMenu && (
              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {(["breakfast", "lunch", "snacks", "dinner"] as const).map((meal, idx) => {
                  const MealIcon = mealIcons[meal]
                  return (
                    <motion.div
                      key={meal}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1, duration: 0.3 }}
                      className="rounded-lg border border-border bg-secondary/30 p-4"
                    >
                      <div className="mb-2 flex items-center gap-2">
                        <MealIcon className="h-4 w-4 text-primary" />
                        <p className="text-xs font-semibold uppercase tracking-wide text-primary capitalize">{meal}</p>
                      </div>
                      <p className="text-sm leading-relaxed text-foreground">
                        {todayMenu[meal as keyof typeof todayMenu]}
                      </p>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Day picker */}
          <div className="flex flex-wrap gap-2">
            {daysOfWeek.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                  selectedDay === day
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-card text-muted-foreground hover:bg-secondary hover:text-foreground",
                  day === todayName && selectedDay !== day && "ring-1 ring-primary/40"
                )}
              >
                {day.slice(0, 3)}
                {day === todayName && <span className="ml-1 text-[10px] opacity-70">(Today)</span>}
              </button>
            ))}
          </div>

          {/* Full weekly table */}
          <div className="overflow-x-auto rounded-xl border border-border bg-card">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <h2 className="text-base font-semibold text-foreground">Weekly Mess Menu</h2>
              <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                Aryabhata Hostel Mess
              </span>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Day</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <span className="flex items-center gap-1.5"><Sunrise className="h-3 w-3" /> Breakfast</span>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <span className="flex items-center gap-1.5"><Sun className="h-3 w-3" /> Lunch</span>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <span className="flex items-center gap-1.5"><Coffee className="h-3 w-3" /> Snacks</span>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <span className="flex items-center gap-1.5"><Moon className="h-3 w-3" /> Dinner</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {messMenuExtended.map((row) => (
                  <motion.tr
                    key={row.day}
                    className={cn(
                      "border-b border-border/50 last:border-0 transition-colors cursor-pointer",
                      row.day === selectedDay && "bg-primary/5",
                      row.day === todayName && row.day !== selectedDay && "bg-primary/[0.02]"
                    )}
                    onClick={() => setSelectedDay(row.day)}
                    whileHover={{ backgroundColor: "rgba(220, 38, 38, 0.04)" }}
                  >
                    <td className="px-4 py-3 text-sm font-medium text-foreground">
                      <span className="flex items-center gap-2">
                        {row.day}
                        {row.day === todayName && (
                          <span className="rounded bg-primary/15 px-1.5 py-0.5 text-[10px] font-semibold text-primary">TODAY</span>
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{row.breakfast}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{row.lunch}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{row.snacks}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{row.dinner}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mess timing info */}
          <div className="grid gap-4 sm:grid-cols-4">
            {[
              { meal: "Breakfast", time: "7:30 - 9:00 AM", icon: Sunrise },
              { meal: "Lunch", time: "12:00 - 1:30 PM", icon: Sun },
              { meal: "Snacks", time: "4:30 - 5:30 PM", icon: Coffee },
              { meal: "Dinner", time: "7:30 - 9:00 PM", icon: Moon },
            ].map((item, i) => (
              <motion.div
                key={item.meal}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
                className="flex items-center gap-3 rounded-xl border border-border bg-card p-4"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <item.icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{item.meal}</p>
                  <p className="text-xs text-muted-foreground">{item.time}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Day scholar lunch ticket */}
          {!student.hostel && (
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="text-sm font-semibold text-foreground">Day Scholar? Get a Lunch Pass</h3>
              <p className="mt-1 text-xs text-muted-foreground">Buy a one-time lunch ticket to eat in the mess today.</p>
              <button
                onClick={handleBuyTicket}
                className="mt-3 flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <Ticket className="h-4 w-4" />
                Buy Lunch Ticket - Rs. 60
              </button>
            </div>
          )}
        </motion.div>
      )}

      {/* Hostel Tab */}
      {activeTab === "hostel" && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {student.hostel ? (
            <>
              {/* Hostel ID Card */}
              <div className="rounded-xl border-2 border-primary/40 bg-card p-6 glow-red">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-primary">Hostel ID</p>
                    <h3 className="mt-1 text-xl font-bold text-foreground">{student.name}</h3>
                    <p className="text-sm text-muted-foreground">{student.id} - {student.department}</p>
                    <p className="mt-2 text-xs text-muted-foreground">Room: B-204 | Block: Aryabhata</p>
                  </div>
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/15 text-xl font-bold text-primary">
                    {student.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                </div>
              </div>
              {/* Warden Notices */}
              <div className="rounded-xl border border-border bg-card p-5">
                <h2 className="text-base font-semibold text-foreground">Warden Notices</h2>
                <div className="mt-4 space-y-3">
                  {wardenNotices.map((notice) => (
                    <div key={notice.id} className="rounded-lg border border-border bg-secondary/30 p-3">
                      <p className="text-sm font-medium text-foreground">{notice.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{notice.content}</p>
                      <p className="mt-1.5 text-xs text-muted-foreground/60">{notice.date}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-foreground">Not a Hosteller</h3>
                  <p className="mt-1 text-sm text-muted-foreground">You are registered as a day scholar.</p>
                </div>
                <Home className="h-8 w-8 text-muted-foreground/20" />
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                If you believe this is incorrect, please contact the administration office.
              </p>
            </div>
          )}
        </motion.div>
      )}

      {/* Calendar Tab */}
      {activeTab === "calendar" && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="flex items-center justify-between rounded-xl border border-border bg-card p-5">
            <div>
              <h2 className="text-base font-semibold text-foreground">Academic Calendar</h2>
              <p className="text-xs text-muted-foreground">March 2026 — Exam & Holiday Schedule</p>
            </div>
            <div className="flex gap-2">
              <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card hover:bg-muted transition-colors">&lt;</button>
              <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card hover:bg-muted transition-colors">&gt;</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-4 items-start">
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="grid grid-cols-7 gap-1.5 mb-3">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                  <div key={d} className="text-center text-[10px] font-semibold text-muted-foreground uppercase">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1.5">
                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                  let eventType: string | null = null
                  if (day >= 1 && day <= 5) eventType = "exam"
                  else if (day === 10) eventType = "holiday"
                  else if (day === 15) eventType = "event"
                  else if (day === 20) eventType = "deadline"
                  return (
                    <div key={day} className={cn(
                      "aspect-square rounded-lg border border-border/50 p-1 flex flex-col justify-between transition-colors cursor-pointer text-xs",
                      eventType ? "bg-secondary/20 hover:bg-secondary/40" : "bg-card hover:bg-secondary/10",
                      day === 28 && "border-primary/60 bg-primary/5"
                    )}>
                      <span className={cn(
                        "font-medium text-[11px]",
                        day === 28 ? "flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px]" : "text-foreground"
                      )}>{day}</span>
                      {eventType && (
                        <div className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          eventType === "exam" ? "bg-red-500" : eventType === "holiday" ? "bg-emerald-500" : eventType === "event" ? "bg-blue-500" : "bg-amber-500"
                        )} />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Upcoming Events</h3>
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
                      <div className={cn(
                        "h-2.5 w-2.5 rounded-full shrink-0",
                        cal.type === "exam" ? "bg-red-500" : cal.type === "holiday" ? "bg-emerald-500" : cal.type === "event" ? "bg-blue-500" : "bg-amber-500"
                      )} />
                      {i !== 4 && <div className="w-[1px] flex-1 bg-border mt-1" />}
                    </div>
                    <div className="pb-3">
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

      {/* Events Tab */}
      {activeTab === "events" && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="flex items-center justify-between rounded-xl border border-border bg-card p-5">
            <div>
              <h2 className="text-base font-semibold text-foreground">Campus Events</h2>
              <p className="text-xs text-muted-foreground">Discover and RSVP to upcoming events.</p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            {(["all", "upcoming", "past"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setEventFilter(f)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-colors",
                  eventFilter === f
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:bg-secondary"
                )}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Event Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event: any, i: number) => {
              const club = liveClubs.find((c: any) => c.name === event.club)
              const accent = club?.accent || "#dc2626"
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.06 }}
                  whileHover={{ y: -4 }}
                  className="rounded-xl border bg-card p-5 transition-shadow"
                  style={{ borderColor: `${accent}30` }}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold"
                      style={{ backgroundColor: `${accent}20`, color: accent }}
                    >
                      {event.club} Club
                    </span>
                    <span className={cn(
                      "text-[10px] font-medium",
                      event.status === "upcoming" ? "text-primary" : "text-muted-foreground"
                    )}>
                      {event.status}
                    </span>
                  </div>
                  <h3 className="mt-3 text-base font-semibold text-foreground">{event.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{event.description}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {event.date}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Users className="h-3.5 w-3.5" />
                      {event.registrations}
                    </div>
                  </div>
                  <div
                    className="mt-4 h-0.5 w-full rounded-full"
                    style={{ backgroundColor: `${accent}40` }}
                  />
                </motion.div>
              )
            })}
          </div>

          {filteredEvents.length === 0 && (
            <div className="rounded-xl border border-border bg-card p-12 text-center">
              <CalendarDays className="mx-auto h-8 w-8 text-muted-foreground/40" />
              <p className="mt-3 text-sm text-muted-foreground">No events found for this filter.</p>
            </div>
          )}

          {/* Event RSVP Section */}
          <div className="mt-6">
            <h2 className="text-base font-semibold text-foreground mb-4">Upcoming Events — RSVP</h2>
            <EventRSVP />
          </div>
        </motion.div>
      )}

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/15 text-xl font-bold text-primary">
                {student.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">{student.name}</h2>
                <p className="text-sm text-muted-foreground">{"email" in student ? student.email : (student as { user?: { email: string } }).user?.email ?? ""}</p>
              </div>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                { label: "Student ID", value: student.id },
                { label: "Department", value: student.department },
                { label: "Year", value: `${student.year}rd Year` },
                { label: "CGPA", value: student.cgpa.toString() },
                { label: "Attendance", value: `${student.attendance}%` },
                { label: "Residency", value: student.hostel ? "Hosteller" : "Day Scholar" },
              ].map((item) => (
                <div key={item.label} className="rounded-lg border border-border bg-secondary/30 px-4 py-3">
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="mt-0.5 text-sm font-medium text-foreground">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Lunch Ticket Dialog */}
      <AnimatePresence>
        {ticketDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
            onClick={() => setTicketDialog(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-sm rounded-xl border border-border bg-card p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setTicketDialog(false)}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                aria-label="Close dialog"
              >
                <X className="h-4 w-4" />
              </button>

              {!paymentSuccess ? (
                <div className="flex flex-col items-center py-4">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  <p className="mt-4 text-sm text-muted-foreground">Processing payment...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center py-2">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 15, stiffness: 200 }}
                  >
                    <CheckCircle2 className="h-12 w-12 text-emerald-600 dark:text-emerald-400" />
                  </motion.div>
                  <p className="mt-3 text-lg font-semibold text-foreground">Payment Successful!</p>
                  <p className="mt-1 text-sm text-muted-foreground">Lunch Ticket - Rs. 60</p>

                  {/* Fake QR Code */}
                  <div className="mt-4 rounded-lg border border-border bg-foreground/10 p-3">
                    <QrCode className="h-24 w-24 text-foreground" />
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">Show this QR at the mess counter</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Assignments Tab */}
      {activeTab === "assignments" && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <AssignmentPortal />
        </motion.div>
      )}

      {/* Campus Map Tab */}
      {activeTab === "campus map" && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <CampusMap />
        </motion.div>
      )}

      {/* Feedback Tab */}
      {activeTab === "feedback" && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <FeedbackPanel />
        </motion.div>
      )}

      {/* Report Card Tab */}
      {activeTab === "report card" && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <ReportCard />
        </motion.div>
      )}
    </DashboardShell>
  )
}

