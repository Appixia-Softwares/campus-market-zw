import type React from "react"
import Link from "next/link"

interface Product {
  id: string
  name: string
  description: string
  price: number
  imageUrl: string
}

const products: Product[] = [
  {
    id: "1",
    name: "Awesome T-Shirt",
    description: "A comfortable and stylish t-shirt.",
    price: 25.0,
    imageUrl: "https://via.placeholder.com/150",
  },
  {
    id: "2",
    name: "Cool Mug",
    description: "A mug to keep your drinks warm.",
    price: 15.0,
    imageUrl: "https://via.placeholder.com/150",
  },
  {
    id: "3",
    name: "Fancy Hat",
    description: "A hat to protect you from the sun.",
    price: 30.0,
    imageUrl: "https://via.placeholder.com/150",
  },
]

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  return (
    <div className="border rounded-md p-4 shadow-md">
      <Link href={`/marketplace/products/${product.id}`}>
        <img
          src={product.imageUrl || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-32 object-cover rounded-md mb-2 cursor-pointer"
        />
        <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
        <p className="text-gray-600 mb-2">{product.description}</p>
        <p className="text-green-500 font-bold">${product.price.toFixed(2)}</p>
      </Link>
      <div className="mt-4">
        <Link
          href={`/marketplace/products/${product.id}`}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          View Details
        </Link>
      </div>
    </div>
  )
}

const MarketplacePage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Marketplace</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}

export default MarketplacePage
