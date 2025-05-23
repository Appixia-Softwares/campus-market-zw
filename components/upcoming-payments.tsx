"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, ArrowRight, Calendar, CreditCard, Home } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useState, useEffect } from "react"
import Link from "next/link"

// Mock data for upcoming payments
const MOCK_UPCOMING_PAYMENTS = [
  {
    id: "up1",
    dueDate: "2023-10-01",
    amount: 250,
    description: "October Rent - Modern Studio Apartment",
    propertyId: "1",
    propertyTitle: "Modern Studio Apartment",
    status: "upcoming",
    daysLeft: 7,
  },
  {
    id: "up2",
    dueDate: "2023-11-01",
    amount: 250,
    description: "November Rent - Modern Studio Apartment",
    propertyId: "1",
    propertyTitle: "Modern Studio Apartment",
    status: "upcoming",
    daysLeft: 38,
  },
  {
    id: "up3",
    dueDate: "2023-12-01",
    amount: 250,
    description: "December Rent - Modern Studio Apartment",
    propertyId: "1",
    propertyTitle: "Modern Studio Apartment",
    status: "upcoming",
    daysLeft: 68,
  },
]

export default function UpcomingPayments({ limit = 0 }) {
  const [payments, setPayments] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
      setPayments(limit > 0 ? MOCK_UPCOMING_PAYMENTS.slice(0, limit) : MOCK_UPCOMING_PAYMENTS)
    }, 900)

    return () => clearTimeout(timer)
  }, [limit])

  return (
    <Card className="hover-card-animation">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            <CardTitle>Upcoming Payments</CardTitle>
          </div>
          {limit > 0 && (
            <Link href="/payments">
              <Button variant="ghost" size="sm" className="gap-1">
                View All
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          )}
        </div>
        <CardDescription>Your scheduled rent payments</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            // Loading skeleton
            Array(limit > 0 ? limit : 2)
              .fill(0)
              .map((_, i) => (
                <Card key={i} className="p-4 animate-pulse">
                  <div className="h-5 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-muted rounded w-1/2 mb-4"></div>
                  <div className="h-3 bg-muted rounded w-full mb-2"></div>
                  <div className="h-8 bg-muted rounded w-full mt-4"></div>
                </Card>
              ))
          ) : payments.length > 0 ? (
            payments.map((payment, index) => (
              <Card
                key={payment.id}
                className={`p-4 group hover:border-primary/50 transition-all animate-slide-up ${
                  payment.daysLeft <= 7 ? "border-amber-200 dark:border-amber-800" : ""
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium group-hover:text-primary transition-colors">{payment.description}</h4>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <Home className="h-3.5 w-3.5 mr-1" />
                      <span>{payment.propertyTitle}</span>
                    </div>
                  </div>
                  {payment.daysLeft <= 7 && (
                    <Badge
                      variant="outline"
                      className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800 animate-pulse-slow"
                    >
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Due Soon
                    </Badge>
                  )}
                </div>

                <div className="space-y-3 mt-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span>{new Date(payment.dueDate).toLocaleDateString()}</span>
                    </div>
                    <div className="font-semibold text-lg">${payment.amount}</div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Time Remaining</span>
                      <span
                        className={`font-medium ${payment.daysLeft <= 7 ? "text-amber-600 dark:text-amber-400" : ""}`}
                      >
                        {payment.daysLeft} days left
                      </span>
                    </div>
                    <Progress
                      value={Math.min(100, ((30 - Math.min(payment.daysLeft, 30)) / 30) * 100)}
                      className={`h-2 ${payment.daysLeft <= 7 ? "bg-amber-100 dark:bg-amber-900/30" : "bg-muted"}`}
                      indicatorClassName={payment.daysLeft <= 7 ? "bg-amber-500" : ""}
                    />
                  </div>

                  <Button className="w-full mt-2 group-hover:bg-primary/90 transition-colors">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Pay Now
                  </Button>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-6">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                <CreditCard className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="font-medium mb-1">No upcoming payments</h3>
              <p className="text-sm text-muted-foreground mb-4">You're all caught up with your rent payments</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
