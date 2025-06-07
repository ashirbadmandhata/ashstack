import { Code, Smartphone, Brain, Cloud, Palette, Zap } from "lucide-react"

const offerings = [
  {
    icon: Code,
    title: "Web Applications",
    description: "Full-stack web apps built with modern frameworks like React, Next.js, and Vue.js",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Smartphone,
    title: "Mobile Apps",
    description: "Native and cross-platform mobile applications for iOS and Android",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Brain,
    title: "AI/ML Projects",
    description: "Machine learning models, AI tools, and intelligent automation solutions",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Cloud,
    title: "SaaS Templates",
    description: "Ready-to-deploy SaaS platforms with authentication, payments, and dashboards",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: Palette,
    title: "UI Templates",
    description: "Beautiful, responsive UI kits and design systems for rapid development",
    color: "from-indigo-500 to-purple-500",
  },
  {
    icon: Zap,
    title: "APIs & Tools",
    description: "RESTful APIs, microservices, and developer tools to accelerate your projects",
    color: "from-yellow-500 to-orange-500",
  },
]

export function WhatWeOffer() {
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
            What We{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent glow-blue">
              Offer
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Comprehensive digital solutions to power your business growth and innovation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {offerings.map((offering, index) => {
            const Icon = offering.icon
            return (
              <div
                key={index}
                className="group relative glass-card rounded-2xl p-8 hover:border-gray-600/50 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>

                <div
                  className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${offering.color} mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors duration-300">
                  {offering.title}
                </h3>

                <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                  {offering.description}
                </p>

                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"></div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
