"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FileText, Upload, Clock, CheckCircle, AlertCircle, Download, Plus, X, Send } from "lucide-react"
import { cn } from "@/lib/utils"

interface Assignment {
    id: string
    title: string
    subject: string
    dueDate: string
    status: "pending" | "submitted" | "graded" | "late"
    grade?: string
    marks?: string
    description: string
    attachments?: string[]
}

const mockAssignments: Assignment[] = [
    { id: "1", title: "Binary Search Tree Implementation", subject: "Data Structures", dueDate: "2026-03-05", status: "pending", description: "Implement BST with insert, delete, and search operations. Include traversal methods and time complexity analysis." },
    { id: "2", title: "Process Scheduling Simulator", subject: "Operating Systems", dueDate: "2026-03-08", status: "pending", description: "Build a simulator for FCFS, SJF, RR, and Priority scheduling. Compare turnaround and waiting times." },
    { id: "3", title: "ER Diagram for Library System", subject: "DBMS", dueDate: "2026-02-28", status: "submitted", description: "Design a complete ER diagram with entities, relationships, and cardinalities for a library management system.", attachments: ["library_er.pdf"] },
    { id: "4", title: "TCP/IP Socket Programming", subject: "Computer Networks", dueDate: "2026-02-20", status: "graded", grade: "A", marks: "45/50", description: "Implement a client-server chat application using TCP sockets in Python." },
    { id: "5", title: "Fourier Transform Assignment", subject: "Mathematics III", dueDate: "2026-02-15", status: "graded", grade: "A-", marks: "42/50", description: "Solve problems on DFT, FFT, and their engineering applications." },
    { id: "6", title: "Subnetting Practice Problems", subject: "Computer Networks", dueDate: "2026-02-18", status: "late", description: "Complete 20 subnetting problems with CIDR notation, network/broadcast addresses." },
]

const statusConfig = {
    pending: { label: "Pending", color: "text-amber-500 bg-amber-500/10 border-amber-500/30", icon: Clock },
    submitted: { label: "Submitted", color: "text-blue-500 bg-blue-500/10 border-blue-500/30", icon: CheckCircle },
    graded: { label: "Graded", color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/30", icon: CheckCircle },
    late: { label: "Late", color: "text-red-500 bg-red-500/10 border-red-500/30", icon: AlertCircle },
}

export function AssignmentPortal() {
    const [assignments, setAssignments] = useState(mockAssignments)
    const [filter, setFilter] = useState<"all" | "pending" | "submitted" | "graded">("all")
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [uploadFiles, setUploadFiles] = useState<Record<string, string[]>>({})

    const filtered = filter === "all" ? assignments : assignments.filter((a) => a.status === filter)
    const selected = assignments.find((a) => a.id === selectedId)

    const daysLeft = (due: string) => {
        const diff = Math.ceil((new Date(due).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        if (diff < 0) return "Overdue"
        if (diff === 0) return "Due today"
        return `${diff}d left`
    }

    const handleSubmit = (id: string) => {
        setAssignments((prev) => prev.map((a) => a.id === id ? { ...a, status: "submitted" as const, attachments: uploadFiles[id] || ["submission.pdf"] } : a))
        setSelectedId(null)
    }

    return (
        <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 mb-4">
                <FileText className="h-5 w-5 text-primary" />
                <h2 className="text-base font-semibold text-foreground">Assignments</h2>
                <div className="ml-auto flex gap-1">
                    {(["all", "pending", "submitted", "graded"] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={cn(
                                "rounded-full px-3 py-1 text-[10px] font-medium capitalize transition-colors",
                                filter === f ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                {filtered.map((a) => {
                    const cfg = statusConfig[a.status]
                    const StatusIcon = cfg.icon
                    return (
                        <motion.button
                            key={a.id}
                            onClick={() => setSelectedId(selectedId === a.id ? null : a.id)}
                            className={cn(
                                "w-full rounded-lg border p-3 text-left transition-all hover:border-primary/30",
                                selectedId === a.id ? "border-primary/50 bg-primary/5" : "border-border"
                            )}
                            layout
                        >
                            <div className="flex items-center gap-3">
                                <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border", cfg.color)}>
                                    <StatusIcon className="h-4 w-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-medium text-foreground truncate">{a.title}</p>
                                        {a.grade && <span className="rounded bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-bold text-emerald-500">{a.grade}</span>}
                                    </div>
                                    <p className="text-[10px] text-muted-foreground">{a.subject} · Due: {a.dueDate}</p>
                                </div>
                                <div className="text-right shrink-0">
                                    {a.marks && <p className="text-xs font-semibold text-foreground">{a.marks}</p>}
                                    <p className={cn("text-[10px] font-medium", a.status === "pending" && daysLeft(a.dueDate) === "Overdue" ? "text-red-500" : "text-muted-foreground")}>{daysLeft(a.dueDate)}</p>
                                </div>
                            </div>
                        </motion.button>
                    )
                })}
            </div>

            {/* Expanded Detail / Submit */}
            <AnimatePresence>
                {selected && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="mt-3 rounded-lg border border-border bg-secondary/20 p-4">
                            <h3 className="text-sm font-semibold text-foreground">{selected.title}</h3>
                            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{selected.description}</p>

                            {selected.attachments && (
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {selected.attachments.map((f) => (
                                        <span key={f} className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2 py-1 text-[10px] text-foreground">
                                            <FileText className="h-3 w-3" /> {f}
                                            <Download className="h-3 w-3 text-primary ml-1 cursor-pointer" />
                                        </span>
                                    ))}
                                </div>
                            )}

                            {selected.status === "pending" && (
                                <div className="mt-4 space-y-2">
                                    <label className="flex items-center gap-2 rounded-lg border border-dashed border-border p-3 cursor-pointer hover:border-primary/40 transition-colors">
                                        <Upload className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-xs text-muted-foreground">Click to upload files (PDF, ZIP, DOCX)</span>
                                        <input type="file" className="hidden" multiple onChange={(e) => {
                                            const files = Array.from(e.target.files || []).map((f) => f.name)
                                            setUploadFiles((prev) => ({ ...prev, [selected.id]: [...(prev[selected.id] || []), ...files] }))
                                        }} />
                                    </label>
                                    {uploadFiles[selected.id]?.map((f, i) => (
                                        <span key={i} className="inline-flex items-center gap-1 mr-2 rounded border border-primary/30 bg-primary/5 px-2 py-1 text-[10px] text-primary">
                                            <FileText className="h-3 w-3" /> {f}
                                        </span>
                                    ))}
                                    <button
                                        onClick={() => handleSubmit(selected.id)}
                                        className="mt-2 flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                                    >
                                        <Send className="h-4 w-4" /> Submit Assignment
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
