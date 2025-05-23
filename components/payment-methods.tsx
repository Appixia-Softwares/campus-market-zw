"use client"

import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Edit, Phone, Plus, Smartphone, Trash2 } from "lucide-react"
import { useState } from "react"

// Mock data for payment methods
const MOCK_PAYMENT_METHODS = [
  {
    id: "pm1",
    type: "ecocash",
    name: "EcoCash",
    details: "+263 71 234 5678",
    isDefault: true,
    icon: Phone,
  },
  {
    id: "pm2",
    type: "paynow",
    name: "PayNow",
    details: "student@example.com",
    isDefault: false,
    icon: Smartphone,
  },
]

export default function PaymentMethods() {
  const [paymentMethods, setPaymentMethods] = useState(MOCK_PAYMENT_METHODS)

  const setDefaultMethod = (id: string) => {
    setPaymentMethods((methods) =>
      methods.map((method) => ({
        ...method,
        isDefault: method.id === id,
      })),
    )
  }

  const deleteMethod = (id: string) => {
    setPaymentMethods((methods) => methods.filter((method) => method.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Your Payment Methods</h3>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Payment Method
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paymentMethods.map((method) => {
          const Icon = method.icon

          return (
            <Card key={method.id} className={method.isDefault ? "border-primary" : ""}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{method.name}</CardTitle>
                      <CardDescription>{method.details}</CardDescription>
                    </div>
                  </div>
                  {method.isDefault && (
                    <Badge variant="outline" className="border-primary text-primary">
                      Default
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardFooter className="pt-2 flex justify-between">
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => deleteMethod(method.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                </div>
                {!method.isDefault && (
                  <Button variant="outline" size="sm" onClick={() => setDefaultMethod(method.id)}>
                    Set as Default
                  </Button>
                )}
              </CardFooter>
            </Card>
          )
        })}

        <Card className="border-dashed flex flex-col items-center justify-center p-6">
          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <CreditCard className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="font-medium mb-2">Add a New Payment Method</h3>
          <p className="text-sm text-muted-foreground text-center mb-4">
            Add EcoCash, PayNow, or other payment methods to make rent payments easier
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Method
          </Button>
        </Card>
      </div>
    </div>
  )
}
