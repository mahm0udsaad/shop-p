import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Database } from "@/lib/database.types"
import { getWebsiteAnalytics, getWebsiteMetrics } from "../../actions/umami"

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

// Create cache for analytics data
const analyticsCache = new Map<string, { data: UmamiAnalytics | null, timestamp: number }>();
const CACHE_EXPIRY = 15 * 60 * 1000; // 15 minutes cache expiry

/**
 * Helper function to implement retry with exponential backoff
 */
async function withRetry<T>(operation: () => Promise<T>, retries = 3, initialDelay = 300): Promise<T> {
  let lastError: any;
  let delay = initialDelay;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      if (attempt === retries) {
        throw error;
      }
      
      // Exponential backoff with jitter
      const jitter = Math.random() * 0.3; // 0-30% jitter
      await new Promise(resolve => setTimeout(resolve, delay * (1 + jitter)));
      delay *= 2; // Exponential increase in delay
    }
  }
  
  // TypeScript needs this even though the loop above will either return or throw
  throw lastError;
}

/**
 * Get analytics data from Umami for a specific product
 * With improved error handling, retries, and caching
 */
async function getUmamiAnalyticsForProduct(websiteId: string): Promise<UmamiAnalytics | null> {
  // Check cache first
  const cached = analyticsCache.get(websiteId);
  if (cached && Date.now() - cached.timestamp < CACHE_EXPIRY) {
    return cached.data;
  }
  
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 7);
  
  // Initialize with default data structure
  const defaultAnalytics: UmamiAnalytics = {
    websiteId,
    pageViews: 0,
    referrers: [],
    devices: [],
    browsers: [],
    os: [],
    countries: [],
    dailyPageviews: generateEmptyDailyData(),
    timeOnSite: 0
  };

  try {
    // Fetch basic analytics with retries
    const analyticsData = await withRetry(
      () => getWebsiteAnalytics(websiteId, startDate, endDate, 'day'),
      2, // Max 2 retries
      300 // 300ms initial delay
    ).catch(error => {
      console.error("Failed to fetch website analytics:", error);
      return null;
    });

    if (!analyticsData) {
      analyticsCache.set(websiteId, { data: defaultAnalytics, timestamp: Date.now() });
      return defaultAnalytics;
    }

    // Fetch all metrics in parallel with independent retries
    const [
      referrerData,
      deviceData,
      browserData,
      osData,
      countryData,
      pageviewsData
    ] = await Promise.all([
      withRetry(() => getWebsiteMetrics(websiteId, 'referrer', startDate, endDate, 10), 2, 300)
        .catch(error => { console.error("Failed to fetch referrer data:", error); return []; }),
      withRetry(() => getWebsiteMetrics(websiteId, 'device', startDate, endDate, 5), 2, 300)
        .catch(error => { console.error("Failed to fetch device data:", error); return []; }),
      withRetry(() => getWebsiteMetrics(websiteId, 'browser', startDate, endDate, 5), 2, 300)
        .catch(error => { console.error("Failed to fetch browser data:", error); return []; }),
      withRetry(() => getWebsiteMetrics(websiteId, 'os', startDate, endDate, 5), 2, 300)
        .catch(error => { console.error("Failed to fetch OS data:", error); return []; }),
      withRetry(() => getWebsiteMetrics(websiteId, 'country', startDate, endDate, 5), 2, 300)
        .catch(error => { console.error("Failed to fetch country data:", error); return []; }),
      withRetry(() => getWebsiteMetrics(websiteId, 'url', startDate, endDate, 100), 2, 300)
        .catch(error => { console.error("Failed to fetch URL metrics:", error); return []; })
    ]);

    // Process daily pageviews for the chart
    const dailyPageviews = generateEmptyDailyData();

    // Fill in actual pageview data
    if (pageviewsData && Array.isArray(pageviewsData)) {
      pageviewsData.forEach((pv: any) => {
        const date = new Date(pv.t).toLocaleDateString("en-US", { weekday: "short" });
        const dayData = dailyPageviews.find(d => d.date === date);
        if (dayData) {
          dayData.views = pv.y;
        }
      });
    }

    const result: UmamiAnalytics = {
      websiteId,
      pageViews: analyticsData.pageviews?.value || 0,
      referrers: Array.isArray(referrerData) 
        ? referrerData.map((ref: any) => ({ x: ref.x, y: ref.y })) 
        : [],
      devices: Array.isArray(deviceData) 
        ? deviceData.map((dev: any) => ({ name: dev.x, value: dev.y })) 
        : [],
      browsers: Array.isArray(browserData) 
        ? browserData.map((br: any) => ({ name: br.x, value: br.y })) 
        : [],
      os: Array.isArray(osData) 
        ? osData.map((os: any) => ({ name: os.x, value: os.y })) 
        : [],
      countries: Array.isArray(countryData) 
        ? countryData.map((country: any) => ({ name: country.x, value: country.y })) 
        : [],
      dailyPageviews,
      timeOnSite: analyticsData.avgDuration || 0
    };

    // Cache the result
    analyticsCache.set(websiteId, { data: result, timestamp: Date.now() });
    return result;
  } catch (error) {
    console.error("Error fetching Umami analytics:", error);
    
    // Cache the error result (with defaults) to prevent repeated failing requests
    analyticsCache.set(websiteId, { data: defaultAnalytics, timestamp: Date.now() });
    return defaultAnalytics;
  }
}

