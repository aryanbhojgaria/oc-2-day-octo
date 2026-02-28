"use client"

import { useState } from "react"
import { DashboardShell } from "@/components/layout/dashboard-shell"
import { useClubs, useEvents, DataLoading } from "@/lib/hooks"
import { Palette, CalendarDays, Users, ImagePlus, Plus, Filter, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "clubs", href: "/dashboard/club", icon: Palette },
  { label: "events", href: "/dashboard/club", icon: CalendarDays },
  { label: "members", href: "/dashboard/club", icon: Users },
]

export default function ClubDashboardPage() {
  const [activeTab, setActiveTab] = useState<"clubs" | "events" | "members">("clubs")
  const [selectedClub, setSelectedClub] = useState<string | null>(null)
  const [eventFilter, setEventFilter] = useState<"all" | "upcoming" | "past">("all")
  const [showCreateEvent, setShowCreateEvent] = useState(false)
  const [newEvent, setNewEvent] = useState({ title: "", club: "", date: "", description: "" })
  const [eventCreated, setEventCreated] = useState(false)
  const [creating, setCreating] = useState(false)

  // Live data
  const clubsHook = useClubs()
  const eventsHook = useEvents()

  const clubs = clubsHook.data ?? []
  const events = eventsHook.data ?? []

  const filteredEvents = events.filter((e) => {
    const matchesClub = selectedClub ? e.club === selectedClub : true
    const matchesFilter = eventFilter === "all" ? true : e.status === eventFilter
    return matchesClub && matchesFilter
  })

  const handleCreateEvent = async () => {
    setCreating(true)
    setEventCreated(true)
    setTimeout(() => {
      setShowCreateEvent(false)
      setEventCreated(false)
      setNewEvent({ title: "", club: "", date: "", description: "" })
      setCreating(false)
      eventsHook.refetch()
    }, 2000)
  }

  return (
    <DashboardShell role="club" navItems={navItems} activeNav={activeTab} onNavClick={(label) => setActiveTab(label as typeof activeTab)}>
      {/* Tab Switcher */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        {(["clubs", "events", "members"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium capitalize transition-colors",
              activeTab === tab
                ? "bg-primary/15 text-primary"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            {tab}
          </button>
        ))}
        <div className="flex-1" />
        <button
          onClick={() => setShowCreateEvent(true)}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Create Event
        </button>
      </div>

      {/* Clubs Grid */}
      {activeTab === "clubs" && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {clubs.map((club, i) => (
              <motion.div
                key={club.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.06 }}
                onClick={() => {
                  setSelectedClub(club.name)
                  setActiveTab("events")
                }}
                className="group cursor-pointer rounded-xl border bg-card p-5 transition-all hover:glow-red"
                style={{
                  borderColor: `${club.accent}30`,
                }}
              >
                <div
                  className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${club.accent}20` }}
                >
                  <Palette className="h-5 w-5" style={{ color: club.accent }} />
                </div>
                <h3 className="text-lg font-semibold text-foreground">{club.name} Club</h3>
                <p className="mt-1 text-sm text-muted-foreground">{club.description}</p>
                <div className="mt-3 flex items-center gap-2">
                  <Users className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{club.members} members</span>
                </div>
                <div
                  className="mt-3 h-0.5 w-full rounded-full opacity-0 transition-opacity group-hover:opacity-100"
                  style={{ backgroundColor: club.accent }}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Events */}
      {activeTab === "events" && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            {(["all", "upcoming", "past"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setEventFilter(f)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-colors",
                  eventFilter === f
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:bg-secondary"
                )}
              >
                {f}
              </button>
            ))}
            {selectedClub && (
              <button
                onClick={() => setSelectedClub(null)}
                className="flex items-center gap-1 rounded-lg border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
              >
                {selectedClub}
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          {/* Event Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event, i) => {
              const club = clubs.find((c) => c.name === event.club)
              const accent = club?.accent || "#dc2626"
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.06 }}
                  whileHover={{ y: -4 }}
                  className="rounded-xl border bg-card p-5 transition-shadow"
                  style={{ borderColor: `${accent}30` }}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold"
                      style={{ backgroundColor: `${accent}20`, color: accent }}
                    >
                      {event.club} Club
                    </span>
                    <span className={cn(
                      "text-[10px] font-medium",
                      event.status === "upcoming" ? "text-primary" : "text-muted-foreground"
                    )}>
                      {event.status}
                    </span>
                  </div>
                  <h3 className="mt-3 text-base font-semibold text-foreground">{event.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{event.description}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {event.date}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Users className="h-3.5 w-3.5" />
                      {event.registrations}
                    </div>
                  </div>
                  <div
                    className="mt-4 h-0.5 w-full rounded-full"
                    style={{ backgroundColor: `${accent}40` }}
                  />
                </motion.div>
              )
            })}
          </div>

          {filteredEvents.length === 0 && (
            <div className="rounded-xl border border-border bg-card p-12 text-center">
              <CalendarDays className="mx-auto h-8 w-8 text-muted-foreground/40" />
              <p className="mt-3 text-sm text-muted-foreground">No events found for this filter.</p>
            </div>
          )}
        </motion.div>
      )}

      {/* Members Tab */}
      {activeTab === "members" && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="text-base font-semibold text-foreground">Club Members</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {clubs.map((club) => (
                <div key={club.id} className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-lg"
                      style={{ backgroundColor: `${club.accent}20` }}
                    >
                      <Palette className="h-4 w-4" style={{ color: club.accent }} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{club.name} Club</p>
                      <p className="text-xs text-muted-foreground">{club.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Users className="h-3.5 w-3.5" />
                    <span>{club.members}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Create Event Dialog */}
      <AnimatePresence>
        {showCreateEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
            onClick={() => setShowCreateEvent(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-md rounded-xl border border-border bg-card p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowCreateEvent(false)}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                aria-label="Close dialog"
              >
                <X className="h-4 w-4" />
              </button>

              {eventCreated ? (
                <div className="flex flex-col items-center py-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 15 }}
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15"
                  >
                    <CalendarDays className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </motion.div>
                  <p className="mt-4 text-lg font-semibold text-foreground">Event Created!</p>
                  <p className="mt-1 text-sm text-muted-foreground">Your event will appear in the feed.</p>
                </div>
              ) : (
                <>
                  <h2 className="text-lg font-semibold text-foreground">Create New Event</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Fill in the details for your club event.</p>
                  <div className="mt-5 space-y-4">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-foreground">Event Title</label>
                      <input
                        value={newEvent.title}
                        onChange={(e) => setNewEvent((p) => ({ ...p, title: e.target.value }))}
                        placeholder="Enter event title"
                        className="w-full rounded-lg border border-border bg-input px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-foreground">Club</label>
                      <select
                        value={newEvent.club}
                        onChange={(e) => setNewEvent((p) => ({ ...p, club: e.target.value }))}
                        className="w-full rounded-lg border border-border bg-input px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none transition-colors"
                      >
                        <option value="">Select club</option>
                        {clubs.map((c) => (
                          <option key={c.id} value={c.name}>{c.name} Club</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-foreground">Date</label>
                      <input
                        type="date"
                        value={newEvent.date}
                        onChange={(e) => setNewEvent((p) => ({ ...p, date: e.target.value }))}
                        className="w-full rounded-lg border border-border bg-input px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-foreground">Description</label>
                      <textarea
                        value={newEvent.description}
                        onChange={(e) => setNewEvent((p) => ({ ...p, description: e.target.value }))}
                        placeholder="Describe your event..."
                        rows={3}
                        className="w-full resize-none rounded-lg border border-border bg-input px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
                      />
                    </div>
                    {/* Mock poster upload */}
                    <div className="rounded-lg border-2 border-dashed border-border bg-secondary/20 p-6 text-center">
                      <ImagePlus className="mx-auto h-8 w-8 text-muted-foreground/40" />
                      <p className="mt-2 text-sm text-muted-foreground">Upload event poster</p>
                      <p className="text-xs text-muted-foreground/60">PNG, JPG up to 5MB</p>
                    </div>
                    <button
                      onClick={handleCreateEvent}
                      className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                      Create Event
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardShell>
  )
}

