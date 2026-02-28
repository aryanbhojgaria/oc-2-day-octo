"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { GripVertical, Plus, X, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
const timeSlots = ["09:00-10:00", "10:00-11:00", "11:00-12:00", "12:00-13:00", "14:00-15:00", "15:00-16:00"]

const subjectColors: Record<string, string> = {
    "Data Structures": "bg-red-500/20 text-red-400 border-red-500/30",
    "Operating Systems": "bg-blue-500/20 text-blue-400 border-blue-500/30",
    "DBMS": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    "Computer Networks": "bg-violet-500/20 text-violet-400 border-violet-500/30",
    "Mathematics III": "bg-amber-500/20 text-amber-400 border-amber-500/30",
    "Break": "bg-secondary text-muted-foreground border-border",
    "Lab": "bg-pink-500/20 text-pink-400 border-pink-500/30",
    "Elective": "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    "Sports": "bg-green-500/20 text-green-400 border-green-500/30",
}

interface SlotEntry { subject: string; room: string }

const classroomMap: Record<string, string> = {
    "Data Structures": "CS-101",
    "Operating Systems": "CS-102",
    "DBMS": "CS-201",
    "Computer Networks": "CS-203",
    "Mathematics III": "M-301",
    "Lab": "Lab-A1",
    "Elective": "CS-105",
    "Sports": "Ground",
    "Break": "—",
}

function makeSlot(subject: string | null): SlotEntry | null {
    if (!subject) return null
    return { subject, room: classroomMap[subject] || "TBD" }
}

const initialGrid: Record<string, (SlotEntry | null)[]> = {
    Monday: [makeSlot("Data Structures"), makeSlot("Operating Systems"), makeSlot("Break"), makeSlot("DBMS"), makeSlot("Lab"), null],
    Tuesday: [makeSlot("Mathematics III"), makeSlot("Computer Networks"), makeSlot("Break"), makeSlot("Operating Systems"), makeSlot("Lab"), null],
    Wednesday: [makeSlot("DBMS"), makeSlot("Data Structures"), makeSlot("Break"), makeSlot("Elective"), makeSlot("Sports"), null],
    Thursday: [makeSlot("Computer Networks"), makeSlot("Mathematics III"), makeSlot("Break"), makeSlot("Lab"), makeSlot("Elective"), null],
    Friday: [makeSlot("Data Structures"), makeSlot("DBMS"), makeSlot("Break"), makeSlot("Computer Networks"), null, null],
}

const availableSubjects = ["Data Structures", "Operating Systems", "DBMS", "Computer Networks", "Mathematics III", "Lab", "Elective", "Sports", "Break"]

export function TimetableBuilder() {
    const [grid, setGrid] = useState(initialGrid)
    const [dragItem, setDragItem] = useState<{ day: string; slot: number } | null>(null)
    const [addingTo, setAddingTo] = useState<{ day: string; slot: number } | null>(null)

    const handleDragStart = (day: string, slot: number) => setDragItem({ day, slot })

    const handleDrop = (targetDay: string, targetSlot: number) => {
        if (!dragItem) return
        const newGrid = { ...grid }
        const src = newGrid[dragItem.day][dragItem.slot]
        const tgt = newGrid[targetDay][targetSlot]
        newGrid[dragItem.day] = [...newGrid[dragItem.day]]
        newGrid[targetDay] = [...newGrid[targetDay]]
        newGrid[dragItem.day][dragItem.slot] = tgt
        newGrid[targetDay][targetSlot] = src
        setGrid(newGrid)
        setDragItem(null)
    }

    const removeSubject = (day: string, slot: number) => {
        const newGrid = { ...grid }
        newGrid[day] = [...newGrid[day]]
        newGrid[day][slot] = null
        setGrid(newGrid)
    }

    const addSubject = (subject: string) => {
        if (!addingTo) return
        const newGrid = { ...grid }
        newGrid[addingTo.day] = [...newGrid[addingTo.day]]
        newGrid[addingTo.day][addingTo.slot] = makeSlot(subject)
        setGrid(newGrid)
        setAddingTo(null)
    }

    return (
        <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 mb-4">
                <Clock className="h-5 w-5 text-primary" />
                <h2 className="text-base font-semibold text-foreground">Timetable Builder</h2>
                <span className="ml-auto text-[10px] text-muted-foreground">Drag to rearrange · Rooms shown</span>
            </div>

            <div className="overflow-x-auto">
                <div className="min-w-[700px]">
                    <div className="grid grid-cols-7 gap-1 mb-1">
                        <div className="p-2 text-[10px] font-semibold text-muted-foreground uppercase" />
                        {timeSlots.map((slot) => (
                            <div key={slot} className="p-2 text-center text-[10px] font-semibold text-muted-foreground uppercase">{slot}</div>
                        ))}
                    </div>

                    {days.map((day) => (
                        <div key={day} className="grid grid-cols-7 gap-1 mb-1">
                            <div className="flex items-center p-2 text-xs font-semibold text-foreground">{day}</div>
                            {grid[day].map((entry, slotIdx) => (
                                <div
                                    key={slotIdx}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={() => handleDrop(day, slotIdx)}
                                    className="relative"
                                >
                                    {entry ? (
                                        <motion.div
                                            draggable
                                            onDragStart={() => handleDragStart(day, slotIdx)}
                                            layout
                                            className={cn(
                                                "flex items-center gap-1 rounded-lg border px-2 py-1.5 cursor-grab active:cursor-grabbing transition-colors group",
                                                subjectColors[entry.subject] || "bg-secondary text-foreground border-border"
                                            )}
                                        >
                                            <GripVertical className="h-3 w-3 shrink-0 opacity-40" />
                                            <div className="flex-1 min-w-0">
                                                <span className="block text-[11px] font-medium truncate">{entry.subject}</span>
                                                {entry.subject !== "Break" && (
                                                    <span className="block text-[9px] opacity-60">📍 {entry.room}</span>
                                                )}
                                            </div>
                                            {entry.subject !== "Break" && (
                                                <button onClick={() => removeSubject(day, slotIdx)} className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <X className="h-3 w-3" />
                                                </button>
                                            )}
                                        </motion.div>
                                    ) : (
                                        <button
                                            onClick={() => setAddingTo({ day, slot: slotIdx })}
                                            className="flex h-full w-full items-center justify-center rounded-lg border border-dashed border-border py-2.5 text-muted-foreground/40 hover:border-primary/40 hover:text-primary/40 transition-colors"
                                        >
                                            <Plus className="h-3.5 w-3.5" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {addingTo && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-3 rounded-lg border border-border bg-secondary/30 p-3">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-medium text-foreground">Add to {addingTo.day} · {timeSlots[addingTo.slot]}</p>
                        <button onClick={() => setAddingTo(null)} className="text-muted-foreground hover:text-foreground"><X className="h-3 w-3" /></button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                        {availableSubjects.map((s) => (
                            <button
                                key={s}
                                onClick={() => addSubject(s)}
                                className={cn("rounded-md border px-2.5 py-1 text-[11px] font-medium transition-colors", subjectColors[s] || "bg-secondary text-foreground border-border")}
                            >
                                {s} <span className="opacity-50 ml-1">{classroomMap[s]}</span>
                            </button>
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    )
}
