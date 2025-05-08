import { NextResponse } from "next/server"

export async function GET(request: Request) {
  // Extract hostname information
  const host = request.headers.get('host') || 'unknown'
  const url = new URL(request.url)
  
  // Get all headers for debugging
  const headers: Record<string, string> = {}
  request.headers.forEach((value, key) => {
    headers[key] = value
  })
  
  // Parse subdomain if present
  let subdomain = null
  if (host.includes('.shipfaster.tech')) {
    subdomain = host.split('.shipfaster.tech')[0]
    if (['www', ''].includes(subdomain)) {
      subdomain = null
    }
  }
  
  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    host: host,
    path: url.pathname,
    environment: process.env.NODE_ENV || 'unknown',
    isSubdomain: !!subdomain,
    subdomain: subdomain,
    headers: {
      // Include important headers for debugging
      host: headers.host,
      'x-forwarded-host': headers['x-forwarded-host'],
      'x-forwarded-proto': headers['x-forwarded-proto'],
      'x-forwarded-for': headers['x-forwarded-for'],
      'x-real-ip': headers['x-real-ip'],
      'x-middleware-invoke': headers['x-middleware-invoke'],
      'x-middleware-rewrite': headers['x-middleware-rewrite'],
      'x-middleware-auth': headers['x-middleware-auth'],
      // Include all headers if in development
      ...(process.env.NODE_ENV === 'development' ? headers : {})
    }
  })
}