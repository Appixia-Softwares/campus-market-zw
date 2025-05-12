import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { ArrowLeft, Heart, MessageSquare, Share2, ShoppingCart } from "lucide-react"
import { getMarketplaceListing, getRecommendedListings } from "@/lib/actions/marketplace"
import { OptimizedImage } from "@/components/optimized-image"
import { notFound } from "next/navigation"
import { formatDistanceToNow } from "date-fns"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { getSession } from "@/lib/actions/auth"
import { OrderForm } from "@/components/order-form"
export default async function ProductPage({ params }: { params: { id: string } }) {
  return (
    <Suspense
      fallback={
        <div className="container px-4 py-6 mx-auto md:py-10">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-8 w-48" />
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="md:col-span-2">
                <Skeleton className="aspect-square md:aspect-video w-full rounded-lg" />
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <Skeleton className="aspect-square w-full rounded-lg" />
                  <Skeleton className="aspect-square w-full rounded-lg" />
                  <Skeleton className="aspect-square w-full rounded-lg" />
                </div>
              </div>

              <Skeleton className="h-[400px] w-full rounded-lg" />
            </div>

            <Skeleton className="h-[300px] w-full rounded-lg" />
            <Skeleton className="h-[200px] w-full rounded-lg" />
          </div>
        </div>
      }
    >
      <ProductContent id={params.id} />
    </Suspense>
  )
}

async function ProductContent({ id }: { id: string }) {
  const listing = await getMarketplaceListing(id)
  const session = await getSession()

  if (!listing) {
    notFound()
  }

  const similarListings = await getRecommendedListings(session?.user.id || "", 4)
  const isSeller = session?.user.id === listing.user_id
  const images = listing.marketplace_images || []

  return (
    <div className="container px-4 py-6 mx-auto md:py-10">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="icon">
            <Link href="/marketplace">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <h1 className="text-xl font-bold md:text-2xl">{listing.title}</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Product images */}
          <div className="md:col-span-2">
            <div className="overflow-hidden rounded-lg">
              <div className="relative aspect-square md:aspect-video">
                <OptimizedImage
                  src={images[0]?.image_url || "/placeholder.svg?height=400&width=600"}
                  alt={listing.title}
                  fill
                  className="object-cover"
                />
                <Badge className="absolute top-2 right-2">{listing.category}</Badge>
              </div>
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-3 gap-2 mt-2">
                {images.slice(1).map((image, index) => (
                  <div key={index} className="relative aspect-square overflow-hidden rounded-lg">
                    <OptimizedImage
                      src={image.image_url || "/placeholder.svg?height=200&width=200"}
                      alt={`${listing.title} ${index + 2}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product details */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold">${listing.price}</h2>
                      <div className="flex gap-2">
                        <Button variant="outline" size="icon">
                          <Heart className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="icon">
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{listing.condition}</p>
                  </div>
                  
                  {!isSeller && session && (
                    <div className="flex flex-col gap-4">
                      <Button asChild>
                        <Link href={`/messages/${listing.user_id}`}>
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Message Seller
                        </Link>
                      </Button>
                      <Button asChild variant="outline">
                        <Link href="#order-form">
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Buy Now
                        </Link>
                      </Button>
                    </div>
                  )}
                  
                  {!session && (
                    <div className="flex flex-col gap-4">
                      <Button asChild>
                        <Link href={`/auth/signin?callbackUrl=/marketplace/${id}`}>
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Sign in to Contact Seller
                        </Link>
                      </Button>
                    </div>
                  )}
                  
                  <div className="pt-4 border-t">
                    <h3 className="mb-2 font-semibold">Seller Information</h3>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage
                          src={listing.profiles?.avatar_url || "/placeholder.svg?height=40&width=40"}
                          alt={listing.profiles?.full_name || "Seller"}
                        />
                        <AvatarFallback>
                          {listing.profiles?.full_name?.charAt(0) || "S"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-1">
                          <p className="font-medium">{listing.profiles?.full_name}</p>
                          {listing.profiles?.is_verified && (
                            <Badge variant="outline" className="text-xs">
                              Verified
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Member since{" "}
                          {formatDistanceToNow(new Date(listing.profiles?.created_at || Date.now()), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <h3 className="mb-2 font-semibold">Location</h3>
                    <p>{listing.location}</p>
                  </div>
                  <div className="pt-4 border-t">
                    <h3 className="mb-2 font-semibold">Posted</h3>
                    <p>
                      {formatDistanceToNow(new Date(listing.created_at), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

        {/* Product description */}
        <Card>
          <CardContent className="p-6">
            <h2 className="mb-4 text-xl font-bold">Description</h2>
            <p className="whitespace-pre-line">{listing.description}</p>
          </CardContent>
        </Card>

        {/* Order form */}
        {!isSeller && session && (
          <Card id="order-form">
            <CardContent className="p-6">
              <h2 className="mb-4 text-xl font-bold">Place Order</h2>
              <OrderForm listingId={listing.id} sellerId={listing.user_id} price={listing.price} />
            </CardContent>
          </Card>
        )}

        {/* Similar products */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Similar Products</h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {similarListings
              .filter((item) => item.id !== listing.id)
              .slice(0, 4)
              .map((product) => (
                <Link href={`/marketplace/${product.id}`} key={product.id}>
                  <Card className="overflow-hidden transition-all hover:shadow-md">
                    <div className="relative aspect-square">
                      <OptimizedImage
                        src={
                          product.marketplace_images?.[0]?.image_url ||
                          "/placeholder.svg?height=200&width=300"
                        }
                        alt={product.title}
                        fill
                        className="object-cover"
                      />
                      <Badge className="absolute top-2 right-2">{product.category}</Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold truncate">{product.title}</h3>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-lg font-bold">${product.price}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}
