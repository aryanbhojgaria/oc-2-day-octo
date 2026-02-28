"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return (
      <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${className}`} />
    )
  }

  const isDark = theme === "dark"

  const handleToggle = () => {
    document.documentElement.classList.add("transitioning")
    setTheme(isDark ? "light" : "dark")
    setTimeout(() => {
      document.documentElement.classList.remove("transitioning")
    }, 350)
  }

  return (
    <button
      onClick={handleToggle}
      className={`relative flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors ${className}`}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.div
            key="moon"
            initial={{ rotate: -90, scale: 0, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 90, scale: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Moon className="h-4 w-4" />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ rotate: 90, scale: 0, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: -90, scale: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Sun className="h-4 w-4" />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  )
}
