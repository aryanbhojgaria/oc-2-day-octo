"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Palette } from "lucide-react"
import { cn } from "@/lib/utils"

const accentPresets = [
    { name: "Crimson", hue: "25", chroma: "0.22", lightness: "0.55", preview: "#c53030" },
    { name: "Ocean", hue: "240", chroma: "0.15", lightness: "0.55", preview: "#3b82f6" },
    { name: "Emerald", hue: "145", chroma: "0.18", lightness: "0.50", preview: "#10b981" },
    { name: "Violet", hue: "285", chroma: "0.18", lightness: "0.55", preview: "#8b5cf6" },
    { name: "Amber", hue: "60", chroma: "0.20", lightness: "0.55", preview: "#f59e0b" },
    { name: "Rose", hue: "350", chroma: "0.20", lightness: "0.55", preview: "#f43f5e" },
]

export function AccentSwitcher() {
    const [open, setOpen] = useState(false)
    const [activePreset, setActivePreset] = useState(accentPresets[0].name)
    const [mounted, setMounted] = useState(false)

    useEffect(() => setMounted(true), [])

    const applyAccent = (preset: typeof accentPresets[0]) => {
        setActivePreset(preset.name)
        const root = document.documentElement

        // Update CSS custom properties for primary color
        root.style.setProperty("--primary", `oklch(${preset.lightness} ${preset.chroma} ${preset.hue})`)
        root.style.setProperty("--primary-foreground", "oklch(0.98 0 0)")

        // Update sidebar, ring, and chart colors to match
        root.style.setProperty("--ring", `oklch(${preset.lightness} ${preset.chroma} ${preset.hue})`)
        root.style.setProperty("--sidebar-primary", `oklch(${preset.lightness} ${preset.chroma} ${preset.hue})`)
        root.style.setProperty("--chart-1", `oklch(${preset.lightness} ${preset.chroma} ${preset.hue})`)

        setOpen(false)
    }

    if (!mounted) return null

    return (
        <div className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                aria-label="Change accent color"
            >
                <Palette className="h-4 w-4" />
            </button>

            <AnimatePresence>
                {open && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[70]"
                            onClick={() => setOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: -8, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -8, scale: 0.95 }}
                            transition={{ type: "spring", damping: 20 }}
                            className="absolute right-0 top-12 z-[75] w-56 overflow-hidden rounded-xl border border-border bg-card p-3 shadow-2xl"
                        >
                            <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                                Accent Color
                            </p>
                            <div className="grid grid-cols-3 gap-2">
                                {accentPresets.map((preset) => (
                                    <button
                                        key={preset.name}
                                        onClick={() => applyAccent(preset)}
                                        className={cn(
                                            "flex flex-col items-center gap-1.5 rounded-lg p-2 transition-colors",
                                            activePreset === preset.name ? "bg-secondary ring-1 ring-primary" : "hover:bg-secondary/60"
                                        )}
                                    >
                                        <div
                                            className="h-6 w-6 rounded-full ring-2 ring-offset-2 ring-offset-card transition-all"
                                            style={{
                                                backgroundColor: preset.preview,
                                                opacity: activePreset === preset.name ? 1 : 0.8,
                                                borderColor: activePreset === preset.name ? preset.preview : "transparent",
                                            }}
                                        />
                                        <span className="text-[10px] font-medium text-muted-foreground">{preset.name}</span>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}
