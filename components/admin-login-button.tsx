"use client"

import type React from "react"
import { useState } from "react"
import { Shield, Eye, EyeOff, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export function AdminLoginButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("admin@ashstack.com")
  const [password, setPassword] = useState("admin123")
  const { toast } = useToast()
  const router = useRouter()

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Match with demo credentials
      if (email === "admin@ashstack.com" && password === "admin123") {
        const adminSession = {
          email,
          role: "admin",
          loginTime: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 1 day
        }

        localStorage.setItem("admin_session", JSON.stringify(adminSession))

        toast({
          title: "Admin Login Successful",
          description: "Welcome back, Administrator!",
        })

        setIsOpen(false)

        // Push to /admin
        setTimeout(() => {
          router.push("/admin")
        }, 300)
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid admin credentials",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Login failed. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="border-blue-500/50 text-blue-400 hover:bg-blue-500/20 hover:border-blue-400 transition-all duration-300 bg-gray-900/50 backdrop-blur-sm"
        >
          <Shield className="w-4 h-4 mr-2" />
          Admin
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-900/95 backdrop-blur-xl border-gray-700 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-blue-400" />
            Admin Login
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleAdminLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-email" className="text-gray-300">Email</Label>
            <Input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
              placeholder="admin@ashstack.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-password" className="text-gray-300">Password</Label>
            <div className="relative">
              <Input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 pr-10 focus:border-blue-500"
                placeholder="Enter admin password"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
              </Button>
            </div>
          </div>
          <div className="bg-blue-500/10 p-3 rounded-lg border border-blue-500/20">
            <p className="text-xs text-blue-400 mb-1">Demo Credentials:</p>
            <p className="text-xs text-blue-300">Email: admin@ashstack.com</p>
            <p className="text-xs text-blue-300">Password: admin123</p>
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
          >
            {isLoading ? "Logging in..." : "Login as Admin"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
