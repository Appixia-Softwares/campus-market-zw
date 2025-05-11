"use client"

import { useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { motion } from "framer-motion"

// Mock data for testimonials
const testimonials = [
  {
    id: 1,
    name: "John Doe",
    university: "University of Zimbabwe",
    avatar: "/placeholder.svg?height=100&width=100",
    quote:
      "I found my perfect off-campus apartment through Campus Market. The verification system gave me peace of mind knowing the landlord was trustworthy.",
    rating: 5,
  },
  {
    id: 2,
    name: "Jane Smith",
    university: "NUST",
    avatar: "/placeholder.svg?height=100&width=100",
    quote:
      "Selling my old textbooks was so easy! I made some extra cash and helped other students save money on their course materials.",
    rating: 5,
  },
  {
    id: 3,
    name: "Michael Johnson",
    university: "MSU",
    avatar: "/placeholder.svg?height=100&width=100",
    quote:
      "The in-app messaging made it easy to coordinate with sellers. I bought a laptop at a great price from a fellow student.",
    rating: 4,
  },
  {
    id: 4,
    name: "Sarah Williams",
    university: "HIT",
    avatar: "/placeholder.svg?height=100&width=100",
    quote:
      "As a landlord, I appreciate the verification process. It helps me find reliable student tenants for my properties near campus.",
    rating: 5,
  },
]

export function TestimonialCarousel() {
  const carouselRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const { current } = carouselRef
      const scrollAmount = direction === "left" ? -current.offsetWidth * 0.75 : current.offsetWidth * 0.75

      current.scrollBy({ left: scrollAmount, behavior: "smooth" })
    }
  }

  return (
    <div className="relative">
      <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 z-10 hidden md:block">
        <Button
          variant="secondary"
          size="icon"
          className="h-10 w-10 rounded-full shadow-lg"
          onClick={() => scroll("left")}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
      </div>

      <div
        ref={carouselRef}
        className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="min-w-[280px] md:min-w-[400px] snap-start"
          >
            <Card className="h-full">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{testimonial.name}</h3>
                    <p className="text-sm text-muted-foreground">{testimonial.university}</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-muted"}`}
                    />
                  ))}
                </div>
                <p className="italic">"{testimonial.quote}"</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 z-10 hidden md:block">
        <Button
          variant="secondary"
          size="icon"
          className="h-10 w-10 rounded-full shadow-lg"
          onClick={() => scroll("right")}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>
    </div>
  )
}

export default TestimonialCarousel
