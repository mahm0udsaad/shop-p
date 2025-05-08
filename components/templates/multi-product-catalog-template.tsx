"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Search, ShoppingCart, Star, Heart, Menu, Grid, List } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useToast } from "@/hooks/use-toast"
import type { Product } from "@/types/template-types"
import { generateSampleProducts } from "@/utils/product-utils"
import { CartSidebar } from "@/components/templates/shared/cart-sidebar"

interface CartItem extends Product {
  quantity: number
}

// For backward compatibility
export function MultiProductCatalogTemplate({ product }: { product: any }) {
  const { toast } = useToast()
  const [activeCategory, setActiveCategory] = useState("All")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [wishlist, setWishlist] = useState<string[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)

  // Extract data from the product prop
  const {
    storeName = "Tech Gadgets Store",
    storeDescription = "Your one-stop shop for the latest tech gadgets and accessories.",
    color = "#6F4E37",
    accentColor = "#ECB176",
    heroImage = "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
    products = generateSampleProducts(12),
    categories = ["All", "Audio", "Wearables", "Accessories"],
    enableWishlist = true,
    enableCart = true,
    showRatings = true,
  } = product || {}

  // Filter products by category and search
  const filteredProducts = products.filter((p: any) => {
    const matchesCategory = activeCategory === "All" || p.category === activeCategory
    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Calculate cart totals
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      // Check if product already exists in cart
      const existingItemIndex = prevCart.findIndex((item) => item.id === product.id)

      if (existingItemIndex >= 0) {
        // Update quantity of existing item
        const updatedCart = [...prevCart]
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + 1,
        }
        return updatedCart
      } else {
        // Add new item to cart
        return [...prevCart, { ...product, quantity: 1 }]
      }
    })

    // Show success toast
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
      variant: "success",
    })
  }

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId)
      } else {
        toast({
          title: "Added to wishlist",
          description: "This product has been added to your wishlist.",
          variant: "default",
        })
        return [...prev, productId]
      }
    })
  }

  const updateCartItemQuantity = (id: string, quantity: number) => {
    setCart((prevCart) => {
      if (quantity <= 0) {
        return prevCart.filter((item) => item.id !== id)
      }

      return prevCart.map((item) => (item.id === id ? { ...item, quantity } : item))
    })
  }

  const removeFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id))
    toast({
      title: "Removed from cart",
      description: "Item has been removed from your cart.",
      variant: "default",
    })
  }

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Order submitted",
      description: "Your order has been submitted successfully!",
      variant: "success",
    })
    setCart([])
    setIsCartOpen(false)
  }

  // Calculate total price
  const totalPrice = cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0)

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-md">
        <div className="container mx-auto px-4 relative">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Button variant="ghost" size="icon" className="md:hidden mr-2" onClick={() => setIsMobileMenuOpen(true)}>
                <Menu className="h-5 w-5" />
              </Button>
              <Link href="#" className="flex items-center gap-2">
                <span className="font-bold text-xl" style={{ color }}>
                  {storeName}
                </span>
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <Link href="#" className="text-sm font-medium hover:text-primary">
                Home
              </Link>
              <Link href="#products" className="text-sm font-medium hover:text-primary">
                Products
              </Link>
              <Link href="#featured" className="text-sm font-medium hover:text-primary">
                Featured
              </Link>
              <Link href="#about" className="text-sm font-medium hover:text-primary">
                About
              </Link>
              <Link href="#contact" className="text-sm font-medium hover:text-primary">
                Contact
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="pl-10 w-[200px] bg-gray-50 border-gray-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {enableCart && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                  aria-label="Shopping cart"
                  onClick={() => setIsCartOpen(true)}
                >
                  <ShoppingCart className="h-5 w-5" />
                  {totalItems > 0 && (
                    <Badge
                      className="absolute -top-2 -right-2 px-1.5 py-0.5 min-w-[1.25rem] h-5 flex items-center justify-center"
                      style={{ backgroundColor: accentColor }}
                    >
                      {totalItems}
                    </Badge>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left">
          <SheetHeader className="mb-6">
            <SheetTitle className="text-xl" style={{ color }}>
              {storeName}
            </SheetTitle>
          </SheetHeader>
          <div className="space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-10 bg-gray-50 border-gray-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="space-y-3">
              <Link
                href="#"
                className="block py-2 text-base font-medium hover:text-primary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="#products"
                className="block py-2 text-base font-medium hover:text-primary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                href="#featured"
                className="block py-2 text-base font-medium hover:text-primary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Featured
              </Link>
              <Link
                href="#about"
                className="block py-2 text-base font-medium hover:text-primary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="#contact"
                className="block py-2 text-base font-medium hover:text-primary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>
            </div>

            <div className="pt-6 border-t">
              <h3 className="font-medium mb-3">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category} className="flex items-center">
                    <input
                      type="radio"
                      id={`mobile-category-${category}`}
                      name="mobile-category"
                      className="mr-2"
                      checked={activeCategory === category}
                      onChange={() => {
                        setActiveCategory(category)
                        setIsMobileMenuOpen(false)
                      }}
                    />
                    <label htmlFor={`mobile-category-${category}`} className="text-sm capitalize">
                      {category}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-gray-50 to-white py-16 overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
                <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color }}>
                  {storeName}
                </h1>
                <p className="text-xl text-gray-600 mb-8 max-w-xl">{storeDescription}</p>
                <div className="flex flex-wrap gap-4">
                  <Button className="px-6 py-2 text-white" style={{ backgroundColor: accentColor }}>
                    <a href="#products">Browse Catalog</a>
                  </Button>
                  <Button variant="outline" className="px-6 py-2">
                    <a href="#featured">Featured Items</a>
                  </Button>
                </div>
              </div>
              <div className="md:w-1/2 relative">
                <div className="relative rounded-lg overflow-hidden shadow-xl aspect-[4/3]">
                  <img
                    src={heroImage || "/placeholder.svg?height=600&width=800&query=tech gadgets store"}
                    alt="Featured products"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end">
                    <div className="p-6 text-white">
                      <p className="text-sm font-medium mb-2">Featured Collection</p>
                      <h2 className="text-2xl font-bold">New Arrivals 2023</h2>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section id="products" className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Sidebar */}
              <div className="md:w-64 flex-shrink-0">
                <div className="sticky top-24 bg-white rounded-lg border p-4 space-y-6">
                  <h3 className="font-bold text-lg mb-4">Categories</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={`block w-full text-left px-3 py-2 rounded-md text-sm ${
                          activeCategory === category ? "bg-gray-100 font-medium" : "text-gray-600 hover:bg-gray-50"
                        }`}
                        style={activeCategory === category ? { color } : {}}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Products Grid */}
              <div className="flex-1">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold" style={{ color }}>
                    {activeCategory === "All" ? "All Products" : activeCategory}
                    <span className="ml-2 text-sm font-normal text-gray-500">({filteredProducts.length} products)</span>
                  </h2>
                  <div className="flex items-center gap-2">
                    <Button
                      variant={viewMode === "grid" ? "default" : "outline"}
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setViewMode("grid")}
                      style={viewMode === "grid" ? { backgroundColor: accentColor } : {}}
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "outline"}
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setViewMode("list")}
                      style={viewMode === "list" ? { backgroundColor: accentColor } : {}}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {filteredProducts.length > 0 ? (
                  <div
                    className={
                      viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-6"
                    }
                  >
                    {filteredProducts.map((product: any) =>
                      viewMode === "grid" ? (
                        <div
                          key={product.id}
                          className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                        >
                          <div className="relative">
                            <div className="aspect-square overflow-hidden cursor-pointer">
                              <img
                                src={product.image || "/placeholder.svg"}
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            </div>
                            {enableWishlist && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full h-8 w-8"
                                onClick={() => toggleWishlist(product.id)}
                              >
                                <Heart
                                  className={`h-4 w-4 ${wishlist.includes(product.id) ? "fill-red-500 text-red-500" : ""}`}
                                />
                              </Button>
                            )}
                          </div>
                          <div className="p-4">
                            <h3 className="font-medium text-base mb-1 cursor-pointer hover:text-primary transition-colors line-clamp-1">
                              {product.name}
                            </h3>

                            {showRatings && product.rating && (
                              <div className="flex items-center gap-1 mb-2">
                                <div className="flex">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={`h-3 w-3 ${
                                        star <= Math.floor(product.rating || 0)
                                          ? "text-yellow-400 fill-yellow-400"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-xs text-gray-500">({product.reviews || 0})</span>
                              </div>
                            )}

                            <p className="text-gray-600 text-xs mb-3 line-clamp-2">{product.description}</p>

                            <div className="flex justify-between items-center mt-2">
                              <div>
                                {product.discount ? (
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold" style={{ color: accentColor }}>
                                      ${(Number(product.price) * (1 - product.discount / 100)).toFixed(2)}
                                    </span>
                                    <span className="text-xs text-gray-500 line-through">${product.price}</span>
                                  </div>
                                ) : (
                                  <span className="font-bold" style={{ color: accentColor }}>
                                    ${product.price}
                                  </span>
                                )}
                              </div>
                              {enableCart && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8 w-8 p-0"
                                  style={{ borderColor: accentColor, color: accentColor }}
                                  onClick={() => addToCart(product)}
                                >
                                  <ShoppingCart className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div
                          key={product.id}
                          className="flex bg-white rounded-lg overflow-hidden border shadow-sm hover:shadow-md transition-all duration-300"
                        >
                          <div className="w-1/3 aspect-square relative overflow-hidden">
                            <img
                              src={product.image || "/placeholder.svg"}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                            {enableWishlist && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full h-8 w-8"
                                onClick={() => toggleWishlist(product.id)}
                              >
                                <Heart
                                  className={`h-4 w-4 ${wishlist.includes(product.id) ? "fill-red-500 text-red-500" : ""}`}
                                />
                              </Button>
                            )}
                          </div>
                          <div className="w-2/3 p-4">
                            <h3 className="font-medium text-lg mb-1">{product.name}</h3>

                            {showRatings && product.rating && (
                              <div className="flex items-center gap-1 mb-2">
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
                                <span className="text-xs text-gray-500">({product.reviews || 0})</span>
                              </div>
                            )}

                            <p className="text-gray-600 text-sm mb-4">{product.description}</p>

                            <div className="flex justify-between items-center mt-auto">
                              <div>
                                {product.discount ? (
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-lg" style={{ color: accentColor }}>
                                      ${(Number(product.price) * (1 - product.discount / 100)).toFixed(2)}
                                    </span>
                                    <span className="text-sm text-gray-500 line-through">${product.price}</span>
                                  </div>
                                ) : (
                                  <span className="font-bold text-lg" style={{ color: accentColor }}>
                                    ${product.price}
                                  </span>
                                )}
                              </div>
                              {enableCart && (
                                <Button
                                  size="sm"
                                  style={{ backgroundColor: accentColor }}
                                  onClick={() => addToCart(product)}
                                >
                                  Add to Cart
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-500 mb-4">No products found matching your criteria.</p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setActiveCategory("All")
                        setSearchQuery("")
                      }}
                    >
                      Reset Filters
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">{storeName}</h3>
              <p className="text-gray-300 text-sm">Providing high-quality products since 2023.</p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>
                  <a href="#" className="hover:text-white">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#products" className="hover:text-white">
                    Products
                  </a>
                </li>
                <li>
                  <a href="#about" className="hover:text-white">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-white">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">Contact Us</h3>
              <address className="not-italic text-sm text-gray-300 space-y-2">
                <p>123 Store Street</p>
                <p>City, State 12345</p>
                <p>Email: info@techgadgetsstore.com</p>
                <p>Phone: +1 (555) 123-4567</p>
              </address>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">
            <p>
              © {new Date().getFullYear()} {storeName}. All rights reserved.
            </p>
            <p className="mt-1">
              Powered by{" "}
              <span className="font-semibold" style={{ color: accentColor }}>
                Product Showcase
              </span>
            </p>
          </div>
        </div>
      </footer>
      {/* Cart Sidebar */}
      {enableCart && (
        <CartSidebar
          isOpen={isCartOpen}
          setIsOpen={setIsCartOpen}
          cart={cart}
          totalItems={totalItems}
          totalPrice={totalPrice}
          accentColor={accentColor}
          updateCartItemQuantity={updateCartItemQuantity}
          removeFromCart={removeFromCart}
          handleOrderSubmit={handleOrderSubmit}
        />
      )}
    </div>
  )
}
