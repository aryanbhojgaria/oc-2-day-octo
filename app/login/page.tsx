"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { AnimatedOctopus } from "@/components/octopus/animated-octopus"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  Shield,
  BookOpen,
  GraduationCap,
  Heart,
  Palette,
  Copy,
  Check,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface RoleConfig {
  key: string
  label: string
  icon: LucideIcon
  desc: string
  dashboardPath: string
  credentials: { email: string; password: string }
  color: string
}

const roles: RoleConfig[] = [
  {
    key: "admin",
    label: "Admin",
    icon: Shield,
    desc: "Manage the entire campus ecosystem",
    dashboardPath: "/dashboard/admin",
    credentials: { email: "admin@oc-2-day.edu", password: "admin@2026" },
    color: "from-red-600/20 to-red-900/10",
  },
  {
    key: "teacher",
    label: "Teacher",
    icon: BookOpen,
    desc: "Classes, attendance, and grading",
    dashboardPath: "/dashboard/teacher",
    credentials: { email: "teacher@oc-2-day.edu", password: "teach@2026" },
    color: "from-rose-600/20 to-rose-900/10",
  },
  {
    key: "student",
    label: "Student",
    icon: GraduationCap,
    desc: "Academics, hostel, and campus life",
    dashboardPath: "/dashboard/student",
    credentials: { email: "student@oc-2-day.edu", password: "stud@2026" },
    color: "from-red-500/20 to-red-800/10",
  },
  {
    key: "parent",
    label: "Parent",
    icon: Heart,
    desc: "Track ward performance and fees",
    dashboardPath: "/dashboard/parent",
    credentials: { email: "parent@oc-2-day.edu", password: "parent@2026" },
    color: "from-red-700/20 to-red-950/10",
  },
  {
    key: "club",
    label: "Club",
    icon: Palette,
    desc: "Events, members, and club operations",
    dashboardPath: "/dashboard/club",
    credentials: { email: "club@oc-2-day.edu", password: "club@2026" },
    color: "from-rose-500/20 to-rose-800/10",
  },
]

// Floating particles for the entry animation
function FloatingParticles() {
  const [mounted, setMounted] = useState(false)
  const [particles] = useState(() =>
    Array.from({ length: 20 }).map((_, i) => ({
      x: ((i * 137.5) % 100) / 100 * 1200,
      y: ((i * 213.7) % 100) / 100 * 800,
      yEnd: -((i * 97.3) % 400) - 100,
      scaleEnd: ((i * 73.1) % 200) / 100 + 1,
      duration: ((i * 61.7) % 300) / 100 + 2,
      delay: ((i * 43.3) % 150) / 100,
      repeatDelay: ((i * 89.9) % 400) / 100 + 2,
    }))
  )

  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute h-1 w-1 rounded-full bg-primary/40"
          initial={{ x: p.x, y: p.y, scale: 0, opacity: 0 }}
          animate={{
            y: [null, p.yEnd],
            opacity: [0, 0.8, 0],
            scale: [0, p.scaleEnd, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            repeatDelay: p.repeatDelay,
          }}
        />
      ))}
    </div>
  )
}

// The hero entry animation overlay
function EntryAnimation({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2800)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <FloatingParticles />

      {/* Central Octopus with dramatic entrance */}
      <motion.div
        initial={{ scale: 0, rotate: -180, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ type: "spring", damping: 12, stiffness: 100, duration: 1.2 }}
        className="relative mb-8 w-48 lg:w-56"
      >
        <AnimatedOctopus />
        {/* Expanding rings */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full border border-primary/30"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 2.5 + i * 0.5, opacity: [0, 0.5, 0] }}
            transition={{ duration: 2, delay: 0.5 + i * 0.3, ease: "easeOut" }}
          />
        ))}
      </motion.div>

      {/* Text reveal */}
      <motion.div className="text-center">
        <motion.h1
          className="text-4xl font-bold tracking-tight text-foreground lg:text-6xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          oc-2<span className="text-primary">-day</span>
        </motion.h1>
        <motion.p
          className="mt-3 text-sm text-muted-foreground lg:text-base"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          Choose your portal to enter
        </motion.p>
      </motion.div>

      {/* Loading bar */}
      <motion.div
        className="mt-8 h-0.5 w-48 overflow-hidden rounded-full bg-muted"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <motion.div
          className="h-full bg-primary"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ delay: 1.2, duration: 1.4, ease: "easeInOut" }}
        />
      </motion.div>
    </motion.div>
  )
}

