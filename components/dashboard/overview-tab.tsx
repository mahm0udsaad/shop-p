"use client";

import Link from "next/link"
import { use } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { OverviewChart } from "@/components/dashboard/overview-chart"
import { RecentOrders } from "@/components/dashboard/recent-orders"
import { VisitorMetrics } from "@/components/dashboard/visitor-metrics"
import { Icons } from "@/app/components/dashboard/icons"
import { ErrorBoundary } from "@/components/error-boundary"
import { TabErrorFallback } from "@/components/dashboard/tab-error-fallback"
import { Globe, Laptop, Smartphone, Tablet } from "lucide-react"

type AnalyticsData = {
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
  viewsOverTime?: { date: string; views: number }[]
  ordersOverTime?: { date: string; orders: number }[]
}

interface OverviewTabProps {
  analytics: AnalyticsData | Promise<AnalyticsData>
}

export function OverviewTab({ analytics }: OverviewTabProps) {
  // If analytics is a promise, use the React use() hook to handle it
  const resolvedAnalytics = analytics instanceof Promise ? use(analytics) : analytics;
  
  return (
    <div className="space-y-3 sm:space-y-6">
      <ErrorBoundary fallback={<TabErrorFallback tabName="metrics" />}>
        <div className="grid grid-cols-2 xs:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
          <VisitorMetrics
            title="Total Views"
            value={resolvedAnalytics.totalViews}
            description="All product pages"
            icon={<Icons.views className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#6F4E37]" />}
            compact={true}
          />
          <VisitorMetrics
            title="Total Orders"
            value={resolvedAnalytics.totalOrders}
            description="Across all products"
            icon={<Icons.orders className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#6F4E37]" />}
            compact={true}
          />
          <VisitorMetrics
            title="Conversion Rate"
            value={resolvedAnalytics.conversionRate}
            description="Orders per view"
            icon={<Icons.conversion className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#6F4E37]" />}
            compact={true}
          />
          <VisitorMetrics
            title="Avg. Time on Site"
            value={resolvedAnalytics.averageTimeOnSite}
            description="Per visitor"
            icon={<Icons.timeOnSite className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#6F4E37]" />}
            compact={true}
          />
        </div>
      </ErrorBoundary>

      <ErrorBoundary fallback={<TabErrorFallback tabName="overview chart" />}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3 sm:gap-4">
          <Card className="col-span-1 md:col-span-4">
            <CardHeader className="p-3 sm:p-6">
              <CardTitle className="text-base sm:text-lg">Weekly Overview</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Views and orders for the past 7 days</CardDescription>
            </CardHeader>
            <CardContent className="p-2 sm:pl-2 sm:p-6 pt-0">
              <OverviewChart data={{
                viewsOverTime: resolvedAnalytics.viewsOverTime,
                ordersOverTime: resolvedAnalytics.ordersOverTime
              }} />
            </CardContent>
          </Card>
          <Card className="col-span-1 md:col-span-3">
            <CardHeader className="p-3 sm:p-6">
              <CardTitle className="text-base sm:text-lg">Recent Orders</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Latest orders across all products</CardDescription>
            </CardHeader>
            <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
              <RecentOrders orders={resolvedAnalytics.recentOrders} />
            </CardContent>
            <CardFooter className="p-3 sm:p-6 pt-0">
              <Button variant="outline" className="w-full border-[#A67B5B]/30 text-[#6F4E37] text-xs sm:text-sm" asChild>
                <Link href="/dashboard/orders">View all orders</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </ErrorBoundary>

      <ErrorBoundary fallback={<TabErrorFallback tabName="visitor details" />}>
        <div className="grid grid-cols-2 xs:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
          <MetricsCard
            title="Devices"
            description="Visitor device types"
            items={resolvedAnalytics.devices}
            totalViews={resolvedAnalytics.totalViews}
            iconMapper={(name) => {
              if (name.toLowerCase().includes('desktop')) return <Laptop className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#6F4E37]" />
              if (name.toLowerCase().includes('mobile')) return <Smartphone className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#6F4E37]" />
              if (name.toLowerCase().includes('tablet')) return <Tablet className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#6F4E37]" />
              return <Laptop className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#6F4E37]" />
            }}
          />

          <MetricsCard
            title="Browsers"
            description="Most used browsers"
            items={resolvedAnalytics.browsers}
            totalViews={resolvedAnalytics.totalViews}
            iconMapper={() => <Globe className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#6F4E37]" />}
          />

          <MetricsCard
            title="Operating Systems"
            description="Visitor OS distribution"
            items={resolvedAnalytics.os}
            totalViews={resolvedAnalytics.totalViews}
            iconMapper={() => <Laptop className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#6F4E37]" />}
          />

          <MetricsCard
            title="Top Countries"
            description="Visitor locations"
            items={resolvedAnalytics.countries}
            totalViews={resolvedAnalytics.totalViews}
            iconMapper={() => <Icons.globe className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#6F4E37]" />}
          />
        </div>
      </ErrorBoundary>

      <ErrorBoundary fallback={<TabErrorFallback tabName="referrers" />}>
        <TopReferrersCard referrers={resolvedAnalytics.topReferrers} />
      </ErrorBoundary>
    </div>
  )
}

interface MetricsCardProps {
  title: string
  description: string
  items: { name: string; value: number }[]
  totalViews: number
  iconMapper: (name: string) => React.ReactNode
}

function MetricsCard({ title, description, items, totalViews, iconMapper }: MetricsCardProps) {
  return (
    <Card>
      <CardHeader className="p-3 sm:p-6">
        <CardTitle className="text-base sm:text-lg">{title}</CardTitle>
        <CardDescription className="text-xs sm:text-sm">{description}</CardDescription>
      </CardHeader>
      <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
        <div className="space-y-3 sm:space-y-4">
          {items.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#FED8B1]/30 flex items-center justify-center mr-2 sm:mr-3">
                  {iconMapper(item.name)}
                </div>
                <span className="text-xs sm:text-sm font-medium">{item.name}</span>
              </div>
              <div className="flex items-center">
                <span className="text-xs sm:text-sm font-medium">{((item.value / totalViews) * 100).toFixed(1)}%</span>
                <div className="ml-2 h-1.5 sm:h-2 w-12 sm:w-24 rounded-full bg-[#FED8B1]/30">
                  <div 
                    className="h-1.5 sm:h-2 rounded-full bg-[#ECB176]" 
                    style={{ width: `${totalViews > 0 ? (item.value / totalViews) * 100 : 0}%` }} 
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

interface TopReferrersCardProps {
  referrers: { referrer: string; percentage: number }[]
}

function TopReferrersCard({ referrers }: TopReferrersCardProps) {
  return (
    <Card>
      <CardHeader className="p-3 sm:p-6">
        <CardTitle className="text-base sm:text-lg">Top Referrers</CardTitle>
        <CardDescription className="text-xs sm:text-sm">Where your visitors are coming from</CardDescription>
      </CardHeader>
      <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
        <div className="space-y-3 sm:space-y-4">
          {referrers.map((referrer, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#FED8B1]/30 flex items-center justify-center mr-2 sm:mr-3">
                  {referrer.referrer === "Google" && (
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.79 15.71 17.57V20.34H19.28C21.36 18.42 22.56 15.6 22.56 12.25Z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23C14.97 23 17.46 22.02 19.28 20.34L15.71 17.57C14.73 18.23 13.48 18.63 12 18.63C9.14 18.63 6.71 16.7 5.84 14.1H2.18V16.94C3.99 20.53 7.7 23 12 23Z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09C5.62 13.43 5.49 12.73 5.49 12C5.49 11.27 5.62 10.57 5.84 9.91V7.07H2.18C1.43 8.55 1 10.22 1 12C1 13.78 1.43 15.45 2.18 16.93L5.84 14.09Z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38C13.62 5.38 15.06 5.94 16.21 7.02L19.36 3.87C17.45 2.09 14.97 1 12 1C7.7 1 3.99 3.47 2.18 7.07L5.84 9.91C6.71 7.31 9.14 5.38 12 5.38Z"
                        fill="#EA4335"
                      />
                    </svg>
                  )}
                  {referrer.referrer === "Direct" && <Globe className="h-4 w-4 text-[#6F4E37]" />}
                  {referrer.referrer === "Instagram" && (
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M12 2.163C15.204 2.163 15.584 2.175 16.85 2.233C20.102 2.381 21.621 3.924 21.769 7.152C21.827 8.417 21.838 8.797 21.838 12.001C21.838 15.206 21.826 15.585 21.769 16.85C21.62 20.075 20.105 21.621 16.85 21.769C15.584 21.827 15.206 21.839 12 21.839C8.796 21.839 8.416 21.827 7.151 21.769C3.891 21.62 2.38 20.07 2.232 16.849C2.174 15.584 2.162 15.205 2.162 12C2.162 8.796 2.175 8.417 2.232 7.151C2.381 3.924 3.896 2.38 7.151 2.232C8.417 2.175 8.796 2.163 12 2.163ZM12 0C8.741 0 8.333 0.014 7.053 0.072C2.695 0.272 0.273 2.69 0.073 7.052C0.014 8.333 0 8.741 0 12C0 15.259 0.014 15.668 0.072 16.948C0.272 21.306 2.69 23.728 7.052 23.928C8.333 23.986 8.741 24 12 24C15.259 24 15.668 23.986 16.948 23.928C21.302 23.728 23.73 21.31 23.927 16.948C23.986 15.668 24 15.259 24 12C24 8.741 23.986 8.333 23.928 7.053C23.732 2.699 21.311 0.273 16.949 0.073C15.668 0.014 15.259 0 12 0Z"
                        fill="url(#paint0_radial_87_7153)"
                      />
                      <path
                        d="M12 5.838C8.597 5.838 5.838 8.597 5.838 12C5.838 15.403 8.597 18.163 12 18.163C15.403 18.163 18.162 15.404 18.162 12C18.162 8.597 15.403 5.838 12 5.838ZM12 16C9.791 16 8 14.21 8 12C8 9.791 9.791 8 12 8C14.209 8 16 9.791 16 12C16 14.21 14.209 16 12 16Z"
                        fill="url(#paint1_radial_87_7153)"
                      />
                      <path
                        d="M18.406 7.034C19.2013 7.034 19.846 6.38929 19.846 5.594C19.846 4.79871 19.2013 4.154 18.406 4.154C17.6107 4.154 16.966 4.79871 16.966 5.594C16.966 6.38929 17.6107 7.034 18.406 7.034Z"
                        fill="url(#paint2_radial_87_7153)"
                      />
                      <defs>
                        <radialGradient
                          id="paint0_radial_87_7153"
                          cx="0"
                          cy="0"
                          r="1"
                          gradientUnits="userSpaceOnUse"
                          gradientTransform="translate(6 18) rotate(-55.3758) scale(25.5196)"
                        >
                          <stop stopColor="#B13589" />
                          <stop offset="0.79309" stopColor="#C62F94" />
                          <stop offset="1" stopColor="#8A3AC8" />
                        </radialGradient>
                        <radialGradient
                          id="paint1_radial_87_7153"
                          cx="0"
                          cy="0"
                          r="1"
                          gradientUnits="userSpaceOnUse"
                          gradientTransform="translate(8 16) rotate(-65.1363) scale(9.22059)"
                        >
                          <stop stopColor="#B13589" />
                          <stop offset="0.79309" stopColor="#C62F94" />
                          <stop offset="1" stopColor="#8A3AC8" />
                        </radialGradient>
                        <radialGradient
                          id="paint2_radial_87_7153"
                          cx="0"
                          cy="0"
                          r="1"
                          gradientUnits="userSpaceOnUse"
                          gradientTransform="translate(17.4599 5.93899) rotate(-65.1363) scale(1.40225)"
                        >
                          <stop stopColor="#B13589" />
                          <stop offset="0.79309" stopColor="#C62F94" />
                          <stop offset="1" stopColor="#8A3AC8" />
                        </radialGradient>
                      </defs>
                    </svg>
                  )}
                </div>
                <span className="text-xs sm:text-sm font-medium">{referrer.referrer}</span>
              </div>
              <div className="flex items-center">
                <span className="text-xs sm:text-sm font-medium">{referrer.percentage}%</span>
                <div className="ml-2 h-1.5 sm:h-2 w-12 sm:w-24 rounded-full bg-[#FED8B1]/30">
                  <div 
                    className="h-1.5 sm:h-2 rounded-full bg-[#ECB176]" 
                    style={{ width: `${referrer.percentage}%` }} 
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}