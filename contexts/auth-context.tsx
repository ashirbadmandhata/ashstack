"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Admin emails - you can modify this list
const ADMIN_EMAILS = ["admin@ashstack.com", "admin@digitalassets.com", "ashstack.admin@gmail.com"]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Add this function inside AuthProvider component
  const checkAdminSession = () => {
    if (typeof window !== "undefined") {
      const adminSession = localStorage.getItem("admin_session")
      if (adminSession) {
        try {
          const session = JSON.parse(adminSession)
          const loginTime = new Date(session.loginTime)
          const now = new Date()
          const hoursDiff = (now.getTime() - loginTime.getTime()) / (1000 * 60 * 60)

          return hoursDiff < 24 && session.role === "admin"
        } catch (error) {
          localStorage.removeItem("admin_session")
          return false
        }
      }
    }
    return false
  }

  // Update the isAdmin calculation
  const isAdmin = user
    ? ADMIN_EMAILS.includes(user.email || "") ||
      user.user_metadata?.role === "admin" ||
      user.app_metadata?.role === "admin"
    : checkAdminSession()

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)

      // Create user profile if it doesn't exist
      if (event === "SIGNED_IN" && session?.user) {
        await createUserProfile(session.user)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const createUserProfile = async (user: User) => {
    try {
      // Check if profile already exists
      const { data: existingProfile } = await supabase.from("user_profiles").select("id").eq("id", user.id).single()

      if (!existingProfile) {
        // Create new profile
        const { error } = await supabase.from("user_profiles").insert({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || user.email?.split("@")[0] || "User",
          avatar_url: user.user_metadata?.avatar_url,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })

        if (error) {
          console.error("Error creating user profile:", error)
        }
      }
    } catch (error) {
      console.error("Error in createUserProfile:", error)
    }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })
    return { error }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
