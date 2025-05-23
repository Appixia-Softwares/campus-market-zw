"use client"

import { motion } from "framer-motion"
import { ArrowRight, Star } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const products = [
  {
    id: 1,
    name: "Calculus Textbook",
    price: "ZWL 15,000",
    condition: "Like New",
    image: "/placeholder.svg?height=200&width=200",
    category: "Books",
    rating: 4.8,
  },
  {
    id: 2,
    name: "HP Laptop",
    price: "ZWL 250,000",
    condition: "Good",
    image: "/placeholder.svg?height=200&width=200",
    category: "Electronics",
    rating: 4.5,
  },
  {
    id: 3,
    name: "Scientific Calculator",
    price: "ZWL 8,000",
    condition: "Excellent",
    image: "/placeholder.svg?height=200&width=200",
    category: "Electronics",
    rating: 4.9,
  },
  {
    id: 4,
    name: "Engineering Notes",
    price: "ZWL 5,000",
    condition: "New",
    image: "/placeholder.svg?height=200&width=200",
    category: "Books",
    rating: 4.7,
  },
]

export default function ProductShowcase() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <motion.h3
          className="text-2xl font-bold relative"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-gradient">Student Marketplace</span>
          <motion.div
            className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-green-600 to-green-300 rounded-full"
            initial={{ width: 0 }}
            whileInView={{ width: "100%" }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
          />
        </motion.h3>
        <Link href="/marketplace">
          <Button variant="ghost" className="gap-2 group">
            View all
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>

      <motion.div
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            variants={item}
            whileHover={{
              y: -10,
              transition: { duration: 0.3 },
            }}
            className="card-hover-effect"
          >
            <Card className="h-full overflow-hidden transition-all border-green-100 dark:border-green-900 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-transparent dark:from-green-950/30 dark:to-transparent opacity-60 z-0"></div>
              <div className="aspect-square overflow-hidden image-hover-zoom relative">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-4"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                >
                  <span className="text-white font-medium">View Details</span>
                </motion.div>
              </div>
              <CardHeader className="p-4 pb-0 relative">
                <div className="flex justify-between">
                  <Badge
                    variant="outline"
                    className="bg-green-100/50 dark:bg-green-900/50 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800"
                  >
                    {product.category}
                  </Badge>
                  <Badge variant="secondary" className="bg-green-500/10 text-green-700 dark:text-green-300">
                    {product.condition}
                  </Badge>
                </div>
                <CardTitle className="line-clamp-1 text-lg mt-2">{product.name}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-2 relative">
                <div className="flex items-center gap-1 mb-1">
                  <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm text-muted-foreground">{product.rating}</span>
                </div>
                <p className="font-bold text-green-600 dark:text-green-400">{product.price}</p>
              </CardContent>
              <CardFooter className="p-4 pt-0 relative">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/50 hover:text-green-700 dark:hover:text-green-300"
                >
                  View Details
                </Button>
              </CardFooter>

              {/* Decorative corner */}
              <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-green-500 rotate-45 translate-x-8 -translate-y-8"></div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
