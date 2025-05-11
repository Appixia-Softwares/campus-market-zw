import { Badge } from "@/components/ui/badge"
import TestimonialCarousel from "@/components/testimonial-carousel"

export default function TestimonialsSection() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:20px_20px] z-0" />
      <div className="absolute top-40 -right-20 w-72 h-72 rounded-full bg-green-500/5 blur-3xl" />
      <div className="absolute bottom-20 -left-20 w-64 h-64 rounded-full bg-primary/5 blur-3xl" />

      <div className="container px-4 mx-auto relative z-10">
        <div className="text-center mb-14 max-w-2xl mx-auto animate-fade-in">
          <Badge className="mb-4 px-4 py-1 text-base bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
            Testimonials
          </Badge>
          <h2 className="text-3xl font-bold md:text-4xl mb-4">What Students Say</h2>
          <p className="text-lg text-muted-foreground">
            Hear from students who have found what they needed on Campus Market.
          </p>
        </div>

        <div className="animate-fade-in-up">
          <TestimonialCarousel />
        </div>
      </div>
    </section>
  )
}
