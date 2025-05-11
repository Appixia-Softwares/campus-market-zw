import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, CheckCircle } from "lucide-react"
import type { Tables } from "@/lib/supabase/database.types"

type ReviewWithProfile = Tables<"reviews"> & {
  profiles: {
    id: string
    full_name: string | null
    avatar_url: string | null
    is_verified: boolean
  }
}

interface ReviewsListProps {
  reviews: ReviewWithProfile[]
  averageRating: number
  totalReviews: number
}

export function ReviewsList({ reviews, averageRating, totalReviews }: ReviewsListProps) {
  if (!reviews || reviews.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No reviews yet. Be the first to leave a review!</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-5 h-5 ${
                star <= Math.round(averageRating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
              }`}
            />
          ))}
        </div>
        <div>
          <span className="font-bold text-lg">{averageRating.toFixed(1)}</span>
          <span className="text-muted-foreground ml-1">({totalReviews} reviews)</span>
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage
                      src={review.profiles.avatar_url || "/placeholder.svg?height=40&width=40"}
                      alt={review.profiles.full_name || "User"}
                    />
                    <AvatarFallback>{review.profiles.full_name?.[0] || "U"}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{review.profiles.full_name}</span>
                      {review.profiles.is_verified && (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          <span>Verified</span>
                        </Badge>
                      )}
                    </div>
                    <div className="flex mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">{new Date(review.created_at).toLocaleDateString()}</div>
              </div>
              <div className="mt-3">{review.comment}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
