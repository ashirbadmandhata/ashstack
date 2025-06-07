"use client"

import { HeroSection } from "@/components/hero-section"
import { WhatWeOffer } from "@/components/what-we-offer"
import { TrendingProjects } from "@/components/trending-projects"
import { ProcessSectionEnhanced } from "@/components/process-section-enhanced"
import { InfiniteScroll } from "@/components/infinite-scroll"
import { PartnerCompanies } from "@/components/partner-companies"
import { Footer } from "@/components/footer"

export function EnhancedHomepage() {
  return (
    <main className="min-h-screen bg-gray-950 transition-opacity duration-500 opacity-100">
      <HeroSection />
      <div className="transition-all duration-800 ease-out transform translate-y-0 opacity-100">
        <WhatWeOffer />
      </div>
      <div className="transition-all duration-800 ease-out transform translate-y-0 opacity-100">
        <TrendingProjects />
      </div>
      <div className="transition-all duration-800 ease-out transform translate-y-0 opacity-100">
        <ProcessSectionEnhanced />
      </div>
      <div className="transition-all duration-800 ease-out transform translate-y-0 opacity-100">
        <PartnerCompanies />
      </div>
      <div className="transition-all duration-800 ease-out transform translate-y-0 opacity-100">
        <InfiniteScroll />
      </div>
      <Footer />
    </main>
  )
}
