import { AvatarFallback } from "@/components/ui/avatar"
import { AvatarImage } from "@/components/ui/avatar"
import { Avatar } from "@/components/ui/avatar"
import { redirect } from "next/navigation"
import { getUserProfile } from "@/lib/actions/profile"
import { createServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import { Building, Plus, Users } from "lucide-react"
import OptimizedImage from "@/components/optimized-image"

export default async function AccommodationDashboardPage() {
  const profile = await getUserProfile()

  // Redirect if not logged in
  if (!profile) {
    redirect("/auth/signin")
  }

  const supabase = createServerClient()

  // Get user's accommodation listings
  const { data: listings, error: listingsError } = await supabase
    .from("accommodation_listings")
    .select(`
      *,
      accommodation_images (*)
    `)
    .eq("user_id", profile.id)
    .order("created_at", { ascending: false })

  // Get applications for user's listings
  const { data: applications, error: applicationsError } = await supabase
    .from("accommodation_applications")
    .select(`
      *,
      accommodation_listings!inner (id, title, type),
      profiles!accommodation_applications_user_id_fkey (id, full_name, avatar_url, university)
    `)
    .eq("accommodation_listings.user_id", profile.id)
    .order("created_at", { ascending: false })

  if (listingsError) {
    console.error("Error fetching listings:", listingsError)
  }

  if (applicationsError) {
    console.error("Error fetching applications:", applicationsError)
  }

  return (
    <div className="container px-4 py-6 mx-auto md:py-10">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Accommodation Dashboard</h1>
            <p className="text-muted-foreground">Manage your properties and applications</p>
          </div>
          <Button asChild>
            <Link href="/accommodation/new">
              <Plus className="w-4 h-4 mr-2" />
              Add New Property
            </Link>
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{listings?.length || 0}</div>
              <p className="text-xs text-muted-foreground">Properties you have listed</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Applications</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{applications?.length || 0}</div>
              <p className="text-xs text-muted-foreground">Students who applied to your properties</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Verification Status</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {profile.is_verified ? (
                  <Badge className="bg-green-500">Verified</Badge>
                ) : (
                  <Badge variant="outline">Not Verified</Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {profile.is_verified ? "Your account is verified" : "Verify your account to build trust with students"}
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="properties">
          <TabsList>
            <TabsTrigger value="properties">My Properties</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
          </TabsList>
          <TabsContent value="properties" className="space-y-4">
            {listings && listings.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {listings.map((listing) => {
                  const primaryImage =
                    listing.accommodation_images.find((img) => img.is_primary) || listing.accommodation_images[0]
                  const imageUrl = primaryImage?.image_url || "/placeholder.svg?height=300&width=400"

                  return (
                    <Card key={listing.id} className="overflow-hidden">
                      <div className="relative aspect-video">
                        <OptimizedImage
                          src={imageUrl}
                          alt={listing.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        <Badge className="absolute top-2 right-2">{listing.type}</Badge>
                        {listing.is_verified && <Badge className="absolute top-2 left-2 bg-green-500">Verified</Badge>}
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold truncate">{listing.title}</h3>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-lg font-bold">${listing.price}/mo</span>
                          <Badge variant={listing.status === "active" ? "default" : "secondary"}>
                            {listing.status}
                          </Badge>
                        </div>
                        <div className="mt-2 text-xs text-muted-foreground">{listing.location}</div>
                      </CardContent>
                      <CardFooter className="p-4 pt-0 flex gap-2">
                        <Button asChild size="sm" variant="outline" className="flex-1">
                          <Link href={`/accommodation/${listing.id}/edit`}>Edit</Link>
                        </Button>
                        <Button asChild size="sm" className="flex-1">
                          <Link href={`/dashboard/accommodation/${listing.id}`}>Manage</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  )
                })}
              </div>
            ) : (
              <Card>
                <CardContent className="py-10 text-center">
                  <p className="text-muted-foreground mb-4">You haven't listed any properties yet</p>
                  <Button asChild>
                    <Link href="/accommodation/new">Add Your First Property</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          <TabsContent value="applications" className="space-y-4">
            {applications && applications.length > 0 ? (
              <div className="space-y-4">
                {applications.map((application) => (
                  <Card key={application.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Avatar>
                            <AvatarImage
                              src={application.profiles?.avatar_url || undefined}
                              alt={application.profiles?.full_name || "User"}
                            />
                            <AvatarFallback>{application.profiles?.full_name?.charAt(0) || "U"}</AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-lg">{application.profiles?.full_name}</CardTitle>
                            <CardDescription>{application.profiles?.university || "No university"}</CardDescription>
                          </div>
                        </div>
                        <Badge
                          variant={
                            application.status === "approved"
                              ? "default"
                              : application.status === "rejected"
                                ? "destructive"
                                : "outline"
                          }
                        >
                          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="text-sm font-medium">
                          Applied for:{" "}
                          <span className="font-normal">
                            {application.accommodation_listings?.title} ({application.accommodation_listings?.type})
                          </span>
                        </div>
                        <div className="text-sm font-medium">
                          Applied:{" "}
                          <span className="font-normal">
                            {formatDistanceToNow(new Date(application.created_at), { addSuffix: true })}
                          </span>
                        </div>
                        {application.message && (
                          <div className="mt-2 p-3 bg-muted rounded-md">
                            <p className="text-sm">{application.message}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                      {application.status === "pending" && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                          >
                            Reject
                          </Button>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            Approve
                          </Button>
                        </>
                      )}
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/messages/${application.user_id}`}>Message</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-10 text-center">
                  <p className="text-muted-foreground">No applications received yet</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
