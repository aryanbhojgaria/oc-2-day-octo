"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FileText, Plus, X, Calendar, Clock, Users, CheckCircle, Edit3 } from "lucide-react"
import { cn } from "@/lib/utils"

interface TeacherAssignment {
    id: string
    title: string
    subject: string
    dueDate: string
    description: string
    totalSubmissions: number
    totalStudents: number
    published: boolean
}

const mockAssignments: TeacherAssignment[] = [
    { id: "1", title: "Binary Search Tree Implementation", subject: "Data Structures", dueDate: "2026-03-05", description: "Implement BST with insert, delete, search. Include traversals.", totalSubmissions: 32, totalStudents: 60, published: true },
    { id: "2", title: "Process Scheduling Simulator", subject: "Operating Systems", dueDate: "2026-03-08", description: "Build FCFS, SJF, RR, Priority simulator.", totalSubmissions: 18, totalStudents: 55, published: true },
    { id: "3", title: "ER Diagram for Library System", subject: "DBMS", dueDate: "2026-02-28", description: "Design ER diagram with entities & relationships.", totalSubmissions: 48, totalStudents: 60, published: true },
    { id: "4", title: "TCP/IP Socket Programming", subject: "Computer Networks", dueDate: "2026-02-20", description: "Client-server chat app using TCP sockets.", totalSubmissions: 55, totalStudents: 55, published: true },
]

export function TeacherAssignments() {
    const [assignments, setAssignments] = useState(mockAssignments)
    const [creating, setCreating] = useState(false)
    const [form, setForm] = useState({ title: "", subject: "Data Structures", dueDate: "", description: "" })

    const subjects = ["Data Structures", "Operating Systems", "DBMS", "Computer Networks", "Mathematics III"]

    const handlePublish = () => {
        if (!form.title || !form.dueDate) return
        const newAssignment: TeacherAssignment = {
            id: Date.now().toString(),
            title: form.title,
            subject: form.subject,
            dueDate: form.dueDate,
            description: form.description,
            totalSubmissions: 0,
            totalStudents: 60,
            published: true,
        }
        setAssignments((prev) => [newAssignment, ...prev])
        setForm({ title: "", subject: "Data Structures", dueDate: "", description: "" })
        setCreating(false)
    }

    const [expandedId, setExpandedId] = useState<string | null>(null)

    const mockStudents = [
        { id: "STU001", name: "Arjun Mehta", status: "Submitted", time: "2 hours ago" },
        { id: "STU002", name: "Priya Sharma", status: "Submitted", time: "5 hours ago" },
        { id: "STU003", name: "Rohan Gupta", status: "Pending", time: "-" },
        { id: "STU004", name: "Ananya Iyer", status: "Late", time: "1 day late" },
        { id: "STU005", name: "Vikram Singh", status: "Submitted", time: "1 hour ago" },
    ]

    return (
        <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 mb-4">
                <Edit3 className="h-5 w-5 text-primary" />
                <h2 className="text-base font-semibold text-foreground">Manage Assignments</h2>
                <button
                    onClick={() => setCreating(!creating)}
                    className="ml-auto flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-[11px] font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                    {creating ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                    {creating ? "Cancel" : "New Assignment"}
                </button>
            </div>

            {/* Create Form */}
            <AnimatePresence>
                {creating && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="mb-4 rounded-lg border border-primary/30 bg-primary/5 p-4 space-y-3">
                            <input
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                placeholder="Assignment title..."
                                className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                            />
                            <div className="flex gap-2">
                                <select
                                    value={form.subject}
                                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                                    className="flex-1 rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                                >
                                    {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
                                </select>
                                <input
                                    type="date"
                                    value={form.dueDate}
                                    onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                                    className="flex-1 rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                                />
                            </div>
                            <textarea
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                placeholder="Description & instructions..."
                                rows={3}
                                className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none resize-none"
                            />
                            <button
                                onClick={handlePublish}
                                disabled={!form.title || !form.dueDate}
                                className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-40 transition-colors"
                            >
                                <FileText className="h-4 w-4" /> Publish Assignment
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Assignment List */}
            <div className="space-y-3">
                {assignments.map((a) => {
                    const progress = Math.round((a.totalSubmissions / a.totalStudents) * 100)
                    const isExpanded = expandedId === a.id
                    return (
                        <div key={a.id} className="rounded-lg border border-border hover:border-primary/20 transition-colors overflow-hidden">
                            <div
                                className="p-3 cursor-pointer flex items-center gap-3 bg-card hover:bg-muted/30 transition-colors"
                                onClick={() => setExpandedId(isExpanded ? null : a.id)}
                            >
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                                    <FileText className="h-4 w-4 text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-foreground truncate">{a.title}</p>
                                    <p className="text-[10px] text-muted-foreground">{a.subject} · Due: {a.dueDate}</p>
                                </div>
                                <div className="text-right shrink-0">
                                    <div className="flex items-center gap-1 text-xs font-medium text-foreground">
                                        <Users className="h-3 w-3" /> {a.totalSubmissions}/{a.totalStudents}
                                    </div>
                                    <p className="text-[10px] text-muted-foreground">{progress}% submitted</p>
                                </div>
                            </div>
                            <div className="h-1 w-full bg-secondary">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    className="h-full bg-primary"
                                />
                            </div>

                            {/* Expanded Submission Status View */}
                            <AnimatePresence>
                                {isExpanded && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden bg-secondary/20"
                                    >
                                        <div className="p-4 border-t border-border/50">
                                            <div className="flex items-center justify-between mb-3 text-xs font-medium text-muted-foreground">
                                                <span>Student Submissions</span>
                                                <button className="text-primary hover:underline">Download All (.zip)</button>
                                            </div>
                                            <div className="space-y-2">
                                                {mockStudents.map((s, idx) => (
                                                    <div key={idx} className="flex items-center justify-between p-2 rounded-md bg-card border border-border/50 text-sm">
                                                        <div className="flex items-center gap-2">
                                                            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                                                                {s.name.split(" ").map(n => n[0]).join("")}
                                                            </div>
                                                            <span className="font-medium text-foreground">{s.name}</span>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-[10px] text-muted-foreground">{s.time}</span>
                                                            <span className={cn(
                                                                "px-2 py-0.5 rounded text-[10px] font-medium min-w-[70px] text-center",
                                                                s.status === "Submitted" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" :
                                                                    s.status === "Pending" ? "bg-amber-500/10 text-amber-600 dark:text-amber-400" :
                                                                        "bg-red-500/10 text-red-600 dark:text-red-400"
                                                            )}>
                                                                {s.status}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
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
