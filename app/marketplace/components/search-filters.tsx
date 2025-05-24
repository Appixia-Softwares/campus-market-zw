"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Search, Filter, X } from "lucide-react"

interface SearchFiltersProps {
  onSearch: (filters: any) => void
  categories: { id: string; name: string }[]
}

export function SearchFilters({ onSearch, categories }: SearchFiltersProps) {
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    query: "",
    category: "all",
    minPrice: 0,
    maxPrice: 1000,
    condition: "all",
    sortBy: "newest"
  })

  const handleSearch = () => {
    // Convert 'all' values to empty strings for the API
    const apiFilters = {
      ...filters,
      category: filters.category === "all" ? "" : filters.category,
      condition: filters.condition === "all" ? "" : filters.condition
    }
    onSearch(apiFilters)
  }

  const resetFilters = () => {
    setFilters({
      query: "",
      category: "all",
      minPrice: 0,
      maxPrice: 1000,
      condition: "all",
      sortBy: "newest"
    })
    onSearch({})
  }

  return (
    <Card className="p-4 space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search items..."
            className="pl-8"
            value={filters.query}
            onChange={(e) => setFilters({ ...filters, query: e.target.value })}
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
        </Button>
        <Button onClick={handleSearch}>Search</Button>
      </div>

      {showFilters && (
        <div className="grid gap-4 pt-4 border-t">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select
                value={filters.category}
                onValueChange={(value) => setFilters({ ...filters, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Condition</label>
              <Select
                value={filters.condition}
                onValueChange={(value) => setFilters({ ...filters, condition: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any Condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Condition</SelectItem>
                  <SelectItem value="New">New</SelectItem>
                  <SelectItem value="Like New">Like New</SelectItem>
                  <SelectItem value="Good">Good</SelectItem>
                  <SelectItem value="Fair">Fair</SelectItem>
                  <SelectItem value="Poor">Poor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Price Range</label>
            <Slider
              defaultValue={[filters.minPrice, filters.maxPrice]}
              max={1000}
              step={10}
              onValueChange={([min, max]) => setFilters({ ...filters, minPrice: min, maxPrice: max })}
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>${filters.minPrice}</span>
              <span>${filters.maxPrice}</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Sort By</label>
            <Select
              value={filters.sortBy}
              onValueChange={(value) => setFilters({ ...filters, sortBy: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="price_asc">Price: Low to High</SelectItem>
                <SelectItem value="price_desc">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={resetFilters} className="flex items-center gap-2">
              <X className="h-4 w-4" />
              Reset
            </Button>
            <Button onClick={handleSearch}>Apply Filters</Button>
          </div>
        </div>
      )}
    </Card>
  )
} 