"use client"

import { useState, useEffect } from "react"
import { SearchFilters } from "./components/search-filters"
import { ProductCard } from "./components/product-card"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

interface Category {
  id: string
  name: string
}

interface Filters {
  query?: string
  category?: string
  condition?: string
  minPrice?: number
  maxPrice?: number
  sortBy?: string
}

export default function MarketplacePage() {
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState<Filters>({})

  useEffect(() => {
    fetchCategories()
    fetchProducts()
  }, [])

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('product_categories')
      .select('id, name')
      .order('name')
    
    if (error) {
      console.error('Error fetching categories:', error)
      return
    }
    
    setCategories(data || [])
  }

  const fetchProducts = async (filters: Filters = {}) => {
    try {
      setIsLoading(true)
      let query = supabase
        .from('products')
        .select(`
          *,
          seller:profiles(id, full_name),
          images:product_images(url),
          favorites_count:favorites(count),
          messages_count:messages(count)
        `)
        .eq('status', 'active')

      // Apply filters
      if (filters.query) {
        query = query.ilike('title', `%${filters.query}%`)
      }
      if (filters.category) {
        query = query.eq('category_id', filters.category)
      }
      if (filters.condition) {
        query = query.eq('condition', filters.condition)
      }
      if (filters.minPrice) {
        query = query.gte('price', filters.minPrice)
      }
      if (filters.maxPrice) {
        query = query.lte('price', filters.maxPrice)
      }

      // Apply sorting
      switch (filters.sortBy) {
        case 'oldest':
          query = query.order('created_at', { ascending: true })
          break
        case 'price_asc':
          query = query.order('price', { ascending: true })
          break
        case 'price_desc':
          query = query.order('price', { ascending: false })
          break
        default: // newest
          query = query.order('created_at', { ascending: false })
      }

      const { data, error } = await query

      if (error) throw error

      // Transform the data to match the ProductCard interface
      const transformedData = data.map(product => ({
        ...product,
        favorites_count: product.favorites_count?.[0]?.count || 0,
        messages_count: product.messages_count?.[0]?.count || 0
      }))

      setProducts(transformedData)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (newFilters: Filters) => {
    setFilters(newFilters)
    fetchProducts(newFilters)
  }

  return (
    <div className="container py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">Marketplace</h1>
          <p className="text-muted-foreground">Browse items from your campus community</p>
        </div>
        <Button asChild>
          <Link href="/marketplace/sell">
            <Plus className="mr-2 h-4 w-4" />
            List an Item
          </Link>
        </Button>
      </div>

      <SearchFilters onSearch={handleSearch} categories={categories} />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array(8).fill(0).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-square bg-muted rounded-lg mb-4" />
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onFavorite={() => fetchProducts(filters)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">No items found</h3>
          <p className="text-muted-foreground mt-1">
            Try adjusting your search or filters
          </p>
        </div>
      )}
    </div>
  )
}
