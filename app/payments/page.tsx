"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreditCard, DollarSign, CheckCircle, Clock, XCircle, AlertCircle, Download, Receipt } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/components/ui/use-toast"

interface Payment {
  id: string
  booking_id: string
  amount: number
  payment_method: string
  status: "pending" | "completed" | "failed" | "refunded"
  transaction_id?: string
  created_at: string
  due_date?: string
  bookings: {
    accommodations: {
      title: string
      address: string
    }
  }
}

export default function PaymentsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return

    const fetchPayments = async () => {
      try {
        setLoading(true)
        setError(null)

        const { data, error } = await supabase
          .from("payments")
          .select(`
            *,
            bookings (
              accommodations (
                title,
                address
              )
            )
          `)
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })

        if (error) throw error

        setPayments(data as Payment[])
      } catch (error) {
        console.error("Error fetching payments:", error)
        setError("Failed to load payments")
        toast({
          title: "Error",
          description: "Failed to load payments",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchPayments()
  }, [user, toast])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "default"
      case "pending":
        return "secondary"
      case "failed":
        return "destructive"
      case "refunded":
        return "outline"
      default:
        return "secondary"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "pending":
        return <Clock className="h-4 w-4" />
      case "failed":
        return <XCircle className="h-4 w-4" />
      case "refunded":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const filterPayments = (status?: string) => {
    if (!status) return payments
    return payments.filter((payment) => payment.status === status)
  }

  const totalPaid = payments.filter((p) => p.status === "completed").reduce((sum, p) => sum + p.amount, 0)

  const pendingAmount = payments.filter((p) => p.status === "pending").reduce((sum, p) => sum + p.amount, 0)

  if (loading) {
    return (
      <div className="container mx-auto py-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Payment History</h1>
          <p className="text-muted-foreground">Track your accommodation payments</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-20" />
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
        <h1 className="text-3xl font-bold">Payment History</h1>
        <p className="text-muted-foreground">Track your accommodation payments</p>
      </div>

      {/* Payment Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalPaid.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">All completed payments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${pendingAmount.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Awaiting payment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{payments.length}</div>
            <p className="text-xs text-muted-foreground">All payment records</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Payments ({payments.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({filterPayments("completed").length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({filterPayments("pending").length})</TabsTrigger>
          <TabsTrigger value="failed">Failed ({filterPayments("failed").length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <PaymentsList payments={payments} />
        </TabsContent>
        <TabsContent value="completed">
          <PaymentsList payments={filterPayments("completed")} />
        </TabsContent>
        <TabsContent value="pending">
          <PaymentsList payments={filterPayments("pending")} />
        </TabsContent>
        <TabsContent value="failed">
          <PaymentsList payments={filterPayments("failed")} />
        </TabsContent>
      </Tabs>
    </div>
  )

  function PaymentsList({ payments }: { payments: Payment[] }) {
    if (payments.length === 0) {
      return (
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No payments found</h3>
              <p className="text-muted-foreground">No payment records match the selected criteria.</p>
            </div>
          </CardContent>
        </Card>
      )
    }

    return (
      <div className="space-y-4">
        {payments.map((payment) => (
          <Card key={payment.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{payment.bookings.accommodations.title}</h3>
                  <p className="text-muted-foreground">{payment.bookings.accommodations.address}</p>
                </div>
                <Badge variant={getStatusColor(payment.status)}>
                  {getStatusIcon(payment.status)}
                  <span className="ml-1 capitalize">{payment.status}</span>
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm font-medium">Amount</p>
                  <p className="text-lg font-bold">${payment.amount.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Payment Method</p>
                  <p className="text-sm text-muted-foreground capitalize">{payment.payment_method}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Date</p>
                  <p className="text-sm text-muted-foreground">{new Date(payment.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Transaction ID</p>
                  <p className="text-sm text-muted-foreground font-mono">{payment.transaction_id || "N/A"}</p>
                </div>
              </div>

              <div className="flex gap-2">
                {payment.status === "completed" && (
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Download Receipt
                  </Button>
                )}
                {payment.status === "pending" && (
                  <Button size="sm">
                    <CreditCard className="h-4 w-4 mr-1" />
                    Pay Now
                  </Button>
                )}
                {payment.status === "failed" && (
                  <Button variant="outline" size="sm">
                    Retry Payment
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }
}
