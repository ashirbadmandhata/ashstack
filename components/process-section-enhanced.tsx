"use client"

import { useState, useEffect } from "react"
import { Lightbulb, Palette, Code, TestTube, Package, ArrowRight } from "lucide-react"

const steps = [
  {
    icon: Lightbulb,
    title: "Ideation",
    description: "We analyze your requirements and brainstorm innovative solutions tailored to your vision",
    color: "from-yellow-400 to-orange-500",
    delay: 0,
  },
  {
    icon: Palette,
    title: "Design",
    description: "Create stunning UI/UX designs that captivate users and enhance user experience",
    color: "from-pink-400 to-purple-500",
    delay: 200,
  },
  {
    icon: Code,
    title: "Development",
    description: "Build robust, scalable solutions using cutting-edge technologies and best practices",
    color: "from-blue-400 to-cyan-500",
    delay: 400,
  },
  {
    icon: TestTube,
    title: "Testing",
    description: "Rigorous testing ensures quality, performance, security, and reliability",
    color: "from-green-400 to-emerald-500",
    delay: 600,
  },
  {
    icon: Package,
    title: "Delivery",
    description: "Deploy and deliver your project with comprehensive documentation and ongoing support",
    color: "from-indigo-400 to-purple-500",
    delay: 800,
  },
]

export function ProcessSectionEnhanced() {
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-20 bg-gray-900/30 backdrop-blur-sm relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            How We Build &{" "}
            <span className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 bg-clip-text text-transparent glow-blue">
              Deliver Excellence
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Our proven methodology ensures exceptional results through every phase of development
          </p>
        </div>

        {/* SVG Animation Container */}
        <div className="mb-16 flex justify-center">
          <div className="relative w-full max-w-4xl">
            <svg viewBox="0 0 800 200" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
              {/* Connection Path */}
              <path
                d="M50 100 Q200 50 350 100 T650 100 L750 100"
                stroke="url(#gradient)"
                strokeWidth="3"
                fill="none"
                className="animate-pulse"
              />

              {/* Gradient Definition */}
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#fbbf24" />
                  <stop offset="25%" stopColor="#ec4899" />
                  <stop offset="50%" stopColor="#3b82f6" />
                  <stop offset="75%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>

              {/* Step Circles */}
              {steps.map((step, index) => {
                const x = 50 + index * 175
                const isActive = activeStep === index
                return (
                  <g key={index}>
                    <circle
                      cx={x}
                      cy="100"
                      r={isActive ? "25" : "20"}
                      fill={`url(#gradient-${index})`}
                      className={`transition-all duration-500 ${isActive ? "animate-pulse" : ""}`}
                    />
                    <defs>
                      <radialGradient id={`gradient-${index}`}>
                        <stop offset="0%" stopColor={step.color.split(" ")[1]} />
                        <stop offset="100%" stopColor={step.color.split(" ")[3]} />
                      </radialGradient>
                    </defs>

                    {/* Step Number */}
                    <text x={x} y="107" textAnchor="middle" className="fill-white font-bold text-sm">
                      {index + 1}
                    </text>
                  </g>
                )
              })}

              {/* Moving Dot */}
              <circle cx="50" cy="100" r="8" fill="#ffffff" className="animate-pulse">
                <animateMotion
                  dur="15s"
                  repeatCount="indefinite"
                  path="M50 100 Q200 50 350 100 T650 100 L750 100 L50 100"
                />
              </circle>
            </svg>
          </div>
        </div>

        {/* Process Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isActive = activeStep === index
            return (
              <div
                key={index}
                className={`group relative transition-all duration-700 ${isActive ? "scale-105" : "hover:scale-105"}`}
                style={{ animationDelay: `${step.delay}ms` }}
              >
                <div
                  className={`glass-card rounded-2xl p-6 h-full transition-all duration-500 ${
                    isActive ? "border-blue-500/50 shadow-lg shadow-blue-500/20" : "hover:border-gray-600"
                  }`}
                >
                  {/* Step Number Badge */}
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm z-10">
                    {index + 1}
                  </div>

                  <div
                    className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${step.color} mb-6 transition-transform duration-300 ${
                      isActive ? "scale-110" : "group-hover:scale-110"
                    }`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  <h3
                    className={`text-xl font-bold mb-4 transition-colors duration-300 ${
                      isActive ? "text-blue-400 glow-blue" : "text-white group-hover:text-blue-400"
                    }`}
                  >
                    {step.title}
                  </h3>

                  <p className="text-gray-300 text-sm leading-relaxed">{step.description}</p>

                  {/* Arrow for larger screens */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute -right-3 top-1/2 transform -translate-y-1/2 text-gray-600">
                      <ArrowRight className="w-6 h-6" />
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="glass-card rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">Ready to Start Your Project?</h3>
            <p className="text-gray-300 mb-6">
              Let's transform your ideas into reality with our proven development process
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25">
                Start Your Project
              </button>
              <button className="px-8 py-3 border border-gray-600 text-gray-300 hover:text-white hover:border-blue-500 hover:bg-blue-500/10 font-semibold rounded-lg transition-all duration-300">
                View Portfolio
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
