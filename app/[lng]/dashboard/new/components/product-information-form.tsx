"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageUploader } from "./image-uploader"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import FieldError from "./field-error"
import { PlusCircle, Trash2, Star, StarHalf } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface ProductInformationFormProps {
  productData: any
  setProductData: (data: any) => void
  productType: "single" | "multi"
  multiProductsData?: any[]
  setMultiProductsData?: (data: any[]) => void
  storeData?: any
  setStoreData?: (data: any) => void
  errors: Record<string, string>
  setErrors: (errors: Record<string, string>) => void
}

export function ProductInformationForm({
  productData,
  setProductData,
  productType,
  multiProductsData = [],
  setMultiProductsData = () => {},
  storeData = {},
  setStoreData = () => {},
  errors,
  setErrors,
}: ProductInformationFormProps) {
  const [activeTab, setActiveTab] = useState<string>(productType === "single" ? "product" : "store")
  const [expandedProducts, setExpandedProducts] = useState<number[]>([0])
  const [activeProductTab, setActiveProductTab] = useState<string>("basic")

  // Function to generate text based on context
  const generateTextWithAI = (fieldType: string, context: any) => {
    // Simulate AI text generation with templates
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        const templates: Record<string, string[]> = {
          productDescription: [
            `The ${context.name || "product"} is a premium quality item designed for ${context.category || "everyday use"}. It features exceptional craftsmanship and attention to detail, making it a perfect choice for those who value quality and performance.`,
            `Introducing our ${context.name || "product"}, the perfect solution for all your ${context.category || "needs"}. This high-quality item combines functionality with elegant design, ensuring you get the best experience possible.`,
            `Our ${context.name || "product"} stands out with its superior quality and innovative design. Perfect for ${context.category || "various uses"}, it offers reliability and performance that exceeds expectations.`,
          ],
          productTagline: [
            `The Ultimate ${context.category || "Product"} for Discerning Users`,
            `Redefining ${context.category || "Excellence"} with Innovative Design`,
            `Experience the Future of ${context.category || "Technology"} Today`,
          ],
          productFeatures: [
            `- Premium quality materials\n- Durable construction\n- Ergonomic design\n- Easy to use\n- Versatile functionality`,
            `- High-performance design\n- Long-lasting durability\n- Comfortable grip\n- Sleek appearance\n- Multiple color options`,
            `- Advanced technology\n- Eco-friendly materials\n- User-friendly interface\n- Compact size\n- Energy efficient`,
          ],
          productBenefits: [
            `- Enhances your daily routine\n- Saves you valuable time\n- Improves overall efficiency\n- Provides peace of mind\n- Delivers consistent results`,
            `- Boosts your productivity\n- Reduces stress and fatigue\n- Offers exceptional value\n- Simplifies complex tasks\n- Enhances your lifestyle`,
            `- Transforms your experience\n- Exceeds your expectations\n- Solves common problems\n- Delivers lasting satisfaction\n- Adapts to your needs`,
          ],
          storeDescription: [
            `Welcome to our store, your premier destination for high-quality ${context.category || "products"}. We pride ourselves on offering exceptional items that combine style, functionality, and durability.`,
            `Discover a curated collection of premium ${context.category || "products"} at our store. We're dedicated to providing you with the best shopping experience and products that exceed your expectations.`,
            `Our store specializes in top-tier ${context.category || "products"} designed to enhance your lifestyle. We carefully select each item to ensure it meets our high standards of quality and performance.`,
          ],
          aboutShop: [
            `Founded in ${new Date().getFullYear() - Math.floor(Math.random() * 10)}, our shop has been dedicated to providing customers with exceptional ${context.category || "products"} and service. We believe in quality, innovation, and customer satisfaction above all else.`,
            `Our journey began with a simple idea: to create a place where people could find the best ${context.category || "products"} without compromise. Today, we continue that mission with the same passion and dedication.`,
            `We are a team of enthusiasts who love what we do. Our expertise in ${context.category || "this field"} allows us to curate only the finest products for our customers, ensuring satisfaction with every purchase.`,
          ],
          storeTagline: [
            `Quality ${context.category || "Products"} for Discerning Customers`,
            `Elevate Your Experience with Premium ${context.category || "Items"}`,
            `Discover Excellence in ${context.category || "Shopping"}`,
          ],
          footerContent: [
            `© ${new Date().getFullYear()} ${context.name || "Our Store"}. All rights reserved. We're committed to providing you with the best shopping experience.`,
            `© ${new Date().getFullYear()} ${context.name || "Our Store"}. Quality products, exceptional service. Follow us on social media for updates and special offers.`,
            `© ${new Date().getFullYear()} ${context.name || "Our Store"}. Thank you for shopping with us. Your satisfaction is our priority.`,
          ],
          testimonial: [
            `This ${context.name || "product"} exceeded all my expectations. The quality and performance are outstanding, and it has significantly improved my daily routine.`,
            `I've tried many similar products, but this ${context.name || "product"} stands out for its exceptional design and functionality. Highly recommended!`,
            `As a professional in the ${context.category || "industry"}, I can confidently say this ${context.name || "product"} is among the best I've used. The attention to detail is impressive.`,
          ],
          faqQuestion: [
            `How long does the ${context.name || "product"} last?`,
            `Is the ${context.name || "product"} compatible with other devices?`,
            `What's included in the package?`,
            `Is there a warranty for the ${context.name || "product"}?`,
          ],
          faqAnswer: [
            `Our ${context.name || "product"} is designed to last for many years with proper care and maintenance. The high-quality materials and construction ensure durability and longevity.`,
            `Yes, our ${context.name || "product"} is compatible with most standard devices and systems. If you have specific compatibility concerns, please contact our support team.`,
            `The package includes the ${context.name || "product"}, a detailed user manual, and all necessary accessories for immediate use. Some models may include additional items.`,
            `Yes, all our products come with a standard 1-year manufacturer warranty covering any defects in materials or workmanship. Extended warranty options are also available.`,
          ],
          seoTitle: [
            `Premium ${context.name || "Product"} | ${context.brand || "Our Brand"}`,
            `${context.name || "Product"} - High-Quality ${context.category || "Item"} | ${context.brand || "Our Brand"}`,
            `${context.name || "Product"} - The Ultimate ${context.category || "Solution"} | ${context.brand || "Our Brand"}`,
          ],
          seoDescription: [
            `Experience the exceptional quality of our ${context.name || "product"}. Designed for ${context.category || "optimal performance"}, it offers unmatched value and reliability.`,
            `Discover our premium ${context.name || "product"}, the perfect ${context.category || "solution"} for discerning customers who demand the best in quality and performance.`,
            `Our ${context.name || "product"} combines innovative design with superior functionality, setting a new standard in the ${context.category || "industry"}.`,
          ],
          seoKeywords: [
            `${context.name || "product"}, premium ${context.category || "item"}, high-quality, best ${context.category || "product"}, top-rated`,
            `${context.category || "product"}, ${context.name || "item"}, professional, reliable, durable, innovative`,
            `${context.name || "product"} review, buy ${context.name || "product"}, ${context.category || "solution"}, affordable, quality`,
          ],
        }

        const templateArray = templates[fieldType] || templates.productDescription
        const randomIndex = Math.floor(Math.random() * templateArray.length)
        resolve(templateArray[randomIndex])
      }, 1000) // Simulate network delay
    })
  }

  // Function to handle AI text generation
  const handleGenerateText = async (fieldType: string, productIndex?: number) => {
    let context: any = {}
    let updateFunction: (text: string) => void

    if (fieldType.startsWith("product") && productType === "single") {
      // For single product
      context = {
        name: productData.name,
        category: productData.category,
        brand: "Your Brand",
      }
      updateFunction = (text: string) => {
        if (fieldType === "productDescription") {
          setProductData({ ...productData, description: text })
        } else if (fieldType === "productFeatures") {
          setProductData({ ...productData, features: text })
        } else if (fieldType === "productBenefits") {
          setProductData({ ...productData, benefits: text })
        } else if (fieldType === "productTagline") {
          setProductData({ ...productData, tagline: text })
        } else if (fieldType === "seoTitle") {
          setProductData({
            ...productData,
            seo: {
              ...(productData.seo || {}),
              title: text,
            },
          })
        } else if (fieldType === "seoDescription") {
          setProductData({
            ...productData,
            seo: {
              ...(productData.seo || {}),
              description: text,
            },
          })
        } else if (fieldType === "seoKeywords") {
          const keywords = text.split(",").map((k) => k.trim())
          setProductData({
            ...productData,
            seo: {
              ...(productData.seo || {}),
              keywords,
            },
          })
        }
      }
    } else if (fieldType.startsWith("product") && productType === "multi" && typeof productIndex === "number") {
      // For multi-product
      const product = multiProductsData[productIndex]
      context = { name: product.name, category: product.category }
      updateFunction = (text: string) => {
        const updatedProducts = [...multiProductsData]
        if (fieldType === "productDescription") {
          updatedProducts[productIndex] = { ...updatedProducts[productIndex], description: text }
        } else if (fieldType === "productFeatures") {
          updatedProducts[productIndex] = { ...updatedProducts[productIndex], features: text }
        }
        setMultiProductsData(updatedProducts)
      }
    } else {
      // For store information
      context = {
        name: storeData.name || "Our Store",
        category: storeData.category || "products",
      }
      updateFunction = (text: string) => {
        if (fieldType === "storeDescription") {
          setStoreData({ ...storeData, description: text })
        } else if (fieldType === "aboutShop") {
          setStoreData({ ...storeData, about: text })
        } else if (fieldType === "storeTagline") {
          setStoreData({ ...storeData, tagline: text })
        } else if (fieldType === "footerContent") {
          setStoreData({ ...storeData, footerContent: text })
        }
      }
    }

    try {
      const generatedText = await generateTextWithAI(fieldType, context)
      updateFunction(generatedText)
    } catch (error) {
      console.error("Error generating text:", error)
    }
  }

  // Function to toggle product expansion in multi-product mode
  const toggleProductExpansion = (index: number) => {
    if (expandedProducts.includes(index)) {
      setExpandedProducts(expandedProducts.filter((i) => i !== index))
    } else {
      setExpandedProducts([...expandedProducts, index])
    }
  }

  // Function to add a new product in multi-product mode
  const addNewProduct = () => {
    const newProduct = {
      name: "",
      description: "",
      price: "",
      category: "",
      features: "",
      images: [],
    }
    setMultiProductsData([...multiProductsData, newProduct])
    setExpandedProducts([...expandedProducts, multiProductsData.length])
  }

  // Function to remove a product in multi-product mode
  const removeProduct = (index: number) => {
    const updatedProducts = [...multiProductsData]
    updatedProducts.splice(index, 1)
    setMultiProductsData(updatedProducts)
    setExpandedProducts(expandedProducts.filter((i) => i !== index).map((i) => (i > index ? i - 1 : i)))
  }

  // Function to update a field and clear its error
  const updateField = (field: string, value: string | number | null, productIndex?: number) => {
    // Clear the error for this field
    if (errors[field] || (productIndex !== undefined && errors[`product_${productIndex}_${field}`])) {
      const newErrors = { ...errors }
      if (productIndex !== undefined) {
        delete newErrors[`product_${productIndex}_${field}`]
      } else {
        delete newErrors[field]
      }
      setErrors(newErrors)
    }

    // Update the field value
    if (productIndex !== undefined && productType === "multi") {
      const updatedProducts = [...multiProductsData]
      updatedProducts[productIndex] = { ...updatedProducts[productIndex], [field]: value }
      setMultiProductsData(updatedProducts)
    } else if (field.startsWith("store_")) {
      const storeField = field.replace("store_", "")
      setStoreData({ ...storeData, [storeField]: value })
    } else {
      // Handle nested fields
      if (field.includes(".")) {
        const [parent, child, subChild] = field.split(".")
        if (subChild) {
          // Handle three-level nesting (e.g., price.currency)
          setProductData({
            ...productData,
            [parent]: {
              ...(productData[parent] || {}),
              [child]: {
                ...(productData[parent]?.[child] || {}),
                [subChild]: value,
              },
            },
          })
        } else {
          // Handle two-level nesting (e.g., price.currency)
          setProductData({
            ...productData,
            [parent]: {
              ...(productData[parent] || {}),
              [child]: value,
            },
          })
        }
      } else {
        // Handle top-level fields
        setProductData({ ...productData, [field]: value })
      }
    }
  }

  // Function to add a new testimonial
  const addTestimonial = () => {
    const newTestimonial = {
      name: "",
      title: "",
      quote: "",
      avatar: "",
      rating: 5,
    }

    const updatedTestimonials = [...(productData.testimonials || [])]
    updatedTestimonials.push(newTestimonial)

    setProductData({
      ...productData,
      testimonials: updatedTestimonials,
    })
  }

  // Function to update a testimonial
  const updateTestimonial = (index: number, field: string, value: string | number) => {
    const updatedTestimonials = [...(productData.testimonials || [])]
    updatedTestimonials[index] = {
      ...updatedTestimonials[index],
      [field]: value,
    }

    setProductData({
      ...productData,
      testimonials: updatedTestimonials,
    })
  }

  // Function to remove a testimonial
  const removeTestimonial = (index: number) => {
    const updatedTestimonials = [...(productData.testimonials || [])]
    updatedTestimonials.splice(index, 1)

    setProductData({
      ...productData,
      testimonials: updatedTestimonials,
    })
  }

  // Function to add a new FAQ
  const addFaq = () => {
    const newFaq = {
      question: "",
      answer: "",
    }

    const updatedFaqs = [...(productData.faq || [])]
    updatedFaqs.push(newFaq)

    setProductData({
      ...productData,
      faq: updatedFaqs,
    })
  }

  // Function to update an FAQ
  const updateFaq = (index: number, field: string, value: string) => {
    const updatedFaqs = [...(productData.faq || [])]
    updatedFaqs[index] = {
      ...updatedFaqs[index],
      [field]: value,
    }

    setProductData({
      ...productData,
      faq: updatedFaqs,
    })
  }

  // Function to remove an FAQ
  const removeFaq = (index: number) => {
    const updatedFaqs = [...(productData.faq || [])]
    updatedFaqs.splice(index, 1)

    setProductData({
      ...productData,
      faq: updatedFaqs,
    })
  }

  // Function to render star rating
  const renderStarRating = (rating: number, maxRating = 5) => {
    const stars = []
    for (let i = 1; i <= maxRating; i++) {
      if (i <= rating) {
        stars.push(<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)
      } else if (i - 0.5 <= rating) {
        stars.push(<StarHalf key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)
      } else {
        stars.push(<Star key={i} className="h-4 w-4 text-gray-300" />)
      }
    }
    return <div className="flex">{stars}</div>
  }

  return (
    <div className="space-y-6">
      {productType === "multi" && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="store">Store Information</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
          </TabsList>

          <TabsContent value="store" className="space-y-6 mt-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="store_name">Store Name</Label>
                <Input
                  id="store_name"
                  value={storeData.name || ""}
                  onChange={(e) => updateField("store_name", e.target.value)}
                  placeholder="Enter your store name"
                  className={errors.store_name ? "border-red-500" : ""}
                />
                <FieldError error={errors.store_name} />
              </div>

              <div>
                <Label htmlFor="store_category">Store Category</Label>
                <Select
                  value={storeData.category || ""}
                  onValueChange={(value) => updateField("store_category", value)}
                >
                  <SelectTrigger className={errors.store_category ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="clothing">Clothing & Fashion</SelectItem>
                    <SelectItem value="home">Home & Garden</SelectItem>
                    <SelectItem value="beauty">Beauty & Personal Care</SelectItem>
                    <SelectItem value="sports">Sports & Outdoors</SelectItem>
                    <SelectItem value="toys">Toys & Games</SelectItem>
                    <SelectItem value="books">Books & Media</SelectItem>
                    <SelectItem value="health">Health & Wellness</SelectItem>
                    <SelectItem value="jewelry">Jewelry & Accessories</SelectItem>
                    <SelectItem value="art">Art & Collectibles</SelectItem>
                    <SelectItem value="food">Food & Beverages</SelectItem>
                    <SelectItem value="pets">Pet Supplies</SelectItem>
                    <SelectItem value="automotive">Automotive</SelectItem>
                    <SelectItem value="office">Office Supplies</SelectItem>
                  </SelectContent>
                </Select>
                <FieldError error={errors.store_category} />
              </div>

              <div>
                <Label htmlFor="store_tagline">Store Tagline/Subtitle</Label>
                <div className="relative">
                  <Textarea
                    id="store_tagline"
                    value={storeData.tagline || ""}
                    onChange={(e) => updateField("store_tagline", e.target.value)}
                    placeholder="Enter a catchy tagline for your store"
                    className={`min-h-[80px] ${errors.store_tagline ? "border-red-500" : ""}`}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="absolute right-2 bottom-2 text-xs"
                    onClick={() => handleGenerateText("storeTagline")}
                  >
                    Generate with AI
                  </Button>
                </div>
                <FieldError error={errors.store_tagline} />
              </div>

              <div>
                <Label htmlFor="store_description">Store Description</Label>
                <div className="relative">
                  <Textarea
                    id="store_description"
                    value={storeData.description || ""}
                    onChange={(e) => updateField("store_description", e.target.value)}
                    placeholder="Describe your store and what you offer"
                    className={`min-h-[120px] ${errors.store_description ? "border-red-500" : ""}`}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="absolute right-2 bottom-2 text-xs"
                    onClick={() => handleGenerateText("storeDescription")}
                  >
                    Generate with AI
                  </Button>
                </div>
                <FieldError error={errors.store_description} />
              </div>

              <div>
                <Label htmlFor="store_about">About Your Shop</Label>
                <div className="relative">
                  <Textarea
                    id="store_about"
                    value={storeData.about || ""}
                    onChange={(e) => updateField("store_about", e.target.value)}
                    placeholder="Tell customers about your shop, its history, and values"
                    className={`min-h-[150px] ${errors.store_about ? "border-red-500" : ""}`}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="absolute right-2 bottom-2 text-xs"
                    onClick={() => handleGenerateText("aboutShop")}
                  >
                    Generate with AI
                  </Button>
                </div>
                <FieldError error={errors.store_about} />
              </div>

              <div>
                <Label htmlFor="store_footer">Footer Content</Label>
                <div className="relative">
                  <Textarea
                    id="store_footer"
                    value={storeData.footerContent || ""}
                    onChange={(e) => updateField("store_footerContent", e.target.value)}
                    placeholder="Enter content for your store footer"
                    className={`min-h-[100px] ${errors.store_footerContent ? "border-red-500" : ""}`}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="absolute right-2 bottom-2 text-xs"
                    onClick={() => handleGenerateText("footerContent")}
                  >
                    Generate with AI
                  </Button>
                </div>
                <FieldError error={errors.store_footerContent} />
              </div>

              <div>
                <Label htmlFor="store_contact">Contact Email</Label>
                <Input
                  id="store_contact"
                  type="email"
                  value={storeData.contactEmail || ""}
                  onChange={(e) => updateField("store_contactEmail", e.target.value)}
                  placeholder="Enter your contact email"
                  className={errors.store_contactEmail ? "border-red-500" : ""}
                />
                <FieldError error={errors.store_contactEmail} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="products" className="space-y-6 mt-6">
            {multiProductsData.map((product, index) => (
              <div key={index} className="border rounded-lg p-4 mb-4">
                <div
                  className="flex justify-between items-center cursor-pointer mb-4"
                  onClick={() => toggleProductExpansion(index)}
                >
                  <h3 className="font-medium text-lg">{product.name || `Product ${index + 1}`}</h3>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeProduct(index)
                      }}
                      className="text-red-500 hover:text-red-700"
                      disabled={multiProductsData.length <= 1}
                    >
                      Remove
                    </Button>
                    <Button variant="ghost" size="sm">
                      {expandedProducts.includes(index) ? "Collapse" : "Expand"}
                    </Button>
                  </div>
                </div>

                {expandedProducts.includes(index) && (
                  <div className="space-y-4 pt-2">
                    <div>
                      <Label htmlFor={`product_${index}_name`}>Product Name</Label>
                      <Input
                        id={`product_${index}_name`}
                        value={product.name || ""}
                        onChange={(e) => updateField("name", e.target.value, index)}
                        placeholder="Enter product name"
                        className={errors[`product_${index}_name`] ? "border-red-500" : ""}
                      />
                      <FieldError error={errors[`product_${index}_name`]} />
                    </div>

                    <div>
                      <Label htmlFor={`product_${index}_price`}>Price</Label>
                      <Input
                        id={`product_${index}_price`}
                        value={product.price || ""}
                        onChange={(e) => updateField("price", e.target.value, index)}
                        placeholder="Enter product price"
                        className={errors[`product_${index}_price`] ? "border-red-500" : ""}
                      />
                      <FieldError error={errors[`product_${index}_price`]} />
                    </div>

                    <div>
                      <Label htmlFor={`product_${index}_category`}>Category</Label>
                      <Select
                        value={product.category || ""}
                        onValueChange={(value) => updateField("category", value, index)}
                      >
                        <SelectTrigger className={errors[`product_${index}_category`] ? "border-red-500" : ""}>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="electronics">Electronics</SelectItem>
                          <SelectItem value="clothing">Clothing</SelectItem>
                          <SelectItem value="home">Home & Garden</SelectItem>
                          <SelectItem value="beauty">Beauty</SelectItem>
                          <SelectItem value="sports">Sports & Outdoors</SelectItem>
                          <SelectItem value="toys">Toys & Games</SelectItem>
                          <SelectItem value="books">Books & Media</SelectItem>
                        </SelectContent>
                      </Select>
                      <FieldError error={errors[`product_${index}_category`]} />
                    </div>

                    <div>
                      <Label htmlFor={`product_${index}_description`}>Description</Label>
                      <div className="relative">
                        <Textarea
                          id={`product_${index}_description`}
                          value={product.description || ""}
                          onChange={(e) => updateField("description", e.target.value, index)}
                          placeholder="Describe your product"
                          className={`min-h-[120px] ${errors[`product_${index}_description`] ? "border-red-500" : ""}`}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="absolute right-2 bottom-2 text-xs"
                          onClick={() => handleGenerateText("productDescription", index)}
                        >
                          Generate with AI
                        </Button>
                      </div>
                      <FieldError error={errors[`product_${index}_description`]} />
                    </div>

                    <div>
                      <Label htmlFor={`product_${index}_features`}>Features</Label>
                      <div className="relative">
                        <Textarea
                          id={`product_${index}_features`}
                          value={product.features || ""}
                          onChange={(e) => updateField("features", e.target.value, index)}
                          placeholder="List the key features of your product (one per line)"
                          className={`min-h-[120px] ${errors[`product_${index}_features`] ? "border-red-500" : ""}`}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="absolute right-2 bottom-2 text-xs"
                          onClick={() => handleGenerateText("productFeatures", index)}
                        >
                          Generate with AI
                        </Button>
                      </div>
                      <FieldError error={errors[`product_${index}_features`]} />
                    </div>

                    <div>
                      <Label>Product Images</Label>
                      <ImageUploader
                        images={product.images || []}
                        setImages={(images) => {
                          const updatedProducts = [...multiProductsData]
                          updatedProducts[index] = { ...updatedProducts[index], images }
                          setMultiProductsData(updatedProducts)

                          // Clear error if it exists
                          if (errors[`product_${index}_images`]) {
                            const newErrors = { ...errors }
                            delete newErrors[`product_${index}_images`]
                            setErrors(newErrors)
                          }
                        }}
                      />
                      <FieldError error={errors[`product_${index}_images`]} />
                    </div>
                  </div>
                )}
              </div>
            ))}

            <Button type="button" onClick={addNewProduct} className="w-full flex items-center justify-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Add Another Product
            </Button>
          </TabsContent>
        </Tabs>
      )}

      {productType === "single" && (
        <div className="space-y-4">
          <Tabs value={activeProductTab} onValueChange={setActiveProductTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
              <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
              <TabsTrigger value="seo">SEO & Brand</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6 mt-6">
              <div>
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  value={productData.name || ""}
                  onChange={(e) => updateField("name", e.target.value)}
                  placeholder="Enter product name"
                  className={errors.name ? "border-red-500" : ""}
                />
                <FieldError error={errors.name} />
              </div>

              <div>
                <Label htmlFor="tagline">Product Tagline</Label>
                <div className="relative">
                  <Input
                    id="tagline"
                    value={productData.tagline || ""}
                    onChange={(e) => updateField("tagline", e.target.value)}
                    placeholder="Enter a catchy tagline for your product"
                    className={errors.tagline ? "border-red-500" : ""}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-xs"
                    onClick={() => handleGenerateText("productTagline")}
                  >
                    Generate
                  </Button>
                </div>
                <FieldError error={errors.tagline} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price.currency">Currency</Label>
                  <Select
                    value={productData.price?.currency || "USD"}
                    onValueChange={(value) => updateField("price.currency", value)}
                  >
                    <SelectTrigger className={errors["price.currency"] ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                      <SelectItem value="JPY">JPY (¥)</SelectItem>
                      <SelectItem value="CAD">CAD (C$)</SelectItem>
                      <SelectItem value="AUD">AUD (A$)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FieldError error={errors["price.currency"]} />
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={productData.category || ""} onValueChange={(value) => updateField("category", value)}>
                    <SelectTrigger className={errors.category ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="clothing">Clothing</SelectItem>
                      <SelectItem value="home">Home & Garden</SelectItem>
                      <SelectItem value="beauty">Beauty</SelectItem>
                      <SelectItem value="sports">Sports & Outdoors</SelectItem>
                      <SelectItem value="toys">Toys & Games</SelectItem>
                      <SelectItem value="books">Books & Media</SelectItem>
                    </SelectContent>
                  </Select>
                  <FieldError error={errors.category} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price.monthly">Monthly Price</Label>
                  <Input
                    id="price.monthly"
                    type="number"
                    value={productData.price?.monthly || ""}
                    onChange={(e) =>
                      updateField("price.monthly", e.target.value === "" ? null : Number.parseFloat(e.target.value))
                    }
                    placeholder="Monthly price (optional)"
                    className={errors["price.monthly"] ? "border-red-500" : ""}
                  />
                  <FieldError error={errors["price.monthly"]} />
                </div>

                <div>
                  <Label htmlFor="price.yearly">Yearly Price</Label>
                  <Input
                    id="price.yearly"
                    type="number"
                    value={productData.price?.yearly || ""}
                    onChange={(e) =>
                      updateField("price.yearly", e.target.value === "" ? null : Number.parseFloat(e.target.value))
                    }
                    placeholder="Yearly price (optional)"
                    className={errors["price.yearly"] ? "border-red-500" : ""}
                  />
                  <FieldError error={errors["price.yearly"]} />
                </div>
              </div>

              <div>
                <Label htmlFor="price.discountNote">Discount Note</Label>
                <Input
                  id="price.discountNote"
                  value={productData.price?.discountNote || ""}
                  onChange={(e) => updateField("price.discountNote", e.target.value)}
                  placeholder="E.g., Save 20% with annual billing"
                  className={errors["price.discountNote"] ? "border-red-500" : ""}
                />
                <FieldError error={errors["price.discountNote"]} />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <div className="relative">
                  <Textarea
                    id="description"
                    value={productData.description || ""}
                    onChange={(e) => updateField("description", e.target.value)}
                    placeholder="Describe your product"
                    className={`min-h-[120px] ${errors.description ? "border-red-500" : ""}`}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="absolute right-2 bottom-2 text-xs"
                    onClick={() => handleGenerateText("productDescription")}
                  >
                    Generate with AI
                  </Button>
                </div>
                <FieldError error={errors.description} />
              </div>

              <div>
                <Label htmlFor="features">Features</Label>
                <div className="relative">
                  <Textarea
                    id="features"
                    value={productData.features || ""}
                    onChange={(e) => updateField("features", e.target.value)}
                    placeholder="List the key features of your product (one per line)"
                    className={`min-h-[120px] ${errors.features ? "border-red-500" : ""}`}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="absolute right-2 bottom-2 text-xs"
                    onClick={() => handleGenerateText("productFeatures")}
                  >
                    Generate with AI
                  </Button>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Enter one feature per line. These will be converted to a list.
                </p>
                <FieldError error={errors.features} />
              </div>

              <div>
                <Label htmlFor="benefits">Benefits</Label>
                <div className="relative">
                  <Textarea
                    id="benefits"
                    value={productData.benefits || ""}
                    onChange={(e) => updateField("benefits", e.target.value)}
                    placeholder="List the benefits of your product (one per line)"
                    className={`min-h-[120px] ${errors.benefits ? "border-red-500" : ""}`}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="absolute right-2 bottom-2 text-xs"
                    onClick={() => handleGenerateText("productBenefits")}
                  >
                    Generate with AI
                  </Button>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Enter one benefit per line. These will be converted to a list.
                </p>
                <FieldError error={errors.benefits} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="callToAction.text">Call to Action Text</Label>
                  <Input
                    id="callToAction.text"
                    value={productData.callToAction?.text || ""}
                    onChange={(e) => updateField("callToAction.text", e.target.value)}
                    placeholder="E.g., Buy Now, Learn More"
                    className={errors["callToAction.text"] ? "border-red-500" : ""}
                  />
                  <FieldError error={errors["callToAction.text"]} />
                </div>

                <div>
                  <Label htmlFor="callToAction.url">Call to Action URL</Label>
                  <Input
                    id="callToAction.url"
                    value={productData.callToAction?.url || ""}
                    onChange={(e) => updateField("callToAction.url", e.target.value)}
                    placeholder="E.g., #pricing, /checkout"
                    className={errors["callToAction.url"] ? "border-red-500" : ""}
                  />
                  <FieldError error={errors["callToAction.url"]} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="media" className="space-y-6 mt-6">
              <div>
                <Label>Product Images</Label>
                <ImageUploader
                  images={productData.media?.images || []}
                  setImages={(images) => {
                    setProductData({
                      ...productData,
                      media: {
                        ...(productData.media || {}),
                        images,
                      },
                    })

                    // Clear error if it exists
                    if (errors["media.images"]) {
                      const newErrors = { ...errors }
                      delete newErrors["media.images"]
                      setErrors(newErrors)
                    }
                  }}
                />
                <FieldError error={errors["media.images"]} />
              </div>

              <div>
                <Label htmlFor="media.video">Video URL</Label>
                <Input
                  id="media.video"
                  value={productData.media?.video || ""}
                  onChange={(e) => updateField("media.video", e.target.value)}
                  placeholder="Enter YouTube embed URL (e.g., https://www.youtube.com/embed/VIDEO_ID)"
                  className={errors["media.video"] ? "border-red-500" : ""}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Use the embed URL format: https://www.youtube.com/embed/VIDEO_ID
                </p>
                <FieldError error={errors["media.video"]} />

                {productData.media?.video && (
                  <div className="mt-4 border rounded-lg overflow-hidden">
                    <div className="aspect-video">
                      <iframe
                        width="100%"
                        height="100%"
                        src={productData.media.video}
                        title="Product video"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="testimonials" className="space-y-6 mt-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Customer Testimonials</h3>
                <Button type="button" onClick={addTestimonial} size="sm" className="flex items-center gap-1">
                  <PlusCircle className="h-4 w-4" />
                  Add Testimonial
                </Button>
              </div>

              {(productData.testimonials || []).length === 0 ? (
                <div className="text-center py-8 border rounded-lg bg-gray-50">
                  <p className="text-gray-500">No testimonials added yet. Click the button above to add one.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {(productData.testimonials || []).map((testimonial, index) => (
                    <Card key={index} className="relative">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => removeTestimonial(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>

                      <CardHeader>
                        <CardTitle className="text-base">Testimonial {index + 1}</CardTitle>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`testimonial_${index}_name`}>Name</Label>
                            <Input
                              id={`testimonial_${index}_name`}
                              value={testimonial.name || ""}
                              onChange={(e) => updateTestimonial(index, "name", e.target.value)}
                              placeholder="Customer name"
                            />
                          </div>

                          <div>
                            <Label htmlFor={`testimonial_${index}_title`}>Title/Position</Label>
                            <Input
                              id={`testimonial_${index}_title`}
                              value={testimonial.title || ""}
                              onChange={(e) => updateTestimonial(index, "title", e.target.value)}
                              placeholder="E.g., CEO, Customer"
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor={`testimonial_${index}_quote`}>Testimonial</Label>
                          <Textarea
                            id={`testimonial_${index}_quote`}
                            value={testimonial.quote || ""}
                            onChange={(e) => updateTestimonial(index, "quote", e.target.value)}
                            placeholder="What the customer said about your product"
                            className="min-h-[100px]"
                          />
                        </div>

                        <div>
                          <Label htmlFor={`testimonial_${index}_avatar`}>Avatar URL</Label>
                          <Input
                            id={`testimonial_${index}_avatar`}
                            value={testimonial.avatar || ""}
                            onChange={(e) => updateTestimonial(index, "avatar", e.target.value)}
                            placeholder="URL to customer's avatar image"
                          />
                        </div>

                        <div>
                          <Label>Rating</Label>
                          <div className="flex items-center gap-2 mt-2">
                            {renderStarRating(testimonial.rating || 5)}
                            <Select
                              value={String(testimonial.rating || 5)}
                              onValueChange={(value) => updateTestimonial(index, "rating", Number.parseInt(value))}
                            >
                              <SelectTrigger className="w-24">
                                <SelectValue placeholder="Rating" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1">1 Star</SelectItem>
                                <SelectItem value="2">2 Stars</SelectItem>
                                <SelectItem value="3">3 Stars</SelectItem>
                                <SelectItem value="4">4 Stars</SelectItem>
                                <SelectItem value="5">5 Stars</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="faq" className="space-y-6 mt-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Frequently Asked Questions</h3>
                <Button type="button" onClick={addFaq} size="sm" className="flex items-center gap-1">
                  <PlusCircle className="h-4 w-4" />
                  Add FAQ
                </Button>
              </div>

              {(productData.faq || []).length === 0 ? (
                <div className="text-center py-8 border rounded-lg bg-gray-50">
                  <p className="text-gray-500">No FAQs added yet. Click the button above to add one.</p>
                </div>
              ) : (
                <Accordion type="single" collapsible className="w-full">
                  {(productData.faq || []).map((faq, index) => (
                    <AccordionItem key={index} value={`faq-${index}`} className="border rounded-lg mb-4 px-4">
                      <div className="flex items-center justify-between">
                        <AccordionTrigger className="text-left">{faq.question || `FAQ ${index + 1}`}</AccordionTrigger>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={(e) => {
                            e.stopPropagation()
                            removeFaq(index)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <AccordionContent>
                        <div className="space-y-4 pt-2">
                          <div>
                            <Label htmlFor={`faq_${index}_question`}>Question</Label>
                            <Input
                              id={`faq_${index}_question`}
                              value={faq.question || ""}
                              onChange={(e) => updateFaq(index, "question", e.target.value)}
                              placeholder="Enter the question"
                            />
                          </div>

                          <div>
                            <Label htmlFor={`faq_${index}_answer`}>Answer</Label>
                            <Textarea
                              id={`faq_${index}_answer`}
                              value={faq.answer || ""}
                              onChange={(e) => updateFaq(index, "answer", e.target.value)}
                              placeholder="Enter the answer"
                              className="min-h-[100px]"
                            />
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </TabsContent>

            <TabsContent value="seo" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Brand Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="brand.name">Brand Name</Label>
                    <Input
                      id="brand.name"
                      value={productData.brand?.name || ""}
                      onChange={(e) => updateField("brand.name", e.target.value)}
                      placeholder="Your brand name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="brand.logo">Brand Logo URL</Label>
                    <Input
                      id="brand.logo"
                      value={productData.brand?.logo || ""}
                      onChange={(e) => updateField("brand.logo", e.target.value)}
                      placeholder="URL to your brand logo"
                    />
                  </div>

                  <div>
                    <Label htmlFor="brand.contactEmail">Contact Email</Label>
                    <Input
                      id="brand.contactEmail"
                      type="email"
                      value={productData.brand?.contactEmail || ""}
                      onChange={(e) => updateField("brand.contactEmail", e.target.value)}
                      placeholder="Contact email for customers"
                    />
                  </div>

                  <div>
                    <Label>Social Links</Label>
                    <div className="grid grid-cols-3 gap-4 mt-2">
                      <div>
                        <Label htmlFor="brand.socialLinks.twitter" className="text-xs">
                          Twitter
                        </Label>
                        <Input
                          id="brand.socialLinks.twitter"
                          value={productData.brand?.socialLinks?.twitter || ""}
                          onChange={(e) => updateField("brand.socialLinks.twitter", e.target.value)}
                          placeholder="Twitter URL"
                        />
                      </div>

                      <div>
                        <Label htmlFor="brand.socialLinks.linkedin" className="text-xs">
                          LinkedIn
                        </Label>
                        <Input
                          id="brand.socialLinks.linkedin"
                          value={productData.brand?.socialLinks?.linkedin || ""}
                          onChange={(e) => updateField("brand.socialLinks.linkedin", e.target.value)}
                          placeholder="LinkedIn URL"
                        />
                      </div>

                      <div>
                        <Label htmlFor="brand.socialLinks.facebook" className="text-xs">
                          Facebook
                        </Label>
                        <Input
                          id="brand.socialLinks.facebook"
                          value={productData.brand?.socialLinks?.facebook || ""}
                          onChange={(e) => updateField("brand.socialLinks.facebook", e.target.value)}
                          placeholder="Facebook URL"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>SEO Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="seo.title">SEO Title</Label>
                    <div className="relative">
                      <Input
                        id="seo.title"
                        value={productData.seo?.title || ""}
                        onChange={(e) => updateField("seo.title", e.target.value)}
                        placeholder="SEO title for your product page"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-xs"
                        onClick={() => handleGenerateText("seoTitle")}
                      >
                        Generate
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="seo.description">Meta Description</Label>
                    <div className="relative">
                      <Textarea
                        id="seo.description"
                        value={productData.seo?.description || ""}
                        onChange={(e) => updateField("seo.description", e.target.value)}
                        placeholder="Meta description for search engines"
                        className="min-h-[100px]"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="absolute right-2 bottom-2 text-xs"
                        onClick={() => handleGenerateText("seoDescription")}
                      >
                        Generate
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="seo.keywords">Keywords</Label>
                    <div className="relative">
                      <Textarea
                        id="seo.keywords"
                        value={(productData.seo?.keywords || []).join(", ")}
                        onChange={(e) => {
                          const keywords = e.target.value
                            .split(",")
                            .map((k) => k.trim())
                            .filter(Boolean)
                          updateField("seo.keywords", keywords)
                        }}
                        placeholder="Enter keywords separated by commas"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="absolute right-2 bottom-2 text-xs"
                        onClick={() => handleGenerateText("seoKeywords")}
                      >
                        Generate
                      </Button>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Enter keywords separated by commas</p>
                  </div>

                  <div>
                    <Label htmlFor="seo.image">Social Share Image URL</Label>
                    <Input
                      id="seo.image"
                      value={productData.seo?.image || ""}
                      onChange={(e) => updateField("seo.image", e.target.value)}
                      placeholder="URL to image used when sharing on social media"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  )
}
