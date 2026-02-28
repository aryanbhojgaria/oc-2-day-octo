"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { AnimatedOctopus } from "@/components/octopus/animated-octopus"
import { ThemeToggle } from "@/components/theme-toggle"
import { ArrowRight, BookOpen, Building2, Users, Shield, GraduationCap, UserCheck, Heart, Palette } from "lucide-react"

const roles = [
  { label: "Admin", href: "/login", icon: Shield, desc: "Manage the entire campus ecosystem" },
  { label: "Teacher", href: "/login", icon: BookOpen, desc: "Classes, attendance, and grading" },
  { label: "Student", href: "/login", icon: GraduationCap, desc: "Academics, hostel, and campus life" },
  { label: "Parent", href: "/login", icon: Heart, desc: "Track ward performance and fees" },
  { label: "Club", href: "/login", icon: Palette, desc: "Events, members, and club operations" },
]

const features = [
  {
    title: "Academic Management",
    desc: "Streamlined timetables, attendance tracking, grade management, and faculty coordination in one unified system.",
    icon: GraduationCap,
  },
  {
    title: "Campus Administration",
    desc: "Centralized announcements, request approvals, calendar management, and resource allocation tools.",
    icon: Building2,
  },
  {
    title: "Club Ecosystem",
    desc: "Event creation, poster management, member coordination, and cross-club collaboration features.",
    icon: Users,
  },
]

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-background bg-grid overflow-hidden">
      {/* Octopus floating in the background */}
      <div className="pointer-events-none absolute right-[-5%] top-[8%] w-[340px] opacity-15 lg:w-[480px]">
        <AnimatedOctopus />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 lg:px-12">
        <div className="flex items-center gap-2.5">
          <Image src="/logo.png" alt="oc-2-day" width={36} height={36} className="h-9 w-9 rounded-lg object-contain" />
          <span className="text-lg font-bold tracking-tight text-foreground">oc-2-day</span>
        </div>
        <div className="flex items-center gap-3 md:gap-6">
          <Link href="/about" className="hidden text-sm text-muted-foreground hover:text-foreground transition-colors md:block">
            About
          </Link>
          <ThemeToggle />
          <Link
            href="/login"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 px-6 pt-16 pb-20 lg:px-12 lg:pt-28 lg:pb-32">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-3 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-medium text-muted-foreground">Intelligent Campus OS</span>
            </div>
            <h1 className="text-balance text-5xl font-bold tracking-tight text-foreground lg:text-7xl">
              oc-2-<span className="text-primary">campus</span>
            </h1>
            <p className="mt-5 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground lg:text-xl">
              A next-generation college coordination system that connects students, teachers, parents, and administrators through one intelligent platform.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-8 flex flex-wrap gap-4"
          >
            <Link
              href="/about"
              className="group flex items-center gap-2 rounded-lg border border-border bg-secondary/60 px-5 py-3 text-sm font-medium text-foreground hover:border-primary/40 hover:bg-secondary transition-all"
            >
              Explore Platform
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/login"
              className="flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Get Started
            </Link>
          </motion.div>
        </div>
      </section>

      {/* What We Solve */}
      <section className="relative z-10 px-6 pb-20 lg:px-12 lg:pb-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">What We Solve</p>
          <h2 className="mt-2 text-balance text-3xl font-bold text-foreground lg:text-4xl">Three Pillars of Campus Intelligence</h2>
        </motion.div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative rounded-xl border border-border bg-card/60 p-6 backdrop-blur-sm transition-all hover:border-primary/40 hover:glow-red"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <feature.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Roles Overview */}
      <section className="relative z-10 px-6 pb-24 lg:px-12 lg:pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Role-Based Access</p>
          <h2 className="mt-2 text-balance text-3xl font-bold text-foreground lg:text-4xl">One Platform, Five Perspectives</h2>
          <p className="mt-3 max-w-lg text-sm text-muted-foreground">Each user role gets a dedicated, purpose-built dashboard tailored to their needs.</p>
        </motion.div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {roles.map((role, i) => (
            <motion.div
              key={role.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <Link
                href={role.href}
                className="group flex flex-col items-start rounded-xl border border-border bg-card/60 p-5 backdrop-blur-sm transition-all hover:border-primary/50 hover:glow-red"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <role.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-base font-semibold text-foreground">{role.label}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{role.desc}</p>
                <span className="mt-3 flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  Login <ArrowRight className="h-3 w-3" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border px-6 py-6 lg:px-12">
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-xs text-muted-foreground">oc-2-day 2026. Built for hackathon demonstration.</p>
          <div className="flex items-center gap-4">
            <Link href="/about" className="text-xs text-muted-foreground hover:text-foreground transition-colors">About</Link>
            <Link href="/login" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Login</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
