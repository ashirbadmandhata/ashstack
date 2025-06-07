"use client"

import { useState, useEffect } from "react"
import { AdminLogin } from "@/components/admin-login"
import { AdminDashboardEnhanced } from "@/components/admin-dashboard-enhanced"

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for admin session
    const adminSession = localStorage.getItem("admin_session")
    if (adminSession) {
      try {
        const session = JSON.parse(adminSession)
        // Check if session is valid (less than 24 hours old)
        const loginTime = new Date(session.loginTime)
        const now = new Date()
        const hoursDiff = (now.getTime() - loginTime.getTime()) / (1000 * 60 * 60)

        if (hoursDiff < 24 && session.role === "admin") {
          setIsAuthenticated(true)
        } else {
          localStorage.removeItem("admin_session")
        }
      } catch (error) {
        localStorage.removeItem("admin_session")
      }
    }
    setLoading(false)
  }, [])

  const handleLogin = (success: boolean) => {
    setIsAuthenticated(success)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />
  }

  return <AdminDashboardEnhanced />
}
