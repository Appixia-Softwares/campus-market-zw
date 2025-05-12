"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  seedAllGlobalData,
  seedCountries,
  seedCities,
  seedUniversities,
  seedCurrencies,
  seedLanguages,
} from "@/lib/actions/seed-global-data"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

export default function SeedGlobalDataPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState<string | null>(null)

  const handleSeedAll = async () => {
    setLoading("all")
    try {
      const result = await seedAllGlobalData()

      if (result.success) {
        toast({
          title: "Success",
          description: "All global data seeded successfully",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to seed all global data",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setLoading(null)
    }
  }

  const handleSeedCountries = async () => {
    setLoading("countries")
    try {
      const result = await seedCountries()

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to seed countries",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setLoading(null)
    }
  }

  const handleSeedCities = async () => {
    setLoading("cities")
    try {
      const result = await seedCities()

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to seed cities",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setLoading(null)
    }
  }

  const handleSeedUniversities = async () => {
    setLoading("universities")
    try {
      const result = await seedUniversities()

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to seed universities",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setLoading(null)
    }
  }

  const handleSeedCurrencies = async () => {
    setLoading("currencies")
    try {
      const result = await seedCurrencies()

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to seed currencies",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setLoading(null)
    }
  }

  const handleSeedLanguages = async () => {
    setLoading("languages")
    try {
      const result = await seedLanguages()

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to seed languages",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Seed Global Data</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Seed All Global Data</CardTitle>
          <CardDescription>
            This will seed all countries, cities, universities, currencies, and languages in one go.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={handleSeedAll} disabled={loading !== null}>
            {loading === "all" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Seeding...
              </>
            ) : (
              "Seed All Data"
            )}
          </Button>
        </CardFooter>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Countries</CardTitle>
            <CardDescription>
              Seed countries data including US, UK, Canada, Australia, and African countries.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={handleSeedCountries} disabled={loading !== null}>
              {loading === "countries" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Seeding...
                </>
              ) : (
                "Seed Countries"
              )}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cities</CardTitle>
            <CardDescription>Seed cities data for each country.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={handleSeedCities} disabled={loading !== null}>
              {loading === "cities" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Seeding...
                </>
              ) : (
                "Seed Cities"
              )}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Universities</CardTitle>
            <CardDescription>Seed universities data for each city.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={handleSeedUniversities} disabled={loading !== null}>
              {loading === "universities" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Seeding...
                </>
              ) : (
                "Seed Universities"
              )}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Currencies</CardTitle>
            <CardDescription>Seed currencies data including USD, EUR, GBP, and more.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={handleSeedCurrencies} disabled={loading !== null}>
              {loading === "currencies" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Seeding...
                </>
              ) : (
                "Seed Currencies"
              )}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Languages</CardTitle>
            <CardDescription>Seed languages data including English, Spanish, French, and more.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={handleSeedLanguages} disabled={loading !== null}>
              {loading === "languages" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Seeding...
                </>
              ) : (
                "Seed Languages"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
