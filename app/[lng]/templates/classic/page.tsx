import Image from "next/image"
import { Check, ChevronRight, Star } from "lucide-react"
import { Heart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

export default function ClassicTemplate() {
  // This would normally be fetched from a database
  const product = {
    name: "Premium Wireless Headphones",
    price: 99.99,
    description:
      "Experience crystal-clear sound with our Premium Wireless Headphones. Featuring the latest Bluetooth technology, active noise cancellation, and up to 30 hours of battery life.",
    longDescription:
      "Our Premium Wireless Headphones are designed for audiophiles who demand the best sound quality without the hassle of wires. The advanced 40mm drivers deliver rich, detailed audio across all frequencies, while the active noise cancellation technology blocks out ambient noise so you can focus on your music.\n\nWith up to 30 hours of battery life, you can enjoy your favorite tracks all day long. The comfortable over-ear design with memory foam ear cushions ensures comfort even during extended listening sessions. The built-in microphone allows for clear calls, and the intuitive touch controls make it easy to adjust volume, skip tracks, or answer calls.",
    features: [
      "Active Noise Cancellation",
      "30-hour Battery Life",
      "Bluetooth 5.2",
      "Comfortable Over-ear Design",
      "Built-in Microphone",
      'Quick Charge (5 min charge = 3 hours playback)",arge = 3 hours playback)',
    ],
    specifications: [
      { name: "Driver Size", value: "40mm" },
      { name: "Frequency Response", value: "20Hz - 20kHz" },
      { name: "Impedance", value: "32 Ohm" },
      { name: "Battery Life", value: "Up to 30 hours" },
      { name: "Charging Time", value: "2 hours" },
      { name: "Weight", value: "250g" },
    ],
    rating: 4.8,
    reviews: 124,
    images: [
      "/placeholder.svg?height=800&width=800",
      "/placeholder.svg?height=800&width=800",
      "/placeholder.svg?height=800&width=800",
      "/placeholder.svg?height=800&width=800",
    ],
    colors: [
      { name: "Black", value: "#000000" },
      { name: "Silver", value: "#C0C0C0" },
      { name: "Navy Blue", value: "#000080" },
    ],
    relatedProducts: [
      {
        id: 1,
        name: "Wireless Earbuds Pro",
        price: 79.99,
        image: "/placeholder.svg?height=400&width=400",
        rating: 4.6,
      },
      {
        id: 2,
        name: "Premium Headphone Stand",
        price: 29.99,
        image: "/placeholder.svg?height=400&width=400",
        rating: 4.9,
      },
      {
        id: 3,
        name: "Replacement Ear Cushions",
        price: 19.99,
        image: "/placeholder.svg?height=400&width=400",
        rating: 4.7,
      },
    ],
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2 font-bold text-xl">
            <span className="text-orange-600">Classic</span>
            <span>Store</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-sm font-medium hover:text-orange-600 transition-colors">
              Home
            </a>
            <a href="#" className="text-sm font-medium hover:text-orange-600 transition-colors">
              Shop
            </a>
            <a href="#" className="text-sm font-medium hover:text-orange-600 transition-colors">
              Categories
            </a>
            <a href="#" className="text-sm font-medium hover:text-orange-600 transition-colors">
              Contact
            </a>
          </nav>
          <div className="flex items-center gap-4">
            <a href="#order-form" className="text-sm font-medium hover:text-orange-600 transition-colors">
              Order Now
            </a>
          </div>
        </div>
      </header>

      <div className="container px-4 py-4">
        <nav className="flex items-center text-sm text-gray-500">
          <a href="#" className="hover:text-orange-600 transition-colors">
            Home
          </a>
          <ChevronRight className="h-4 w-4 mx-1" />
          <a href="#" className="hover:text-orange-600 transition-colors">
            Electronics
          </a>
          <ChevronRight className="h-4 w-4 mx-1" />
          <a href="#" className="hover:text-orange-600 transition-colors">
            Headphones
          </a>
          <ChevronRight className="h-4 w-4 mx-1" />
          <span className="text-gray-900">{product.name}</span>
        </nav>
      </div>

      <main className="flex-1 py-8">
        <div className="container px-4">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="overflow-hidden rounded-lg border shadow-md">
                <Image
                  src={product.images[0] || "/placeholder.svg"}
                  alt={product.name}
                  width={800}
                  height={800}
                  className="aspect-square w-full object-cover"
                />
              </div>
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <div
                    key={index}
                    className={`overflow-hidden rounded-lg border ${index === 0 ? "ring-2 ring-orange-600" : ""} cursor-pointer transition-all hover:opacity-80`}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} - View ${index + 1}`}
                      width={200}
                      height={200}
                      className="aspect-square w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold">{product.name}</h1>
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>
              </div>

              <div>
                <p className="text-3xl font-bold text-orange-600">${product.price.toFixed(2)}</p>
                <p className="text-sm text-green-600">In Stock - Free shipping on orders over $50</p>
              </div>

              <div className="space-y-2">
                <p className="text-gray-600">{product.description}</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="color">Color</Label>
                  <div className="flex gap-2">
                    {product.colors.map((color, index) => (
                      <div
                        key={index}
                        className={`h-10 w-10 rounded-full cursor-pointer border-2 ${index === 0 ? "border-orange-600" : "border-transparent"}`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input id="quantity" type="number" defaultValue="1" min="1" className="mt-1" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="size">Size</Label>
                    <Select defaultValue="standard">
                      <SelectTrigger id="size">
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="compact">Compact</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button className="flex-1 gap-2 bg-orange-600 hover:bg-orange-700">
                    <a href="#order-form">Request Information</a>
                  </Button>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t">
                <h3 className="font-semibold">Key Features</h3>
                <ul className="grid gap-1">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-orange-600 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-12">
            <Tabs defaultValue="description" className="rounded-lg shadow-sm border">
              <TabsList className="w-full justify-start border-b rounded-none bg-transparent">
                <TabsTrigger
                  value="description"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-orange-600 data-[state=active]:text-orange-600 rounded-none"
                >
                  Description
                </TabsTrigger>
                <TabsTrigger
                  value="specifications"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-orange-600 data-[state=active]:text-orange-600 rounded-none"
                >
                  Specifications
                </TabsTrigger>
                <TabsTrigger
                  value="reviews"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-orange-600 data-[state=active]:text-orange-600 rounded-none"
                >
                  Reviews
                </TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="p-6">
                <p className="whitespace-pre-line text-gray-600">{product.longDescription}</p>
              </TabsContent>
              <TabsContent value="specifications" className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.specifications.map((spec, index) => (
                    <div key={index} className="flex justify-between py-2 border-b">
                      <span className="font-medium">{spec.name}</span>
                      <span className="text-gray-600">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="reviews" className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="text-5xl font-bold">{product.rating}</div>
                    <div>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-gray-500">Based on {product.reviews} reviews</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Sample review */}
                    <div className="border-b pb-4">
                      <div className="flex justify-between">
                        <div className="font-medium">John D.</div>
                        <div className="text-sm text-gray-500">2 days ago</div>
                      </div>
                      <div className="flex my-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < 5 ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`}
                          />
                        ))}
                      </div>
                      <p className="text-sm mt-2 text-gray-600">
                        These headphones are amazing! The sound quality is exceptional and the noise cancellation works
                        perfectly. Battery life is as advertised - I've been using them for days without needing to
                        recharge.
                      </p>
                    </div>

                    <div className="border-b pb-4">
                      <div className="flex justify-between">
                        <div className="font-medium">Sarah M.</div>
                        <div className="text-sm text-gray-500">1 week ago</div>
                      </div>
                      <div className="flex my-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < 4 ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`}
                          />
                        ))}
                      </div>
                      <p className="text-sm mt-2 text-gray-600">
                        Very comfortable even for long listening sessions. The sound is balanced and clear. My only
                        complaint is that the app could use some improvements.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Related Products */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {product.relatedProducts.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <div className="aspect-square relative">
                    <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    <div className="absolute top-2 right-2">
                      <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full bg-white/80 hover:bg-white">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium">{item.name}</h3>
                    <div className="flex justify-between items-center mt-2">
                      <div className="font-bold text-orange-600">${item.price.toFixed(2)}</div>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${i < Math.floor(item.rating) ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`}
                          />
                        ))}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-3 border-orange-600 text-orange-600 hover:bg-orange-50"
                    >
                      View Product
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Order Form */}
          <div className="mt-16" id="order-form">
            <Card>
              <div className="p-6 border-b">
                <h2 className="text-2xl font-bold">Place Your Order</h2>
                <p className="text-gray-500 mt-1">Fill out the form below to order this product</p>
              </div>
              <CardContent className="p-6">
                <form className="grid gap-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" placeholder="John Doe" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" placeholder="+1 (555) 123-4567" />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" placeholder="john@example.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="order-quantity">Quantity</Label>
                      <Input id="order-quantity" type="number" defaultValue="1" min="1" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message (Optional)</Label>
                    <Textarea id="message" placeholder="Any special requests or questions about the product?" />
                  </div>

                  <Button type="submit" className="w-full md:w-auto bg-orange-600 hover:bg-orange-700">
                    Place Order
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <footer className="border-t py-12 mt-12">
        <div className="container px-4">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <h3 className="font-bold text-xl mb-4">
                <span className="text-orange-600">Classic</span> Store
              </h3>
              <p className="text-sm text-gray-500">Providing high-quality products since 2023.</p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-gray-500 hover:text-orange-600 transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-500 hover:text-orange-600 transition-colors">
                    Shop
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-500 hover:text-orange-600 transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-500 hover:text-orange-600 transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Contact Us</h3>
              <address className="not-italic text-sm text-gray-500 space-y-2">
                <p>123 Store Street</p>
                <p>City, State 12345</p>
                <p>Email: info@classicstore.com</p>
                <p>Phone: (555) 123-4567</p>
              </address>
            </div>
            <div>
              <h3 className="font-bold mb-4">Newsletter</h3>
              <form className="space-y-2">
                <Input placeholder="Your email" type="email" />
                <Button type="submit" size="sm" className="bg-orange-600 hover:bg-orange-700">
                  Subscribe
                </Button>
              </form>
            </div>
          </div>
          <div className="mt-8 pt-4 border-t text-center text-sm text-gray-500">
            <p>© 2023 Classic Store. All rights reserved.</p>
            <p className="mt-1">
              Powered by <span className="font-semibold text-orange-600">Product Showcase</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
