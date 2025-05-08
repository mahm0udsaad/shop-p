"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Loader2 } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

export default function ResetPasswordPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check if we have a hash in the URL (from the reset password email)
    const hashParams = new URLSearchParams(window.location.hash.substring(1))
    if (!hashParams.get("access_token")) {
      toast({
        title: "Invalid link",
        description: "This password reset link is invalid or has expired.",
        variant: "destructive",
      })
    }
  }, [toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setIsLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({ password })

      if (error) {
        setError(error.message)
      } else {
        setIsSuccess(true)
        toast({
          title: "Password updated",
          description: "Your password has been successfully updated.",
        })

        // Redirect to login after a delay
        setTimeout(() => {
          router.push("/login")
        }, 3000)
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center px-4 md:px-6">
          <Link href="/login" className="flex items-center text-sm font-medium text-[#6F4E37]">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Sign In
          </Link>
        </div>
      </header>

      <main className="flex-1 grid grid-cols-1 md:grid-cols-2">
        {/* Logo and Showcase Column */}
        <div className="hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-[#6F4E37]/10 to-[#A67B5B]/20 p-8">
          <div className="flex flex-col items-center max-w-md text-center">
            <div className="flex items-center justify-center gap-2 font-bold text-4xl mb-6">
              <span className="bg-gradient-to-r from-[#6F4E37] to-[#A67B5B] text-transparent bg-clip-text">
                Product
              </span>
              <span className="text-[#A67B5B]">Showcase</span>
            </div>
            <div className="relative w-64 h-64 mb-8">
              <div className="absolute inset-0 bg-gradient-to-br from-[#6F4E37] to-[#A67B5B] rounded-full opacity-20 blur-xl"></div>
              <img
                src="/abstract-geometric-shapes.png"
                alt="Product Showcase"
                className="relative w-full h-full object-contain"
              />
            </div>
            <h2 className="text-2xl font-bold text-[#6F4E37] mb-4">Set Your New Password</h2>
            <p className="text-[#A67B5B]">
              Create a strong password to secure your account and protect your product showcase.
            </p>
          </div>
        </div>

        {/* Form Column */}
        <div className="flex items-center justify-center py-12 px-4">
          <motion.div
            className="w-full max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-8 text-center">
              <div className="md:hidden flex items-center justify-center gap-2 font-bold text-2xl mb-2">
                <span className="bg-gradient-to-r from-[#6F4E37] to-[#A67B5B] text-transparent bg-clip-text">
                  Product
                </span>
                <span className="text-[#A67B5B]">Showcase</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-[#6F4E37]">Reset your password</h1>
              <p className="text-sm text-[#A67B5B] mt-1">Enter your new password below</p>
            </div>

            {isSuccess ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <h3 className="text-lg font-medium text-green-800 mb-2">Password updated successfully</h3>
                <p className="text-green-700 mb-4">
                  Your password has been reset. You will be redirected to the login page.
                </p>
                <Button variant="outline" className="mt-2 border-[#A67B5B]/30 text-[#6F4E37]" asChild>
                  <Link href="/login">Go to sign in</Link>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-[#6F4E37]">
                    New Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-[#A67B5B]/30 focus-visible:ring-[#6F4E37]"
                    disabled={isLoading}
                    required
                    minLength={6}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-[#6F4E37]">
                    Confirm New Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="border-[#A67B5B]/30 focus-visible:ring-[#6F4E37]"
                    disabled={isLoading}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#ECB176] hover:bg-[#A67B5B] text-[#6F4E37]"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating password...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  )
}
