"use client"

import { motion } from "framer-motion"
import { Shield, CheckCircle, BadgeCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function VerificationSection() {
  return (
    <section className="container py-12 md:py-24 relative overflow-hidden">
      {/* Background glow */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-green-500/10 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      />

      <div className="grid gap-6 md:grid-cols-2 md:gap-10 relative">
        <motion.div
          className="flex flex-col justify-center space-y-4"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center rounded-full border border-green-200 dark:border-green-800 px-4 py-1 text-sm">
            <Shield className="mr-1 h-3.5 w-3.5 text-green-600 dark:text-green-400" />
            <span className="text-green-600 dark:text-green-400">Secure & Trusted</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
            <span className="text-gradient">Student Verification System</span>
          </h2>
          <p className="text-muted-foreground">
            Our verification system ensures that only real university students can access the platform, creating a safe
            and trusted community.
          </p>
          <ul className="space-y-3">
            {[
              "Upload your student ID for verification",
              "Get a verified badge on your profile",
              "Access exclusive student-only deals",
            ].map((item, index) => (
              <motion.li
                key={index}
                className="flex items-center"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
              >
                <div className="mr-2 rounded-full bg-green-100 dark:bg-green-900/50 p-1">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <span>{item}</span>
              </motion.li>
            ))}
          </ul>
          <div className="pt-4">
            <Link href="/verify">
              <Button className="gap-2 relative overflow-hidden group">
                <span className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative z-10">Get Verified</span>
                <BadgeCheck className="h-4 w-4 relative z-10" />
              </Button>
            </Link>
          </div>
        </motion.div>
        <motion.div
          className="relative flex items-center justify-center"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative h-[350px] w-full overflow-hidden rounded-lg md:h-[450px] image-hover-zoom">
            <div className="absolute inset-0 bg-gradient-to-tr from-green-500/20 to-background/60 z-10 rounded-lg"></div>
            <img
              src="/placeholder.svg?height=450&width=500"
              alt="Student verification process"
              className="h-full w-full object-cover"
            />

            {/* Floating verification badge */}
            <motion.div
              className="absolute right-8 top-8 flex items-center gap-2 rounded-lg glass-effect p-3 shadow-lg"
              animate={{
                y: [0, 10, 0],
                boxShadow: [
                  "0 0 10px 2px rgba(34, 197, 94, 0.3)",
                  "0 0 20px 5px rgba(34, 197, 94, 0.5)",
                  "0 0 10px 2px rgba(34, 197, 94, 0.3)",
                ],
              }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            >
              <BadgeCheck className="h-6 w-6 text-green-500" />
              <span className="font-medium">Verified Student</span>
            </motion.div>

            {/* Student ID card */}
            <motion.div
              className="absolute left-8 bottom-8 w-64 h-40 rounded-lg glass-effect p-4 shadow-lg"
              animate={{
                y: [0, -10, 0],
                rotate: [0, 2, 0],
                boxShadow: [
                  "0 0 10px 2px rgba(34, 197, 94, 0.2)",
                  "0 0 20px 5px rgba(34, 197, 94, 0.4)",
                  "0 0 10px 2px rgba(34, 197, 94, 0.2)",
                ],
              }}
              transition={{
                duration: 5,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            >
              <div className="flex items-start gap-3">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/50 rounded-md"></div>
                <div>
                  <div className="text-sm font-bold">University of Zimbabwe</div>
                  <div className="text-xs text-muted-foreground">Student ID Card</div>
                  <div className="text-sm mt-2">Tatenda Moyo</div>
                  <div className="text-xs text-muted-foreground">Computer Science</div>
                </div>
              </div>
              <div className="mt-4 h-2 bg-green-200 dark:bg-green-800 rounded-full"></div>
              <div className="mt-2 h-2 bg-green-200 dark:bg-green-800 rounded-full w-3/4"></div>
              <div className="absolute bottom-3 right-3">
                <BadgeCheck className="h-5 w-5 text-green-500" />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
