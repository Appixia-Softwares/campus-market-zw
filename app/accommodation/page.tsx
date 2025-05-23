import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building, Filter, MapPin, SlidersHorizontal } from "lucide-react"
import Link from "next/link"
import AccommodationSearch from "@/components/accommodation-search"
import AccommodationFilters from "@/components/accommodation-filters"
import AccommodationList from "@/components/accommodation-list"
import { ModeToggle } from "@/components/mode-toggle"

export default function AccommodationPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b sticky top-0 z-10 bg-background">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Building className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">Agripa</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                Dashboard
              </Button>
            </Link>
            <Link href="/accommodation">
              <Button variant="ghost" size="sm">
                Accommodation
              </Button>
            </Link>
            <Link href="/bookings">
              <Button variant="ghost" size="sm">
                My Bookings
              </Button>
            </Link>
            <ModeToggle />
            <Link href="/profile">
              <Button variant="outline" size="icon" className="rounded-full">
                <span className="sr-only">Profile</span>
                <img src="/placeholder.svg?height=32&width=32" alt="Profile" className="rounded-full h-8 w-8" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="container py-6">
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Find Accommodation</h1>
              <div className="flex items-center text-muted-foreground">
                <MapPin className="h-4 w-4 mr-1" />
                <span>Browse verified listings near your campus</span>
              </div>
            </div>

            <AccommodationSearch />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="md:col-span-1 h-fit">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <Filter className="h-5 w-5 mr-2" />
                    Filters
                  </CardTitle>
                  <CardDescription>Refine your search results</CardDescription>
                </CardHeader>
                <CardContent>
                  <AccommodationFilters />
                </CardContent>
              </Card>

              <div className="md:col-span-3">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-muted-foreground">
                    Showing <span className="font-medium text-foreground">24</span> results
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="flex items-center">
                      <SlidersHorizontal className="h-4 w-4 mr-2" />
                      Sort by: Newest
                    </Button>
                  </div>
                </div>

                <AccommodationList />
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t py-6 bg-card">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Building className="h-5 w-5 text-primary" />
              <span className="font-semibold">Agripa</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Agripa. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
