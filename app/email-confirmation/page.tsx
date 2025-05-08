"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ArrowLeft, CheckCircle, Mail } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function EmailConfirmationPage() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || "your email"

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

      <main className="flex-1 flex items-center justify-center p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="border-[#A67B5B]/30">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#ECB176]/20">
                <Mail className="h-8 w-8 text-[#6F4E37]" />
              </div>
              <CardTitle className="text-2xl font-bold text-[#6F4E37]">Check your email</CardTitle>
              <CardDescription className="text-[#A67B5B]">
                We've sent a verification link to <span className="font-medium">{email}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center pb-4">
              <div className="space-y-4">
                <p className="text-sm text-[#A67B5B]">
                  Please check your email and click on the verification link to complete your registration.
                </p>
                <div className="flex items-center justify-center space-x-2 text-sm text-[#6F4E37]">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Email sent successfully</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-3">
              <Button
                className="w-full bg-[#ECB176] hover:bg-[#A67B5B] text-[#6F4E37]"
                onClick={() => (window.location.href = "/login")}
              >
                Go to login
              </Button>
              <div className="text-center text-xs text-[#A67B5B]">
                <p>
                  Didn't receive an email?{" "}
                  <Link href="/login" className="text-[#6F4E37] hover:underline">
                    Try again
                  </Link>
                </p>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}
