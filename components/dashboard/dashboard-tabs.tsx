import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Icons } from "@/app/components/dashboard/icons"
import { ProductAnalyticsSelector } from "@/app/components/dashboard/product-analytics-selector"
import { OverviewTab } from "@/components/dashboard/overview-tab"
import { ProductsTab } from "@/components/dashboard/products-tab"
import { OrdersTab } from "@/components/dashboard/orders-tab"
import { ErrorBoundary } from "@/components/error-boundary"
import { TabErrorFallback } from "@/components/dashboard/tab-error-fallback"
import { Suspense } from "react"
import { TabContentSkeleton } from "@/components/dashboard/tab-content-skeleton"

type Product = {
  id: string
  slug: string
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
    <Tabs defaultValue="overview" className="space-y-3 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between gap-2 sm:gap-4">
        <TabsList className="bg-[#FED8B1]/30 w-full sm:w-auto h-9 sm:h-10">
          <TabsTrigger value="overview" className="flex-1 sm:flex-initial text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:text-[#6F4E37]">
            <Icons.chart className="mr-1 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="products" className="flex-1 sm:flex-initial text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:text-[#6F4E37]">
            <Icons.products className="mr-1 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span>Products</span>
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex-1 sm:flex-initial text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:text-[#6F4E37]">
            <Icons.orders className="mr-1 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span>Orders</span>
          </TabsTrigger>
        </TabsList>
        <div className="w-full sm:w-auto">
          <ProductAnalyticsSelector
            products={products.map(p => ({ 
              id: p.id, 
              name: p.slug,
              hasAnalytics: Boolean(p.analyticsId)
            }))}
            selectedProductId={selectedProductId}
          />
        </div>
      </div>
      
      <TabsContent value="overview" className="space-y-3 sm:space-y-6 px-0">
        <ErrorBoundary 
          fallback={<TabErrorFallback tabName="overview" />}
        >
          <Suspense fallback={<TabContentSkeleton type="overview" />}>
            <OverviewTab analytics={analytics} />
          </Suspense>
        </ErrorBoundary>
      </TabsContent>

      <TabsContent value="products" className="space-y-3 sm:space-y-6 px-0">
        <ErrorBoundary
          fallback={<TabErrorFallback tabName="products" />}
        >
          <Suspense fallback={<TabContentSkeleton type="products" />}>
            <ProductsTab products={products} />
          </Suspense>
        </ErrorBoundary>
      </TabsContent>

      <TabsContent value="orders" className="space-y-3 sm:space-y-6 px-0">
        <ErrorBoundary
          fallback={<TabErrorFallback tabName="orders" />}
        >
          <Suspense fallback={<TabContentSkeleton type="orders" />}>
            <OrdersTab orders={analytics.recentOrders} />
          </Suspense>
        </ErrorBoundary>
      </TabsContent>
    </Tabs>
  )
} 