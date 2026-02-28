"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Trophy, Medal, Flame, Star, TrendingUp, Award } from "lucide-react"
import { cn } from "@/lib/utils"

const leaderboardData = [
    { rank: 1, name: "Ananya Iyer", dept: "CSE", attendance: 95, cgpa: 9.3, clubs: 3, streak: 28, score: 960, badges: ["🏆", "🔥", "⭐"] },
    { rank: 2, name: "Priya Sharma", dept: "ECE", attendance: 92, cgpa: 9.1, clubs: 2, streak: 21, score: 920, badges: ["🥈", "⭐"] },
    { rank: 3, name: "Arjun Mehta", dept: "CSE", attendance: 87, cgpa: 8.4, clubs: 2, streak: 14, score: 845, badges: ["🥉", "🔥"] },
    { rank: 4, name: "Kavya Reddy", dept: "IT", attendance: 90, cgpa: 8.8, clubs: 1, streak: 10, score: 830, badges: ["⭐"] },
    { rank: 5, name: "Vikram Singh", dept: "Mech", attendance: 85, cgpa: 8.2, clubs: 3, streak: 7, score: 795, badges: ["🔥"] },
    { rank: 6, name: "Deepa Nair", dept: "Civil", attendance: 88, cgpa: 8.0, clubs: 1, streak: 12, score: 780, badges: [] },
    { rank: 7, name: "Rohan Gupta", dept: "Mech", attendance: 78, cgpa: 7.6, clubs: 2, streak: 5, score: 720, badges: [] },
    { rank: 8, name: "Sneha Das", dept: "EEE", attendance: 83, cgpa: 7.9, clubs: 1, streak: 3, score: 700, badges: [] },
]

const badgeDefinitions = [
    { emoji: "🏆", label: "Top Performer", desc: "Rank #1 overall" },
    { emoji: "🥈", label: "Runner Up", desc: "Rank #2 overall" },
    { emoji: "🥉", label: "Bronze Star", desc: "Rank #3 overall" },
    { emoji: "🔥", label: "Streak Master", desc: "7+ day attendance streak" },
    { emoji: "⭐", label: "Honor Roll", desc: "CGPA above 9.0" },
]

export function StudentLeaderboard() {
    const [tab, setTab] = useState<"rankings" | "badges">("rankings")

    return (
        <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-primary" />
                    <h2 className="text-base font-semibold text-foreground">Student Leaderboard</h2>
                </div>
                <div className="flex rounded-lg border border-border bg-secondary/40 p-0.5">
                    {(["rankings", "badges"] as const).map((t) => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            className={cn(
                                "rounded-md px-3 py-1 text-xs font-medium capitalize transition-colors",
                                tab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            {tab === "rankings" ? (
                <div className="space-y-2">
                    {leaderboardData.map((student, i) => (
                        <motion.div
                            key={student.rank}
                            initial={{ opacity: 0, x: -16 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.04 }}
                            className={cn(
                                "flex items-center gap-3 rounded-lg border p-3 transition-colors",
                                student.rank <= 3 ? "border-primary/20 bg-primary/5" : "border-border bg-secondary/20"
                            )}
                        >
                            {/* Rank */}
                            <div className={cn(
                                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold",
                                student.rank === 1 ? "bg-yellow-500/20 text-yellow-500" :
                                    student.rank === 2 ? "bg-slate-400/20 text-slate-400" :
                                        student.rank === 3 ? "bg-amber-600/20 text-amber-600" :
                                            "bg-secondary text-muted-foreground"
                            )}>
                                {student.rank <= 3 ? <Medal className="h-4 w-4" /> : `#${student.rank}`}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <p className="text-sm font-medium text-foreground">{student.name}</p>
                                    {student.badges.map((b, j) => (
                                        <span key={j} className="text-xs">{b}</span>
                                    ))}
                                </div>
                                <p className="text-xs text-muted-foreground">{student.dept} · {student.streak}d streak</p>
                            </div>

                            {/* Score ring */}
                            <div className="relative flex h-11 w-11 shrink-0 items-center justify-center">
                                <svg className="absolute inset-0" viewBox="0 0 44 44">
                                    <circle cx="22" cy="22" r="18" fill="none" stroke="currentColor" strokeWidth="3" className="text-secondary" />
                                    <circle
                                        cx="22" cy="22" r="18" fill="none" stroke="currentColor" strokeWidth="3"
                                        className="text-primary"
                                        strokeDasharray={`${(student.score / 1000) * 113} 113`}
                                        strokeLinecap="round"
                                        transform="rotate(-90 22 22)"
                                    />
                                </svg>
                                <span className="text-[10px] font-bold text-foreground">{student.score}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                    {badgeDefinitions.map((badge, i) => (
                        <motion.div
                            key={badge.emoji}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.06 }}
                            className="flex items-center gap-3 rounded-lg border border-border bg-secondary/20 p-3"
                        >
                            <span className="text-2xl">{badge.emoji}</span>
                            <div>
                                <p className="text-sm font-medium text-foreground">{badge.label}</p>
                                <p className="text-xs text-muted-foreground">{badge.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    )
}
