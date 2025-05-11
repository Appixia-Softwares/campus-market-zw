import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import Link from "next/link"
import AccommodationCarousel from "@/components/accommodation-carousel"

export default function AccommodationPreviewSection({ listings = [] }) {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:20px_20px] z-0" />
      <div className="absolute top-40 -left-20 w-72 h-72 rounded-full bg-green-500/5 blur-3xl" />
      <div className="absolute bottom-20 -right-20 w-64 h-64 rounded-full bg-primary/5 blur-3xl" />

      <div className="container px-4 mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10">
          <div className="animate-fade-in">
            <Badge className="mb-4 px-4 py-1 text-base bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
              Student Housing
            </Badge>
            <h2 className="text-3xl font-bold md:text-4xl mb-4">Featured Accommodations</h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Discover verified off-campus housing options near your university.
            </p>
          </div>
          <Button
            variant="outline"
            className="mt-4 md:mt-0 group hover:bg-primary hover:text-primary-foreground transition-all duration-300 animate-fade-in"
            asChild
          >
            <Link href="/accommodation">
              View All Rooms
              <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </Button>
        </div>

        <div className="animate-fade-in-up">
          <AccommodationCarousel listings={listings} />
        </div>
      </div>
    </section>
  )
}
