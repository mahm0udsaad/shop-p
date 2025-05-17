import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Database } from "@/lib/database.types"
import { getWebsiteAnalytics, getWebsiteMetrics } from "../actions/umami"

export const getDefaultReferrers = () => {
  return [
    { referrer: "Direct", percentage: 0 },
    { referrer: "Google", percentage: 0 },
    { referrer: "Facebook", percentage: 0 },
    { referrer: "Instagram", percentage: 0 },
  ]
}

export const getDefaultAnalyticsData = () => {
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

interface UmamiAnalytics {
  websiteId: string;
  pageViews: number;
  referrers: Array<{ x: string; y: number }>;
  devices: Array<{ name: string; value: number }>;
  browsers: Array<{ name: string; value: number }>;
  os: Array<{ name: string; value: number }>;
  countries: Array<{ name: string; value: number }>;
  dailyPageviews: Array<{ date: string; views: number }>;
  timeOnSite?: number;
}

async function getUmamiAnalyticsForProduct(websiteId: string): Promise<UmamiAnalytics | null> {
  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - 7)

  try {
    const [
      analyticsData, 
      referrerData,
      deviceData,
      browserData,
      osData,
      countryData,
      pageviewsData
    ] = await Promise.all([
      getWebsiteAnalytics(websiteId, startDate, endDate, 'day'),
      getWebsiteMetrics(websiteId, 'referrer', startDate, endDate, 10),
      getWebsiteMetrics(websiteId, 'device', startDate, endDate, 5),
      getWebsiteMetrics(websiteId, 'browser', startDate, endDate, 5),
      getWebsiteMetrics(websiteId, 'os', startDate, endDate, 5),
      getWebsiteMetrics(websiteId, 'country', startDate, endDate, 5),
      getWebsiteMetrics(websiteId, 'url', startDate, endDate, 100)
    ])

    if (!analyticsData) return null

    // Process daily pageviews for the chart
    const dailyPageviews = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toLocaleDateString("en-US", { weekday: "short" })
      return {
        date: dateStr,
        views: 0
      }
    }).reverse()

    // Fill in actual pageview data
    pageviewsData?.forEach((pv: any) => {
      const date = new Date(pv.t).toLocaleDateString("en-US", { weekday: "short" })
      const dayData = dailyPageviews.find(d => d.date === date)
      if (dayData) {
        dayData.views = pv.y
      }
    })

    return {
      websiteId,
      pageViews: analyticsData.pageviews.value,
      referrers: referrerData?.map((ref: any) => ({ x: ref.x, y: ref.y })) || [],
      devices: deviceData?.map((dev: any) => ({ name: dev.x, value: dev.y })) || [],
      browsers: browserData?.map((br: any) => ({ name: br.x, value: br.y })) || [],
      os: osData?.map((os: any) => ({ name: os.x, value: os.y })) || [],
      countries: countryData?.map((country: any) => ({ name: country.x, value: country.y })) || [],
      dailyPageviews,
      timeOnSite: analyticsData.avgDuration || 0
    }
  } catch (error) {
    console.error("Error fetching Umami analytics:", error)
    return null
  }
}

