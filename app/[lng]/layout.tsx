import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Product Showcase",
  description: "Create beautiful product showcases with custom domains in minutes.",
  generator: "v0.dev",
}

// Force dynamic rendering
export const dynamic = "force-dynamic"

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
