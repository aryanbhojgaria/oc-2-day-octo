"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare, Send, AlertCircle, CheckCircle, Clock, Bug, Lightbulb, Shield } from "lucide-react"
import { cn } from "@/lib/utils"

interface FeedbackItem {
    id: string
    category: "bug" | "suggestion" | "complaint" | "general"
    subject: string
    message: string
    status: "sent" | "reviewing" | "resolved"
    timestamp: string
    response?: string
}

const categoryConfig = {
    bug: { label: "Bug Report", icon: Bug, color: "text-red-500 bg-red-500/10 border-red-500/30" },
    suggestion: { label: "Suggestion", icon: Lightbulb, color: "text-amber-500 bg-amber-500/10 border-amber-500/30" },
    complaint: { label: "Complaint", icon: AlertCircle, color: "text-violet-500 bg-violet-500/10 border-violet-500/30" },
    general: { label: "General", icon: MessageSquare, color: "text-blue-500 bg-blue-500/10 border-blue-500/30" },
}

const statusConfig = {
    sent: { label: "Sent", icon: Send, color: "text-muted-foreground" },
    reviewing: { label: "Under Review", icon: Clock, color: "text-amber-500" },
    resolved: { label: "Resolved", icon: CheckCircle, color: "text-emerald-500" },
}

const mockFeedback: FeedbackItem[] = [
    { id: "1", category: "bug", subject: "Attendance not updating", message: "My CN attendance is showing 78% but I attended all classes this week.", status: "reviewing", timestamp: "2 hours ago" },
    { id: "2", category: "suggestion", subject: "Add dark mode to mobile", message: "The mobile view doesn't support dark mode properly.", status: "resolved", timestamp: "3 days ago", response: "Fixed in the latest update. Please clear cache and refresh." },
    { id: "3", category: "complaint", subject: "Mess food quality", message: "The dinner quality has been poor for the last 2 weeks.", status: "sent", timestamp: "1 day ago" },
]

export function FeedbackPanel() {
    const [feedbacks, setFeedbacks] = useState(mockFeedback)
    const [composing, setComposing] = useState(false)
    const [form, setForm] = useState({ category: "general" as keyof typeof categoryConfig, subject: "", message: "" })
    const [expandedId, setExpandedId] = useState<string | null>(null)

    const handleSubmit = () => {
        if (!form.subject.trim() || !form.message.trim()) return
        const newFeedback: FeedbackItem = {
            id: Date.now().toString(),
            category: form.category,
            subject: form.subject,
            message: form.message,
            status: "sent",
            timestamp: "Just now",
        }
        setFeedbacks((prev) => [newFeedback, ...prev])
        setForm({ category: "general", subject: "", message: "" })
        setComposing(false)
    }

    return (
        <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 mb-4">
                <Shield className="h-5 w-5 text-primary" />
                <h2 className="text-base font-semibold text-foreground">Feedback & Issues</h2>
                <span className="text-[10px] text-muted-foreground">Reports go directly to Admin</span>
                <button
                    onClick={() => setComposing(!composing)}
                    className="ml-auto flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-[11px] font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                    {composing ? "Cancel" : "New Report"}
                </button>
            </div>

            {/* Compose Form */}
            <AnimatePresence>
                {composing && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="mb-4 rounded-lg border border-primary/30 bg-primary/5 p-4 space-y-3">
                            <div className="flex gap-1.5">
                                {(Object.keys(categoryConfig) as (keyof typeof categoryConfig)[]).map((cat) => {
                                    const cfg = categoryConfig[cat]
                                    const Icon = cfg.icon
                                    return (
                                        <button
                                            key={cat}
                                            onClick={() => setForm({ ...form, category: cat })}
                                            className={cn(
                                                "flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-[10px] font-medium transition-colors",
                                                form.category === cat ? cfg.color : "border-border text-muted-foreground hover:text-foreground"
                                            )}
                                        >
                                            <Icon className="h-3 w-3" /> {cfg.label}
                                        </button>
                                    )
                                })}
                            </div>
                            <input
                                value={form.subject}
                                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                                placeholder="Subject..."
                                className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                            />
                            <textarea
                                value={form.message}
                                onChange={(e) => setForm({ ...form, message: e.target.value })}
                                placeholder="Describe the issue or feedback in detail..."
                                rows={4}
                                className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none resize-none"
                            />
                            <button
                                onClick={handleSubmit}
                                disabled={!form.subject.trim() || !form.message.trim()}
                                className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-40 transition-colors"
                            >
                                <Send className="h-4 w-4" /> Submit to Admin
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Feedback List */}
            <div className="space-y-2">
                {feedbacks.map((f) => {
                    const catCfg = categoryConfig[f.category]
                    const statCfg = statusConfig[f.status]
                    const CatIcon = catCfg.icon
                    const StatIcon = statCfg.icon
                    return (
                        <div key={f.id}>
                            <button
                                onClick={() => setExpandedId(expandedId === f.id ? null : f.id)}
                                className={cn(
                                    "w-full rounded-lg border p-3 text-left transition-all hover:border-primary/30",
                                    expandedId === f.id ? "border-primary/40 bg-primary/5" : "border-border"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border", catCfg.color)}>
                                        <CatIcon className="h-4 w-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-foreground truncate">{f.subject}</p>
                                        <p className="text-[10px] text-muted-foreground">{catCfg.label} · {f.timestamp}</p>
                                    </div>
                                    <div className={cn("flex items-center gap-1 text-[10px] font-medium", statCfg.color)}>
                                        <StatIcon className="h-3 w-3" /> {statCfg.label}
                                    </div>
                                </div>
                            </button>
                            <AnimatePresence>
                                {expandedId === f.id && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="ml-11 mt-1 rounded-lg border border-border bg-secondary/20 p-3">
                                            <p className="text-xs text-muted-foreground leading-relaxed">{f.message}</p>
                                            {f.response && (
                                                <div className="mt-2 rounded-md border border-emerald-500/30 bg-emerald-500/5 p-2">
                                                    <p className="text-[10px] font-medium text-emerald-500">Admin Response:</p>
                                                    <p className="text-xs text-foreground mt-0.5">{f.response}</p>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
