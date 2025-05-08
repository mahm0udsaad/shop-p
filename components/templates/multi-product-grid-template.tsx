"use client"

import { useState } from "react"
import { ShoppingCart, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { generateSampleProducts } from "@/utils/product-utils"

interface MultiProductGridTemplateProps {
  product: any
}

export function MultiProductGridTemplate({ product }: MultiProductGridTemplateProps) {
  const [activeCategory, setActiveCategory] = useState("All")

  // Extract data from the product prop
  const {
    storeName = "Tech Gadgets Store",
    storeDescription = "Your one-stop shop for the latest tech gadgets and accessories.",
    color = "#6F4E37",
    accentColor = "#ECB176",
    heroImage = "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
    products = generateSampleProducts(8),
    categories = ["All", "Audio", "Wearables", "Accessories"],
    footerText = "Providing high-quality tech products since 2023.",
    contactAddress = "123 Tech Street, City, State 12345",
    contactEmail = `info@${storeName?.toLowerCase().replace(/\s+/g, "")}.com`,
    contactPhone = "+1 (555) 123-4567",
  } = product || {}

  // Filter products by category
  const filteredProducts =
    activeCategory === "All" ? products : products.filter((p: any) => p.category === activeCategory)

  // Get featured products (first 2)
  const featuredProducts = filteredProducts.slice(0, 2)
  // Get regular products (rest)
  const regularProducts = filteredProducts.slice(2)

  const addToCart = (product: any) => {
    console.log("Add to cart:", product)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900" style={{ color }}>
            {storeName}
          </h1>
          <p className="mt-2 text-gray-600">{storeDescription}</p>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative">
        <div
          className="w-full h-[400px] bg-cover bg-center"
          style={{
            backgroundImage: `url(${heroImage || "/placeholder.svg?key=j7i8u"})`,
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 max-w-3xl">{storeName}</h2>
            <p className="text-xl text-white mb-8 max-w-2xl">{storeDescription}</p>
            <Button size="lg" className="px-8 py-6 text-lg" style={{ backgroundColor: accentColor }}>
              Shop Now
            </Button>
          </div>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="bg-white border-b">
        <div className="mx-auto flex max-w-7xl overflow-x-auto px-4 py-4 sm:px-6 lg:px-8">
          {categories.map((category: string) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`mr-6 whitespace-nowrap px-1 py-2 text-sm font-medium ${
                activeCategory === category ? `border-b-2 text-gray-900` : "text-gray-500 hover:text-gray-700"
              }`}
              style={activeCategory === category ? { borderBottomColor: accentColor, color } : {}}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main>
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Featured Products */}
          {featuredProducts.length > 0 && (
            <div className="mb-12">
              <h2 className="mb-6 text-2xl font-bold">Featured Products</h2>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                {featuredProducts.map((product: any) => (
                  <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="aspect-video relative">
                      <img
                        src={product.image || "/placeholder.svg?height=300&width=400&query=product"}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      {product.isNew && (
                        <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                          NEW
                        </div>
                      )}
                      {product.discount && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                          {product.discount}% OFF
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-bold">{product.name}</h3>
                      {product.rating && (
                        <div className="flex items-center mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                              }`}
                            />
                          ))}
                          <span className="ml-1 text-sm text-gray-600">({product.reviews})</span>
                        </div>
                      )}
                      <p className="mt-2 text-gray-600 line-clamp-2">{product.description}</p>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-lg font-bold" style={{ color: accentColor }}>
                          ${product.price}
                        </span>
                        <Button onClick={() => addToCart(product)} style={{ backgroundColor: accentColor }}>
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Regular Products Grid */}
          <div>
            <h2 className="mb-6 text-2xl font-bold">All Products</h2>
            <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {regularProducts.map((product: any) => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="aspect-square relative">
                    <img
                      src={product.image || "/placeholder.svg?height=300&width=300&query=product"}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    {product.isNew && (
                      <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                        NEW
                      </div>
                    )}
                    {product.discount && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                        {product.discount}% OFF
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-md font-bold">{product.name}</h3>
                    {product.rating && (
                      <div className="flex items-center mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                        <span className="ml-1 text-xs text-gray-600">({product.reviews})</span>
                      </div>
                    )}
                    <div className="mt-2 flex items-center justify-between">
                      <span className="font-bold" style={{ color: accentColor }}>
                        ${product.price}
                      </span>
                      <Button size="sm" variant="outline" onClick={() => addToCart(product)}>
                        <ShoppingCart className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">{storeName}</h3>
              <p className="text-gray-300">{footerText}</p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Contact Us</h3>
              <address className="not-italic text-gray-300">
                <p>{contactAddress}</p>
                <p className="mt-2">Email: {contactEmail}</p>
                <p>Phone: {contactPhone}</p>
              </address>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <a href="#" className="hover:text-white">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Products
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
            <p>
              &copy; {new Date().getFullYear()} {storeName}. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
