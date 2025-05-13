export interface LandingPageData {
  product: {
    id?: string
    name: string
    tagline: string
    description: string
    features: string[]
    benefits: string[]
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
    testimonials: Array<{
      name: string
      title: string
      quote: string
      avatar: string
      rating?: number
    }>
    callToAction: {
      text: string
      url: string
    }
    faq: Array<{
      question: string
      answer: string
    }>
  }
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
  theme?: {
    primaryColor: string
    secondaryColor: string
  }
}

// Sample data that can be used as a fallback
export const sampleLandingPageData: LandingPageData = {
  product: {
    name: "Premium Wireless Headphones",
    tagline: "Immersive Sound Experience for Music Enthusiasts",
    description:
      "Experience crystal-clear audio with our premium wireless headphones. Designed for comfort and performance, these headphones deliver exceptional sound quality for up to 30 hours on a single charge.",
    features: [
      "Active Noise Cancellation",
      "30-hour Battery Life",
      "Bluetooth 5.0 Connectivity",
      "Premium Memory Foam Ear Cushions",
      "Voice Assistant Integration",
      "Foldable Design for Easy Storage",
    ],
    benefits: [
      "Immerse yourself in music without distractions",
      "Enjoy all-day comfort with ergonomic design",
      "Experience seamless connectivity with all your devices",
      "Take calls with crystal clear voice quality",
    ],
    price: {
      currency: "USD",
      monthly: 14.99,
      yearly: 149.99,
      discountNote: "Save 17% with annual billing",
    },
    media: {
      images: ["/diverse-people-listening-headphones.png", "/headphones-detail-1.png", "/headphones-detail-2.png"],
      video: "https://example.com/product-video.mp4",
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
  },
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
    keywords: ["wireless headphones", "premium audio", "noise cancellation", "bluetooth headphones"],
    image: "/diverse-people-listening-headphones.png",
  },
  theme: {
    primaryColor: "#3A86FF",
    secondaryColor: "#FF006E",
  },
}
