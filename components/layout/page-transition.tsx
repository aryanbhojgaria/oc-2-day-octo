"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, filter: "blur(8px)", scale: 0.98 }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
      exit={{ opacity: 0, y: -8, filter: "blur(4px)", scale: 0.99 }}
      transition={{
        type: "spring",
        damping: 25,
        stiffness: 120,
        duration: 0.5,
      }}
    >
      {children}
    </motion.div>
  )
}
