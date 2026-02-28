"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CreditCard, CheckCircle2, ArrowRight, ArrowLeft, Receipt, IndianRupee, Building2, Smartphone } from "lucide-react"
import { cn } from "@/lib/utils"
import { fees } from "@/lib/mock-data"

type Step = "select" | "method" | "confirm" | "receipt"

const paymentMethods = [
    { id: "upi", label: "UPI", desc: "Google Pay, PhonePe, Paytm", icon: Smartphone },
    { id: "card", label: "Card", desc: "Credit / Debit Card", icon: CreditCard },
    { id: "netbank", label: "Net Banking", desc: "All major banks", icon: Building2 },
]

export function FeePayment() {
    const [step, setStep] = useState<Step>("select")
    const [selectedFees, setSelectedFees] = useState<string[]>([])
    const [paymentMethod, setPaymentMethod] = useState("")
    const [processing, setProcessing] = useState(false)
    const [txnId, setTxnId] = useState("")

    const pendingFees = fees.filter((f) => f.status === "pending")
    const totalAmount = pendingFees.filter((f) => selectedFees.includes(f.id)).reduce((sum, f) => sum + f.amount, 0)

    const toggleFee = (id: string) => {
        setSelectedFees((prev) => prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id])
    }

    const handlePay = () => {
        setProcessing(true)
        setTimeout(() => {
            setTxnId(`TXN${Date.now().toString(36).toUpperCase()}`)
            setProcessing(false)
            setStep("receipt")
        }, 2000)
    }

    const reset = () => {
        setStep("select")
        setSelectedFees([])
        setPaymentMethod("")
        setTxnId("")
    }

    return (
        <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 mb-5">
                <IndianRupee className="h-5 w-5 text-primary" />
                <h2 className="text-base font-semibold text-foreground">Fee Payment</h2>
            </div>

            {/* Step indicator */}
            <div className="mb-6 flex items-center gap-2">
                {(["select", "method", "confirm", "receipt"] as Step[]).map((s, i) => (
                    <div key={s} className="flex items-center gap-2">
                        <div className={cn(
                            "flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold transition-colors",
                            step === s ? "bg-primary text-primary-foreground" :
                                (["select", "method", "confirm", "receipt"].indexOf(step) > i) ? "bg-emerald-500/20 text-emerald-500" :
                                    "bg-secondary text-muted-foreground"
                        )}>
                            {["select", "method", "confirm", "receipt"].indexOf(step) > i ? <CheckCircle2 className="h-3.5 w-3.5" /> : i + 1}
                        </div>
                        {i < 3 && <div className={cn("h-0.5 w-6 rounded-full", ["select", "method", "confirm", "receipt"].indexOf(step) > i ? "bg-emerald-500/40" : "bg-border")} />}
                    </div>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {step === "select" && (
                    <motion.div key="select" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <p className="mb-3 text-xs text-muted-foreground">Select fees to pay</p>
                        <div className="space-y-2">
                            {pendingFees.map((fee) => (
                                <button
                                    key={fee.id}
                                    onClick={() => toggleFee(fee.id)}
                                    className={cn(
                                        "flex w-full items-center justify-between rounded-lg border p-3 transition-colors text-left",
                                        selectedFees.includes(fee.id) ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                                    )}
                                >
                                    <div>
                                        <p className="text-sm font-medium text-foreground">{fee.type}</p>
                                        <p className="text-xs text-muted-foreground">Due: {fee.dueDate}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-bold text-foreground">₹{fee.amount.toLocaleString()}</span>
                                        <div className={cn(
                                            "h-4 w-4 rounded-full border-2 transition-colors",
                                            selectedFees.includes(fee.id) ? "border-primary bg-primary" : "border-border"
                                        )} />
                                    </div>
                                </button>
                            ))}
                        </div>
                        {selectedFees.length > 0 && (
                            <div className="mt-4 flex items-center justify-between">
                                <p className="text-sm text-foreground">Total: <strong>₹{totalAmount.toLocaleString()}</strong></p>
                                <button onClick={() => setStep("method")} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                                    Next <ArrowRight className="h-4 w-4" />
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}

                {step === "method" && (
                    <motion.div key="method" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <p className="mb-3 text-xs text-muted-foreground">Choose payment method</p>
                        <div className="space-y-2">
                            {paymentMethods.map((m) => (
                                <button
                                    key={m.id}
                                    onClick={() => setPaymentMethod(m.id)}
                                    className={cn(
                                        "flex w-full items-center gap-3 rounded-lg border p-3 transition-colors text-left",
                                        paymentMethod === m.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                                    )}
                                >
                                    <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", paymentMethod === m.id ? "bg-primary/15 text-primary" : "bg-secondary text-muted-foreground")}>
                                        <m.icon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-foreground">{m.label}</p>
                                        <p className="text-xs text-muted-foreground">{m.desc}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                            <button onClick={() => setStep("select")} className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary transition-colors">
                                <ArrowLeft className="h-4 w-4" /> Back
                            </button>
                            {paymentMethod && (
                                <button onClick={() => setStep("confirm")} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                                    Next <ArrowRight className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}

                {step === "confirm" && (
                    <motion.div key="confirm" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <p className="mb-3 text-xs text-muted-foreground">Review and confirm</p>
                        <div className="rounded-lg border border-border bg-secondary/20 p-4 space-y-2">
                            {pendingFees.filter((f) => selectedFees.includes(f.id)).map((f) => (
                                <div key={f.id} className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">{f.type}</span>
                                    <span className="font-medium text-foreground">₹{f.amount.toLocaleString()}</span>
                                </div>
                            ))}
                            <div className="border-t border-border pt-2 flex justify-between text-sm font-bold">
                                <span className="text-foreground">Total</span>
                                <span className="text-primary">₹{totalAmount.toLocaleString()}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Method: {paymentMethods.find((m) => m.id === paymentMethod)?.label}
                            </p>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                            <button onClick={() => setStep("method")} className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary transition-colors">
                                <ArrowLeft className="h-4 w-4" /> Back
                            </button>
                            <button
                                onClick={handlePay}
                                disabled={processing}
                                className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60 transition-colors"
                            >
                                {processing ? (
                                    <><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white" /> Processing...</>
                                ) : (
                                    <>Pay ₹{totalAmount.toLocaleString()}</>
                                )}
                            </button>
                        </div>
                    </motion.div>
                )}

                {step === "receipt" && (
                    <motion.div key="receipt" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                        <div className="text-center py-4">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", damping: 10 }}
                                className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 mb-4"
                            >
                                <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                            </motion.div>
                            <h3 className="text-lg font-bold text-foreground">Payment Successful!</h3>
                            <p className="text-xs text-muted-foreground mt-1">Transaction ID: {txnId}</p>
                        </div>
                        <div className="rounded-lg border border-border bg-secondary/20 p-4 space-y-2 text-sm">
                            <div className="flex justify-between"><span className="text-muted-foreground">Amount</span><span className="font-bold text-foreground">₹{totalAmount.toLocaleString()}</span></div>
                            <div className="flex justify-between"><span className="text-muted-foreground">Method</span><span className="text-foreground">{paymentMethods.find((m) => m.id === paymentMethod)?.label}</span></div>
                            <div className="flex justify-between"><span className="text-muted-foreground">Date</span><span className="text-foreground">{new Date().toLocaleDateString("en-IN")}</span></div>
                            <div className="flex justify-between"><span className="text-muted-foreground">Status</span><span className="text-emerald-500 font-medium">Success</span></div>
                        </div>
                        <button onClick={reset} className="mt-4 w-full rounded-lg border border-border bg-secondary/40 py-2.5 text-sm font-medium text-foreground hover:bg-secondary transition-colors">
                            Done
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
