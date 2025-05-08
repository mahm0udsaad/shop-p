import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Get the host from headers
  const host = request.headers.get('host') || ''
  
  // Create a debug header to track middleware processing
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-middleware-invoke', 'true')
  
  // Skip subdomain handling for localhost or specific paths
  const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1')
  const pathname = request.nextUrl.pathname
  
  // Debug logging for development
  console.log(`Middleware processing: ${host} ${pathname}`)
  
  // Skip processing if already on internal paths
  if (pathname.startsWith('/api/') || 
      pathname.startsWith('/_next/') || 
      pathname.startsWith('/showcase/')) {
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }
  
  // Handle subdomains for shipfaster.tech
  if (!isLocalhost && host.includes('.shipfaster.tech')) {
    // Extract subdomain from host
    const subdomain = host.split('.shipfaster.tech')[0]
    
    // Skip processing if this is the main domain or www
    if (subdomain && !['www', ''].includes(subdomain)) {
      // For subdomain access, rewrite to /showcase/[subdomain]
      const showcaseUrl = new URL(`/showcase/${subdomain}`, request.url)
      console.log(`Rewriting to: ${showcaseUrl.toString()}`)
      requestHeaders.set('x-middleware-rewrite', showcaseUrl.toString())
      
      return NextResponse.rewrite(showcaseUrl, {
        request: {
          headers: requestHeaders,
        },
      })
    }
  }
  
  // Continue with standard session handling
  return await updateSession(request)
}

async function updateSession(request: NextRequest) {
  // Create a new headers object with all the original headers
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-middleware-auth', 'true')
  
  let supabaseResponse = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request: {
              headers: requestHeaders,
            },
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: DO NOT REMOVE auth.getUser()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  // Define protected and auth routes
  const isAuthRoute =
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/signup") ||
    request.nextUrl.pathname.startsWith("/forgot-password") ||
    request.nextUrl.pathname.startsWith("/reset-password")

  const isProtectedRoute = request.nextUrl.pathname.startsWith("/dashboard")

  // Redirect logic
  if (isProtectedRoute && !user) {
    // Redirect unauthenticated users to login
    const redirectUrl = new URL("/login", request.url)
    redirectUrl.searchParams.set("redirect", request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  if (isAuthRoute && user) {
    // Redirect authenticated users to dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    // Include all routes that should be protected or have auth redirects
    "/dashboard/:path*", 
    "/login", 
    "/signup", 
    "/forgot-password", 
    "/reset-password",
    // Capture all hostnames with the shipfaster.tech domain
    // except for localhost and except showcase routes to prevent loops
    {
      source: "/((?!api|_next|showcase|login|dashboard|signup|forgot-password|reset-password).*)",
      has: [
        {
          type: "host",
          value: ".*\\.shipfaster\\.tech",
        },
      ],
    },
  ],
}