import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HeroSection() {
  return (
    <section className="relative py-12 overflow-hidden rounded-lg bg-muted md:py-16 lg:py-20">
      <div className="container px-4 mx-auto">
        <div className="grid gap-6 md:grid-cols-2 md:gap-12">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Campus Market</h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Buy, sell, and find accommodation - all in one place. Made for students, by students.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild size="lg">
                <Link href="/marketplace">Browse Marketplace</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/accommodation">Find Accommodation</Link>
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative w-full h-[300px] md:h-[400px]">
              <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-lg">
                <div className="grid grid-cols-2 gap-2 p-2">
                  <div className="space-y-2">
                    <div className="h-32 rounded-lg bg-background/80 backdrop-blur-sm shadow-sm"></div>
                    <div className="h-40 rounded-lg bg-background/80 backdrop-blur-sm shadow-sm"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-40 rounded-lg bg-background/80 backdrop-blur-sm shadow-sm"></div>
                    <div className="h-32 rounded-lg bg-background/80 backdrop-blur-sm shadow-sm"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
