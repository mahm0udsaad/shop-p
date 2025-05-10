import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { Toaster } from "@/components/ui/toaster"
import { getServerSession } from "@/lib/supabase/server"
import { headers } from "next/headers"
import { createClient } from "@/lib/supabase/server"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Product Showcase",
  description: "Create beautiful product showcases with custom domains in minutes.",
  generator: 'v0.dev'
}

// Force dynamic rendering to ensure fresh session data
export const dynamic = "force-dynamic"

// Helper function to get tracking ID for current subdomain
async function getTrackingId(host: string) {
  // Default tracking ID (for the main domain)
  const defaultTrackingId = "c47b9941-16f4-4778-9791-6965b1ed9a67";
  
  // If no host is provided, return default
  if (!host) return defaultTrackingId;
  
  try {
    // Extract subdomain from host
    const hostParts = host.split('.');
    if (hostParts.length <= 1) return defaultTrackingId;
    
    const subdomain = hostParts[0];
    
    // Skip for certain subdomains
    if (['www', 'app', 'dashboard'].includes(subdomain)) {
      return defaultTrackingId;
    }
    
    // Get the Supabase client
    const supabase = await createClient();
    
    // First, check if we have a tracking ID for this specific subdomain
    const { data: analyticData } = await supabase
      .from("analytics_tracking")
      .select("tracking_id")
      .eq("subdomain", subdomain)
      .single();
      
    if (analyticData?.tracking_id) {
      // We have a tracking ID for this subdomain
      return analyticData.tracking_id;
    }
    
    // Alternatively, fetch from products table if you store it there
    const { data: productData } = await supabase
      .from("products")
      .select("analytics_id, user_id")
      .eq("subdomain", subdomain)
      .single();
      
    if (productData?.analytics_id) {
      return productData.analytics_id;
    }
    
    // If we don't have a tracking ID specific to this subdomain,
    // we could check if there's a user-level tracking ID
    if (productData?.user_id) {
      const { data: userData } = await supabase
        .from("users")
        .select("default_tracking_id")
        .eq("id", productData.user_id)
        .single();
        
      if (userData?.default_tracking_id) {
        return userData.default_tracking_id;
      }
    }
    
    // Fall back to the default tracking ID if nothing else is found
    return defaultTrackingId;
    
  } catch (error) {
    console.error("Error fetching tracking ID:", error);
    return defaultTrackingId;
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Get the session on the server
  const session = await getServerSession();
  
  // Get host from headers
  const headersList = await headers();
  const host = headersList.get('host') || '';
  
  // Get the appropriate tracking ID based on subdomain
  const trackingId = await getTrackingId(host);
  
  // Add data attributes for custom events
  const dataAttributes: Record<string, string> = {};
  if (host) {
    dataAttributes['data-domains'] = host;
    
    // Extract subdomain for additional tracking
    const hostParts = host.split('.');
    if (hostParts.length > 1) {
      dataAttributes['data-subdomain'] = hostParts[0];
    }
  }

  return (
    <html lang="en">
      <head>
        <script src="https://app.lemonsqueezy.com/js/lemon.js" defer></script>
        <script 
          defer 
          src="https://analytics.shipfaster.tech/script.js" 
          data-website-id={trackingId} 
          {...dataAttributes}
        ></script>
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <AuthProvider initialSession={session}>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}