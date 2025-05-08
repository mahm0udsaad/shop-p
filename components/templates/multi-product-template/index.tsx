"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Filter, Search, ShoppingCart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"

import { ProductCard } from "../shared/product-card"
import { CartSidebar } from "../shared/cart-sidebar"
import { ProductDetailModal } from "../shared/product-detail-modal"
import { convertLegacyProductData } from "@/utils/product-utils"
import type { MultiProductTemplateProps, Product, ProductData } from "@/types/template-types"

interface CartItem extends Product {
  quantity: number
}

// For backward compatibility
export function MultiProductTemplate({ product }: { product: ProductData }) {
  return <MultiProductTemplateNew {...convertLegacyProductData(product)} />
}

// New component using standardized props
export function MultiProductTemplateNew({
  storeName,
  storeDescription,
  color,
  accentColor,
  products,
  categories: providedCategories,
  heroImage,
  enableCart = true,
  enableSearch = true,
  showRatings = true,
  contactEmail,
  contactPhone,
  contactAddress,
  footerText,
}: MultiProductTemplateProps) {
  const { toast } = useToast()
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [cart, setCart] = useState<CartItem[]>([])
  const [totalItems, setTotalItems] = useState(0)
  const [totalPrice, setTotalPrice] = useState(0)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isProductDetailOpen, setIsProductDetailOpen] = useState(false)

  // Extract unique categories from products
  const allCategories = ["all", ...new Set(products.map((p) => p.category))]
  const categories = providedCategories || allCategories

  // Filter products based on selected category and search query
  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === "all" || p.category === selectedCategory
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Calculate cart totals
  useEffect(() => {
    const items = cart.reduce((sum, item) => sum + item.quantity, 0)
    const price = cart.reduce((sum, item) => sum + Number.parseFloat(item.price) * item.quantity, 0)

    setTotalItems(items)
    setTotalPrice(price)
  }, [cart])

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

  const updateCartItemQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(id)
      return
    }

    setCart((prevCart) => prevCart.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
  }

  const removeFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id))
  }

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would send the order data to a server
    console.log("Order submitted:", {
      items: cart,
      totalPrice: totalPrice.toFixed(2),
    })

    setIsCartOpen(false)
    // Reset cart
    setCart([])

    // Show success toast
    toast({
      title: "Order placed successfully!",
      description: "Thank you for your order. We will contact you soon.",
      variant: "success",
    })
  }

  const openProductDetail = (product: Product) => {
    setSelectedProduct(product)
    setIsProductDetailOpen(true)
  }

  return (
    <div className="flex flex-col min-h-full bg-white">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xl" style={{ color }}>
                  {storeName}
                </span>
              </div>
              <Button variant="outline" size="icon" className="md:hidden">
                <Filter className="h-4 w-4" />
              </Button>
            </div>

            {enableSearch && (
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search products..."
                    className="pl-8 bg-white"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="flex items-center gap-4">
              <nav className="hidden md:flex items-center gap-6">
                <Link href="#" className="text-sm font-medium hover:text-primary transition-colors">
                  Home
                </Link>
                <Link href="#products" className="text-sm font-medium hover:text-primary transition-colors">
                  Products
                </Link>
                <Link href="#about" className="text-sm font-medium hover:text-primary transition-colors">
                  About
                </Link>
                <Link href="#contact" className="text-sm font-medium hover:text-primary transition-colors">
                  Contact
                </Link>
              </nav>

              {/* Cart Button */}
              {enableCart && (
                <Button variant="outline" size="icon" className="relative" onClick={() => setIsCartOpen(true)}>
                  <ShoppingCart className="h-4 w-4" />
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

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-gray-50 to-gray-100 py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ color }}>
                {storeName}
              </h1>
              <p className="text-lg text-gray-600 mb-8">{storeDescription}</p>
              <Button className="px-8 py-6 text-lg" style={{ backgroundColor: accentColor, color: "white" }}>
                <a href="#products">Browse Products</a>
              </Button>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section id="products" className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8 text-center" style={{ color }}>
              Our Products
            </h2>

            {/* Category Filter */}
            <div className="flex flex-wrap justify-center mb-8 gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild className="md:hidden">
                  <Button variant="outline" className="flex items-center gap-1">
                    Category
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {categories.map((category) => (
                    <DropdownMenuItem
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={selectedCategory === category ? "bg-muted" : ""}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="hidden md:flex flex-wrap justify-center gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category)}
                    style={selectedCategory === category ? { backgroundColor: accentColor, color: "white" } : {}}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    accentColor={accentColor}
                    showRatings={showRatings}
                    enableCart={enableCart}
                    onAddToCart={addToCart}
                    onViewDetails={openProductDetail}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No products found matching your criteria.</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSelectedCategory("all")
                    setSearchQuery("")
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-center" style={{ color }}>
                About Us
              </h2>
              <p className="text-gray-600 mb-4">
                Welcome to {storeName}, where quality meets affordability. We pride ourselves on offering a curated
                selection of products that enhance your everyday life.
              </p>
              <p className="text-gray-600 mb-4">
                Our mission is to provide exceptional products with outstanding customer service. We carefully select
                each item in our inventory to ensure it meets our high standards of quality and value.
              </p>
              <p className="text-gray-600">
                Whether you're looking for the latest tech gadgets, comfortable clothing, or stylish home accessories,
                we have something for everyone. Browse our collection and discover products that make a difference.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-center" style={{ color }}>
                Contact Us
              </h2>
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700">
                        Your Name
                      </label>
                      <Input id="contact-name" placeholder="John Doe" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700">
                        Email Address
                      </label>
                      <Input id="contact-email" type="email" placeholder="john@example.com" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="contact-subject" className="block text-sm font-medium text-gray-700">
                      Subject
                    </label>
                    <Input id="contact-subject" placeholder="How can we help you?" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="contact-message" className="block text-sm font-medium text-gray-700">
                      Message
                    </label>
                    <textarea
                      id="contact-message"
                      placeholder="Your message here..."
                      className="min-h-[120px] w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <Button type="submit" style={{ backgroundColor: accentColor }}>
                    Send Message
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">{storeName}</h3>
              <p className="text-gray-300 text-sm">{footerText || "Providing high-quality products since 2023."}</p>
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
                {contactAddress && <p>{contactAddress}</p>}
                {!contactAddress && (
                  <>
                    <p>123 Store Street</p>
                    <p>City, State 12345</p>
                  </>
                )}
                <p>Email: {contactEmail || `info@${storeName.toLowerCase().replace(/\s+/g, "")}.com`}</p>
                <p>Phone: {contactPhone || "+1 (555) 123-4567"}</p>
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

      {/* Product Detail Modal */}
      <ProductDetailModal
        isOpen={isProductDetailOpen}
        setIsOpen={setIsProductDetailOpen}
        product={selectedProduct}
        accentColor={accentColor}
        showRatings={showRatings}
        enableCart={enableCart}
        onAddToCart={addToCart}
      />
    </div>
  )
}
