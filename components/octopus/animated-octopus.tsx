"use client"

import { motion } from "framer-motion"

export function AnimatedOctopus({ className = "" }: { className?: string }) {
  return (
    <motion.div
      className={`pointer-events-none select-none ${className}`}
      animate={{ y: [0, -15, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      style={{ filter: "drop-shadow(0 0 30px rgba(220, 38, 38, 0.4))" }}
    >
      <svg
        viewBox="0 0 200 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Head */}
        <ellipse cx="100" cy="70" rx="55" ry="50" fill="url(#headGrad)" />
        <ellipse cx="100" cy="70" rx="55" ry="50" fill="url(#headShine)" opacity="0.3" />

        {/* Eyes */}
        <ellipse cx="80" cy="65" rx="12" ry="14" fill="#1a0000" />
        <ellipse cx="120" cy="65" rx="12" ry="14" fill="#1a0000" />
        <ellipse cx="82" cy="61" rx="5" ry="6" fill="#dc2626" opacity="0.8" />
        <ellipse cx="122" cy="61" rx="5" ry="6" fill="#dc2626" opacity="0.8" />
        <circle cx="84" cy="58" r="2" fill="#fff" opacity="0.9" />
        <circle cx="124" cy="58" r="2" fill="#fff" opacity="0.9" />

        {/* Tentacles */}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <motion.path
            key={i}
            d={getTentaclePath(i)}
            stroke="url(#tentacleGrad)"
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
            animate={{
              d: [getTentaclePath(i), getTentaclePathAlt(i), getTentaclePath(i)],
            }}
            transition={{
              duration: 3 + i * 0.3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.2,
            }}
          />
        ))}

        {/* Gradients */}
        <defs>
          <radialGradient id="headGrad" cx="0.5" cy="0.4" r="0.6">
            <stop offset="0%" stopColor="#dc2626" />
            <stop offset="60%" stopColor="#991b1b" />
            <stop offset="100%" stopColor="#7f1d1d" />
          </radialGradient>
          <radialGradient id="headShine" cx="0.3" cy="0.2" r="0.4">
            <stop offset="0%" stopColor="#fff" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <linearGradient id="tentacleGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#991b1b" />
            <stop offset="100%" stopColor="#7f1d1d" stopOpacity="0.6" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  )
}

function getTentaclePath(index: number): string {
  const startX = 55 + index * 13
  const startY = 110
  const cp1x = startX + (index % 2 === 0 ? -20 : 20)
  const cp1y = startY + 40
  const cp2x = startX + (index % 2 === 0 ? 15 : -15)
  const cp2y = startY + 70
  const endX = startX + (index % 2 === 0 ? -10 : 10)
  const endY = startY + 95

  return `M ${startX} ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endX} ${endY}`
}

function getTentaclePathAlt(index: number): string {
  const startX = 55 + index * 13
  const startY = 110
  const cp1x = startX + (index % 2 === 0 ? 20 : -20)
  const cp1y = startY + 35
  const cp2x = startX + (index % 2 === 0 ? -15 : 15)
  const cp2y = startY + 65
  const endX = startX + (index % 2 === 0 ? 15 : -15)
  const endY = startY + 90

  return `M ${startX} ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endX} ${endY}`
}
