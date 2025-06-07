"use client"

import Link from "next/link"
import { Zap, Code, Sparkles } from "lucide-react"

export function AnimatedLogo() {
  return (
    <Link href="/" className="flex items-center space-x-3 group">
      <div className="relative">
        {/* Main logo container */}
        <div className="relative w-12 h-12 bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 rounded-xl shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300 group-hover:scale-105">
          {/* Animated background glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 animate-pulse"></div>

          {/* Main icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Code className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300" />
          </div>

          {/* Floating sparkles */}
          <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-blue-300 opacity-0 group-hover:opacity-100 transition-all duration-300 animate-bounce" />
          <Zap className="absolute -bottom-1 -left-1 w-3 h-3 text-blue-400 opacity-0 group-hover:opacity-100 transition-all duration-300 animate-pulse delay-150" />
        </div>
      </div>

      {/* Logo text */}
      <div className="flex flex-col">
        <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent group-hover:from-blue-300 group-hover:to-blue-500 transition-all duration-300">
          AshStack
        </span>
        <span className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
          Premium Solutions
        </span>
      </div>
    </Link>
  )
}
