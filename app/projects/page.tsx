"use client"
import { TrendingProjects } from "@/components/trending-projects"

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-gray-950 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            All{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Projects</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Browse our complete collection of premium digital assets and solutions
          </p>
        </div>
        <TrendingProjects />
      </div>
    </main>
  )
}
