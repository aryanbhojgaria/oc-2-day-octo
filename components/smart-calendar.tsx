"use client"

import { useState, useMemo } from "react"
import { useCalendarWithMutations, useCalendarConflicts, useExams, DataLoading } from "@/lib/hooks"
import type { CalendarEvent } from "@/lib/api"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import {
    ChevronLeft, ChevronRight, CalendarDays, Plus, X, Clock,
    AlertTriangle, Sparkles, CheckCircle2, GraduationCap,
    CreditCard, PartyPopper, TreePalm, Target, Bookmark, Zap
} from "lucide-react"

// ─── Types ───────────────────────────────────────────────────────
type CalendarRole = "admin" | "student" | "teacher" | "parent"

interface SmartCalendarProps {
    role: CalendarRole
}

// ─── Helpers ─────────────────────────────────────────────────────
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

const typeConfig: Record<string, { label: string; color: string; bg: string; gradient: string; Icon: typeof CalendarDays }> = {
    exam: { label: "Exam", color: "text-red-600 dark:text-red-400", bg: "bg-red-500", gradient: "from-red-500/20 to-red-600/5", Icon: GraduationCap },
    holiday: { label: "Holiday", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500", gradient: "from-emerald-500/20 to-emerald-600/5", Icon: TreePalm },
    event: { label: "Event", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-500", gradient: "from-blue-500/20 to-blue-600/5", Icon: PartyPopper },
    deadline: { label: "Deadline", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500", gradient: "from-amber-500/20 to-amber-600/5", Icon: Target },
    personal: { label: "Personal", color: "text-violet-600 dark:text-violet-400", bg: "bg-violet-500", gradient: "from-violet-500/20 to-violet-600/5", Icon: Bookmark },
    fee: { label: "Fee Due", color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-500", gradient: "from-orange-500/20 to-orange-600/5", Icon: CreditCard },
}

function getDaysInMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
    return new Date(year, month, 1).getDay()
}

function formatDateKey(year: number, month: number, day: number) {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
}

function daysUntil(dateStr: string) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const target = new Date(dateStr)
    target.setHours(0, 0, 0, 0)
    return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

// ─── Stagger animation variants ─────────────────────────────────
const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.03 } }
}

const dayVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 8 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", damping: 20, stiffness: 300 } }
}

const slideUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
}

