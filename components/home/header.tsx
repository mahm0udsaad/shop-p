"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"

export function Header() {
  const { session } = useAuth()
  return (
    <header className="border-b sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2 font-bold text-xl">
          <span className="bg-gradient-to-r from-[#6F4E37] to-[#A67B5B] text-transparent bg-clip-text">Product</span>
          <span className="text-[#A67B5B]">Showcase</span>
        </div>
        <nav className="hidden md:flex gap-6">
          <Link href="#features" className="text-sm font-medium text-[#6F4E37] hover:text-[#A67B5B] transition-colors">
            Features
          </Link>
          <Link href="#templates" className="text-sm font-medium text-[#6F4E37] hover:text-[#A67B5B] transition-colors">
            Templates
          </Link>
          <Link href="#pricing" className="text-sm font-medium text-[#6F4E37] hover:text-[#A67B5B] transition-colors">
            Pricing
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          {session ? (
            <Link href="/dashboard">
              <Button
                size="sm"
                className="bg-[#ECB176] hover:bg-[#A67B5B] text-[#6F4E37] shadow-sm hover:scale-105 transition-all"
              >
                Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-[#6F4E37] hover:scale-105 transition-transform">
                  Log In
                </Button>
              </Link>
              <Link href="/signup">
                <Button
                  size="sm"
                  className="bg-[#ECB176] hover:bg-[#A67B5B] text-[#6F4E37] shadow-sm hover:scale-105 transition-all"
                >
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
