import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"

export function BookingRequests() {
  const requests = [
    {
      id: 1,
      student: "Alice Johnson",
      property: "2 Bedroom Apartment",
      date: "May 15, 2025",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "AJ",
    },
    {
      id: 2,
      student: "Bob Smith",
      property: "Studio Apartment",
      date: "May 18, 2025",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "BS",
    },
    {
      id: 3,
      student: "Carol Davis",
      property: "Private Room",
      date: "May 20, 2025",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "CD",
    },
  ]

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Booking Requests</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {requests.map((request) => (
            <div key={request.id} className="flex items-center space-x-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={request.avatar || "/placeholder.svg"} alt={request.student} />
                <AvatarFallback>{request.initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <p className="font-medium">{request.student}</p>
                <p className="text-sm text-muted-foreground">
                  {request.property} • {request.date}
                </p>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                  <Check className="h-4 w-4" />
                  <span className="sr-only">Approve</span>
                </Button>
                <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                  <X className="h-4 w-4" />
                  <span className="sr-only">Reject</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
