"use client"

import { useState, useEffect } from "react"
import { DashboardShell } from "@/components/layout/dashboard-shell"
import { students, marks, past15Days, studentHistoricalAttendance, timetable } from "@/lib/mock-data"
import { useStudents, useMarks, useTimetable, DataLoading } from "@/lib/hooks"
import { BookOpen, Users, FileText, QrCode, CheckCircle2, Ticket, Bus, Home, Clock, Check, X, Map, Shield, Calendar, Award, ListChecks, CalendarDays, UserCheck, BarChart3 } from "lucide-react"
import { TeacherAssignments } from "@/components/teacher-assignments"
import { FeedbackPanel } from "@/components/feedback-panel"
import { CampusMap } from "@/components/campus-map"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "Timetable", href: "/dashboard/teacher", icon: CalendarDays },
  { label: "Attendance", href: "/dashboard/teacher", icon: UserCheck },
  { label: "Grades", href: "/dashboard/teacher", icon: BarChart3 },
  { label: "Assignments", href: "/dashboard/teacher", icon: FileText },
  { label: "Calendar", href: "/dashboard/teacher", icon: CalendarDays },
  { label: "Campus Map", href: "/dashboard/teacher", icon: Map },
  { label: "Feedback", href: "/dashboard/teacher", icon: Shield },
  { label: "Bus Schedule", href: "/dashboard/teacher", icon: Bus },
]

const busSchedule = [
  { route: "Route A - City Center", departure: "7:30 AM", arrival: "8:15 AM" },
  { route: "Route B - Railway Station", departure: "7:15 AM", arrival: "8:20 AM" },
  { route: "Route C - Suburb East", departure: "7:00 AM", arrival: "8:10 AM" },
  { route: "Route D - Highway Junction", departure: "7:45 AM", arrival: "8:30 AM" },
]

