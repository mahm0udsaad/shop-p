import Image from "next/image"
import { Check, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function PremiumTemplate() {
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
      "Quick Charge (5 min charge = 3 hours playback)",
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
    <div className="flex flex-col min-h-screen bg-black text-white">
      <header className="sticky top-0 z-10 border-b border-white/10 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2 font-bold text-xl">
            <span className="text-purple-400">Premium</span>
            <span>Store</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
              Home
            </a>
            <a href="#" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
              Products
            </a>
            <a href="#" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
              About
            </a>
            <a href="#" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
              Contact
            </a>
          </nav>
          <div className="flex items-center gap-4">
            <a href="#order-form" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
              Order Now
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <div className="relative h-[70vh] overflow-hidden">
          <Image src="/placeholder.svg?height=1200&width=2000" alt={product.name} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent flex items-end">
            <div className="container px-4 pb-16">
              <h1 className="text-4xl md:text-6xl font-bold max-w-3xl">{product.name}</h1>
              <p className="mt-4 text-white/70 max-w-2xl text-lg">{product.description}</p>
              <div className="mt-8 flex items-center gap-4">
                <div className="text-3xl font-bold">${product.price.toFixed(2)}</div>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "fill-white/20 text-white/20"}`}
                    />
                  ))}
                  <span className="ml-2 text-white/70">
                    {product.rating} ({product.reviews})
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="container px-4 py-16">
          <div className="grid md:grid-cols-2 gap-16">
            <div className="space-y-8">
              <h2 className="text-2xl font-bold border-b border-white/10 pb-4">Product Details</h2>
              <p className="text-white/70 leading-relaxed">{product.longDescription}</p>

              <div className="space-y-4">
                <h3 className="text-xl font-bold">Key Features</h3>
                <ul className="grid gap-3">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-purple-500/20 flex items-center justify-center mt-0.5">
                        <Check className="h-3 w-3 text-purple-400" />
                      </div>
                      <span className="text-white/80">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold">Specifications</h3>
                <div className="grid gap-2">
                  {product.specifications.map((spec, index) => (
                    <div key={index} className="flex justify-between py-2 border-b border-white/10">
                      <span className="text-white/70">{spec.name}</span>
                      <span className="font-medium">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-4">
                {product.images.map((image, index) => (
                  <div
                    key={index}
                    className="overflow-hidden rounded-lg border border-white/10 bg-white/5 aspect-square"
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} - View ${index + 1}`}
                      width={400}
                      height={400}
                      className="h-full w-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                ))}
              </div>

              <div className="space-y-6 bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-bold">Order Now</h3>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="color" className="text-white/80">
                      Color
                    </Label>
                    <div className="flex gap-3">
                      {product.colors.map((color, index) => (
                        <div
                          key={index}
                          className={`h-10 w-10 rounded-full cursor-pointer border-2 ${index === 0 ? "border-purple-500" : "border-transparent"}`}
                          style={{ backgroundColor: color.value }}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quantity" className="text-white/80">
                      Quantity
                    </Label>
                    <Input
                      id="quantity"
                      type="number"
                      defaultValue="1"
                      min="1"
                      className="bg-white/10 border-white/10 text-white"
                    />
                  </div>

                  <Button className="w-full py-6 text-lg bg-purple-600 hover:bg-purple-700">
                    <a href="#order-form">Request Information</a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="bg-white/5 py-16">
          <div className="container px-4">
            <h2 className="text-2xl font-bold mb-8">You May Also Like</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {product.relatedProducts.map((item) => (
                <div key={item.id} className="bg-black border border-white/10 rounded-lg overflow-hidden group">
                  <div className="aspect-square relative overflow-hidden">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium">{item.name}</h3>
                    <div className="flex justify-between items-center mt-2">
                      <div className="font-bold text-purple-400">${item.price.toFixed(2)}</div>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${i < Math.floor(item.rating) ? "fill-yellow-400 text-yellow-400" : "fill-white/20 text-white/20"}`}
                          />
                        ))}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-3 border-white/20 text-white hover:bg-white/10"
                    >
                      View Product
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Form */}
        <div className="container px-4 py-16" id="order-form">
          <div className="max-w-3xl mx-auto bg-white/5 rounded-xl p-8 border border-white/10">
            <h2 className="text-2xl font-bold mb-6">Place Your Order</h2>
            <form className="grid gap-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white/80">
                    Full Name
                  </Label>
                  <Input id="name" placeholder="John Doe" className="bg-white/10 border-white/10 text-white" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-white/80">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    placeholder="+1 (555) 123-4567"
                    className="bg-white/10 border-white/10 text-white"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white/80">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    className="bg-white/10 border-white/10 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="order-quantity" className="text-white/80">
                    Quantity
                  </Label>
                  <Input
                    id="order-quantity"
                    type="number"
                    defaultValue="1"
                    min="1"
                    className="bg-white/10 border-white/10 text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-white/80">
                  Message (Optional)
                </Label>
                <Textarea
                  id="message"
                  placeholder="Any special requests or questions about the product?"
                  className="bg-white/10 border-white/10 text-white min-h-[100px]"
                />
              </div>

              <Button type="submit" className="w-full md:w-auto py-6 px-8 bg-purple-600 hover:bg-purple-700">
                Place Order
              </Button>
            </form>
          </div>
        </div>
      </main>

      <footer className="border-t border-white/10 py-12 bg-black">
        <div className="container px-4">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <h3 className="font-bold text-xl mb-4">
                <span className="text-purple-400">Premium</span> Store
              </h3>
              <p className="text-sm text-white/60">Providing high-quality products since 2023.</p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-white/60 hover:text-white transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/60 hover:text-white transition-colors">
                    Products
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/60 hover:text-white transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/60 hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Contact Us</h3>
              <address className="not-italic text-sm text-white/60 space-y-2">
                <p>123 Premium Avenue</p>
                <p>Luxury City, LC 12345</p>
                <p>Email: info@premiumstore.com</p>
                <p>Phone: (555) 123-4567</p>
              </address>
            </div>
            <div>
              <h3 className="font-bold mb-4">Newsletter</h3>
              <form className="space-y-2">
                <Input placeholder="Your email" type="email" className="bg-white/10 border-white/10 text-white" />
                <Button type="submit" size="sm" className="bg-purple-600 hover:bg-purple-700">
                  Subscribe
                </Button>
              </form>
            </div>
          </div>
          <div className="mt-12 pt-4 border-t border-white/10 text-center text-sm text-white/60">
            <p>© 2023 Premium Store. All rights reserved.</p>
            <p className="mt-1">
              Powered by <span className="font-semibold text-purple-400">Product Showcase</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
