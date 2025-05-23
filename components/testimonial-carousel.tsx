"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const testimonials = [
  {
    quote:
      "ZimStudentHub helped me find affordable textbooks and a great room near campus. The verification system makes it feel safe to use.",
    author: "Tatenda M.",
    role: "UZ Student",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    quote:
      "I sold my old laptop and textbooks in just two days! The platform connects you directly with other students who need what you're selling.",
    author: "Kudzai R.",
    role: "NUST Student",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    quote:
      "As a landlord, I can easily list my properties and connect with verified students. The verification system gives me peace of mind.",
    author: "Chiedza N.",
    role: "Property Owner",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

export default function TestimonialCarousel() {
  const [current, setCurrent] = useState(0)

  const next = () => setCurrent((current + 1) % testimonials.length)
  const prev = () => setCurrent((current - 1 + testimonials.length) % testimonials.length)

  useEffect(() => {
    const interval = setInterval(next, 5000)
    return () => clearInterval(interval)
  }, [current])

  return (
    <section className="container py-12 md:py-24 relative overflow-hidden">
      {/* Background glow */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-green-500/10 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      />

      <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center relative z-10">
        <motion.h2
          className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-gradient">What Students Say</span>
        </motion.h2>
      </div>

      <div className="relative mx-auto mt-16 max-w-4xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center text-center"
          >
            <motion.div
              className="mb-6 rounded-full bg-green-100 dark:bg-green-900/50 p-5 text-green-600 dark:text-green-400 relative"
              animate={{
                boxShadow: [
                  "0 0 10px 2px rgba(34, 197, 94, 0.2)",
                  "0 0 20px 5px rgba(34, 197, 94, 0.4)",
                  "0 0 10px 2px rgba(34, 197, 94, 0.2)",
                ],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            >
              <Quote className="h-8 w-8" />
            </motion.div>
            <blockquote className="mb-6 text-xl md:text-2xl relative">
              <span className="text-6xl text-green-200 dark:text-green-900 absolute -top-6 -left-4">"</span>
              <span className="relative z-10">{testimonials[current].quote}</span>
              <span className="text-6xl text-green-200 dark:text-green-900 absolute -bottom-10 -right-4">"</span>
            </blockquote>
            <motion.div
              className="flex items-center gap-4 relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Avatar className="h-12 w-12 border-2 border-green-200 dark:border-green-800">
                <AvatarImage
                  src={testimonials[current].avatar || "/placeholder.svg"}
                  alt={testimonials[current].author}
                />
                <AvatarFallback className="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400">
                  {testimonials[current].author.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="text-left">
                <div className="font-semibold">{testimonials[current].author}</div>
                <div className="text-sm text-green-600 dark:text-green-400">{testimonials[current].role}</div>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        <div className="absolute -bottom-12 left-0 right-0 flex justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={prev}
            className="border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/50 hover:text-green-700 dark:hover:text-green-300"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous testimonial</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={next}
            className="border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/50 hover:text-green-700 dark:hover:text-green-300"
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next testimonial</span>
          </Button>
        </div>

        {/* Indicator dots */}
        <div className="absolute -bottom-20 left-0 right-0 flex justify-center gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === current ? "w-8 bg-green-500" : "w-2 bg-green-200 dark:bg-green-800"
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
