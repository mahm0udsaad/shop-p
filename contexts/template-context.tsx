"use client";

import { createContext, useContext, useReducer, useEffect, useState } from "react";

export const getDefaultTemplateData = (templateType: string = "modern") => {
  if (templateType === "minimal") {
    return {
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
    };
  }
  
  // Default modern template data
  return defaultTemplateData;
};

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
type Action =
  | { type: "UPDATE_FIELD"; path: string; value: any }
  | { type: "UPDATE_THEME"; colors: { primary: string; secondary: string; text: string; accent: string } }
  | { type: "UPDATE_SEO"; data: any }
  | { type: "UPDATE_DOMAIN"; domain: string }
  | { type: "UPDATE_LANGUAGE_PREFERENCE"; languagePreference: string }
  | { type: "LOAD_DATA"; data: any };

interface State {
  templateData: any;
  seo: {
    title: string;
    description: string;
    keywords: string[];
    ogImage?: string;
  };
  domain: string;
  languagePreference: string;
}

const initialState: State = {
  templateData: defaultTemplateData,
  seo: {
    title: "",
    description: "",
    keywords: [],
    ogImage: "",
  },
  domain: "",
  languagePreference: "auto",
};

const colorPalettes = [
  {
    name: "Coffee & Cream",
    primary: "#6F4E37",
    secondary: "#ECB176",
    text: "#2D3748",
    accent: "#A67B5B",
  },
  {
    name: "Ocean Breeze",
    primary: "#2B6CB0",
    secondary: "#4FD1C5",
    text: "#1A365D",
    accent: "#90CDF4",
  },
  {
    name: "Forest Dream",
    primary: "#2F855A",
    secondary: "#9AE6B4",
    text: "#22543D",
    accent: "#68D391",
  },
  {
    name: "Sunset Glow",
    primary: "#C53030",
    secondary: "#FBD38D",
    text: "#742A2A",
    accent: "#FC8181",
  },
];

function templateReducer(state: State, action: Action): State {
  switch (action.type) {
    case "UPDATE_FIELD": {
      const newData = { ...state.templateData };
      const keys = action.path.split(".");
      let current: any = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = action.value;
      
      // Save to session storage
      sessionStorage.setItem("templateData", JSON.stringify(newData));
      return { ...state, templateData: newData };
    }
    case "UPDATE_THEME": {
      const newData = {
        ...state.templateData,
        theme: {
          primaryColor: action.colors.primary,
          secondaryColor: action.colors.secondary,
          textColor: action.colors.text,
          accentColor: action.colors.accent,
        },
      };
      sessionStorage.setItem("templateData", JSON.stringify(newData));
      return { ...state, templateData: newData };
    }
    case "UPDATE_SEO": {
      sessionStorage.setItem("seo", JSON.stringify(action.data));
      return { ...state, seo: action.data };
    }
    case "UPDATE_DOMAIN": {
      sessionStorage.setItem("domain", action.domain);
      return { ...state, domain: action.domain };
    }
    case "UPDATE_LANGUAGE_PREFERENCE": {
      sessionStorage.setItem("languagePreference", action.languagePreference);
      return { ...state, languagePreference: action.languagePreference };
    }
    case "LOAD_DATA": {
      return { ...state, ...action.data };
    }
    default:
      return state;
  }
}

const TemplateContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
  colorPalettes: typeof colorPalettes;
  saveChanges: () => Promise<void>;
  isSaving: boolean;
  productId?: string;
  isEditMode: boolean;
} | null>(null);

interface TemplateProviderProps {
  children: React.ReactNode;
  initialTemplateData?: any;
  productId?: string;
  updateFunction?: (productId: string, templateData: any) => Promise<{ success?: boolean; error?: string }>;
}

export function TemplateProvider({ 
  children, 
  initialTemplateData, 
  productId,
  updateFunction
}: TemplateProviderProps) {
  const [state, dispatch] = useReducer(templateReducer, {
    ...initialState,
    templateData: initialTemplateData || initialState.templateData
  });
  const [isSaving, setIsSaving] = useState(false);
  const isEditMode = !!productId;

  // Save changes to the product
  const saveChanges = async () => {
    if (!isEditMode || !productId || !updateFunction) return;
    
    setIsSaving(true);
    try {
      const result = await updateFunction(productId, state.templateData);
      if (result && result.error) {
        throw new Error(result.error);
      }
      // Success notification can be handled by the component
    } catch (error) {
      console.error("Error saving template changes:", error);
      // Error notification can be handled by the component
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    // Only load from session storage if not in edit mode
    if (!isEditMode) {
    // Load data from session storage on mount
    const loadedData = {
      templateData: JSON.parse(sessionStorage.getItem("templateData") || "null"),
      seo: JSON.parse(sessionStorage.getItem("seo") || "null"),
      domain: sessionStorage.getItem("domain"),
      languagePreference: sessionStorage.getItem("languagePreference"),
    };

    if (loadedData.templateData || loadedData.seo || loadedData.domain || loadedData.languagePreference) {
      dispatch({
        type: "LOAD_DATA",
        data: {
          templateData: loadedData.templateData || initialState.templateData,
          seo: loadedData.seo || initialState.seo,
          domain: loadedData.domain || initialState.domain,
          languagePreference: loadedData.languagePreference || initialState.languagePreference,
        },
      });
    }
    }
  }, [isEditMode]);

  return (
    <TemplateContext.Provider value={{ 
      state, 
      dispatch, 
      colorPalettes, 
      saveChanges, 
      isSaving, 
      productId,
      isEditMode
    }}>
      {children}
    </TemplateContext.Provider>
  );
}

export function useTemplate() {
  const context = useContext(TemplateContext);
  if (!context) {
    throw new Error("useTemplate must be used within a TemplateProvider");
  }
  return context;
} 