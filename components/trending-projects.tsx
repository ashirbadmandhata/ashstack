"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Star,
  Download,
  Heart,
  ShoppingCart,
  Search,
  Filter,
  Code,
  Smartphone,
  Monitor,
  Palette,
  Database,
  Brain,
  Settings,
} from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/contexts/auth-context"

interface Project {
  id: string
  title: string
  price: number
  description: string
  category: string
  tech_stack: string[]
  tags: string[]
  images: string[]
  rating: number
  downloads: number
  featured: boolean
  difficulty: string
  created_at: string
}

const categoryIcons = {
  "Web Application": Monitor,
  "Mobile Application": Smartphone,
  "UI Kit": Palette,
  "SaaS Platform": Database,
  "AI/ML Project": Brain,
  API: Settings,
  "Developer Tools": Code,
}

const fallbackProjects = [
  {
    id: "1",
    title: "E-commerce Dashboard",
    price: 24999,
    description: "Complete admin dashboard with analytics, inventory management, and order tracking",
    category: "Web Application",
    tech_stack: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
    tags: ["React", "Dashboard", "Analytics"],
    images: ["/placeholder.svg?height=400&width=600"],
    rating: 4.9,
    downloads: 1234,
    featured: true,
    difficulty: "Intermediate",
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    title: "AI Chat Assistant",
    price: 16599,
    description: "Intelligent chatbot with natural language processing",
    category: "AI/ML Project",
    tech_stack: ["Python", "OpenAI", "FastAPI"],
    tags: ["AI", "Chatbot", "NLP"],
    images: ["/placeholder.svg?height=400&width=600"],
    rating: 4.8,
    downloads: 856,
    featured: false,
    difficulty: "Advanced",
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Mobile Banking App",
    price: 33249,
    description: "Secure mobile banking solution with biometric authentication",
    category: "Mobile Application",
    tech_stack: ["React Native", "Node.js", "MongoDB"],
    tags: ["Mobile", "Banking", "Security"],
    images: ["/placeholder.svg?height=400&width=600"],
    rating: 4.9,
    downloads: 567,
    featured: true,
    difficulty: "Advanced",
    created_at: new Date().toISOString(),
  },
]

