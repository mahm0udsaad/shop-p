import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { OverviewChart } from "@/components/dashboard/overview-chart"
import { RecentOrders } from "@/components/dashboard/recent-orders"
import { VisitorMetrics } from "@/components/dashboard/visitor-metrics"
import { getDashboardData } from "./utils"
import { ProductAnalyticsSelector } from "../components/dashboard/product-analytics-selector"
import { createClient } from "@/lib/supabase/server"
import { Icons } from "../components/dashboard/icons"
import { DeleteProductButton } from "../components/dashboard/delete-product-button"
import { OrdersTab } from "@/components/dashboard/orders-tab"

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const supabase = await createClient()  
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return null // Handle this case appropriately in your app
  }

  const currSearchParams = await searchParams;
  const selectedProductId = typeof currSearchParams.productId === 'string' ? currSearchParams.productId : undefined
  const { products, analytics } = await getDashboardData(user.id, selectedProductId)

  // Function to get status badge color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "new":
        return "bg-blue-100 text-blue-800"
      case "processing":
        return "bg-yellow-100 text-yellow-800"
      case "shipped":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <main className="w-full">
      <DashboardHeader
        heading="Dashboard"
        description="Overview of your product showcase performance and management."
      >
      </DashboardHeader>

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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <VisitorMetrics
              title="Total Views"
                value={analytics.totalViews}
              description="All product pages"
                icon={<Icons.views className="h-4 w-4 text-[#6F4E37]" />}
            />
            <VisitorMetrics
              title="Total Orders"
                value={analytics.totalOrders}
              description="Across all products"
                icon={<Icons.orders className="h-4 w-4 text-[#6F4E37]" />}
            />
            <VisitorMetrics
              title="Conversion Rate"
                value={analytics.conversionRate}
              description="Orders per view"
                icon={<Icons.conversion className="h-4 w-4 text-[#6F4E37]" />}
            />
            <VisitorMetrics
              title="Avg. Time on Site"
                value={analytics.averageTimeOnSite}
              description="Per visitor"
                icon={<Icons.timeOnSite className="h-4 w-4 text-[#6F4E37]" />}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Weekly Overview</CardTitle>
                <CardDescription>Views and orders for the past 7 days</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                  <OverviewChart data={analytics} />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Latest orders across all products</CardDescription>
              </CardHeader>
              <CardContent>
                  <RecentOrders orders={analytics.recentOrders} />
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full border-[#A67B5B]/30 text-[#6F4E37]" asChild>
                  <Link href="/dashboard/orders">View all orders</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader>
                  <CardTitle>Devices</CardTitle>
                  <CardDescription>Visitor device types</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.devices.map((device) => (
                      <div key={device.name} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-[#FED8B1]/30 flex items-center justify-center mr-3">
                            {device.name.toLowerCase().includes('desktop') && <Icons.desktop className="h-4 w-4 text-[#6F4E37]" />}
                            {device.name.toLowerCase().includes('mobile') && <Icons.mobile className="h-4 w-4 text-[#6F4E37]" />}
                            {device.name.toLowerCase().includes('tablet') && <Icons.tablet className="h-4 w-4 text-[#6F4E37]" />}
                          </div>
                          <span className="text-sm font-medium">{device.name}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm font-medium">{((device.value / analytics.totalViews) * 100).toFixed(1)}%</span>
                          <div className="ml-2 h-2 w-24 rounded-full bg-[#FED8B1]/30">
                            <div 
                              className="h-2 rounded-full bg-[#ECB176]" 
                              style={{ width: `${(device.value / analytics.totalViews) * 100}%` }} 
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Browsers</CardTitle>
                  <CardDescription>Most used browsers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.browsers.map((browser) => (
                      <div key={browser.name} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-[#FED8B1]/30 flex items-center justify-center mr-3">
                            {browser.name.toLowerCase().includes('chrome') && <Icons.chrome className="h-4 w-4 text-[#6F4E37]" />}
                            {browser.name.toLowerCase().includes('firefox') && <Icons.firefox className="h-4 w-4 text-[#6F4E37]" />}
                            {browser.name.toLowerCase().includes('safari') && <Icons.safari className="h-4 w-4 text-[#6F4E37]" />}
                          </div>
                          <span className="text-sm font-medium">{browser.name}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm font-medium">{((browser.value / analytics.totalViews) * 100).toFixed(1)}%</span>
                          <div className="ml-2 h-2 w-24 rounded-full bg-[#FED8B1]/30">
                            <div 
                              className="h-2 rounded-full bg-[#ECB176]" 
                              style={{ width: `${(browser.value / analytics.totalViews) * 100}%` }} 
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Operating Systems</CardTitle>
                  <CardDescription>Visitor OS distribution</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.os.map((os) => (
                      <div key={os.name} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-[#FED8B1]/30 flex items-center justify-center mr-3">
                            {os.name.toLowerCase().includes('windows') && <Icons.windows className="h-4 w-4 text-[#6F4E37]" />}
                            {os.name.toLowerCase().includes('mac') && <Icons.mac className="h-4 w-4 text-[#6F4E37]" />}
                            {os.name.toLowerCase().includes('linux') && <Icons.linux className="h-4 w-4 text-[#6F4E37]" />}
                          </div>
                          <span className="text-sm font-medium">{os.name}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm font-medium">{((os.value / analytics.totalViews) * 100).toFixed(1)}%</span>
                          <div className="ml-2 h-2 w-24 rounded-full bg-[#FED8B1]/30">
                            <div 
                              className="h-2 rounded-full bg-[#ECB176]" 
                              style={{ width: `${(os.value / analytics.totalViews) * 100}%` }} 
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Countries</CardTitle>
                  <CardDescription>Visitor locations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.countries.map((country) => (
                      <div key={country.name} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-[#FED8B1]/30 flex items-center justify-center mr-3">
                            <Icons.globe className="h-4 w-4 text-[#6F4E37]" />
                          </div>
                          <span className="text-sm font-medium">{country.name}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm font-medium">{((country.value / analytics.totalViews) * 100).toFixed(1)}%</span>
                          <div className="ml-2 h-2 w-24 rounded-full bg-[#FED8B1]/30">
                            <div 
                              className="h-2 rounded-full bg-[#ECB176]" 
                              style={{ width: `${(country.value / analytics.totalViews) * 100}%` }} 
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Top Referrers</CardTitle>
              <CardDescription>Where your visitors are coming from</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                  {analytics.topReferrers.map((referrer: any, index: number) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-[#FED8B1]/30 flex items-center justify-center mr-3">
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
                          {referrer.referrer === "Direct" && <Icons.direct className="h-4 w-4 text-[#6F4E37]" />}
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
                                <stop stopColor="#E0E8B7" />
                                <stop offset="0.444662" stopColor="#FB8A2E" />
                                <stop offset="0.71474" stopColor="#E2425C" />
                                <stop offset="1" stopColor="#E2425C" stopOpacity="0" />
                              </radialGradient>
                              <radialGradient
                                id="paint2_radial_87_7153"
                                cx="0"
                                cy="0"
                                r="1"
                                gradientUnits="userSpaceOnUse"
                                gradientTransform="translate(16.966 7.034) rotate(-90) scale(2.88)"
                              >
                                <stop offset="0.156701" stopColor="#406ADC" />
                                <stop offset="0.467799" stopColor="#6A45BE" />
                                <stop offset="1" stopColor="#6A45BE" stopOpacity="0" />
                              </radialGradient>
                            </defs>
                          </svg>
                        )}
                        {referrer.referrer === "Facebook" && (
                          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 17.9895 4.3882 22.954 10.125 23.8542V15.4688H7.07812V12H10.125V9.35625C10.125 6.34875 11.9166 4.6875 14.6576 4.6875C15.9701 4.6875 17.3438 4.92188 17.3438 4.92188V7.875H15.8306C14.34 7.875 13.875 8.80008 13.875 9.75V12H17.2031L16.6711 15.4688H13.875V23.8542C19.6118 22.954 24 17.9895 24 12Z"
                              fill="#1877F2"
                            />
                          </svg>
                        )}
                      </div>
                      <span className="text-sm font-medium">{referrer.referrer}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium">{referrer.percentage}%</span>
                      <div className="ml-2 h-2 w-24 rounded-full bg-[#FED8B1]/30">
                        <div className="h-2 rounded-full bg-[#ECB176]" style={{ width: `${referrer.percentage}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product, index) => (
              <Card key={product.id || index}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <CardDescription>
                    Template: {product.template} • Created: {product.created}
                    {product.published ? " • Published" : " • Draft"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video relative mb-4 overflow-hidden rounded-md">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Views</p>
                      <p className="text-lg font-medium">{product.views}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Orders</p>
                      <p className="text-lg font-medium">{product.orders}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Conversion</p>
                      <p className="text-lg font-medium">{product.conversionRate}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-1">
                  <div className="flex w-full justify-between">
                    <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="border-[#A67B5B]/30 text-[#6F4E37]" asChild>
                      <Link href={`/dashboard/products/${product.id}/edit`}>Edit</Link>
                    </Button>
                      <DeleteProductButton productId={product.id} productName={product.name} />
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-[#A67B5B]/30 text-[#6F4E37]" 
                      asChild
                      disabled={!product.published}
                    >
                      <Link href={`https://${product.subdomain}.shipfaster.tech`} target="_blank">
                        View
                      </Link>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
          {products.length === 0 && (
            <Card className="p-8 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#FED8B1]/30">
                <Icons.products className="h-6 w-6 text-[#6F4E37]" />
              </div>
              <h3 className="mb-2 text-lg font-medium">No Products Yet</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                You haven't created any product showcases yet. Get started by adding your first product.
              </p>
              <Button className="bg-[#ECB176] hover:bg-[#A67B5B] text-[#6F4E37]" asChild>
                <Link href="/dashboard/new">
                  <Icons.add className="mr-2 h-4 w-4" />
                  Add New Product
                </Link>
              </Button>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="orders" className="space-y-6">
          <OrdersTab orders={analytics.recentOrders} />
        </TabsContent>
      </Tabs>
    </main>
  )
}