// ─── Component ───────────────────────────────────────────────────
export function SmartCalendar({ role }: SmartCalendarProps) {
    const today = new Date()
    const [currentMonth, setCurrentMonth] = useState(today.getMonth())
    const [currentYear, setCurrentYear] = useState(today.getFullYear())
    const [selectedDay, setSelectedDay] = useState<number | null>(null)
    const [showAddModal, setShowAddModal] = useState(false)
    const [direction, setDirection] = useState(0) // -1 prev, 1 next
    const [hoveredDay, setHoveredDay] = useState<number | null>(null)

    // Form state
    const [formTitle, setFormTitle] = useState("")
    const [formDesc, setFormDesc] = useState("")
    const [formDate, setFormDate] = useState("")
    const [formEndDate, setFormEndDate] = useState("")
    const [formType, setFormType] = useState<string>(role === "student" ? "personal" : "event")
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Live data
    const calHook = useCalendarWithMutations()
    const conflictsHook = useCalendarConflicts()
    const { data: exams } = useExams()

    const liveEvents = calHook.data ?? []
    const conflicts = conflictsHook.data ?? []

    // Merge exams into calendar events for display
    const allEvents = useMemo(() => {
        const merged = [...liveEvents]
        if (exams) {
            for (const exam of exams) {
                const exists = merged.some(e => e.type === "exam" && e.date === exam.date && e.title.includes(exam.subject))
                if (!exists) {
                    merged.push({
                        id: `exam-${exam.id}`,
                        title: `📝 ${exam.subject} Exam`,
                        description: `${exam.time} — ${exam.duration} mins`,
                        date: exam.date,
                        endDate: null,
                        type: "exam",
                        color: null,
                        createdBy: "SYSTEM",
                        userId: null,
                        createdAt: exam.createdAt,
                        updatedAt: exam.createdAt,
                    } as CalendarEvent)
                }
            }
        }
        return merged
    }, [liveEvents, exams])

    // Build date→events map
    const eventsByDate = useMemo(() => {
        const map: Record<string, CalendarEvent[]> = {}
        for (const ev of allEvents) {
            const d = ev.date
            if (!map[d]) map[d] = []
            map[d].push(ev)
            if (ev.endDate && ev.endDate !== ev.date) {
                const start = new Date(ev.date)
                const end = new Date(ev.endDate)
                const cursor = new Date(start)
                cursor.setDate(cursor.getDate() + 1)
                while (cursor <= end) {
                    const key = cursor.toISOString().split("T")[0]
                    if (!map[key]) map[key] = []
                    map[key].push(ev)
                    cursor.setDate(cursor.getDate() + 1)
                }
            }
        }
        return map
    }, [allEvents])

    const conflictDates = useMemo(() => new Set(conflicts.map(c => c.date)), [conflicts])

    const daysInMonth = getDaysInMonth(currentYear, currentMonth)
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth)
    const todayKey = formatDateKey(today.getFullYear(), today.getMonth(), today.getDate())

    const prevMonth = () => {
        setDirection(-1)
        if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1) }
        else setCurrentMonth(m => m - 1)
        setSelectedDay(null)
    }
    const nextMonth = () => {
        setDirection(1)
        if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1) }
        else setCurrentMonth(m => m + 1)
        setSelectedDay(null)
    }

    const selectedDateKey = selectedDay ? formatDateKey(currentYear, currentMonth, selectedDay) : null
    const selectedEvents = selectedDateKey ? (eventsByDate[selectedDateKey] ?? []) : []

    const upcomingExams = useMemo(() => {
        if (!exams) return []
        return exams
            .map(e => ({ ...e, daysLeft: daysUntil(e.date) }))
            .filter(e => e.daysLeft >= 0 && e.daysLeft <= 30)
            .sort((a, b) => a.daysLeft - b.daysLeft)
    }, [exams])

    const handleCreate = async () => {
        if (!formTitle.trim() || !formDate) return
        setIsSubmitting(true)
        try {
            await calHook.create({
                title: formTitle,
                description: formDesc,
                date: formDate,
                endDate: formEndDate || null,
                type: formType as CalendarEvent["type"],
                color: null,
                createdBy: role.toUpperCase(),
                userId: role === "student" ? "current" : null,
            })
            setFormTitle("")
            setFormDesc("")
            setFormDate("")
            setFormEndDate("")
            setShowAddModal(false)
        } finally {
            setIsSubmitting(false)
        }
    }

    const canCreate = role === "admin" || role === "student"
    const canDelete = (ev: CalendarEvent) =>
        role === "admin" || (role === "student" && ev.type === "personal")

    const creatableTypes = role === "admin"
        ? ["exam", "holiday", "event", "deadline", "fee"]
        : ["personal", "deadline"]

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
        >
            {/* ═══ Animated Header ═══ */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", damping: 20, stiffness: 200 }}
                className="relative overflow-hidden rounded-xl border border-border bg-card p-5"
            >
                {/* Animated gradient background */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 animate-[shimmer_3s_ease-in-out_infinite]" />
                <div className="relative z-10 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
                            >
                                <CalendarDays className="h-5 w-5 text-primary" />
                            </motion.div>
                            <h2 className="text-base font-bold text-foreground">Academic Calendar</h2>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            {MONTHS[currentMonth]} {currentYear}
                            {role === "parent" && " — Ward's Schedule"}
                            {role === "teacher" && " — Teaching & Invigilation"}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        {canCreate && (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowAddModal(true)}
                                className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
                            >
                                <Plus className="h-4 w-4" />
                                {role === "student" ? "Add Deadline" : "Add Event"}
                            </motion.button>
                        )}
                        <motion.button
                            whileHover={{ scale: 1.15, x: -2 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={prevMonth}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card hover:bg-muted transition-colors"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.15, x: 2 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={nextMonth}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card hover:bg-muted transition-colors"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </motion.button>
                    </div>
                </div>
            </motion.div>

            {/* ═══ Countdown Badges with pulse ═══ */}
            <AnimatePresence mode="popLayout">
                {upcomingExams.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex flex-wrap gap-2"
                    >
                        {upcomingExams.map((exam, i) => (
                            <motion.div
                                key={exam.id}
                                initial={{ opacity: 0, scale: 0.5, x: -20 }}
                                animate={{ opacity: 1, scale: 1, x: 0 }}
                                transition={{ delay: i * 0.1, type: "spring", damping: 15 }}
                                whileHover={{ scale: 1.08, y: -2 }}
                                className={cn(
                                    "flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium backdrop-blur-md cursor-default",
                                    exam.daysLeft <= 3
                                        ? "border-red-500/40 bg-red-500/10 text-red-600 dark:text-red-400"
                                        : exam.daysLeft <= 7
                                            ? "border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                            : "border-border bg-secondary/30 text-muted-foreground"
                                )}
                            >
                                <motion.div
                                    animate={exam.daysLeft <= 3 ? { scale: [1, 1.3, 1] } : {}}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                    <GraduationCap className="h-3.5 w-3.5" />
                                </motion.div>
                                <span>{exam.subject}</span>
                                <span className={cn(
                                    "rounded-full px-2 py-0.5 text-[10px] font-bold",
                                    exam.daysLeft <= 3 ? "bg-red-500/20" : exam.daysLeft <= 7 ? "bg-amber-500/20" : "bg-background/80"
                                )}>
                                    {exam.daysLeft === 0 ? "🔥 TODAY" : `${exam.daysLeft}d left`}
                                </span>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ═══ Conflict Warnings ═══ */}
            <AnimatePresence>
                {conflicts.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, x: -30, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="rounded-xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 to-orange-500/5 p-3.5 flex items-start gap-2.5 backdrop-blur-md"
                    >
                        <motion.div
                            animate={{ rotate: [0, 15, -15, 0] }}
                            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
                        >
                            <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                        </motion.div>
                        <div>
                            <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                                ⚡ {conflicts.length} Schedule Conflict{conflicts.length > 1 ? "s" : ""} Detected
                            </p>
                            <p className="text-[10px] text-amber-600/80 dark:text-amber-400/80 mt-0.5">
                                {conflicts.map(c => {
                                    const d = new Date(c.date)
                                    return `${MONTHS[d.getMonth()].slice(0, 3)} ${d.getDate()}`
                                }).join(", ")} — Multiple events overlap.
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-4 items-start">
                {/* ═══ Calendar Grid ═══ */}
                <motion.div
                    layout
                    className="rounded-xl border border-border bg-card p-5 relative overflow-hidden"
                >
                    {/* Subtle animated background glow */}
                    <motion.div
                        className="absolute top-0 left-1/3 w-40 h-40 rounded-full bg-primary/5 blur-3xl"
                        animate={{ x: [0, 50, -50, 0], y: [0, 30, -30, 0] }}
                        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    />

                    {calHook.loading ? (
                        <DataLoading rows={4} />
                    ) : (
                        <div className="relative z-10">
                            {/* Day headers */}
                            <div className="grid grid-cols-7 gap-1.5 mb-3">
                                {DAYS.map((d, i) => (
                                    <motion.div
                                        key={d}
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.03 }}
                                        className="text-center text-[10px] font-semibold text-muted-foreground uppercase tracking-wider"
                                    >
                                        {d}
                                    </motion.div>
                                ))}
                            </div>

                            {/* Month transition wrapper */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={`${currentYear}-${currentMonth}`}
                                    initial={{ opacity: 0, x: direction * 60 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: direction * -60 }}
                                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                >
                                    <motion.div
                                        className="grid grid-cols-7 gap-1.5"
                                        variants={containerVariants}
                                        initial="hidden"
                                        animate="show"
                                    >
                                        {/* Empty cells */}
                                        {Array.from({ length: firstDay }).map((_, i) => (
                                            <motion.div key={`empty-${i}`} className="aspect-square" variants={dayVariants} />
                                        ))}

                                        {/* Day cells */}
                                        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                                            const dateKey = formatDateKey(currentYear, currentMonth, day)
                                            const dayEvents = eventsByDate[dateKey] ?? []
                                            const isToday = dateKey === todayKey
                                            const isSelected = selectedDay === day
                                            const isHovered = hoveredDay === day
                                            const hasConflict = conflictDates.has(dateKey)
                                            const uniqueTypes = [...new Set(dayEvents.map(e => e.type))]

                                            return (
                                                <motion.button
                                                    key={day}
                                                    variants={dayVariants}
                                                    whileHover={{ scale: 1.12, zIndex: 10 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => setSelectedDay(selectedDay === day ? null : day)}
                                                    onMouseEnter={() => setHoveredDay(day)}
                                                    onMouseLeave={() => setHoveredDay(null)}
                                                    className={cn(
                                                        "aspect-square rounded-xl border p-1 flex flex-col justify-between transition-all text-left relative group",
                                                        isSelected
                                                            ? "border-primary bg-primary/10 ring-2 ring-primary/40 shadow-lg shadow-primary/10"
                                                            : dayEvents.length > 0
                                                                ? "border-border/50 bg-secondary/20 hover:bg-secondary/40 hover:shadow-md"
                                                                : "border-border/20 bg-card hover:bg-secondary/10 hover:border-border/50",
                                                        isToday && !isSelected && "border-primary/60 bg-primary/5 shadow-sm shadow-primary/10",
                                                        hasConflict && "ring-1 ring-amber-500/50"
                                                    )}
                                                    style={{
                                                        transformOrigin: "center center",
                                                    }}
                                                >
                                                    <span className={cn(
                                                        "text-[11px] font-medium",
                                                        isToday
                                                            ? "flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold shadow-sm"
                                                            : "text-foreground"
                                                    )}>{day}</span>

                                                    {uniqueTypes.length > 0 && (
                                                        <motion.div
                                                            className="flex gap-0.5 flex-wrap"
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            transition={{ delay: 0.2 }}
                                                        >
                                                            {uniqueTypes.slice(0, 3).map(type => (
                                                                <motion.div
                                                                    key={type}
                                                                    className={cn("h-1.5 w-1.5 rounded-full", typeConfig[type]?.bg ?? "bg-primary")}
                                                                    animate={isHovered ? { scale: [1, 1.5, 1] } : {}}
                                                                    transition={{ duration: 0.4 }}
                                                                />
                                                            ))}
                                                        </motion.div>
                                                    )}

                                                    {hasConflict && (
                                                        <motion.div
                                                            className="absolute -top-0.5 -right-0.5"
                                                            animate={{ scale: [1, 1.2, 1] }}
                                                            transition={{ duration: 1.5, repeat: Infinity }}
                                                        >
                                                            <AlertTriangle className="h-2.5 w-2.5 text-amber-500 drop-shadow" />
                                                        </motion.div>
                                                    )}

                                                    {/* Hover tooltip preview */}
                                                    <AnimatePresence>
                                                        {isHovered && dayEvents.length > 0 && !isSelected && (
                                                            <motion.div
                                                                initial={{ opacity: 0, y: 4, scale: 0.9 }}
                                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                                exit={{ opacity: 0, y: 4, scale: 0.9 }}
                                                                className="absolute -bottom-1 left-1/2 -translate-x-1/2 translate-y-full z-20 w-36 rounded-lg bg-card border border-border shadow-xl p-2 pointer-events-none"
                                                            >
                                                                {dayEvents.slice(0, 2).map((ev, j) => (
                                                                    <p key={j} className="text-[9px] text-foreground truncate">{ev.title}</p>
                                                                ))}
                                                                {dayEvents.length > 2 && (
                                                                    <p className="text-[9px] text-muted-foreground">+{dayEvents.length - 2} more</p>
                                                                )}
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </motion.button>
                                            )
                                        })}
                                    </motion.div>
                                </motion.div>
                            </AnimatePresence>

                            {/* Legend with animation */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="mt-4 flex flex-wrap gap-3 border-t border-border/50 pt-3"
                            >
                                {Object.entries(typeConfig).map(([key, cfg], i) => (
                                    <motion.div
                                        key={key}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.6 + i * 0.05 }}
                                        className="flex items-center gap-1.5"
                                    >
                                        <div className={cn("h-2 w-2 rounded-full", cfg.bg)} />
                                        <span className="text-[10px] text-muted-foreground capitalize">{cfg.label}</span>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>
                    )}
                </motion.div>

                {/* ═══ Side Panel: Day Detail / Upcoming ═══ */}
                <motion.div
                    layout
                    className="rounded-xl border border-border bg-card p-5 relative overflow-hidden"
                >
                    {/* Glass shimmer */}
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-primary/3 to-transparent"
                        animate={{ opacity: [0.3, 0.7, 0.3] }}
                        transition={{ duration: 4, repeat: Infinity }}
                    />

                    <div className="relative z-10">
                        <AnimatePresence mode="wait">
                            {selectedDay && selectedDateKey ? (
                                <motion.div
                                    key={`detail-${selectedDateKey}`}
                                    {...slideUp}
                                    transition={{ type: "spring", damping: 20 }}
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-sm font-bold text-foreground">
                                            {MONTHS[currentMonth]} {selectedDay}, {currentYear}
                                        </h3>
                                        <motion.button
                                            whileHover={{ rotate: 90, scale: 1.2 }}
                                            whileTap={{ scale: 0.8 }}
                                            onClick={() => setSelectedDay(null)}
                                            className="text-muted-foreground hover:text-foreground"
                                        >
                                            <X className="h-4 w-4" />
                                        </motion.button>
                                    </div>

                                    {selectedEvents.length === 0 ? (
                                        <motion.div
                                            className="py-6 text-center"
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                        >
                                            <motion.div
                                                animate={{ y: [0, -5, 0] }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                            >
                                                <CalendarDays className="h-10 w-10 text-muted-foreground/20 mx-auto mb-2" />
                                            </motion.div>
                                            <p className="text-sm text-muted-foreground">No events on this day</p>
                                            {canCreate && (
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => {
                                                        setFormDate(selectedDateKey)
                                                        setShowAddModal(true)
                                                    }}
                                                    className="mt-3 text-xs text-primary font-semibold hover:underline flex items-center gap-1 mx-auto"
                                                >
                                                    <Plus className="h-3 w-3" />
                                                    Add an event
                                                </motion.button>
                                            )}
                                        </motion.div>
                                    ) : (
                                        <div className="space-y-3">
                                            {selectedEvents.map((ev, i) => {
                                                const cfg = typeConfig[ev.type] ?? typeConfig.event
                                                return (
                                                    <motion.div
                                                        key={`${ev.id}-${i}`}
                                                        initial={{ opacity: 0, x: 20, scale: 0.9 }}
                                                        animate={{ opacity: 1, x: 0, scale: 1 }}
                                                        transition={{ delay: i * 0.08, type: "spring", damping: 18 }}
                                                        whileHover={{ scale: 1.02, x: 4 }}
                                                        className={cn(
                                                            "rounded-xl border border-border bg-gradient-to-r p-3 relative group cursor-default",
                                                            cfg.gradient
                                                        )}
                                                    >
                                                        <div className="flex items-start gap-2.5">
                                                            <motion.div
                                                                className={cn("mt-0.5 flex h-7 w-7 items-center justify-center rounded-lg", cfg.bg + "/15")}
                                                                whileHover={{ rotate: 15 }}
                                                            >
                                                                <cfg.Icon className={cn("h-3.5 w-3.5", cfg.color)} />
                                                            </motion.div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-semibold text-foreground">{ev.title}</p>
                                                                {ev.description && (
                                                                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{ev.description}</p>
                                                                )}
                                                                <div className="mt-1.5 flex items-center gap-2">
                                                                    <span className={cn("rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider", cfg.bg + "/15", cfg.color)}>
                                                                        {cfg.label}
                                                                    </span>
                                                                    {ev.endDate && ev.endDate !== ev.date && (
                                                                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                                                            <Clock className="h-2.5 w-2.5" />
                                                                            Until {new Date(ev.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {canDelete(ev) && (
                                                            <motion.button
                                                                initial={{ opacity: 0, scale: 0 }}
                                                                whileHover={{ scale: 1.1 }}
                                                                onClick={() => calHook.remove(ev.id)}
                                                                className="absolute top-2 right-2 hidden group-hover:flex h-5 w-5 items-center justify-center rounded-md bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                                                            >
                                                                <X className="h-3 w-3" />
                                                            </motion.button>
                                                        )}
                                                    </motion.div>
                                                )
                                            })}
                                        </div>
                                    )}
                                </motion.div>
                            ) : (
                                <motion.div key="upcoming" {...slideUp}>
                                    <div className="flex items-center gap-2 mb-4">
                                        <Zap className="h-3.5 w-3.5 text-primary" />
                                        <h3 className="text-sm font-bold text-foreground">Upcoming</h3>
                                    </div>
                                    <div className="space-y-4">
                                        {allEvents
                                            .filter(e => {
                                                const d = new Date(e.date)
                                                return d >= today || (e.endDate && new Date(e.endDate) >= today)
                                            })
                                            .slice(0, 6)
                                            .map((ev, i) => {
                                                const cfg = typeConfig[ev.type] ?? typeConfig.event
                                                return (
                                                    <motion.div
                                                        key={`${ev.id}-${i}`}
                                                        className="flex gap-3"
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: i * 0.08 }}
                                                        whileHover={{ x: 4 }}
                                                    >
                                                        <div className="flex flex-col items-center pt-1">
                                                            <motion.div
                                                                className={cn("h-2.5 w-2.5 rounded-full shrink-0", cfg.bg)}
                                                                whileHover={{ scale: 1.5 }}
                                                            />
                                                            {i !== 5 && <div className="w-[1px] flex-1 bg-border mt-1" />}
                                                        </div>
                                                        <div className="pb-3 min-w-0">
                                                            <p className="text-sm font-medium text-foreground truncate">{ev.title}</p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {new Date(ev.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                                                {ev.endDate && ev.endDate !== ev.date && (
                                                                    <> — {new Date(ev.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</>
                                                                )}
                                                            </p>
                                                        </div>
                                                    </motion.div>
                                                )
                                            })}
                                        {allEvents.length === 0 && (
                                            <p className="text-sm text-muted-foreground text-center py-4">No upcoming events</p>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>

            {/* ═══ Teacher Invigilation ═══ */}
            {role === "teacher" && exams && exams.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, type: "spring" }}
                    className="rounded-xl border border-border bg-card p-5 relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/3 to-transparent" />
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4">
                            <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }}>
                                <Sparkles className="h-4 w-4 text-primary" />
                            </motion.div>
                            <h3 className="text-sm font-bold text-foreground">Exam Invigilation Duties</h3>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                            {exams.map((exam, i) => {
                                const dl = daysUntil(exam.date)
                                return (
                                    <motion.div
                                        key={exam.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 + i * 0.1 }}
                                        whileHover={{ scale: 1.03, y: -2 }}
                                        className="rounded-xl border border-border bg-gradient-to-r from-secondary/30 to-transparent p-4 flex items-center justify-between cursor-default"
                                    >
                                        <div>
                                            <p className="text-sm font-semibold text-foreground">{exam.subject}</p>
                                            <p className="text-xs text-muted-foreground mt-0.5">{exam.date} • {exam.time}</p>
                                        </div>
                                        <motion.span
                                            className={cn(
                                                "rounded-full px-2.5 py-1 text-[10px] font-bold",
                                                dl <= 3 ? "bg-red-500/15 text-red-600 dark:text-red-400" :
                                                    dl <= 7 ? "bg-amber-500/15 text-amber-600 dark:text-amber-400" :
                                                        "bg-secondary text-muted-foreground"
                                            )}
                                            animate={dl <= 3 ? { scale: [1, 1.1, 1] } : {}}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                        >
                                            {dl === 0 ? "🔥 TODAY" : dl < 0 ? "✅ DONE" : `${dl}d`}
                                        </motion.span>
                                    </motion.div>
                                )
                            })}
                        </div>
                    </div>
                </motion.div>
            )}

            {/* ═══ Add Event Modal ═══ */}
            <AnimatePresence>
                {showAddModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
                        onClick={() => setShowAddModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.7, opacity: 0, y: 40, rotateX: 10 }}
                            animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
                            exit={{ scale: 0.7, opacity: 0, y: 40 }}
                            transition={{ type: "spring", damping: 22, stiffness: 250 }}
                            className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl"
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Modal glow */}
                            <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-primary/20 via-transparent to-primary/10 -z-10 blur-sm" />

                            <motion.button
                                whileHover={{ rotate: 90, scale: 1.2 }}
                                whileTap={{ scale: 0.8 }}
                                onClick={() => setShowAddModal(false)}
                                className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
                            >
                                <X className="h-4 w-4" />
                            </motion.button>

                            <div className="flex items-center gap-2 mb-5">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15">
                                    <CalendarDays className="h-4 w-4 text-primary" />
                                </div>
                                <h3 className="text-base font-bold text-foreground">
                                    {role === "student" ? "Add Personal Deadline" : "Add Calendar Event"}
                                </h3>
                            </div>

                            <motion.div
                                className="space-y-3"
                                initial="hidden"
                                animate="show"
                                variants={{
                                    hidden: {},
                                    show: { transition: { staggerChildren: 0.06 } }
                                }}
                            >
                                <motion.input
                                    variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
                                    value={formTitle}
                                    onChange={e => setFormTitle(e.target.value)}
                                    placeholder="Event title"
                                    className="w-full rounded-xl border border-border bg-input px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                                />
                                <motion.textarea
                                    variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
                                    value={formDesc}
                                    onChange={e => setFormDesc(e.target.value)}
                                    placeholder="Description (optional)"
                                    rows={2}
                                    className="w-full resize-none rounded-xl border border-border bg-input px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                                />
                                <motion.div
                                    variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
                                    className="grid grid-cols-2 gap-3"
                                >
                                    <div>
                                        <label className="text-xs font-medium text-muted-foreground">Start Date</label>
                                        <input
                                            type="date"
                                            value={formDate}
                                            onChange={e => setFormDate(e.target.value)}
                                            className="mt-1 w-full rounded-xl border border-border bg-input px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-muted-foreground">End Date</label>
                                        <input
                                            type="date"
                                            value={formEndDate}
                                            onChange={e => setFormEndDate(e.target.value)}
                                            className="mt-1 w-full rounded-xl border border-border bg-input px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none transition-colors"
                                        />
                                    </div>
                                </motion.div>
                                <motion.div variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}>
                                    <label className="text-xs font-medium text-muted-foreground">Type</label>
                                    <div className="mt-1.5 flex flex-wrap gap-2">
                                        {creatableTypes.map(t => {
                                            const cfg = typeConfig[t]
                                            return (
                                                <motion.button
                                                    key={t}
                                                    whileHover={{ scale: 1.08 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => setFormType(t)}
                                                    className={cn(
                                                        "flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition-all border",
                                                        formType === t
                                                            ? `${cfg.bg}/15 ${cfg.color} border-current shadow-sm`
                                                            : "border-border text-muted-foreground hover:bg-secondary"
                                                    )}
                                                >
                                                    <cfg.Icon className="h-3 w-3" />
                                                    {cfg.label}
                                                </motion.button>
                                            )
                                        })}
                                    </div>
                                </motion.div>
                                <motion.button
                                    variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleCreate}
                                    disabled={isSubmitting || !formTitle.trim() || !formDate}
                                    className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-primary/25"
                                >
                                    {isSubmitting ? (
                                        <motion.span
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            className="h-4 w-4 rounded-full border-2 border-primary-foreground border-t-transparent"
                                        />
                                    ) : (
                                        <CheckCircle2 className="h-4 w-4" />
                                    )}
                                    {isSubmitting ? "Creating..." : "Add to Calendar"}
                                </motion.button>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}
