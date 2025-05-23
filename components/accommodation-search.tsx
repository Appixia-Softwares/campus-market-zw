"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AccommodationSearch() {
  const router = useRouter()
  const [location, setLocation] = useState("")
  const [roomType, setRoomType] = useState("")
  const [priceRange, setPriceRange] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (location) params.append("location", location)
    if (roomType) params.append("type", roomType)
    if (priceRange) params.append("price", priceRange)

    if (router) {
      router.push(`/accommodation?${params.toString()}`)
    }
  }

  return (
    <form onSubmit={handleSearch} className="bg-card shadow-lg rounded-lg p-4 md:p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label htmlFor="location" className="text-sm font-medium">
            Campus/Location
          </label>
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger id="location">
              <SelectValue placeholder="Select campus" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="main-campus">Main Campus</SelectItem>
              <SelectItem value="north-campus">North Campus</SelectItem>
              <SelectItem value="south-campus">South Campus</SelectItem>
              <SelectItem value="city-center">City Center</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label htmlFor="room-type" className="text-sm font-medium">
            Room Type
          </label>
          <Select value={roomType} onValueChange={setRoomType}>
            <SelectTrigger id="room-type">
              <SelectValue placeholder="Any type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="single">Single Room</SelectItem>
              <SelectItem value="shared">Shared Room</SelectItem>
              <SelectItem value="studio">Studio Apartment</SelectItem>
              <SelectItem value="apartment">Full Apartment</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label htmlFor="price-range" className="text-sm font-medium">
            Price Range
          </label>
          <Select value={priceRange} onValueChange={setPriceRange}>
            <SelectTrigger id="price-range">
              <SelectValue placeholder="Any price" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0-100">$0 - $100</SelectItem>
              <SelectItem value="100-200">$100 - $200</SelectItem>
              <SelectItem value="200-300">$200 - $300</SelectItem>
              <SelectItem value="300+">$300+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-end">
          <Button type="submit" className="w-full">
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
        </div>
      </div>
    </form>
  )
}
