"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquareText, X, Send, Bot, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { getOctobotResponse, simulateTyping } from "@/lib/mock-ai"

interface Message {
    id: string
    role: "user" | "bot"
    content: string
    isTyping?: boolean
}

export function OctoBot({ role = "student" }: { role?: string }) {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            role: "bot",
            content: `Hi there! I'm OctoBot 🐙. I'm your intelligent campus assistant. How can I help you today?`,
        },
    ])
    const [input, setInput] = useState("")
    const [isBotTyping, setIsBotTyping] = useState(false)

    const bottomRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [messages, isBotTyping])

    const handleSend = async () => {
        if (!input.trim() || isBotTyping) return

        const userMsg = input.trim()
        setInput("")

        // Add user message
        setMessages((prev) => [...prev, { id: Date.now().toString(), role: "user", content: userMsg }])

        setIsBotTyping(true)

        // Fetch simulated response
        const fullResponse = await getOctobotResponse(userMsg, role)

        // Add empty bot message, flag as typing
        const botMsgId = (Date.now() + 1).toString()
        setMessages((prev) => [...prev, { id: botMsgId, role: "bot", content: "", isTyping: true }])

        // Simulate real typing speed
        await simulateTyping(fullResponse, (currentText) => {
            setMessages((prev) =>
                prev.map((m) => m.id === botMsgId ? { ...m, content: currentText } : m)
            )
        })

        // Mark done
        setMessages((prev) =>
            prev.map((m) => m.id === botMsgId ? { ...m, isTyping: false } : m)
        )
        setIsBotTyping(false)
    }

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="absolute bottom-16 right-0 mb-4 flex h-[460px] w-[340px] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-border bg-primary/10 px-4 py-3">
                            <div className="flex items-center gap-2.5">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-inner">
                                    <Bot className="h-4 w-4" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                                        OctoBot <Sparkles className="h-3 w-3 text-amber-500 fill-current" />
                                    </h3>
                                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground/80">AI Campus Assistant</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Chat Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/20">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={cn(
                                        "flex flex-col max-w-[85%]",
                                        msg.role === "user" ? "ml-auto items-end" : "mr-auto items-start"
                                    )}
                                >
                                    <div
                                        className={cn(
                                            "px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed",
                                            msg.role === "user"
                                                ? "bg-primary text-primary-foreground rounded-br-sm"
                                                : "bg-secondary text-foreground rounded-bl-sm border border-border"
                                        )}
                                    >
                                        {msg.content}
                                        {msg.isTyping && <span className="inline-block w-1.5 h-3.5 ml-1 align-middle bg-primary animate-pulse" />}
                                    </div>
                                </div>
                            ))}
                            <div ref={bottomRef} />
                        </div>

                        {/* Input Area */}
                        <div className="border-t border-border bg-card p-3">
                            <form
                                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                                className="flex items-center gap-2 rounded-xl border border-border bg-input px-2 py-1.5 focus-within:ring-1 focus-within:ring-primary/50 transition-all"
                            >
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask about your campus..."
                                    className="flex-1 bg-transparent px-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                                    disabled={isBotTyping}
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim() || isBotTyping}
                                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground disabled:opacity-50 transition-opacity hover:bg-primary/90"
                                >
                                    <Send className="h-3.5 w-3.5" />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-shadow hover:shadow-[0_0_30px_rgba(220,38,38,0.6)]"
            >
                {isOpen ? <X className="h-6 w-6" /> : <MessageSquareText className="h-6 w-6" />}
            </motion.button>
        </div>
    )
}
