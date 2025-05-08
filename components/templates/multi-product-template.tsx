"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import {
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  Filter,
  Search,
  ShoppingBag,
  ShoppingCart,
  X,
  Plus,
  Minus,
  Star,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import type { MultiProductTemplateProps, Product } from "@/types/template-types"
import { ProductCard } from "./shared/product-card"
import { generateSampleProducts } from "@/utils/product-utils"

interface CartItem extends Product {
  quantity: number
}

interface OrderFormData {
  name: string
  email: string
  phone: string
  address: string
  message: string
}

// For backward compatibility
export function MultiProductTemplate({ product }: { product: any }) {
  const [activeCategory, setActiveCategory] = useState("All")

  // Extract data from the product prop
  const {
    storeName = "Tech Gadgets Store",
    storeDescription = "Your one-stop shop for the latest tech gadgets and accessories.",
    color = "#6F4E37",
    accentColor = "#ECB176",
    heroImage = "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
    products = generateSampleProducts(6),
    categories = ["All", "Audio", "Wearables", "Accessories"],
  } = product || {}

  // Filter products by category
  const filteredProducts =
    activeCategory === "All" ? products : products.filter((p: any) => p.category === activeCategory)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div
        className="relative h-80 w-full bg-cover bg-center"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundColor: color,
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center text-white">
          <h1 className="text-4xl font-bold">{storeName}</h1>
          <p className="mt-4 max-w-xl text-lg">{storeDescription}</p>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="sticky top-0 z-20 bg-white shadow">
        <div className="mx-auto flex max-w-7xl overflow-x-auto px-4 py-4 sm:px-6 lg:px-8">
          {categories.map((category: string) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`mr-6 whitespace-nowrap px-1 py-2 text-sm font-medium ${
                activeCategory === category
                  ? `border-b-2 border-${accentColor} text-gray-900`
                  : "text-gray-500 hover:text-gray-700"
              }`}
              style={activeCategory === category ? { borderBottomColor: accentColor, color: color } : {}}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {filteredProducts.map((product: any) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={(p) => console.log("Added to cart:", p.name)}
            />
          ))}
        </div>
      </div>
    </div>
  )
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
  const [orderFormData, setOrderFormData] = useState<OrderFormData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    message: "",
  })
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [cart, setCart] = useState<CartItem[]>([])
  const [totalItems, setTotalItems] = useState(0)
  const [totalPrice, setTotalPrice] = useState(0)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isProductDetailOpen, setIsProductDetailOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "order">("cart")
  const [orderNote, setOrderNote] = useState("")

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

  const handleCheckout = () => {
    setCheckoutStep("order")
  }

  const handleBackToCart = () => {
    setCheckoutStep("cart")
  }

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would send the order data to a server
    console.log("Order submitted:", {
      customer: orderFormData,
      items: cart,
      totalPrice: totalPrice.toFixed(2),
      note: orderNote,
    })

    setIsCartOpen(false)
    // Reset form and cart
    setOrderFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      message: "",
    })
    setOrderNote("")
    setCart([])
    setCheckoutStep("cart")

    // Show success toast
    toast({
      title: "Order placed successfully!",
      description: "Thank you for your order. We will contact you soon.",
      variant: "success",
    })
  }

  const openProductDetail = (product: Product) => {
    setSelectedProduct(product)
    setCurrentImageIndex(0)
    setIsProductDetailOpen(true)
  }

  const nextImage = () => {
    if (selectedProduct?.gallery) {
      setCurrentImageIndex((prev) => (prev + 1) % selectedProduct.gallery!.length)
    }
  }

  const prevImage = () => {
    if (selectedProduct?.gallery) {
      setCurrentImageIndex((prev) => (prev - 1 + selectedProduct.gallery!.length) % selectedProduct.gallery!.length)
    }
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
                    Category <ChevronDown className="h-4 w-4" />
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
                {filteredProducts.map((prod) => (
                  <div
                    key={prod.id}
                    className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div
                      className="aspect-square bg-gray-100 relative overflow-hidden cursor-pointer"
                      onClick={() => openProductDetail(prod)}
                    >
                      <img
                        src={prod.image || "/placeholder.svg"}
                        alt={prod.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all flex items-center justify-center opacity-0 hover:opacity-100">
                        <Button variant="secondary" size="sm" className="gap-1">
                          <Eye className="h-4 w-4" /> View Details
                        </Button>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3
                        className="font-bold text-lg mb-1 cursor-pointer hover:text-primary transition-colors"
                        onClick={() => openProductDetail(prod)}
                      >
                        {prod.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">{prod.description}</p>

                      {/* Rating */}
                      {showRatings && prod.rating && (
                        <div className="flex items-center gap-1 mb-3">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= Math.floor(prod.rating || 0)
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-500">({prod.reviews || 0} reviews)</span>
                        </div>
                      )}

                      <div className="flex justify-between items-center mt-4">
                        <span className="font-bold text-lg" style={{ color: accentColor }}>
                          ${prod.price}
                        </span>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => openProductDetail(prod)}>
                            Details
                          </Button>
                          {enableCart && (
                            <Button onClick={() => addToCart(prod)} style={{ backgroundColor: accentColor }} size="sm">
                              Add to Cart
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
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
                      <Label htmlFor="contact-name">Your Name</Label>
                      <Input id="contact-name" placeholder="John Doe" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact-email">Email Address</Label>
                      <Input id="contact-email" type="email" placeholder="john@example.com" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-subject">Subject</Label>
                    <Input id="contact-subject" placeholder="How can we help you?" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-message">Message</Label>
                    <Textarea id="contact-message" placeholder="Your message here..." className="min-h-[120px]" />
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
        <Sheet
          open={isCartOpen}
          onOpenChange={(open) => {
            if (!open) {
              // Reset to cart view when closing
              setCheckoutStep("cart")
            }
            setIsCartOpen(open)
          }}
        >
          <SheetContent className="w-full sm:max-w-md flex flex-col">
            <div className="flex-1 flex flex-col">
              {/* Cart View */}
              <div
                className={`flex-1 flex flex-col transition-all duration-300 transform ${
                  checkoutStep === "cart"
                    ? "translate-x-0 opacity-100"
                    : "-translate-x-full opacity-0 absolute inset-0 pointer-events-none"
                }`}
              >
                <SheetHeader>
                  <SheetTitle className="text-xl flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    Your Cart
                  </SheetTitle>
                  <SheetDescription>
                    {totalItems === 0
                      ? "Your cart is empty"
                      : `${totalItems} item${totalItems !== 1 ? "s" : ""} in your cart`}
                  </SheetDescription>
                </SheetHeader>

                {cart.length > 0 ? (
                  <>
                    <ScrollArea className="flex-1 my-4 pr-4">
                      <div className="space-y-4">
                        {cart.map((item) => (
                          <div key={item.id} className="flex gap-4 py-3 border-b">
                            <div className="w-20 h-20 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                              <img
                                src={item.image || "/placeholder.svg"}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium">{item.name}</h4>
                              <p className="text-sm text-gray-500 mb-2">${item.price}</p>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-8 text-center">{item.quantity}</span>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 ml-auto"
                                  onClick={() => removeFromCart(item.id)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>

                    <SheetFooter className="border-t pt-4">
                      <div className="w-full space-y-4">
                        <div className="flex justify-between font-medium text-lg">
                          <span>Total:</span>
                          <span>${totalPrice.toFixed(2)}</span>
                        </div>
                        <Button className="w-full" style={{ backgroundColor: accentColor }} onClick={handleCheckout}>
                          Proceed to Checkout
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </SheetFooter>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center gap-4 py-8">
                    <ShoppingBag className="h-16 w-16 text-gray-300" />
                    <p className="text-gray-500">Your cart is empty</p>
                    <SheetClose asChild>
                      <Button variant="outline">Continue Shopping</Button>
                    </SheetClose>
                  </div>
                )}
              </div>

              {/* Order Form View */}
              <div
                className={`flex-1 flex flex-col transition-all duration-300 transform ${
                  checkoutStep === "order"
                    ? "translate-x-0 opacity-100"
                    : "translate-x-full opacity-0 absolute inset-0 pointer-events-none"
                }`}
              >
                <SheetHeader>
                  <div className="flex items-center">
                    <Button variant="ghost" size="sm" className="mr-2 -ml-2" onClick={handleBackToCart}>
                      <ArrowLeft className="h-4 w-4 mr-1" />
                      Back
                    </Button>
                    <SheetTitle className="text-xl">Complete Your Order</SheetTitle>
                  </div>
                  <SheetDescription>
                    {`You're ordering ${totalItems} item${totalItems !== 1 ? "s" : ""} for $${totalPrice.toFixed(2)}`}
                  </SheetDescription>
                </SheetHeader>

                <ScrollArea className="flex-1 pr-4 mt-4">
                  <form onSubmit={handleOrderSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="order-name">Full Name</Label>
                      <Input
                        id="order-name"
                        placeholder="John Doe"
                        value={orderFormData.name}
                        onChange={(e) => setOrderFormData({ ...orderFormData, name: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="order-email">Email Address</Label>
                      <Input
                        id="order-email"
                        type="email"
                        placeholder="john@example.com"
                        value={orderFormData.email}
                        onChange={(e) => setOrderFormData({ ...orderFormData, email: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="order-phone">Phone Number</Label>
                      <Input
                        id="order-phone"
                        placeholder="+1 (555) 123-4567"
                        value={orderFormData.phone}
                        onChange={(e) => setOrderFormData({ ...orderFormData, phone: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="order-address">Shipping Address</Label>
                      <Textarea
                        id="order-address"
                        placeholder="123 Main St, City, State, 12345"
                        value={orderFormData.address}
                        onChange={(e) => setOrderFormData({ ...orderFormData, address: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="order-note">Additional Notes (Optional)</Label>
                      <Textarea
                        id="order-note"
                        placeholder="Any special requests or questions?"
                        value={orderNote}
                        onChange={(e) => setOrderNote(e.target.value)}
                        className="min-h-[100px]"
                      />
                    </div>

                    <div className="bg-gray-50 p-4 rounded-md space-y-3 mt-4">
                      <h4 className="font-medium">Order Summary</h4>
                      {cart.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span>
                            {item.quantity}x {item.name}
                          </span>
                          <span>${(Number.parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                      <div className="border-t pt-2 mt-2 flex justify-between font-medium">
                        <span>Total:</span>
                        <span>${totalPrice.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="pt-4">
                      <Button type="submit" className="w-full" style={{ backgroundColor: accentColor }}>
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        Place Order
                      </Button>
                    </div>
                  </form>
                </ScrollArea>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      )}

      {/* Product Detail Modal */}
      <Dialog open={isProductDetailOpen} onOpenChange={setIsProductDetailOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0">
          <ScrollArea className="flex-1">
            <div className="p-6">
              {selectedProduct && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Product Images */}
                  <div className="space-y-4">
                    <div className="relative aspect-square bg-gray-100 rounded-md overflow-hidden border">
                      <img
                        src={selectedProduct.gallery?.[currentImageIndex] || selectedProduct.image}
                        alt={selectedProduct.name}
                        className="w-full h-full object-cover"
                      />

                      {selectedProduct.gallery && selectedProduct.gallery.length > 1 && (
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
                    {selectedProduct.gallery && selectedProduct.gallery.length > 1 && (
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {selectedProduct.gallery.map((img, index) => (
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
                              alt={`${selectedProduct.name} - view ${index + 1}`}
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
                      <h2 className="text-2xl font-bold">{selectedProduct.name}</h2>
                      <div className="flex items-center gap-2 mt-2">
                        {showRatings && selectedProduct.rating && (
                          <>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-4 w-4 ${
                                    star <= Math.floor(selectedProduct.rating || 0)
                                      ? "text-yellow-400 fill-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-500">
                              {selectedProduct.rating} ({selectedProduct.reviews} reviews)
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <div>
                      <span className="text-3xl font-bold" style={{ color: accentColor }}>
                        ${selectedProduct.price}
                      </span>
                      <p className="text-sm text-gray-500 mt-1">Free shipping on all orders</p>
                    </div>

                    <div>
                      <p className="text-gray-700">{selectedProduct.description}</p>
                    </div>

                    <Tabs defaultValue="features" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="features">Features</TabsTrigger>
                        <TabsTrigger value="specifications">Specifications</TabsTrigger>
                      </TabsList>
                      <TabsContent value="features" className="pt-4">
                        {selectedProduct.features && (
                          <ul className="space-y-2">
                            {selectedProduct.features.map((feature, index) => (
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
                        {selectedProduct.specifications && (
                          <div className="space-y-2">
                            {Object.entries(selectedProduct.specifications).map(([key, value], index) => (
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
                        <Button
                          className="flex-1"
                          style={{ backgroundColor: accentColor }}
                          onClick={() => {
                            addToCart(selectedProduct)
                            setIsProductDetailOpen(false)
                            setIsCartOpen(true)
                          }}
                        >
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          Add to Cart
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        onClick={() => {
                          if (enableCart) {
                            addToCart(selectedProduct)
                          } else {
                            // Open inquiry form or other action
                            setIsProductDetailOpen(false)
                            const contactSection = document.getElementById("contact")
                            if (contactSection) {
                              contactSection.scrollIntoView({ behavior: "smooth" })
                            }
                          }
                        }}
                      >
                        {enableCart ? "Buy Now" : "Inquire"}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  )
}
