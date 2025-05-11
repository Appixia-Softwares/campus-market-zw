"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/providers/auth-provider"
import { getPersonalizedRecommendations } from "@/lib/actions/recommendations"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MarketplaceCarousel } from "@/components/marketplace-carousel"
import { AccommodationCarousel } from "@/components/accommodation-carousel"
import { Skeleton } from "@/components/ui/skeleton"

export default function PersonalizedRecommendations() {
  const { user, isLoading } = useAuth()
  const [recommendations, setRecommendations] = useState<{
    marketplace: any[]
    accommodation: any[]
  }>({
    marketplace: [],
    accommodation: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        const recs = await getPersonalizedRecommendations(user.id)
        setRecommendations(recs)
      } catch (error) {
        console.error("Error fetching recommendations:", error)
      } finally {
        setLoading(false)
      }
    }

    if (!isLoading) {
      fetchRecommendations()
    }
  }, [user, isLoading])

  if (isLoading || loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-[300px] w-full rounded-xl" />
      </div>
    )
  }

  if (!user || (!recommendations.marketplace.length && !recommendations.accommodation.length)) {
    return null
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-4">Recommended for You</h2>
        <Tabs defaultValue="marketplace">
          <TabsList className="mb-4">
            <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
            <TabsTrigger value="accommodation">Accommodation</TabsTrigger>
          </TabsList>
          <TabsContent value="marketplace">
            {recommendations.marketplace.length > 0 ? (
              <MarketplaceCarousel listings={recommendations.marketplace} />
            ) : (
              <p className="text-muted-foreground text-center py-8">No marketplace recommendations available yet.</p>
            )}
          </TabsContent>
          <TabsContent value="accommodation">
            {recommendations.accommodation.length > 0 ? (
              <AccommodationCarousel listings={recommendations.accommodation} />
            ) : (
              <p className="text-muted-foreground text-center py-8">No accommodation recommendations available yet.</p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
