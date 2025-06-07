import type { Product } from "@/types/template-types"

/**
 * Generates sample products for templates
 */
export function generateSampleProducts(count = 6): Product[] {
  const productTemplates = [
    {
      name: "Premium Wireless Headphones",
      description: "Experience crystal-clear sound with our Premium Wireless Headphones.",
      price: "99.99",
      category: "Audio",
      image: "/diverse-people-listening-headphones.png",
      rating: 4.8,
      reviews: 124,
      gallery: ["/diverse-people-listening-headphones.png", "/headphones-detail-1.png", "/headphones-detail-2.png"],
      isNew: true,
      isFeatured: true,
    },
    {
      name: "Smart Watch Pro",
      description: "Track your fitness and stay connected with Smart Watch Pro.",
      price: "149.99",
      category: "Wearables",
      image: "/fitness-watch.png",
      rating: 4.6,
      reviews: 89,
      gallery: ["/fitness-watch.png", "/fitness-watch-detail-1.png", "/fitness-watch-detail-2.png"],
      isFeatured: true,
    },
    {
      name: "Portable Bluetooth Speaker",
      description: "Take your music anywhere with this waterproof Bluetooth speaker.",
      price: "79.99",
      category: "Audio",
      image: "/bluetooth-speaker.png",
      rating: 4.5,
      reviews: 56,
      discount: 15,
    },
    {
      name: "Wireless Charging Pad",
      description: "Fast wireless charging for all Qi-compatible devices.",
      price: "29.99",
      category: "Accessories",
      image: "/charging-pad.png",
      rating: 4.3,
      reviews: 42,
      gallery: ["/charging-pad.png", "/charging-pad-detail-1.png", "/charging-pad-detail-2.png"],
    },
    {
      name: "Smart Home Hub",
      description: "Control all your smart home devices from one central hub.",
      price: "129.99",
      category: "Smart Home",
      image: "/smart-home-hub.png",
      rating: 4.7,
      reviews: 78,
      isNew: true,
    },
    {
      name: "Noise-Canceling Earbuds",
      description: "Premium earbuds with active noise cancellation technology.",
      price: "89.99",
      category: "Audio",
      image: "/diverse-people-listening-headphones.png",
      rating: 4.4,
      reviews: 63,
      discount: 10,
    },
  ]

  // Generate the requested number of products
  const products: Product[] = []
  for (let i = 0; i < count; i++) {
    const template = productTemplates[i % productTemplates.length]
    products.push({
      ...template,
      id: `product-${i + 1}`,
    })
  }

  return products
}

/**
 * Converts legacy product data format to the current format
 * @param legacyProduct - Product data in legacy format
 * @returns Converted product data in current format
 */
export function convertLegacyProductData(legacyProduct: any): Product {
  // Handle null or undefined input
  if (!legacyProduct) {
    return {
      id: "",
      name: "",
      description: "",
      price: "0.00",
      category: "Other",
      image: "",
    }
  }

  // Convert legacy product to current format
  return {
    // Required fields with fallbacks
    id: legacyProduct.id || legacyProduct.product_id || `product-${Date.now()}`,
    name: legacyProduct.name || legacyProduct.title || legacyProduct.product_name || "Untitled Product",
    description: legacyProduct.description || legacyProduct.desc || legacyProduct.product_description || "",
    price: legacyProduct.price?.toString() || "0.00",
    category: legacyProduct.category || legacyProduct.product_category || "Other",
    image: legacyProduct.image || legacyProduct.product_image || legacyProduct.thumbnail || "",

    // Optional fields
    rating: typeof legacyProduct.rating === "number" ? legacyProduct.rating : undefined,
    reviews: typeof legacyProduct.reviews === "number" ? legacyProduct.reviews : undefined,
    discount: typeof legacyProduct.discount === "number" ? legacyProduct.discount : undefined,
    isNew: !!legacyProduct.isNew || !!legacyProduct.is_new,
    isFeatured: !!legacyProduct.isFeatured || !!legacyProduct.is_featured,

    // Handle gallery images
    gallery: Array.isArray(legacyProduct.gallery)
      ? legacyProduct.gallery
      : Array.isArray(legacyProduct.images)
        ? legacyProduct.images
        : legacyProduct.image
          ? [legacyProduct.image]
          : [],

    // Handle specifications if present
    specifications: legacyProduct.specifications || legacyProduct.specs || undefined,
    // Handle variants if present
    ...(legacyProduct.variants && { variants: legacyProduct.variants }),

    // Handle colors if present 
    ...(legacyProduct.colors && { colors: legacyProduct.colors }),

    // Handle sizes if present
    sizes: legacyProduct.sizes || undefined,
  }
}
