"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, X, Send, Bot } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
    id: number
    text: string
    sender: "user" | "bot"
    suggestions?: string[]
}

const knowledgeBase: { keywords: string[]; response: string; suggestions?: string[] }[] = [
    { keywords: ["timetable", "schedule", "class", "timing", "slot"], response: "📅 Your timetable runs Mon-Fri, 9 AM – 4 PM:\n• 09:00 - Data Structures\n• 10:00 - Operating Systems\n• 11:00 - Break\n• 12:00 - DBMS\n• 14:00 - Lab / Elective\n\nRearrange in the Timetable Builder (Teacher Dashboard).", suggestions: ["attendance", "exam", "marks"] },
    { keywords: ["attendance", "absent", "present", "percentage"], response: "📊 Your current attendance is 87% (min required: 75%).\n\nSubjects below 80%:\n• Computer Networks: 78% ⚠️\n\nAttend the next 5 CN classes to recover. Track trends in Academic tab → Attendance Trend chart.", suggestions: ["timetable", "exam", "marks"] },
    { keywords: ["mess", "food", "menu", "lunch", "dinner", "breakfast", "canteen"], response: "🍽️ Today's Menu:\n• Breakfast (7:30-9 AM): Poha, Toast, Tea\n• Lunch (12-1:30 PM): Rice, Dal, Paneer\n• Snacks (4:30-5:30 PM): Samosa, Coffee\n• Dinner (7:30-9 PM): Chapati, Chole, Salad\n\nDay scholars: Buy lunch tickets for ₹60 in Student Dashboard.", suggestions: ["hostel", "fees"] },
    { keywords: ["hostel", "room", "warden", "curfew", "outing"], response: "🏠 Hostel Info:\n• Curfew: 10 PM weekdays, 11 PM weekends\n• Room inspection: Saturdays 10 AM\n• Laundry: Tue & Fri pickup\n• Wi-Fi: 6 AM – 12 AM\n• Outing pass: Request from warden 24h in advance\n\nWarden: Room 101, Admin Block.", suggestions: ["mess", "fees", "bus"] },
    { keywords: ["fee", "payment", "tuition", "receipt", "due", "pay"], response: "💳 Pending Fees:\n• Tuition: ₹75,000 (due Mar 15)\n• Hostel: ₹45,000 (due Apr 10)\n• Library: ₹2,000 (due tomorrow)\n\nPay via UPI, Card, or Net Banking in Parent Dashboard → Fee Payment. Receipts auto-generated.", suggestions: ["hostel", "exam"] },
    { keywords: ["club", "society", "join", "member"], response: "🎨 Active Clubs (6):\n• 💻 Tech Club — Hackathons & workshops\n• 🏏 Sports Club — Cricket, football\n• 🎭 Culture Club — Drama, art, dance\n• 👨‍💻 Coding Club — Competitive programming\n• 🎵 Music Club — Band practice & concerts\n• 🎪 Drama Club — Theatre productions\n\nJoin via Club Dashboard.", suggestions: ["event", "leaderboard"] },
    { keywords: ["exam", "test", "midterm", "internal", "assessment"], response: "📝 Upcoming Exams:\n• Mid-Semester: March 15-22\n• Assignment Deadline: March 8\n• Lab Viva: March 25\n\nYour marks: DS (82, A), OS (75, A-), DBMS (88, A+), CN (68, B+), Math (78, A).", suggestions: ["marks", "attendance", "report card"] },
    { keywords: ["marks", "grade", "cgpa", "gpa", "result", "score", "report card"], response: "📈 Academic Performance:\n• CGPA: 8.7 / 10\n• Percentage: 78.2%\n• Best: DBMS (88, A+)\n• Needs work: CN (68, B+)\n\nDownload full report: Student Dashboard → Report Card → Print/Save PDF.", suggestions: ["exam", "attendance"] },
    { keywords: ["bus", "transport", "route", "shuttle"], response: "🚌 Bus Schedule:\n• Route A (City Center): 7:30→8:30 AM\n• Route B (Railway Stn): 7:15→8:20 AM\n• Route C (Suburb East): 7:00→8:10 AM\n• Route D (Highway Jn): 7:45→8:30 AM\n\nEvening return: 5 PM from Main Gate.", suggestions: ["hostel", "timetable"] },
    { keywords: ["event", "fest", "techno", "rhythm", "cultural", "rsvp"], response: "🎉 Upcoming Events:\n• TechnoVerse 2026 — Mar 10 (Main Auditorium)\n• Rhythm Night — Mar 5, 6 PM (Open Air Theatre)\n• Startup Pitch Day — Mar 15 (Seminar Hall B)\n• Cultural Night — Mar 20 (College Ground)\n\nRSVP in Club Dashboard with live countdown!", suggestions: ["club", "placement"] },
    { keywords: ["placement", "job", "intern", "career", "company", "recruit"], response: "💼 Placement Drives:\n• Infosys: March 25 (CGPA ≥ 7.0)\n• TCS NQT: April 5 (All branches)\n• Wipro Phase 2: April 15\n• Startups Day: April 20\n\nRegister via Announcements. Placement Cell: Room 202.", suggestions: ["exam", "marks"] },
    { keywords: ["library", "book", "borrow", "return", "reading"], response: "📚 Library: 8 AM – 10 PM (11 PM exam week)\n• Max books: 4, for 14 days\n• Late fine: ₹5/day\n• Digital library: 24/7 on campus Wi-Fi\n\nLibrary fee ₹2,000 due tomorrow.", suggestions: ["fees", "exam"] },
    { keywords: ["teacher", "faculty", "professor", "office", "mentor"], response: "👨‍🏫 Key Faculty:\n• Dr. Ramesh Kumar — DSA (Room 301)\n• Prof. Anita Desai — DBMS (Room 205)\n• Dr. Sanjay Patel — OS (Room 310)\n• Prof. Meera Nair — CN (Room 208)\n\nOffice hours: 2-4 PM weekdays.", suggestions: ["timetable", "marks"] },
    { keywords: ["map", "location", "building", "where", "campus", "navigate"], response: "🗺️ Key Buildings:\n• CS Building — Academic (78% occupancy)\n• Library — 8 AM-10 PM (85% full)\n• Auditorium — Events & lectures\n• Sports Ground — 6-8 AM & 4-6 PM\n\nInteractive map in Admin Dashboard — click buildings for schedule!", suggestions: ["bus", "hostel"] },
    { keywords: ["leaderboard", "rank", "top", "topper", "badge", "streak"], response: "🏆 Leaderboard Top 3:\n1. Ananya Iyer (CSE) — 960 pts, 28-day streak 🏆🔥⭐\n2. Priya Sharma (ECE) — 920 pts 🥈\n3. Arjun Mehta (CSE) — 845 pts 🥉\n\nEarn badges: attendance streaks (🔥) and CGPA >9 (⭐)!", suggestions: ["attendance", "marks"] },
    { keywords: ["notification", "alert", "dnd", "disturb"], response: "🔔 Notification Settings:\n• DND toggle: Header bell icon (next to theme toggle)\n• DND ON → toast popups suppressed\n• Panel still stores all alerts\n• Current unread: 2", suggestions: ["theme", "help"] },
    { keywords: ["theme", "dark", "light", "color", "accent"], response: "🎨 Customize your theme:\n• Dark/Light: Moon/sun icon in header\n• Accent: Palette icon → Crimson, Ocean, Emerald, Violet, Amber, Rose\n\nChanges apply instantly across all pages!", suggestions: ["notification", "help"] },
    { keywords: ["sport", "cricket", "football", "gym", "ground", "play"], response: "⚽ Sports Facilities:\n• Cricket: 6-8 AM morning practice\n• Football: 4-6 PM evening sessions\n• Gym: 6 AM-9 PM (Hostel Block B)\n• Indoor: TT, Badminton, Chess\n\nJoin Sports Club for inter-college tournaments!", suggestions: ["club", "event"] },
    { keywords: ["health", "medical", "doctor", "clinic", "sick", "emergency"], response: "🏥 Health Center: Admin Block, Ground Floor\n• Hours: 9 AM – 5 PM weekdays\n• Emergency: 24/7 (campus security)\n• Doctor: Dr. Priya Menon\n• Free consultation for students\n• Ambulance: Extension 100", suggestions: ["hostel", "help"] },
    { keywords: ["wifi", "internet", "network", "password"], response: "📶 Campus Wi-Fi:\n• SSID: OC2DAY-Campus\n• Login: Student email & ID\n• Hostel: 6 AM – 12 AM\n• Library: 24/7, 100 Mbps shared\n\nIssues? IT Help Desk: Room 105, Admin Block.", suggestions: ["library", "hostel"] },
    { keywords: ["hi", "hello", "hey", "good morning", "good evening", "namaste", "sup"], response: "Hey there! 👋 I'm your oc-2-day campus assistant.\n\n📅 Academics — timetable, marks, attendance\n🍽️ Campus Life — mess, hostel, library, sports\n💳 Admin — fees, placements, bus routes\n🎉 Fun — clubs, events, leaderboard\n\nJust type a topic!", suggestions: ["timetable", "event", "marks", "mess"] },
    { keywords: ["help", "what can you do", "commands", "guide", "how to"], response: "🐙 I know 20+ topics:\n\n📚 Academic: timetable, attendance, marks, exam, report card\n🏠 Campus: hostel, mess, library, map, bus, wifi, sports\n💰 Finance: fees, payment, receipt\n🎭 Fun: clubs, events, leaderboard, placements\n⚙️ Settings: theme, notifications, DND\n🏥 Services: health center, faculty", suggestions: ["timetable", "event", "marks", "fees"] },
    { keywords: ["thank", "thanks", "thx", "bye", "goodbye", "see you"], response: "You're welcome! 🐙 Happy to help anytime. Have a great day on campus! ✨", suggestions: ["help"] },
]

