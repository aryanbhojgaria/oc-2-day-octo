"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MapPin, X, Clock, Users } from "lucide-react"
import { cn } from "@/lib/utils"

interface Building {
    id: string
    name: string
    x: number
    y: number
    width: number
    height: number
    color: string
    type: "academic" | "admin" | "facility" | "sports"
    schedule: string[]
    occupancy: number
}

const buildings: Building[] = [
    { id: "cs", name: "CS Building", x: 60, y: 40, width: 100, height: 60, color: "oklch(0.55 0.22 25)", type: "academic", schedule: ["09:00 - Data Structures", "11:00 - DBMS Lab", "14:00 - Networks"], occupancy: 78 },
    { id: "ece", name: "ECE Block", x: 200, y: 40, width: 90, height: 60, color: "oklch(0.55 0.15 240)", type: "academic", schedule: ["09:00 - Digital Circuits", "11:00 - Signals Lab", "14:00 - VLSI"], occupancy: 65 },
    { id: "mech", name: "Mech Block", x: 330, y: 40, width: 90, height: 60, color: "oklch(0.50 0.18 145)", type: "academic", schedule: ["09:00 - Thermodynamics", "11:00 - Workshop", "14:00 - Fluid Mech"], occupancy: 72 },
    { id: "admin", name: "Admin Office", x: 60, y: 140, width: 80, height: 50, color: "oklch(0.55 0.18 285)", type: "admin", schedule: ["Open 09:00-17:00", "Fee counter: 10:00-15:00"], occupancy: 40 },
    { id: "lib", name: "Library", x: 180, y: 140, width: 110, height: 50, color: "oklch(0.55 0.20 60)", type: "facility", schedule: ["Open 08:00-22:00", "Extended till 23:00 (exam week)"], occupancy: 85 },
    { id: "audi", name: "Auditorium", x: 330, y: 140, width: 90, height: 50, color: "oklch(0.55 0.20 350)", type: "facility", schedule: ["10:00 - Guest Lecture", "18:00 - Rhythm Night"], occupancy: 55 },
    { id: "hostel", name: "Hostel A", x: 60, y: 230, width: 70, height: 50, color: "oklch(0.45 0.10 200)", type: "facility", schedule: ["Curfew: 22:00 weekdays", "Mess: 07:30-21:00"], occupancy: 92 },
    { id: "mess", name: "Mess Hall", x: 170, y: 230, width: 80, height: 50, color: "oklch(0.50 0.12 30)", type: "facility", schedule: ["Breakfast: 07:30-09:00", "Lunch: 12:00-13:30", "Dinner: 19:30-21:00"], occupancy: 60 },
    { id: "ground", name: "Sports Ground", x: 290, y: 230, width: 130, height: 50, color: "oklch(0.50 0.18 145)", type: "sports", schedule: ["06:00-08:00 Cricket", "16:00-18:00 Football", "Open practice till 19:00"], occupancy: 35 },
]

export function CampusMap() {
    const [selected, setSelected] = useState<Building | null>(null)

    return (
        <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-5 w-5 text-primary" />
                <h2 className="text-base font-semibold text-foreground">Campus Map</h2>
            </div>

            {/* Legend */}
            <div className="mb-3 flex flex-wrap gap-3 text-[10px]">
                {[
                    { type: "academic", label: "Academic", color: "bg-primary" },
                    { type: "admin", label: "Admin", color: "bg-violet-500" },
                    { type: "facility", label: "Facility", color: "bg-amber-500" },
                    { type: "sports", label: "Sports", color: "bg-emerald-500" },
                ].map((l) => (
                    <div key={l.type} className="flex items-center gap-1.5">
                        <div className={cn("h-2.5 w-2.5 rounded", l.color)} />
                        <span className="text-muted-foreground">{l.label}</span>
                    </div>
                ))}
            </div>

            <div className="relative">
                <svg viewBox="0 0 480 310" className="w-full rounded-lg border border-border bg-secondary/20" style={{ minHeight: 250 }}>
                    {/* Grid */}
                    {Array.from({ length: 12 }).map((_, i) => (
                        <line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2="310" stroke="currentColor" className="text-border" strokeWidth="0.5" strokeDasharray="4 4" />
                    ))}
                    {Array.from({ length: 8 }).map((_, i) => (
                        <line key={`h${i}`} x1="0" y1={i * 40} x2="480" y2={i * 40} stroke="currentColor" className="text-border" strokeWidth="0.5" strokeDasharray="4 4" />
                    ))}

                    {/* Paths */}
                    <rect x="145" y="60" width="70" height="8" rx="4" fill="currentColor" className="text-muted-foreground/10" />
                    <rect x="145" y="155" width="50" height="8" rx="4" fill="currentColor" className="text-muted-foreground/10" />
                    <rect x="100" y="95" width="8" height="50" rx="4" fill="currentColor" className="text-muted-foreground/10" />

                    {/* Buildings */}
                    {buildings.map((b) => (
                        <g key={b.id} onClick={() => setSelected(b)} className="cursor-pointer">
                            <motion.rect
                                x={b.x} y={b.y} width={b.width} height={b.height} rx="8"
                                fill={b.color}
                                fillOpacity={selected?.id === b.id ? 0.9 : 0.6}
                                stroke={selected?.id === b.id ? "white" : "transparent"}
                                strokeWidth={selected?.id === b.id ? 2 : 0}
                                whileHover={{ fillOpacity: 0.85, scale: 1.02 }}
                                style={{ transformOrigin: `${b.x + b.width / 2}px ${b.y + b.height / 2}px` }}
                            />
                            <text
                                x={b.x + b.width / 2} y={b.y + b.height / 2}
                                textAnchor="middle" dominantBaseline="middle"
                                className="pointer-events-none text-[10px] font-semibold fill-white"
                            >
                                {b.name}
                            </text>
                            {/* Occupancy dot */}
                            <circle
                                cx={b.x + b.width - 8} cy={b.y + 8} r="4"
                                fill={b.occupancy > 80 ? "#ef4444" : b.occupancy > 50 ? "#f59e0b" : "#10b981"}
                            />
                        </g>
                    ))}
                </svg>

                {/* Info popup */}
                <AnimatePresence>
                    {selected && (
                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 8 }}
                            className="absolute bottom-3 left-3 right-3 rounded-xl border border-border bg-card p-4 shadow-xl"
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="text-sm font-semibold text-foreground">{selected.name}</h3>
                                    <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1"><Users className="h-3 w-3" />{selected.occupancy}% occupancy</span>
                                        <span className="capitalize">{selected.type}</span>
                                    </div>
                                </div>
                                <button onClick={() => setSelected(null)} className="rounded p-1 text-muted-foreground hover:text-foreground"><X className="h-3 w-3" /></button>
                            </div>
                            <div className="mt-2 space-y-1">
                                {selected.schedule.map((s, i) => (
                                    <p key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                        <Clock className="h-3 w-3 shrink-0" />{s}
                                    </p>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
