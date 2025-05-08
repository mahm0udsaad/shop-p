"use client"

import { Check, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { type LandingPageData, sampleLandingPageData } from "@/types/landing-page-types"
import { useState } from "react"

interface MinimalTemplateProps {
  landingPageData?: LandingPageData
}

export function MinimalTemplate({ landingPageData = sampleLandingPageData }: MinimalTemplateProps) {
  const data = landingPageData
  const [currentImage, setCurrentImage] = useState(0)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)

  // Colors
  const primaryColor = data.theme?.primaryColor || "#3A86FF"
  const secondaryColor = data.theme?.secondaryColor || "#FF006E"

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

  return (
    <div className="flex flex-col min-h-full bg-white">
      <header className="sticky top-0 z-10 bg-white border-b">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2 font-bold text-xl">
            <span style={{ color: primaryColor }}>{data.brand.name}</span>
            <span>Minimal</span>
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
        </div>
      </header>

      <main className="flex-1 container px-4 py-12 max-w-3xl mx-auto">
        <div className="space-y-12">
          {/* Product Header */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold">{data.product.name}</h1>
            <p className="text-gray-600 max-w-xl mx-auto">{data.product.tagline}</p>
            <p className="text-2xl font-bold" style={{ color: primaryColor }}>
              {data.product.price.currency} {data.product.price.yearly?.toFixed(2)}
            </p>
            <div className="pt-4">
              <Button style={{ backgroundColor: primaryColor }}>
                <a href={data.product.callToAction.url}>{data.product.callToAction.text}</a>
              </Button>
            </div>
          </div>

          {/* Image Slider */}
          <div className="relative max-w-md mx-auto">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              {data.product.media.images.length > 0 ? (
                <>
                  <div className="relative h-full w-full">
                    {data.product.media.images.map((image, idx) => (
                      <div
                        key={idx}
                        className={`absolute inset-0 transition-opacity duration-300 ${currentImage === idx ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                      >
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`${data.product.name} - view ${idx + 1}`}
                          className="w-full h-full object-cover cursor-pointer"
                          onClick={() => setPreviewOpen(true)}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Navigation dots */}
                  {data.product.media.images.length > 1 && (
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                      {data.product.media.images.map((_, idx) => (
                        <button
                          key={idx}
                          className={`w-2 h-2 rounded-full transition-all ${currentImage === idx ? "bg-white scale-125" : "bg-white/50"}`}
                          onClick={() => setCurrentImage(idx)}
                          aria-label={`View image ${idx + 1}`}
                        />
                      ))}
                    </div>
                  )}

                  {/* Navigation arrows */}
                  {data.product.media.images.length > 1 && (
                    <>
                      <button
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 shadow-md hover:bg-white transition-colors"
                        onClick={prevImage}
                        aria-label="Previous image"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M15 18l-6-6 6-6" />
                        </svg>
                      </button>
                      <button
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 shadow-md hover:bg-white transition-colors"
                        onClick={nextImage}
                        aria-label="Next image"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M9 18l6-6-6-6" />
                        </svg>
                      </button>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">No image available</span>
                </div>
              )}
            </div>
          </div>

          {/* Video Section */}
          {data.product.media.video && (
            <div className="py-6">
              <h2 className="text-xl font-bold mb-4">Watch Product Demo</h2>
              <div className="aspect-video rounded-lg overflow-hidden">
                <iframe
                  width="100%"
                  height="100%"
                  src={data.product.media.video}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  className="rounded-lg shadow-md"
                ></iframe>
              </div>
            </div>
          )}

          {/* Features */}
          <div id="features" className="space-y-4">
            <h2 className="text-xl font-bold">Key Features</h2>
            <ul className="space-y-2">
              {data.product.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="h-5 w-5 shrink-0 mt-0.5" style={{ color: primaryColor }} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Benefits Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Why Choose Our Product</h2>
            <div className="grid gap-4">
              {data.product.benefits.map((benefit, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Benefit {index + 1}</h3>
                  <p className="text-gray-600">{benefit}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonials Section */}
          <div id="testimonials" className="space-y-4">
            <h2 className="text-xl font-bold">What Our Customers Say</h2>
            <div className="space-y-4">
              {data.product.testimonials.map((testimonial, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <p className="text-gray-600 italic mb-4">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-3">
                    {testimonial.avatar && (
                      <img
                        src={testimonial.avatar || "/placeholder.svg"}
                        alt={testimonial.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <p className="font-medium">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.title}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Brand Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold">About {data.brand.name}</h2>
            <div className="flex justify-center mb-4">
              {data.brand.logo && (
                <img
                  src={data.brand.logo || "/placeholder.svg"}
                  alt={data.brand.name}
                  className="h-12 object-contain"
                />
              )}
            </div>
            <p className="text-gray-600 text-center">
              {data.brand.name} is dedicated to creating products that make a difference in your everyday life.
            </p>
            <div className="flex justify-center gap-4 mt-4">
              {data.brand.socialLinks.twitter && (
                <a
                  href={data.brand.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-blue-400"
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
                  className="text-gray-500 hover:text-blue-600"
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
                  className="text-gray-500 hover:text-blue-500"
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
          </div>

          {/* Pricing Section */}
          <div id="pricing" className="space-y-4">
            <h2 className="text-xl font-bold">Pricing</h2>
            <div className="border rounded-lg p-6">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold">Premium Plan</h3>
                <div className="mt-2">
                  <span className="text-2xl font-bold">
                    {data.product.price.currency} {data.product.price.yearly?.toFixed(2)}
                  </span>
                  <span className="text-gray-500 ml-1">per year</span>
                </div>
                {data.product.price.discountNote && (
                  <p className="text-sm mt-2 text-green-600">{data.product.price.discountNote}</p>
                )}
              </div>

              <ul className="space-y-2 mb-6">
                {data.product.features.slice(0, 4).map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="h-5 w-5 shrink-0 mt-0.5" style={{ color: primaryColor }} />
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
          <div id="faq" className="space-y-4">
            <h2 className="text-xl font-bold">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {data.product.faq.map((faq, index) => (
                <div key={index} className="border rounded-lg overflow-hidden">
                  <button
                    className="flex justify-between items-center w-full text-left p-4 bg-white"
                    onClick={() => toggleFaq(index)}
                  >
                    <h3 className="font-medium">{faq.question}</h3>
                    {openFaqIndex === index ? (
                      <ChevronUp className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    )}
                  </button>
                  {openFaqIndex === index && (
                    <div className="p-4 bg-gray-50 border-t">
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t"></div>

          {/* Contact Form */}
          <div id="contact" className="space-y-6">
            <h2 className="text-xl font-bold text-center">Interested in this product?</h2>
            <p className="text-center text-gray-600">
              Fill out the form below and we'll contact you with more information.
            </p>

            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Your name" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Your email" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="I'm interested in this product. Please send me more information."
                  className="min-h-[100px]"
                />
              </div>

              <Button type="submit" className="w-full" style={{ backgroundColor: primaryColor }}>
                Request Information
              </Button>
            </form>
          </div>
        </div>
      </main>

      <footer className="py-6 border-t">
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
    </div>
  )
}
