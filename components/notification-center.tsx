"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bell, X, Check, AlertTriangle, Info, Calendar, CreditCard, BellOff } from "lucide-react"
import { cn } from "@/lib/utils"
import { useDND } from "@/components/dnd-context"

interface Toast {
    id: number
    title: string
    message: string
    type: "info" | "warning" | "success"
    icon: typeof Bell
}

const toastQueue: Omit<Toast, "id">[] = [
    { title: "Exam Reminder", message: "Mid-semester exams start in 15 days", type: "warning", icon: AlertTriangle },
    { title: "Fee Due", message: "Library fee payment due tomorrow", type: "warning", icon: CreditCard },
    { title: "Event Today", message: "Rhythm Night starts at 6 PM", type: "info", icon: Calendar },
    { title: "Attendance Updated", message: "Your attendance is now 87%", type: "success", icon: Check },
]

interface NotificationItem {
    id: string
    title: string
    message: string
    time: string
    read: boolean
    type: "announcement" | "event" | "fee" | "attendance"
}

const allNotifications: NotificationItem[] = [
    { id: "1", title: "Mid-Semester Exams", message: "Exam schedule released for March 15th", time: "5 min ago", read: false, type: "announcement" },
    { id: "2", title: "TechnoVerse 2026", message: "Registration deadline extended to March 5th", time: "1 hour ago", read: false, type: "event" },
    { id: "3", title: "Library Fee", message: "Payment of ₹2,000 due tomorrow", time: "3 hours ago", read: true, type: "fee" },
    { id: "4", title: "Attendance Alert", message: "CN attendance dropped below 80%", time: "Yesterday", read: true, type: "attendance" },
    { id: "5", title: "Placement Drive", message: "Infosys drive on March 25th — register now", time: "Yesterday", read: true, type: "announcement" },
    { id: "6", title: "Hostel Fee", message: "₹45,000 due by April 10th", time: "2 days ago", read: true, type: "fee" },
    { id: "7", title: "Cultural Night", message: "Registrations open for performances", time: "3 days ago", read: true, type: "event" },
    { id: "8", title: "Room Inspection", message: "Scheduled for March 1st", time: "3 days ago", read: true, type: "announcement" },
]

export function NotificationCenter() {
    const [panelOpen, setPanelOpen] = useState(false)
    const [toasts, setToasts] = useState<Toast[]>([])
    const [notifications, setNotifications] = useState(allNotifications)
    const [toastIndex, setToastIndex] = useState(0)
    const { dndEnabled } = useDND()

    const unreadCount = notifications.filter((n) => !n.read).length

    const dismissToast = useCallback((id: number) => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
    }, [])

    // Auto-show toasts (suppressed when DND is on)
    useEffect(() => {
        if (toastIndex >= toastQueue.length) return
        if (dndEnabled) return
        const timer = setTimeout(() => {
            const toast = { ...toastQueue[toastIndex], id: Date.now() }
            setToasts((prev) => [...prev.slice(-2), toast])
            setToastIndex((i) => i + 1)
            // Auto-dismiss after 4s
            setTimeout(() => dismissToast(toast.id), 4000)
        }, 3000 + toastIndex * 5000)
        return () => clearTimeout(timer)
    }, [toastIndex, dismissToast, dndEnabled])

    const markAllRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    }

    const markRead = (id: string) => {
        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
    }

    const typeIcon = (type: string) => {
        switch (type) {
            case "event": return Calendar
            case "fee": return CreditCard
            case "attendance": return AlertTriangle
            default: return Info
        }
    }

    return (
        <>
            {/* Bell trigger */}
            <button
                onClick={() => setPanelOpen(!panelOpen)}
                className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                aria-label="Notifications"
            >
                {dndEnabled ? <BellOff className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
                {unreadCount > 0 && (
                    <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground"
                    >
                        {unreadCount}
                    </motion.span>
                )}
            </button>

            {/* Sliding Panel */}
            <AnimatePresence>
                {panelOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[90] bg-black/30"
                            onClick={() => setPanelOpen(false)}
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 250 }}
                            className="fixed right-0 top-0 z-[95] flex h-full w-full max-w-sm flex-col border-l border-border bg-card shadow-2xl"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between border-b border-border px-5 py-4">
                                <div>
                                    <h2 className="text-base font-semibold text-foreground">Notifications</h2>
                                    <p className="text-xs text-muted-foreground">{unreadCount} unread</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {unreadCount > 0 && (
                                        <button onClick={markAllRead} className="text-xs font-medium text-primary hover:underline">
                                            Mark all read
                                        </button>
                                    )}
                                    <button onClick={() => setPanelOpen(false)} className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground transition-colors">
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Notification list */}
                            <div className="flex-1 overflow-y-auto">
                                {notifications.map((n) => {
                                    const Icon = typeIcon(n.type)
                                    return (
                                        <motion.button
                                            key={n.id}
                                            onClick={() => markRead(n.id)}
                                            className={cn(
                                                "flex w-full items-start gap-3 border-b border-border px-5 py-4 text-left transition-colors hover:bg-secondary/30",
                                                !n.read && "bg-primary/5"
                                            )}
                                            whileTap={{ scale: 0.99 }}
                                        >
                                            <div className={cn(
                                                "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                                                !n.read ? "bg-primary/15 text-primary" : "bg-secondary text-muted-foreground"
                                            )}>
                                                <Icon className="h-4 w-4" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <p className={cn("text-sm font-medium", !n.read ? "text-foreground" : "text-muted-foreground")}>{n.title}</p>
                                                    {!n.read && <span className="h-2 w-2 rounded-full bg-primary" />}
                                                </div>
                                                <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{n.message}</p>
                                                <p className="mt-1 text-[10px] text-muted-foreground/60">{n.time}</p>
                                            </div>
                                        </motion.button>
                                    )
                                })}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Toast Stack */}
            <div className="fixed bottom-20 right-6 z-[80] flex flex-col gap-2">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, x: 80, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 80, scale: 0.9 }}
                            transition={{ type: "spring", damping: 20 }}
                            className={cn(
                                "flex w-80 items-start gap-3 rounded-xl border bg-card p-4 shadow-xl",
                                toast.type === "warning" ? "border-amber-500/30" : toast.type === "success" ? "border-emerald-500/30" : "border-border"
                            )}
                        >
                            <div className={cn(
                                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                                toast.type === "warning" ? "bg-amber-500/15 text-amber-500" :
                                    toast.type === "success" ? "bg-emerald-500/15 text-emerald-500" :
                                        "bg-primary/15 text-primary"
                            )}>
                                <toast.icon className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground">{toast.title}</p>
                                <p className="mt-0.5 text-xs text-muted-foreground">{toast.message}</p>
                            </div>
                            <button onClick={() => dismissToast(toast.id)} className="shrink-0 rounded p-1 text-muted-foreground hover:text-foreground">
                                <X className="h-3 w-3" />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </>
    )
}