export default function TeacherDashboardPage() {
  const [attendance, setAttendance] = useState<Record<string, boolean>>(
    Object.fromEntries(students.map((s) => [s.id, true]))
  )
  const [histAttendance, setHistAttendance] = useState<Record<string, boolean[]>>(studentHistoricalAttendance)
  const [activeTab, setActiveTab] = useState<"timetable" | "attendance" | "grades" | "assignments" | "calendar" | "campus map" | "feedback" | "bus schedule">("timetable")

  // Live data
  const studentsHook = useStudents()
  const marksHook = useMarks()
  const timetableHook = useTimetable("TEACHER")

  const liveStudents = studentsHook.data ?? students
  const liveMarks = marksHook.data ?? marks
  const liveTimetable = (timetableHook.data && timetableHook.data.length > 0)
    ? timetableHook.data
    : timetable.filter(t => t.role === "teacher" || !t.role);

  console.log("TEACHER TIMETABLE DEBUG:", {
    hookData: timetableHook.data,
    fallbackDataLength: timetable.filter(t => t.role === "teacher").length,
    finalRender: liveTimetable
  });

  const toggleAttendance = (id: string) => {
    setAttendance((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const toggleHistoricalAttendance = (studentId: string, dayIndex: number) => {
    setHistAttendance((prev) => {
      const currentRecord = prev[studentId];
      const newRecord = currentRecord ? [...currentRecord] : Array(15).fill(false);
      newRecord[dayIndex] = !newRecord[dayIndex];
      return { ...prev, [studentId]: newRecord };
    });
  }

  const [editableMarks, setEditableMarks] = useState<Record<string, any>>(
    Object.fromEntries(students.map((s, i) => [s.id, { ...marks[i % marks.length] }]))
  )

  useEffect(() => {
    if (liveStudents.length > 0) {
      setAttendance(prev => {
        const next = { ...prev };
        liveStudents.forEach(s => {
          if (next[s.id] === undefined) next[s.id] = true;
        });
        return next;
      });

      setHistAttendance(prev => {
        const next = { ...prev };
        liveStudents.forEach(s => {
          if (!next[s.id]) next[s.id] = Array(15).fill(false);
        });
        return next;
      });

      setEditableMarks(prev => {
        const next = { ...prev };
        liveStudents.forEach((s, i) => {
          if (!next[s.id]) next[s.id] = { ...marks[i % marks.length] };
        });
        return next;
      });
    }
  }, [liveStudents])

  const handleMarkChange = (studentId: string, field: string, value: string) => {
    const numValue = parseInt(value) || 0;
    setEditableMarks(prev => {
      const studentMarks = { ...prev[studentId], [field]: numValue };
      const total = studentMarks.internal1 + studentMarks.internal2 + studentMarks.assignment;
      let grade = 'F';
      if (total >= 90) grade = 'A+';
      else if (total >= 80) grade = 'A';
      else if (total >= 70) grade = 'B+';
      else if (total >= 60) grade = 'B';
      else if (total >= 50) grade = 'C';

      return { ...prev, [studentId]: { ...studentMarks, total, grade } };
    });
  }

  return (
    <DashboardShell role="teacher" navItems={navItems} activeNav={activeTab} onNavClick={(label) => setActiveTab(label as typeof activeTab)}>
      {/* Tab Switcher */}
      <div className="mb-6 flex flex-wrap gap-2">
        {(["timetable", "attendance", "grades", "assignments", "calendar", "campus map", "feedback", "bus schedule"] as const).map((tab) => (
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

      {/* Timetable Tab - includes table + builder */}
      {activeTab === "timetable" && (
        <>

          {/* Timetable Table */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="overflow-x-auto rounded-xl border border-border bg-card"
          >
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Day</th>
                  {["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "2:00 PM"].map((time) => (
                    <th key={time} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {time}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(liveTimetable as Array<{ day: string; slots: any }>).map((row) => {
                  let parsedSlots = row.slots;
                  if (typeof parsedSlots === 'string') {
                    try { parsedSlots = JSON.parse(parsedSlots); } catch (e) { parsedSlots = []; }
                  }
                  if (!Array.isArray(parsedSlots)) parsedSlots = [];

                  return (
                    <tr key={row.day} className="border-b border-border/50 last:border-0">
                      <td className="px-4 py-3 text-sm font-medium text-foreground">{row.day}</td>
                      {parsedSlots.map((slot: any, i: number) => (
                        <td key={i} className="px-4 py-3">
                          <div className={cn(
                            "rounded-lg px-2.5 py-1.5",
                            slot.subject === "Break"
                              ? "bg-muted text-muted-foreground"
                              : "bg-primary/10"
                          )}>
                            <div className={cn(
                              "inline-flex items-center gap-1.5 text-xs font-medium",
                              slot.subject === "Break" ? "text-muted-foreground" : "text-primary"
                            )}>
                              {slot.subject !== "Break" && <Clock className="h-3 w-3" />}
                              {slot.subject}
                            </div>
                            {slot.room && (
                              <div className="mt-0.5 text-[10px] font-medium text-muted-foreground tracking-wide">
                                📍 {slot.room}
                              </div>
                            )}
                          </div>
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </motion.div>
        </>
      )}

      {/* Attendance */}
      {activeTab === "attendance" && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between rounded-xl border border-border bg-card p-5">
            <div>
              <h2 className="text-base font-semibold text-foreground">Attendance Register</h2>
              <p className="text-xs text-muted-foreground">Tracking last 15 days for Data Structures</p>
            </div>
            <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
              <CheckCircle2 className="h-4 w-4" /> Save Changes
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="sticky left-0 bg-muted/80 backdrop-blur-sm p-4 text-left font-semibold text-foreground border-r border-border min-w-[200px] z-10">Student</th>
                  <th className="p-4 text-center font-semibold text-foreground min-w-[100px] border-r border-border">Overall %</th>
                  {past15Days.map(date => (
                    <th key={date} className="p-4 text-center text-xs font-semibold text-muted-foreground min-w-[60px] whitespace-nowrap">
                      {new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {liveStudents.map((student) => {
                  const record = histAttendance[student.id] || Array(15).fill(false)
                  const presentCount = record.filter(Boolean).length
                  const percentage = Math.round((presentCount / 15) * 100)
                  return (
                    <tr key={student.id} className="border-b border-border/50 last:border-0 hover:bg-muted/10 transition-colors">
                      <td className="sticky left-0 bg-card p-4 border-r border-border/50 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] z-10">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary shrink-0">
                            {student.name.split(" ").map((n) => n[0]).join("")}
                          </div>
                          <div>
                            <p className="font-medium text-foreground text-sm line-clamp-1">{student.name}</p>
                            <p className="text-[10px] text-muted-foreground">{student.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 border-r border-border/50 text-center bg-card/50">
                        <div className="flex flex-col items-center gap-1.5">
                          <span className={cn(
                            "font-semibold text-sm",
                            percentage >= 75 ? "text-emerald-500" : percentage >= 60 ? "text-amber-500" : "text-red-500"
                          )}>{percentage}%</span>
                          <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              className={cn(
                                "h-full rounded-full",
                                percentage >= 75 ? "bg-emerald-500" : percentage >= 60 ? "bg-amber-500" : "bg-red-500"
                              )}
                            />
                          </div>
                        </div>
                      </td>
                      {record.map((isPresent, i) => (
                        <td key={i} className="p-2 text-center bg-card/50">
                          <button
                            onClick={() => toggleHistoricalAttendance(student.id, i)}
                            className={cn(
                              "h-8 w-8 rounded-lg flex items-center justify-center mx-auto transition-all focus:outline-none focus:ring-2 focus:ring-primary/50",
                              isPresent
                                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/25"
                                : "bg-red-500/15 text-red-600 dark:text-red-400 hover:bg-red-500/25"
                            )}
                          >
                            {isPresent ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                          </button>
                        </td>
                      ))}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Grades */}
      {activeTab === "grades" && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-border bg-card p-5">
            <div>
              <h2 className="text-base font-semibold text-foreground">Student Grades</h2>
              <p className="text-xs text-muted-foreground">Data Structures - Semester 6</p>
            </div>
            <div className="flex w-full sm:w-auto gap-2">
              <label className="flex flex-1 sm:flex-none cursor-pointer items-center justify-center gap-2 rounded-lg border border-border bg-secondary/50 px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary/80 transition-colors">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Upload Marksheet</span>
                <span className="sm:hidden">Upload</span>
                <input type="file" className="hidden" accept=".csv,.xlsx" />
              </label>
              <button className="flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                <CheckCircle2 className="h-4 w-4" />
                <span className="hidden sm:inline">Save Grades</span>
                <span className="sm:hidden">Save</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-border bg-card">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground min-w-[200px]">Student</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Internal 1 (50)</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Internal 2 (50)</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Assignment (20)</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total (120)</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Grade</th>
                </tr>
              </thead>
              <tbody>
                {liveStudents.map((student) => {
                  const m = editableMarks[student.id] || { internal1: 0, internal2: 0, assignment: 0, total: 0, grade: 'N/A' }
                  return (
                    <tr key={student.id} className="border-b border-border/50 last:border-0 hover:bg-muted/10 transition-colors focus-within:bg-muted/20">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                            {student.name.split(" ").map((n: string) => n[0]).join("")}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{student.name}</p>
                            <p className="text-[10px] text-muted-foreground">{student.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          min="0" max="50"
                          value={m.internal1}
                          onChange={(e) => handleMarkChange(student.id, 'internal1', e.target.value)}
                          className="w-16 mx-auto block rounded-md border border-border bg-background px-2 py-1.5 text-center text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          min="0" max="50"
                          value={m.internal2}
                          onChange={(e) => handleMarkChange(student.id, 'internal2', e.target.value)}
                          className="w-16 mx-auto block rounded-md border border-border bg-background px-2 py-1.5 text-center text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          min="0" max="20"
                          value={m.assignment}
                          onChange={(e) => handleMarkChange(student.id, 'assignment', e.target.value)}
                          className="w-16 mx-auto block rounded-md border border-border bg-background px-2 py-1.5 text-center text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </td>
                      <td className="px-4 py-3 text-center text-sm font-bold text-foreground">
                        {m.total}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={cn(
                          "rounded-md px-2 py-1 text-xs font-bold uppercase tracking-wider",
                          m.grade === 'A+' ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" :
                            m.grade === 'A' ? "bg-emerald-500/10 text-emerald-500" :
                              m.grade.includes('B') ? "bg-amber-500/15 text-amber-600 dark:text-amber-400" :
                                m.grade === 'N/A' ? "bg-muted/50 text-muted-foreground" :
                                  "bg-red-500/15 text-red-600 dark:text-red-400"
                        )}>
                          {m.grade}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Bus Schedule */}
      {activeTab === "bus schedule" && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <h2 className="text-base font-semibold text-foreground">Campus Bus Schedule</h2>
          {busSchedule.map((bus, i) => (
            <div key={i} className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <Bus className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{bus.route}</p>
                  <p className="text-xs text-muted-foreground">Daily Service</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-foreground">{bus.departure} - {bus.arrival}</p>
                <p className="text-xs text-muted-foreground">On Time</p>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {/* Assignments Tab */}
      {activeTab === "assignments" && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <TeacherAssignments />
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

      {/* Calendar Tab */}
      {activeTab === "calendar" && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="flex items-center justify-between rounded-xl border border-border bg-card p-5">
            <div>
              <h2 className="text-base font-semibold text-foreground">Academic Calendar</h2>
              <p className="text-xs text-muted-foreground">March 2026 &mdash; Exam &amp; Holiday Schedule</p>
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
                      "aspect-square rounded-lg border border-border/50 p-1 flex flex-col justify-between transition-colors cursor-pointer",
                      eventType ? "bg-secondary/20 hover:bg-secondary/40" : "bg-card hover:bg-secondary/10",
                      day === 28 && "border-primary/60 bg-primary/5"
                    )}>
                      <span className={cn(
                        "text-[11px] font-medium",
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
                  { date: "Mar 20", event: "Projects Due", type: "deadline" },
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
    </DashboardShell>
  )
}

