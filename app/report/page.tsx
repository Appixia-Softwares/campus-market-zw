"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/providers/auth-provider"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react"

export default function ReportPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const supabase = createClient()

  const [reportType, setReportType] = useState("")
  const [itemId, setItemId] = useState("")
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to submit a report",
        variant: "destructive",
      })
      router.push("/auth/signin")
      return
    }

    setIsSubmitting(true)

    try {
      // Insert report into database
      const { error } = await supabase.from("reports").insert({
        user_id: user.id,
        report_type: reportType,
        item_id: itemId || null,
        description,
        status: "pending",
      })

      if (error) throw error

      // Create notification for admins
      await supabase.from("admin_notifications").insert({
        title: "New Report Submitted",
        content: `A new ${reportType} report has been submitted and requires review.`,
        is_read: false,
      })

      setIsSuccess(true)
      toast({
        title: "Report submitted",
        description: "Thank you for your report. We'll review it shortly.",
      })

      // Reset form after 3 seconds
      setTimeout(() => {
        setReportType("")
        setItemId("")
        setDescription("")
        setIsSuccess(false)
      }, 3000)
    } catch (error) {
      console.error("Error submitting report:", error)
      toast({
        title: "Error submitting report",
        description: "Please try again later or contact support.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container max-w-md py-10">
      <Card>
        <CardHeader>
          <CardTitle>Report an Issue</CardTitle>
          <CardDescription>
            Help us keep Campus Market safe by reporting suspicious or inappropriate content
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <div className="bg-green-100 dark:bg-green-900 rounded-full p-3 mb-4">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-300" />
              </div>
              <h3 className="text-xl font-medium mb-2">Report Submitted</h3>
              <p className="text-muted-foreground">Thank you for your report. Our team will review it shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="report-type">Report Type</Label>
                <Select value={reportType} onValueChange={setReportType} required>
                  <SelectTrigger id="report-type">
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="listing">Inappropriate Listing</SelectItem>
                    <SelectItem value="user">User Behavior</SelectItem>
                    <SelectItem value="scam">Potential Scam</SelectItem>
                    <SelectItem value="technical">Technical Issue</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="item-id">
                  Item ID (optional)
                  <span className="text-xs text-muted-foreground ml-1">Found in the URL of the listing</span>
                </Label>
                <Input
                  id="item-id"
                  placeholder="e.g., 123e4567-e89b-12d3-a456-426614174000"
                  value={itemId}
                  onChange={(e) => setItemId(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Please provide details about the issue"
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              {!user && (
                <div className="flex items-start p-3 bg-amber-50 dark:bg-amber-950 rounded-md text-sm">
                  <AlertCircle className="h-4 w-4 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                  <p>You'll need to sign in to submit a report.</p>
                </div>
              )}
            </form>
          )}
        </CardContent>
        {!isSuccess && (
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting || !reportType || !description}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Report"
              )}
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}
