"use client"

import { useEffect, useRef } from "react"

const partners = [
  { name: "TechCorp", logo: "TC" },
  { name: "InnovateLab", logo: "IL" },
  { name: "DataFlow", logo: "DF" },
  { name: "CloudSync", logo: "CS" },
  { name: "AI Solutions", logo: "AS" },
  { name: "WebForge", logo: "WF" },
  { name: "MobileFirst", logo: "MF" },
  { name: "DevStudio", logo: "DS" },
  { name: "CodeCraft", logo: "CC" },
  { name: "PixelPerfect", logo: "PP" },
  { name: "NextGen", logo: "NG" },
  { name: "TechFlow", logo: "TF" },
]

export function PartnerCompanies() {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    const animate = () => {
      if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
        scrollContainer.scrollLeft = 0
      } else {
        scrollContainer.scrollLeft += 0.5
      }
    }

    const interval = setInterval(animate, 20)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-16 bg-gray-900/50 backdrop-blur-sm overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Trusted by{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Industry Leaders
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Join thousands of companies that trust us with their digital transformation
          </p>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-8 overflow-hidden whitespace-nowrap"
          style={{ scrollBehavior: "auto" }}
        >
          {[...partners, ...partners, ...partners].map((partner, index) => (
            <div
              key={index}
              className="flex-shrink-0 glass-card rounded-xl p-6 min-w-[200px] hover:scale-105 transition-all duration-300 group"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform">
                  {partner.logo}
                </div>
                <span className="text-white font-semibold whitespace-normal">{partner.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
