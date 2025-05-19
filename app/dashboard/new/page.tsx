"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { OnboardingWizard } from "./components/onboarding-wizard"
import { TemplateEditor } from "./components/template-editor"
import { TemplateControls } from "@/components/templates/template-controls"
import { useAuth } from "@/contexts/auth-context"
import { TemplateProvider } from "@/contexts/template-context"

export const defaultTemplateData = {
  hero: {
    title: "Your Product Name",
    tagline: "A compelling tagline that captures attention",
    description: "Describe your product's main value proposition",
    cta: {
      text: "Get Started",
      url: "#pricing"
    },
    image: ""
  },
  about: {
    title: "Designed for Performance",
    description: "Experience crystal-clear audio with our premium product. Designed for comfort and performance, it delivers exceptional quality for maximum satisfaction.",
    image: "",
    features: [
      "High-quality materials",
      "Long battery life",
      "Ergonomic design",
      "Premium sound quality"
    ]
  },
  whyChoose: {
    title: "Why Choose Us",
    subtitle: "Discover the benefits that set us apart",
    benefits: [
      "High-quality product",
      "Excellent customer support",
      "Easy to use"
    ]
  },
  features: {
    title: "Features",
    subtitle: "Everything you need to succeed",
    items: [
      {
        title: "Feature 1",
        description: "Description of your first amazing feature",
        icon: ""
      },
      {
        title: "Feature 2",
        description: "Description of your second amazing feature",
        icon: ""
      },
      {
        title: "Feature 3",
        description: "Description of your third amazing feature",
        icon: ""
      }
    ]
  },
  pricing: {
    title: "Pricing Plans",
    subtitle: "Choose the perfect plan for you",
    currency: "$",
    plans: [
      {
        name: "Basic",
        price: 9,
        period: "month",
        features: [
          "Basic feature 1",
          "Basic feature 2",
          "Basic feature 3"
        ]
      },
      {
        name: "Pro",
        price: 19,
        period: "month",
        features: [
          "Pro feature 1",
          "Pro feature 2",
          "Pro feature 3",
          "Pro feature 4"
        ]
      },
      {
        name: "Enterprise",
        price: 49,
        period: "month",
        features: [
          "Enterprise feature 1",
          "Enterprise feature 2",
          "Enterprise feature 3",
          "Enterprise feature 4",
          "Enterprise feature 5"
        ]
      }
    ]
  },
  testimonials: [
    {
      name: "John Doe",
      role: "CEO at Company",
      content: "This product has transformed how we work. Highly recommended!",
      image: ""
    },
    {
      name: "Jane Smith",
      role: "Marketing Director",
      content: "The best solution we've found for our needs. Amazing support team!",
      image: ""
    },
    {
      name: "Mike Johnson",
      role: "Small Business Owner",
      content: "Incredible value for money. Has everything we need and more.",
      image: ""
    }
  ],
  faq: {
    title: "Frequently Asked Questions",
    subtitle: "Find answers to common questions",
    items: [
      {
        question: "What is your return policy?",
        answer: "We offer a 30-day money-back guarantee for all our products."
      },
      {
        question: "How do I get support?",
        answer: "Our support team is available 24/7 via email and chat."
      },
      {
        question: "Do you offer discounts?",
        answer: "Yes, we offer discounts for annual subscriptions and bulk purchases."
      }
    ]
  },
  brand: {
    name: "Your Brand",
    logo: ""
  },
  theme: {
    primaryColor: "#6F4E37",
    secondaryColor: "#ECB176"
  }
}

export default function NewProductPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [step, setStep] = useState<"onboarding" | "customization">("onboarding")
  const [productType, setProductType] = useState<"single" | "multi" | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)

  const handleOnboardingComplete = (data: { productType: "single" | "multi"; template: string }) => {
    setProductType(data.productType)
    setSelectedTemplate(data.template)
    setStep("customization")
  }

  if (!user) {
    router.push("/login")
    return null
  }

  if (step === "onboarding") {
    return <OnboardingWizard onComplete={handleOnboardingComplete} />
  }

  return (
    <TemplateProvider>
      <div className="min-h-screen bg-background">
        <TemplateEditor />
        <TemplateControls />
      </div>
    </TemplateProvider>
  )
}
