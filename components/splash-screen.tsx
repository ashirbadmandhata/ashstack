"use client"

import { useState, useEffect } from "react"

export function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) return null

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-gray-950 transition-opacity duration-700 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Background Gradient Bubbles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/15 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 text-center px-4">
        {/* AshStack Logo Placeholder */}
        <div className="flex items-center justify-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-700 rounded-xl shadow-lg flex items-center justify-center animate-spin-slow">
            <span className="text-white font-black text-3xl tracking-wide">AS</span>
          </div>
        </div>

        <h1 className="text-4xl font-extrabold text-white mb-2 tracking-wide">
          AshStack
        </h1>

        <p className="text-lg text-gray-300 mb-4">Crafting Digital Excellence</p>

        <div className="flex justify-center">
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 via-cyan-500 to-purple-600 rounded-full animate-pulse"></div>
        </div>

        <p className="mt-6 text-sm text-gray-400 font-medium tracking-wide">
          Developed by Ashirbad Mandhata
        </p>
      </div>
    </div>
  )
}
