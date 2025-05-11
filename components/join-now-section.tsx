import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function JoinNowSection() {
  return (
    <section className="py-20 bg-primary text-primary-foreground relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] z-0" />
      <div className="absolute top-20 -left-20 w-72 h-72 rounded-full bg-white/5 blur-3xl" />
      <div className="absolute bottom-20 -right-20 w-64 h-64 rounded-full bg-white/5 blur-3xl" />

      {/* Decorative elements */}
      <div className="absolute top-10 right-10 w-20 h-20 rounded-full border border-white/10 animate-float" />
      <div
        className="absolute bottom-10 left-10 w-16 h-16 rounded-full border border-white/10 animate-float"
        style={{ animationDelay: "1s" }}
      />
      <div
        className="absolute top-1/2 left-1/4 w-12 h-12 rounded-full border border-white/10 animate-float"
        style={{ animationDelay: "1.5s" }}
      />

      <div className="container px-4 mx-auto relative z-10">
        <div className="max-w-3xl mx-auto text-center animate-fade-in">
          <h2 className="text-3xl font-bold md:text-5xl mb-6">Join Campus Market Today</h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto mb-10">
            Join thousands of students who are already buying, selling, and finding accommodation on Campus Market.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="text-lg group hover:bg-white hover:text-primary transition-all duration-300"
              asChild
            >
              <Link href="/auth/signup">
                Create an Account
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg border-primary-foreground/20 hover:bg-primary-foreground/10 transition-all duration-300"
              asChild
            >
              <Link href="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
