"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, Star } from "lucide-react"
import { createReview } from "@/lib/actions/reviews"

interface ReviewFormProps {
  revieweeId: string
  revieweeName: string
  onSuccess?: () => void
}

export function ReviewForm({ revieweeId, revieweeName, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (rating === 0) {
      setError("Please select a rating")
      setIsLoading(false)
      return
    }

    const formData = new FormData()
    formData.append("revieweeId", revieweeId)
    formData.append("rating", rating.toString())
    formData.append("comment", comment)

    try {
      const result = await createReview(formData)
      if (result.error) {
        setError(result.error)
      } else {
        setSuccess(true)
        setRating(0)
        setComment("")
        if (onSuccess) {
          onSuccess()
        }
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
        <CardTitle>Leave a Review for {revieweeName}</CardTitle>
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
            <AlertTitle>Review Submitted</AlertTitle>
            <AlertDescription>Your review has been successfully submitted.</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Rating</label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= (hoverRating || rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label htmlFor="comment" className="block text-sm font-medium mb-2">
                Comment
              </label>
              <Textarea
                id="comment"
                placeholder="Share your experience..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <CardFooter className="px-0 pt-4">
            <Button type="submit" disabled={isLoading || rating === 0}>
              {isLoading ? "Submitting..." : "Submit Review"}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  )
}