export function TrendingProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("featured")
  const [wishlist, setWishlist] = useState<string[]>([])
  const [cart, setCart] = useState<string[]>([])
  const { user } = useAuth()

  useEffect(() => {
    fetchProjects()
    if (user) {
      fetchWishlist()
      fetchCart()
    }
  }, [user])

  useEffect(() => {
    filterAndSortProjects()
  }, [projects, searchTerm, selectedCategory, sortBy])

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching projects:", error)
        // Use fallback data if database is not available
        setProjects(fallbackProjects)
      } else {
        setProjects(data || [])
      }
    } catch (error) {
      console.error("Database connection error:", error)
      setProjects(fallbackProjects)
    } finally {
      setLoading(false)
    }
  }

  const fetchWishlist = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase.from("wishlist").select("project_id").eq("user_id", user.id)

      if (!error && data) {
        setWishlist(data.map((item) => item.project_id))
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error)
    }
  }

  const fetchCart = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase.from("cart").select("project_id").eq("user_id", user.id)

      if (!error && data) {
        setCart(data.map((item) => item.project_id))
      }
    } catch (error) {
      console.error("Error fetching cart:", error)
    }
  }

  const toggleWishlist = async (projectId: string) => {
    if (!user) {
      alert("Please sign in to add items to wishlist")
      return
    }

    try {
      if (wishlist.includes(projectId)) {
        // Remove from wishlist
        const { error } = await supabase.from("wishlist").delete().eq("user_id", user.id).eq("project_id", projectId)

        if (!error) {
          setWishlist((prev) => prev.filter((id) => id !== projectId))
        }
      } else {
        // Add to wishlist
        const { error } = await supabase.from("wishlist").insert({ user_id: user.id, project_id: projectId })

        if (!error) {
          setWishlist((prev) => [...prev, projectId])
        }
      }
    } catch (error) {
      console.error("Error updating wishlist:", error)
    }
  }

  const toggleCart = async (projectId: string) => {
    if (!user) {
      alert("Please sign in to add items to cart")
      return
    }

    try {
      if (cart.includes(projectId)) {
        // Remove from cart
        const { error } = await supabase.from("cart").delete().eq("user_id", user.id).eq("project_id", projectId)

        if (!error) {
          setCart((prev) => prev.filter((id) => id !== projectId))
        }
      } else {
        // Add to cart
        const { error } = await supabase.from("cart").insert({ user_id: user.id, project_id: projectId })

        if (!error) {
          setCart((prev) => [...prev, projectId])
        }
      }
    } catch (error) {
      console.error("Error updating cart:", error)
    }
  }

  const filterAndSortProjects = () => {
    const filtered = projects.filter((project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesCategory = selectedCategory === "all" || project.category === selectedCategory

      return matchesSearch && matchesCategory
    })

    // Sort projects
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "featured":
          if (a.featured && !b.featured) return -1
          if (!a.featured && b.featured) return 1
          return b.rating - a.rating
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "rating":
          return b.rating - a.rating
        case "downloads":
          return b.downloads - a.downloads
        case "newest":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        default:
          return 0
      }
    })

    setFilteredProjects(filtered)
  }

  const categories = Array.from(new Set(projects.map((p) => p.category)))

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse text-white text-xl">Loading projects...</div>
        </div>
      </div>
    )
  }

  return (
    <section className="py-16">
      {/* Filters and Search */}
      <div className="mb-12 space-y-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 glass border-gray-600 text-white placeholder-gray-400"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48 glass border-gray-600 text-white">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="glass-dark border-gray-600">
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48 glass border-gray-600 text-white">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="glass-dark border-gray-600">
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="downloads">Most Downloaded</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="text-gray-400 text-sm">
          Showing {filteredProjects.length} of {projects.length} projects
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map((project, index) => {
          const IconComponent = categoryIcons[project.category as keyof typeof categoryIcons] || Code
          const isInWishlist = wishlist.includes(project.id)
          const isInCart = cart.includes(project.id)

          return (
            <Card
              key={project.id}
              className="glass-card border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 group hover:scale-105"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              <div className="relative overflow-hidden rounded-t-xl">
                <img
                  src={project.images[0] || "/placeholder.svg?height=300&width=400"}
                  alt={project.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  {project.featured && (
                    <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Featured</Badge>
                  )}
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">{project.difficulty}</Badge>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toggleWishlist(project.id)}
                  className={`absolute top-4 right-4 border-gray-600 transition-colors ${
                    isInWishlist ? "text-red-400 border-red-400 bg-red-500/20" : "text-gray-400 hover:text-red-400"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isInWishlist ? "fill-current" : ""}`} />
                </Button>
              </div>

              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <IconComponent className="w-5 h-5 text-blue-400" />
                  <span className="text-gray-400 text-sm">{project.category}</span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  {project.title}
                </h3>

                <p className="text-gray-300 text-sm mb-4 line-clamp-2">{project.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech_stack.slice(0, 3).map((tech, techIndex) => (
                    <Badge key={techIndex} variant="secondary" className="bg-gray-800 text-gray-300 text-xs">
                      {tech}
                    </Badge>
                  ))}
                  {project.tech_stack.length > 3 && (
                    <Badge variant="secondary" className="bg-gray-800 text-gray-300 text-xs">
                      +{project.tech_stack.length - 3}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-white text-sm font-medium">{project.rating}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Download className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-400 text-sm">{project.downloads}</span>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-white">₹{project.price.toLocaleString("en-IN")}</div>
                </div>

                <div className="flex gap-2">
                  <Link href={`/project/${project.id}`} className="flex-1">
                    <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300">
                      View Details
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleCart(project.id)}
                    className={`border-gray-600 transition-colors ${
                      isInCart
                        ? "text-green-400 border-green-400 bg-green-500/20"
                        : "text-gray-400 hover:text-green-400"
                    }`}
                  >
                    <ShoppingCart className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-16">
          <div className="text-gray-400 text-lg mb-4">No projects found</div>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </section>
  )
}
