"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, ShoppingCart, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Product } from "@/types/template-types"

interface ProductDetailModalProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  product: Product | null
  accentColor: string
  showRatings?: boolean
  enableCart?: boolean
  onAddToCart?: (product: Product) => void
}

export function ProductDetailModal({
  isOpen,
  setIsOpen,
  product,
  accentColor,
  showRatings = true,
  enableCart = true,
  onAddToCart,
}: ProductDetailModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const nextImage = () => {
    if (product?.gallery) {
      setCurrentImageIndex((prev) => (prev + 1) % product.gallery!.length)
    }
  }

  const prevImage = () => {
    if (product?.gallery) {
      setCurrentImageIndex((prev) => (prev - 1 + product.gallery!.length) % product.gallery!.length)
    }
  }

  const handleAddToCart = () => {
    if (product && onAddToCart) {
      onAddToCart(product)
      setIsOpen(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0">
        <ScrollArea className="flex-1">
          <div className="p-6">
            {product && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Product Images */}
                <div className="space-y-4">
                  <div className="relative aspect-square bg-gray-100 rounded-md overflow-hidden border">
                    <img
                      src={product.gallery?.[currentImageIndex] || product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />

                    {product.gallery && product.gallery.length > 1 && (
                      <>
                        <Button
                          variant="secondary"
                          size="icon"
                          className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/80 hover:bg-white"
                          onClick={prevImage}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="secondary"
                          size="icon"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/80 hover:bg-white"
                          onClick={nextImage}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>

                  {/* Thumbnail Gallery */}
                  {product.gallery && product.gallery.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {product.gallery.map((img, index) => (
                        <div
                          key={index}
                          className={`w-16 h-16 rounded-md overflow-hidden border cursor-pointer ${
                            currentImageIndex === index ? "ring-2 ring-offset-2" : ""
                          }`}
                          style={{
                            ringColor: currentImageIndex === index ? accentColor : "transparent",
                          }}
                          onClick={() => setCurrentImageIndex(index)}
                        >
                          <img
                            src={img || "/placeholder.svg"}
                            alt={`${product.name} - view ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="space-y-6">
                  <div>
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                      <h2 className="text-2xl font-bold">{product.name}</h2>
                      {product.discount ? (
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-2xl" style={{ color: accentColor }}>
                            ${(Number(product.price) * (1 - product.discount / 100)).toFixed(2)}
                          </span>
                          <span className="text-lg text-gray-500 line-through">${product.price}</span>
                        </div>
                      ) : (
                        <span className="font-bold text-2xl" style={{ color: accentColor }}>
                          ${product.price}
                        </span>
                      )}
                    </div>

                    {showRatings && product.rating && (
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= Math.floor(product.rating || 0)
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">
                          {product.rating} ({product.reviews} reviews)
                        </span>
                      </div>
                    )}
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mt-1">Free shipping on all orders</p>
                  </div>

                  <div>
                    <p className="text-gray-700">{product.description}</p>
                  </div>

                  {/* Color and Size selectors would go here */}

                  <Tabs defaultValue="features" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="features">Features</TabsTrigger>
                      <TabsTrigger value="specifications">Specifications</TabsTrigger>
                    </TabsList>
                    <TabsContent value="features" className="pt-4">
                      {product.features && (
                        <ul className="space-y-2">
                          {product.features.map((feature, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <div className="rounded-full bg-green-100 p-1 mt-0.5">
                                <svg
                                  className="h-3 w-3 text-green-600"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              </div>
                              <span className="text-gray-700">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </TabsContent>
                    <TabsContent value="specifications" className="pt-4">
                      {product.specifications && (
                        <div className="space-y-2">
                          {Object.entries(product.specifications).map(([key, value], index) => (
                            <div key={index} className="grid grid-cols-2 py-2 border-b last:border-0">
                              <span className="font-medium text-gray-600">{key}</span>
                              <span className="text-gray-700">{value}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>

                  <div className="pt-4 flex gap-4">
                    {enableCart && (
                      <Button className="flex-1" style={{ backgroundColor: accentColor }} onClick={handleAddToCart}>
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Add to Cart
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      onClick={() => {
                        if (enableCart && onAddToCart && product) {
                          onAddToCart(product)
                        }
                        // Close the modal
                        setIsOpen(false)
                      }}
                    >
                      {enableCart ? "Buy Now" : "Close"}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
