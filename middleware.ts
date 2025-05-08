import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const url = request.nextUrl
  const hostname = request.headers.get('host') || ''
  
  // Extract subdomain more reliably
  const subdomain = hostname.split('.')[0]
  const isSubdomain = hostname.endsWith('.shipfaster.tech') && !['www', 'shipfaster'].includes(subdomain)

  // Skip static assets and API routes
  if (url.pathname.startsWith('/_next') || 
      url.pathname.startsWith('/api') ||
      url.pathname.includes('.')) {
    return NextResponse.next()
  }

  // Handle subdomains
  if (isSubdomain) {
    console.log(`Subdomain detected: ${subdomain}, path: ${url.pathname}`)
    
    // For the root path, redirect to the product page
    if (url.pathname === '/') {
      // Create the URL for the rewrite
      const rewriteUrl = new URL(`/product/${subdomain}`, request.url)
      
      console.log(`Rewriting to: ${rewriteUrl.pathname}`)
      
      return NextResponse.rewrite(rewriteUrl, {
        headers: new Headers({
          'x-subdomain': subdomain,
          'Cache-Control': 's-maxage=3600, stale-while-revalidate'
        })
      })
    }
    
    // For specific paths on the subdomain, rewrite but preserve the path
    const newUrl = new URL(`${url.pathname}`, request.url)
    
    // Add the subdomain header to all requests
    return NextResponse.next({
      headers: new Headers({
        'x-subdomain': subdomain,
        'Cache-Control': 's-maxage=3600, stale-while-revalidate'
      })
    })
  }

  // Existing auth logic
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