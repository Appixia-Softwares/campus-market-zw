import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Filter,
  Search,
  MessageSquare,
  Heart,
  ChevronDown,
  Plus,
  Building,
  Tag,
  Clock,
  ArrowUpRight,
} from "lucide-react"
import Link from "next/link"
import DashboardSidebar from "@/components/dashboard-sidebar"

export default function MarketplacePage() {
  return (
    <div className="container py-8 animate-in fade-in duration-500">
       
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Campus Marketplace</h1>
          <p className="text-muted-foreground">Discover products and accommodations from your campus community</p>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search listings..." className="w-full pl-8" />
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="shrink-0">
                <Filter className="h-4 w-4" />
              </Button>
              <Select defaultValue="all">
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="products">Products</SelectItem>
                  <SelectItem value="accommodation">Accommodation</SelectItem>
                  <SelectItem value="services">Services</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="date-desc">
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date-desc">Newest First</SelectItem>
                  <SelectItem value="date-asc">Oldest First</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Link href="/dashboard/student/listings/new">
            <Button className="w-full md:w-auto gap-1 shadow-sm">
              <Plus className="h-4 w-4" /> Add Listing
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="featured" className="w-full">
          <TabsList className="grid grid-cols-4 w-full max-w-md">
            <TabsTrigger value="featured">Featured</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="accommodation">Housing</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
          </TabsList>

          <TabsContent value="featured" className="mt-6 space-y-8">
            {/* Featured Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold">Featured Listings</h2>
                  <p className="text-muted-foreground">Handpicked listings from our community</p>
                </div>
                <Button variant="ghost" size="sm" className="gap-1">
                  View all <ArrowUpRight className="h-3.5 w-3.5" />
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {featuredListings.slice(0, 4).map((listing) => (
                  <FeaturedCard key={listing.id} listing={listing} />
                ))}
              </div>
            </div>

            {/* Recent Products */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold">Recent Products</h2>
                  <p className="text-muted-foreground">Latest items from students</p>
                </div>
                <Button variant="ghost" size="sm" className="gap-1" asChild>
                  <Link href="#products">
                    View all <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {mockProducts.slice(0, 4).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>

            {/* Accommodation */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold">Student Housing</h2>
                  <p className="text-muted-foreground">Find your perfect accommodation</p>
                </div>
                <Button variant="ghost" size="sm" className="gap-1" asChild>
                  <Link href="#accommodation">
                    View all <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {accommodations.slice(0, 3).map((accommodation) => (
                  <AccommodationCard key={accommodation.id} accommodation={accommodation} />
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="products" className="mt-6" id="products">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold">All Products</h2>
                <p className="text-muted-foreground">Browse all products from students</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {mockProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              <div className="flex justify-center mt-8">
                <Button variant="outline" className="gap-1">
                  Load More <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="accommodation" className="mt-6" id="accommodation">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold">All Accommodations</h2>
                <p className="text-muted-foreground">Find your perfect student housing</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {accommodations.map((accommodation) => (
                  <AccommodationCard key={accommodation.id} accommodation={accommodation} />
                ))}
              </div>

              <div className="flex justify-center mt-8">
                <Button variant="outline" className="gap-1">
                  Load More <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="services" className="mt-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold">Student Services</h2>
                <p className="text-muted-foreground">Services offered by students for students</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {services.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function FeaturedCard({ listing }: { listing: FeaturedListing }) {
  return (
    <Card className="overflow-hidden group hover:shadow-md transition-all duration-300 border-primary/10">
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <img
          src={listing.imageUrl || "/placeholder.svg"}
          alt={listing.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4">
          <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">{listing.type}</Badge>
          <h3 className="text-white font-semibold text-lg">{listing.title}</h3>
          <p className="text-white/90 text-sm">{listing.price}</p>
        </div>
      </div>
    </Card>
  )
}

function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="overflow-hidden group hover:shadow-md transition-all duration-300">
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <img
          src={product.imageUrl || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {product.sold && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
            <Badge variant="destructive" className="text-sm px-3 py-1">
              Sold
            </Badge>
          </div>
        )}
        <Button variant="ghost" size="icon" className="absolute top-2 right-2 bg-background/50 hover:bg-background/80">
          <Heart className={`h-4 w-4 ${product.isFavorite ? "fill-primary text-primary" : ""}`} />
        </Button>
      </div>

      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-medium line-clamp-1">{product.name}</h3>
            <p className="text-lg font-bold text-primary">${product.price.toFixed(2)}</p>
          </div>
          <Badge variant="secondary" className="text-xs">
            {product.category}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{product.description}</p>
        <div className="flex items-center text-xs text-muted-foreground">
          <p>{product.location}</p>
          <div className="mx-1 h-1 w-1 rounded-full bg-muted-foreground"></div>
          <p>{product.postedDate}</p>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button variant="default" className="w-full gap-1">
          <MessageSquare className="h-4 w-4" /> Contact
        </Button>
      </CardFooter>
    </Card>
  )
}

function AccommodationCard({ accommodation }: { accommodation: Accommodation }) {
  return (
    <Card className="overflow-hidden group hover:shadow-md transition-all duration-300">
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        <img
          src={accommodation.imageUrl || "/placeholder.svg"}
          alt={accommodation.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {accommodation.isVerified && <Badge className="absolute top-3 left-3 bg-green-600 text-white">Verified</Badge>}
        <Button variant="ghost" size="icon" className="absolute top-2 right-2 bg-background/50 hover:bg-background/80">
          <Heart className={`h-4 w-4 ${accommodation.isFavorite ? "fill-primary text-primary" : ""}`} />
        </Button>
      </div>

      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-medium text-lg">{accommodation.title}</h3>
            <p className="text-lg font-bold text-primary">${accommodation.price}/month</p>
          </div>
          <Badge variant="outline" className="text-xs">
            {accommodation.type}
          </Badge>
        </div>

        <p className="text-sm text-muted-foreground mb-3">{accommodation.location}</p>

        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant="secondary" className="text-xs">
            {accommodation.bedrooms} {accommodation.bedrooms === 1 ? "Bedroom" : "Bedrooms"}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {accommodation.bathrooms} {accommodation.bathrooms === 1 ? "Bathroom" : "Bathrooms"}
          </Badge>
          {accommodation.features.slice(0, 2).map((feature, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {feature}
            </Badge>
          ))}
        </div>

        <div className="flex items-center text-xs text-muted-foreground">
          <Clock className="h-3 w-3 mr-1" />
          <p>Available from {accommodation.availableFrom}</p>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button variant="outline" className="w-full gap-1">
          <Building className="h-4 w-4" /> View Details
        </Button>
        <Button variant="default" className="w-full gap-1">
          <MessageSquare className="h-4 w-4" /> Contact
        </Button>
      </CardFooter>
    </Card>
  )
}

function ServiceCard({ service }: { service: Service }) {
  return (
    <Card className="overflow-hidden group hover:shadow-md transition-all duration-300">
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <img
          src={service.imageUrl || "/placeholder.svg"}
          alt={service.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <Button variant="ghost" size="icon" className="absolute top-2 right-2 bg-background/50 hover:bg-background/80">
          <Heart className={`h-4 w-4 ${service.isFavorite ? "fill-primary text-primary" : ""}`} />
        </Button>
      </div>

      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-medium line-clamp-1">{service.title}</h3>
            <p className="text-lg font-bold text-primary">
              ${service.price.toFixed(2)}
              {service.priceType}
            </p>
          </div>
          <Badge variant="secondary" className="text-xs">
            {service.category}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{service.description}</p>
        <div className="flex items-center text-xs text-muted-foreground">
          <Tag className="h-3 w-3 mr-1" />
          <p>{service.provider}</p>
          <div className="mx-1 h-1 w-1 rounded-full bg-muted-foreground"></div>
          <p>{service.postedDate}</p>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button variant="default" className="w-full gap-1">
          <MessageSquare className="h-4 w-4" /> Contact
        </Button>
      </CardFooter>
    </Card>
  )
}

// Types
interface Product {
  id: number
  name: string
  description: string
  price: number
  category: string
  imageUrl: string
  location: string
  postedDate: string
  isFavorite: boolean
  sold?: boolean
}

interface Accommodation {
  id: number
  title: string
  location: string
  price: number
  imageUrl: string
  type: string
  bedrooms: number
  bathrooms: number
  features: string[]
  availableFrom: string
  isVerified: boolean
  isFavorite: boolean
}

interface Service {
  id: number
  title: string
  description: string
  price: number
  priceType: string
  category: string
  imageUrl: string
  provider: string
  postedDate: string
  isFavorite: boolean
}

interface FeaturedListing {
  id: number
  title: string
  price: string
  imageUrl: string
  type: string
}

// Mock data
const featuredListings: FeaturedListing[] = [
  {
    id: 1,
    title: "Modern Studio Apartment",
    price: "$650/month",
    imageUrl: "/placeholder.svg?height=300&width=400",
    type: "Housing",
  },
  {
    id: 2,
    title: "MacBook Pro 2022",
    price: "$1,299",
    imageUrl: "/placeholder.svg?height=300&width=400",
    type: "Electronics",
  },
  {
    id: 3,
    title: "Tutoring Services",
    price: "$25/hour",
    imageUrl: "/placeholder.svg?height=300&width=400",
    type: "Service",
  },
  {
    id: 4,
    title: "Shared 3-Bedroom House",
    price: "$450/month",
    imageUrl: "/placeholder.svg?height=300&width=400",
    type: "Housing",
  },
]

const mockProducts: Product[] = [
  {
    id: 1,
    name: "MacBook Pro 2020",
    description: "13-inch MacBook Pro in excellent condition. 16GB RAM, 512GB SSD.",
    price: 899.99,
    category: "Electronics",
    imageUrl: "/placeholder.svg?height=300&width=400",
    location: "Main Campus",
    postedDate: "1 day ago",
    isFavorite: true,
  },
  {
    id: 2,
    name: "Calculus Textbook",
    description: "Calculus: Early Transcendentals, 8th Edition. Like new condition.",
    price: 45.0,
    category: "Books",
    imageUrl: "/placeholder.svg?height=300&width=400",
    location: "North Campus",
    postedDate: "2 days ago",
    isFavorite: false,
  },
  {
    id: 3,
    name: "Desk Lamp",
    description: "Adjustable LED desk lamp with multiple brightness settings.",
    price: 18.5,
    category: "Furniture",
    imageUrl: "/placeholder.svg?height=300&width=400",
    location: "East Hall",
    postedDate: "3 days ago",
    isFavorite: false,
  },
  {
    id: 4,
    name: "Wireless Headphones",
    description: "Noise-canceling wireless headphones with 30-hour battery life.",
    price: 79.99,
    category: "Electronics",
    imageUrl: "/placeholder.svg?height=300&width=400",
    location: "Student Center",
    postedDate: "5 days ago",
    isFavorite: false,
  },
  {
    id: 5,
    name: "Study Desk",
    description: "Compact study desk with built-in shelves. Perfect for dorm rooms.",
    price: 65.0,
    category: "Furniture",
    imageUrl: "/placeholder.svg?height=300&width=400",
    location: "South Campus",
    postedDate: "1 week ago",
    isFavorite: true,
  },
  {
    id: 6,
    name: "Mini Refrigerator",
    description: "1.7 cubic feet mini fridge. Works perfectly. Moving out and need it gone.",
    price: 50.0,
    category: "Appliances",
    imageUrl: "/placeholder.svg?height=300&width=400",
    location: "West Apartments",
    postedDate: "2 weeks ago",
    isFavorite: false,
  },
  {
    id: 7,
    name: "Scientific Calculator",
    description: "TI-84 Plus Calculator. Barely used. Perfect for engineering courses.",
    price: 70.0,
    category: "Electronics",
    imageUrl: "/placeholder.svg?height=300&width=400",
    location: "Engineering Building",
    postedDate: "2 weeks ago",
    isFavorite: false,
  },
  {
    id: 8,
    name: "Bluetooth Speaker",
    description: "Portable Bluetooth speaker with 20-hour battery life. Great sound quality.",
    price: 35.0,
    category: "Electronics",
    imageUrl: "/placeholder.svg?height=300&width=400",
    location: "Student Union",
    postedDate: "3 weeks ago",
    isFavorite: false,
  },
]

const accommodations: Accommodation[] = [
  {
    id: 1,
    title: "Modern Studio Apartment",
    location: "North Campus Area, 0.5 miles from campus",
    price: 650,
    imageUrl: "/placeholder.svg?height=300&width=400",
    type: "Studio",
    bedrooms: 1,
    bathrooms: 1,
    features: ["Furnished", "Utilities Included", "Wi-Fi"],
    availableFrom: "June 1",
    isVerified: true,
    isFavorite: false,
  },
  {
    id: 2,
    title: "Shared 3-Bedroom House",
    location: "West Village, 1.2 miles from campus",
    price: 450,
    imageUrl: "/placeholder.svg?height=300&width=400",
    type: "Shared House",
    bedrooms: 3,
    bathrooms: 2,
    features: ["Furnished", "Backyard", "Parking"],
    availableFrom: "May 15",
    isVerified: true,
    isFavorite: true,
  },
  {
    id: 3,
    title: "Private Room in Shared House",
    location: "South Campus Area, 0.4 miles from campus",
    price: 375,
    imageUrl: "/placeholder.svg?height=300&width=400",
    type: "Private Room",
    bedrooms: 1,
    bathrooms: 1.5,
    features: ["Furnished", "Shared Kitchen", "Laundry"],
    availableFrom: "June 1",
    isVerified: false,
    isFavorite: false,
  },
  {
    id: 4,
    title: "Luxury 2-Bedroom Apartment",
    location: "Downtown, 1.5 miles from campus",
    price: 850,
    imageUrl: "/placeholder.svg?height=300&width=400",
    type: "Apartment",
    bedrooms: 2,
    bathrooms: 2,
    features: ["Furnished", "Gym", "Pool", "Parking"],
    availableFrom: "August 1",
    isVerified: true,
    isFavorite: false,
  },
  {
    id: 5,
    title: "Cozy 1-Bedroom Apartment",
    location: "East Campus, 0.3 miles from campus",
    price: 550,
    imageUrl: "/placeholder.svg?height=300&width=400",
    type: "Apartment",
    bedrooms: 1,
    bathrooms: 1,
    features: ["Furnished", "Utilities Included", "Pets Allowed"],
    availableFrom: "July 1",
    isVerified: false,
    isFavorite: false,
  },
  {
    id: 6,
    title: "Basement Studio",
    location: "Faculty Heights, 0.7 miles from campus",
    price: 400,
    imageUrl: "/placeholder.svg?height=300&width=400",
    type: "Studio",
    bedrooms: 1,
    bathrooms: 1,
    features: ["Private Entrance", "Utilities Included"],
    availableFrom: "June 15",
    isVerified: true,
    isFavorite: false,
  },
]

const services: Service[] = [
  {
    id: 1,
    title: "Math Tutoring",
    description: "Experienced tutor for Calculus, Linear Algebra, and Statistics. Flexible hours.",
    price: 25,
    priceType: "/hour",
    category: "Tutoring",
    imageUrl: "/placeholder.svg?height=300&width=400",
    provider: "John Smith",
    postedDate: "2 days ago",
    isFavorite: false,
  },
  {
    id: 2,
    title: "Photography Services",
    description: "Professional portrait and event photography. Perfect for graduation photos!",
    price: 100,
    priceType: "/session",
    category: "Photography",
    imageUrl: "/placeholder.svg?height=300&width=400",
    provider: "Emma Johnson",
    postedDate: "1 week ago",
    isFavorite: true,
  },
  {
    id: 3,
    title: "Web Development",
    description: "Custom website development for personal portfolios, small businesses, and student organizations.",
    price: 200,
    priceType: "/project",
    category: "Tech",
    imageUrl: "/placeholder.svg?height=300&width=400",
    provider: "David Chen",
    postedDate: "3 days ago",
    isFavorite: false,
  },
  {
    id: 4,
    title: "Resume Review & Career Coaching",
    description: "Get your resume professionally reviewed and receive career advice from a certified coach.",
    price: 40,
    priceType: "/session",
    category: "Career",
    imageUrl: "/placeholder.svg?height=300&width=400",
    provider: "Sarah Williams",
    postedDate: "5 days ago",
    isFavorite: false,
  },
]
