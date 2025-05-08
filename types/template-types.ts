export interface Product {
  id: string
  name: string
  description: string
  price: string
  category?: string
  image?: string
  gallery?: string[]
  rating?: number
  reviews?: number
  features?: string[]
  specifications?: Record<string, string>
  discount?: number
  isNew?: boolean
  isFeatured?: boolean
  colors?: string[]
  sizes?: string[]
}

export interface ProductData {
  name: string
  description: string
  price: string
  features?: string
  color?: string
  accentColor?: string
  subdomain?: string
  category?: string
  images?: Array<{ type: string; src: string }>
  storeName?: string
  storeDescription?: string
  heroImage?: string
  products?: Product[]
  categories?: string[]
}

export interface MultiProductTemplateProps {
  storeName: string
  storeDescription: string
  color: string
  accentColor: string
  products: Product[]
  categories?: string[]
  heroImage?: string
  enableCart?: boolean
  enableSearch?: boolean
  enableFiltering?: boolean
  enableSorting?: boolean
  enableWishlist?: boolean
  showRatings?: boolean
  contactEmail?: string
  contactPhone?: string
  contactAddress?: string
  footerText?: string
  socialLinks?: { name: string; url: string }[]
}
