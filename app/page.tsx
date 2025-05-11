import type React from "react"
import MarketplaceCarousel from "@/components/marketplace-carousel"
import AccommodationCarousel from "@/components/accommodation-carousel"
import { HeroSection } from "@/components/hero-section"
import { FeaturedListings } from "@/components/featured-listings"
import { FeaturedAccommodations } from "@/components/featured-accommodations"
import { TestimonialCarousel } from "@/components/testimonial-carousel"
import { getFeaturedListings, getRecommendedListings } from "@/lib/actions/marketplace"
import { getFeaturedAccommodations, getRecommendedAccommodations } from "@/lib/actions/accommodation"
import { getSession } from "@/lib/actions/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, ChevronRight, MapPin, MessageSquare, Shield, Wallet } from "lucide-react"
import Link from "next/link"

export default async function Home() {
  const session = await getSession()

  let marketplaceListings
  let accommodationListings

  if (session?.user) {
    // Get personalized recommendations for logged-in users
    marketplaceListings = await getRecommendedListings(session.user.id)
    accommodationListings = await getRecommendedAccommodations(session.user.id)
  } else {
    // Get featured listings for guests
    marketplaceListings = await getFeaturedListings()
    accommodationListings = await getFeaturedAccommodations()
  }

  return (
    <main className="overflow-x-hidden">
      <HeroSection />
      <div className="container px-4 mx-auto">
        <FeaturedListings
          listings={marketplaceListings}
          title={session?.user ? "Recommended For You" : "Featured Listings"}
        />
        <FeaturedAccommodations
          accommodations={accommodationListings}
          title={session?.user ? "Recommended Accommodations" : "Featured Accommodations"}
        />
        <TestimonialCarousel />
      </div>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-14">
            <Badge className="mb-4 px-4 py-1 text-base">Simple Process</Badge>
            <h2 className="text-3xl font-bold md:text-4xl">How It Works</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Campus Market makes it easy to buy, sell, and find accommodation in just a few simple steps.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                title: "Find What You Need",
                description: "Browse through thousands of listings from verified students and landlords.",
                icon: Search,
                color: "bg-blue-500/10 text-blue-500",
              },
              {
                title: "Connect Directly",
                description: "Message sellers or landlords directly through our secure messaging system.",
                icon: MessageSquare,
                color: "bg-green-500/10 text-green-500",
              },
              {
                title: "Complete Your Transaction",
                description: "Meet up, view rooms, and complete your purchase or booking safely.",
                icon: Wallet,
                color: "bg-purple-500/10 text-purple-500",
              },
            ].map((step, index) => (
              <Card key={index} className="h-full border-none shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full ${step.color}`}>
                    <step.icon className="w-8 h-8" />
                  </div>
                  <h3 className="mb-3 text-xl font-bold">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Marketplace Preview Section */}
      <section className="py-20 bg-muted/50">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10">
            <div>
              <Badge className="mb-4 px-4 py-1 text-base">Student Marketplace</Badge>
              <h2 className="text-3xl font-bold md:text-4xl">Latest Items For Sale</h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
                Browse through the latest items posted by students on your campus.
              </p>
            </div>
            <Button variant="outline" className="mt-4 md:mt-0" asChild>
              <Link href="/marketplace">
                View All Items
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <MarketplaceCarousel listings={marketplaceListings} />
        </div>
      </section>

      {/* Accommodation Preview Section */}
      <section className="py-20">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10">
            <div>
              <Badge className="mb-4 px-4 py-1 text-base">Student Housing</Badge>
              <h2 className="text-3xl font-bold md:text-4xl">Featured Accommodations</h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
                Discover verified off-campus housing options near your university.
              </p>
            </div>
            <Button variant="outline" className="mt-4 md:mt-0" asChild>
              <Link href="/accommodation">
                View All Rooms
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <AccommodationCarousel listings={accommodationListings} />
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-muted/50">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-14">
            <Badge className="mb-4 px-4 py-1 text-base">Why Campus Market</Badge>
            <h2 className="text-3xl font-bold md:text-4xl">The Trusted Platform for Students</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of students who trust Campus Market for their marketplace and accommodation needs.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Verified Sellers",
                description: "All sellers are verified students from your university.",
                icon: CheckCircle,
              },
              {
                title: "Trusted Landlords",
                description: "Blue-tick verified landlords and properties.",
                icon: Shield,
              },
              {
                title: "Campus Proximity",
                description: "All accommodations are within walking distance.",
                icon: MapPin,
              },
              {
                title: "Secure Payments",
                description: "Multiple secure payment options available.",
                icon: Wallet,
              },
            ].map((feature, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-primary/10">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-bold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-14">
            <Badge className="mb-4 px-4 py-1 text-base">Testimonials</Badge>
            <h2 className="text-3xl font-bold md:text-4xl">What Students Say</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Hear from students who have found what they needed on Campus Market.
            </p>
          </div>

          <TestimonialCarousel />
        </div>
      </section>

      {/* Join Now Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold md:text-4xl">Join Campus Market Today</h2>
            <p className="mt-4 text-lg opacity-90 max-w-2xl mx-auto">
              Join thousands of students who are already buying, selling, and finding accommodation on Campus Market.
            </p>
            <div className="flex flex-col gap-4 mt-8 sm:flex-row sm:justify-center">
              <Button size="lg" variant="secondary" className="text-lg" asChild>
                <Link href="/auth/signup">Create an Account</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg border-primary-foreground/20 hover:bg-primary-foreground/10"
                asChild
              >
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-muted/30">
        <div className="container px-4 mx-auto">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-full flexx items-center justify-center text-primary-foreground font-bold">
                  CM
                </div>
                <span className="text-xl font-bold">Campus Market</span>
              </div>
              <p className="text-muted-foreground">
                The ultimate platform for students to buy, sell, and find accommodation.
              </p>
              <div className="flex gap-4 mt-4">
                {["Twitter", "Facebook", "Instagram", "LinkedIn"].map((social) => (
                  <Link key={social} href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    {social}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-semibold">Marketplace</h3>
              <ul className="space-y-2">
                {["Browse Items", "Sell an Item", "Categories", "Popular Items"].map((link) => (
                  <li key={link}>
                    <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-semibold">Accommodation</h3>
              <ul className="space-y-2">
                {["Find a Room", "List a Property", "Verified Landlords", "Room Types"].map((link) => (
                  <li key={link}>
                    <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-semibold">Company</h3>
              <ul className="space-y-2">
                {["About Us", "Contact", "Privacy Policy", "Terms of Service"].map((link) => (
                  <li key={link}>
                    <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-8 mt-8 border-t">
            <p className="text-center text-muted-foreground">
              © {new Date().getFullYear()} Campus Market. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}

function Search(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}
