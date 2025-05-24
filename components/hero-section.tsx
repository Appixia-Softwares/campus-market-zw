"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShoppingBag, ArrowRight } from "lucide-react"

interface Stats {
  totalProducts: number
  totalAccommodations: number
  totalUsers: number
  totalUniversities: number
}

interface HeroSectionProps {
  stats?: Stats
}

export default function HeroSection({ stats }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden hero-gradient pt-16 md:pt-24">
      <div className="container relative z-10">
        <div className="grid gap-6 md:grid-cols-2 md:gap-10">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center rounded-full border border-green-200 dark:border-green-800 px-4 py-1 text-sm mb-4"
              >
                <span className="live-badge pl-4">Live</span>
                <span className="ml-2 text-green-700 dark:text-green-400">Zimbabwe's #1 Student Platform</span>
              </motion.div>

              <motion.h1
                className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Zimbabwe&apos;s Student <span className="text-gradient font-extrabold">Marketplace</span>
              </motion.h1>
              <motion.p
                className="max-w-[600px] text-muted-foreground md:text-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Buy & sell student essentials and find affordable accommodation near your campus.
              </motion.p>
            </div>
            <motion.div
              className="flex flex-col gap-3 sm:flex-row"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link href="/marketplace">
                <Button size="lg" className="gap-2 relative overflow-hidden group">
                  <span className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <ShoppingBag className="h-4 w-4 relative z-10" />
                  <span className="relative z-10">Browse Marketplace</span>
                  <ArrowRight className="h-4 w-4 ml-1 relative z-10 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                </Button>
              </Link>
            </motion.div>
            <motion.div
              className="mt-4 flex items-center gap-2 text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <span className="inline-block rounded-full bg-green-500 h-2 w-2 animate-pulse-glow"></span>
              <span>
                Trusted by {stats?.totalUsers || 5000}+ students across {stats?.totalUniversities || 8} universities in
                Zimbabwe
              </span>
            </motion.div>
          </div>
          <motion.div
            className="relative flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative h-[350px] w-full overflow-hidden rounded-lg md:h-[450px] image-hover-zoom">
              <div className="absolute inset-0 bg-gradient-to-tr from-green-500/20 to-background/60 z-10 rounded-lg"></div>
              <img
                src="/placeholder.svg?height=450&width=500"
                alt="Students using Campus Marketplace"
                className="h-full w-full object-cover"
              />

              {/* Floating elements */}
              <motion.div
                className="absolute -right-6 -top-6 h-24 w-24 rounded-xl bg-green-500/20 backdrop-blur-sm"
                animate={{
                  y: [0, 10, 0],
                  rotate: [0, 5, 0],
                  boxShadow: [
                    "0 0 10px 2px rgba(34, 197, 94, 0.3)",
                    "0 0 20px 5px rgba(34, 197, 94, 0.5)",
                    "0 0 10px 2px rgba(34, 197, 94, 0.3)",
                  ],
                }}
                transition={{
                  duration: 6,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              />
              <motion.div
                className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-green-300/20 backdrop-blur-sm"
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, -5, 0],
                  boxShadow: [
                    "0 0 10px 2px rgba(134, 239, 172, 0.3)",
                    "0 0 20px 5px rgba(134, 239, 172, 0.5)",
                    "0 0 10px 2px rgba(134, 239, 172, 0.3)",
                  ],
                }}
                transition={{
                  duration: 5,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              />

              {/* Floating product card */}
              <motion.div
                className="absolute top-10 right-10 w-48 p-3 rounded-lg glass-effect shadow-lg"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <div className="text-sm font-medium mb-1">Calculus Textbook</div>
                <div className="text-green-600 dark:text-green-400 font-bold">ZWL 15,000</div>
              </motion.div>

              {/* Floating accommodation card */}
              <motion.div
                className="absolute bottom-10 left-10 w-48 p-3 rounded-lg glass-effect shadow-lg"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                <div className="text-sm font-medium mb-1">Studio Apartment</div>
                <div className="text-green-600 dark:text-green-400 font-bold">ZWL 35,000/month</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Background shapes */}
      <motion.div
        className="absolute -top-40 right-0 h-[500px] w-[500px] rounded-full bg-green-500/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />
      <motion.div
        className="absolute -bottom-20 -left-20 h-[300px] w-[300px] rounded-full bg-green-300/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
      />

      {/* Animated dots */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-green-500/30 w-2 h-2"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, Math.random() * 30 - 15],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>
    </section>
  )
}
