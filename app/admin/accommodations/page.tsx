"use client"

import { useState } from "react"
import {
  ArrowUpDown,
  Download,
  Filter,
  Home,
  MapPin,
  MoreHorizontal,
  Plus,
  Search,
  Star,
  StarOff,
  Trash,
  Upload,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

// Mock accommodation types
const accommodationTypes = [
  "Single Room",
  "Shared Room",
  "Studio Apartment",
  "1-Bedroom Apartment",
  "2-Bedroom Apartment",
  "House",
]

// Mock locations
const locations = [
  "Mount Pleasant, Harare",
  "Avondale, Harare",
  "Bulawayo CBD",
  "Senga, Gweru",
  "Mkoba, Gweru",
  "Hillside, Bulawayo",
  "Avenues, Harare",
  "Eastlea, Harare",
]

// Mock accommodations data
const mockAccommodations = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  title: `${accommodationTypes[Math.floor(Math.random() * accommodationTypes.length)]} near ${
    locations[Math.floor(Math.random() * locations.length)]
  }`,
  type: accommodationTypes[Math.floor(Math.random() * accommodationTypes.length)],
  location: locations[Math.floor(Math.random() * locations.length)],
  price: Math.floor(Math.random() * 300 + 100) * 5,
  owner: `Owner ${Math.floor(Math.random() * 20) + 1}`,
  status: ["available", "pending", "occupied", "maintenance"][Math.floor(Math.random() * 4)],
  featured: Math.random() > 0.8,
  verified: Math.random() > 0.3,
  createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
  amenities: ["Wi-Fi", "Water", "Electricity", "Security", "Furnished", "Parking", "Laundry", "Kitchen"].filter(
    () => Math.random() > 0.5,
  ),
  rating: Math.floor(Math.random() * 5) + 1,
  reviews: Math.floor(Math.random() * 50),
}))

