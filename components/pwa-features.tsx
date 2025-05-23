"use client"

import { motion } from "framer-motion"
import { Smartphone, Wifi, BellRing, Clock } from "lucide-react"

export default function PwaFeatures() {
  const features = [
    {
      icon: <Smartphone className="h-8 w-8" />,
      title: "Install as App",
      description: "Add to your home screen and use like a native app",
    },
    {
      icon: <Wifi className="h-8 w-8" />,
      title: "Works Offline",
      description: "Browse listings even without internet connection",
    },
    {
      icon: <BellRing className="h-8 w-8" />,
      title: "Push Notifications",
      description: "Get instant alerts for messages and new listings",
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: "Fast Loading",
      description: "Optimized for quick access and smooth experience",
    },
  ]

  return (
    <section className="bg-gradient-to-b from-green-50 to-white dark:from-green-950/20 dark:to-background py-16 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-green-500/10 w-16 h-16 blur-2xl"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, Math.random() * 40 - 20],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 4 + Math.random() * 4,
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
            <span className="text-gradient">App-Like Experience</span>
          </motion.h2>
          <motion.p
            className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            ZimStudentHub works like a native app with these powerful features
          </motion.p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{
                y: -10,
                transition: { duration: 0.3 },
              }}
            >
              <motion.div
                className="mb-4 rounded-full bg-green-100 dark:bg-green-900/50 p-5 text-green-600 dark:text-green-400 relative"
                whileHover={{
                  scale: 1.1,
                  boxShadow: "0 0 20px 5px rgba(34, 197, 94, 0.3)",
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {feature.icon}
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
              <h3 className="mb-2 text-xl font-bold text-gradient">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>

              {/* Phone mockup for the first feature */}
              {index === 0 && (
                <motion.div
                  className="mt-6 w-24 h-40 rounded-xl border-4 border-green-200 dark:border-green-800 overflow-hidden relative"
                  animate={{
                    y: [0, -5, 0],
                    boxShadow: [
                      "0 0 10px 2px rgba(34, 197, 94, 0.2)",
                      "0 0 15px 5px rgba(34, 197, 94, 0.3)",
                      "0 0 10px 2px rgba(34, 197, 94, 0.2)",
                    ],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-green-100 to-white dark:from-green-900 dark:to-background"></div>
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 bg-green-200 dark:bg-green-700 rounded-full"></div>
                  <div className="absolute top-6 left-1/2 -translate-x-1/2 w-16 h-2 bg-green-500 rounded-md"></div>
                  <div className="absolute top-10 left-1/2 -translate-x-1/2 w-12 h-12 bg-green-200 dark:bg-green-800 rounded-full flex items-center justify-center">
                    <div className="w-8 h-8 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full border-2 border-green-300 dark:border-green-700"></div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
