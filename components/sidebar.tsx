"use client"

import type React from "react"

import { motion } from "framer-motion"

interface SidebarProps {
  children: React.ReactNode
}

export function Sidebar({ children }: SidebarProps) {
  return (
    <motion.aside
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-96 bg-card border-l border-border h-full overflow-y-auto"
    >
      <div className="p-6">{children}</div>
    </motion.aside>
  )
}
