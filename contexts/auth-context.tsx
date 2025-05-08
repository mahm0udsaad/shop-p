"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { Session, User, AuthChangeEvent } from "@supabase/supabase-js"
import { createClient, getClientUserProfile } from "@/lib/supabase/client"
import type { Database } from "@/lib/database.types"

type UserProfile = Database["public"]["Tables"]["profiles"]["Row"]

type AuthContextType = {
  user: User | null
  profile: UserProfile | null
  session: Session | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any | null }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any | null; user: User | null }>
  signOut: () => Promise<void>
  signInWithGoogle: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: any | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({
  children,
  initialSession,
}: {
  children: React.ReactNode
  initialSession?: Session | null
}) {
  const supabase = createClient()
  const [user, setUser] = useState<User | null>(initialSession?.user || null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [session, setSession] = useState<Session | null>(initialSession || null)
  const [isLoading, setIsLoading] = useState(!initialSession)
  const router = useRouter()

  useEffect(() => {
    // If we have an initial session, fetch the profile
    if (initialSession?.user) {
      getClientUserProfile(initialSession.user.id).then(setProfile)
      setIsLoading(false)
      return
    }

    // Otherwise, get the session from the client
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)

      if (session?.user) {
        getClientUserProfile(session.user.id).then(setProfile)
      }

      setIsLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      setUser(session?.user ?? null)

      if (session?.user) {
        const profile = await getClientUserProfile(session.user.id)
        setProfile(profile)
      } else {
        setProfile(null)
      }

      setIsLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [initialSession])

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (!error && data.user) {
      router.push("/dashboard")
    }

    return { error }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (!error && data.user) {
      // Create a profile record
      await supabase.from("profiles").insert({
        id: data.user.id,
        email: email,
        full_name: fullName,
        created_at: new Date().toISOString(),
      })

      // We don't redirect here anymore, we'll do it in the AuthForm component
    }

    return { error, user: data.user }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    })
  }

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    return { error }
  }

  const value = {
    user,
    profile,
    session,
    isLoading,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    resetPassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
