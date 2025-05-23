"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="glow-card"
    >
      <Card className="h-full overflow-hidden border-green-100 dark:border-green-900 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent dark:from-green-950/30 dark:to-transparent opacity-60"></div>
        <CardHeader className="relative">
          <motion.div
            className="mb-2 rounded-md bg-green-100 dark:bg-green-900/50 p-3 w-fit text-green-600 dark:text-green-400"
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 15px 5px rgba(34, 197, 94, 0.3)",
            }}
          >
            {icon}
          </motion.div>
          <CardTitle className="text-gradient">{title}</CardTitle>
        </CardHeader>
        <CardContent className="relative">
          <CardDescription className="text-base">{description}</CardDescription>
        </CardContent>
      </Card>
    </motion.div>
  )
}
