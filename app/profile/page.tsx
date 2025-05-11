import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"
import { CheckCircle, Edit, LogOut, Settings, AlertCircle } from "lucide-react"
import { getUserProfile } from "@/lib/actions/auth"
import { getUserListings } from "@/lib/actions/marketplace"
import { getUserAccommodations, getUserAccommodationApplications } from "@/lib/actions/accommodation"
import { redirect } from "next/navigation"
import { signOut } from "@/lib/actions/auth"

export default async function ProfilePage() {
  const profile = await getUserProfile()

  if (!profile) {
    redirect("/auth/signin")
  }

  const userListings = await getUserListings(profile.id)
  const userAccommodations = await getUserAccommodations(profile.id)
  const userApplications = await getUserAccommodationApplications(profile.id)

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
                      <span>Verified Student</span>
                    </Badge>
                  ) : profile.verification_document ? (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 text-yellow-500" />
                      <span>Verification Pending</span>
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
                <div className="flex flex-wrap justify-center gap-2 mt-4 md:justify-start">
                  <Button asChild size="sm" variant="outline">
                    <Link href="/profile/edit">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Link>
                  </Button>
                  {!profile.is_verified && (
                    <Button asChild size="sm" variant="outline" className="text-yellow-500 border-yellow-500">
                      <Link href="/profile/verification">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Verify Account
                      </Link>
                    </Button>
                  )}
                  <Button asChild size="sm" variant="outline">
                    <Link href="/settings">
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Link>
                  </Button>
                  <form action={signOut}>
                    <Button size="sm" variant="outline" className="text-destructive" type="submit">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="listings" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="listings">My Listings</TabsTrigger>
            <TabsTrigger value="accommodations">My Accommodations</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
          </TabsList>
          <TabsContent value="listings" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">My Listings</h2>
              <Button asChild size="sm">
                <Link href="/marketplace/new">Add New Listing</Link>
              </Button>
            </div>
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
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex gap-2">
                      <Button asChild size="sm" variant="outline" className="flex-1">
                        <Link href={`/marketplace/${listing.id}/edit`}>Edit</Link>
                      </Button>
                      <Button size="sm" variant="destructive" className="flex-1">
                        Delete
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="mb-4 text-muted-foreground">You haven't listed any items yet</p>
                  <Button asChild>
                    <Link href="/marketplace/new">Add Your First Listing</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          <TabsContent value="accommodations" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">My Accommodations</h2>
              <Button asChild size="sm">
                <Link href="/accommodation/new">Add New Property</Link>
              </Button>
            </div>
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
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex gap-2">
                      <Button asChild size="sm" variant="outline" className="flex-1">
                        <Link href={`/accommodation/${accommodation.id}/edit`}>Edit</Link>
                      </Button>
                      <Button size="sm" variant="destructive" className="flex-1">
                        Delete
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="mb-4 text-muted-foreground">You haven't listed any properties yet</p>
                  <Button asChild>
                    <Link href="/accommodation/new">Add Your First Property</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          <TabsContent value="applications" className="space-y-4">
            <h2 className="text-xl font-bold">My Applications</h2>
            {userApplications && userApplications.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                {userApplications.map((application) => (
                  <Card key={application.id} className="overflow-hidden">
                    <div className="relative aspect-video">
                      <Image
                        src={
                          application.accommodation_listings.accommodation_images?.[0]?.image_url ||
                          "/placeholder.svg?height=200&width=300"
                        }
                        alt={application.accommodation_listings.title}
                        fill
                        className="object-cover"
                      />
                      <Badge
                        className="absolute top-2 right-2"
                        variant={
                          application.status === "approved"
                            ? "default"
                            : application.status === "rejected"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold truncate">{application.accommodation_listings.title}</h3>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-lg font-bold">${application.accommodation_listings.price}/mo</span>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Applied on {new Date(application.created_at).toLocaleDateString()}
                      </p>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <Button asChild size="sm" className="w-full">
                        <Link href={`/accommodation/${application.accommodation_listings.id}`}>View Property</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">You haven't applied for any accommodations yet</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
