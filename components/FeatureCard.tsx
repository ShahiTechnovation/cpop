"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"
import Link from "next/link"

interface FeatureCardProps {
  title: string
  description: string
  icon: ReactNode
  href: string
  color: "blue" | "purple" | "pink" | "green"
  delay?: number
}

export default function FeatureCard({ title, description, icon, href, color, delay = 0 }: FeatureCardProps) {
  const colorClasses = {
    blue: {
      glow: "glow-text",
      border: "before:from-neon-blue before:to-neon-blue/50",
      shadow: "shadow-neon-blue/20",
      icon: "text-neon-blue",
    },
    purple: {
      glow: "glow-text-purple",
      border: "before:from-neon-purple before:to-neon-purple/50",
      shadow: "shadow-neon-purple/20",
      icon: "text-neon-purple",
    },
    pink: {
      glow: "glow-text-pink",
      border: "before:from-neon-pink before:to-neon-pink/50",
      shadow: "shadow-neon-pink/20",
      icon: "text-neon-pink",
    },
    green: {
      glow: "glow-text-green",
      border: "before:from-neon-green before:to-neon-green/50",
      shadow: "shadow-neon-green/20",
      icon: "text-neon-green",
    },
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
    >
      <Link href={href}>
        <div
          className={`glass-card neon-border rounded-xl p-6 h-full ${colorClasses[color].border} ${colorClasses[color].shadow}`}
        >
          <div className="flex flex-col h-full">
            <div className={`text-4xl mb-4 ${colorClasses[color].icon}`}>{icon}</div>
            <h3 className={`text-xl font-bold mb-2 ${colorClasses[color].glow}`}>{title}</h3>
            <p className="text-gray-300 mb-4 flex-grow">{description}</p>
            <div className="flex justify-end">
              <motion.span
                className={`text-sm font-medium ${colorClasses[color].glow}`}
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                Explore →
              </motion.span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
