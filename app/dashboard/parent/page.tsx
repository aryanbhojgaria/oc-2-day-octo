"use client"

import { useState } from "react"
import { DashboardShell } from "@/components/layout/dashboard-shell"
import { useFees, useMarks, useStudents, DataLoading } from "@/lib/hooks"
import { FeePayment } from "@/components/fee-payment"
import { BarChart3, CreditCard, MessageSquare, TrendingUp, Check, Clock } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "performance", href: "/dashboard/parent", icon: BarChart3 },
  { label: "fees", href: "/dashboard/parent", icon: CreditCard },
  { label: "meeting", href: "/dashboard/parent", icon: MessageSquare },
]

export default function ParentDashboardPage() {
  const [activeTab, setActiveTab] = useState<"performance" | "fees" | "meeting">("performance")
  const [meetingForm, setMeetingForm] = useState({ teacher: "", date: "", reason: "" })
  const [meetingSubmitted, setMeetingSubmitted] = useState(false)

  // Live data
  const studentsHook = useStudents()
  const marksHook = useMarks()
  const feesHook = useFees()

  // Use first student as "ward" (in a real app this would be the linked child)
  const ward = studentsHook.data?.[0]
  const liveMarks = marksHook.data ?? []
  const liveFees = feesHook.data ?? []

  return (
    <DashboardShell role="parent" navItems={navItems} activeNav={activeTab} onNavClick={(label) => setActiveTab(label as typeof activeTab)}>
      {/* Tab Switcher */}
      <div className="mb-6 flex flex-wrap gap-2">
        {(["performance", "fees", "meeting"] as const).map((tab) => (
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
            {tab === "meeting" ? "Request Meeting" : tab === "performance" ? "Ward Performance" : tab}
          </button>
        ))}
      </div>

      {/* Ward Performance */}
      {activeTab === "performance" && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {studentsHook.loading ? (
            <DataLoading rows={3} />
          ) : ward ? (
            <>
              {/* Ward Info */}
              <div className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/15 text-lg font-bold text-primary">
                    {ward.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-foreground">{ward.name}</h2>
                    <p className="text-sm text-muted-foreground">{ward.department} — Year {ward.year}</p>
                    <p className="text-xs text-muted-foreground">{ward.externalId}</p>
                  </div>
                </div>
              </div>

              {/* Summary Cards */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-border bg-card p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Attendance</p>
                    <TrendingUp className="h-4 w-4 text-primary" />
                  </div>
                  <p className="mt-2 text-3xl font-bold text-foreground">{ward.attendance}%</p>
                  <div className="mt-2 h-2 rounded-full bg-secondary">
                    <div className="h-2 rounded-full bg-primary" style={{ width: `${ward.attendance}%` }} />
                  </div>
                </div>
                <div className="rounded-xl border border-border bg-card p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">CGPA</p>
                    <BarChart3 className="h-4 w-4 text-primary" />
                  </div>
                  <p className="mt-2 text-3xl font-bold text-foreground">{ward.cgpa}</p>
                  <p className="mt-1.5 text-xs text-muted-foreground">Out of 10.0</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-5">
                  <p className="text-sm text-muted-foreground">Residency</p>
                  <p className="mt-2 text-xl font-bold text-foreground">{ward.hostel ? "Hosteller" : "Day Scholar"}</p>
                  <p className="mt-1.5 text-xs text-muted-foreground">{ward.hostel ? "Block Aryabhata, Room B-204" : "Local residence"}</p>
                </div>
              </div>

              {/* Marks */}
              <div className="overflow-x-auto rounded-xl border border-border bg-card">
                <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                  <h2 className="text-base font-semibold text-foreground">Academic Performance</h2>
                  {marksHook.loading && <span className="text-xs text-muted-foreground animate-pulse">Loading marks…</span>}
                </div>
                {marksHook.loading ? (
                  <div className="p-5"><DataLoading rows={4} /></div>
                ) : (
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Subject</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Grade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {liveMarks.map((m) => (
                        <tr key={m.id} className="border-b border-border/50 last:border-0">
                          <td className="px-5 py-3 text-sm text-foreground">{m.subject}</td>
                          <td className="px-5 py-3 text-sm text-muted-foreground">{m.total}/100</td>
                          <td className="px-5 py-3">
                            <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">{m.grade}</span>
                          </td>
                        </tr>
                      ))}
                      {liveMarks.length === 0 && (
                        <tr><td colSpan={3} className="px-5 py-6 text-center text-sm text-muted-foreground">No marks available.</td></tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">No ward data available. Please log in as a parent.</p>
          )}
        </motion.div>
      )}

      {/* Fees */}
      {activeTab === "fees" && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {feesHook.loading ? (
            <DataLoading rows={3} />
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-border bg-card p-5">
                  <p className="text-sm text-muted-foreground">Total Pending</p>
                  <p className="mt-1 text-2xl font-bold text-primary">
                    Rs. {liveFees.filter((f) => f.status === "pending").reduce((sum, f) => sum + f.amount, 0).toLocaleString()}
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-card p-5">
                  <p className="text-sm text-muted-foreground">Total Paid</p>
                  <p className="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    Rs. {liveFees.filter((f) => f.status === "paid").reduce((sum, f) => sum + f.amount, 0).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {liveFees.map((fee) => (
                  <div key={fee.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
                    <div className="flex items-center gap-3">
                      <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg", fee.status === "paid" ? "bg-emerald-500/15" : "bg-primary/15")}>
                        {fee.status === "paid" ? (
                          <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <Clock className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{fee.type}</p>
                        <p className="text-xs text-muted-foreground">Due: {fee.dueDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm font-semibold text-foreground">Rs. {fee.amount.toLocaleString()}</p>
                        <span className={cn("text-xs font-medium", fee.status === "paid" ? "text-emerald-600 dark:text-emerald-400" : "text-primary")}>
                          {fee.status === "paid" ? "Paid" : "Pending"}
                        </span>
                      </div>
                      {fee.status === "pending" && (
                        <button
                          onClick={() => feesHook.pay(fee.id)}
                          className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                        >
                          Pay Now
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {liveFees.length === 0 && (
                  <p className="text-center text-sm text-muted-foreground py-6">No fee records found.</p>
                )}
              </div>

              <div className="mt-4">
                <FeePayment />
              </div>
            </>
          )}
        </motion.div>
      )}

      {/* Meeting Request */}
      {activeTab === "meeting" && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div className="max-w-lg rounded-xl border border-border bg-card p-6">
            {meetingSubmitted ? (
              <div className="flex flex-col items-center py-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 15 }}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15"
                >
                  <Check className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </motion.div>
                <p className="mt-4 text-lg font-semibold text-foreground">Meeting Request Sent</p>
                <p className="mt-1 text-sm text-muted-foreground">You will be notified once confirmed.</p>
                <button
                  onClick={() => { setMeetingSubmitted(false); setMeetingForm({ teacher: "", date: "", reason: "" }) }}
                  className="mt-4 text-sm font-medium text-primary hover:underline"
                >
                  Submit Another
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-base font-semibold text-foreground">Request a Meeting</h2>
                <p className="mt-1 text-sm text-muted-foreground">Schedule a meeting with your ward&apos;s teacher.</p>
                <div className="mt-5 space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">Teacher</label>
                    <select
                      value={meetingForm.teacher}
                      onChange={(e) => setMeetingForm((p) => ({ ...p, teacher: e.target.value }))}
                      className="w-full rounded-lg border border-border bg-input px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none transition-colors"
                    >
                      <option value="">Select a teacher</option>
                      <option value="Dr. Kavitha Nair">Dr. Kavitha Nair</option>
                      <option value="Prof. Rajesh Kumar">Prof. Rajesh Kumar</option>
                      <option value="Dr. Sunita Patel">Dr. Sunita Patel</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">Preferred Date</label>
                    <input
                      type="date"
                      value={meetingForm.date}
                      onChange={(e) => setMeetingForm((p) => ({ ...p, date: e.target.value }))}
                      className="w-full rounded-lg border border-border bg-input px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">Reason</label>
                    <textarea
                      value={meetingForm.reason}
                      onChange={(e) => setMeetingForm((p) => ({ ...p, reason: e.target.value }))}
                      placeholder="Briefly describe the reason for the meeting..."
                      rows={3}
                      className="w-full resize-none rounded-lg border border-border bg-input px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>
                  <button
                    onClick={() => setMeetingSubmitted(true)}
                    className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    Submit Request
                  </button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      )}
    </DashboardShell>
  )
}

