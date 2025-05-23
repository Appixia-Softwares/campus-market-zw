"use client"

import { motion } from "framer-motion"
import { MessageSquare, Package, ShoppingCart } from "lucide-react"

export default function HowItWorks() {
  const steps = [
    {
      icon: <ShoppingCart className="h-8 w-8" />,
      title: "List or Browse",
      description: "Post your items for sale or browse what other students are offering.",
      color: "bg-green-500/20 text-green-600 dark:text-green-400",
    },
    {
      icon: <MessageSquare className="h-8 w-8" />,
      title: "Connect & Chat",
      description: "Message sellers or landlords directly through the platform.",
      color: "bg-green-500/20 text-green-600 dark:text-green-400",
    },
    {
      icon: <Package className="h-8 w-8" />,
      title: "Meet & Complete",
      description: "Meet on campus to complete the transaction safely.",
      color: "bg-green-500/20 text-green-600 dark:text-green-400",
    },
  ]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <section className="bg-gradient-to-b from-green-50 to-white dark:from-green-950/20 dark:to-background py-16 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-green-500/10 w-24 h-24 blur-3xl"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, Math.random() * 50 - 25],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>

      <div className="container relative z-10">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
          <motion.h2
            className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-gradient">How It Works</span>
          </motion.h2>
          <motion.p
            className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Simple, secure, and student-friendly
          </motion.p>
        </div>

        <motion.div
          className="mt-16 grid gap-8 md:grid-cols-3 relative"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center text-center relative"
              variants={item}
              whileHover={{ y: -5 }}
            >
              <motion.div
                className={`mb-4 rounded-full p-5 ${step.color} relative`}
                whileHover={{
                  scale: 1.1,
                  boxShadow: "0 0 20px 5px rgba(34, 197, 94, 0.3)",
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {step.icon}
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-green-500/30"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [1, 0, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "loop",
                  }}
                />
              </motion.div>
              <h3 className="mb-2 text-xl font-bold text-gradient">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>

              {index < steps.length - 1 && (
                <motion.div
                  className="hidden md:block absolute right-0 top-1/2 h-0.5 w-1/6 bg-gradient-to-r from-green-500 to-green-300 -translate-y-1/2 translate-x-1/2"
                  initial={{ width: 0, opacity: 0 }}
                  whileInView={{ width: "16.666%", opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                />
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
