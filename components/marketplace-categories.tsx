"use client"

import { Button } from "@/components/ui/button"
import { Book, Briefcase, Cpu, Gamepad, Home, Music, ShoppingCart, Shirt, Utensils } from "lucide-react"
import { useState } from "react"

const CATEGORIES = [
  { id: "all", name: "All Items", icon: ShoppingCart },
  { id: "books", name: "Books", icon: Book },
  { id: "electronics", name: "Electronics", icon: Cpu },
  { id: "furniture", name: "Furniture", icon: Home },
  { id: "clothing", name: "Clothing", icon: Shirt },
  { id: "kitchen", name: "Kitchen", icon: Utensils },
  { id: "gaming", name: "Gaming", icon: Gamepad },
  { id: "music", name: "Music", icon: Music },
  { id: "school", name: "School Supplies", icon: Briefcase },
]

export default function MarketplaceCategories() {
  const [activeCategory, setActiveCategory] = useState("all")

  return (
    <div className="flex overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide">
      <div className="flex gap-2">
        {CATEGORIES.map((category) => {
          const Icon = category.icon
          return (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "outline"}
              className={`flex-shrink-0 transition-all ${
                activeCategory === category.id ? "bg-primary text-primary-foreground" : "hover:border-primary/50"
              }`}
              onClick={() => setActiveCategory(category.id)}
            >
              <Icon className="h-4 w-4 mr-2" />
              {category.name}
            </Button>
          )
        })}
      </div>
    </div>
  )
}
