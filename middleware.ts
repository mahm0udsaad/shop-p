import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { match as matchLocale } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'

const locales = ['en', 'ar']
const defaultLocale = 'en'

function getLocale(request: NextRequest) {
  // Check if there's a locale in the pathname
  const pathname = request.nextUrl.pathname
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )

  if (!pathnameIsMissingLocale) {
    // Extract locale from pathname
    const segments = pathname.split('/')
    return segments[1] || defaultLocale
  }

  // Use Accept-Language header to determine locale
  const negotiatorHeaders: Record<string, string> = {}
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value))

  const languages = new Negotiator({ headers: negotiatorHeaders }).languages()
  
  try {
    return matchLocale(languages, locales, defaultLocale)
  } catch {
    return defaultLocale
  }
}

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

  // Handle language routing for non-subdomain requests
  if (!isSubdomain) {
    const pathname = request.nextUrl.pathname
    const pathnameIsMissingLocale = locales.every(
      (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
    )

    // Redirect if there is no locale in the pathname
    if (pathnameIsMissingLocale) {
      const locale = getLocale(request)
      return NextResponse.redirect(
        new URL(`/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`, request.url)
      )
    }
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
  
  // Extract locale from pathname for auth route checks
  const pathname = request.nextUrl.pathname
  const segments = pathname.split('/')
  const locale = segments[1] 
  const pathWithoutLocale = segments.slice(2).join('/')

  // Define protected and auth routes (accounting for locale prefix)
  const isAuthRoute =
    pathWithoutLocale.startsWith("login") ||
    pathWithoutLocale.startsWith("signup") ||
    pathWithoutLocale.startsWith("forgot-password") ||
    pathWithoutLocale.startsWith("reset-password")

  const isProtectedRoute = pathWithoutLocale.startsWith("dashboard")

  // Redirect logic
  if (isProtectedRoute && !user) {
    // Redirect unauthenticated users to login (preserve locale)
    const redirectUrl = new URL(`/${locale}/login`, request.url)
    redirectUrl.searchParams.set("redirect", request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  if (isAuthRoute && user) {
    // Redirect authenticated users to dashboard (preserve locale)
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url))
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