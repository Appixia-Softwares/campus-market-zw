"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"
import { createOrder } from "@/lib/actions/orders"
import { useRouter } from "next/navigation"

interface OrderFormProps {
  listingId: string
  sellerId: string
  listingTitle: string
  listingPrice: number
}

export function OrderForm({ listingId, sellerId, listingTitle, listingPrice }: OrderFormProps) {
  const [quantity, setQuantity] = useState(1)
  const [meetupLocation, setMeetupLocation] = useState("")
  const [meetupDate, setMeetupDate] = useState("")
  const [meetupTime, setMeetupTime] = useState("")
  const [notes, setNotes] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const totalPrice = listingPrice * quantity

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (!meetupLocation || !meetupDate || !meetupTime) {
      setError("Please fill in all required fields")
      setIsLoading(false)
      return
    }

    const formData = new FormData()
    formData.append("listingId", listingId)
    formData.append("sellerId", sellerId)
    formData.append("quantity", quantity.toString())
    formData.append("meetupLocation", meetupLocation)
    formData.append("meetupDate", meetupDate)
    formData.append("meetupTime", meetupTime)
    formData.append("notes", notes)

    try {
      const result = await createOrder(formData)
      if (result.error) {
        setError(result.error)
      } else {
        setSuccess(true)
        setTimeout(() => {
          router.push(`/orders/${result.orderId}`)
        }, 2000)
      }
    } catch (error: any) {
      setError(error.message || "An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Complete Your Order</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="w-4 h-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-4 border-green-500">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <AlertTitle>Order Placed</AlertTitle>
            <AlertDescription>
              Your order has been successfully placed. Redirecting to order details...
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Order Summary</h3>
              <div className="bg-muted p-4 rounded-md">
                <div className="flex justify-between mb-2">
                  <span>Item:</span>
                  <span className="font-medium">{listingTitle}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Price:</span>
                  <span className="font-medium">${listingPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Quantity:</span>
                  <div className="flex items-center">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      -
                    </Button>
                    <Input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
                      className="h-8 w-16 mx-2 text-center"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between pt-2 border-t mt-2">
                  <span className="font-bold">Total:</span>
                  <span className="font-bold">${totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Meetup Details</h3>
              <div className="space-y-3">
                <div>
                  <label htmlFor="meetupLocation" className="block text-sm font-medium mb-1">
                    Meetup Location <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="meetupLocation"
                    placeholder="e.g., University Library, Main Campus"
                    value={meetupLocation}
                    onChange={(e) => setMeetupLocation(e.target.value)}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="meetupDate" className="block text-sm font-medium mb-1">
                      Date <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="meetupDate"
                      type="date"
                      value={meetupDate}
                      onChange={(e) => setMeetupDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="meetupTime" className="block text-sm font-medium mb-1">
                      Time <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="meetupTime"
                      type="time"
                      value={meetupTime}
                      onChange={(e) => setMeetupTime(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium mb-1">
                    Additional Notes
                  </label>
                  <Textarea
                    id="notes"
                    placeholder="Any special instructions or questions for the seller"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </div>
          <CardFooter className="px-0 pt-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Processing..." : "Place Order"}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  )
}
