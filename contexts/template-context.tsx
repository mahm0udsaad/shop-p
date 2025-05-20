"use client";

import { createContext, useContext, useReducer, useEffect } from "react";
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
} | null>(null);

export function TemplateProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(templateReducer, initialState);

  useEffect(() => {
    // Load data from session storage on mount
    const loadedData = {
      templateData: JSON.parse(sessionStorage.getItem("templateData") || "null"),
      seo: JSON.parse(sessionStorage.getItem("seo") || "null"),
      domain: sessionStorage.getItem("domain"),
    };

    if (loadedData.templateData || loadedData.seo || loadedData.domain) {
      dispatch({
        type: "LOAD_DATA",
        data: {
          templateData: loadedData.templateData || initialState.templateData,
          seo: loadedData.seo || initialState.seo,
          domain: loadedData.domain || initialState.domain,
        },
      });
    }
  }, []);

  return (
    <TemplateContext.Provider value={{ state, dispatch, colorPalettes }}>
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