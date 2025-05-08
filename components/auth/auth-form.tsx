"use client"

import type React from "react"

import { useState } from "react"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { GoogleAuthButton } from "@/components/auth/google-auth-button"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"

interface AuthFormProps {
  isSignUp?: boolean
}

export function AuthForm({ isSignUp = false }: AuthFormProps) {
  const { signIn, signUp } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (isSignUp) {
        const { error } = await signUp(formData.email, formData.password, formData.name)
        if (error) {
          toast({
            title: "Sign up failed",
            description: error.message,
            variant: "destructive",
          })
        } else {
          // Redirect to email confirmation page instead of showing toast
          window.location.href = `/email-confirmation?email=${encodeURIComponent(formData.email)}`
          return // Early return to prevent further execution
        }
      } else {
        const { error } = await signIn(formData.email, formData.password)
        if (error) {
          toast({
            title: "Sign in failed",
            description: error.message,
            variant: "destructive",
          })
        } else {
          toast({
            title: "Welcome back",
            description: "You've successfully signed in.",
          })
        }
      }
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {isSignUp && (
          <div className="space-y-2">
            <Label htmlFor="name" className="text-[#6F4E37]">
              Full Name
            </Label>
            <Input
              id="name"
              name="name"
              placeholder="John Doe"
              required
              value={formData.name}
              onChange={handleChange}
              className="border-[#A67B5B]/30 focus-visible:ring-[#6F4E37]"
              disabled={isLoading}
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email" className="text-[#6F4E37]">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="name@example.com"
            required
            value={formData.email}
            onChange={handleChange}
            className="border-[#A67B5B]/30 focus-visible:ring-[#6F4E37]"
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-[#6F4E37]">
              Password
            </Label>
            {!isSignUp && (
              <Button variant="link" className="h-auto p-0 text-xs text-[#A67B5B]" disabled={isLoading} asChild>
                <a href="/forgot-password">Forgot password?</a>
              </Button>
            )}
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder={isSignUp ? "Create a password" : "Enter your password"}
            required
            value={formData.password}
            onChange={handleChange}
            className="border-[#A67B5B]/30 focus-visible:ring-[#6F4E37]"
            disabled={isLoading}
          />
        </div>

        <Button type="submit" className="w-full bg-[#ECB176] hover:bg-[#A67B5B] text-[#6F4E37]" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isSignUp ? "Creating account..." : "Signing in..."}
            </>
          ) : (
            <>{isSignUp ? "Create account" : "Sign in"}</>
          )}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>

      <GoogleAuthButton isSignUp={isSignUp} />
    </div>
  )
}
