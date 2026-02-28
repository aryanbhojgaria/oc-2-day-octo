"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Calendar, Clock, Users, Check, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"

interface EventData {
    id: string
    title: string
    club: string
    date: string
    description: string
    venue: string
    registrations: number
    maxCapacity: number
    rsvpd: boolean
}

const eventsWithRSVP: EventData[] = [
    { id: "1", title: "TechnoVerse 2026", club: "Tech", date: "2026-03-10T10:00:00", description: "Annual technical festival with coding contests, hackathons, and workshops.", venue: "Main Auditorium", registrations: 245, maxCapacity: 300, rsvpd: false },
    { id: "2", title: "Rhythm Night", club: "Music", date: "2026-03-05T18:00:00", description: "Live music performance featuring student bands and solo artists.", venue: "Open Air Theatre", registrations: 180, maxCapacity: 250, rsvpd: true },
    { id: "3", title: "Startup Pitch Day", club: "Entrepreneurship", date: "2026-03-15T09:00:00", description: "Student startups present their ideas to a panel of industry mentors.", venue: "Seminar Hall B", registrations: 60, maxCapacity: 80, rsvpd: false },
    { id: "4", title: "Cultural Night", club: "Culture", date: "2026-03-20T17:00:00", description: "A grand celebration of art, dance, drama, and cultural performances.", venue: "College Ground", registrations: 300, maxCapacity: 500, rsvpd: false },
]

function CountdownTimer({ targetDate }: { targetDate: string }) {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

    useEffect(() => {
        const calc = () => {
            const diff = new Date(targetDate).getTime() - Date.now()
            if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
            return {
                days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((diff / (1000 * 60)) % 60),
                seconds: Math.floor((diff / 1000) % 60),
            }
        }
        setTimeLeft(calc())
        const interval = setInterval(() => setTimeLeft(calc()), 1000)
        return () => clearInterval(interval)
    }, [targetDate])

    return (
        <div className="flex gap-2">
            {[
                { val: timeLeft.days, label: "D" },
                { val: timeLeft.hours, label: "H" },
                { val: timeLeft.minutes, label: "M" },
                { val: timeLeft.seconds, label: "S" },
            ].map((unit) => (
                <div key={unit.label} className="flex flex-col items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary border border-border">
                        <span className="text-sm font-bold text-foreground tabular-nums">{String(unit.val).padStart(2, "0")}</span>
                    </div>
                    <span className="mt-1 text-[9px] font-medium text-muted-foreground/60">{unit.label}</span>
                </div>
            ))}
        </div>
    )
}

export function EventRSVP() {
    const [events, setEvents] = useState(eventsWithRSVP)

    const toggleRSVP = (id: string) => {
        setEvents((prev) => prev.map((e) =>
            e.id === id ? { ...e, rsvpd: !e.rsvpd, registrations: e.rsvpd ? e.registrations - 1 : e.registrations + 1 } : e
        ))
    }

    return (
        <div className="space-y-4">
            {events.map((event, i) => (
                <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="rounded-xl border border-border bg-card p-5"
                >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-primary">{event.club}</span>
                                <h3 className="text-base font-semibold text-foreground">{event.title}</h3>
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2">{event.description}</p>
                            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(event.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                                <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{new Date(event.date).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span>
                                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{event.venue}</span>
                                <span className="flex items-center gap-1"><Users className="h-3 w-3" />{event.registrations}/{event.maxCapacity}</span>
                            </div>
                            {/* Capacity bar */}
                            <div className="mt-2 h-1.5 w-full max-w-xs rounded-full bg-secondary">
                                <motion.div
                                    className="h-full rounded-full bg-primary"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(event.registrations / event.maxCapacity) * 100}%` }}
                                    transition={{ duration: 0.6, delay: i * 0.1 }}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col items-end gap-3">
                            <CountdownTimer targetDate={event.date} />
                            <motion.button
                                onClick={() => toggleRSVP(event.id)}
                                whileTap={{ scale: 0.95 }}
                                className={cn(
                                    "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all",
                                    event.rsvpd
                                        ? "bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 border border-emerald-600/30"
                                        : "bg-primary text-primary-foreground hover:bg-primary/90"
                                )}
                            >
                                {event.rsvpd ? <><Check className="h-4 w-4" /> RSVP'd</> : "RSVP Now"}
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    )
}