/**
 * Generate empty daily data for the past 7 days
 */
function generateEmptyDailyData() {
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toLocaleDateString("en-US", { weekday: "short" });
    return {
      date: dateStr,
      views: 0
    };
  }).reverse();
}

export async function getDashboardData(userId: string, selectedProductId?: string) {
  const supabase = createServerComponentClient<Database>({ cookies })

  try {
    // First fetch products with basic info
    const { data: productsData, error: productsError } = await supabase
      .from("products")
      .select(`
        id,
        template,
        slug,
        created_at,
        published,
        hero_image_url
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (productsError) throw productsError

    // Get analytics IDs for all subdomains in one query
    const subdomains = productsData
      .map(p => p.slug)
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
    // Use Promise.allSettled to handle individual product fetch failures gracefully
    const enhancedProductsResults = await Promise.allSettled(productsData.map(async (product: any) => {
      try {
        // Get analytics_id from the map using product's subdomain
        const analyticsId = product.slug ? analyticsMap.get(product.slug) : null;
        // Fetch Umami analytics if we have an analytics_id
        let analyticsData = null;
        if (analyticsId && (!selectedProductId || selectedProductId === product.id)) {
          try {
            analyticsData = await getUmamiAnalyticsForProduct(analyticsId);
          } catch (error) {
            console.error(`Error fetching analytics for product ${product.id}:`, error);
            // Continue with null analytics rather than failing the whole product
          }
        }

        return {
          id: product.id,
          slug: product.slug || "",
          template: product.template || "modern",
          published: product.published || false,
          orders: 0,
          views: analyticsData?.pageViews || 0,
          conversionRate: "0%",
          created: new Date(product.created_at).toISOString().split("T")[0],
          image: product.hero_image_url || "/diverse-products-still-life.png",
          analyticsId: analyticsId,
          timeOnSite: analyticsData?.timeOnSite || 0,
          analyticsData: analyticsData
        };
      } catch (error) {
        console.error(`Error processing product ${product.id}:`, error);
        // Return a basic product with minimal data to prevent dashboard failure
        return {
          id: product.id,
          slug: product.slug || "",
          template: product.template || "modern",
          published: product.published || false,
          orders: 0,
          views: 0,
          conversionRate: "0%",
          created: new Date(product.created_at).toISOString().split("T")[0],
          image: "/diverse-products-still-life.png",
          analyticsId: null,
          timeOnSite: 0,
          analyticsData: null
        };
      }
    }));

    // Filter out failed product fetches and use only successful ones
    const enhancedProducts = enhancedProductsResults
      .filter(result => result.status === 'fulfilled')
      .map(result => (result as PromiseFulfilledResult<any>).value);
    
    // Fetch orders data
    const { data: ordersData, error: ordersError } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      .order("created_at", { ascending: false });

    if (ordersError) {
      console.error("Error fetching orders:", ordersError);
      // Continue with empty orders rather than failing the entire dashboard
    }

    // Safety check to ensure we have products
    if (!enhancedProducts.length) {
      console.warn("No products could be processed successfully");
      return {
        products: [],
        analytics: getDefaultAnalyticsData()
      };
    }

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

    // Process orders by day with safety checks
    const ordersByDay = (ordersData || []).reduce((acc: any, order: any) => {
      try {
        const date = new Date(order.created_at).toLocaleDateString("en-US", { weekday: "short" })
        acc[date] = (acc[date] || 0) + 1
      } catch (error) {
        console.error("Error processing order date:", error);
        // Skip this order but continue processing others
      }
      return acc
    }, {});

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

    // Populate views data from Umami with safety checks
    enhancedProducts.forEach(product => {
      if (product.analyticsData?.dailyPageviews) {
        try {
          product.analyticsData.dailyPageviews.forEach((dayData: any) => {
            const timeDataEntry = timeData.find(d => d.date === dayData.date)
            if (timeDataEntry) {
              timeDataEntry.views += dayData.views
            }
          })
        } catch (error) {
          console.error("Error processing pageviews data:", error);
          // Continue with the data we have
        }
      }
    })

    // Format recent orders with safety checks
    const recentOrders = (ordersData || []).slice(0, 5).map((order: any) => {
      try {
        return {
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
        }
      } catch (error) {
        console.error("Error formatting order:", error);
        // Return a basic order to prevent dashboard failure
        return {
          id: order.id || "unknown",
          customer: "Anonymous",
          product: "Unknown Product",
          amount: 0,
          status: "completed",
          date: new Date().toLocaleDateString()
        };
      }
    });

    // Update product orders if we have orders data
    if (enhancedProducts.length > 0 && ordersData) {
      try {
        const ordersByProduct = ordersData.reduce((acc: any, order: any) => {
          if (order.product_id) {
            acc[order.product_id] = (acc[order.product_id] || 0) + 1;
          }
          return acc
        }, {});

        enhancedProducts.forEach(product => {
          product.orders = ordersByProduct[product.id] || 0;
          product.conversionRate = product.views
            ? `${Math.round((product.orders / product.views) * 100)}%`
            : "0%";
        });
      } catch (error) {
        console.error("Error updating product orders:", error);
        // Continue with default conversion data
      }
    }

    // Process analytics data safely
    const processMetrics = (products: any[], extractor: (product: any) => any[]) => {
      return products.reduce((acc, product) => {
        try {
          const metrics = extractor(product);
          if (Array.isArray(metrics)) {
            metrics.forEach((metric: any) => {
              if (!metric || !metric.name) return;
              const existing = acc.find((d: { name: string; value: number }) => d.name === metric.name);
              if (existing) {
                existing.value += metric.value;
              } else {
                acc.push({ ...metric });
              }
            });
          }
        } catch (error) {
          console.error("Error processing metrics:", error);
          // Continue with the accumulated metrics
        }
        return acc;
      }, [] as any[]);
    };

    return {
      products: enhancedProducts,
      analytics: {
        totalViews,
        totalOrders,
        conversionRate: `${conversionRate}%`,
        averageTimeOnSite: formatTimeOnSite(avgTimeOnSite),
        viewsOverTime: timeData.map((d: { date: string; views: number }) => ({ date: d.date, views: d.views })),
        ordersOverTime: timeData.map((d: { date: string; orders: number }) => ({ date: d.date, orders: d.orders })),
        recentOrders,
        topReferrers: getDefaultReferrers(),
        devices: processMetrics(enhancedProducts, p => p.analyticsData?.devices || []),
        browsers: processMetrics(enhancedProducts, p => p.analyticsData?.browsers || []),
        os: processMetrics(enhancedProducts, p => p.analyticsData?.os || []),
        countries: processMetrics(enhancedProducts, p => p.analyticsData?.countries || [])
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