function getResponse(input: string): { text: string; suggestions?: string[] } {
    const lower = input.toLowerCase()
    let bestMatch = { score: 0, response: "", suggestions: undefined as string[] | undefined }
    for (const topic of knowledgeBase) {
        const score = topic.keywords.filter((k) => lower.includes(k)).length
        if (score > bestMatch.score) {
            bestMatch = { score, response: topic.response, suggestions: topic.suggestions }
        }
    }
    if (bestMatch.score > 0) return { text: bestMatch.response, suggestions: bestMatch.suggestions }
    return { text: "🤔 I'm not sure about that. Try asking about:\n• timetable, attendance, marks, exam\n• mess, hostel, library, fees\n• clubs, events, placements, bus\n• health center, sports, wifi\n\nOr type 'help' for the full list!", suggestions: ["help", "timetable", "event"] }
}

export function OctaBot() {
    const [open, setOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>([
        { id: 0, text: "Hey! 🐙 I'm OctaBot, your campus assistant. I know about timetables, attendance, mess menu, hostel, fees, clubs, placements, and more!\n\nTry asking me anything!", sender: "bot", suggestions: ["timetable", "mess menu", "exam", "clubs"] },
    ])
    const [input, setInput] = useState("")
    const [typing, setTyping] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages, typing])

    useEffect(() => {
        if (open && inputRef.current) {
            inputRef.current.focus()
        }
    }, [open])

    const handleSend = (text?: string) => {
        const msgText = text || input.trim()
        if (!msgText) return
        const userMsg: Message = { id: Date.now(), text: msgText, sender: "user" }
        setMessages((prev) => [...prev, userMsg])
        setInput("")
        setTyping(true)

        setTimeout(() => {
            const { text: responseText, suggestions } = getResponse(msgText)
            const botMsg: Message = { id: Date.now() + 1, text: responseText, sender: "bot", suggestions }
            setMessages((prev) => [...prev, botMsg])
            setTyping(false)
        }, 600 + Math.random() * 400)
    }

    return (
        <>
            {/* FAB Button */}
            <motion.button
                onClick={() => setOpen(!open)}
                className={cn(
                    "fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-2xl transition-colors",
                    open ? "bg-card border border-border" : "bg-primary glow-red"
                )}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                aria-label={open ? "Close chat" : "Open OctaBot"}
            >
                <AnimatePresence mode="wait">
                    {open ? (
                        <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                            <X className="h-5 w-5 text-foreground" />
                        </motion.div>
                    ) : (
                        <motion.div key="open" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ type: "spring", damping: 15 }}>
                            <MessageCircle className="h-6 w-6 text-primary-foreground" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>

            {/* Chat Panel */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed bottom-24 right-6 z-50 flex w-[360px] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
                        style={{ height: "520px" }}
                    >
                        {/* Header */}
                        <div className="flex items-center gap-3 border-b border-border bg-primary/5 px-4 py-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20">
                                <Bot className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-foreground">OctaBot</p>
                                <p className="text-[10px] text-muted-foreground">Campus AI · 20+ topics</p>
                            </div>
                            <div className="ml-auto flex items-center gap-1.5">
                                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Online</span>
                            </div>
                        </div>

                        {/* Messages */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className={cn("flex flex-col", msg.sender === "user" ? "items-end" : "items-start")}
                                >
                                    <div
                                        className={cn(
                                            "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-line",
                                            msg.sender === "user"
                                                ? "bg-primary text-primary-foreground rounded-br-md"
                                                : "bg-secondary text-foreground rounded-bl-md"
                                        )}
                                    >
                                        {msg.text}
                                    </div>
                                    {/* Suggestion chips */}
                                    {msg.sender === "bot" && msg.suggestions && msg.suggestions.length > 0 && (
                                        <div className="mt-1.5 flex flex-wrap gap-1">
                                            {msg.suggestions.map((s) => (
                                                <button
                                                    key={s}
                                                    onClick={() => handleSend(s)}
                                                    className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[10px] font-medium text-primary hover:bg-primary/20 transition-colors"
                                                >
                                                    {s}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            ))}

                            {/* Typing indicator */}
                            {typing && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex justify-start"
                                >
                                    <div className="flex items-center gap-1.5 rounded-2xl bg-secondary px-4 py-3 rounded-bl-md">
                                        <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                                        <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                                        <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Input */}
                        <div className="border-t border-border px-3 py-3">
                            <div className="flex items-center gap-2">
                                <input
                                    ref={inputRef}
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                    placeholder="Ask me anything..."
                                    className="flex-1 rounded-xl border border-border bg-input px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
                                />
                                <button
                                    onClick={() => handleSend()}
                                    disabled={!input.trim()}
                                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 transition-all"
                                >
                                    <Send className="h-4 w-4" />
                                </button>
                            </div>
                            <p className="mt-2 text-center text-[10px] text-muted-foreground/50">
                                Powered by OctaBot · 20+ campus topics
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
