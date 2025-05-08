"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowUpRight, BarChart3, Box, Calendar, Eye, Plus, ShoppingBag } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { OverviewChart } from "@/components/dashboard/overview-chart"
import { RecentOrders } from "@/components/dashboard/recent-orders"
import { VisitorMetrics } from "@/components/dashboard/visitor-metrics"
import { useAuth } from "@/contexts/auth-context"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/lib/database.types"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"
import { AddProductButton } from "@/components/dashboard/add-product-button"

export default function DashboardPage() {
  const { user } = useAuth()
  const supabase = createClientComponentClient<Database>()

  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState<any[]>([])
  const [analyticsData, setAnalyticsData] = useState<any>({
    totalViews: 0,
    totalOrders: 0,
    conversionRate: "0%",
    averageTimeOnSite: "0m 0s",
    topReferrers: [],
    viewsOverTime: [],
    ordersOverTime: [],
    recentOrders: [],
  })

  // Generate default analytics data
  const getDefaultAnalyticsData = () => {
    return {
      totalViews: 0,
      totalOrders: 0,
      conversionRate: "0%",
      averageTimeOnSite: "0m 0s",
      topReferrers: getDefaultReferrers(),
      viewsOverTime: Array.from({ length: 7 }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - i)
        return {
          date: date.toLocaleDateString("en-US", { weekday: "short" }),
          views: 0,
        }
      }).reverse(),
      ordersOverTime: Array.from({ length: 7 }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - i)
        return {
          date: date.toLocaleDateString("en-US", { weekday: "short" }),
          orders: 0,
        }
      }).reverse(),
      recentOrders: [],
    }
  }

  const getDefaultReferrers = () => {
    return [
      { referrer: "Direct", percentage: 0 },
      { referrer: "Google", percentage: 0 },
      { referrer: "Facebook", percentage: 0 },
      { referrer: "Instagram", percentage: 0 },
    ]
  }

  useEffect(() => {
    if (!user) return

    const fetchDashboardData = async () => {
      setLoading(true)
      try {
        // Fetch products with all necessary fields
        const { data: productsData, error: productsError } = await supabase
          .from("products")
          .select(`
            id,
            name,
            description,
            price,
            template,
            created_at,
            media,
            template_data,
            subdomain,
            published,
            featured,
            domain_id
          `)
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })

        if (productsError) throw productsError

        // Fetch domains for products
        const { data: domainsData, error: domainsError } = await supabase
          .from("domains")
          .select("id, subdomain")
          .in("id", productsData.filter((p) => p.domain_id).map((p) => p.domain_id) || [])

        if (domainsError) throw domainsError

        // Create a map of domain_id to subdomain
        const domainMap = new Map()
        domainsData?.forEach((domain) => {
          domainMap.set(domain.id, domain.subdomain)
        })

        // Enhance products with domain info and format data
        const enhancedProducts = productsData.map((product) => {
          const subdomain = product.domain_id ? domainMap.get(product.domain_id) : product.subdomain
          const media = product.media || {}
          const templateData = product.template_data || {}

          return {
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            template: product.template || "modern",
            subdomain: subdomain || "not-published",
            published: product.published || false,
            featured: product.featured || false,
            orders: 0, // Will be updated with real data
            views: 0, // Will be updated with real data
            conversionRate: "0%", // Will be updated with real data
            created: new Date(product.created_at).toISOString().split("T")[0],
            image: media.images?.[0] || templateData.media?.images?.[0] || "/diverse-products-still-life.png",
            tagline: templateData.tagline || "",
            benefits: templateData.benefits || [],
            features: templateData.features || [],
            theme: templateData.theme || { primaryColor: "", secondaryColor: "" }
          }
        })

        setProducts(enhancedProducts)

        // Instead of using the RPC function that has nested aggregates,
        // let's fetch the raw analytics data and process it client-side
        try {
          // Fetch page views
          const { data: viewsData, error: viewsError } = await supabase
            .from("page_views")
            .select("*")
            .eq("user_id", user.id)
            .gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
            .order("created_at", { ascending: false })

          if (viewsError) throw viewsError

          // Fetch orders
          const { data: ordersData, error: ordersError } = await supabase
            .from("orders")
            .select("*")
            .eq("user_id", user.id)
            .gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
            .order("created_at", { ascending: false })

          if (ordersError) throw ordersError

          // Process the data client-side
          const totalViews = viewsData?.length || 0
          const totalOrders = ordersData?.length || 0
          const conversionRate = totalViews > 0 ? Math.round((totalOrders / totalViews) * 100) : 0

          // Group views by day
          const viewsByDay =
            viewsData?.reduce((acc: any, view: any) => {
              const date = new Date(view.created_at).toLocaleDateString("en-US", { weekday: "short" })
              acc[date] = (acc[date] || 0) + 1
              return acc
            }, {}) || {}

          // Group orders by day
          const ordersByDay =
            ordersData?.reduce((acc: any, order: any) => {
              const date = new Date(order.created_at).toLocaleDateString("en-US", { weekday: "short" })
              acc[date] = (acc[date] || 0) + 1
              return acc
            }, {}) || {}

          // Create viewsOverTime array
          const viewsOverTime = Array.from({ length: 7 }, (_, i) => {
            const date = new Date()
            date.setDate(date.getDate() - i)
            const dateStr = date.toLocaleDateString("en-US", { weekday: "short" })
            return {
              date: dateStr,
              views: viewsByDay[dateStr] || 0,
            }
          }).reverse()

          // Create ordersOverTime array
          const ordersOverTime = Array.from({ length: 7 }, (_, i) => {
            const date = new Date()
            date.setDate(date.getDate() - i)
            const dateStr = date.toLocaleDateString("en-US", { weekday: "short" })
            return {
              date: dateStr,
              orders: ordersByDay[dateStr] || 0,
            }
          }).reverse()

          // Process referrers
          const referrers =
            viewsData?.reduce((acc: any, view: any) => {
              const referrer = view.referrer || "Direct"
              acc[referrer] = (acc[referrer] || 0) + 1
              return acc
            }, {}) || {}

          const totalReferrers = Object.values(referrers).reduce((a: any, b: any) => a + b, 0) as number

          const topReferrers = Object.entries(referrers)
            .map(([referrer, count]) => ({
              referrer,
              percentage: totalReferrers > 0 ? Math.round(((count as number) / totalReferrers) * 100) : 0,
            }))
            .sort((a, b) => b.percentage - a.percentage)
            .slice(0, 4)

          // If we don't have enough referrers, add default ones
          if (topReferrers.length < 4) {
            const defaultReferrers = ["Direct", "Google", "Facebook", "Instagram"]
            defaultReferrers.forEach((ref) => {
              if (!topReferrers.find((r) => r.referrer === ref)) {
                topReferrers.push({ referrer: ref, percentage: 0 })
              }
            })
            topReferrers.sort((a, b) => b.percentage - a.percentage)
          }

          // Format recent orders
          const recentOrders =
            ordersData?.slice(0, 5).map((order: any) => ({
              id: order.id,
              customer: order.customer_name || "Anonymous",
              product: order.product_name || "Unknown Product",
              amount: order.amount || 0,
              status: order.status || "completed",
              date: new Date(order.created_at).toLocaleDateString(),
            })) || []

          // Set the analytics data
          setAnalyticsData({
            totalViews,
            totalOrders,
            conversionRate: `${conversionRate}%`,
            averageTimeOnSite: "1m 45s", // This would need to be calculated from actual data
            topReferrers,
            viewsOverTime,
            ordersOverTime,
            recentOrders,
          })

          // Update product views and orders if we have analytics data
          if (enhancedProducts.length > 0) {
            // Group views by product
            const viewsByProduct =
              viewsData?.reduce((acc: any, view: any) => {
                acc[view.product_id] = (acc[view.product_id] || 0) + 1
                return acc
              }, {}) || {}

            // Group orders by product
            const ordersByProduct =
              ordersData?.reduce((acc: any, order: any) => {
                acc[order.product_id] = (acc[order.product_id] || 0) + 1
                return acc
              }, {}) || {}

            setProducts(
              enhancedProducts.map((product) => ({
                ...product,
                views: viewsByProduct[product.id] || 0,
                orders: ordersByProduct[product.id] || 0,
                conversionRate: viewsByProduct[product.id]
                  ? `${Math.round(((ordersByProduct[product.id] || 0) / viewsByProduct[product.id]) * 100)}%`
                  : "0%",
              })),
            )
          }

          // Show success toast
          toast({
            title: "Dashboard Loaded",
            description: "Your dashboard data has been successfully loaded.",
            style: { backgroundColor: "#6F4E37", color: "white" },
          })
        } catch (analyticsError) {
          console.error("Error in analytics:", analyticsError)
          // Use default data
          setAnalyticsData(getDefaultAnalyticsData())
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        toast({
          title: "Dashboard Error",
          description: "There was an issue loading your dashboard. Please try again later.",
          variant: "destructive",
        })
        setAnalyticsData(getDefaultAnalyticsData())
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [user, supabase])

  // Loading state
  if (loading) {
    return (
      <main className="w-full">
        <DashboardHeader
          heading="Dashboard"
          description="Overview of your product showcase performance and management."
        >
          <Skeleton className="h-10 w-[140px]" />
        </DashboardHeader>

        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-[120px] w-full" />
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Skeleton className="col-span-4 h-[350px]" />
            <Skeleton className="col-span-3 h-[350px]" />
          </div>

          <Skeleton className="h-[300px] w-full" />
        </div>
      </main>
    )
  }

  return (
    <main className="w-full">
      <DashboardHeader heading="Dashboard" description="Overview of your product showcase performance and management.">
        <AddProductButton />
      </DashboardHeader>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-[#FED8B1]/30">
          <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:text-[#6F4E37]">
            <BarChart3 className="mr-2 h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="products" className="data-[state=active]:bg-white data-[state=active]:text-[#6F4E37]">
            <Box className="mr-2 h-4 w-4" />
            Products
          </TabsTrigger>
          <TabsTrigger value="orders" className="data-[state=active]:bg-white data-[state=active]:text-[#6F4E37]">
            <ShoppingBag className="mr-2 h-4 w-4" />
            Orders
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <VisitorMetrics
              title="Total Views"
              value={analyticsData.totalViews}
              description="All product pages"
              icon={<Eye className="h-4 w-4 text-[#6F4E37]" />}
            />
            <VisitorMetrics
              title="Total Orders"
              value={analyticsData.totalOrders}
              description="Across all products"
              icon={<ShoppingBag className="h-4 w-4 text-[#6F4E37]" />}
            />
            <VisitorMetrics
              title="Conversion Rate"
              value={analyticsData.conversionRate}
              description="Orders per view"
              icon={<ArrowUpRight className="h-4 w-4 text-[#6F4E37]" />}
            />
            <VisitorMetrics
              title="Avg. Time on Site"
              value={analyticsData.averageTimeOnSite}
              description="Per visitor"
              icon={<Calendar className="h-4 w-4 text-[#6F4E37]" />}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Weekly Overview</CardTitle>
                <CardDescription>Views and orders for the past 7 days</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <OverviewChart data={analyticsData} />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Latest orders across all products</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentOrders orders={analyticsData.recentOrders} />
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full border-[#A67B5B]/30 text-[#6F4E37]" asChild>
                  <Link href="/dashboard/orders">View all orders</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Top Referrers</CardTitle>
              <CardDescription>Where your visitors are coming from</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.topReferrers.map((referrer: any, index: number) => (
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
                        {referrer.referrer === "Direct" && <ArrowUpRight className="h-4 w-4 text-[#6F4E37]" />}
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
                        {referrer.referrer === "Twitter" && (
                          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M21.5331 7.11165C21.5483 7.32484 21.5483 7.53803 21.5483 7.75122C21.5483 14.2538 16.5991 21.7462 7.55333 21.7462C4.7665 21.7462 2.17768 20.9391 0 19.5381C0.395953 19.5838 0.776625 19.599 1.18736 19.599C3.48728 19.599 5.60407 18.8224 7.29444 17.4975C5.13199 17.4518 3.31979 16.0356 2.69542 14.0863C3.00001 14.132 3.30456 14.1624 3.62436 14.1624C4.066 14.1624 4.50769 14.1015 4.9189 13.9949C2.66499 13.5381 0.974578 11.5584 0.974578 9.16751V9.10661C1.62938 9.47219 2.39087 9.70061 3.19792 9.73108C1.87304 8.84696 1.04642 7.34007 1.04642 5.63447C1.04642 4.71988 1.29968 3.88808 1.74133 3.15702C4.15736 6.13702 7.8025 8.08539 11.8693 8.29858C11.7936 7.93299 11.7482 7.55226 11.7482 7.17153C11.7482 4.46056 13.9409 2.25781 16.6518 2.25781C18.0675 2.25781 19.3469 2.84149 20.2461 3.80561C21.3486 3.59242 22.3973 3.18122 23.3248 2.61267C22.9596 3.7599 22.1935 4.71988 21.1752 5.33403C22.1633 5.22266 23.1211 4.96 23.9933 4.57927C23.3248 5.5539 22.4863 6.42289 21.5331 7.11165Z"
                              fill="#1DA1F2"
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
                    <Button variant="outline" size="sm" className="border-[#A67B5B]/30 text-[#6F4E37]" asChild>
                      <Link href={`/dashboard/products/${product.id}/edit`}>Edit</Link>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-[#A67B5B]/30 text-[#6F4E37]" 
                      asChild
                      disabled={!product.published}
                    >
                      <Link href={`https://${product.subdomain}.vercel.app`} target="_blank">
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
                <Box className="h-6 w-6 text-[#6F4E37]" />
              </div>
              <h3 className="mb-2 text-lg font-medium">No Products Yet</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                You haven't created any product showcases yet. Get started by adding your first product.
              </p>
              <Button className="bg-[#ECB176] hover:bg-[#A67B5B] text-[#6F4E37]" asChild>
                <Link href="/dashboard/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Product
                </Link>
              </Button>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="orders" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>All orders across your products</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentOrders orders={analyticsData.recentOrders} />
            </CardContent>
          </Card>
          {analyticsData.recentOrders.length === 0 && (
            <Card className="p-8 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#FED8B1]/30">
                <ShoppingBag className="h-6 w-6 text-[#6F4E37]" />
              </div>
              <h3 className="mb-2 text-lg font-medium">No Orders Yet</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                You haven't received any orders yet. Share your product showcases to start getting orders.
              </p>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </main>
  )
}
