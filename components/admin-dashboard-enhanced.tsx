"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  DollarSign,
  Package,
  Upload,
  Settings,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  XCircle,
  TrendingUp,
  FileText,
  Code,
  Activity,
  Mail,
  AlertTriangle,
  Sparkles,
  Wand2,
  FolderPlus,
} from "lucide-react"

import { RealTimeCharts } from "@/components/real-time-charts"
import { FileUpload } from "@/components/file-upload"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

// Enhanced mock data
const stats = {
  totalSales: { value: "₹37,85,231", change: "+12.5%", trend: "up" },
  activeUsers: { value: "2,345", change: "+8.2%", trend: "up" },
  totalAssets: { value: "156", change: "+5", trend: "up" },
  conversionRate: { value: "3.2%", change: "+0.3%", trend: "up" },
}

export function AdminDashboardEnhanced() {
  const [activeTab, setActiveTab] = useState("analytics")
  const [projects, setProjects] = useState<any[]>([])
  const [contactSubmissions, setContactSubmissions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [dbConnected, setDbConnected] = useState(true)
  const { toast } = useToast()

  // AI Generator State
  const [aiLoading, setAiLoading] = useState(false)
  const [aiPrompt, setAiPrompt] = useState("")
  const [aiCategory, setAiCategory] = useState("")
  const [aiDifficulty, setAiDifficulty] = useState("")

  const [uploadForm, setUploadForm] = useState({
    title: "",
    price: "",
    category: "",
    description: "",
    longDescription: "",
    techStack: "",
    tags: "",
    features: "",
    demoUrl: "",
    githubUrl: "",
    license: "",
    difficulty: "",
    version: "1.0.0",
    featured: false,
    projectFiles: [] as any[],
  })

  // Check database connection and fetch data
  useEffect(() => {
    checkDatabaseConnection()
    fetchProjects()
    fetchContactSubmissions()
  }, [])

  const checkDatabaseConnection = async () => {
    try {
      const { error } = await supabase.from("projects").select("id").limit(1)
      setDbConnected(!error)
    } catch (error) {
      setDbConnected(false)
    }
  }

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: false })

      if (error) {
        console.warn("Database not connected:", error.message)
        setDbConnected(false)
      } else {
        setProjects(data || [])
        setDbConnected(true)
      }
    } catch (error) {
      console.warn("Error connecting to database:", error)
      setDbConnected(false)
    }
  }

  const fetchContactSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from("contact_submissions")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) {
        console.warn("Database not connected:", error.message)
      } else {
        setContactSubmissions(data || [])
      }
    } catch (error) {
      console.warn("Error connecting to database:", error)
    }
  }

  // AI Content Generation
  const generateAIContent = async () => {
    if (!aiPrompt.trim() || !aiCategory) {
      toast({
        title: "Missing Information",
        description: "Please enter a project description and select a category",
        variant: "destructive",
      })
      return
    }

    setAiLoading(true)

    try {
      // Simulate AI generation (in a real app, you'd call an AI API)
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const generatedContent = {
        title: generateTitle(aiPrompt, aiCategory),
        description: generateDescription(aiPrompt),
        longDescription: generateLongDescription(aiPrompt, aiCategory),
        features: generateFeatures(aiPrompt, aiCategory),
        techStack: generateTechStack(aiCategory),
        tags: generateTags(aiPrompt, aiCategory),
        suggestedPrice: generatePrice(aiCategory, aiDifficulty),
      }

      // Apply generated content to form
      setUploadForm({
        ...uploadForm,
        title: generatedContent.title,
        description: generatedContent.description,
        longDescription: generatedContent.longDescription,
        features: generatedContent.features.join("\n"),
        techStack: generatedContent.techStack.join(", "),
        tags: generatedContent.tags.join(", "),
        price: generatedContent.suggestedPrice.toString(),
        category: aiCategory,
        difficulty: aiDifficulty,
      })

      toast({
        title: "AI Content Generated!",
        description: "Project details have been generated and applied to the form.",
      })
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate content. Please try again.",
        variant: "destructive",
      })
    } finally {
      setAiLoading(false)
    }
  }

  // Helper functions for AI generation
  const generateTitle = (prompt: string, category: string) => {
    const titles = {
      "Web Application": ["Advanced Dashboard Pro", "Smart Analytics Platform", "Modern Web Portal"],
      "Mobile Application": ["Mobile Pro App", "Smart Mobile Solution", "Advanced Mobile Platform"],
      "AI/ML Project": ["AI-Powered Assistant", "Machine Learning Platform", "Intelligent Analytics Engine"],
    }
    const categoryTitles = titles[category as keyof typeof titles] || ["Smart Digital Solution"]
    return categoryTitles[Math.floor(Math.random() * categoryTitles.length)]
  }

  const generateDescription = (prompt: string) => {
    return `A comprehensive solution that ${prompt.toLowerCase()}. Built with modern technologies and best practices for optimal performance and user experience.`
  }

  const generateLongDescription = (prompt: string, category: string) => {
    return `This ${category.toLowerCase()} provides a complete solution for ${prompt.toLowerCase()}. Features include advanced functionality, intuitive user interface, and robust performance optimization. Perfect for businesses and developers looking to implement a professional-grade solution.`
  }

  const generateFeatures = (prompt: string, category: string) => {
    const baseFeatures = [
      "Modern responsive design",
      "Cross-platform compatibility",
      "Real-time data synchronization",
      "Advanced security features",
    ]
    const categoryFeatures = {
      "Web Application": ["Progressive Web App support", "Server-side rendering", "API integration"],
      "Mobile Application": ["Native performance", "Offline functionality", "Push notifications"],
      "AI/ML Project": ["Machine learning algorithms", "Natural language processing", "Predictive analytics"],
    }
    return [...baseFeatures, ...(categoryFeatures[category as keyof typeof categoryFeatures] || [])].slice(0, 6)
  }

  const generateTechStack = (category: string) => {
    const stacks = {
      "Web Application": ["React", "Next.js", "TypeScript", "Tailwind CSS", "Node.js"],
      "Mobile Application": ["React Native", "TypeScript", "Expo", "Firebase"],
      "AI/ML Project": ["Python", "TensorFlow", "FastAPI", "NumPy"],
    }
    return stacks[category as keyof typeof stacks] || ["React", "TypeScript", "Node.js"]
  }

  const generateTags = (prompt: string, category: string) => {
    const baseTags = ["modern", "responsive", "professional"]
    const categoryTags = {
      "Web Application": ["web", "dashboard", "analytics"],
      "Mobile Application": ["mobile", "app", "native"],
      "AI/ML Project": ["ai", "machine-learning", "intelligent"],
    }
    return [...baseTags, ...(categoryTags[category as keyof typeof categoryTags] || [])].slice(0, 6)
  }

  const generatePrice = (category: string, difficulty: string) => {
    const basePrices = { "Web Application": 25000, "Mobile Application": 35000, "AI/ML Project": 45000 }
    const difficultyMultiplier = { Beginner: 0.7, Intermediate: 1.0, Advanced: 1.5, Expert: 2.0 }
    const basePrice = basePrices[category as keyof typeof basePrices] || 20000
    const multiplier = difficultyMultiplier[difficulty as keyof typeof difficultyMultiplier] || 1.0
    return Math.round(basePrice * multiplier)
  }

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!dbConnected) {
      toast({
        title: "Database Error",
        description: "Database not connected. Please set up Supabase first.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.from("projects").insert([
        {
          title: uploadForm.title,
          price: Number.parseFloat(uploadForm.price),
          description: uploadForm.description,
          long_description: uploadForm.longDescription,
          category: uploadForm.category,
          tech_stack: uploadForm.techStack.split(",").map((s) => s.trim()),
          tags: uploadForm.tags.split(",").map((s) => s.trim()),
          features: uploadForm.features.split("\n").filter((f) => f.trim()),
          demo_url: uploadForm.demoUrl || null,
          github_url: uploadForm.githubUrl || null,
          license: uploadForm.license,
          difficulty: uploadForm.difficulty,
          version: uploadForm.version,
          featured: uploadForm.featured,
          images: ["/placeholder.svg?height=400&width=600"],
          rating: 0.0,
          downloads: 0,
        },
      ])

      if (error) {
        console.error("Error uploading project:", error)
        toast({
          title: "Upload Failed",
          description: "Error uploading project. Please try again.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success!",
          description: "Project uploaded successfully!",
        })
        // Reset form
        setUploadForm({
          title: "",
          price: "",
          category: "",
          description: "",
          longDescription: "",
          techStack: "",
          tags: "",
          features: "",
          demoUrl: "",
          githubUrl: "",
          license: "",
          difficulty: "",
          version: "1.0.0",
          featured: false,
          projectFiles: [],
        })
        fetchProjects()
      }
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Error",
        description: "Error uploading project. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const updateRequestStatus = async (id: string, newStatus: string) => {
    if (!dbConnected) {
      toast({
        title: "Database Error",
        description: "Database not connected. Please set up Supabase first.",
        variant: "destructive",
      })
      return
    }

    const { error } = await supabase
      .from("contact_submissions")
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq("id", id)

    if (error) {
      console.error("Error updating status:", error)
      toast({
        title: "Update Failed",
        description: "Error updating status. Please try again.",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Status Updated",
        description: `Request status updated to ${newStatus}`,
      })
      fetchContactSubmissions()
    }
  }

  const deleteProject = async (id: string) => {
    if (!dbConnected) {
      toast({
        title: "Database Error",
        description: "Database not connected. Please set up Supabase first.",
        variant: "destructive",
      })
      return
    }

    if (confirm("Are you sure you want to delete this project?")) {
      const { error } = await supabase.from("projects").delete().eq("id", id)

      if (error) {
        console.error("Error deleting project:", error)
        toast({
          title: "Delete Failed",
          description: "Error deleting project. Please try again.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Project Deleted",
          description: "Project has been successfully deleted.",
        })
        fetchProjects()
      }
    }
  }

  return (
    <main className="min-h-screen bg-gray-950 py-8">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-cyan-500/5"></div>
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="glass-card rounded-2xl p-6 mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 glow-blue">Admin Dashboard</h1>
            <p className="text-gray-400">Manage your digital asset store with advanced analytics and controls</p>

            {!dbConnected && (
              <div className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Database not connected. Please set up Supabase and run the SQL scripts to enable full functionality.
              </div>
            )}
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="glass-dark rounded-xl p-1 grid grid-cols-2 md:grid-cols-5 gap-1">
            <TabsTrigger
              value="analytics"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg transition-all duration-300"
            >
              <Activity className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger
              value="upload"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg transition-all duration-300"
            >
              <Upload className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Upload</span>
            </TabsTrigger>
            <TabsTrigger
              value="projects"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg transition-all duration-300"
            >
              <Package className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Projects</span>
            </TabsTrigger>
            <TabsTrigger
              value="users"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg transition-all duration-300"
            >
              <Users className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Users</span>
            </TabsTrigger>
            <TabsTrigger
              value="requests"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg transition-all duration-300"
            >
              <Settings className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Requests</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-6">
            {/* Enhanced Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(stats).map(([key, stat], index) => {
                const icons = [DollarSign, Users, Package, TrendingUp]
                const Icon = icons[index]
                const colors = [
                  "from-green-500 to-emerald-600",
                  "from-blue-500 to-cyan-600",
                  "from-purple-500 to-pink-600",
                  "from-orange-500 to-red-600",
                ]

                return (
                  <Card
                    key={key}
                    className="glass-card border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 group hover:scale-105"
                  >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-300 capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </CardTitle>
                      <div
                        className={`p-2 rounded-lg bg-gradient-to-r ${colors[index]} group-hover:scale-110 transition-transform`}
                      >
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`text-xs font-medium ${stat.trend === "up" ? "text-green-400" : "text-red-400"}`}
                        >
                          {stat.change}
                        </span>
                        <span className="text-xs text-gray-500">from last month</span>
                      </div>
                      <Progress value={75} className="mt-2 h-1" />
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            <RealTimeCharts />
          </TabsContent>

          <TabsContent value="upload" className="space-y-6">
            <Card className="glass-card border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center text-2xl">
                  <Upload className="w-6 h-6 mr-3 text-blue-400" />
                  Upload New Digital Asset
                </CardTitle>
                <p className="text-gray-400">Add a new project to your digital asset store</p>
                {!dbConnected && (
                  <div className="p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg text-yellow-400 text-sm">
                    ⚠️ Database not connected. Set up Supabase to enable project uploads.
                  </div>
                )}
              </CardHeader>
              <CardContent>
                {/* AI Content Generator Section */}
                <div className="mb-8 p-6 glass rounded-xl border border-purple-500/30">
                  <h3 className="text-lg font-semibold text-white flex items-center mb-4">
                    <Sparkles className="w-5 h-5 mr-2 text-purple-400" />
                    AI Content Generator
                  </h3>
                  <p className="text-gray-400 mb-4">Generate comprehensive project details using AI</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label className="text-gray-300 mb-2 block">Category</Label>
                      <Select value={aiCategory} onValueChange={setAiCategory}>
                        <SelectTrigger className="glass border-gray-600 text-white">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent className="glass-dark border-gray-600">
                          <SelectItem value="Web Application">Web Application</SelectItem>
                          <SelectItem value="Mobile Application">Mobile Application</SelectItem>
                          <SelectItem value="AI/ML Project">AI/ML Project</SelectItem>
                          <SelectItem value="UI Kit">UI Kit</SelectItem>
                          <SelectItem value="SaaS Platform">SaaS Platform</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-gray-300 mb-2 block">Difficulty</Label>
                      <Select value={aiDifficulty} onValueChange={setAiDifficulty}>
                        <SelectTrigger className="glass border-gray-600 text-white">
                          <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                        <SelectContent className="glass-dark border-gray-600">
                          <SelectItem value="Beginner">Beginner</SelectItem>
                          <SelectItem value="Intermediate">Intermediate</SelectItem>
                          <SelectItem value="Advanced">Advanced</SelectItem>
                          <SelectItem value="Expert">Expert</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="mb-4">
                    <Label className="text-gray-300 mb-2 block">Project Description</Label>
                    <Textarea
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="Describe what you want to build... (e.g., 'a modern e-commerce dashboard with analytics and inventory management')"
                      className="glass border-gray-600 text-white placeholder-gray-500 min-h-[100px]"
                    />
                  </div>

                  <Button
                    onClick={generateAIContent}
                    disabled={aiLoading || !aiPrompt.trim() || !aiCategory}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 transition-all duration-300"
                  >
                    {aiLoading ? (
                      <>
                        <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                        Generating with AI...
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-4 h-4 mr-2" />
                        Generate Project Details
                      </>
                    )}
                  </Button>
                </div>

                <form onSubmit={handleUploadSubmit} className="space-y-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white flex items-center">
                      <FileText className="w-5 h-5 mr-2 text-green-400" />
                      Basic Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="title" className="text-gray-300 font-medium">
                          Project Title *
                        </Label>
                        <Input
                          id="title"
                          value={uploadForm.title}
                          onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                          className="glass border-gray-600 text-white placeholder-gray-500 focus:border-blue-500 transition-colors"
                          placeholder="Enter project title"
                          required
                          disabled={!dbConnected}
                        />
                      </div>
                      <div>
                        <Label htmlFor="price" className="text-gray-300 font-medium">
                          Price (INR) *
                        </Label>
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          value={uploadForm.price}
                          onChange={(e) => setUploadForm({ ...uploadForm, price: e.target.value })}
                          className="glass border-gray-600 text-white placeholder-gray-500 focus:border-blue-500 transition-colors"
                          placeholder="9999.00"
                          required
                          disabled={!dbConnected}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="category" className="text-gray-300 font-medium">
                          Category *
                        </Label>
                        <Select
                          value={uploadForm.category}
                          onValueChange={(value) => setUploadForm({ ...uploadForm, category: value })}
                          disabled={!dbConnected}
                        >
                          <SelectTrigger className="glass border-gray-600 text-white focus:border-blue-500">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent className="glass-dark border-gray-600">
                            <SelectItem value="Web Application">Web Application</SelectItem>
                            <SelectItem value="Mobile Application">Mobile Application</SelectItem>
                            <SelectItem value="UI Kit">UI Kit & Templates</SelectItem>
                            <SelectItem value="SaaS Platform">SaaS Platform</SelectItem>
                            <SelectItem value="AI/ML Project">AI/ML Project</SelectItem>
                            <SelectItem value="API">API & Backend</SelectItem>
                            <SelectItem value="Developer Tools">Developer Tools</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="difficulty" className="text-gray-300 font-medium">
                          Difficulty Level
                        </Label>
                        <Select
                          value={uploadForm.difficulty}
                          onValueChange={(value) => setUploadForm({ ...uploadForm, difficulty: value })}
                          disabled={!dbConnected}
                        >
                          <SelectTrigger className="glass border-gray-600 text-white focus:border-blue-500">
                            <SelectValue placeholder="Select difficulty" />
                          </SelectTrigger>
                          <SelectContent className="glass-dark border-gray-600">
                            <SelectItem value="Beginner">Beginner</SelectItem>
                            <SelectItem value="Intermediate">Intermediate</SelectItem>
                            <SelectItem value="Advanced">Advanced</SelectItem>
                            <SelectItem value="Expert">Expert</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Project Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white flex items-center">
                      <Code className="w-5 h-5 mr-2 text-purple-400" />
                      Project Details
                    </h3>

                    <div>
                      <Label htmlFor="description" className="text-gray-300 font-medium">
                        Short Description *
                      </Label>
                      <Textarea
                        id="description"
                        value={uploadForm.description}
                        onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                        className="glass border-gray-600 text-white placeholder-gray-500 focus:border-blue-500 transition-colors"
                        placeholder="Brief description for project cards..."
                        required
                        disabled={!dbConnected}
                      />
                    </div>

                    <div>
                      <Label htmlFor="longDescription" className="text-gray-300 font-medium">
                        Detailed Description *
                      </Label>
                      <Textarea
                        id="longDescription"
                        value={uploadForm.longDescription}
                        onChange={(e) => setUploadForm({ ...uploadForm, longDescription: e.target.value })}
                        className="glass border-gray-600 text-white placeholder-gray-500 focus:border-blue-500 transition-colors min-h-[120px]"
                        placeholder="Detailed description for project details page..."
                        required
                        disabled={!dbConnected}
                      />
                    </div>

                    <div>
                      <Label htmlFor="features" className="text-gray-300 font-medium">
                        Key Features (one per line)
                      </Label>
                      <Textarea
                        id="features"
                        value={uploadForm.features}
                        onChange={(e) => setUploadForm({ ...uploadForm, features: e.target.value })}
                        className="glass border-gray-600 text-white placeholder-gray-500 focus:border-blue-500 transition-colors"
                        placeholder="Real-time analytics dashboard&#10;Inventory management system&#10;Order tracking and management"
                        disabled={!dbConnected}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="techStack" className="text-gray-300 font-medium">
                          Tech Stack (comma separated) *
                        </Label>
                        <Input
                          id="techStack"
                          value={uploadForm.techStack}
                          onChange={(e) => setUploadForm({ ...uploadForm, techStack: e.target.value })}
                          className="glass border-gray-600 text-white placeholder-gray-500 focus:border-blue-500 transition-colors"
                          placeholder="React, Node.js, MongoDB, etc."
                          required
                          disabled={!dbConnected}
                        />
                      </div>
                      <div>
                        <Label htmlFor="tags" className="text-gray-300 font-medium">
                          Tags (comma separated)
                        </Label>
                        <Input
                          id="tags"
                          value={uploadForm.tags}
                          onChange={(e) => setUploadForm({ ...uploadForm, tags: e.target.value })}
                          className="glass border-gray-600 text-white placeholder-gray-500 focus:border-blue-500 transition-colors"
                          placeholder="responsive, dashboard, ecommerce"
                          disabled={!dbConnected}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Media & Links */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white flex items-center">
                      <FolderPlus className="w-5 h-5 mr-2 text-cyan-400" />
                      Project Files & Media
                    </h3>

                    <FileUpload
                      projectId={uploadForm.title ? uploadForm.title.toLowerCase().replace(/\s+/g, "-") : undefined}
                      onFilesChange={(files) => {
                        console.log("Files uploaded:", files)
                        setUploadForm((prev) => ({
                          ...prev,
                          projectFiles: files,
                        }))
                      }}
                      maxFiles={10}
                      acceptedTypes={[".zip", ".rar", ".tar.gz", ".pdf", ".doc", ".docx", ".txt", ".md"]}
                      maxSize={100}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="demoUrl" className="text-gray-300 font-medium">
                          Demo URL
                        </Label>
                        <Input
                          id="demoUrl"
                          value={uploadForm.demoUrl}
                          onChange={(e) => setUploadForm({ ...uploadForm, demoUrl: e.target.value })}
                          className="glass border-gray-600 text-white placeholder-gray-500 focus:border-blue-500 transition-colors"
                          placeholder="https://demo.example.com"
                          disabled={!dbConnected}
                        />
                      </div>
                      <div>
                        <Label htmlFor="githubUrl" className="text-gray-300 font-medium">
                          GitHub Repository
                        </Label>
                        <Input
                          id="githubUrl"
                          value={uploadForm.githubUrl}
                          onChange={(e) => setUploadForm({ ...uploadForm, githubUrl: e.target.value })}
                          className="glass border-gray-600 text-white placeholder-gray-500 focus:border-blue-500 transition-colors"
                          placeholder="https://github.com/username/repo"
                          disabled={!dbConnected}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="license" className="text-gray-300 font-medium">
                          License Type
                        </Label>
                        <Select
                          value={uploadForm.license}
                          onValueChange={(value) => setUploadForm({ ...uploadForm, license: value })}
                          disabled={!dbConnected}
                        >
                          <SelectTrigger className="glass border-gray-600 text-white focus:border-blue-500">
                            <SelectValue placeholder="Select license type" />
                          </SelectTrigger>
                          <SelectContent className="glass-dark border-gray-600">
                            <SelectItem value="Standard License">Standard License</SelectItem>
                            <SelectItem value="Extended License">Extended License</SelectItem>
                            <SelectItem value="Commercial License">Commercial License</SelectItem>
                            <SelectItem value="Open Source">Open Source</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="version" className="text-gray-300 font-medium">
                          Version
                        </Label>
                        <Input
                          id="version"
                          value={uploadForm.version}
                          onChange={(e) => setUploadForm({ ...uploadForm, version: e.target.value })}
                          className="glass border-gray-600 text-white placeholder-gray-500 focus:border-blue-500 transition-colors"
                          placeholder="1.0.0"
                          disabled={!dbConnected}
                        />
                      </div>
                      <div className="flex items-center space-x-2 pt-6">
                        <input
                          type="checkbox"
                          id="featured"
                          checked={uploadForm.featured}
                          onChange={(e) => setUploadForm({ ...uploadForm, featured: e.target.checked })}
                          className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500"
                          disabled={!dbConnected}
                        />
                        <Label htmlFor="featured" className="text-gray-300 font-medium">
                          Featured Project
                        </Label>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-gray-500"
                      disabled={!dbConnected}
                    >
                      Save as Draft
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading || !dbConnected}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {loading ? "Publishing..." : "Publish Asset"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            <Card className="glass-card border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center text-2xl">
                  <Package className="w-6 h-6 mr-3 text-green-400" />
                  Manage Projects
                </CardTitle>
                <p className="text-gray-400">View and manage all uploaded projects</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      className="flex items-center justify-between p-6 glass rounded-xl hover:bg-white/10 transition-all duration-300 group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform">
                          {project.title.charAt(0)}
                        </div>
                        <div>
                          <p className="text-white font-semibold text-lg">{project.title}</p>
                          <p className="text-gray-400">₹{project.price.toLocaleString("en-IN")}</p>
                          <p className="text-gray-500 text-sm">{project.category}</p>
                          <div className="flex gap-2 mt-2">
                            {project.featured && (
                              <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Featured</Badge>
                            )}
                            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                              {project.difficulty}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right text-sm text-gray-400">
                          <p>{project.downloads} downloads</p>
                          <p>⭐ {project.rating.toFixed(1)}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-gray-600 text-gray-300 hover:border-blue-500 hover:text-blue-400"
                            onClick={() => window.open(`/project/${project.id}`, "_blank")}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-gray-600 text-gray-300 hover:border-green-500 hover:text-green-400"
                            onClick={() => {
                              // Fill form with project data for editing
                              setUploadForm({
                                title: project.title,
                                price: project.price.toString(),
                                category: project.category,
                                description: project.description,
                                longDescription: project.long_description,
                                techStack: project.tech_stack.join(", "),
                                tags: project.tags.join(", "),
                                features: project.features.join("\n"),
                                demoUrl: project.demo_url || "",
                                githubUrl: project.github_url || "",
                                license: project.license,
                                difficulty: project.difficulty,
                                version: project.version,
                                featured: project.featured,
                                projectFiles: [],
                              })
                              setActiveTab("upload")
                              toast({
                                title: "Project Loaded",
                                description: "Project data loaded for editing in the upload form.",
                              })
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteProject(project.id)}
                            className="border-gray-600 text-gray-300 hover:border-red-500 hover:text-red-400"
                            disabled={!dbConnected}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {projects.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      {dbConnected
                        ? "No projects uploaded yet. Upload your first project!"
                        : "Database not connected. Set up Supabase to view projects."}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card className="glass-card border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center text-2xl">
                  <Users className="w-6 h-6 mr-3 text-green-400" />
                  User Management
                </CardTitle>
                <p className="text-gray-400">Manage your platform users and their activities</p>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-400">User management features coming soon...</div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="requests" className="space-y-6">
            <Card className="glass-card border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center text-2xl">
                  <Settings className="w-6 h-6 mr-3 text-purple-400" />
                  Custom Project Requests
                </CardTitle>
                <p className="text-gray-400">Manage incoming custom project requests from clients</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {contactSubmissions.map((request) => (
                    <div
                      key={request.id}
                      className="glass rounded-xl border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300"
                    >
                      <div className="p-6">
                        <div className="flex flex-col lg:flex-row lg:items-start justify-between mb-6">
                          <div className="flex items-start space-x-4 mb-4 lg:mb-0">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                              {request.name.charAt(0)}
                            </div>
                            <div>
                              <h3 className="text-white font-semibold text-lg">{request.name}</h3>
                              <p className="text-gray-400">{request.email}</p>
                              <p className="text-gray-500 text-sm">
                                Submitted: {new Date(request.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Badge
                              className={
                                request.priority === "high"
                                  ? "bg-red-500/20 text-red-400 border-red-500/30"
                                  : request.priority === "medium"
                                    ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                                    : "bg-green-500/20 text-green-400 border-green-500/30"
                              }
                            >
                              {request.priority} priority
                            </Badge>
                            <Badge
                              className={
                                request.status === "pending"
                                  ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                                  : request.status === "in-progress"
                                    ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                                    : request.status === "completed"
                                      ? "bg-green-500/20 text-green-400 border-green-500/30"
                                      : "bg-red-500/20 text-red-400 border-red-500/30"
                              }
                            >
                              {request.status === "in-progress" ? (
                                <Clock className="w-3 h-3 mr-1" />
                              ) : request.status === "pending" ? (
                                <Clock className="w-3 h-3 mr-1" />
                              ) : request.status === "completed" ? (
                                <CheckCircle className="w-3 h-3 mr-1" />
                              ) : (
                                <XCircle className="w-3 h-3 mr-1" />
                              )}
                              {request.status}
                            </Badge>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                          <div className="glass rounded-lg p-4">
                            <span className="text-gray-400 text-sm">Project Type</span>
                            <p className="text-white font-medium">{request.project_type}</p>
                          </div>
                          <div className="glass rounded-lg p-4">
                            <span className="text-gray-400 text-sm">Budget</span>
                            <p className="text-white font-medium">{request.budget || "Not specified"}</p>
                          </div>
                          <div className="glass rounded-lg p-4">
                            <span className="text-gray-400 text-sm">Deadline</span>
                            <p className="text-white font-medium">{request.deadline || "Not specified"}</p>
                          </div>
                          <div className="glass rounded-lg p-4">
                            <span className="text-gray-400 text-sm">Tech Stack</span>
                            <p className="text-white font-medium text-sm">{request.tech_stack || "Not specified"}</p>
                          </div>
                        </div>

                        <div className="mb-6">
                          <h4 className="text-white font-medium mb-2 flex items-center">
                            <FileText className="w-4 h-4 mr-2 text-blue-400" />
                            Project Details
                          </h4>
                          <div className="glass rounded-lg p-4">
                            <p className="text-gray-300 leading-relaxed">{request.project_details}</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 transition-colors"
                            onClick={() => updateRequestStatus(request.id, "approved")}
                            disabled={!dbConnected}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 transition-colors"
                            onClick={() => updateRequestStatus(request.id, "in-progress")}
                            disabled={!dbConnected}
                          >
                            <Clock className="w-4 h-4 mr-2" />
                            Start Project
                          </Button>
                          <Button
                            size="sm"
                            className="bg-purple-600 hover:bg-purple-700 transition-colors"
                            onClick={() => updateRequestStatus(request.id, "completed")}
                            disabled={!dbConnected}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Complete
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-600 text-red-400 hover:border-red-500 hover:bg-red-500/10"
                            onClick={() => updateRequestStatus(request.id, "rejected")}
                            disabled={!dbConnected}
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-gray-600 text-gray-300 hover:border-blue-500 hover:text-blue-400"
                          >
                            <Mail className="w-4 h-4 mr-2" />
                            Contact Client
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {contactSubmissions.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      {dbConnected
                        ? "No contact submissions yet."
                        : "Database not connected. Set up Supabase to view submissions."}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
