"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Settings, LayoutDashboard, LogOut, Shield } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase"

interface UserProfile {
  id: string
  full_name?: string
  avatar_url?: string
  email: string
}

export function UserDropdown() {
  const { user, signOut, isAdmin } = useAuth()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchProfile()
    }
  }, [user])

  const fetchProfile = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase.from("user_profiles").select("*").eq("id", user.id).single()

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching profile:", error)
      } else if (data) {
        setProfile(data)
      } else {
        setProfile({
          id: user.id,
          email: user.email || "",
          full_name: user.user_metadata?.full_name || user.email?.split("@")[0] || "User",
          avatar_url: user.user_metadata?.avatar_url,
        })
      }
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  const handleSignOut = async () => {
    try {
      await signOut()
      setIsOpen(false)
      router.push("/")
      setTimeout(() => {
        window.location.reload()
      }, 100)
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }

  const getInitials = (name: string) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getDisplayName = () => {
    return profile?.full_name || user.user_metadata?.full_name || user.email?.split("@")[0] || "User"
  }

  const getAvatarUrl = () => {
    if (profile?.avatar_url) {
      if (profile.avatar_url.startsWith("http")) {
        return profile.avatar_url
      }
      return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${profile.avatar_url}`
    }
    return user.user_metadata?.avatar_url || null
  }

  const handleMenuItemClick = (path: string) => {
    setIsOpen(false)
    setTimeout(() => {
      router.push(path)
    }, 100)
  }

  if (loading) {
    return <div className="h-10 w-10 rounded-full bg-gray-700 animate-pulse" />
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full hover:ring-2 hover:ring-blue-500/50 transition-all focus:ring-2 focus:ring-blue-500/50 focus:outline-none"
        >
          <Avatar className="h-10 w-10 border-2 border-blue-500/50 hover:border-blue-400 transition-colors">
            <AvatarImage src={getAvatarUrl() || undefined} alt={getDisplayName()} className="object-cover" />
            <AvatarFallback className="bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold text-sm">
              {getInitials(getDisplayName())}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-64 bg-gray-900/95 backdrop-blur-xl border-gray-700 z-50"
        align="end"
        sideOffset={8}
      >
        <DropdownMenuLabel className="font-normal p-4">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none text-white">{getDisplayName()}</p>
            <p className="text-xs leading-none text-gray-400">{user.email}</p>
            {isAdmin && (
              <div className="flex items-center space-x-1 mt-2">
                <Shield className="w-3 h-3 text-blue-400" />
                <span className="text-xs text-blue-400 font-medium">Administrator</span>
              </div>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-700" />

        <DropdownMenuItem
          className="text-gray-300 hover:text-white hover:bg-blue-500/20 cursor-pointer focus:bg-blue-500/20 focus:text-white p-3"
          onClick={() => handleMenuItemClick("/dashboard")}
        >
          <LayoutDashboard className="mr-3 h-4 w-4" />
          <span>User Dashboard</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          className="text-gray-300 hover:text-white hover:bg-blue-500/20 cursor-pointer focus:bg-blue-500/20 focus:text-white p-3"
          onClick={() => handleMenuItemClick("/profile")}
        >
          <User className="mr-3 h-4 w-4" />
          <span>Profile Management</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          className="text-gray-300 hover:text-white hover:bg-blue-500/20 cursor-pointer focus:bg-blue-500/20 focus:text-white p-3"
          onClick={() => handleMenuItemClick("/settings")}
        >
          <Settings className="mr-3 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>

        {isAdmin && (
          <>
            <DropdownMenuSeparator className="bg-gray-700" />
            <DropdownMenuItem
              className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 cursor-pointer focus:bg-blue-500/20 focus:text-blue-300 p-3"
              onClick={() => handleMenuItemClick("/admin")}
            >
              <Shield className="mr-3 h-4 w-4" />
              <span>Admin Dashboard</span>
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuSeparator className="bg-gray-700" />
        <DropdownMenuItem
          className="text-red-400 hover:text-red-300 hover:bg-red-500/20 cursor-pointer focus:bg-red-500/20 focus:text-red-300 p-3"
          onClick={handleSignOut}
        >
          <LogOut className="mr-3 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
