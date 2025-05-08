import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const url = request.nextUrl
  const hostname = request.headers.get('host') || ''
  const subdomain = hostname.split('.')[0]
  const mainDomain = 'shipfaster.tech'
  console.log('subdomain', subdomain)
  console.log('hostname', hostname)
  console.log('url', url)

  // Skip middleware for static files and API routes
  if (
    url.pathname.startsWith('/_next') ||
    url.pathname.startsWith('/api') ||
    url.pathname.startsWith('/static') ||
    url.pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Handle auth and session first
  const supabaseResponse = await updateSession(request)
  if (supabaseResponse.status !== 200) {
    return supabaseResponse
  }

  // Skip subdomain handling for main domain
  if (hostname === mainDomain) {
    return supabaseResponse
  }

  // Handle subdomain routing
  if (subdomain && subdomain !== 'www') {
    // Check if we're already on a product path to prevent redirect loops
    if (!url.pathname.startsWith('/product/')) {
      // Create new URL while preserving the original domain
      const newUrl = new URL(request.url)
      newUrl.pathname = `/product/${subdomain}${url.pathname}`
      
      // Add subdomain to headers for the API route
      const requestHeaders = new Headers(request.headers)
      requestHeaders.set('x-subdomain', subdomain)
      
      console.log('newUrl', newUrl)
      return NextResponse.rewrite(newUrl, {
        headers: requestHeaders,
      })
    }
  }

  return supabaseResponse
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
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}