import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { Toaster } from "@/components/ui/toaster"
import { getServerSession } from "@/lib/supabase/server"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Product Showcase",
  description: "Create beautiful product showcases with custom domains in minutes.",
    generator: 'v0.dev'
}

// Force dynamic rendering to ensure fresh session data
export const dynamic = "force-dynamic"

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Get the session on the server
  const session = await getServerSession()

  return (
    <html lang="en">
      <head>
        <script src="https://app.lemonsqueezy.com/js/lemon.js" defer></script>
        <script defer src="https://analytics.shipfaster.tech/script.js" data-website-id="c47b9941-16f4-4778-9791-6965b1ed9a67"></script>
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
