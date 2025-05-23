"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { useState } from "react"
import { Search, SlidersHorizontal, CheckCircle2 } from "lucide-react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"

export function ListingFilters() {
  const [priceRange, setPriceRange] = useState([300, 800])
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [verifiedOnly, setVerifiedOnly] = useState(false)

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search by location, property type..." className="pl-8" />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center space-x-2">
            <Switch
              id="verified-filter"
              checked={verifiedOnly}
              onCheckedChange={setVerifiedOnly}
              className="data-[state=checked]:bg-primary"
            />
            <Label htmlFor="verified-filter" className="flex items-center gap-1 text-sm">
              <CheckCircle2 className="h-3 w-3 text-primary" />
              Verified Only
            </Label>
          </div>

          <Select defaultValue="newest">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
            </SelectContent>
          </Select>

          {/* Mobile Filters */}
          <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <SlidersHorizontal className="h-4 w-4" />
                <span className="sr-only">Filters</span>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
                <SheetDescription>Narrow down your search results</SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="mobile-property-type">Property Type</Label>
                  <Select defaultValue="all">
                    <SelectTrigger id="mobile-property-type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="house">House</SelectItem>
                      <SelectItem value="studio">Studio</SelectItem>
                      <SelectItem value="shared">Shared Room</SelectItem>
                      <SelectItem value="private">Private Room</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Price Range</Label>
                  <div className="pt-4">
                    <Slider
                      defaultValue={[300, 800]}
                      max={1500}
                      min={0}
                      step={50}
                      onValueChange={(value) => setPriceRange(value as number[])}
                    />
                    <div className="flex justify-between mt-2">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="mobile-verified"
                      checked={verifiedOnly}
                      onCheckedChange={checked => setVerifiedOnly(checked === true)}
                    />


                    <label
                      htmlFor="mobile-verified"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-1"
                    >
                      <CheckCircle2 className="h-3 w-3 text-primary" />
                      Verified Listings Only
                    </label>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Amenities</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="mobile-wifi" />
                      <label
                        htmlFor="mobile-wifi"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        WiFi
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="mobile-parking" />
                      <label
                        htmlFor="mobile-parking"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Parking
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="mobile-furnished" />
                      <label
                        htmlFor="mobile-furnished"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Furnished
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="mobile-aircon" />
                      <label
                        htmlFor="mobile-aircon"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Air Conditioning
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setMobileFiltersOpen(false)}>
                  Reset
                </Button>
                <Button onClick={() => setMobileFiltersOpen(false)}>Apply Filters</Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Desktop Filters */}
      <div className="hidden md:flex items-center gap-4 p-4 border rounded-lg bg-background">
        <div className="flex-1 grid grid-cols-4 gap-4">
          <div>
            <Label htmlFor="property-type">Property Type</Label>
            <Select defaultValue="all">
              <SelectTrigger id="property-type" className="mt-1">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="house">House</SelectItem>
                <SelectItem value="studio">Studio</SelectItem>
                <SelectItem value="shared">Shared Room</SelectItem>
                <SelectItem value="private">Private Room</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="bedrooms">Bedrooms</Label>
            <Select defaultValue="any">
              <SelectTrigger id="bedrooms" className="mt-1">
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="4+">4+</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-2">
            <Label>Price Range</Label>
            <div className="pt-4">
              <Slider
                defaultValue={[300, 800]}
                max={1500}
                min={0}
                step={50}
                onValueChange={(value) => setPriceRange(value as number[])}
              />
              <div className="flex justify-between mt-2">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>
          </div>
        </div>
        <Button>Apply Filters</Button>
      </div>
    </div>
  )
}
