"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { AnimatedOctopus } from "@/components/octopus/animated-octopus"
import { ThemeToggle } from "@/components/theme-toggle"
import { ArrowLeft, Eye, EyeOff, Loader2, Copy, Check } from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface LoginFormProps {
  role: string
  icon: LucideIcon
  dashboardPath: string
  credentials?: { email: string; password: string }
}

const defaultCredentials: Record<string, { email: string; password: string }> = {
  admin: { email: "admin@oc-2-day.edu", password: "admin@2026" },
  teacher: { email: "teacher@oc-2-day.edu", password: "teach@2026" },
  student: { email: "student@oc-2-day.edu", password: "stud@2026" },
  parent: { email: "parent@oc-2-day.edu", password: "parent@2026" },
  club: { email: "club@oc-2-day.edu", password: "club@2026" },
}

export function LoginForm({ role, icon: Icon, dashboardPath, credentials }: LoginFormProps) {
  const router = useRouter()
  const creds = credentials || defaultCredentials[role] || { email: "", password: "" }
  const [email, setEmail] = useState(creds.email)
  const [password, setPassword] = useState(creds.password)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      // Try real API auth first
      const { auth, setToken } = await import("@/lib/api")
      const result = await auth.login(email, password)
      setToken(result.token)
      router.push(dashboardPath)
    } catch {
      // Fallback: if backend is not running, allow demo login with correct credentials
      const demoCreds = defaultCredentials[role]
      if (demoCreds && email === demoCreds.email && password === demoCreds.password) {
        import("@/lib/api").then(({ setToken }) => {
          setToken("mock-demo-token-" + role)
          router.push(dashboardPath)
        })
      } else {
        setLoading(false)
        alert("Invalid credentials. Make sure the backend server is running or use the demo credentials.")
      }
    }
  }

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 1500)
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background bg-grid p-4">
      {/* Background octopus */}
      <div className="pointer-events-none absolute right-[5%] top-[10%] w-[240px] opacity-10 lg:w-[320px]">
        <AnimatedOctopus />
      </div>

      {/* Theme toggle */}
      <div className="fixed right-4 top-4 z-20">
        <ThemeToggle />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Back link */}
        <Link
          href="/login"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          All Portals
        </Link>

        {/* Card */}
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          {/* Red top border strip */}
          <div className="h-1 bg-primary" />

          <div className="p-8">
            {/* Role icon and title */}
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/15">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground capitalize">{role} Login</h1>
                <p className="text-xs text-muted-foreground">Sign in to your {role} portal</p>
              </div>
            </div>

            {/* Pre-filled credentials display */}
            <div className="mb-5 rounded-lg border border-primary/20 bg-primary/5 p-3">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-primary">
                Demo Credentials
              </p>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-foreground">{creds.email}</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(creds.email, "email")}
                    className="rounded p-1 text-muted-foreground hover:text-primary transition-colors"
                    aria-label="Copy email"
                  >
                    {copiedField === "email" ? (
                      <Check className="h-3 w-3 text-primary" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-foreground">{creds.password}</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(creds.password, "pass")}
                    className="rounded p-1 text-muted-foreground hover:text-primary transition-colors"
                    aria-label="Copy password"
                  >
                    {copiedField === "pass" ? (
                      <Check className="h-3 w-3 text-primary" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-foreground">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={`${role}@oc-2-day.edu`}
                  className="w-full rounded-lg border border-border bg-input px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-foreground">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full rounded-lg border border-border bg-input px-3.5 py-2.5 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-70 transition-colors"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
