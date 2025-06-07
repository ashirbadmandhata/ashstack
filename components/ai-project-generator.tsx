"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Wand2, RefreshCw, Copy, Check } from "lucide-react"

interface GeneratedContent {
  title: string
  description: string
  longDescription: string
  features: string[]
  techStack: string[]
  tags: string[]
  suggestedPrice: number
}

export function AIProjectGenerator() {
  const [loading, setLoading] = useState(false)
  const [prompt, setPrompt] = useState("")
  const [category, setCategory] = useState("")
  const [difficulty, setDifficulty] = useState("")
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  const generateContent = async () => {
    if (!prompt.trim()) {
      alert("Please enter a project description")
      return
    }

    setLoading(true)

    // Simulate AI generation (in a real app, you'd call an AI API like OpenAI)
    setTimeout(() => {
      const mockContent: GeneratedContent = {
        title: generateTitle(prompt, category),
        description: generateDescription(prompt),
        longDescription: generateLongDescription(prompt, category),
        features: generateFeatures(prompt, category),
        techStack: generateTechStack(category),
        tags: generateTags(prompt, category),
        suggestedPrice: generatePrice(category, difficulty),
      }

      setGeneratedContent(mockContent)
      setLoading(false)
    }, 2000)
  }

  const generateTitle = (prompt: string, category: string) => {
    const titles = {
      "Web Application": [
        "Advanced Dashboard Pro",
        "Smart Analytics Platform",
        "Modern Web Portal",
        "Interactive Dashboard Suite",
      ],
      "Mobile Application": [
        "Mobile Pro App",
        "Smart Mobile Solution",
        "Advanced Mobile Platform",
        "Mobile Innovation Hub",
      ],
      "AI/ML Project": [
        "AI-Powered Assistant",
        "Machine Learning Platform",
        "Intelligent Analytics Engine",
        "Smart AI Solution",
      ],
    }

    const categoryTitles = titles[category as keyof typeof titles] || ["Smart Digital Solution"]
    return categoryTitles[Math.floor(Math.random() * categoryTitles.length)]
  }

  const generateDescription = (prompt: string) => {
    return `A comprehensive solution that ${prompt.toLowerCase()}. Built with modern technologies and best practices for optimal performance and user experience.`
  }

  const generateLongDescription = (prompt: string, category: string) => {
    return `This ${category.toLowerCase()} provides a complete solution for ${prompt.toLowerCase()}. 
    
Features include advanced functionality, intuitive user interface, and robust performance optimization. The project is built using industry-standard technologies and follows modern development practices.

Perfect for businesses and developers looking to implement a professional-grade solution with minimal setup time. Includes comprehensive documentation, example implementations, and ongoing support.

The codebase is well-structured, thoroughly tested, and ready for production deployment. All components are modular and easily customizable to meet specific requirements.`
  }

  const generateFeatures = (prompt: string, category: string) => {
    const baseFeatures = [
      "Modern responsive design",
      "Cross-platform compatibility",
      "Real-time data synchronization",
      "Advanced security features",
      "Comprehensive documentation",
      "Easy customization options",
    ]

    const categoryFeatures = {
      "Web Application": [
        "Progressive Web App (PWA) support",
        "Server-side rendering (SSR)",
        "API integration capabilities",
        "Advanced routing system",
      ],
      "Mobile Application": [
        "Native performance optimization",
        "Offline functionality",
        "Push notification support",
        "Biometric authentication",
      ],
      "AI/ML Project": [
        "Machine learning algorithms",
        "Natural language processing",
        "Predictive analytics",
        "Model training capabilities",
      ],
    }

    return [...baseFeatures, ...(categoryFeatures[category as keyof typeof categoryFeatures] || [])].slice(0, 8)
  }

  const generateTechStack = (category: string) => {
    const stacks = {
      "Web Application": ["React", "Next.js", "TypeScript", "Tailwind CSS", "Node.js", "PostgreSQL"],
      "Mobile Application": ["React Native", "TypeScript", "Expo", "Firebase", "Redux"],
      "AI/ML Project": ["Python", "TensorFlow", "FastAPI", "NumPy", "Pandas", "Docker"],
      "UI Kit": ["React", "TypeScript", "Storybook", "Tailwind CSS", "Framer Motion"],
      "SaaS Platform": ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Stripe", "NextAuth"],
    }

    return stacks[category as keyof typeof stacks] || ["React", "TypeScript", "Node.js"]
  }

  const generateTags = (prompt: string, category: string) => {
    const baseTags = ["modern", "responsive", "professional"]
    const categoryTags = {
      "Web Application": ["web", "dashboard", "analytics"],
      "Mobile Application": ["mobile", "app", "native"],
      "AI/ML Project": ["ai", "machine-learning", "intelligent"],
      "UI Kit": ["ui", "components", "design-system"],
      "SaaS Platform": ["saas", "subscription", "business"],
    }

    return [
      ...baseTags,
      ...(categoryTags[category as keyof typeof categoryTags] || []),
      ...prompt.toLowerCase().split(" ").slice(0, 2),
    ].slice(0, 8)
  }

  const generatePrice = (category: string, difficulty: string) => {
    const basePrices = {
      "Web Application": 25000,
      "Mobile Application": 35000,
      "AI/ML Project": 45000,
      "UI Kit": 15000,
      "SaaS Platform": 55000,
    }

    const difficultyMultiplier = {
      Beginner: 0.7,
      Intermediate: 1.0,
      Advanced: 1.5,
      Expert: 2.0,
    }

    const basePrice = basePrices[category as keyof typeof basePrices] || 20000
    const multiplier = difficultyMultiplier[difficulty as keyof typeof difficultyMultiplier] || 1.0

    return Math.round(basePrice * multiplier)
  }

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(type)
      setTimeout(() => setCopied(null), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  return (
    <Card className="glass-card border-gray-700/50">
      <CardHeader>
        <CardTitle className="text-white flex items-center text-2xl">
          <Sparkles className="w-6 h-6 mr-3 text-yellow-400" />
          AI Project Generator
        </CardTitle>
        <p className="text-gray-400">Generate comprehensive project details using AI</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Input Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-gray-300 mb-2 block">Category</Label>
            <Select value={category} onValueChange={setCategory}>
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
            <Select value={difficulty} onValueChange={setDifficulty}>
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

        <div>
          <Label className="text-gray-300 mb-2 block">Project Description</Label>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe what you want to build... (e.g., 'a modern e-commerce dashboard with analytics and inventory management')"
            className="glass border-gray-600 text-white placeholder-gray-500 min-h-[100px]"
          />
        </div>

        <Button
          onClick={generateContent}
          disabled={loading || !prompt.trim() || !category}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 transition-all duration-300"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Generating with AI...
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4 mr-2" />
              Generate Project Details
            </>
          )}
        </Button>

        {/* Generated Content */}
        {generatedContent && (
          <div className="space-y-6 pt-6 border-t border-gray-700">
            <h3 className="text-xl font-bold text-white flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-yellow-400" />
              Generated Content
            </h3>

            {/* Title */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-gray-300 font-medium">Project Title</Label>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(generatedContent.title, "title")}
                  className="border-gray-600 text-gray-300 hover:border-blue-500"
                >
                  {copied === "title" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <div className="glass rounded-lg p-3">
                <p className="text-white font-semibold">{generatedContent.title}</p>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-gray-300 font-medium">Short Description</Label>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(generatedContent.description, "description")}
                  className="border-gray-600 text-gray-300 hover:border-blue-500"
                >
                  {copied === "description" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <div className="glass rounded-lg p-3">
                <p className="text-gray-300">{generatedContent.description}</p>
              </div>
            </div>

            {/* Long Description */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-gray-300 font-medium">Detailed Description</Label>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(generatedContent.longDescription, "longDescription")}
                  className="border-gray-600 text-gray-300 hover:border-blue-500"
                >
                  {copied === "longDescription" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <div className="glass rounded-lg p-3 max-h-40 overflow-y-auto">
                <p className="text-gray-300 whitespace-pre-line">{generatedContent.longDescription}</p>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-gray-300 font-medium">Key Features</Label>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(generatedContent.features.join("\n"), "features")}
                  className="border-gray-600 text-gray-300 hover:border-blue-500"
                >
                  {copied === "features" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <div className="glass rounded-lg p-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {generatedContent.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tech Stack */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-gray-300 font-medium">Tech Stack</Label>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(generatedContent.techStack.join(", "), "techStack")}
                  className="border-gray-600 text-gray-300 hover:border-blue-500"
                >
                  {copied === "techStack" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <div className="glass rounded-lg p-3">
                <div className="flex flex-wrap gap-2">
                  {generatedContent.techStack.map((tech, index) => (
                    <Badge key={index} className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-gray-300 font-medium">Tags</Label>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(generatedContent.tags.join(", "), "tags")}
                  className="border-gray-600 text-gray-300 hover:border-blue-500"
                >
                  {copied === "tags" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <div className="glass rounded-lg p-3">
                <div className="flex flex-wrap gap-2">
                  {generatedContent.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="bg-gray-800 text-gray-300">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Suggested Price */}
            <div className="space-y-2">
              <Label className="text-gray-300 font-medium">Suggested Price</Label>
              <div className="glass rounded-lg p-3">
                <p className="text-2xl font-bold text-green-400">
                  ₹{generatedContent.suggestedPrice.toLocaleString("en-IN")}
                </p>
                <p className="text-sm text-gray-500">Based on category and complexity</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                onClick={generateContent}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:border-purple-500"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Regenerate
              </Button>
              <Button
                onClick={() => {
                  // In a real app, you would populate the upload form with this data
                  alert("Generated content would be applied to the upload form!")
                }}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
              >
                Apply to Form
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
