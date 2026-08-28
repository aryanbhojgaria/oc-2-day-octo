"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import { AnimatedOctopus } from "@/components/octopus/animated-octopus"
import { ThemeToggle } from "@/components/theme-toggle"
import { ArrowRight, BookOpen, Building2, Users, Shield, GraduationCap, UserCheck, Heart, Palette, Sparkles } from "lucide-react"

/* ─── Floating background particles ──────────────────────────── */
function FloatingParticles() {
  const [mounted, setMounted] = useState(false)
  const [particles] = useState(() =>
    Array.from({ length: 24 }).map((_, i) => ({
      x: ((i * 137.5) % 100),
      y: ((i * 213.7) % 100),
      size: ((i * 73.1) % 3) + 1,
      duration: ((i * 61.7) % 8) + 10,
      delay: ((i * 43.3) % 5),
    }))
  )

  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-primary/20"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
          }}
          animate={{
            y: [0, -200, 0],
            x: [0, (i % 2 === 0 ? 30 : -30), 0],
            opacity: [0, 0.6, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}

/* ─── 3D Tilt Card wrapper ───────────────────────────────────── */
function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = ((y - centerY) / centerY) * -5
    const rotateY = ((x - centerX) / centerX) * 5
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`
  }, [])

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current
    if (!card) return
    card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)"
  }, [])

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`transition-transform duration-300 ease-out ${className}`}
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
    </div>
  )
}

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

// Staggered container animation
const staggerContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
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

export default function LandingPage() {
  const { scrollYProgress } = useScroll()
  const octopusY = useTransform(scrollYProgress, [0, 1], [0, -120])
  const octopusRotate = useTransform(scrollYProgress, [0, 1], [0, 8])

  return (
    <div className="relative min-h-screen bg-background bg-grid overflow-hidden noise-overlay">
      {/* Floating particles */}
      <FloatingParticles />

      {/* Animated gradient orb behind hero */}
      <div className="pointer-events-none absolute top-[-20%] left-[10%] h-[600px] w-[600px] rounded-full bg-gradient-to-br from-primary/8 via-primary/3 to-transparent blur-3xl animate-scale-pulse" />
      <div className="pointer-events-none absolute bottom-[-10%] right-[5%] h-[400px] w-[400px] rounded-full bg-gradient-to-tl from-primary/5 via-transparent to-transparent blur-3xl animate-float" />

      {/* Octopus floating in the background — parallax */}
      <motion.div
        className="pointer-events-none absolute right-[-5%] top-[8%] w-[340px] opacity-15 lg:w-[480px]"
        style={{ y: octopusY, rotate: octopusRotate }}
      >
        <AnimatedOctopus />
      </motion.div>

      {/* Nav */}
      <motion.nav
        className="relative z-10 flex items-center justify-between px-6 py-5 lg:px-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex items-center gap-2.5">
          <motion.div
            whileHover={{ rotate: [0, -5, 5, 0] }}
            transition={{ duration: 0.4 }}
          >
            <Image src="/logo.png" alt="oc-2-day" width={36} height={36} className="h-9 w-9 rounded-lg object-contain" />
          </motion.div>
          <span className="text-lg font-bold tracking-tight text-foreground">oc-2-day</span>
        </div>
        <div className="flex items-center gap-3 md:gap-6">
          <Link href="/about" className="hidden text-sm text-muted-foreground hover:text-foreground transition-colors md:block">
            About
          </Link>
          <ThemeToggle />
          <Link
            href="/login"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-all btn-glow animate-glow-pulse"
          >
            Get Started
          </Link>
        </div>
      </motion.nav>

      {/* Hero */}
      <section className="relative z-10 px-6 pt-16 pb-20 lg:px-12 lg:pt-28 lg:pb-32">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div
              className="mb-4 inline-flex items-center gap-2 rounded-full border bg-secondary/60 px-3 py-1 animate-shimmer-border"
              whileHover={{ scale: 1.05 }}
            >
              <Sparkles className="h-3 w-3 text-primary animate-pulse" />
              <span className="text-xs font-medium text-muted-foreground">Intelligent Campus OS</span>
            </motion.div>
            <h1 className="text-balance text-5xl font-bold tracking-tight text-foreground lg:text-7xl">
              oc-2-<span className="text-gradient">campus</span>
            </h1>
            <motion.p
              className="mt-5 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground lg:text-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              A next-generation college coordination system that connects students, teachers, parents, and administrators through one intelligent platform.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-8 flex flex-wrap gap-4"
          >
            <Link
              href="/about"
              className="group flex items-center gap-2 rounded-lg border border-border bg-secondary/60 px-5 py-3 text-sm font-medium text-foreground hover:border-primary/40 hover:bg-secondary transition-all glow-hover"
            >
              Explore Platform
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/login"
              className="flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-all btn-glow"
            >
              Get Started
              <Sparkles className="h-4 w-4" />
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

        <motion.div
          className="mt-10 grid gap-5 md:grid-cols-3"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {features.map((feature, i) => (
            <motion.div key={feature.title} variants={staggerItem}>
              <TiltCard>
                <div className="group relative rounded-xl border border-border bg-card/60 p-6 backdrop-blur-sm transition-all hover:border-primary/40 card-hover glass">
                  <motion.div
                    className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10"
                    whileHover={{ rotate: [0, -10, 10, -5, 0], scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <feature.icon className="h-5 w-5 text-primary" />
                  </motion.div>
                  <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.desc}</p>
                  {/* Subtle gradient line at bottom */}
                  <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>
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

        <motion.div
          className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {roles.map((role, i) => (
            <motion.div key={role.label} variants={staggerItem}>
              <Link
                href={role.href}
                className="group flex flex-col items-start rounded-xl border border-border bg-card/60 p-5 backdrop-blur-sm transition-all hover:border-primary/50 card-hover glass"
              >
                <motion.div
                  className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors"
                  whileHover={{ scale: 1.15, rotate: 5 }}
                >
                  <role.icon className="h-5 w-5 text-primary" />
                </motion.div>
                <h3 className="text-base font-semibold text-foreground">{role.label}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{role.desc}</p>
                <span className="mt-3 flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1">
                  Login <ArrowRight className="h-3 w-3" />
                </span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Footer */}
      <motion.footer
        className="relative z-10 border-t border-border px-6 py-6 lg:px-12 glass"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-xs text-muted-foreground">oc-2-day 2026. Built for hackathon demonstration.</p>
          <div className="flex items-center gap-4">
            <Link href="/about" className="text-xs text-muted-foreground hover:text-foreground transition-colors">About</Link>
            <Link href="/login" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Login</Link>
          </div>
        </div>
      </motion.footer>
    </div>
  )
}
