"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Shield, GraduationCap, BookOpen, Heart, Palette, Moon, Sun, Command } from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

interface SearchItem {
    label: string
    group: string
    icon: typeof Shield
    action: () => void
}

export function CommandSearch() {
    const [open, setOpen] = useState(false)
    const [query, setQuery] = useState("")
    const [selectedIndex, setSelectedIndex] = useState(0)
    const router = useRouter()
    const { setTheme, theme } = useTheme()

    const items: SearchItem[] = [
        { label: "Admin Dashboard", group: "Navigate", icon: Shield, action: () => router.push("/dashboard/admin") },
        { label: "Student Dashboard", group: "Navigate", icon: GraduationCap, action: () => router.push("/dashboard/student") },
        { label: "Teacher Dashboard", group: "Navigate", icon: BookOpen, action: () => router.push("/dashboard/teacher") },
        { label: "Parent Dashboard", group: "Navigate", icon: Heart, action: () => router.push("/dashboard/parent") },
        { label: "Club Dashboard", group: "Navigate", icon: Palette, action: () => router.push("/dashboard/club") },
        { label: "Landing Page", group: "Navigate", icon: Command, action: () => router.push("/") },
        { label: "About Page", group: "Navigate", icon: Search, action: () => router.push("/about") },
        { label: "Login Page", group: "Navigate", icon: Shield, action: () => router.push("/login") },
        { label: "Toggle Dark Mode", group: "Actions", icon: Moon, action: () => setTheme(theme === "dark" ? "light" : "dark") },
        { label: "Switch to Light", group: "Actions", icon: Sun, action: () => setTheme("light") },
        { label: "Switch to Dark", group: "Actions", icon: Moon, action: () => setTheme("dark") },
    ]

    const filtered = query
        ? items.filter((item) => item.label.toLowerCase().includes(query.toLowerCase()))
        : items

    const groups = [...new Set(filtered.map((item) => item.group))]

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault()
                setOpen((prev) => !prev)
                setQuery("")
                setSelectedIndex(0)
            }
            if (e.key === "Escape") {
                setOpen(false)
            }
        }
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [])

    useEffect(() => {
        setSelectedIndex(0)
    }, [query])

    const handleSelect = (item: SearchItem) => {
        item.action()
        setOpen(false)
        setQuery("")
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowDown") {
            e.preventDefault()
            setSelectedIndex((prev) => (prev + 1) % filtered.length)
        } else if (e.key === "ArrowUp") {
            e.preventDefault()
            setSelectedIndex((prev) => (prev - 1 + filtered.length) % filtered.length)
        } else if (e.key === "Enter" && filtered[selectedIndex]) {
            handleSelect(filtered[selectedIndex])
        }
    }

    return (
        <>
            {/* Trigger button */}
            <button
                onClick={() => { setOpen(true); setQuery(""); setSelectedIndex(0) }}
                className="hidden lg:flex items-center gap-2 rounded-lg border border-border bg-secondary/50 px-3 py-1.5 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            >
                <Search className="h-3.5 w-3.5" />
                <span>Search...</span>
                <kbd className="ml-4 rounded-md border border-border bg-card px-1.5 py-0.5 text-[10px] font-mono font-medium text-muted-foreground">
                    ⌘K
                </kbd>
            </button>

            {/* Dialog */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 pt-[15vh]"
                        onClick={() => setOpen(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="w-full max-w-lg overflow-hidden rounded-xl border border-border bg-card shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Search Input */}
                            <div className="flex items-center gap-3 border-b border-border px-4 py-3">
                                <Search className="h-4 w-4 text-muted-foreground shrink-0" />
                                <input
                                    autoFocus
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Search pages, actions..."
                                    className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                                />
                                <kbd className="rounded-md border border-border bg-secondary px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
                                    ESC
                                </kbd>
                            </div>

                            {/* Results */}
                            <div className="max-h-72 overflow-y-auto p-2">
                                {filtered.length === 0 && (
                                    <div className="py-8 text-center text-sm text-muted-foreground">
                                        No results found.
                                    </div>
                                )}
                                {groups.map((group) => (
                                    <div key={group}>
                                        <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">{group}</p>
                                        {filtered
                                            .filter((item) => item.group === group)
                                            .map((item) => {
                                                const globalIndex = filtered.indexOf(item)
                                                return (
                                                    <button
                                                        key={item.label}
                                                        onClick={() => handleSelect(item)}
                                                        onMouseEnter={() => setSelectedIndex(globalIndex)}
                                                        className={cn(
                                                            "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                                                            globalIndex === selectedIndex
                                                                ? "bg-primary/10 text-primary"
                                                                : "text-foreground hover:bg-secondary"
                                                        )}
                                                    >
                                                        <item.icon className="h-4 w-4 shrink-0" />
                                                        <span>{item.label}</span>
                                                    </button>
                                                )
                                            })}
                                    </div>
                                ))}
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-between border-t border-border px-4 py-2">
                                <div className="flex items-center gap-3 text-[10px] text-muted-foreground/60">
                                    <span>↑↓ Navigate</span>
                                    <span>↵ Select</span>
                                    <span>ESC Close</span>
                                </div>
                                <span className="text-[10px] text-muted-foreground/40">oc-2-day</span>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
