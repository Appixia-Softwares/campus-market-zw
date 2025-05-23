"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, Edit, Eye, Heart, MessageSquare, Package, ShoppingBag, Trash2 } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Mock data for user's marketplace listings
const MOCK_LISTINGS = [
  {
    id: "ml1",
    title: "Desk Lamp",
    price: 15,
    condition: "Like New",
    description: "Adjustable LED desk lamp with multiple brightness settings",
    category: "Furniture",
    status: "active",
    datePosted: "2023-09-15",
    views: 24,
    likes: 7,
    messages: 3,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "ml2",
    title: "Calculus Textbook",
    price: 30,
    condition: "Good",
    description: "Calculus: Early Transcendentals, 8th Edition. Some highlighting inside.",
    category: "Books",
    status: "active",
    datePosted: "2023-09-10",
    views: 18,
    likes: 2,
    messages: 1,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "ml3",
    title: "Bluetooth Speaker",
    price: 25,
    condition: "Excellent",
    description: "Portable Bluetooth speaker with 10-hour battery life",
    category: "Electronics",
    status: "sold",
    datePosted: "2023-08-28",
    views: 42,
    likes: 9,
    messages: 5,
    image: "/placeholder.svg?height=100&width=100",
  },
]

export default function MyListings() {
  const [listings, setListings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [itemToDelete, setItemToDelete] = useState(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
      setListings(MOCK_LISTINGS)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleDeleteItem = () => {
    if (itemToDelete) {
      setListings((prev) => prev.filter((item) => item.id !== itemToDelete.id))
      setItemToDelete(null)
      setIsDeleteDialogOpen(false)
    }
  }

  const confirmDelete = (item) => {
    setItemToDelete(item)
    setIsDeleteDialogOpen(true)
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">Active</Badge>
        )
      case "sold":
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">Sold</Badge>
      case "pending":
        return <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">Pending</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <Card className="hover-card-animation">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" />
            <CardTitle>My Listings</CardTitle>
          </div>
          <Link href="/marketplace/my-listings">
            <Button variant="ghost" size="sm" className="gap-1">
              View All
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
        <CardDescription>Items you're selling on the marketplace</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4 p-3 border rounded-lg animate-pulse">
                <div className="w-16 h-16 bg-muted rounded-md"></div>
                <div className="flex-1">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : listings.length > 0 ? (
          <div className="space-y-4">
            {listings.map((listing, index) => (
              <div
                key={listing.id}
                className="flex gap-4 p-3 border rounded-lg hover:border-primary/50 transition-all animate-slide-up group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative w-16 h-16 flex-shrink-0">
                  <img
                    src={listing.image || "/placeholder.svg"}
                    alt={listing.title}
                    className="w-full h-full object-cover rounded-md"
                  />
                  {listing.status === "sold" && (
                    <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded-md">
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">SOLD</Badge>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium line-clamp-1 group-hover:text-primary transition-colors">
                        {listing.title}
                      </h4>
                      <p className="text-primary font-semibold text-sm">${listing.price}</p>
                    </div>
                    {getStatusBadge(listing.status)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{listing.description}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Eye className="h-3 w-3 mr-1" />
                      {listing.views}
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Heart className="h-3 w-3 mr-1" />
                      {listing.likes}
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <MessageSquare className="h-3 w-3 mr-1" />
                      {listing.messages}
                    </div>
                  </div>
                </div>
                <div className="flex items-start">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <span className="sr-only">Open menu</span>
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 15 15"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                        >
                          <path
                            d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z"
                            fill="currentColor"
                            fillRule="evenodd"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Listing
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        View Messages
                      </DropdownMenuItem>
                      {listing.status === "active" && (
                        <DropdownMenuItem>
                          <Package className="h-4 w-4 mr-2" />
                          Mark as Sold
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive" onClick={() => confirmDelete(listing)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Listing
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
              <ShoppingBag className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-medium mb-1">No listings yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Start selling your unused items to other students on campus
            </p>
            <Link href="/marketplace/sell">
              <Button>
                <ShoppingBag className="h-4 w-4 mr-2" />
                Sell an Item
              </Button>
            </Link>
          </div>
        )}
      </CardContent>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Listing</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{itemToDelete?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteItem}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
