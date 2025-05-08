"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from '@/lib/supabase/client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import type { Database } from "@/lib/database.types"

type UserProfile = Database["public"]["Tables"]["profiles"]["Row"]

interface ProfileFormProps {
  userId: string
  initialProfile: UserProfile | null
}

export function ProfileForm({ userId, initialProfile }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [fullName, setFullName] = useState(initialProfile?.full_name || "")
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await supabase.from("profiles").upsert({
        id: userId,
        full_name: fullName,
        updated_at: new Date().toISOString(),
      })

      if (error) throw error

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })

      router.refresh()
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: "There was an error updating your profile.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="space-y-2">
        <Label htmlFor="full-name">Full Name</Label>
        <Input id="full-name" placeholder="Your name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" disabled value={initialProfile?.email || ""} />
        <p className="text-sm text-muted-foreground">Your email cannot be changed.</p>
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Updating..." : "Update profile"}
      </Button>
    </form>
  )
}
