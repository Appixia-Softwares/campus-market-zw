import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Search, Home, ShoppingBag } from "lucide-react"
import { cn } from "@/lib/utils"

export default function HeroSection() {
  return (
    <section className="relative py-16 overflow-hidden md:py-20 lg:py-24">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background/50 z-0" />

      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:20px_20px] z-0" />

      {/* Floating shapes */}
      <div className="absolute top-20 right-[10%] w-64 h-64 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-10 left-[5%] w-72 h-72 rounded-full bg-primary/10 blur-3xl" />

      <div className="container relative z-10 px-4 mx-auto">
        <div className="grid gap-8 md:grid-cols-2 md:gap-12 items-center">
          <div className="flex flex-col justify-center space-y-6">
            <div className="inline-flex items-center px-3 py-1 space-x-2 text-sm rounded-full bg-primary/10 text-primary w-fit animate-fade-in">
              <span className="relative flex w-2 h-2">
                <span className="absolute inline-flex w-full h-full rounded-full opacity-75 bg-primary animate-ping"></span>
                <span className="relative inline-flex w-2 h-2 rounded-full bg-primary"></span>
              </span>
              <span>Campus Marketplace - Now Live!</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                <span className="block">Campus Market</span>
                <span className="block text-primary">For Students, By Students</span>
              </h1>
              <p className="max-w-[600px] text-xl text-muted-foreground">
                Buy, sell, and find accommodation - all in one place. Connect with fellow students and make campus life
                easier.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Button asChild size="lg" className="group">
                <Link href="/marketplace">
                  Browse Marketplace
                  <ShoppingBag className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="group">
                <Link href="/accommodation">
                  Find Accommodation
                  <Home className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>

            <div className="flex items-center pt-4 space-x-4 text-sm text-muted-foreground">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={cn(
                      "w-8 h-8 rounded-full border-2 border-background",
                      i === 1 ? "bg-orange-500" : i === 2 ? "bg-blue-500" : i === 3 ? "bg-green-500" : "bg-purple-500",
                    )}
                  />
                ))}
              </div>
              <span>Join 2,000+ students already using Campus Market</span>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden rounded-lg border border-border/40 shadow-xl bg-gradient-to-br from-background to-background/80 backdrop-blur-sm">
              {/* Search bar mockup */}
              <div className="absolute top-6 left-6 right-6 flex items-center p-3 space-x-2 bg-background rounded-full border border-border/60 shadow-sm">
                <Search className="w-5 h-5 text-muted-foreground" />
                <div className="h-5 w-40 bg-muted/50 rounded-full animate-pulse" />
              </div>

              {/* Content mockup */}
              <div className="absolute top-20 left-6 right-6 grid grid-cols-2 gap-3">
                {/* Item cards */}
                <div className="space-y-3">
                  <div
                    className="h-32 rounded-lg bg-gradient-to-br from-primary/5 to-primary/10 shadow-sm border border-border/40 animate-fade-in-up"
                    style={{ animationDelay: "0.1s" }}
                  />
                  <div
                    className="h-40 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 shadow-sm border border-border/40 animate-fade-in-up"
                    style={{ animationDelay: "0.2s" }}
                  />
                  <div
                    className="h-24 rounded-lg bg-gradient-to-br from-primary/5 to-primary/10 shadow-sm border border-border/40 animate-fade-in-up"
                    style={{ animationDelay: "0.3s" }}
                  />
                </div>
                <div className="space-y-3">
                  <div
                    className="h-40 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 shadow-sm border border-border/40 animate-fade-in-up"
                    style={{ animationDelay: "0.15s" }}
                  />
                  <div
                    className="h-32 rounded-lg bg-gradient-to-br from-primary/5 to-primary/10 shadow-sm border border-border/40 animate-fade-in-up"
                    style={{ animationDelay: "0.25s" }}
                  />
                  <div
                    className="h-24 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 shadow-sm border border-border/40 animate-fade-in-up"
                    style={{ animationDelay: "0.35s" }}
                  />
                </div>
              </div>

              {/* Floating badges */}
              <div className="absolute top-12 right-12 p-2 rounded-full bg-green-500/10 border border-green-500/20 shadow-sm animate-float">
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
              <div
                className="absolute bottom-12 left-12 p-2 rounded-full bg-blue-500/10 border border-blue-500/20 shadow-sm animate-float"
                style={{ animationDelay: "1s" }}
              >
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  <Home className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
