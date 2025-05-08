"use client"

import { ShoppingCart, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Product } from "@/types/template-types"

interface ProductCardProps {
  product: Product
  variant?: "default" | "featured"
  onAddToCart: (product: Product) => void
}

export function ProductCard({ product, variant = "default", onAddToCart }: ProductCardProps) {
  const { name, description, price, image, rating, reviews, isNew, discount } = product

  if (variant === "featured") {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="aspect-video relative">
          <img
            src={image || "/placeholder.svg?height=300&width=400&query=product"}
            alt={name}
            className="w-full h-full object-cover"
          />
          {isNew && (
            <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">NEW</div>
          )}
          {discount && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              {discount}% OFF
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-bold">{name}</h3>
          {rating && (
            <div className="flex items-center mt-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < Math.floor(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                />
              ))}
              <span className="ml-1 text-sm text-gray-600">({reviews})</span>
            </div>
          )}
          <p className="mt-2 text-gray-600 line-clamp-2">{description}</p>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-lg font-bold text-primary">${price}</span>
            <Button onClick={() => onAddToCart(product)}>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-square relative">
        <img
          src={image || "/placeholder.svg?height=300&width=300&query=product"}
          alt={name}
          className="w-full h-full object-cover"
        />
        {isNew && (
          <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">NEW</div>
        )}
        {discount && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            {discount}% OFF
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-md font-bold">{name}</h3>
        {rating && (
          <div className="flex items-center mt-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${i < Math.floor(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
              />
            ))}
            <span className="ml-1 text-xs text-gray-600">({reviews})</span>
          </div>
        )}
        <div className="mt-2 flex items-center justify-between">
          <span className="font-bold text-primary">${price}</span>
          <Button size="sm" variant="outline" onClick={() => onAddToCart(product)}>
            <ShoppingCart className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  )
}
