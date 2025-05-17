import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Icons } from "@/app/components/dashboard/icons"
import { ProductAnalyticsSelector } from "@/app/components/dashboard/product-analytics-selector"
import { OverviewTab } from "@/components/dashboard/overview-tab"
import { ProductsTab } from "@/components/dashboard/products-tab"
import { OrdersTab } from "@/components/dashboard/orders-tab"

type Product = {
  id: string
  name: string
  template: string
  created: string
  published: boolean
  image: string
  views: number
  orders: number
  conversionRate: string
  subdomain: string
  analyticsId?: string
}

type Analytics = {
  totalViews: number
  totalOrders: number
  conversionRate: string
  averageTimeOnSite: string
  devices: { name: string; value: number }[]
  browsers: { name: string; value: number }[]
  os: { name: string; value: number }[]
  countries: { name: string; value: number }[]
  topReferrers: { referrer: string; percentage: number }[]
  recentOrders: any[]
  ordersOverTime?: { date: string; orders: number }[]
  viewsOverTime?: { date: string; views: number }[]
}

interface DashboardTabsProps {
  products: Product[]
  analytics: Analytics
  selectedProductId?: string
}

export function DashboardTabs({ products, analytics, selectedProductId }: DashboardTabsProps) {
  return (
    <Tabs defaultValue="overview" className="space-y-6">
      <div className="flex justify-between">
        <TabsList className="bg-[#FED8B1]/30">
          <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:text-[#6F4E37]">
            <Icons.overview className="mr-2 h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="products" className="data-[state=active]:bg-white data-[state=active]:text-[#6F4E37]">
            <Icons.products className="mr-2 h-4 w-4" />
            Products
          </TabsTrigger>
          <TabsTrigger value="orders" className="data-[state=active]:bg-white data-[state=active]:text-[#6F4E37]">
            <Icons.orders className="mr-2 h-4 w-4" />
            Orders
          </TabsTrigger>
        </TabsList>
        <ProductAnalyticsSelector
          products={products.map(p => ({ 
            id: p.id, 
            name: p.name,
            hasAnalytics: Boolean(p.analyticsId)
          }))}
          selectedProductId={selectedProductId}
        />
      </div>
      
      <TabsContent value="overview" className="space-y-6">
        <OverviewTab analytics={analytics} />
      </TabsContent>

      <TabsContent value="products" className="space-y-6">
        <ProductsTab products={products} />
      </TabsContent>

      <TabsContent value="orders" className="space-y-6">
        <OrdersTab orders={analytics.recentOrders} />
      </TabsContent>
    </Tabs>
  )
} 