export async function getDashboardData(userId: string, selectedProductId?: string) {
  const supabase = createServerComponentClient<Database>({ cookies })

  try {
    // First fetch products with basic info
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
        featured
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (productsError) throw productsError

    // Get analytics IDs for all subdomains in one query
    const subdomains = productsData
      .map(p => p.subdomain)
      .filter(Boolean) as string[]

    const { data: domainData, error: domainError } = await supabase
      .from("domains")
      .select("subdomain, analytics_id")
      .in("subdomain", subdomains)
      .eq("is_active", true)

    if (domainError) throw domainError

    // Create a map of subdomain to analytics_id
    const analyticsMap = new Map(
      domainData?.map(d => [d.subdomain, d.analytics_id]) || []
    )

    // Enhance products with analytics info and format data
    const enhancedProducts = await Promise.all(productsData.map(async (product: any) => {
      const media = product.media || {}
      const templateData = product.template_data || {}
      
      // Get analytics_id from the map using product's subdomain
      const analyticsId = product.subdomain ? analyticsMap.get(product.subdomain) : null
      
      // Fetch Umami analytics if we have an analytics_id
      let analyticsData = null
      if (analyticsId && (!selectedProductId || selectedProductId === product.id)) {
        analyticsData = await getUmamiAnalyticsForProduct(analyticsId)
      }

      return {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        template: product.template || "modern",
        subdomain: product.subdomain || "not-published",
        published: product.published || false,
        featured: product.featured || false,
        orders: 0,
        views: analyticsData?.pageViews || 0,
        conversionRate: "0%",
        created: new Date(product.created_at).toISOString().split("T")[0],
        image: media.images?.[0] || templateData.media?.images?.[0] || "/diverse-products-still-life.png",
        tagline: templateData.tagline || "",
        benefits: templateData.benefits || [],
        features: templateData.features || [],
        theme: templateData.theme || { primaryColor: "", secondaryColor: "" },
        analyticsId: analyticsId,
        timeOnSite: analyticsData?.timeOnSite || 0,
        analyticsData: analyticsData
      }
    }))
    
    // Fetch orders data
    const { data: ordersData, error: ordersError } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      .order("created_at", { ascending: false })

    if (ordersError) throw ordersError

    // Calculate total views and process analytics
    const totalViews = enhancedProducts.reduce((sum, product) => sum + product.views, 0)
    const totalOrders = ordersData?.length || 0
    const conversionRate = totalViews > 0 ? Math.round((totalOrders / totalViews) * 100) : 0
    const avgTimeOnSite = enhancedProducts.reduce((sum, product) => sum + (product.timeOnSite || 0), 0) / enhancedProducts.length

    // Format time on site
    const formatTimeOnSite = (seconds: number) => {
      const minutes = Math.floor(seconds / 60)
      const remainingSeconds = Math.floor(seconds % 60)
      return `${minutes}m ${remainingSeconds}s`
    }

    // Process orders by day
    const ordersByDay = ordersData?.reduce((acc: any, order: any) => {
      const date = new Date(order.created_at).toLocaleDateString("en-US", { weekday: "short" })
      acc[date] = (acc[date] || 0) + 1
      return acc
    }, {}) || {}

    // Create viewsOverTime and ordersOverTime arrays
    const timeData = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toLocaleDateString("en-US", { weekday: "short" })
      return {
        date: dateStr,
        views: 0, // Will be populated with Umami data
        orders: ordersByDay[dateStr] || 0
      }
    }).reverse()

    // Populate views data from Umami
    enhancedProducts.forEach(product => {
      if (product.analyticsData?.dailyPageviews) {
        product.analyticsData.dailyPageviews.forEach((dayData: any) => {
          const timeDataEntry = timeData.find(d => d.date === dayData.date)
          if (timeDataEntry) {
            timeDataEntry.views += dayData.views
          }
        })
      }
    })

    // Format recent orders
    const recentOrders = ordersData?.slice(0, 5).map((order: any) => ({
      id: order.id,
      order_number: order.order_number,
      customer: order.customer_name || "Anonymous",
      product: order.product_name || "Unknown Product",
      amount: order.amount || 0,
      status: order.status || "completed",
      date: new Date(order.created_at).toLocaleDateString(),
      created_at: order.created_at,
      customer_email: order.customer_email,
      customer_phone: order.customer_phone,
      notes: order.notes,
      shipping_address: order.shipping_address,
      billing_address: order.billing_address,
      currency: order.currency
    })) || []

    // Update product orders if we have orders data
    if (enhancedProducts.length > 0 && ordersData) {
      const ordersByProduct = ordersData.reduce((acc: any, order: any) => {
        acc[order.product_id] = (acc[order.product_id] || 0) + 1
        return acc
      }, {})

      enhancedProducts.forEach(product => {
        product.orders = ordersByProduct[product.id] || 0
        product.conversionRate = product.views
          ? `${Math.round((product.orders / product.views) * 100)}%`
          : "0%"
      })
    }

    return {
      products: enhancedProducts,
      analytics: {
        totalViews,
        totalOrders,
        conversionRate: `${conversionRate}%`,
        averageTimeOnSite: formatTimeOnSite(avgTimeOnSite),
        viewsOverTime: timeData.map(d => ({ date: d.date, views: d.views })),
        ordersOverTime: timeData.map(d => ({ date: d.date, orders: d.orders })),
        recentOrders,
        topReferrers: getDefaultReferrers(),
        devices: enhancedProducts.reduce((acc, product) => {
          if (product.analyticsData?.devices) {
            product.analyticsData.devices.forEach((device: any) => {
              const existing = acc.find(d => d.name === device.name)
              if (existing) {
                existing.value += device.value
              } else {
                acc.push({ ...device })
              }
            })
          }
          return acc
        }, [] as any[]),
        browsers: enhancedProducts.reduce((acc, product) => {
          if (product.analyticsData?.browsers) {
            product.analyticsData.browsers.forEach((browser: any) => {
              const existing = acc.find(b => b.name === browser.name)
              if (existing) {
                existing.value += browser.value
              } else {
                acc.push({ ...browser })
              }
            })
          }
          return acc
        }, [] as any[]),
        os: enhancedProducts.reduce((acc, product) => {
          if (product.analyticsData?.os) {
            product.analyticsData.os.forEach((os: any) => {
              const existing = acc.find(o => o.name === os.name)
              if (existing) {
                existing.value += os.value
              } else {
                acc.push({ ...os })
              }
            })
          }
          return acc
        }, [] as any[]),
        countries: enhancedProducts.reduce((acc, product) => {
          if (product.analyticsData?.countries) {
            product.analyticsData.countries.forEach((country: any) => {
              const existing = acc.find(c => c.name === country.name)
              if (existing) {
                existing.value += country.value
              } else {
                acc.push({ ...country })
              }
            })
          }
          return acc
        }, [] as any[])
      }
    }
  } catch (error) {
    console.error("Error fetching dashboard data:", error)
    return {
      products: [],
      analytics: {
        ...getDefaultAnalyticsData(),
        devices: [],
        browsers: [],
        os: [],
        countries: []
      }
    }
  }
} 