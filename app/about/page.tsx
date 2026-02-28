"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { PageTransition } from "@/components/layout/page-transition"
import { AnimatedOctopus } from "@/components/octopus/animated-octopus"
import { ThemeToggle } from "@/components/theme-toggle"
import { ArrowLeft, Code2, Layers, Zap, Shield, Users, BarChart3 } from "lucide-react"

const capabilities = [
  { icon: Shield, title: "Role-Based Access", desc: "Five distinct dashboards for admins, teachers, students, parents, and clubs." },
  { icon: Layers, title: "Modular Architecture", desc: "Each module works independently yet integrates seamlessly with others." },
  { icon: Zap, title: "Real-Time Updates", desc: "Instant notifications, live attendance, and dynamic event management." },
  { icon: Users, title: "Club Ecosystem", desc: "Full lifecycle event management with poster uploads and member coordination." },
  { icon: BarChart3, title: "Analytics Dashboard", desc: "Performance metrics, attendance trends, and institutional insights." },
  { icon: Code2, title: "Modern Stack", desc: "Built with Next.js, TypeScript, Tailwind CSS, and Shadcn UI." },
]

const teamMembers = [
  { name: "Arjun Mehta", role: "Full-Stack Developer" },
  { name: "Priya Sharma", role: "UI/UX Designer" },
  { name: "Rohan Gupta", role: "Backend Architect" },
]

export default function AboutPage() {
  return (
    <PageTransition>
      <div className="relative min-h-screen bg-background bg-grid">
        <div className="pointer-events-none absolute left-[-8%] bottom-[5%] w-[300px] opacity-10 rotate-12 lg:w-[400px]">
          <AnimatedOctopus />
        </div>

        <nav className="relative z-10 flex items-center justify-between px-6 py-5 lg:px-12">
          <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/login"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </nav>

        <section className="relative z-10 px-6 pt-12 pb-16 lg:px-12 lg:pt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">About the Platform</p>
            <h1 className="mt-3 text-balance text-4xl font-bold text-foreground lg:text-5xl">
              Rethinking How Colleges <span className="text-primary">Operate</span>
            </h1>
            <p className="mt-5 text-pretty text-base leading-relaxed text-muted-foreground lg:text-lg">
              oc-2-day is an intelligent campus coordination system designed to replace fragmented college workflows
              with a single, cohesive platform. Like an octopus with its many arms working in harmony, our system
              connects every stakeholder in the educational ecosystem.
            </p>
          </motion.div>
        </section>

        <section className="relative z-10 px-6 pb-16 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-foreground lg:text-3xl">Platform Capabilities</h2>
          </motion.div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((cap, i) => (
              <motion.div
                key={cap.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="rounded-xl border border-border bg-card/60 p-5 backdrop-blur-sm transition-all hover:border-primary/30"
              >
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <cap.icon className="h-4 w-4 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">{cap.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{cap.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="relative z-10 px-6 pb-16 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-foreground lg:text-3xl">Built By</h2>
            <p className="mt-2 text-sm text-muted-foreground">A small team with a big vision for campus tech.</p>
          </motion.div>

          <div className="mt-8 flex flex-wrap gap-4">
            {teamMembers.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="rounded-xl border border-border bg-card/60 px-6 py-4 backdrop-blur-sm"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
                  {member.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <p className="mt-3 font-semibold text-foreground">{member.name}</p>
                <p className="text-xs text-muted-foreground">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="relative z-10 px-6 pb-20 lg:px-12">
          <div className="rounded-xl border border-primary/30 bg-primary/5 p-8 lg:p-12">
            <h2 className="text-2xl font-bold text-foreground lg:text-3xl">Ready to explore?</h2>
            <p className="mt-2 text-sm text-muted-foreground">Log in as any role to experience the platform firsthand.</p>
            <div className="mt-6">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Enter All Portals
              </Link>
            </div>
          </div>
        </section>

        <footer className="relative z-10 border-t border-border px-6 py-6 lg:px-12">
          <p className="text-xs text-muted-foreground">oc-2-day 2026. Hackathon Prototype.</p>
        </footer>
      </div>
    </PageTransition>
  )
}
