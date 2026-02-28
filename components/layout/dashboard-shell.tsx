"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/theme-toggle"
import { AccentSwitcher } from "@/components/accent-switcher"
import { OctaBot } from "@/components/octobot/octobot"
import { CommandSearch } from "@/components/command-search"
import { NotificationCenter } from "@/components/notification-center"
import { DNDProvider, useDND } from "@/components/dnd-context"
import { LogOut, Menu, X, BellOff, Bell } from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface NavItem {
  label: string
  href: string
  icon: LucideIcon
}

interface DashboardShellProps {
  role: string
  navItems: NavItem[]
  children: React.ReactNode
  activeNav?: string
  onNavClick?: (label: string) => void
}

export function DashboardShell({ role, navItems, children, activeNav, onNavClick }: DashboardShellProps) {
  return (
    <DNDProvider>
      <DashboardShellInner role={role} navItems={navItems} activeNav={activeNav} onNavClick={onNavClick}>{children}</DashboardShellInner>
    </DNDProvider>
  )
}

function DashboardShellInner({ role, navItems, children, activeNav, onNavClick }: DashboardShellProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { dndEnabled, toggleDND } = useDND()

  useEffect(() => {
    import("@/lib/api").then(({ getToken }) => {
      if (!getToken()) {
        router.push("/login")
      }
    })
  }, [router])

  return (
    <div className="flex h-screen bg-background bg-grid overflow-hidden">
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-sidebar transition-transform duration-300 lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center gap-3 border-b border-border px-5 py-5">
          <Image src="/logo.png" alt="oc-2-day" width={36} height={36} className="h-9 w-9 rounded-lg object-contain" />
          <div>
            <p className="text-sm font-semibold text-foreground">oc-2-day</p>
            <p className="text-xs text-muted-foreground capitalize">{role} Panel</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const isActive = activeNav
              ? activeNav.toLowerCase() === item.label.toLowerCase()
              : pathname === item.href
            return (
              <button
                key={item.label}
                onClick={() => {
                  if (onNavClick) {
                    onNavClick(item.label.toLowerCase())
                  }
                  setSidebarOpen(false)
                }}
                className={cn(
                  "relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors text-left",
                  isActive
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-indicator"
                    className="absolute left-0 h-8 w-1 rounded-r-full bg-primary"
                  />
                )}
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            )
          })}
        </nav>

        <div className="border-t border-border p-3">
          <button
            onClick={() => {
              import("@/lib/api").then(({ clearToken }) => {
                clearToken()
                window.location.href = "/"
              })
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors text-left"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <header className="flex items-center justify-between border-b border-border bg-sidebar px-4 py-3 lg:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-muted-foreground hover:bg-secondary lg:hidden"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <div className="hidden lg:block">
            <h1 className="text-lg font-semibold text-foreground capitalize">{role} Dashboard</h1>
          </div>

          <div className="flex items-center gap-2">
            <CommandSearch />
            <AccentSwitcher />
            <ThemeToggle />
            <button
              onClick={toggleDND}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-lg border transition-colors",
                dndEnabled
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
              aria-label={dndEnabled ? "Disable Do Not Disturb" : "Enable Do Not Disturb"}
              title={dndEnabled ? "DND: On" : "DND: Off"}
            >
              {dndEnabled ? <BellOff className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
            </button>
            <NotificationCenter />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>

      {/* OctaBot AI Chatbot */}
      <OctaBot />
    </div>
  )
}
