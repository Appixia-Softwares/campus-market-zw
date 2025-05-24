import { ArrowRight, BookOpen, Home, MessageCircle, ShoppingBag } from "lucide-react"
import Link from "next/link"
import HeroSection from "@/components/hero-section"
import FeatureCard from "@/components/feature-card"
import HowItWorks from "@/components/how-it-works"
import VerificationSection from "@/components/verification-section"
import PwaFeatures from "@/components/pwa-features"
import TestimonialCarousel from "@/components/testimonial-carousel"
import ProductShowcase from "@/components/product-showcase"
import AccommodationShowcase from "@/components/accommodation-showcase"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-green-600 dark:text-green-400" />
            <span className="text-xl font-bold">Campus Marketplace</span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/login">
              <Button
                variant="outline"
                size="sm"
                className="border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/50 hover:text-green-700 dark:hover:text-green-300"
              >
                Log in
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="relative overflow-hidden group">
                <span className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative z-10">Sign up</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection />

        {/* Product & Accommodation Showcase */}
        <section className="container py-12 md:py-24">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
            <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl">
              <span className="text-gradient">Everything Students Need</span>
            </h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              From textbooks to tech gadgets, cozy rooms to affordable apartments - all in one place.
            </p>
          </div>

          <div className="mt-16 grid gap-8">
            <ProductShowcase />
            <AccommodationShowcase />
          </div>
        </section>

        {/* Features Section */}
        <section className="container py-12 md:py-24">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
            <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl">
              <span className="text-gradient">Platform Features</span>
            </h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              Designed specifically for Zimbabwean university students
            </p>
          </div>

          <div className="mx-auto mt-16 grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
            <FeatureCard
              icon={<ShoppingBag className="h-10 w-10" />}
              title="Student Marketplace"
              description="Buy and sell textbooks, electronics, clothing, and more directly from other students."
            />
            <FeatureCard
              icon={<Home className="h-10 w-10" />}
              title="Accommodation Finder"
              description="Find verified off-campus rooms, flats, and houses near your university."
            />
            <FeatureCard
              icon={<MessageCircle className="h-10 w-10" />}
              title="In-App Messaging"
              description="Chat directly with sellers and landlords to negotiate and arrange meetups."
            />
          </div>
        </section>

        {/* How It Works */}
        <HowItWorks />

        {/* Verification Section */}
        <VerificationSection />

        {/* PWA Features */}
        <PwaFeatures />

        {/* Testimonials */}
        <TestimonialCarousel />

        {/* CTA Section */}
        <section className="bg-gradient-to-b from-green-50 to-white dark:from-green-950/20 dark:to-background py-16 relative overflow-hidden">
          {/* Background glow */}
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-green-500/10 w-32 h-32 blur-3xl"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  opacity: 0.2 + Math.random() * 0.3,
                }}
              />
            ))}
          </div>

          <div className="container flex flex-col items-center justify-center gap-6 text-center relative z-10">
            <h2 className="text-3xl font-bold leading-tight sm:text-4xl">
              <span className="text-gradient">Ready to join Campus Marketplace?</span>
            </h2>
            <p className="max-w-[85%] text-lg text-muted-foreground">
              Create your account today and start exploring the marketplace or find your perfect accommodation.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href="/register">
                <Button size="lg" className="gap-2 relative overflow-hidden group">
                  <span className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="relative z-10">Sign up now</span>
                  <ArrowRight className="h-4 w-4 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>
              <Link href="/dashboard/marketplace">
                <Button variant="outline" size="lg" className="gradient-border">
                  Explore marketplace
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-background relative">
        <div className="absolute inset-0 bg-gradient-to-t from-green-50/30 to-transparent dark:from-green-950/10 dark:to-transparent"></div>
        <div className="container flex flex-col gap-8 py-8 md:flex-row md:py-12 relative z-10">
          <div className="flex flex-1 flex-col gap-2">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-green-600 dark:text-green-400" />
              <span className="text-lg font-semibold">Campus Marketplace</span>
            </div>
            <p className="text-sm text-muted-foreground">The ultimate platform for Zimbabwean university students.</p>
          </div>
          <div className="grid flex-1 grid-cols-2 gap-8 sm:grid-cols-3">
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-medium text-gradient">Platform</h3>
              <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="/dashboard/marketplace"
                    className="hover:text-green-600 dark:hover:text-green-400 transition-colors"
                  >
                    Marketplace
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/accommodation"
                    className="hover:text-green-600 dark:hover:text-green-400 transition-colors"
                  >
                    Accommodation
                  </Link>
                </li>
                <li>
                  <Link href="/verify" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">
                    Get Verified
                  </Link>
                </li>
              </ul>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-medium text-gradient">Resources</h3>
              <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/help" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link href="/safety" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">
                    Safety Tips
                  </Link>
                </li>
              </ul>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-medium text-gradient">Company</h3>
              <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/about" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="container border-t py-6 text-center text-sm text-muted-foreground relative z-10">
          &copy; {new Date().getFullYear()} Campusmarketplace. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
