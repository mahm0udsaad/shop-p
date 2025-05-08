"use client"

import { useState } from "react"
import { Check, ChevronDown, ChevronRight, ChevronUp, Quote, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { type LandingPageData, sampleLandingPageData } from "@/types/landing-page-types"

interface ClassicTemplateProps {
  landingPageData?: LandingPageData
}

export function ClassicTemplate({ landingPageData = sampleLandingPageData }: ClassicTemplateProps) {
  const data = landingPageData
  const [currentImage, setCurrentImage] = useState(0)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)
  const [videoModalOpen, setVideoModalOpen] = useState(false)

  // Colors
  const primaryColor = data.theme?.primaryColor || "#FF6B35"
  const secondaryColor = data.theme?.secondaryColor || "#004E89"

  const nextImage = () => {
    if (data.product.media.images.length > 0) {
      setCurrentImage((prev) => (prev + 1) % data.product.media.images.length)
    }
  }

  const prevImage = () => {
    if (data.product.media.images.length > 0) {
      setCurrentImage((prev) => (prev - 1 + data.product.media.images.length) % data.product.media.images.length)
    }
  }

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index)
  }

  // Classic pricing tiers
  const pricingTiers = [
    {
      name: "Premium",
      price: data.product.price.yearly,
      period: "per year",
      features: [...data.product.features, "1-year warranty", "Priority support", "Free shipping"],
      isFeatured: true,
      discountNote: data.product.price.discountNote,
    },
    {
      name: "Standard",
      price: data.product.price.monthly ? data.product.price.monthly * 10 : 99.99,
      period: "per year",
      features: data.product.features.slice(0, 4),
      isFeatured: false,
    },
  ]

  return (
    <div className="flex flex-col min-h-full bg-gray-50">
      <header className="sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2 font-bold text-xl">
            <span style={{ color: primaryColor }}>{data.brand.name}</span>
            <span>Classic</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-sm font-medium hover:text-orange-600 transition-colors">
              Home
            </a>
            <a href="#features" className="text-sm font-medium hover:text-orange-600 transition-colors">
              Features
            </a>
            <a href="#testimonials" className="text-sm font-medium hover:text-orange-600 transition-colors">
              Testimonials
            </a>
            <a href="#pricing" className="text-sm font-medium hover:text-orange-600 transition-colors">
              Pricing
            </a>
          </nav>
          <div className="flex items-center gap-4">
            <a href="#contact" className="text-sm font-medium hover:text-orange-600 transition-colors">
              Contact
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
            Products
          </a>
          <ChevronRight className="h-4 w-4 mx-1" />
          <span className="text-gray-900">{data.product.name}</span>
        </nav>
      </div>

      {/* Hero Section */}
      <section className="py-12 bg-white">
        <div className="container px-4">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-3xl md:text-4xl font-bold" style={{ color: primaryColor }}>
                {data.product.name}
              </h1>
              <p className="text-lg text-gray-600">{data.product.tagline}</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" style={{ backgroundColor: primaryColor }} className="text-white">
                  <a href={data.product.callToAction.url}>{data.product.callToAction.text}</a>
                </Button>
                <Button size="lg" variant="outline" className="border-gray-300">
                  <a href="#features">View Features</a>
                </Button>
              </div>
            </div>

            <div className="overflow-hidden rounded-lg border bg-white shadow-md">
              {data.product.media.images.length > 0 ? (
                <img
                  src={data.product.media.images[0] || "/placeholder.svg"}
                  alt={data.product.name}
                  className="w-full h-[400px] object-cover"
                />
              ) : (
                <div className="w-full h-[400px] bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">Product Image</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-gray-50">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4" style={{ color: primaryColor }}>
              Product Features
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover what makes our product stand out from the competition
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {data.product.benefits.map((benefit, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <div
                  className="h-12 w-12 rounded-full mb-4 flex items-center justify-center"
                  style={{ backgroundColor: `${primaryColor}15` }}
                >
                  <Check style={{ color: primaryColor }} className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Key Benefit {index + 1}</h3>
                <p className="text-gray-600">{benefit}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 grid lg:grid-cols-2 gap-12 items-center">
            <div>
              {data.product.media.images.length > 1 ? (
                <img
                  src={data.product.media.images[1] || "/placeholder.svg"}
                  alt={`${data.product.name} detail`}
                  className="w-full rounded-lg shadow-lg"
                />
              ) : (
                <div className="w-full h-[300px] bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">Product Detail Image</span>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-bold" style={{ color: primaryColor }}>
                Why Choose Our Product?
              </h3>
              <p className="text-gray-600">{data.product.description}</p>

              <ul className="space-y-3">
                {data.product.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check style={{ color: primaryColor }} className="h-5 w-5 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 bg-white">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4" style={{ color: primaryColor }}>
              Customer Testimonials
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              See what our satisfied customers have to say about our product
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {data.product.testimonials.map((testimonial, index) => (
              <Card key={index} className="border-gray-200 hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <Quote style={{ color: primaryColor }} className="h-8 w-8 opacity-30 mb-4" />
                  <p className="text-gray-600 mb-6 italic">"{testimonial.quote}"</p>
                  <div className="flex justify-between items-center">
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
                    {testimonial.rating && (
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < testimonial.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 bg-gray-50">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4" style={{ color: primaryColor }}>
              Pricing Plans
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Choose the perfect plan that fits your needs</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {pricingTiers.map((tier, index) => (
              <Card
                key={index}
                className={`relative overflow-hidden ${tier.isFeatured ? "border-2 shadow-lg" : "border shadow-sm"}`}
                style={tier.isFeatured ? { borderColor: primaryColor } : {}}
              >
                {tier.isFeatured && tier.discountNote && (
                  <div
                    className="absolute top-0 right-0 text-white px-4 py-1 text-sm font-medium"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {tier.discountNote}
                  </div>
                )}
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
                  <div className="mb-6">
                    <span className="text-3xl font-bold">
                      {data.product.price.currency} {tier.price?.toFixed(2)}
                    </span>
                    <span className="text-gray-500 ml-1">{tier.period}</span>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check style={{ color: primaryColor }} className="h-5 w-5 shrink-0 mt-0.5" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className="w-full mt-4"
                    variant={tier.isFeatured ? "default" : "outline"}
                    style={tier.isFeatured ? { backgroundColor: primaryColor } : {}}
                  >
                    <a href="#contact">Get Started</a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 bg-white">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4" style={{ color: primaryColor }}>
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions about our product
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            {data.product.faq.map((faq, index) => (
              <div key={index} className="mb-4">
                <button
                  className="flex justify-between items-center w-full text-left p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100"
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
                  <div className="p-4 bg-white border-t border-gray-100 rounded-b-lg shadow-sm">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact form */}
      <section id="contact" className="py-16 bg-gray-50 border-t">
        <div className="container px-4">
          <div className="max-w-xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4" style={{ color: primaryColor }}>
                Contact Us
              </h2>
              <p className="text-gray-600">Have questions? Fill out the form below and we'll get back to you.</p>
            </div>

            <form className="space-y-6 bg-white p-8 rounded-lg shadow-md border border-gray-100">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="John Doe" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="john@example.com" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Select defaultValue="inquiry">
                  <SelectTrigger id="subject">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inquiry">Product Inquiry</SelectItem>
                    <SelectItem value="support">Technical Support</SelectItem>
                    <SelectItem value="feedback">Feedback</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
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
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </section>

      <footer className="bg-gray-800 text-white py-8">
        <div className="container px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">{data.brand.name}</h3>
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
                  <a href="#features" className="hover:text-white">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#testimonials" className="hover:text-white">
                    Testimonials
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-white">
                    Pricing
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
                <p>Email: {data.brand.contactEmail}</p>
                <div className="flex gap-4 mt-4">
                  {data.brand.socialLinks.twitter && (
                    <a
                      href={data.brand.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-400"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
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
                      className="hover:text-blue-600"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
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
                      className="hover:text-blue-500"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                      </svg>
                    </a>
                  )}
                </div>
              </address>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">
            <p>
              © {new Date().getFullYear()} {data.brand.name}. All rights reserved.
            </p>
            <p className="mt-1">
              Powered by{" "}
              <span className="font-semibold" style={{ color: primaryColor }}>
                Product Showcase
              </span>
            </p>
          </div>
        </div>
      </footer>

      {/* Full Screen Preview */}
      {previewOpen && data.product.media.images.length > 0 && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
          onClick={() => setPreviewOpen(false)}
        >
          <div className="relative w-full max-w-4xl max-h-[90vh]">
            <img
              src={data.product.media.images[currentImage] || "/placeholder.svg"}
              alt={data.product.name}
              className="w-full h-full object-contain"
            />

            {/* Close button */}
            <button
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 rounded-full p-2 transition-colors"
              onClick={(e) => {
                e.stopPropagation()
                setPreviewOpen(false)
              }}
              aria-label="Close preview"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            {/* Navigation arrows for preview */}
            {data.product.media.images.length > 1 && (
              <>
                <button
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 rounded-full p-3 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation()
                    prevImage()
                  }}
                  aria-label="Previous image"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 rounded-full p-3 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation()
                    nextImage()
                  }}
                  aria-label="Next image"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              </>
            )}

            {/* Image counter */}
            <div className="absolute bottom-4 left-0 right-0 text-center text-white">
              {currentImage + 1} / {data.product.media.images.length}
            </div>
          </div>
        </div>
      )}

      {/* Video Modal */}
      {videoModalOpen && data.product.media.video && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setVideoModalOpen(false)}
        >
          <div className="relative w-full max-w-4xl aspect-video bg-black">
            <iframe
              src={`${data.product.media.video}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            ></iframe>
            <button
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 rounded-full p-2 transition-colors"
              onClick={(e) => {
                e.stopPropagation()
                setVideoModalOpen(false)
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
