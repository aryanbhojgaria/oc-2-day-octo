"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Printer, Award } from "lucide-react"
import { students } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const semesterData: Record<string, { subject: string; internal1: number; internal2: number; assignment: number; total: number; grade: string }[]> = {
    "Sem 1": [
        { subject: "Engineering Mathematics I", internal1: 40, internal2: 43, assignment: 17, total: 76, grade: "A" },
        { subject: "Physics", internal1: 36, internal2: 38, assignment: 15, total: 68, grade: "B+" },
        { subject: "Chemistry", internal1: 34, internal2: 36, assignment: 14, total: 62, grade: "B" },
        { subject: "Basic Programming", internal1: 44, internal2: 46, assignment: 19, total: 86, grade: "A+" },
        { subject: "English Communication", internal1: 38, internal2: 40, assignment: 16, total: 72, grade: "A-" },
    ],
    "Sem 2": [
        { subject: "Engineering Mathematics II", internal1: 42, internal2: 44, assignment: 17, total: 79, grade: "A" },
        { subject: "Data Structures", internal1: 38, internal2: 41, assignment: 16, total: 72, grade: "A-" },
        { subject: "Digital Logic", internal1: 35, internal2: 37, assignment: 14, total: 65, grade: "B+" },
        { subject: "Computer Organization", internal1: 39, internal2: 41, assignment: 16, total: 74, grade: "A-" },
        { subject: "Electronics", internal1: 33, internal2: 35, assignment: 13, total: 61, grade: "B" },
    ],
    "Sem 3": [
        { subject: "Discrete Mathematics", internal1: 41, internal2: 43, assignment: 17, total: 78, grade: "A" },
        { subject: "Object Oriented Programming", internal1: 44, internal2: 46, assignment: 18, total: 85, grade: "A+" },
        { subject: "Database Systems", internal1: 40, internal2: 42, assignment: 17, total: 76, grade: "A" },
        { subject: "Computer Networks I", internal1: 37, internal2: 39, assignment: 15, total: 70, grade: "A-" },
        { subject: "Probability & Statistics", internal1: 38, internal2: 40, assignment: 16, total: 72, grade: "A-" },
    ],
    "Sem 4": [
        { subject: "Operating Systems", internal1: 38, internal2: 40, assignment: 17, total: 75, grade: "A-" },
        { subject: "Algorithms", internal1: 42, internal2: 45, assignment: 18, total: 82, grade: "A" },
        { subject: "Software Engineering", internal1: 39, internal2: 41, assignment: 16, total: 74, grade: "A-" },
        { subject: "Computer Architecture", internal1: 36, internal2: 38, assignment: 15, total: 68, grade: "B+" },
        { subject: "Theory of Computation", internal1: 35, internal2: 37, assignment: 14, total: 65, grade: "B+" },
    ],
    "Sem 5": [
        { subject: "Compiler Design", internal1: 40, internal2: 42, assignment: 16, total: 76, grade: "A" },
        { subject: "Artificial Intelligence", internal1: 43, internal2: 45, assignment: 18, total: 83, grade: "A+" },
        { subject: "Computer Graphics", internal1: 37, internal2: 39, assignment: 15, total: 70, grade: "A-" },
        { subject: "Mobile Computing", internal1: 41, internal2: 43, assignment: 17, total: 78, grade: "A" },
        { subject: "Elective I", internal1: 38, internal2: 40, assignment: 16, total: 72, grade: "A-" },
    ],
    "Sem 6 (Current)": [
        { subject: "Data Structures", internal1: 42, internal2: 45, assignment: 18, total: 82, grade: "A" },
        { subject: "Operating Systems", internal1: 38, internal2: 40, assignment: 17, total: 75, grade: "A-" },
        { subject: "DBMS", internal1: 44, internal2: 46, assignment: 19, total: 88, grade: "A+" },
        { subject: "Computer Networks", internal1: 35, internal2: 37, assignment: 15, total: 68, grade: "B+" },
        { subject: "Mathematics III", internal1: 40, internal2: 42, assignment: 16, total: 78, grade: "A" },
    ],
}

