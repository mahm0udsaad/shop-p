"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ProductTypeSelector } from "./components/product-type-selector"
import { ProductInformationForm } from "./components/product-information-form"
import { TemplateSelector } from "./components/template-selector"
import { CustomizationForm } from "./components/customization-form"
import { PreviewDevice } from "@/components/preview-device"
import { ProgressIndicator } from "./components/progress-indicator"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, Check, Sparkles, Loader2, X } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DomainValidator } from "./components/domain-validator"
import { PublishSuccess } from "./components/publish-success"
import { createProduct } from "./actions"
import { useAuth } from "@/contexts/auth-context"
import { useProductForm } from "@/contexts/product-form-context"

export default function NewProductPage() {
  const { user } = useAuth()
  const [isFullPreviewOpen, setIsFullPreviewOpen] = useState(false)
  const [isDomainChecking, setIsDomainChecking] = useState(false)
  const [isDomainAvailable, setIsDomainAvailable] = useState<boolean | null>(null)
  const {
    step,
    setStep,
    productType,
    setProductType,
    selectedTemplate,
    setSelectedTemplate,
    previewDevice,
    setPreviewDevice,
    errors,
    setErrors,
    productData,
    setProductData,
    multiProductsData,
    setMultiProductsData,
    storeData,
    setStoreData,
    isPublishing,
    setIsPublishing,
    publishResult,
    setPublishResult,
    resetForm
  } = useProductForm()

  const steps = ["Product Type", "Product Details", "Choose Template", "Customize", "Publish"]

  const validateStep = () => {
    const newErrors: Record<string, string> = {}

    if (step === 0) {
      // No validation needed for product type selection
      return true
    }

    if (step === 1) {
      if (productType === "single") {
        if (!productData.name) newErrors.name = "Product name is required"
        if (!productData.price?.currency) newErrors["price.currency"] = "Currency is required"
        if (!productData.category) newErrors.category = "Category is required"
        if (!productData.description) newErrors.description = "Description is required"
        if (!productData.tagline) newErrors.tagline = "Tagline is required"

        // Validate call to action
        if (productData.callToAction?.text && !productData.callToAction.url)
          newErrors["callToAction.url"] = "URL is required if text is provided"

        // Validate testimonials
        productData.testimonials.forEach((testimonial, index) => {
          if (testimonial.quote && !testimonial.name)
            newErrors[`testimonial_${index}_name`] = "Name is required for testimonial"
        })

        // Validate FAQs
        productData.faq.forEach((faq, index) => {
          if (!faq.question) newErrors[`faq_${index}_question`] = "Question is required"
          if (!faq.answer) newErrors[`faq_${index}_answer`] = "Answer is required"
        })
      } else {
        // Validate store information
        if (!storeData.name) newErrors.store_name = "Store name is required"
        if (!storeData.category) newErrors.store_category = "Store category is required"
        if (!storeData.description) newErrors.store_description = "Store description is required"

        // Validate each product
        multiProductsData.forEach((product, index) => {
          if (!product.name) newErrors[`product_${index}_name`] = "Product name is required"
          if (!product.price) newErrors[`product_${index}_price`] = "Price is required"
          if (!product.category) newErrors[`product_${index}_category`] = "Category is required"
          if (!product.description) newErrors[`product_${index}_description`] = "Description is required"
        })
      }
    }

    if (step === 4) {
      // Validate domain
      if (productType === "single") {
        if (!productData.domain) newErrors.domain = "Domain is required"
        else if (!/^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/.test(productData.domain))
          newErrors.domain = "Domain can only contain lowercase letters, numbers, and hyphens"
      } else {
        if (!storeData.domain) newErrors.store_domain = "Domain is required"
        else if (!/^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/.test(storeData.domain))
          newErrors.store_domain = "Domain can only contain lowercase letters, numbers, and hyphens"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep()) {
      setStep(step + 1)
      // Scroll to top when changing steps
      window.scrollTo(0, 0)
    }
  }

  const handleBack = () => {
    setStep(step - 1)
    // Scroll to top when changing steps
    window.scrollTo(0, 0)
  }

  const handlePublish = async () => {
    if (!validateStep()) return

    // Check if user is authenticated
    if (!user) {
      setPublishResult({ error: "You must be logged in to publish a product" })
      return
    }

    // Check if domain is available
    if (isDomainAvailable !== true) {
      setPublishResult({ error: "Please ensure your domain is valid and available" })
      return
    }

    setIsPublishing(true)

    try {
      // Create form data
      const formData = new FormData()

      // Common fields
      formData.append("productType", productType)
      formData.append("template", selectedTemplate)

      const domain = productType === "single" ? productData.domain : storeData.domain

      if (productType === "single") {
        // Single product fields
        formData.append("name", productData.name)
        formData.append("description", productData.description)
        formData.append("price", productData.price.yearly?.toString() || "0")
        formData.append("domain", productData.domain)
        formData.append("tagline", productData.tagline)
        formData.append("features", productData.features)
        formData.append("benefits", productData.benefits)
        formData.append("category", productData.category)
        formData.append("colors", JSON.stringify(productData.colors))
        formData.append("sizes", JSON.stringify(productData.sizes))
        formData.append("testimonials", JSON.stringify(productData.testimonials))
        formData.append("faq", JSON.stringify(productData.faq))
        formData.append("callToAction", JSON.stringify(productData.callToAction))
        formData.append("media", JSON.stringify(productData.media))
        formData.append("brand", JSON.stringify(productData.brand))
        formData.append("seo", JSON.stringify(productData.seo))
        formData.append("color", productData.color)
        formData.append("accentColor", productData.accentColor)
      } else {
        // Multi-product store fields
        formData.append("storeName", storeData.name)
        formData.append("storeDescription", storeData.description)
        formData.append("storeAbout", storeData.about)
        formData.append("storeTagline", storeData.tagline)
        formData.append("storeCategory", storeData.category)
        formData.append("storeFooterContent", storeData.footerContent)
        formData.append("storeContactEmail", storeData.contactEmail)
        formData.append("storeColor", storeData.color)
        formData.append("storeAccentColor", storeData.accentColor)
        formData.append("domain", storeData.domain)
        formData.append("multiProducts", JSON.stringify(multiProductsData))
      }

      // Submit the form with user ID and get the result
      const result = await createProduct(formData, user.id)
      
      // Check if the product was created successfully
      if (result && result.success) {
        // Set success state with domain and product type
        setPublishResult({
          success: true,
          domain,
          productType
        })
        
        setTimeout(() => resetForm(), 40000)
      }
    } catch (error) {
      console.error("Error publishing:", error)
      setPublishResult({ error: "An unexpected error occurred" })
    } finally {
      setIsPublishing(false)
    }
  }

  const fillWithDummyData = () => {
    if (productType === "single") {
      setProductData({
        name: "Premium Wireless Headphones",
        tagline: "Immersive Sound Experience for Music Enthusiasts",
        description:
          "Experience crystal-clear sound with our premium wireless headphones. Featuring active noise cancellation, comfortable over-ear design, and long battery life, these headphones are perfect for music lovers and professionals alike.",
        price: {
          currency: "USD",
          monthly: 14.99,
          yearly: 149.99,
          discountNote: "Save 17% with annual billing",
        },
        category: "electronics",
        features:
          "Active Noise Cancellation\n30-hour Battery Life\nBluetooth 5.2\nComfortable Over-ear Design\nBuilt-in Microphone\nTouch Controls",
        benefits:
          "Immerse yourself in music without distractions\nEnjoy all-day comfort with ergonomic design\nExperience seamless connectivity with all your devices\nTake calls with crystal clear voice quality",
        media: {
          images: ["/diverse-people-listening-headphones.png", "/headphones-detail-1.png", "/headphones-detail-2.png"],
          video: "https://www.youtube.com/embed/WPni755-Krg?si=_EP3uLLcZtnjmQ1k",
        },
        testimonials: [
          {
            name: "Sarah Johnson",
            title: "Music Producer",
            quote:
              "These headphones have transformed my workflow. The sound clarity is exceptional and the comfort allows me to work for hours without fatigue.",
            avatar: "/diverse-group.png",
            rating: 5,
          },
          {
            name: "Michael Chen",
            title: "Tech Reviewer",
            quote:
              "After testing dozens of headphones, these stand out for their balanced sound profile and impressive battery life.",
            avatar: "/diverse-group.png",
            rating: 4,
          },
          {
            name: "Emily Rodriguez",
            title: "Podcast Host",
            quote:
              "The noise cancellation is a game-changer for recording in different environments. Absolutely worth the investment.",
            avatar: "/diverse-group.png",
            rating: 5,
          },
        ],
        callToAction: {
          text: "Experience Premium Sound",
          url: "#pricing",
        },
        faq: [
          {
            question: "How long does the battery last?",
            answer:
              "Our headphones provide up to 30 hours of playback time on a single charge. With quick charging, you can get 5 hours of playback from just 10 minutes of charging.",
          },
          {
            question: "Are these headphones compatible with all devices?",
            answer:
              "Yes, our headphones use Bluetooth 5.0 technology which is compatible with virtually all modern smartphones, tablets, laptops, and other Bluetooth-enabled devices.",
          },
          {
            question: "What's included in the box?",
            answer:
              "The package includes the wireless headphones, a premium carrying case, USB-C charging cable, 3.5mm audio cable for wired use, and a user manual.",
          },
          {
            question: "Is there a warranty?",
            answer:
              "Yes, all our headphones come with a 2-year manufacturer warranty covering any defects in materials or workmanship.",
          },
        ],
        colors: ["#000000", "#FFFFFF", "#C0C0C0"],
        sizes: [{ name: "Standard", inStock: true }],
        color: "#6F4E37",
        accentColor: "#ECB176",
        brand: {
          name: "SonicWave Audio",
          logo: "/abstract-logo.png",
          contactEmail: "support@sonicwave.example.com",
          socialLinks: {
            twitter: "https://twitter.com/sonicwave",
            linkedin: "https://linkedin.com/company/sonicwave",
            facebook: "https://facebook.com/sonicwave",
          },
        },
        seo: {
          title: "Premium Wireless Headphones | SonicWave Audio",
          description:
            "Experience unparalleled sound quality with SonicWave's Premium Wireless Headphones. 30-hour battery life, active noise cancellation, and supreme comfort.",
          keywords: ["wireless headphones", "premium audio", "noise cancellation", "bluetooth headphones", "sonicwave"],
          image: "/diverse-people-listening-headphones.png",
        },
        domain: "sonicwave-headphones",
      })
    } else {
      // Fill store data
      setStoreData({
        name: "TechGadgets Store",
        description:
          "Your one-stop shop for premium electronics and gadgets. We offer a curated selection of high-quality products at competitive prices.",
        about:
          "Founded in 2023, TechGadgets is dedicated to bringing the latest technology to our customers. We carefully select each product to ensure quality and performance.",
        tagline: "Premium Tech for Everyone",
        category: "electronics",
        footerContent: "© 2023 TechGadgets. All rights reserved. Free shipping on orders over $50.",
        contactEmail: "contact@techgadgets.example",
        color: "#6F4E37",
        accentColor: "#ECB176",
        domain: "techgadgets",
      })

      // Fill multi-product data
      setMultiProductsData([
        {
          name: "Wireless Headphones",
          description: "Premium wireless headphones with noise cancellation and long battery life.",
          price: "149.99",
          category: "electronics",
          features: "Active Noise Cancellation\n30-hour Battery Life\nBluetooth 5.2",
          images: ["/diverse-people-listening-headphones.png", "/headphones-detail-1.png"],
        },
        {
          name: "Smart Watch",
          description: "Track your fitness and stay connected with our advanced smart watch.",
          price: "199.99",
          category: "electronics",
          features: "Heart Rate Monitor\nSleep Tracking\nWater Resistant\nGPS",
          images: ["/fitness-watch.png", "/fitness-watch-detail-1.png"],
        },
        {
          name: "Wireless Charging Pad",
          description: "Fast wireless charging for all Qi-compatible devices.",
          price: "39.99",
          category: "electronics",
          features: "10W Fast Charging\nSlim Design\nLED Indicator\nMulti-Device Compatible",
          images: ["/charging-pad.png", "/charging-pad-detail-1.png"],
        },
      ])
    }

    // Clear any validation errors
    setErrors({})
  }

  // Step titles and descriptions
  const stepInfo = [
    {
      title: "Choose your product type",
      description: "Select whether you want to create a single product page or a multi-product store.",
    },
    {
      title: "Enter product information",
      description: "Provide details about your product to create a compelling product page.",
    },
    {
      title: "Select a template",
      description: "Choose a template that best showcases your product.",
    },
    {
      title: "Customize your design",
      description: "Personalize the appearance of your product page to match your brand.",
    },
    {
      title: "Review and publish",
      description: "Review your product page and make it live.",
    },
  ]

  // If we have a successful publish result, show the success screen
  if (publishResult?.success) {
    return (
      <div className="bg-[#FED8B1] py-8 h-screen flex items-center justify-center">
        <PublishSuccess 
          domain={publishResult.domain || ""} 
          productType={publishResult.productType || "single"} 
        />
      </div>
    )
  }

  const handlePreviewDeviceChange = (value: string) => {
    if (value === "full") {
      setIsFullPreviewOpen(true)
    } else {
      setPreviewDevice(value)
    }
  }

  const handleDomainValidationChange = (isAvailable: boolean | null, isChecking: boolean) => {
    setIsDomainChecking(isChecking);
    
    // Only update availability state in specific circumstances:
    // 1. When it changes from null to a boolean value (initial validation)
    // 2. When it changes from true to false (domain became invalid)
    // 3. When it changes from false to true (domain became valid)
    // This prevents unnecessary state updates during typing
    if (isAvailable !== null || isDomainAvailable === null) {
      setIsDomainAvailable(isAvailable);
    }
  }

  return (
    <div className="w-[95%] py-8 mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#6F4E37]">{stepInfo[step].title}</h1>
          <p className="text-gray-600 mt-1">{stepInfo[step].description}</p>
        </div>
        <Button
          onClick={fillWithDummyData}
          variant="outline"
          size="sm"
          className="border-[#ECB176] text-[#6F4E37] hover:bg-[#FED8B1]/20 flex items-center gap-1"
        >
          <Sparkles className="h-4 w-4" />
          Fill with Example Data
        </Button>
      </div>

      <ProgressIndicator step={step} steps={steps} />

      <div className="grid lg:grid-cols-5 gap-8 mt-8">
        <Card className="border-[#ECB176]/20 shadow-sm lg:col-span-2">
          <CardContent className="p-6">
            {step === 0 && <ProductTypeSelector productType={productType} setProductType={setProductType} />}

            {step === 1 && (
              <ProductInformationForm
                productData={productData}
                setProductData={setProductData}
                productType={productType}
                multiProductsData={multiProductsData}
                setMultiProductsData={setMultiProductsData}
                storeData={storeData}
                setStoreData={setStoreData}
                errors={errors}
                setErrors={setErrors}
              />
            )}

            {step === 2 && (
              <TemplateSelector
                selectedTemplate={selectedTemplate}
                setSelectedTemplate={setSelectedTemplate}
                productType={productType}
              />
            )}

            {step === 3 && (
              <CustomizationForm
                productData={productData}
                setProductData={setProductData}
                productType={productType}
                storeData={storeData}
                setStoreData={setStoreData}
              />
            )}

            {step === 4 && (
              <div className="space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-green-800">
                  <div className="flex items-start gap-3">
                    <div className="bg-green-100 p-2 rounded-full">
                      <Check className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Ready to Publish!</h3>
                      <p>
                        Your {productType === "single" ? "product" : "store"} is ready to be published. Choose a domain
                        and click the button below to make it live.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Domain selection */}
                <div className="bg-[#FED8B1]/10 rounded-lg p-6 border border-[#ECB176]/20">
                  <h3 className="text-lg font-semibold mb-4 text-[#6F4E37]">Choose Your Domain</h3>
                  <p className="text-gray-600 mb-4">
                    Select a unique domain for your {productType === "single" ? "product" : "store"}. This will be the
                    web address where customers can find you.
                  </p>

                  {productType === "single" ? (
                    <DomainValidator
                      value={productData.domain}
                      onChange={(value) => setProductData({ ...productData, domain: value })}
                      error={errors.domain}
                      className="mb-4"
                      onValidationChange={handleDomainValidationChange}
                    />
                  ) : (
                    <DomainValidator
                      value={storeData.domain}
                      onChange={(value) => setStoreData({ ...storeData, domain: value })}
                      error={errors.store_domain}
                      className="mb-4"
                      onValidationChange={handleDomainValidationChange}
                    />
                  )}

                  <p className="text-sm text-gray-500 mt-2">
                    Your site will be available at:{" "}
                    <span className="font-medium">
                      {productType === "single" ? productData.domain : storeData.domain}
                      {(productType === "single" ? productData.domain : storeData.domain) ? ".productshowcase.com" : ""}
                    </span>
                  </p>
                </div>

                <div className="bg-[#FED8B1]/30 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4 text-[#6F4E37]">Summary</h3>
                  <dl className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-[#ECB176]/20">
                      <dt className="font-medium text-gray-600">Type:</dt>
                      <dd className="font-semibold">
                        {productType === "single" ? "Single Product" : "Multi-Product Store"}
                      </dd>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#ECB176]/20">
                      <dt className="font-medium text-gray-600">Template:</dt>
                      <dd className="font-semibold">{selectedTemplate}</dd>
                    </div>
                    {productType === "single" ? (
                      <>
                        <div className="flex justify-between py-2 border-b border-[#ECB176]/20">
                          <dt className="font-medium text-gray-600">Product Name:</dt>
                          <dd className="font-semibold">{productData.name}</dd>
                        </div>
                        <div className="flex justify-between py-2 border-b border-[#ECB176]/20">
                          <dt className="font-medium text-gray-600">Price:</dt>
                          <dd className="font-semibold">
                            {productData.price.currency} {productData.price.yearly}
                          </dd>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between py-2 border-b border-[#ECB176]/20">
                          <dt className="font-medium text-gray-600">Store Name:</dt>
                          <dd className="font-semibold">{storeData.name}</dd>
                        </div>
                        <div className="flex justify-between py-2 border-b border-[#ECB176]/20">
                          <dt className="font-medium text-gray-600">Products:</dt>
                          <dd className="font-semibold">{multiProductsData.length}</dd>
                        </div>
                      </>
                    )}
                  </dl>
                </div>

                {/* Error message */}
                {publishResult?.error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
                    <p className="font-medium">Error: {publishResult.error}</p>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-between pt-6 mt-4">
              {step > 0 ? (
                <Button onClick={handleBack} variant="outline" className="flex items-center gap-1">
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
              ) : (
                <div></div>
              )}

              {step < 4 ? (
                <Button
                  onClick={handleNext}
                  className="bg-[#ECB176] hover:bg-[#D9A066] text-white flex items-center gap-1"
                >
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handlePublish}
                  disabled={isPublishing || isDomainChecking || isDomainAvailable !== true}
                  className="bg-[#ECB176] hover:bg-[#D9A066] text-white flex items-center gap-1"
                >
                  {isPublishing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Publishing...
                    </>
                  ) : isDomainChecking ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Checking domain...
                    </>
                  ) : isDomainAvailable !== true ? (
                    <>
                      {step === 4 && ((productType === "single" && productData.domain) || 
                      (productType === "multi" && storeData.domain)) ? (
                        <>
                          Validate domain first
                          <X className="h-4 w-4 ml-1" />
                        </>
                      ) : (
                        <>
                          Enter a valid domain
                          <X className="h-4 w-4 ml-1" />
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      Publish {productType === "single" ? "Product" : "Store"}
                      <Check className="h-4 w-4 ml-1" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="lg:sticky lg:top-24 self-start lg:col-span-3">
          <Card className="border-[#ECB176]/20 shadow-sm overflow-hidden">
            <CardContent className="p-0">
              <div className="bg-[#6F4E37] text-white p-4">
                <h2 className="text-lg font-medium">Live Preview</h2>
                <p className="text-sm text-white/80">See how your product will look</p>
                <Tabs value={previewDevice} onValueChange={handlePreviewDeviceChange} className="mt-2">
                  <TabsList className="bg-white/20">
                    <TabsTrigger
                      value="desktop"
                      className="data-[state=active]:bg-white data-[state=active]:text-[#6F4E37] text-white"
                    >
                      Desktop
                    </TabsTrigger>
                    <TabsTrigger
                      value="mobile"
                      className="data-[state=active]:bg-white data-[state=active]:text-[#6F4E37] text-white"
                    >
                      Mobile
                    </TabsTrigger>
                    <TabsTrigger
                      value="full"
                      className="data-[state=active]:bg-white data-[state=active]:text-[#6F4E37] text-white"
                    >
                      Full Page
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <div className="bg-gray-50 p-6 flex justify-center min-h-[500px]">
                <PreviewDevice
                  deviceType={previewDevice === "mobile" ? "mobile" : "desktop"}
                  templateType={selectedTemplate}
                  productData={productData}
                  productType={productType}
                  multiProductsData={multiProductsData}
                  storeData={storeData}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      {/* Full Preview Modal */}
      {isFullPreviewOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="bg-[#6F4E37] text-white p-4 flex justify-between items-center">
              <h2 className="text-lg font-medium">Full Page Preview</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFullPreviewOpen(false)}
                className="text-white hover:bg-white/20"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex-1 overflow-auto p-4 bg-gray-50">
              <PreviewDevice
                deviceType="desktop"
                templateType={selectedTemplate}
                productData={productData}
                productType={productType}
                multiProductsData={multiProductsData}
                storeData={storeData}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
