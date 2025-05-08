"use client"

import { Check, ChevronDown, ChevronUp, Quote, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { type LandingPageData, sampleLandingPageData } from "@/types/landing-page-types"
import { useState } from "react"

interface PremiumTemplateProps {
  landingPageData?: LandingPageData
}

export function PremiumTemplate({ landingPageData = sampleLandingPageData }: PremiumTemplateProps) {
  const data = landingPageData
  const [currentImage, setCurrentImage] = useState(0)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)
  const [videoModalOpen, setVideoModalOpen] = useState(false)

  // Colors
  const primaryColor = data.theme?.primaryColor || "#FF006E"
  const secondaryColor = data.theme?.secondaryColor || "#3A86FF"

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

  // Premium pricing tiers
  const pricingTiers = [
    {
      name: "Elite",
      price: data.product.price.yearly ? data.product.price.yearly * 1.5 : 299.99,
      period: "per year",
      features: [...data.product.features, "Lifetime warranty", "24/7 concierge support", "Custom engraving"],
      isFeatured: false,
    },
    {
      name: "Premium",
      price: data.product.price.yearly,
      period: "per year",
      features: [...data.product.features, "5-year warranty", "VIP support", "Free shipping"],
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
    <div className="flex flex-col min-h-full bg-black text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/95 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2 font-bold text-xl">
            <span style={{ color: primaryColor }}>{data.brand.name}</span>
            <span>Premium</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
              Home
            </a>
            <a href="#features" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
              Features
            </a>
            <a href="#testimonials" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
              Testimonials
            </a>
            <a href="#pricing" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
              Pricing
            </a>
            <a href="#faq" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
              FAQ
            </a>
          </nav>
          <div className="flex items-center gap-4">
            <a href="#contact" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
              Contact
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section - Bold headline with product imagery */}
      <section className="relative bg-gradient-to-br from-gray-900 to-black py-24">
        <div className="container px-4 mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight" style={{ color: primaryColor }}>
                {data.product.name}
              </h1>
              <p className="text-xl text-white/80">{data.product.tagline}</p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 text-white border-0"
                  style={{ backgroundColor: primaryColor, backgroundImage: "none" }}
                >
                  <a href={data.product.callToAction.url}>{data.product.callToAction.text}</a>
                </Button>
                <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  <a href="#features">Discover Features</a>
                </Button>
              </div>
            </div>

            <div className="relative rounded-xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10 opacity-40"></div>
              {data.product.media.images.length > 0 ? (
                <img
                  src={data.product.media.images[0] || "/placeholder.svg"}
                  alt={data.product.name}
                  className="w-full h-[500px] object-cover"
                />
              ) : (
                <div className="w-full h-[500px] bg-gray-800 flex items-center justify-center">
                  <span className="text-gray-400">Product Image</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Benefits with elegant styling */}
      <section id="features" className="py-20 bg-gray-900">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4" style={{ color: primaryColor }}>
              Exceptional Features
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Crafted with precision and designed for those who appreciate the finer things
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {data.product.benefits.slice(0, 3).map((benefit, index) => (
              <div
                key={index}
                className="p-8 border border-white/10 rounded-lg bg-black/40 backdrop-blur-sm hover:bg-black/60 transition-all"
              >
                <div
                  className="h-14 w-14 rounded-full mb-6 flex items-center justify-center"
                  style={{ backgroundColor: `${primaryColor}20` }}
                >
                  <Check className="h-7 w-7" style={{ color: primaryColor }} />
                </div>
                <h3 className="text-xl font-semibold mb-4" style={{ color: primaryColor }}>
                  Premium Benefit {index + 1}
                </h3>
                <p className="text-white/70">{benefit}</p>
              </div>
            ))}
          </div>

          <div className="mt-24 grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="space-y-8">
                <h3 className="text-3xl font-bold" style={{ color: primaryColor }}>
                  Uncompromising Quality
                </h3>
                <p className="text-white/70 text-lg">{data.product.description}</p>

                <ul className="space-y-4">
                  {data.product.features.slice(0, 4).map((feature, index) => (
                    <li key={index} className="flex items-start gap-4">
                      <div className="bg-black/40 p-2 rounded-full mt-1">
                        <Check style={{ color: primaryColor }} className="h-5 w-5" />
                      </div>
                      <span className="text-white/80">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              {data.product.media.images.length > 1 ? (
                <img
                  src={data.product.media.images[1] || "/placeholder.svg"}
                  alt={`${data.product.name} detail`}
                  className="w-full rounded-xl shadow-2xl border border-white/10"
                />
              ) : (
                <div className="w-full h-[400px] bg-gray-800 rounded-xl border border-white/10 flex items-center justify-center">
                  <span className="text-gray-400">Product Detail Image</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Elegant dark themed testimonials */}
      <section id="testimonials" className="py-20 bg-black">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4" style={{ color: primaryColor }}>
              What Our Elite Clients Say
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">Trusted by discerning customers worldwide</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {data.product.testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-gray-900 border-white/10 text-white">
                <CardContent className="p-8">
                  <Quote style={{ color: primaryColor }} className="h-10 w-10 opacity-30 mb-6" />
                  <p className="text-white/80 mb-8 text-lg italic">"{testimonial.quote}"</p>
                  <div className="flex justify-between items-end">
                    <div className="flex items-center gap-3">
                      {testimonial.avatar && (
                        <img
                          src={testimonial.avatar || "/placeholder.svg"}
                          alt={testimonial.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      )}
                      <div>
                        <p className="font-semibold text-white">{testimonial.name}</p>
                        <p className="text-white/60">{testimonial.title}</p>
                      </div>
                    </div>
                    {testimonial.rating && (
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              i < testimonial.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-700"
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

      {/* Pricing Section - Elegant pricing boxes */}
      <section id="pricing" className="py-20 bg-gray-900">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4" style={{ color: primaryColor }}>
              Select Your Investment
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Choose the perfect option that aligns with your aspirations
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {pricingTiers.map((tier, index) => (
              <Card
                key={index}
                className={`bg-black/60 backdrop-blur-sm relative overflow-hidden ${
                  tier.isFeatured ? "border-2 shadow-xl" : "border border-white/20 shadow-lg"
                }`}
                style={tier.isFeatured ? { borderColor: primaryColor } : {}}
              >
                {tier.isFeatured && tier.discountNote && (
                  <div
                    className="absolute top-0 right-0 text-black px-6 py-1 text-sm font-medium"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {tier.discountNote}
                  </div>
                )}
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-2" style={{ color: primaryColor }}>
                    {tier.name}
                  </h3>
                  <div className="mb-8">
                    <span className="text-4xl font-bold">
                      {data.product.price.currency} {tier.price.toFixed(2)}
                    </span>
                    <span className="text-white/60 ml-2">{tier.period}</span>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="bg-white/10 p-1 rounded-full mt-1">
                          <Check style={{ color: primaryColor }} className="h-4 w-4 shrink-0" />
                        </div>
                        <span className="text-white/80">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className="w-full"
                    variant={tier.isFeatured ? "default" : "outline"}
                    style={
                      tier.isFeatured
                        ? { backgroundColor: primaryColor }
                        : { borderColor: "rgba(255,255,255,0.2)", color: "white" }
                    }
                  >
                    <a href="#contact">Select {tier.name}</a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-black border-t border-white/10">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4" style={{ color: primaryColor }}>
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Find answers to common questions about our premium products
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            {data.product.faq.map((faq, index) => (
              <div key={index} className="mb-4">
                <button
                  className="flex justify-between items-center w-full text-left p-4 bg-gray-900 rounded-lg border border-white/10 hover:bg-gray-800 transition-colors"
                  onClick={() => toggleFaq(index)}
                >
                  <h3 className="text-lg font-medium text-white">{faq.question}</h3>
                  {openFaqIndex === index ? (
                    <ChevronUp className="h-5 w-5 text-white/60" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-white/60" />
                  )}
                </button>
                {openFaqIndex === index && (
                  <div className="p-4 bg-gray-800/50 border-t border-white/10 rounded-b-lg">
                    <p className="text-white/70">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact form */}
      <section id="contact" className="py-20 bg-gray-900 border-t border-white/10">
        <div className="container px-4 mx-auto">
          <div className="max-w-xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4" style={{ color: primaryColor }}>
                Exclusive Inquiry
              </h2>
              <p className="text-white/70">Complete the form below for priority assistance from our concierge team.</p>
            </div>

            <form className="space-y-6 bg-black/60 backdrop-blur-sm p-8 rounded-xl border border-white/10 shadow-xl">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white/80">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    className="bg-black/50 border-white/20 text-white placeholder:text-white/30 focus:border-white/30"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white/80">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    className="bg-black/50 border-white/20 text-white placeholder:text-white/30 focus:border-white/30"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-white/80">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  placeholder="+1 (555) 123-4567"
                  className="bg-black/50 border-white/20 text-white placeholder:text-white/30 focus:border-white/30"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-white/80">
                  Your Message
                </Label>
                <Textarea
                  id="message"
                  placeholder="I'm interested in this product. Please send me more information."
                  className="min-h-[120px] bg-black/50 border-white/20 text-white placeholder:text-white/30 focus:border-white/30"
                />
              </div>

              <Button type="submit" className="w-full" style={{ backgroundColor: primaryColor }}>
                Submit Inquiry
              </Button>
            </form>
          </div>
        </div>
      </section>

      <footer className="bg-black text-white py-12 border-t border-white/10">
        <div className="container px-4 mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4" style={{ color: primaryColor }}>
                {data.brand.name}
              </h3>
              <p className="text-gray-400 text-sm">Providing exceptional quality products since 2023.</p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4" style={{ color: primaryColor }}>
                Quick Links
              </h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#features" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#testimonials" className="hover:text-white transition-colors">
                    Testimonials
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4" style={{ color: primaryColor }}>
                Contact
              </h3>
              <address className="not-italic text-sm text-gray-400 space-y-2">
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

          <div className="border-t border-white/10 mt-10 pt-6 text-center text-sm text-gray-500">
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
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
          onClick={() => setPreviewOpen(false)}
        >
          <div className="relative w-full max-w-4xl max-h-[90vh]">
            <img
              src={data.product.media.images[currentImage] || "/placeholder.svg"}
              alt={data.product.name}
              className="w-full h-full object-contain"
            />

            {/* Navigation controls */}
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
