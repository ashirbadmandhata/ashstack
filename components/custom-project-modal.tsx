"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface CustomProjectModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CustomProjectModal({ isOpen, onClose }: CustomProjectModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    projectType: "",
    techStack: "",
    projectDetails: "",
    budget: "",
    deadline: "",
  })
  const [showThankYou, setShowThankYou] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const { error } = await supabase.from("contact_submissions").insert([
        {
          name: formData.name,
          email: formData.email,
          project_type: formData.projectType,
          tech_stack: formData.techStack,
          project_details: formData.projectDetails,
          budget: formData.budget,
          deadline: formData.deadline,
          status: "pending",
          priority: "medium",
        },
      ])

      if (error) {
        console.error("Error submitting form:", error)
        alert("There was an error submitting your request. Please try again.")
      } else {
        setShowThankYou(true)
        setTimeout(() => {
          setShowThankYou(false)
          onClose()
          setFormData({
            name: "",
            email: "",
            projectType: "",
            techStack: "",
            projectDetails: "",
            budget: "",
            deadline: "",
          })
        }, 3000)
      }
    } catch (error) {
      console.error("Error:", error)
      alert("There was an error submitting your request. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (showThankYou) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Thank You!</h3>
            <p className="text-gray-300">
              Your custom project request has been submitted successfully. We'll get back to you within 24 hours.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Request Custom Project
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="text-gray-300">
                Name *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-gray-800 border-gray-600 text-white"
                required
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-gray-300">
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-gray-800 border-gray-600 text-white"
                required
              />
            </div>
          </div>

          <div>
            <Label className="text-gray-300">Project Type *</Label>
            <Select
              value={formData.projectType}
              onValueChange={(value) => setFormData({ ...formData, projectType: value })}
            >
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                <SelectValue placeholder="Select project type" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="web-app">Web Application</SelectItem>
                <SelectItem value="mobile-app">Mobile Application</SelectItem>
                <SelectItem value="ai-ml">AI/ML Project</SelectItem>
                <SelectItem value="saas">SaaS Platform</SelectItem>
                <SelectItem value="api">API Development</SelectItem>
                <SelectItem value="ui-kit">UI Kit/Template</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="techStack" className="text-gray-300">
              Tech Stack
            </Label>
            <Input
              id="techStack"
              value={formData.techStack}
              onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
              placeholder="e.g., React, Node.js, Python, MongoDB"
              className="bg-gray-800 border-gray-600 text-white"
            />
          </div>

          <div>
            <Label htmlFor="projectDetails" className="text-gray-300">
              Project Details *
            </Label>
            <Textarea
              id="projectDetails"
              value={formData.projectDetails}
              onChange={(e) => setFormData({ ...formData, projectDetails: e.target.value })}
              placeholder="Describe your project requirements, features, and any specific needs..."
              className="bg-gray-800 border-gray-600 text-white min-h-[120px]"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="budget" className="text-gray-300">
                Budget (Optional)
              </Label>
              <Select value={formData.budget} onValueChange={(value) => setFormData({ ...formData, budget: value })}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue placeholder="Select budget range" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="under-83k">Under ₹83,000</SelectItem>
                  <SelectItem value="83k-415k">₹83,000 - ₹4,15,000</SelectItem>
                  <SelectItem value="415k-830k">₹4,15,000 - ₹8,30,000</SelectItem>
                  <SelectItem value="830k-2075k">₹8,30,000 - ₹20,75,000</SelectItem>
                  <SelectItem value="2075k-plus">₹20,75,000+</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="deadline" className="text-gray-300">
                Deadline (Optional)
              </Label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Request"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
