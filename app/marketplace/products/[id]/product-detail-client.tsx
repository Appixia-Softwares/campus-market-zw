"use client"

import { useState } from "react"
import Image from "next/image"
import { Heart, Share2, MessageCircle, Phone, Star, Calendar, Eye, ThumbsUp, Flag, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth-context"
import { formatDistanceToNow } from "date-fns"
import type { ProductWithDetails } from "@/lib/api/products"

interface ProductDetailClientProps {
  product: ProductWithDetails
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [selectedImage, setSelectedImage] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [showContactDialog, setShowContactDialog] = useState(false)
  const [showReviewDialog, setShowReviewDialog] = useState(false)
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState("")

  const primaryImage = product.product_images?.find((img) => img.is_primary) || product.product_images?.[0]
  const otherImages = product.product_images?.filter((img) => !img.is_primary) || []

  const handleLike = async () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to like products",
        variant: "destructive",
      })
      return
    }
    setIsLiked(!isLiked)
    // TODO: Implement like functionality
  }

  const handleSave = async () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to save products",
        variant: "destructive",
      })
      return
    }
    setIsSaved(!isSaved)
    // TODO: Implement save functionality
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          text: product.description || "",
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link copied",
        description: "Product link copied to clipboard",
      })
    }
  }

  const handleWhatsAppContact = () => {
    const message = `Hi! I'm interested in your ${product.title} listed on Campus Market ZW for $${product.price}`
    const phoneNumber = product.users.phone?.replace(/\D/g, "") || ""
    const whatsappUrl = `https://wa.me/263${phoneNumber.slice(-9)}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  const handleInAppMessage = () => {
    // TODO: Implement in-app messaging
    toast({
      title: "Message sent",
      description: "Your message has been sent to the seller",
    })
  }

  const handleSubmitReview = async () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to leave a review",
        variant: "destructive",
      })
      return
    }

    // TODO: Implement review submission
    toast({
      title: "Review submitted",
      description: "Thank you for your feedback!",
    })
    setShowReviewDialog(false)
    setReviewComment("")
    setReviewRating(5)
  }

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "New":
        return "bg-green-100 text-green-800"
      case "Like New":
        return "bg-blue-100 text-blue-800"
      case "Good":
        return "bg-yellow-100 text-yellow-800"
      case "Fair":
        return "bg-orange-100 text-orange-800"
      case "Poor":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Image Gallery */}
      <div className="space-y-4">
        <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
          {primaryImage ? (
            <Image
              src={primaryImage.url || "/placeholder.svg"}
              alt={product.title}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-gray-400">No image available</span>
            </div>
          )}
          <div className="absolute top-4 right-4 flex gap-2">
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8 bg-white/80 backdrop-blur-sm"
              onClick={handleLike}
            >
              <Heart className={`h-4 w-4 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8 bg-white/80 backdrop-blur-sm"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Thumbnail Gallery */}
        {product.product_images && product.product_images.length > 1 && (
          <div className="grid grid-cols-4 gap-2">
            {product.product_images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => setSelectedImage(index)}
                className={`relative aspect-square overflow-hidden rounded-md border-2 ${
                  selectedImage === index ? "border-primary" : "border-transparent"
                }`}
              >
                <Image
                  src={image.url || "/placeholder.svg"}
                  alt={`${product.title} ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Information */}
      <div className="space-y-6">
        <div>
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-2xl font-bold lg:text-3xl">{product.title}</h1>
            <Button variant="outline" size="icon" onClick={handleSave}>
              <Heart className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
            </Button>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-3xl font-bold text-primary">${product.price}</span>
            <Badge className={getConditionColor(product.condition)}>{product.condition}</Badge>
            {product.featured && <Badge variant="secondary">Featured</Badge>}
          </div>
        </div>

        {/* Product Stats */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            <span>{product.views} views</span>
          </div>
          <div className="flex items-center gap-1">
            <ThumbsUp className="h-4 w-4" />
            <span>{product.likes} likes</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>Listed {formatDistanceToNow(new Date(product.created_at))} ago</span>
          </div>
        </div>

        {/* Seller Information */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Seller Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={product.users.avatar_url || ""} />
                <AvatarFallback>
                  {product.users.full_name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{product.users.full_name}</span>
                  {product.users.verified && (
                    <Badge variant="secondary" className="text-xs">
                      Verified
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span>4.8 (24 reviews)</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
                <DialogTrigger asChild>
                  <Button className="flex-1">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Message Seller
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Contact Seller</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="text-sm text-muted-foreground">Choose your preferred contact method:</div>
                    <div className="space-y-2">
                      <Button className="w-full justify-start" variant="outline" onClick={handleInAppMessage}>
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Send In-App Message (Recommended)
                      </Button>
                      <Button
                        className="w-full justify-start bg-green-600 hover:bg-green-700"
                        onClick={handleWhatsAppContact}
                      >
                        <Phone className="mr-2 h-4 w-4" />
                        Contact via WhatsApp
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button size="lg" className="flex-1">
            <ShoppingCart className="mr-2 h-4 w-4" />
            Make Offer
          </Button>
          <Button size="lg" variant="outline">
            <Flag className="h-4 w-4" />
          </Button>
        </div>

        {/* Product Details Tabs */}
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm leading-relaxed">{product.description || "No description provided."}</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="grid gap-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Category</span>
                    <span className="text-sm text-muted-foreground">{product.product_categories?.name}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Condition</span>
                    <span className="text-sm text-muted-foreground">{product.condition}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Status</span>
                    <Badge variant={product.status === "active" ? "default" : "secondary"}>{product.status}</Badge>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Listed</span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(product.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Customer Reviews</h3>
              <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    Write Review
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Write a Review</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="rating">Rating</Label>
                      <Select
                        value={reviewRating.toString()}
                        onValueChange={(value) => setReviewRating(Number.parseInt(value))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[5, 4, 3, 2, 1].map((rating) => (
                            <SelectItem key={rating} value={rating.toString()}>
                              <div className="flex items-center gap-1">
                                {Array.from({ length: rating }).map((_, i) => (
                                  <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                ))}
                                <span className="ml-1">
                                  {rating} star{rating !== 1 ? "s" : ""}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="comment">Comment</Label>
                      <Textarea
                        id="comment"
                        placeholder="Share your experience with this product..."
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                      />
                    </div>
                    <Button onClick={handleSubmitReview} className="w-full">
                      Submit Review
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
              {product.reviews && product.reviews.length > 0 ? (
                product.reviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={review.users.avatar_url || ""} />
                          <AvatarFallback>
                            {review.users.full_name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{review.users.full_name}</span>
                            <div className="flex items-center">
                              {Array.from({ length: review.rating }).map((_, i) => (
                                <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              ))}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(review.created_at))} ago
                            </span>
                          </div>
                          {review.comment && <p className="text-sm text-muted-foreground">{review.comment}</p>}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
