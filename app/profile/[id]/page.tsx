import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, Star } from "lucide-react"
import { getUserProfile } from "@/lib/actions/auth"
import { getUserListings } from "@/lib/actions/marketplace"
import { getUserAccommodations } from "@/lib/actions/accommodation"
import { getUserReviews, getUserRating } from "@/lib/actions/reviews"
import { getSession } from "@/lib/actions/auth"
import { ReviewForm } from "@/components/review-form"
import { ReviewsList } from "@/components/reviews-list"
import { redirect } from "next/navigation"
import Link from "next/link"
import Image from "next/image"

export default async function UserProfilePage({ params }: { params: { id: string } }) {
  const profile = await getUserProfile(params.id)
  const session = await getSession()

  if (!profile) {
    redirect("/404")
  }

  const userListings = await getUserListings(params.id)
  const userAccommodations = await getUserAccommodations(params.id)
  const userReviews = await getUserReviews(params.id)
  const userRating = await getUserRating(params.id)

  const isCurrentUser = session?.user?.id === params.id
  const canReview = session?.user && !isCurrentUser

  return (
    <div className="container px-4 py-6 mx-auto md:py-10">
      <div className="flex flex-col gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center gap-4 md:flex-row">
              <Avatar className="w-24 h-24">
                <AvatarImage
                  src={profile.avatar_url || "/placeholder.svg?height=100&width=100"}
                  alt={profile.full_name || ""}
                />
                <AvatarFallback>{profile.full_name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col items-center gap-2 md:flex-row">
                  <h1 className="text-2xl font-bold">{profile.full_name}</h1>
                  {profile.is_verified ? (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      <span>Verified</span>
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="flex items-center gap-1 text-red-500 border-red-500">
                      <AlertCircle className="w-3 h-3" />
                      <span>Not Verified</span>
                    </Badge>
                  )}
                  {profile.role === "admin" && (
                    <Badge variant="default" className="bg-blue-500">
                      Admin
                    </Badge>
                  )}
                  {profile.role === "landlord" && (
                    <Badge variant="default" className="bg-purple-500">
                      Landlord
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground">{profile.university}</p>
                <p className="text-sm text-muted-foreground">
                  Member since {new Date(profile.created_at).toLocaleDateString()}
                </p>
                <div className="flex items-center justify-center mt-2 md:justify-start">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= Math.round(userRating.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2">
                    {userRating.rating > 0 ? (
                      <>
                        <span className="font-medium">{userRating.rating.toFixed(1)}</span>
                        <span className="text-muted-foreground ml-1">({userRating.count})</span>
                      </>
                    ) : (
                      <span className="text-muted-foreground">No ratings yet</span>
                    )}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="listings" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="listings">Listings</TabsTrigger>
            <TabsTrigger value="accommodations">Accommodations</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          <TabsContent value="listings" className="space-y-4">
            <h2 className="text-xl font-bold">Listings</h2>
            {userListings && userListings.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                {userListings.map((listing) => (
                  <Card key={listing.id} className="overflow-hidden">
                    <div className="relative aspect-video">
                      <Image
                        src={listing.marketplace_images?.[0]?.image_url || "/placeholder.svg?height=200&width=300"}
                        alt={listing.title}
                        fill
                        className="object-cover"
                      />
                      <Badge className="absolute top-2 right-2">{listing.category}</Badge>
                      <Badge
                        variant={listing.status === "active" ? "default" : "secondary"}
                        className="absolute top-2 left-2"
                      >
                        {listing.status}
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold truncate">{listing.title}</h3>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-lg font-bold">${listing.price}</span>
                      </div>
                      <Button asChild className="w-full mt-3" size="sm">
                        <Link href={`/marketplace/${listing.id}`}>View Details</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">This user hasn't listed any items yet.</div>
            )}
          </TabsContent>
          <TabsContent value="accommodations" className="space-y-4">
            <h2 className="text-xl font-bold">Accommodations</h2>
            {userAccommodations && userAccommodations.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                {userAccommodations.map((accommodation) => (
                  <Card key={accommodation.id} className="overflow-hidden">
                    <div className="relative aspect-video">
                      <Image
                        src={
                          accommodation.accommodation_images?.[0]?.image_url || "/placeholder.svg?height=200&width=300"
                        }
                        alt={accommodation.title}
                        fill
                        className="object-cover"
                      />
                      <Badge className="absolute top-2 right-2">{accommodation.type}</Badge>
                      <Badge
                        variant={accommodation.status === "active" ? "default" : "secondary"}
                        className="absolute top-2 left-2"
                      >
                        {accommodation.status}
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold truncate">{accommodation.title}</h3>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-lg font-bold">${accommodation.price}/mo</span>
                      </div>
                      <Button asChild className="w-full mt-3" size="sm">
                        <Link href={`/accommodation/${accommodation.id}`}>View Details</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                This user hasn't listed any accommodations yet.
              </div>
            )}
          </TabsContent>
          <TabsContent value="reviews" className="space-y-6">
            <h2 className="text-xl font-bold">Reviews</h2>
            {canReview && <ReviewForm revieweeId={params.id} revieweeName={profile.full_name || "this user"} />}
            <ReviewsList reviews={userReviews} averageRating={userRating.rating} totalReviews={userRating.count} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
