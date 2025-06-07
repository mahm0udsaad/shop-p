"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { OnboardingWizard } from "./components/onboarding-wizard"
import { TemplateEditor } from "./components/template-editor"
import { TemplateControls } from "@/components/templates/template-controls"
import { useAuth } from "@/contexts/auth-context"
import { TemplateProvider } from "@/contexts/template-context"
import { useTranslation } from '@/lib/i18n/client'

export const defaultTemplateData = {
  navbar: {
    title: "Your Brand",
    logo: "",
    links: [
      { text: "Home", url: "#" },
      { text: "Features", url: "#features" },
      { text: "Pricing", url: "#pricing" },
      { text: "Contact", url: "#", isButton: true }
    ],
    sticky: true,
    transparent: false
  },
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

export const defaultMinimalTemplateData = {
  navbar: {
    title: "Your Brand",
    logo: "",
    links: [
      { text: "Features", url: "#features" },
      { text: "Benefits", url: "#benefits" },
      { text: "Pricing", url: "#pricing" },
      { text: "Buy Now", url: "#pricing", isButton: true }
    ]
  },
  hero: {
    title: "Your Amazing Product Name",
    subtitle: "The solution you've been waiting for",
    description: "Describe your product's main benefits and why customers need it",
    cta: {
      text: "Buy Now",
      url: "#pricing"
    },
    image: "",
    price: "$99",
    originalPrice: ""
  },
  features: {
    title: "Key Features",
    subtitle: "Everything you need in one product",
    items: [
      {
        title: "Premium Quality",
        description: "Built with the highest quality materials and craftsmanship",
        icon: "star"
      },
      {
        title: "Easy to Use",
        description: "Simple and intuitive design that anyone can use",
        icon: "check"
      },
      {
        title: "Fast Results",
        description: "See results immediately with our proven solution",
        icon: "zap"
      }
    ]
  },
  benefits: {
    title: "Why Choose Our Product",
    subtitle: "The benefits that make the difference",
    items: [
      {
        title: "Save Time & Money",
        description: "Our product helps you achieve more in less time while saving money on expensive alternatives.",
        image: ""
      },
      {
        title: "Proven Results",
        description: "Thousands of satisfied customers have achieved amazing results with our product.",
        image: ""
      },
      {
        title: "Expert Support",
        description: "Get help when you need it with our dedicated customer support team.",
        image: ""
      }
    ]
  },
  pricing: {
    title: "Get Your Product Today",
    subtitle: "Limited time offer - don't miss out!",
    price: "$99",
    originalPrice: "",
    currency: "$",
    features: [
      "Premium product included",
      "Free shipping worldwide",
      "30-day money-back guarantee",
      "24/7 customer support",
      "Lifetime updates"
    ],
    cta: {
      text: "Buy Now",
      url: "#"
    },
    guarantee: "30-day money-back guarantee"
  },
  testimonials: [
    {
      name: "Sarah Johnson",
      role: "Verified Customer",
      content: "This product exceeded my expectations! The quality is amazing and it works exactly as promised.",
      image: "",
      rating: 5
    },
    {
      name: "Mike Chen",
      role: "Verified Customer",
      content: "Best purchase I've made this year. Highly recommend to anyone looking for a quality solution.",
      image: "",
      rating: 5
    },
    {
      name: "Emily Davis",
      role: "Verified Customer",
      content: "Outstanding product and customer service. Will definitely buy again!",
      image: "",
      rating: 5
    }
  ],
  cta: {
    title: "Ready to Get Started?",
    subtitle: "Join thousands of satisfied customers today",
    buttonText: "Order Now",
    buttonUrl: "#pricing"
  },
  brand: {
    name: "Your Brand",
    logo: ""
  },
  theme: {
    primaryColor: "#2563eb",
    secondaryColor: "#3b82f6"
  }
}

export default function NewProductPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { t } = useTranslation()
  const params = useParams();
  const lng = params?.lng || 'en';
  const [step, setStep] = useState<"onboarding" | "customization">("onboarding")
  const [productType, setProductType] = useState<"single" | "multi" | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)

  // Helper to get translated template data
  const getTemplateData = () => ({
    navbar: {
      title: t('dashboard.new.navbar.title'),
      logo: "",
      links: [
        { text: t('dashboard.new.navbar.links.home'), url: "#" },
        { text: t('dashboard.new.navbar.links.features'), url: "#features" },
        { text: t('dashboard.new.navbar.links.pricing'), url: "#pricing" },
        { text: t('dashboard.new.navbar.links.contact'), url: "#", isButton: true }
      ],
      sticky: true,
      transparent: false
    },
    hero: {
      title: t('dashboard.new.hero.title'),
      tagline: t('dashboard.new.hero.tagline'),
      description: t('dashboard.new.hero.description'),
      cta: {
        text: t('dashboard.new.hero.cta'),
        url: "#pricing"
      },
      image: ""
    },
    about: {
      title: t('dashboard.new.about.title'),
      description: t('dashboard.new.about.description'),
      image: "",
      features: [
        t('dashboard.new.about.features.0'),
        t('dashboard.new.about.features.1'),
        t('dashboard.new.about.features.2'),
        t('dashboard.new.about.features.3')
      ]
    },
    whyChoose: {
      title: t('dashboard.new.whyChoose.title'),
      subtitle: t('dashboard.new.whyChoose.subtitle'),
      benefits: [
        t('dashboard.new.whyChoose.benefits.0'),
        t('dashboard.new.whyChoose.benefits.1'),
        t('dashboard.new.whyChoose.benefits.2')
      ]
    },
    features: {
      title: t('dashboard.new.features.title'),
      subtitle: t('dashboard.new.features.subtitle'),
      items: [
        {
          title: t('dashboard.new.features.items.0.title'),
          description: t('dashboard.new.features.items.0.description'),
          icon: ""
        },
        {
          title: t('dashboard.new.features.items.1.title'),
          description: t('dashboard.new.features.items.1.description'),
          icon: ""
        },
        {
          title: t('dashboard.new.features.items.2.title'),
          description: t('dashboard.new.features.items.2.description'),
          icon: ""
        }
      ]
    },
    pricing: {
      title: t('dashboard.new.pricing.title'),
      subtitle: t('dashboard.new.pricing.subtitle'),
      currency: "$",
      plans: [
        {
          name: t('dashboard.new.pricing.plans.0.name'),
          price: 9,
          period: "month",
          features: [
            t('dashboard.new.pricing.plans.0.features.0'),
            t('dashboard.new.pricing.plans.0.features.1'),
            t('dashboard.new.pricing.plans.0.features.2')
          ]
        },
        {
          name: t('dashboard.new.pricing.plans.1.name'),
          price: 19,
          period: "month",
          features: [
            t('dashboard.new.pricing.plans.1.features.0'),
            t('dashboard.new.pricing.plans.1.features.1'),
            t('dashboard.new.pricing.plans.1.features.2'),
            t('dashboard.new.pricing.plans.1.features.3')
          ]
        },
        {
          name: t('dashboard.new.pricing.plans.2.name'),
          price: 49,
          period: "month",
          features: [
            t('dashboard.new.pricing.plans.2.features.0'),
            t('dashboard.new.pricing.plans.2.features.1'),
            t('dashboard.new.pricing.plans.2.features.2'),
            t('dashboard.new.pricing.plans.2.features.3'),
            t('dashboard.new.pricing.plans.2.features.4')
          ]
        }
      ]
    },
    testimonials: [
      {
        name: t('dashboard.new.testimonials.0.name'),
        role: t('dashboard.new.testimonials.0.role'),
        content: t('dashboard.new.testimonials.0.content'),
        image: ""
      },
      {
        name: t('dashboard.new.testimonials.1.name'),
        role: t('dashboard.new.testimonials.1.role'),
        content: t('dashboard.new.testimonials.1.content'),
        image: ""
      },
      {
        name: t('dashboard.new.testimonials.2.name'),
        role: t('dashboard.new.testimonials.2.role'),
        content: t('dashboard.new.testimonials.2.content'),
        image: ""
      }
    ],
    faq: {
      title: t('dashboard.new.faq.title'),
      subtitle: t('dashboard.new.faq.subtitle'),
      items: [
        {
          question: t('dashboard.new.faq.items.0.question'),
          answer: t('dashboard.new.faq.items.0.answer')
        },
        {
          question: t('dashboard.new.faq.items.1.question'),
          answer: t('dashboard.new.faq.items.1.answer')
        },
        {
          question: t('dashboard.new.faq.items.2.question'),
          answer: t('dashboard.new.faq.items.2.answer')
        }
      ]
    },
    brand: {
      name: t('dashboard.new.navbar.title'),
      logo: ""
    },
    theme: {
      primaryColor: "#6F4E37",
      secondaryColor: "#ECB176"
    }
  })

  const getMinimalTemplateData = () => ({
    navbar: {
      title: t('dashboard.new.navbar.title'),
      logo: "",
      links: [
        { text: t('dashboard.new.navbar.links.features'), url: "#features" },
        { text: t('dashboard.new.navbar.links.benefits'), url: "#benefits" },
        { text: t('dashboard.new.navbar.links.pricing'), url: "#pricing" },
        { text: t('dashboard.new.navbar.links.buy_now'), url: "#pricing", isButton: true }
      ]
    },
    hero: {
      title: t('dashboard.new.hero.title'),
      subtitle: t('dashboard.new.hero.tagline'),
      description: t('dashboard.new.hero.description'),
      cta: {
        text: t('dashboard.new.navbar.links.buy_now'),
        url: "#pricing"
      },
      image: "",
      price: "$99",
      originalPrice: ""
    },
    features: {
      title: t('dashboard.new.features.title'),
      subtitle: t('dashboard.new.features.subtitle'),
      items: [
        {
          title: t('dashboard.new.features.items.0.title'),
          description: t('dashboard.new.features.items.0.description'),
          icon: "star"
        },
        {
          title: t('dashboard.new.features.items.1.title'),
          description: t('dashboard.new.features.items.1.description'),
          icon: "check"
        },
        {
          title: t('dashboard.new.features.items.2.title'),
          description: t('dashboard.new.features.items.2.description'),
          icon: "zap"
        }
      ]
    },
    benefits: {
      title: t('dashboard.new.benefits.title'),
      subtitle: t('dashboard.new.benefits.subtitle'),
      items: [
        {
          title: t('dashboard.new.benefits.items.0.title'),
          description: t('dashboard.new.benefits.items.0.description'),
          image: ""
        },
        {
          title: t('dashboard.new.benefits.items.1.title'),
          description: t('dashboard.new.benefits.items.1.description'),
          image: ""
        },
        {
          title: t('dashboard.new.benefits.items.2.title'),
          description: t('dashboard.new.benefits.items.2.description'),
          image: ""
        }
      ]
    },
    pricing: {
      title: t('dashboard.new.pricing.title'),
      subtitle: t('dashboard.new.pricing.subtitle'),
      price: "$99",
      originalPrice: "",
      currency: "$",
      features: [
        t('dashboard.new.pricing.plans.0.features.0'),
        t('dashboard.new.pricing.plans.0.features.1'),
        t('dashboard.new.pricing.plans.0.features.2'),
        t('dashboard.new.pricing.plans.1.features.0'),
        t('dashboard.new.pricing.plans.1.features.1')
      ],
      cta: {
        text: t('dashboard.new.navbar.links.buy_now'),
        url: "#"
      },
      guarantee: t('dashboard.new.pricing.guarantee')
    },
    testimonials: [
      {
        name: t('dashboard.new.testimonials.0.name'),
        role: t('dashboard.new.testimonials.0.role'),
        content: t('dashboard.new.testimonials.0.content'),
        image: "",
        rating: 5
      },
      {
        name: t('dashboard.new.testimonials.1.name'),
        role: t('dashboard.new.testimonials.1.role'),
        content: t('dashboard.new.testimonials.1.content'),
        image: "",
        rating: 5
      },
      {
        name: t('dashboard.new.testimonials.2.name'),
        role: t('dashboard.new.testimonials.2.role'),
        content: t('dashboard.new.testimonials.2.content'),
        image: "",
        rating: 5
      }
    ],
    cta: {
      title: t('dashboard.new.cta.title'),
      subtitle: t('dashboard.new.cta.subtitle'),
      buttonText: t('dashboard.new.cta.buttonText'),
      buttonUrl: "#pricing"
    },
    brand: {
      name: t('dashboard.new.navbar.title'),
      logo: ""
    },
    theme: {
      primaryColor: "#2563eb",
      secondaryColor: "#3b82f6"
    }
  })

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
    <TemplateProvider initialTemplateData={selectedTemplate === "minimal" ? getMinimalTemplateData() : getTemplateData()}>
      <div className="min-h-screen bg-background" dir={lng === 'ar' ? 'rtl' : 'ltr'}>
        <TemplateEditor initialTemplate={selectedTemplate || "modern"} />
        <TemplateControls />
      </div>
    </TemplateProvider>
  )
}
