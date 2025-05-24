"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Calendar,
  MapPin,
  User,
  CreditCard,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Home,
  Phone,
  Mail,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"

interface Booking {
  id: string
  accommodation_id: string
  user_id: string
  check_in_date: string
  check_out_date: string
  total_amount: number
  status: "pending" | "confirmed" | "cancelled" | "completed"
  payment_status: "pending" | "paid" | "refunded"
  created_at: string
  accommodations: {
    title: string
    address: string
    price_per_month: number
    users: {
      full_name: string
      email: string
      phone: string
    }
  }
}

export default function BookingsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return

    const fetchBookings = async () => {
      try {
        setLoading(true)
        setError(null)

        const { data, error } = await supabase
          .from("bookings")
          .select(`
            *,
            accommodations (
              title,
              address,
              price_per_month,
              users (
                full_name,
                email,
                phone
              )
            )
          `)
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })

        if (error) throw error

        setBookings(data as Booking[])
      } catch (error) {
        console.error("Error fetching bookings:", error)
        setError("Failed to load bookings")
        toast({
          title: "Error",
          description: "Failed to load bookings",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [user, toast])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "default"
      case "pending":
        return "secondary"
      case "cancelled":
        return "destructive"
      case "completed":
        return "outline"
      default:
        return "secondary"
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "default"
      case "pending":
        return "secondary"
      case "refunded":
        return "outline"
      default:
        return "secondary"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />
      case "pending":
        return <Clock className="h-4 w-4" />
      case "cancelled":
        return <XCircle className="h-4 w-4" />
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const filterBookings = (status?: string) => {
    if (!status) return bookings
    return bookings.filter((booking) => booking.status === status)
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Bookings</h1>
          <p className="text-muted-foreground">Manage your accommodation bookings</p>
        </div>

        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                  <Skeleton className="h-6 w-20" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Bookings</h1>
        <p className="text-muted-foreground">Manage your accommodation bookings</p>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Bookings ({bookings.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({filterBookings("pending").length})</TabsTrigger>
          <TabsTrigger value="confirmed">Confirmed ({filterBookings("confirmed").length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({filterBookings("completed").length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <BookingsList bookings={bookings} />
        </TabsContent>
        <TabsContent value="pending">
          <BookingsList bookings={filterBookings("pending")} />
        </TabsContent>
        <TabsContent value="confirmed">
          <BookingsList bookings={filterBookings("confirmed")} />
        </TabsContent>
        <TabsContent value="completed">
          <BookingsList bookings={filterBookings("completed")} />
        </TabsContent>
      </Tabs>
    </div>
  )

  function BookingsList({ bookings }: { bookings: Booking[] }) {
    if (bookings.length === 0) {
      return (
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <Home className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No bookings found</h3>
              <p className="text-muted-foreground mb-4">
                You haven't made any bookings yet. Start exploring accommodations!
              </p>
              <Link href="/accommodation">
                <Button>Browse Accommodations</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )
    }

    return (
      <div className="space-y-4">
        {bookings.map((booking) => (
          <Card key={booking.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{booking.accommodations.title}</h3>
                  <div className="flex items-center text-muted-foreground mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{booking.accommodations.address}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge variant={getStatusColor(booking.status)}>
                    {getStatusIcon(booking.status)}
                    <span className="ml-1 capitalize">{booking.status}</span>
                  </Badge>
                  <Badge variant={getPaymentStatusColor(booking.payment_status)}>
                    <CreditCard className="h-3 w-3 mr-1" />
                    <span className="capitalize">{booking.payment_status}</span>
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Check-in</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(booking.check_in_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Check-out</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(booking.check_out_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Total Amount</p>
                    <p className="text-sm text-muted-foreground">${booking.total_amount}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Landlord Contact</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{booking.accommodations.users.full_name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{booking.accommodations.users.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{booking.accommodations.users.phone || "Not provided"}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Link href={`/accommodation/${booking.accommodation_id}`}>
                  <Button variant="outline" size="sm">
                    View Property
                  </Button>
                </Link>
                {booking.status === "pending" && (
                  <Button variant="destructive" size="sm">
                    Cancel Booking
                  </Button>
                )}
                {booking.payment_status === "pending" && <Button size="sm">Pay Now</Button>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }
}
