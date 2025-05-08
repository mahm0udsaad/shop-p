import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Skip subdomain handling for localhost
  const host = request.headers.get('host')
  const isLocalhost = host?.includes('localhost')
  
  // Handle subdomains for shipfaster.tech
  if (!isLocalhost && host?.includes('.shipfaster.tech')) {
    // Extract subdomain from host
    const subdomain = host.split('.shipfaster.tech')[0]
    
    if (subdomain) {
      // For subdomain access, redirect to /showcase/[subdomain]
      const showcaseUrl = new URL(`/showcase/${subdomain}`, request.url)
      return NextResponse.rewrite(showcaseUrl)
    }
  }
  
  // Continue with standard session handling
  return await updateSession(request)
}

async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
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
            request,
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
    // except for localhost
    {
      source: "/((?!localhost).*)",
      has: [
        {
          type: "host",
          value: ".*\\.shipfaster\\.tech",
        },
      ],
    },
  ],
}