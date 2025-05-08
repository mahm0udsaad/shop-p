"use client"

import { Check, ChevronDown, ChevronUp, Quote } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { type LandingPageData, sampleLandingPageData } from "@/types/landing-page-types"

interface GalleryTemplateProps {
  landingPageData?: LandingPageData
}

export function GalleryTemplate({ landingPageData = sampleLandingPageData }: GalleryTemplateProps) {
  const data = landingPageData
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)

  // Colors
  const primaryColor = data.theme?.primaryColor || "#4A90E2"
  const secondaryColor = data.theme?.secondaryColor || "#50E3C2"

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index)
  }

  return (
    <div className="flex flex-col min-h-full bg-white">
      <header className="sticky top-0 z-10 bg-white border-b">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2 font-bold text-xl">
            <span style={{ color: primaryColor }}>{data.brand.name}</span>
            <span>Gallery</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">
              Home
            </a>
            <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">
              Features
            </a>
            <a href="#testimonials" className="text-sm font-medium hover:text-primary transition-colors">
              Testimonials
            </a>
            <a href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">
              Pricing
            </a>
            <a href="#faq" className="text-sm font-medium hover:text-primary transition-colors">
              FAQ
            </a>
          </nav>
          <div className="flex items-center gap-4">
            <a href="#contact" className="text-sm font-medium hover:text-primary transition-colors">
              Contact
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Large Hero Image */}
        <div className="w-full aspect-[16/9] bg-gray-100 relative">
          {data.product.media.images.length > 0 && (
            <img
              src={data.product.media.images[0] || "/placeholder.svg"}
              alt={data.product.name}
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center p-6 md:p-12 bg-white/80 backdrop-blur-sm max-w-xl">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{data.product.name}</h1>
              <p className="text-gray-600 mb-4">{data.product.tagline}</p>
              <p className="text-2xl font-bold" style={{ color: primaryColor }}>
                {data.product.price.currency} {data.product.price.yearly?.toFixed(2)}
              </p>
              <div className="mt-6">
                <Button style={{ backgroundColor: primaryColor }}>
                  <a href={data.product.callToAction.url}>{data.product.callToAction.text}</a>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Video Section */}
        {data.product.media.video && (
          <div className="container px-4 py-12">
            <h2 className="text-2xl font-bold mb-8 text-center">Watch Our Product in Action</h2>
            <div className="aspect-video max-w-4xl mx-auto">
              <iframe
                width="100%"
                height="100%"
                src={data.product.media.video}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="rounded-lg shadow-lg"
              ></iframe>
            </div>
          </div>
        )}

        {/* Image Gallery */}
        <div className="container px-4 py-12">
          <h2 className="text-2xl font-bold mb-8 text-center">Product Gallery</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.product.media.images.map((image, index) => (
              <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={image || "/placeholder.svg"}
                  alt={`${data.product.name} view ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            {data.product.media.images.length === 0 &&
              [1, 2, 3, 4, 5, 6].map((index) => (
                <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden"></div>
              ))}
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="bg-gray-50 py-12">
          <div className="container px-4">
            <h2 className="text-2xl font-bold mb-8 text-center">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {data.product.features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div
                    className="h-6 w-6 rounded-full flex items-center justify-center mt-0.5"
                    style={{ backgroundColor: `${primaryColor}20` }}
                  >
                    <Check className="h-3 w-3" style={{ color: primaryColor }} />
                  </div>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="container px-4 py-12">
          <h2 className="text-2xl font-bold mb-8 text-center">Why Choose Our Product</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {data.product.benefits.map((benefit, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <div
                  className="h-12 w-12 rounded-full mb-4 flex items-center justify-center"
                  style={{ backgroundColor: `${primaryColor}15` }}
                >
                  <Check style={{ color: primaryColor }} className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Benefit {index + 1}</h3>
                <p className="text-gray-600">{benefit}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials Section */}
        <div id="testimonials" className="bg-gray-50 py-12">
          <div className="container px-4">
            <h2 className="text-2xl font-bold mb-8 text-center">What Our Customers Say</h2>
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {data.product.testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                  <div className="mb-4">
                    <Quote style={{ color: primaryColor }} className="h-8 w-8 opacity-30" />
                  </div>
                  <p className="text-gray-600 mb-6 italic">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-3">
                    {testimonial.avatar && (
                      <img
                        src={testimonial.avatar || "/placeholder.svg"}
                        alt={testimonial.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.title}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div id="pricing" className="container px-4 py-12">
          <h2 className="text-2xl font-bold mb-8 text-center">Pricing</h2>
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 border">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold">Premium Package</h3>
              <div className="mt-2">
                <span className="text-3xl font-bold">
                  {data.product.price.currency} {data.product.price.yearly?.toFixed(2)}
                </span>
                <span className="text-gray-500 ml-1">per year</span>
              </div>
              {data.product.price.discountNote && (
                <p className="text-sm mt-2 text-green-600">{data.product.price.discountNote}</p>
              )}
            </div>

            <ul className="space-y-3 mb-6">
              {data.product.features.slice(0, 5).map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check style={{ color: primaryColor }} className="h-5 w-5 shrink-0 mt-0.5" />
                  <span className="text-gray-600">{feature}</span>
                </li>
              ))}
            </ul>

            <Button className="w-full" style={{ backgroundColor: primaryColor }}>
              <a href="#contact">Get Started</a>
            </Button>
          </div>
        </div>

        {/* FAQ Section */}
        <div id="faq" className="bg-gray-50 py-12">
          <div className="container px-4">
            <h2 className="text-2xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
            <div className="max-w-3xl mx-auto">
              {data.product.faq.map((faq, index) => (
                <div key={index} className="mb-4">
                  <button
                    className="flex justify-between items-center w-full text-left p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                    onClick={() => toggleFaq(index)}
                  >
                    <h3 className="text-lg font-medium">{faq.question}</h3>
                    {openFaqIndex === index ? (
                      <ChevronUp className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    )}
                  </button>
                  {openFaqIndex === index && (
                    <div className="p-4 bg-white border-t">
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Brand Section */}
        <div className="container px-4 py-12">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-6">About {data.brand.name}</h2>
            <div className="flex justify-center mb-6">
              {data.brand.logo && (
                <img
                  src={data.brand.logo || "/placeholder.svg"}
                  alt={data.brand.name}
                  className="h-16 object-contain"
                />
              )}
            </div>
            <p className="text-gray-600 mb-6">
              {data.brand.name} is committed to providing high-quality products that enhance your life. Our mission is
              to deliver exceptional value through innovative design and superior craftsmanship.
            </p>
            <div className="flex justify-center gap-4">
              {data.brand.socialLinks.twitter && (
                <a
                  href={data.brand.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-blue-400"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
              )}
              {data.brand.socialLinks.facebook && (
                <a
                  href={data.brand.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-blue-600"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                  </svg>
                </a>
              )}
              {data.brand.socialLinks.linkedin && (
                <a
                  href={data.brand.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-blue-500"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="container px-4 py-12" id="contact">
          <div className="max-w-xl mx-auto bg-white rounded-lg shadow-lg p-8 border">
            <h2 className="text-2xl font-bold mb-6 text-center">Request This Product</h2>
            <form className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="John Doe" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="john@example.com" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" placeholder="+1 (555) 123-4567" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Your Message</Label>
                <Textarea
                  id="message"
                  placeholder="I'm interested in this product. Please send me more information."
                  className="min-h-[100px]"
                />
              </div>

              <Button type="submit" className="w-full" style={{ backgroundColor: primaryColor }}>
                Send Inquiry
              </Button>
            </form>
          </div>
        </div>
      </main>

      <footer className="bg-gray-50 py-8 border-t">
        <div className="container px-4 text-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} {data.brand.name}. All rights reserved.
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Powered by{" "}
            <span className="font-semibold" style={{ color: primaryColor }}>
              Product Showcase
            </span>
          </p>
        </div>
      </footer>
    </div>
  )
}
