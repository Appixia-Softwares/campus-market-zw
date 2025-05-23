"use client"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Download, FileText } from "lucide-react"

// Mock data for payment history
const MOCK_PAYMENTS = [
  {
    id: "p1",
    date: "2023-09-01",
    amount: 250,
    description: "September Rent - Modern Studio Apartment",
    method: "EcoCash",
    status: "completed",
    reference: "ECO123456789",
  },
  {
    id: "p2",
    date: "2023-08-15",
    amount: 250,
    description: "Security Deposit - Modern Studio Apartment",
    method: "PayNow",
    status: "completed",
    reference: "PN987654321",
  },
  {
    id: "p3",
    date: "2023-08-01",
    amount: 200,
    description: "August Rent - Private Room in Student House",
    method: "EcoCash",
    status: "completed",
    reference: "ECO123456790",
  },
  {
    id: "p4",
    date: "2023-10-01",
    amount: 250,
    description: "October Rent - Modern Studio Apartment",
    method: "PayNow",
    status: "pending",
    reference: "PN987654322",
  },
]

export default function PaymentHistory() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Reference</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {MOCK_PAYMENTS.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
              <TableCell>{payment.description}</TableCell>
              <TableCell>${payment.amount}</TableCell>
              <TableCell>{payment.method}</TableCell>
              <TableCell>
                <Badge variant={payment.status === "completed" ? "default" : "secondary"}>
                  {payment.status === "completed" ? "Paid" : "Pending"}
                </Badge>
              </TableCell>
              <TableCell className="font-mono text-xs">{payment.reference}</TableCell>
              <TableCell className="text-right">
                {payment.status === "completed" && (
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Receipt
                  </Button>
                )}
                {payment.status === "pending" && (
                  <Button variant="ghost" size="sm">
                    <FileText className="h-4 w-4 mr-1" />
                    Pay Now
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
