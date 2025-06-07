"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CustomProjectModal } from "@/components/custom-project-modal"
import { ArrowRight, Sparkles, Play, ShoppingBag, Zap, Users, Award } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"

export function HeroSection() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { user } = useAuth()

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Enhanced background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
        <div className="absolute top-1/4 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-blue-600/15 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 sm:w-64 h-48 sm:h-64 bg-blue-400/10 rounded-full blur-2xl animate-pulse-slow delay-500"></div>

        {/* Floating particles */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-blue-400 rounded-full animate-float"></div>
        <div className="absolute top-40 right-32 w-3 h-3 bg-blue-500 rounded-full animate-float delay-1000"></div>
        <div className="absolute bottom-32 left-1/3 w-2 h-2 bg-blue-300 rounded-full animate-float delay-2000"></div>
      </div>

      <div className="relative z-10 container-responsive text-center">
        <div className="mb-6 sm:mb-8">
          <div className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 glass-card rounded-full text-blue-400 text-xs sm:text-sm mb-6 sm:mb-8 hover:scale-105 transition-transform duration-300">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-2 animate-pulse" />
            Premium Digital Assets & Custom Solutions
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-6 sm:mb-8 leading-tight">
            Build Your
            <span className="block bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent glow-blue animate-pulse-slow">
              Digital Empire
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-gray-300 mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed px-4">
            Discover premium web apps, mobile solutions, AI/ML projects, and SaaS templates. Get custom-built digital
            assets tailored to your vision.
          </p>
        </div>

        {/* Enhanced CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-12 sm:mb-16 px-4">
          <Link href="/projects">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 sm:px-10 py-3 sm:py-4 text-base sm:text-lg font-semibold shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center">
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 mr-2 group-hover:rotate-12 transition-transform" />
                Browse Projects
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </Button>
          </Link>

          <Button
            size="lg"
            variant="outline"
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto glass border-2 border-blue-500/50 text-blue-400 hover:bg-blue-500/20 hover:border-blue-400 px-8 sm:px-10 py-3 sm:py-4 text-base sm:text-lg font-semibold hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 mr-2 group-hover:scale-110 transition-transform" />
              Get Custom Project
            </div>
          </Button>
        </div>

        {/* Secondary CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-12 sm:mb-16 px-4">
          {!user ? (
            <Link href="/auth">
              <Button
                variant="ghost"
                className="text-gray-300 hover:text-white hover:bg-white/10 px-4 sm:px-6 py-2 sm:py-3 transition-all duration-300 group"
              >
                <Users className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                Join Our Community
              </Button>
            </Link>
          ) : (
            <Link href="/dashboard">
              <Button
                variant="ghost"
                className="text-gray-300 hover:text-white hover:bg-white/10 px-4 sm:px-6 py-2 sm:py-3 transition-all duration-300 group"
              >
                <Users className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                My Dashboard
              </Button>
            </Link>
          )}

          <Button
            variant="ghost"
            onClick={() => {
              document.getElementById("featured-projects")?.scrollIntoView({
                behavior: "smooth",
              })
            }}
            className="text-gray-300 hover:text-white hover:bg-white/10 px-4 sm:px-6 py-2 sm:py-3 transition-all duration-300 group"
          >
            <Play className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
            Watch Demo
          </Button>
        </div>

        {/* Enhanced stats section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 px-4">
          {[
            {
              value: "500+",
              label: "Digital Assets",
              color: "from-blue-400 to-blue-600",
              icon: ShoppingBag,
              description: "Premium quality projects",
            },
            {
              value: "50k+",
              label: "Happy Customers",
              color: "from-blue-500 to-blue-700",
              icon: Users,
              description: "Worldwide community",
            },
            {
              value: "99%",
              label: "Satisfaction Rate",
              color: "from-blue-400 to-blue-600",
              icon: Award,
              description: "Customer approved",
            },
            {
              value: "24/7",
              label: "Support",
              color: "from-blue-500 to-blue-700",
              icon: Zap,
              description: "Always available",
            },
          ].map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <div
                key={index}
                className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:scale-105 transition-all duration-300 group cursor-pointer"
                style={{
                  animationDelay: `${index * 200}ms`,
                }}
              >
                <div className="flex flex-col items-center text-center">
                  <div
                    className={`p-2 sm:p-3 rounded-full bg-gradient-to-r ${stat.color} mb-2 sm:mb-3 group-hover:scale-110 transition-transform`}
                  >
                    <IconComponent className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div
                    className={`text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-1 sm:mb-2 group-hover:scale-110 transition-transform`}
                  >
                    {stat.value}
                  </div>
                  <div className="text-gray-400 text-xs sm:text-sm md:text-base font-medium mb-1">{stat.label}</div>
                  <div className="text-gray-500 text-xs hidden sm:block">{stat.description}</div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Trust indicators */}
        <div className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-gray-800">
          <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4">Trusted by developers worldwide</p>
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-8 opacity-60">
            {["React", "Next.js", "TypeScript", "Node.js", "Python"].map((tech, index) => (
              <div
                key={index}
                className="text-gray-500 font-medium hover:text-gray-300 transition-colors cursor-pointer text-xs sm:text-sm"
              >
                {tech}
              </div>
            ))}
          </div>
        </div>
      </div>

      <CustomProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  )
}
