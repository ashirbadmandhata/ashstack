"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Star,
  Download,
  Github,
  Eye,
  Heart,
  Share2,
  ShoppingCart,
  Code,
  Smartphone,
  Monitor,
} from "lucide-react"
import { supabase } from "@/lib/supabase"
import { PurchaseFlow } from "@/components/purchase-flow"

// Fallback project data
const fallbackProjectData: { [key: string]: any } = {
  "1": {
    id: "1",
    title: "E-commerce Dashboard",
    price: 24999,
    description: "Complete admin dashboard with analytics, inventory management, and order tracking",
    long_description:
      "This comprehensive e-commerce dashboard provides everything you need to manage your online store effectively. Features include real-time analytics, inventory management, order tracking, customer management, and detailed reporting. Built with React, Next.js, and Tailwind CSS for optimal performance and user experience.",
    category: "Web Application",
    tech_stack: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Chart.js", "Framer Motion"],
    tags: ["React", "Next.js", "Tailwind", "TypeScript", "Dashboard"],
    features: [
      "Real-time analytics dashboard",
      "Inventory management system",
      "Order tracking and management",
      "Customer relationship management",
      "Responsive design for all devices",
      "Dark/Light theme support",
      "Export data functionality",
      "Role-based access control",
    ],
    demo_url: "https://demo.example.com",
    github_url: "https://github.com/example/repo",
    license: "Extended License",
    difficulty: "Intermediate",
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    rating: 4.9,
    downloads: 1234,
    version: "2.1.0",
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  "2": {
    id: "2",
    title: "AI Chat Assistant",
    price: 16599,
    description: "Intelligent chatbot with natural language processing and custom training",
    long_description:
      "Advanced AI-powered chat assistant built with modern NLP technologies. Features include custom training capabilities, multi-language support, and seamless integration with existing systems.",
    category: "AI/ML Project",
    tech_stack: ["Python", "OpenAI", "FastAPI", "React"],
    tags: ["Python", "OpenAI", "FastAPI", "AI", "Chatbot"],
    features: [
      "Natural language processing",
      "Custom training capabilities",
      "Multi-language support",
      "API integration",
      "Real-time responses",
      "Analytics dashboard",
    ],
    demo_url: "https://demo-ai.example.com",
    github_url: "https://github.com/example/ai-chat",
    license: "Standard License",
    difficulty: "Advanced",
    images: ["/placeholder.svg?height=400&width=600"],
    rating: 4.8,
    downloads: 856,
    version: "1.5.0",
    featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  "3": {
    id: "3",
    title: "Mobile Banking App",
    price: 33249,
    description: "Secure mobile banking solution with biometric authentication",
    long_description:
      "Complete mobile banking application with advanced security features, biometric authentication, and seamless payment integration. Built for both iOS and Android platforms.",
    category: "Mobile Application",
    tech_stack: ["React Native", "Node.js", "MongoDB", "Stripe"],
    tags: ["React Native", "Node.js", "MongoDB", "Banking", "Mobile"],
    features: [
      "Biometric authentication",
      "Secure transactions",
      "Real-time notifications",
      "Account management",
      "Payment integration",
      "Transaction history",
      "Budget tracking",
    ],
    demo_url: "https://demo-banking.example.com",
    github_url: "https://github.com/example/banking-app",
    license: "Extended License",
    difficulty: "Advanced",
    images: ["/placeholder.svg?height=400&width=600"],
    rating: 4.9,
    downloads: 567,
    version: "3.0.0",
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
}

export default function ProjectDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [project, setProject] = useState<any>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [loading, setLoading] = useState(true)
  const [usingFallback, setUsingFallback] = useState(false)
  const [showPurchaseFlow, setShowPurchaseFlow] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchProject(params.id as string)
    }
  }, [params.id])

  const fetchProject = async (id: string) => {
    setLoading(true)
    try {
      const { data, error } = await supabase.from("projects").select("*").eq("id", id).single()

      if (error) {
        console.warn("Database not set up yet, using fallback data:", error.message)
        const fallbackProject = fallbackProjectData[id]
        if (fallbackProject) {
          setProject(fallbackProject)
          setUsingFallback(true)
        } else {
          setProject(null)
        }
      } else {
        setProject(data)
        setUsingFallback(false)
      }
    } catch (error) {
      console.warn("Error connecting to database, using fallback data:", error)
      const fallbackProject = fallbackProjectData[id]
      if (fallbackProject) {
        setProject(fallbackProject)
        setUsingFallback(true)
      } else {
        setProject(null)
      }
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse text-white text-xl">Loading project...</div>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Project Not Found</h1>
          <p className="text-gray-400 mb-4">
            {usingFallback
              ? "This project is not available in demo mode."
              : "The requested project could not be found."}
          </p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    )
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Web Application":
        return <Monitor className="w-5 h-5" />
      case "Mobile Application":
        return <Smartphone className="w-5 h-5" />
      default:
        return <Code className="w-5 h-5" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 pt-20">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-cyan-500/5"></div>
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-8 transition-all duration-300 ease-out transform translate-x-0 opacity-100">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="glass border-gray-600 text-gray-300 hover:border-blue-500 hover:text-blue-400"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Button>
        </div>

        {usingFallback && (
          <div className="mb-6 p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg text-yellow-400 text-sm">
            ⚠️ Demo mode - Set up Supabase to enable full functionality
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Gallery */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Image */}
            <div className="glass-card rounded-2xl overflow-hidden transition-all duration-300 ease-out transform translate-y-0 opacity-100">
              <div className="aspect-video bg-gray-800">
                <img
                  src={project.images?.[selectedImage] || "/placeholder.svg?height=400&width=600"}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Image Thumbnails */}
            {project.images && project.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {project.images.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-video rounded-lg overflow-hidden border-2 transition-all duration-300 hover:scale-105 ${
                      selectedImage === index
                        ? "border-blue-500 shadow-lg shadow-blue-500/25"
                        : "border-gray-700 hover:border-gray-600"
                    }`}
                  >
                    <img
                      src={image || "/placeholder.svg?height=100&width=150"}
                      alt={`${project.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Project Details Tabs */}
            <div className="transition-all duration-300 ease-out transform translate-y-0 opacity-100">
              <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="glass-dark rounded-xl p-1 grid grid-cols-3 gap-1">
                  <TabsTrigger
                    value="overview"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg"
                  >
                    Overview
                  </TabsTrigger>
                  <TabsTrigger
                    value="features"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg"
                  >
                    Features
                  </TabsTrigger>
                  <TabsTrigger
                    value="tech"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg"
                  >
                    Tech Stack
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <Card className="glass-card border-gray-700/50">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-white mb-4">About This Project</h3>
                      <p className="text-gray-300 leading-relaxed">{project.long_description}</p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="features" className="space-y-4">
                  <Card className="glass-card border-gray-700/50">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-white mb-4">Key Features</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {project.features?.map((feature: string, index: number) => (
                          <div
                            key={index}
                            className="flex items-center space-x-3 transition-all duration-300 ease-out transform translate-x-0 opacity-100"
                            style={{ animationDelay: `${index * 100}ms` }}
                          >
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-gray-300">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="tech" className="space-y-4">
                  <Card className="glass-card border-gray-700/50">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-white mb-4">Technology Stack</h3>
                      <div className="flex flex-wrap gap-3">
                        {project.tech_stack?.map((tech: string, index: number) => (
                          <div
                            key={index}
                            className="transition-all duration-300 ease-out transform scale-100 opacity-100"
                            style={{ animationDelay: `${index * 100}ms` }}
                          >
                            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 px-3 py-1">{tech}</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Right Column - Purchase Info */}
          <div className="space-y-6">
            <div className="glass-card rounded-2xl p-6 sticky top-24 transition-all duration-300 ease-out transform translate-x-0 opacity-100">
              {/* Project Header */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-3">
                  {getCategoryIcon(project.category)}
                  <span className="text-gray-400 text-sm">{project.category}</span>
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">{project.title}</h1>
                <p className="text-gray-300 text-sm line-clamp-3">{project.description}</p>
              </div>

              {/* Rating and Stats */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-white font-medium">{project.rating.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Download className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-400 text-sm">{project.downloads}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsLiked(!isLiked)}
                    className={`border-gray-600 transition-colors duration-300 ${
                      isLiked ? "text-red-400 border-red-400" : "text-gray-400 hover:text-red-400"
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
                  </Button>
                  <Button size="sm" variant="outline" className="border-gray-600 text-gray-400">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="text-3xl font-bold text-white mb-2">₹{project.price.toLocaleString("en-IN")}</div>
                <div className="text-sm text-gray-400">{project.license}</div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 mb-6">
                <Button
                  onClick={() => setShowPurchaseFlow(true)}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 hover:scale-105"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Purchase Now
                </Button>
                <div className="grid grid-cols-2 gap-3">
                  {project.demo_url && (
                    <Button
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:border-blue-500 hover:text-blue-400"
                      onClick={() => window.open(project.demo_url, "_blank")}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Live Demo
                    </Button>
                  )}
                  {project.github_url && (
                    <Button
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:border-green-500 hover:text-green-400"
                      onClick={() => window.open(project.github_url, "_blank")}
                    >
                      <Github className="w-4 h-4 mr-2" />
                      Source
                    </Button>
                  )}
                </div>
              </div>

              {/* Project Info */}
              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Version:</span>
                  <span className="text-white">{project.version}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Last Updated:</span>
                  <span className="text-white">{new Date(project.updated_at).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Difficulty:</span>
                  <Badge
                    className={
                      project.difficulty === "Beginner"
                        ? "bg-green-500/20 text-green-400 border-green-500/30"
                        : project.difficulty === "Intermediate"
                          ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                          : "bg-red-500/20 text-red-400 border-red-500/30"
                    }
                  >
                    {project.difficulty}
                  </Badge>
                </div>
              </div>

              {/* Tags */}
              <div className="mt-6">
                <h4 className="text-white font-medium mb-3">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {project.tags?.map((tag: string, index: number) => (
                    <Badge key={index} variant="secondary" className="bg-gray-800 text-gray-300 text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PurchaseFlow
        isOpen={showPurchaseFlow}
        onClose={() => setShowPurchaseFlow(false)}
        project={
          project
            ? {
                id: project.id,
                title: project.title,
                price: project.price,
                images: project.images,
                category: project.category,
                license: project.license,
              }
            : null
        }
      />
    </div>
  )
}
