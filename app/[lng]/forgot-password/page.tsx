"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Loader2 } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [email, setEmail] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await resetPassword(email)
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        })
      } else {
        setIsSubmitted(true)
        toast({
          title: "Email sent",
          description: "Check your inbox for the password reset link",
        })
      }
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again later",
        variant: "destructive",
      })
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
            <h2 className="text-2xl font-bold text-[#6F4E37] mb-4">Account Recovery</h2>
            <p className="text-[#A67B5B]">
              We'll help you reset your password and get back to showcasing your products.
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
              <p className="text-sm text-[#A67B5B] mt-1">
                Enter your email address and we'll send you a link to reset your password
              </p>
            </div>

            {isSubmitted ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <h3 className="text-lg font-medium text-green-800 mb-2">Check your email</h3>
                <p className="text-green-700 mb-4">
                  We've sent a password reset link to <span className="font-medium">{email}</span>
                </p>
                <Button variant="outline" className="mt-2 border-[#A67B5B]/30 text-[#6F4E37]" asChild>
                  <Link href="/login">Return to sign in</Link>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[#6F4E37]">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-[#A67B5B]/30 focus-visible:ring-[#6F4E37]"
                    disabled={isLoading}
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
                      Sending reset link...
                    </>
                  ) : (
                    "Send reset link"
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
