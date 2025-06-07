"use client"

import { useState } from "react"
import { Sparkles, Loader2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"

interface AiTextGeneratorProps {
  fieldId: string
  fieldLabel: string
  placeholder: string
  currentValue: string
  onValueChange: (value: string) => void
  contextData?: Record<string, any>
  promptTemplate: string
}

// Simulated AI text generation using templates
const generateTextFromTemplate = (template: string, contextData: Record<string, any>) => {
  let result = template

  // Replace placeholders with actual values
  Object.entries(contextData).forEach(([key, value]) => {
    const placeholder = `{${key}}`
    if (typeof value === "string" && value.trim() !== "") {
      result = result.replace(new RegExp(placeholder, "g"), value)
    } else {
      // Replace with generic text if value is empty
      result = result.replace(new RegExp(placeholder, "g"), `[${key}]`)
    }
  })

  return result
}

// Template library for different content types
const templates = {
  productDescription: [
    "Introducing the {name}, a premium {category} designed for those who demand excellence. {features} With its exceptional quality and thoughtful design, this product offers unmatched value and performance.",
    "The {name} is a standout {category} that combines style and functionality. {features} Perfect for everyday use, this product will exceed your expectations in every way.",
    "Meet the {name} - the revolutionary {category} that's changing the game. {features} Whether you're a professional or enthusiast, this product delivers outstanding results every time.",
  ],
  storeDescription: [
    "Welcome to {storeName}, your premier destination for high-quality {storeCategory} products. We offer a carefully curated selection of items designed to enhance your lifestyle and meet your needs.",
    "{storeName} is a specialized online store focused on providing exceptional {storeCategory} products. Our mission is to deliver outstanding quality, value, and customer service with every purchase.",
    "At {storeName}, we're passionate about {storeCategory}. Our store features a handpicked collection of the finest products in the market, ensuring you always find exactly what you're looking for.",
  ],
  aboutStore: [
    "Founded with a passion for {storeCategory}, {storeName} has grown to become a trusted name in the industry. Our team of experts carefully selects each product to ensure it meets our high standards of quality and performance.",
    "{storeName} began with a simple idea: to provide customers with the best {storeCategory} products available. Today, we continue that mission by offering exceptional products backed by outstanding customer service.",
    "The story of {storeName} is one of dedication to quality and service. Specializing in {storeCategory}, we work tirelessly to bring you products that combine innovation, craftsmanship, and value.",
  ],
  storeTagline: [
    "Premium {storeCategory} for discerning customers",
    "Elevating your {storeCategory} experience",
    "Quality {storeCategory} for every lifestyle",
    "Discover the difference at {storeName}",
  ],
  footerContent: [
    "© {currentYear} {storeName}. All rights reserved. We're committed to providing exceptional {storeCategory} products and outstanding customer service.",
    "© {currentYear} {storeName} - Your trusted source for premium {storeCategory}. Contact us at {contactEmail} for assistance.",
    "{storeName} © {currentYear} | Quality {storeCategory} delivered to your doorstep | Contact: {contactEmail}",
  ],
  features: [
    "Featuring advanced technology, premium materials, and expert craftsmanship, this product stands out from the competition.",
    "With its innovative design, durable construction, and attention to detail, this product offers exceptional value and performance.",
    "Combining cutting-edge features, reliable performance, and elegant design, this product is the perfect choice for discerning customers.",
  ],
}

export function AiTextGenerator({
  fieldId,
  fieldLabel,
  placeholder,
  currentValue,
  onValueChange,
  contextData = {},
  promptTemplate,
}: AiTextGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedText, setGeneratedText] = useState("")
  const [showSuggestion, setShowSuggestion] = useState(false)

  const generateSuggestion = async () => {
    setIsGenerating(true)
    setShowSuggestion(false)

    try {
      // Add current year to context data
      const enhancedContext = {
        ...contextData,
        currentYear: new Date().getFullYear().toString(),
      }

      // Determine which template set to use based on fieldId
      let templateSet: string[] = templates.productDescription

      if (fieldId.includes("description") && contextData.storeName) {
        templateSet = templates.storeDescription
      } else if (fieldId.includes("about")) {
        templateSet = templates.aboutStore
      } else if (fieldId.includes("tagline")) {
        templateSet = templates.storeTagline
      } else if (fieldId.includes("footer")) {
        templateSet = templates.footerContent
      } else if (fieldId.includes("features")) {
        templateSet = templates.features
      }

      // Select a random template from the appropriate set
      const selectedTemplate = templateSet[Math.floor(Math.random() * templateSet.length)]

      // Generate text using the template and context data
      const generatedContent = generateTextFromTemplate(selectedTemplate, enhancedContext)

      // Simulate network delay for a more realistic experience
      setTimeout(() => {
        setGeneratedText(generatedContent)
        setShowSuggestion(true)
        setIsGenerating(false)
      }, 1500)
    } catch (error) {
      console.error("Error generating text:", error)
      setIsGenerating(false)
    }
  }

  const applySuggestion = () => {
    onValueChange(generatedText)
    setShowSuggestion(false)
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label htmlFor={fieldId} className="text-[#6F4E37] font-medium">
          {fieldLabel} {fieldLabel.includes("*") ? "" : <span className="text-red-500">*</span>}
        </label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={generateSuggestion}
          disabled={isGenerating}
          className="flex items-center gap-1 border-[#A67B5B] text-[#6F4E37]"
        >
          {isGenerating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
          {isGenerating ? "Generating..." : "Generate with AI"}
        </Button>
      </div>

      <Textarea
        id={fieldId}
        value={currentValue}
        onChange={(e) => onValueChange(e.target.value)}
        placeholder={placeholder}
        className="min-h-[120px] bg-white border-[#A67B5B]/30"
        required
      />

      {showSuggestion && (
        <Card className="p-3 border-[#A67B5B]/30 bg-[#FED8B1]/10">
          <p className="text-sm font-medium mb-2 text-[#6F4E37]">AI Suggestion:</p>
          <p className="text-sm text-gray-700 mb-3">{generatedText}</p>
          <Button
            type="button"
            size="sm"
            onClick={applySuggestion}
            className="bg-[#ECB176] hover:bg-[#A67B5B] text-[#6F4E37]"
          >
            <Check className="h-3.5 w-3.5 mr-1" /> Use This Text
          </Button>
        </Card>
      )}
    </div>
  )
}