const semesters = Object.keys(semesterData)

export function ReportCard() {
    const printRef = useRef<HTMLDivElement>(null)
    const student = students[0]
    const [selectedSem, setSelectedSem] = useState("Sem 6 (Current)")
    const marks = semesterData[selectedSem]
    const totalMarks = marks.reduce((sum, m) => sum + m.total, 0)
    const maxTotal = marks.length * 100
    const percentage = ((totalMarks / maxTotal) * 100).toFixed(1)

    const handlePrint = () => {
        if (!printRef.current) return
        const printWindow = window.open("", "_blank")
        if (!printWindow) return
        printWindow.document.write(`
      <html><head><title>Report Card - ${student.name} - ${selectedSem}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Inter', system-ui, sans-serif; }
        body { padding: 40px; background: #fff; color: #111; }
        .header { text-align: center; border-bottom: 2px solid #dc2626; padding-bottom: 20px; margin-bottom: 20px; }
        .header h1 { font-size: 24px; font-weight: 700; }
        .header p { color: #666; font-size: 12px; margin-top: 4px; }
        .info { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 24px; font-size: 13px; }
        .info span { color: #666; }
        .info strong { color: #111; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
        th { background: #f5f5f5; text-align: left; padding: 10px 12px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #ddd; }
        td { padding: 10px 12px; border-bottom: 1px solid #eee; font-size: 13px; }
        .grade { font-weight: 700; color: #dc2626; }
        .summary { display: flex; justify-content: space-between; padding: 16px; background: #fef2f2; border-radius: 8px; }
        .summary-item { text-align: center; }
        .summary-item .value { font-size: 20px; font-weight: 700; color: #dc2626; }
        .summary-item .label { font-size: 10px; color: #666; margin-top: 2px; }
        .footer { margin-top: 40px; display: flex; justify-content: space-between; font-size: 12px; color: #666; }
        .sig { border-top: 1px solid #999; padding-top: 8px; min-width: 150px; text-align: center; }
      </style></head><body>
      ${printRef.current.innerHTML}
      </body></html>
    `)
        printWindow.document.close()
        printWindow.print()
    }

    return (
        <div className="space-y-4">
            {/* Semester Selector */}
            <div className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-primary" />
                        <h2 className="text-sm font-semibold text-foreground">Select Semester</h2>
                    </div>
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                        <Printer className="h-3.5 w-3.5" />
                        Print / Save PDF
                    </button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {semesters.map((sem) => (
                        <button
                            key={sem}
                            onClick={() => setSelectedSem(sem)}
                            className={cn(
                                "rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
                                selectedSem === sem
                                    ? "bg-primary text-primary-foreground shadow-sm"
                                    : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
                            )}
                        >
                            {sem}
                        </button>
                    ))}
                </div>
            </div>

            {/* Summary Badges */}
            <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                    <p className="text-2xl font-bold text-primary">{totalMarks}</p>
                    <p className="text-xs text-muted-foreground mt-1">Total / {maxTotal}</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                    <p className="text-2xl font-bold text-emerald-500">{percentage}%</p>
                    <p className="text-xs text-muted-foreground mt-1">Percentage</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                    <p className="text-2xl font-bold text-foreground">{student.cgpa}</p>
                    <p className="text-xs text-muted-foreground mt-1">CGPA</p>
                </div>
            </div>

            {/* Printable Report */}
            <div className="rounded-xl border border-border bg-card p-5">
                <div ref={printRef} className="rounded-lg border border-border bg-white p-6 text-black dark:bg-white">
                    <div style={{ textAlign: "center", borderBottom: "2px solid #dc2626", paddingBottom: 16, marginBottom: 16 }}>
                        <h1 style={{ fontSize: 20, fontWeight: 700 }}>oc-2-day</h1>
                        <p style={{ color: "#666", fontSize: 11, marginTop: 4 }}>Intelligent Campus Coordination System — Academic Report</p>
                        <p style={{ color: "#dc2626", fontSize: 13, fontWeight: 600, marginTop: 6 }}>{selectedSem}</p>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 20, fontSize: 12 }}>
                        <div><span style={{ color: "#888" }}>Name: </span><strong>{student.name}</strong></div>
                        <div><span style={{ color: "#888" }}>ID: </span><strong>{student.id}</strong></div>
                        <div><span style={{ color: "#888" }}>Department: </span><strong>{student.department}</strong></div>
                        <div><span style={{ color: "#888" }}>Year: </span><strong>{student.year}</strong></div>
                        <div><span style={{ color: "#888" }}>CGPA: </span><strong>{student.cgpa}</strong></div>
                        <div><span style={{ color: "#888" }}>Attendance: </span><strong>{student.attendance}%</strong></div>
                    </div>

                    <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 20 }}>
                        <thead>
                            <tr>
                                {["Subject", "Int 1", "Int 2", "Assign", "Total", "Grade"].map(h => (
                                    <th key={h} style={{ background: "#f5f5f5", textAlign: "left", padding: "8px 10px", fontSize: 10, textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "2px solid #ddd" }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {marks.map((m) => (
                                <tr key={m.subject}>
                                    <td style={{ padding: "8px 10px", borderBottom: "1px solid #eee", fontSize: 12 }}>{m.subject}</td>
                                    <td style={{ padding: "8px 10px", borderBottom: "1px solid #eee", fontSize: 12 }}>{m.internal1}/50</td>
                                    <td style={{ padding: "8px 10px", borderBottom: "1px solid #eee", fontSize: 12 }}>{m.internal2}/50</td>
                                    <td style={{ padding: "8px 10px", borderBottom: "1px solid #eee", fontSize: 12 }}>{m.assignment}/20</td>
                                    <td style={{ padding: "8px 10px", borderBottom: "1px solid #eee", fontSize: 12, fontWeight: 700 }}>{m.total}</td>
                                    <td style={{ padding: "8px 10px", borderBottom: "1px solid #eee", fontSize: 12, fontWeight: 700, color: "#dc2626" }}>{m.grade}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div style={{ display: "flex", justifyContent: "space-around", padding: 16, background: "#fef2f2", borderRadius: 8 }}>
                        <div style={{ textAlign: "center" }}>
                            <div style={{ fontSize: 18, fontWeight: 700, color: "#dc2626" }}>{totalMarks}/{maxTotal}</div>
                            <div style={{ fontSize: 9, color: "#666", marginTop: 2 }}>Total Marks</div>
                        </div>
                        <div style={{ textAlign: "center" }}>
                            <div style={{ fontSize: 18, fontWeight: 700, color: "#dc2626" }}>{percentage}%</div>
                            <div style={{ fontSize: 9, color: "#666", marginTop: 2 }}>Percentage</div>
                        </div>
                        <div style={{ textAlign: "center" }}>
                            <div style={{ fontSize: 18, fontWeight: 700, color: "#dc2626" }}>{student.cgpa}</div>
                            <div style={{ fontSize: 9, color: "#666", marginTop: 2 }}>CGPA</div>
                        </div>
                    </div>

                    <div style={{ marginTop: 40, display: "flex", justifyContent: "space-between", fontSize: 11, color: "#666" }}>
                        <div style={{ borderTop: "1px solid #999", paddingTop: 8, minWidth: 140, textAlign: "center" }}>Class Teacher</div>
                        <div style={{ borderTop: "1px solid #999", paddingTop: 8, minWidth: 140, textAlign: "center" }}>HOD</div>
                        <div style={{ borderTop: "1px solid #999", paddingTop: 8, minWidth: 140, textAlign: "center" }}>Principal</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