// Individual login card for a role
function RoleLoginCard({
  role,
  index,
  isVisible,
}: {
  role: RoleConfig
  index: number
  isVisible: boolean
}) {
  const router = useRouter()
  const [email, setEmail] = useState(role.credentials.email)
  const [password, setPassword] = useState(role.credentials.password)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    import("@/lib/api").then(({ auth, setToken }) => {
      auth.login(email, password)
        .then(result => {
          setToken(result.token)
          router.push(role.dashboardPath)
        })
        .catch(() => {
          setToken("mock-demo-token-" + role.key)
          router.push(role.dashboardPath)
        })
    })
  }

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 1500)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.85, rotateX: 15 }}
      animate={
        isVisible
          ? { opacity: 1, y: 0, scale: 1, rotateX: 0 }
          : { opacity: 0, y: 60, scale: 0.85, rotateX: 15 }
      }
      transition={{
        type: "spring",
        damping: 20,
        stiffness: 100,
        delay: index * 0.12,
      }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group relative"
    >
      <div className="overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary/50 hover:glow-red">
        {/* Gradient header */}
        <div className={cn("relative h-2 bg-gradient-to-r", role.color)}>
          <div className="absolute inset-0 bg-primary/60" />
        </div>

        <div className="p-5 lg:p-6">
          {/* Role header */}
          <div className="mb-5 flex items-center gap-3">
            <motion.div
              className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/15"
              whileHover={{ rotate: [0, -10, 10, 0], transition: { duration: 0.5 } }}
            >
              <role.icon className="h-5 w-5 text-primary" />
            </motion.div>
            <div>
              <h2 className="text-lg font-bold text-foreground">{role.label}</h2>
              <p className="text-xs text-muted-foreground">{role.desc}</p>
            </div>
          </div>

          {/* Pre-filled credentials display */}
          <div className="mb-4 rounded-lg border border-primary/20 bg-primary/5 p-3">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-primary">
              Demo Credentials
            </p>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-foreground">{role.credentials.email}</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(role.credentials.email, `${role.key}-email`)}
                  className="rounded p-1 text-muted-foreground hover:text-primary transition-colors"
                  aria-label="Copy email"
                >
                  {copiedField === `${role.key}-email` ? (
                    <Check className="h-3 w-3 text-primary" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-foreground">{role.credentials.password}</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(role.credentials.password, `${role.key}-pass`)}
                  className="rounded p-1 text-muted-foreground hover:text-primary transition-colors"
                  aria-label="Copy password"
                >
                  {copiedField === `${role.key}-pass` ? (
                    <Check className="h-3 w-3 text-primary" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Login form */}
          <form onSubmit={handleLogin} className="space-y-3">
            <div>
              <label htmlFor={`${role.key}-email`} className="mb-1 block text-xs font-medium text-foreground">
                Email
              </label>
              <input
                id={`${role.key}-email`}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                required
              />
            </div>

            <div>
              <label htmlFor={`${role.key}-password`} className="mb-1 block text-xs font-medium text-foreground">
                Password
              </label>
              <div className="relative">
                <input
                  id={`${role.key}-password`}
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-border bg-input px-3 py-2 pr-9 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-70 transition-colors"
              whileTap={{ scale: 0.97 }}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Entering...
                </>
              ) : (
                <>
                  Enter {role.label} Portal
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </motion.button>
          </form>
        </div>
      </div>
    </motion.div>
  )
}

export default function UnifiedLoginPage() {
  const [showEntry, setShowEntry] = useState(true)
  const [cardsVisible, setCardsVisible] = useState(false)

  const handleEntryComplete = () => {
    setShowEntry(false)
    // Small delay before showing cards for smooth transition
    setTimeout(() => setCardsVisible(true), 200)
  }

  return (
    <div className="relative min-h-screen bg-background bg-grid overflow-x-hidden">
      {/* Entry animation overlay */}
      <AnimatePresence mode="wait">
        {showEntry && <EntryAnimation onComplete={handleEntryComplete} />}
      </AnimatePresence>

      {/* Background octopus */}
      <div className="pointer-events-none fixed right-[-3%] top-[6%] w-[280px] opacity-[0.07] lg:w-[380px]">
        <AnimatedOctopus />
      </div>

      {/* Nav */}
      <motion.nav
        className="relative z-10 flex items-center justify-between px-6 py-5 lg:px-12"
        initial={{ opacity: 0, y: -20 }}
        animate={!showEntry ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/logo.png" alt="oc-2-day" width={36} height={36} className="h-9 w-9 rounded-lg object-contain" />
          <span className="text-lg font-bold tracking-tight text-foreground">oc-2-day</span>
        </Link>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg border border-border bg-secondary/60 px-4 py-2 text-sm font-medium text-foreground hover:border-primary/40 transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Home</span>
          </Link>
        </div>
      </motion.nav>

      {/* Header */}
      <motion.div
        className="relative z-10 px-6 pt-4 pb-8 text-center lg:px-12 lg:pt-8 lg:pb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={!showEntry ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Choose Your Portal</p>
        <h1 className="mt-2 text-balance text-3xl font-bold text-foreground lg:text-4xl">
          Sign In to <span className="text-primary">oc-2-day</span>
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
          Select your role below. Demo credentials are pre-filled for each portal -- just hit sign in.
        </p>
      </motion.div>

      {/* Login Cards Grid */}
      <div className="relative z-10 px-6 pb-20 lg:px-12">
        {/* Top row: 3 cards */}
        <div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-3">
          {roles.slice(0, 3).map((role, i) => (
            <RoleLoginCard key={role.key} role={role} index={i} isVisible={cardsVisible} />
          ))}
        </div>
        {/* Bottom row: 2 cards centered */}
        <div className="mx-auto mt-5 grid max-w-5xl gap-5 md:grid-cols-3">
          <div className="md:col-start-1">
            <RoleLoginCard role={roles[3]} index={3} isVisible={cardsVisible} />
          </div>
          <div className="md:col-start-3">
            <RoleLoginCard role={roles[4]} index={4} isVisible={cardsVisible} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <motion.footer
        className="relative z-10 border-t border-border px-6 py-6 lg:px-12"
        initial={{ opacity: 0 }}
        animate={!showEntry ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 1 }}
      >
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-xs text-muted-foreground">oc-2-day 2026. Built for hackathon demonstration.</p>
          <p className="text-xs text-muted-foreground">All credentials above are for demo purposes only.</p>
        </div>
      </motion.footer>
    </div>
  )
}
