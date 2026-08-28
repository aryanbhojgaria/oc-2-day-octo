"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { PageTransition } from "@/components/layout/page-transition"
import { AnimatedOctopus } from "@/components/octopus/animated-octopus"
import { ThemeToggle } from "@/components/theme-toggle"
import { ArrowLeft, Code2, Layers, Zap, Shield, Users, BarChart3, Sparkles, ArrowRight } from "lucide-react"

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

// Stagger container for groups
const staggerContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
}

const staggerItem = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 100,
    },
  },
}

// Alternating slide-in for team cards
const slideFromLeft = {
  hidden: { opacity: 0, x: -60 },
  show: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", damping: 20, stiffness: 90 },
  },
}

const slideFromRight = {
  hidden: { opacity: 0, x: 60 },
  show: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", damping: 20, stiffness: 90 },
  },
}

export default function AboutPage() {
  return (
    <PageTransition>
      <div className="relative min-h-screen bg-background bg-grid noise-overlay">
        {/* Animated gradient orbs */}
        <div className="pointer-events-none absolute top-[20%] right-[-10%] h-[500px] w-[500px] rounded-full bg-gradient-to-br from-primary/6 via-primary/2 to-transparent blur-3xl animate-float" />
        <div className="pointer-events-none absolute bottom-[10%] left-[-5%] h-[400px] w-[400px] rounded-full bg-gradient-to-tr from-primary/5 via-transparent to-transparent blur-3xl animate-scale-pulse" />

        <motion.div
          className="pointer-events-none absolute left-[-8%] bottom-[5%] w-[300px] opacity-10 rotate-12 lg:w-[400px]"
          animate={{ y: [0, -10, 0], rotate: [12, 14, 12] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          <AnimatedOctopus />
        </motion.div>

        <motion.nav
          className="relative z-10 flex items-center justify-between px-6 py-5 lg:px-12"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/login"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-all btn-glow"
            >
              Get Started
            </Link>
          </div>
        </motion.nav>

        {/* Hero section */}
        <section className="relative z-10 px-6 pt-12 pb-16 lg:px-12 lg:pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <motion.div
              className="mb-3 inline-flex items-center gap-2 rounded-full border bg-secondary/60 px-3 py-1 animate-shimmer-border"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Sparkles className="h-3 w-3 text-primary animate-pulse" />
              <span className="text-xs font-medium text-muted-foreground">About the Platform</span>
            </motion.div>
            <h1 className="mt-3 text-balance text-4xl font-bold text-foreground lg:text-5xl">
              Rethinking How Colleges <span className="text-gradient">Operate</span>
            </h1>
            <motion.p
              className="mt-5 text-pretty text-base leading-relaxed text-muted-foreground lg:text-lg"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              oc-2-day is an intelligent campus coordination system designed to replace fragmented college workflows
              with a single, cohesive platform. Like an octopus with its many arms working in harmony, our system
              connects every stakeholder in the educational ecosystem.
            </motion.p>
          </motion.div>
        </section>

        {/* Capabilities */}
        <section className="relative z-10 px-6 pb-16 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-foreground lg:text-3xl">Platform Capabilities</h2>
          </motion.div>

          <motion.div
            className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {capabilities.map((cap, i) => (
              <motion.div
                key={cap.title}
                variants={staggerItem}
                className="group rounded-xl border border-border bg-card/60 p-5 backdrop-blur-sm transition-all hover:border-primary/30 card-hover glass"
              >
                <motion.div
                  className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10"
                  whileHover={{ rotate: [0, -8, 8, 0], scale: 1.1 }}
                  transition={{ duration: 0.4 }}
                >
                  <cap.icon className="h-4 w-4 text-primary" />
                </motion.div>
                <h3 className="font-semibold text-foreground">{cap.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{cap.desc}</p>
                {/* Hover gradient line */}
                <div className="mt-3 h-px w-full bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Team — cards slide in from alternating sides */}
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

          <motion.div
            className="mt-8 flex flex-wrap gap-4"
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {teamMembers.map((member, i) => (
              <motion.div
                key={member.name}
                variants={i % 2 === 0 ? slideFromLeft : slideFromRight}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="rounded-xl border border-border bg-card/60 px-6 py-4 backdrop-blur-sm card-hover glass"
              >
                <motion.div
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  {member.name.split(" ").map((n) => n[0]).join("")}
                </motion.div>
                <p className="mt-3 font-semibold text-foreground">{member.name}</p>
                <p className="text-xs text-muted-foreground">{member.role}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* CTA — animated gradient background on scroll */}
        <section className="relative z-10 px-6 pb-20 lg:px-12">
          <motion.div
            className="relative overflow-hidden rounded-xl border border-primary/30 bg-primary/5 p-8 lg:p-12"
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", damping: 20, stiffness: 90 }}
          >
            {/* Animated gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 animate-gradient opacity-50" />
            <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-primary/10 blur-2xl animate-float" />

            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-foreground lg:text-3xl">Ready to explore?</h2>
              <p className="mt-2 text-sm text-muted-foreground">Log in as any role to experience the platform firsthand.</p>
              <div className="mt-6">
                <Link
                  href="/login"
                  className="group inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all btn-glow"
                >
                  Enter All Portals
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </motion.div>
        </section>

        <motion.footer
          className="relative z-10 border-t border-border px-6 py-6 lg:px-12 glass"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p className="text-xs text-muted-foreground">oc-2-day 2026. Hackathon Prototype.</p>
        </motion.footer>
      </div>
    </PageTransition>
  )
}
