"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"

import { AuthForm } from "@/components/auth/auth-form"

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center px-4 md:px-6">
          <Link href="/" className="flex items-center text-sm font-medium text-[#6F4E37]">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
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
                src="/modern-tech-store.png"
                alt="Product Showcase"
                className="relative w-full h-full object-contain"
              />
            </div>
            <h2 className="text-2xl font-bold text-[#6F4E37] mb-4">Start Your Journey</h2>
            <p className="text-[#A67B5B]">
              Join thousands of sellers who are growing their business with our platform.
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
              <h1 className="text-2xl font-bold tracking-tight text-[#6F4E37]">Create an account</h1>
              <p className="text-sm text-[#A67B5B] mt-1">Sign up to start showcasing your products</p>
            </div>

            <AuthForm isSignUp />

            <div className="mt-6 text-center text-sm">
              <p className="text-[#A67B5B]">
                Already have an account?{" "}
                <Link href="/login" className="font-medium text-[#6F4E37] hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
