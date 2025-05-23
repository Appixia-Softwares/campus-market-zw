"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { format } from "date-fns"
import { CalendarIcon, Check, CreditCard, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface BookingFormProps {
  propertyId: string
}

export default function BookingForm({ propertyId }: BookingFormProps) {
  const [date, setDate] = useState<Date>()
  const [duration, setDuration] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!date || !duration) return

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setIsSuccess(true)
  }

  if (isSuccess) {
    return (
      <div className="text-center py-4">
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Check className="h-6 w-6 text-primary" />
        </div>
        <h3 className="font-medium text-lg mb-2">Booking Request Sent!</h3>
        <p className="text-sm text-muted-foreground mb-4">
          The landlord will review your request and get back to you soon.
        </p>
        <Button variant="outline" className="w-full" onClick={() => setIsSuccess(false)}>
          Make Another Request
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="move-in-date" className="text-sm font-medium">
          Move-in Date
        </label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="move-in-date"
              variant="outline"
              className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : "Select date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
              disabled={(date) => date < new Date()}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <label htmlFor="duration" className="text-sm font-medium">
          Lease Duration
        </label>
        <Select value={duration} onValueChange={setDuration}>
          <SelectTrigger id="duration">
            <SelectValue placeholder="Select duration" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3">3 months</SelectItem>
            <SelectItem value="6">6 months</SelectItem>
            <SelectItem value="9">9 months</SelectItem>
            <SelectItem value="12">12 months</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-medium">
          Message to Landlord (Optional)
        </label>
        <Textarea
          id="message"
          placeholder="Introduce yourself and ask any questions..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="resize-none"
          rows={3}
        />
      </div>

      <div className="pt-2">
        <Button type="submit" className="w-full" disabled={!date || !duration || isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>Request to Book</>
          )}
        </Button>
      </div>

      <div className="pt-2">
        <Button variant="outline" className="w-full">
          <CreditCard className="mr-2 h-4 w-4" />
          Pay Deposit Now
        </Button>
      </div>

      <div className="text-xs text-muted-foreground text-center">
        You won't be charged yet. The landlord needs to approve your request first.
      </div>
    </form>
  )
}
