"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"
import { updateOrderStatus } from "@/lib/actions/orders"
import { useRouter } from "next/navigation"

interface OrderStatusProps {
  orderId: string
  currentStatus: string
  isBuyer: boolean
  isSeller: boolean
}

export function OrderStatus({ orderId, currentStatus, isBuyer, isSeller }: OrderStatusProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleUpdateStatus = async (newStatus: string) => {
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const result = await updateOrderStatus(orderId, newStatus)
      if (result.error) {
        setError(result.error)
      } else {
        setSuccess(true)
        setTimeout(() => {
          router.refresh()
        }, 1000)
      }
    } catch (error: any) {
      setError(error.message || "An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusActions = () => {
    if (isSeller) {
      switch (currentStatus) {
        case "pending":
          return (
            <div className="flex gap-2 mt-4">
              <Button onClick={() => handleUpdateStatus("confirmed")} disabled={isLoading}>
                Confirm Order
              </Button>
              <Button variant="outline" onClick={() => handleUpdateStatus("cancelled")} disabled={isLoading}>
                Cancel Order
              </Button>
            </div>
          )
        case "confirmed":
          return (
            <div className="flex gap-2 mt-4">
              <Button onClick={() => handleUpdateStatus("completed")} disabled={isLoading}>
                Mark as Completed
              </Button>
            </div>
          )
        default:
          return null
      }
    }

    if (isBuyer) {
      switch (currentStatus) {
        case "pending":
          return (
            <div className="flex gap-2 mt-4">
              <Button variant="outline" onClick={() => handleUpdateStatus("cancelled")} disabled={isLoading}>
                Cancel Order
              </Button>
            </div>
          )
        case "confirmed":
          return (
            <div className="flex gap-2 mt-4">
              <Button onClick={() => handleUpdateStatus("received")} disabled={isLoading}>
                Mark as Received
              </Button>
            </div>
          )
        default:
          return null
      }
    }

    return null
  }

  return (
    <div>
      <div className={`p-4 rounded-md border ${getStatusColor(currentStatus)}`}>
        <div className="flex items-center">
          <div className="mr-2">
            {currentStatus === "completed" || currentStatus === "received" ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <div className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center">
                <span className="text-xs font-bold">{currentStatus.charAt(0).toUpperCase()}</span>
              </div>
            )}
          </div>
          <div>
            <h3 className="font-medium">
              Status: <span className="capitalize">{currentStatus}</span>
            </h3>
            <p className="text-sm">
              {currentStatus === "pending" && "Waiting for seller to confirm the order."}
              {currentStatus === "confirmed" && "Order confirmed. Waiting for meetup."}
              {currentStatus === "completed" && "Order has been completed."}
              {currentStatus === "received" && "Buyer has received the item."}
              {currentStatus === "cancelled" && "Order has been cancelled."}
            </p>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="w-4 h-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mt-4 border-green-500">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>Order status has been updated.</AlertDescription>
          </Alert>
        )}

        {getStatusActions()}
      </div>
    </div>
  )
}
