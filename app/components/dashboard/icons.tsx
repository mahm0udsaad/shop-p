import { 
  ArrowUpRight, 
  BarChart3, 
  Box, 
  Calendar, 
  Eye, 
  Plus, 
  ShoppingBag,
  Monitor,
  Smartphone,
  Tablet,
  Globe2,
  Chrome as ChromeIcon,
  Globe as FirefoxIcon,
  Compass as SafariIcon,
  Laptop,
  Apple,
  MonitorSmartphone
} from "lucide-react"

export const Icons = {
  views: Eye,
  orders: ShoppingBag,
  conversion: ArrowUpRight,
  timeOnSite: Calendar,
  chart: BarChart3,
  products: Box,
  plus: Plus,
  add: Plus,
  overview: BarChart3,
  direct: ArrowUpRight,
  // Devices
  desktop: Laptop,
  mobile: Smartphone,
  tablet: Tablet,
  // Browsers
  chrome: ChromeIcon,
  firefox: FirefoxIcon,
  safari: SafariIcon,
  // OS
  windows: Laptop,
  mac: Apple,
  linux: MonitorSmartphone,
  // Other
  globe: Globe2
}

export type IconKey = keyof typeof Icons; 