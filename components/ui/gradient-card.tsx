import type React from "react"
import { cn } from "@/lib/utils"

interface GradientCardProps {
  children: React.ReactNode
  className?: string
}

export function GradientCard({ children, className }: GradientCardProps) {
  return <div className={cn("rounded-xl overflow-hidden p-6 gradient-card shadow-lg", className)}>{children}</div>
}
