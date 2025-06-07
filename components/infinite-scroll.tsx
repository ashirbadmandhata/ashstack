"use client"

import { useEffect, useRef } from "react"

const testimonials = [
  { name: "Sarah Johnson", role: "CEO, TechStart", text: "Incredible quality and fast delivery!" },
  { name: "Mike Chen", role: "Developer", text: "Best digital assets marketplace I've used." },
  { name: "Emily Davis", role: "Designer", text: "Amazing UI kits that saved me weeks of work." },
  { name: "Alex Rodriguez", role: "Founder", text: "Professional service and excellent support." },
  { name: "Lisa Wang", role: "Product Manager", text: "High-quality code and great documentation." },
  { name: "David Brown", role: "CTO", text: "Reliable solutions that scale with our business." },
]

const offers = [
  "🚀 New: AI-Powered Analytics Dashboard",
  "💰 50% OFF: Premium SaaS Templates",
  "🎨 Fresh: Modern UI Component Library",
  "⚡ Limited: Custom Development Slots",
  "🔥 Trending: E-commerce Solutions",
  "✨ Featured: Mobile App Templates",
]

export function InfiniteScroll() {
  const scrollRef1 = useRef<HTMLDivElement>(null)
  const scrollRef2 = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scroll1 = scrollRef1.current
    const scroll2 = scrollRef2.current

    if (!scroll1 || !scroll2) return

    const animate = () => {
      if (scroll1.scrollLeft >= scroll1.scrollWidth / 2) {
        scroll1.scrollLeft = 0
      } else {
        scroll1.scrollLeft += 1
      }

      if (scroll2.scrollLeft <= -scroll2.scrollWidth / 2) {
        scroll2.scrollLeft = 0
      } else {
        scroll2.scrollLeft -= 1
      }
    }

    const interval = setInterval(animate, 50)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-20 bg-gray-800/30 overflow-hidden">
      <div className="mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-6">
          What Our{" "}
          <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            Clients Say
          </span>
        </h2>

        <div ref={scrollRef1} className="flex gap-6 overflow-hidden whitespace-nowrap">
          {[...testimonials, ...testimonials].map((testimonial, index) => (
            <div
              key={index}
              className="flex-shrink-0 bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-xl p-6 w-80"
            >
              <p className="text-gray-300 mb-4 whitespace-normal">"{testimonial.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <div className="text-white font-semibold">{testimonial.name}</div>
                  <div className="text-gray-400 text-sm">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-2xl font-bold text-white text-center mb-8">
          Latest{" "}
          <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Offers & Updates
          </span>
        </h3>

        <div ref={scrollRef2} className="flex gap-6 overflow-hidden whitespace-nowrap">
          {[...offers, ...offers].map((offer, index) => (
            <div
              key={index}
              className="flex-shrink-0 bg-gradient-to-r from-blue-500/20 to-purple-600/20 backdrop-blur-sm border border-blue-500/30 rounded-xl p-4 min-w-[300px]"
            >
              <p className="text-white font-semibold text-center whitespace-normal">{offer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
