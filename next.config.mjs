/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  poweredByHeader: false,
  // Trust the Nginx proxy
  experimental: {
    // Trust headers coming from our proxy
    forwardedHeaders: {
      // Trust X-Forwarded-Host header from our reverse proxy
      hostnameHeader: "X-Forwarded-Host",
    },
  },
}

export default nextConfig