import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import Link from "next/link"
import MarketplaceCarousel from "@/components/marketplace-carousel"

export default function MarketplacePreviewSection({ listings = [] }) {
  return (
    <section className="py-20 bg-muted/30 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:20px_20px] z-0" />
      <div className="absolute top-20 -right-20 w-72 h-72 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-40 -left-20 w-64 h-64 rounded-full bg-blue-500/5 blur-3xl" />

      <div className="container px-4 mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10">
          <div className="animate-fade-in">
            <Badge className="mb-4 px-4 py-1 text-base bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
              Student Marketplace
            </Badge>
            <h2 className="text-3xl font-bold md:text-4xl mb-4">Latest Items For Sale</h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Browse through the latest items posted by students on your campus.
            </p>
          </div>
          <Button
            variant="outline"
            className="mt-4 md:mt-0 group hover:bg-primary hover:text-primary-foreground transition-all duration-300 animate-fade-in"
            asChild
          >
            <Link href="/marketplace">
              View All Items
              <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </Button>
        </div>

        <div className="animate-fade-in-up">
          <MarketplaceCarousel listings={listings} />
        </div>
      </div>
    </section>
  )
}
