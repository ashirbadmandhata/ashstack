"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, LogOut, Home, FolderOpen, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { AnimatedLogo } from "@/components/animated-logo"
import { UserDropdown } from "@/components/user-dropdown"
import { AdminLoginButton } from "@/components/admin-login-button"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

export function Navigation() {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAdminSession = () => {
      if (typeof window !== "undefined") {
        const adminSession = localStorage.getItem("admin_session")
        setIsAdminLoggedIn(!!adminSession)
      }
    }

    checkAdminSession()
    const interval = setInterval(checkAdminSession, 1000)

    return () => clearInterval(interval)
  }, [])

  const handleAdminLogout = () => {
    localStorage.removeItem("admin_session")
    setIsAdminLoggedIn(false)
    router.push("/")
    setTimeout(() => {
      window.location.reload()
    }, 100)
  }

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/projects", label: "Projects", icon: FolderOpen },
    { href: "/pricing", label: "Pricing", icon: CreditCard },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-xl border-b border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <AnimatedLogo />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-300 hover:text-blue-400 transition-all duration-300 relative group px-3 py-2 rounded-lg hover:bg-blue-500/10"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-blue-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}

            <div className="flex items-center space-x-3">
              {/* Admin Login/Logout Button */}
              {isAdminLoggedIn ? (
                <Button
                  onClick={handleAdminLogout}
                  variant="outline"
                  size="sm"
                  className="border-red-500/50 text-red-400 hover:bg-red-500/20 hover:border-red-400 transition-all duration-300 bg-gray-900/50"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Admin Logout
                </Button>
              ) : (
                <AdminLoginButton />
              )}

              {user ? (
                <UserDropdown />
              ) : (
                <Link href="/auth">
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
                  >
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center space-x-3">
            {user && <UserDropdown />}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="text-white hover:bg-blue-500/20 p-2">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-gray-900/95 backdrop-blur-xl border-gray-800 w-80 sm:w-96">
                <div className="flex flex-col h-full">
                  {/* Header */}
                  <div className="flex items-center justify-between py-6 border-b border-gray-800">
                    <h2 className="text-white font-bold text-xl">Menu</h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsOpen(false)}
                      className="text-gray-400 hover:text-white hover:bg-gray-800 p-2"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>

                  {/* Navigation Items */}
                  <div className="flex-1 py-6">
                    <div className="space-y-2">
                      {navItems.map((item) => {
                        const IconComponent = item.icon
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center space-x-3 text-gray-300 hover:text-white hover:bg-blue-500/20 transition-all duration-300 py-4 px-4 rounded-lg group"
                            onClick={() => setIsOpen(false)}
                          >
                            <IconComponent className="w-5 h-5 text-blue-400 group-hover:text-blue-300" />
                            <span className="font-medium">{item.label}</span>
                          </Link>
                        )
                      })}
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3 pt-6 mt-6 border-t border-gray-800">
                      {/* Admin Button */}
                      {isAdminLoggedIn ? (
                        <Button
                          onClick={() => {
                            handleAdminLogout()
                            setIsOpen(false)
                          }}
                          variant="outline"
                          className="w-full border-red-500/50 text-red-400 hover:bg-red-500/20 bg-gray-900/50 py-3"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Admin Logout
                        </Button>
                      ) : (
                        <div className="w-full">
                          <AdminLoginButton />
                        </div>
                      )}

                      {!user && (
                        <Link href="/auth" onClick={() => setIsOpen(false)}>
                          <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 py-3">
                            Sign In
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="py-4 border-t border-gray-800">
                    <p className="text-xs text-gray-500 text-center">© 2024 AshStack. All rights reserved.</p>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}
