"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import {
  seedMarketplaceListings,
  seedAccommodationListings,
  seedNotifications,
  seedMessages,
} from "@/lib/actions/seed-data"

export default function SeedDataPage() {
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({
    marketplace: false,
    accommodation: false,
    notifications: false,
    messages: false,
  })

  const [results, setResults] = useState<Record<string, { success?: boolean; message?: string; error?: string }>>({})

  const handleSeed = async (type: "marketplace" | "accommodation" | "notifications" | "messages") => {
    setIsLoading((prev) => ({ ...prev, [type]: true }))

    try {
      let result

      switch (type) {
        case "marketplace":
          result = await seedMarketplaceListings()
          break
        case "accommodation":
          result = await seedAccommodationListings()
          break
        case "notifications":
          result = await seedNotifications()
          break
        case "messages":
          result = await seedMessages()
          break
      }

      setResults((prev) => ({ ...prev, [type]: result }))
    } catch (error) {
      setResults((prev) => ({
        ...prev,
        [type]: {
          success: false,
          error: error instanceof Error ? error.message : "An unknown error occurred",
        },
      }))
    } finally {
      setIsLoading((prev) => ({ ...prev, [type]: false }))
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Seed Database</h1>
        <p className="text-muted-foreground">Populate the database with sample data for testing</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Marketplace Listings</CardTitle>
            <CardDescription>Create sample marketplace listings with images</CardDescription>
          </CardHeader>
          <CardContent>
            {results.marketplace && (
              <Alert className="mb-4" variant={results.marketplace.success ? "default" : "destructive"}>
                {results.marketplace.success ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <AlertTitle>{results.marketplace.success ? "Success" : "Error"}</AlertTitle>
                <AlertDescription>{results.marketplace.message || results.marketplace.error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={() => handleSeed("marketplace")} disabled={isLoading.marketplace}>
              {isLoading.marketplace && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Seed Marketplace Listings
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Accommodation Listings</CardTitle>
            <CardDescription>Create sample accommodation listings with images, amenities, and rules</CardDescription>
          </CardHeader>
          <CardContent>
            {results.accommodation && (
              <Alert className="mb-4" variant={results.accommodation.success ? "default" : "destructive"}>
                {results.accommodation.success ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <AlertTitle>{results.accommodation.success ? "Success" : "Error"}</AlertTitle>
                <AlertDescription>{results.accommodation.message || results.accommodation.error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={() => handleSeed("accommodation")} disabled={isLoading.accommodation}>
              {isLoading.accommodation && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Seed Accommodation Listings
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Create sample notifications for users</CardDescription>
          </CardHeader>
          <CardContent>
            {results.notifications && (
              <Alert className="mb-4" variant={results.notifications.success ? "default" : "destructive"}>
                {results.notifications.success ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <AlertTitle>{results.notifications.success ? "Success" : "Error"}</AlertTitle>
                <AlertDescription>{results.notifications.message || results.notifications.error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={() => handleSeed("notifications")} disabled={isLoading.notifications}>
              {isLoading.notifications && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Seed Notifications
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Messages</CardTitle>
            <CardDescription>Create sample messages between users</CardDescription>
          </CardHeader>
          <CardContent>
            {results.messages && (
              <Alert className="mb-4" variant={results.messages.success ? "default" : "destructive"}>
                {results.messages.success ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                <AlertTitle>{results.messages.success ? "Success" : "Error"}</AlertTitle>
                <AlertDescription>{results.messages.message || results.messages.error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={() => handleSeed("messages")} disabled={isLoading.messages}>
              {isLoading.messages && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Seed Messages
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