export default function AccommodationsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedAccommodation, setSelectedAccommodation] = useState<any>(null)
  const [isAddAccommodationOpen, setIsAddAccommodationOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("all")

  const itemsPerPage = 10

  // Filter accommodations based on search query and filters
  const filteredAccommodations = mockAccommodations.filter((accommodation) => {
    const matchesSearch =
      accommodation.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      accommodation.location.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || accommodation.status === statusFilter
    const matchesType = typeFilter === "all" || accommodation.type === typeFilter

    // Filter by tab
    if (activeTab === "featured" && !accommodation.featured) return false
    if (activeTab === "verified" && !accommodation.verified) return false
    if (activeTab === "pending" && accommodation.status !== "pending") return false

    return matchesSearch && matchesStatus && matchesType
  })

  // Paginate accommodations
  const paginatedAccommodations = filteredAccommodations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  const totalPages = Math.ceil(filteredAccommodations.length / itemsPerPage)

  // Get stats for tabs
  const stats = {
    all: mockAccommodations.length,
    featured: mockAccommodations.filter((a) => a.featured).length,
    verified: mockAccommodations.filter((a) => a.verified).length,
    pending: mockAccommodations.filter((a) => a.status === "pending").length,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Accommodations</h1>
        <Button onClick={() => setIsAddAccommodationOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Accommodation
        </Button>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all" className="relative">
            All
            <Badge variant="secondary" className="ml-2">
              {stats.all}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="featured" className="relative">
            Featured
            <Badge variant="secondary" className="ml-2">
              {stats.featured}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="verified" className="relative">
            Verified
            <Badge variant="secondary" className="ml-2">
              {stats.verified}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="pending" className="relative">
            Pending
            <Badge variant="secondary" className="ml-2">
              {stats.pending}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Accommodation Management</CardTitle>
              <CardDescription>
                Manage all accommodations listed on the platform. View, edit, or remove listings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="relative w-full sm:max-w-xs">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search accommodations..."
                      className="w-full pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="h-9 w-[130px] gap-1">
                          <Filter className="h-3.5 w-3.5" />
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Statuses</SelectItem>
                          <SelectItem value="available">Available</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="occupied">Occupied</SelectItem>
                          <SelectItem value="maintenance">Maintenance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center gap-2">
                      <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger className="h-9 w-[180px] gap-1">
                          <Filter className="h-3.5 w-3.5" />
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          {accommodationTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Button variant="outline" size="sm" className="h-9">
                      <Download className="mr-2 h-3.5 w-3.5" />
                      Export
                    </Button>
                  </div>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[300px]">
                          <div className="flex items-center gap-1">
                            Accommodation
                            <ArrowUpDown className="h-3.5 w-3.5" />
                          </div>
                        </TableHead>
                        <TableHead>
                          <div className="flex items-center gap-1">
                            Location
                            <ArrowUpDown className="h-3.5 w-3.5" />
                          </div>
                        </TableHead>
                        <TableHead>
                          <div className="flex items-center gap-1">
                            Price
                            <ArrowUpDown className="h-3.5 w-3.5" />
                          </div>
                        </TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Featured</TableHead>
                        <TableHead>Verified</TableHead>
                        <TableHead>
                          <div className="flex items-center gap-1">
                            Listed
                            <ArrowUpDown className="h-3.5 w-3.5" />
                          </div>
                        </TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedAccommodations.length > 0 ? (
                        paginatedAccommodations.map((accommodation) => (
                          <TableRow key={accommodation.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                                  <Home className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <div>
                                  <div className="font-medium line-clamp-1">{accommodation.title}</div>
                                  <div className="text-sm text-muted-foreground">{accommodation.type}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                                <span>{accommodation.location}</span>
                              </div>
                            </TableCell>
                            <TableCell>${accommodation.price}/month</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  accommodation.status === "available"
                                    ? "default"
                                    : accommodation.status === "pending"
                                      ? "outline"
                                      : accommodation.status === "occupied"
                                        ? "secondary"
                                        : "destructive"
                                }
                                className={
                                  accommodation.status === "available"
                                    ? "bg-green-500 hover:bg-green-600"
                                    : accommodation.status === "pending"
                                      ? "text-yellow-600 border-yellow-300 bg-yellow-50 hover:bg-yellow-100 dark:text-yellow-400 dark:border-yellow-800 dark:bg-yellow-950/20"
                                      : accommodation.status === "maintenance"
                                        ? "bg-red-500 hover:bg-red-600"
                                        : ""
                                }
                              >
                                {accommodation.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {accommodation.featured ? (
                                <Badge
                                  variant="outline"
                                  className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/20 dark:text-purple-400 dark:border-purple-800"
                                >
                                  <Star className="h-3 w-3 mr-1 fill-current" />
                                  Featured
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-muted-foreground">
                                  <StarOff className="h-3 w-3 mr-1" />
                                  Standard
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              {accommodation.verified ? (
                                <Badge
                                  variant="outline"
                                  className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-800"
                                >
                                  Verified
                                </Badge>
                              ) : (
                                <Badge
                                  variant="outline"
                                  className="bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950/20 dark:text-gray-400 dark:border-gray-800"
                                >
                                  Unverified
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>{new Date(accommodation.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Open menu</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem onClick={() => setSelectedAccommodation(accommodation)}>
                                    <Home className="mr-2 h-4 w-4" />
                                    Edit Accommodation
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Star
                                      className={`mr-2 h-4 w-4 ${accommodation.featured ? "fill-yellow-400" : ""}`}
                                    />
                                    {accommodation.featured ? "Remove from Featured" : "Mark as Featured"}
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="text-red-600 dark:text-red-400"
                                    onClick={() => {
                                      setSelectedAccommodation(accommodation)
                                      setIsDeleteDialogOpen(true)
                                    }}
                                  >
                                    <Trash className="mr-2 h-4 w-4" />
                                    Delete Accommodation
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={8} className="h-24 text-center">
                            No accommodations found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Showing <strong>{paginatedAccommodations.length}</strong> of{" "}
                    <strong>{filteredAccommodations.length}</strong> accommodations
                  </div>

                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                        />
                      </PaginationItem>

                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNumber = i + 1

                        // Adjust page numbers for pagination with ellipsis
                        if (totalPages > 5) {
                          if (currentPage > 3 && currentPage < totalPages - 1) {
                            pageNumber = currentPage - 2 + i
                          } else if (currentPage >= totalPages - 1) {
                            pageNumber = totalPages - 4 + i
                          }
                        }

                        return (
                          <PaginationItem key={i}>
                            <PaginationLink
                              isActive={pageNumber === currentPage}
                              onClick={() => setCurrentPage(pageNumber)}
                            >
                              {pageNumber}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      })}

                      {totalPages > 5 && currentPage < totalPages - 2 && (
                        <>
                          <PaginationItem>
                            <PaginationEllipsis />
                          </PaginationItem>
                          <PaginationItem>
                            <PaginationLink
                              isActive={currentPage === totalPages}
                              onClick={() => setCurrentPage(totalPages)}
                            >
                              {totalPages}
                            </PaginationLink>
                          </PaginationItem>
                        </>
                      )}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Accommodation Dialog */}
      <Dialog open={isAddAccommodationOpen} onOpenChange={setIsAddAccommodationOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Accommodation</DialogTitle>
            <DialogDescription>
              Create a new accommodation listing. Fill in all the details to make it visible to students.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" placeholder="Single Room near University of Zimbabwe" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="type">Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {accommodationTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">Price ($ per month)</Label>
                <Input id="price" type="number" placeholder="300" />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Describe the accommodation..." />
            </div>
            <div className="grid gap-2">
              <Label>Amenities</Label>
              <div className="grid grid-cols-2 gap-2">
                {["Wi-Fi", "Water", "Electricity", "Security", "Furnished", "Parking", "Laundry", "Kitchen"].map(
                  (amenity) => (
                    <div key={amenity} className="flex items-center space-x-2">
                      <Switch id={`amenity-${amenity}`} />
                      <Label htmlFor={`amenity-${amenity}`}>{amenity}</Label>
                    </div>
                  ),
                )}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="images">Images</Label>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="dropzone-file"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/20 hover:bg-muted/30"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">SVG, PNG, JPG or GIF (MAX. 5MB)</p>
                  </div>
                  <input id="dropzone-file" type="file" className="hidden" multiple />
                </label>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch id="featured" />
                <Label htmlFor="featured">Mark as Featured</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="verified" />
                <Label htmlFor="verified">Mark as Verified</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddAccommodationOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={() => setIsAddAccommodationOpen(false)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Accommodation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Accommodation Dialog */}
      <Dialog
        open={!!selectedAccommodation && !isDeleteDialogOpen}
        onOpenChange={(open) => !open && setSelectedAccommodation(null)}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Accommodation</DialogTitle>
            <DialogDescription>Update accommodation information and settings.</DialogDescription>
          </DialogHeader>
          {selectedAccommodation && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input id="edit-title" defaultValue={selectedAccommodation.title} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-type">Type</Label>
                  <Select defaultValue={selectedAccommodation.type}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {accommodationTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-price">Price ($ per month)</Label>
                  <Input id="edit-price" type="number" defaultValue={selectedAccommodation.price} />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-location">Location</Label>
                <Select defaultValue={selectedAccommodation.location}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select defaultValue={selectedAccommodation.status}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="occupied">Occupied</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Amenities</Label>
                <div className="grid grid-cols-2 gap-2">
                  {["Wi-Fi", "Water", "Electricity", "Security", "Furnished", "Parking", "Laundry", "Kitchen"].map(
                    (amenity) => (
                      <div key={amenity} className="flex items-center space-x-2">
                        <Switch
                          id={`edit-amenity-${amenity}`}
                          defaultChecked={selectedAccommodation.amenities.includes(amenity)}
                        />
                        <Label htmlFor={`edit-amenity-${amenity}`}>{amenity}</Label>
                      </div>
                    ),
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch id="edit-featured" defaultChecked={selectedAccommodation.featured} />
                  <Label htmlFor="edit-featured">Featured</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="edit-verified" defaultChecked={selectedAccommodation.verified} />
                  <Label htmlFor="edit-verified">Verified</Label>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedAccommodation(null)}>
              Cancel
            </Button>
            <Button type="submit" onClick={() => setSelectedAccommodation(null)}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Accommodation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Accommodation</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this accommodation? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedAccommodation && (
            <div className="py-4">
              <div className="flex items-center gap-3 rounded-lg border p-3">
                <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                  <Home className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <div className="font-medium">{selectedAccommodation.title}</div>
                  <div className="text-sm text-muted-foreground">{selectedAccommodation.location}</div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false)
                setSelectedAccommodation(null)
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setIsDeleteDialogOpen(false)
                setSelectedAccommodation(null)
              }}
            >
              Delete Accommodation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
