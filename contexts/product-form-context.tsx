"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

// Define the product data interface to fix TypeScript errors
interface Testimonial {
  name: string
  title: string
  quote: string
  avatar: string
  rating: number
}

interface FAQ {
  question: string
  answer: string
}

interface Size {
  name: string
  inStock: boolean
}

interface ProductData {
  name: string
  tagline: string
  description: string
  features: string
  benefits: string
  price: {
    currency: string
    monthly: number | null
    yearly: number | null
    discountNote: string
  }
  media: {
    images: string[]
    video: string
  }
  testimonials: Testimonial[]
  callToAction: {
    text: string
    url: string
  }
  faq: FAQ[]
  colors: string[]
  sizes: Size[]
  category: string
  color: string
  accentColor: string
  brand: {
    name: string
    logo: string
    contactEmail: string
    socialLinks: {
      twitter: string
      linkedin: string
      facebook: string
    }
  }
  seo: {
    title: string
    description: string
    keywords: string[]
    image: string
  }
  domain: string
}

interface MultiProduct {
  name: string
  description: string
  price: string
  category: string
  features: string
  images: string[]
}

interface StoreData {
  name: string
  description: string
  about: string
  tagline: string
  category: string
  footerContent: string
  contactEmail: string
  color: string
  accentColor: string
  domain: string
}

interface ProductFormState {
  step: number
  productType: "single" | "multi"
  selectedTemplate: string
  previewDevice: string
  errors: Record<string, string>
  productData: ProductData
  multiProductsData: MultiProduct[]
  storeData: StoreData
  isPublishing: boolean
  publishResult: {
    success?: boolean
    error?: string
    domain?: string
    productType?: "single" | "multi"
  } | null
}

interface ProductFormContextType extends ProductFormState {
  setStep: (step: number) => void
  setProductType: (type: "single" | "multi") => void
  setSelectedTemplate: (template: string) => void
  setPreviewDevice: (device: string) => void
  setErrors: (errors: Record<string, string>) => void
  setProductData: (data: ProductData) => void
  setMultiProductsData: (data: MultiProduct[]) => void
  setStoreData: (data: StoreData) => void
  setIsPublishing: (isPublishing: boolean) => void
  setPublishResult: (result: ProductFormState['publishResult']) => void
  resetForm: () => void
}

// Default product data
const defaultProductData: ProductData = {
  name: "",
  tagline: "",
  description: "",
  features: "",
  benefits: "",
  price: {
    currency: "USD",
    monthly: null,
    yearly: null,
    discountNote: "",
  },
  media: {
    images: [],
    video: "",
  },
  testimonials: [],
  callToAction: {
    text: "",
    url: "",
  },
  faq: [],
  colors: ["#000000"],
  sizes: [],
  category: "",
  color: "#6F4E37",
  accentColor: "#ECB176",
  brand: {
    name: "",
    logo: "",
    contactEmail: "",
    socialLinks: {
      twitter: "",
      linkedin: "",
      facebook: "",
    },
  },
  seo: {
    title: "",
    description: "",
    keywords: [],
    image: "",
  },
  domain: "",
}

// Default store data
const defaultStoreData: StoreData = {
  name: "",
  description: "",
  about: "",
  tagline: "",
  category: "",
  footerContent: "",
  contactEmail: "",
  color: "#6F4E37",
  accentColor: "#ECB176",
  domain: "",
}

// Default multi-product data
const defaultMultiProductsData: MultiProduct[] = [
  {
    name: "",
    description: "",
    price: "",
    category: "",
    features: "",
    images: [],
  },
]

// Create the context
const ProductFormContext = createContext<ProductFormContextType | undefined>(undefined)

// Provider component
export function ProductFormProvider({ children }: { children: ReactNode }) {
  // Initialize state from session storage or default values
  const [state, setState] = useState<ProductFormState>({
    step: 0,
    productType: "single",
    selectedTemplate: "modern",
    previewDevice: "desktop",
    errors: {},
    productData: defaultProductData,
    multiProductsData: defaultMultiProductsData,
    storeData: defaultStoreData,
    isPublishing: false,
    publishResult: null,
  })

  // Load state from session storage on first mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedState = sessionStorage.getItem('productFormState')
      if (savedState) {
        try {
          const parsedState = JSON.parse(savedState)
          setState(parsedState)
        } catch (e) {
          console.error('Failed to parse saved form state:', e)
        }
      }
    }
  }, [])

  // Save to session storage when state changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('productFormState', JSON.stringify(state))
    }
  }, [state])

  // Update template when product type changes
  useEffect(() => {
    if (state.productType === "single" && state.selectedTemplate.startsWith("multi-product")) {
      setState(prev => ({ ...prev, selectedTemplate: "modern" }))
    } else if (state.productType === "multi" && !state.selectedTemplate.startsWith("multi-product")) {
      setState(prev => ({ ...prev, selectedTemplate: "multi-product" }))
    }
  }, [state.productType, state.selectedTemplate])

  // Helper functions to update state
  const setStep = (step: number) => setState(prev => ({ ...prev, step }))
  const setProductType = (productType: "single" | "multi") => setState(prev => ({ ...prev, productType }))
  const setSelectedTemplate = (selectedTemplate: string) => setState(prev => ({ ...prev, selectedTemplate }))
  const setPreviewDevice = (previewDevice: string) => setState(prev => ({ ...prev, previewDevice }))
  const setErrors = (errors: Record<string, string>) => setState(prev => ({ ...prev, errors }))
  const setProductData = (productData: ProductData) => setState(prev => ({ ...prev, productData }))
  const setMultiProductsData = (multiProductsData: MultiProduct[]) => setState(prev => ({ ...prev, multiProductsData }))
  const setStoreData = (storeData: StoreData) => setState(prev => ({ ...prev, storeData }))
  const setIsPublishing = (isPublishing: boolean) => setState(prev => ({ ...prev, isPublishing }))
  const setPublishResult = (publishResult: ProductFormState['publishResult']) => setState(prev => ({ ...prev, publishResult }))
  
  // Reset form to default values
  const resetForm = () => {
    setState({
      step: 0,
      productType: "single",
      selectedTemplate: "modern",
      previewDevice: "desktop",
      errors: {},
      productData: defaultProductData,
      multiProductsData: defaultMultiProductsData,
      storeData: defaultStoreData,
      isPublishing: false,
      publishResult: null,
    })
    sessionStorage.removeItem('productFormState')
  }

  const value = {
    ...state,
    setStep,
    setProductType,
    setSelectedTemplate,
    setPreviewDevice,
    setErrors,
    setProductData,
    setMultiProductsData,
    setStoreData,
    setIsPublishing,
    setPublishResult,
    resetForm,
  }

  return <ProductFormContext.Provider value={value}>{children}</ProductFormContext.Provider>
}

// Custom hook to use the context
export function useProductForm() {
  const context = useContext(ProductFormContext)
  if (context === undefined) {
    throw new Error('useProductForm must be used within a ProductFormProvider')
  }
  return context
} 