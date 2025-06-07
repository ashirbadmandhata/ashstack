"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CreditCard, Shield, Download, CheckCircle, Loader2, User, MapPin } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"

interface PurchaseFlowProps {
  isOpen: boolean
  onClose: () => void
  project: {
    id: string
    title: string
    price: number
    images: string[]
    category: string
    license: string
  } | null
}

interface UserDetails {
  fullName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  country: string
  zipCode: string
  companyName?: string
  vatNumber?: string
}

export function PurchaseFlow({ isOpen, onClose, project }: PurchaseFlowProps) {
  const [step, setStep] = useState(1) // 1: Details, 2: Payment, 3: Success
  const [processing, setProcessing] = useState(false)
  const [licenseKey, setLicenseKey] = useState("")
  const { user } = useAuth()
  const { toast } = useToast()

  const [userDetails, setUserDetails] = useState<UserDetails>({
    fullName: "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
    companyName: "",
    vatNumber: "",
  })

  if (!project) return null

  const generateLicenseKey = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let result = ""
    for (let i = 0; i < 16; i++) {
      if (i > 0 && i % 4 === 0) result += "-"
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required fields
    if (!userDetails.fullName || !userDetails.email || !userDetails.phone || !userDetails.address) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setStep(2)
  }

  const handlePurchase = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to make a purchase",
        variant: "destructive",
      })
      return
    }

    setProcessing(true)

    try {
      // Generate license key
      const generatedLicenseKey = generateLicenseKey()
      setLicenseKey(generatedLicenseKey)

      // Create purchase record
      const { error: purchaseError } = await supabase.from("purchases").insert([
        {
          user_id: user.id,
          project_id: project.id,
          amount: project.price,
          currency: "INR",
          payment_status: "completed",
          payment_method: "card",
          transaction_id: `txn_${Date.now()}`,
          download_count: 0,
          max_downloads: 5,
          license_key: generatedLicenseKey,
          user_details: userDetails,
        },
      ])

      if (purchaseError) {
        console.error("Error creating purchase:", purchaseError)
        toast({
          title: "Purchase Failed",
          description: "Failed to process purchase. Please try again.",
          variant: "destructive",
        })
        return
      }

      // Update project download count
      const { error: updateError } = await supabase.rpc("increment_downloads", {
        project_id: project.id,
      })

      if (updateError) {
        console.warn("Failed to update download count:", updateError)
      }

      // Update user profile with purchase details
      const { error: profileError } = await supabase
        .from("user_profiles")
        .update({
          full_name: userDetails.fullName,
          phone: userDetails.phone,
          country: userDetails.country,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (profileError) {
        console.warn("Failed to update profile:", profileError)
      }

      setStep(3)
      toast({
        title: "Purchase Successful!",
        description: "Your license key has been generated and you can now download the project.",
      })
    } catch (error) {
      console.error("Purchase error:", error)
      toast({
        title: "Purchase Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setProcessing(false)
    }
  }

  const handleDownload = async () => {
    try {
      // In a real app, this would trigger the actual file download
      // For demo purposes, we'll just show a success message
      toast({
        title: "Download Started",
        description: "Your project files are being prepared for download.",
      })

      // Update download count
      await supabase
        .from("purchases")
        .update({
          download_count: supabase.sql`download_count + 1`,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user?.id)
        .eq("project_id", project.id)
    } catch (error) {
      console.error("Download error:", error)
      toast({
        title: "Download Failed",
        description: "Failed to start download. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleClose = () => {
    setStep(1)
    setLicenseKey("")
    setUserDetails({
      fullName: "",
      email: user?.email || "",
      phone: "",
      address: "",
      city: "",
      state: "",
      country: "",
      zipCode: "",
      companyName: "",
      vatNumber: "",
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center space-x-2">
            {step === 1 && <User className="w-6 h-6 text-blue-400" />}
            {step === 2 && <CreditCard className="w-6 h-6 text-green-400" />}
            {step === 3 && <CheckCircle className="w-6 h-6 text-green-400" />}
            <span>
              {step === 1 && "Your Details"}
              {step === 2 && "Complete Purchase"}
              {step === 3 && "Purchase Complete"}
            </span>
          </DialogTitle>
        </DialogHeader>

        {/* Step 1: User Details */}
        {step === 1 && (
          <form onSubmit={handleDetailsSubmit} className="space-y-6">
            {/* Project Info */}
            <div className="flex items-start space-x-4 p-4 glass rounded-lg">
              <img
                src={project.images[0] || "/placeholder.svg?height=80&width=80"}
                alt={project.title}
                className="w-20 h-20 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{project.title}</h3>
                <p className="text-gray-400 text-sm">{project.category}</p>
                <div className="flex items-center justify-between mt-2">
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">{project.license}</Badge>
                  <span className="text-2xl font-bold text-green-400">₹{project.price.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>

            <Separator className="bg-gray-700" />

            {/* Personal Information */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-400" />
                Personal Information
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300">Full Name *</Label>
                  <Input
                    value={userDetails.fullName}
                    onChange={(e) => setUserDetails({ ...userDetails, fullName: e.target.value })}
                    className="glass border-gray-600 text-white"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Email *</Label>
                  <Input
                    type="email"
                    value={userDetails.email}
                    onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
                    className="glass border-gray-600 text-white"
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300">Phone Number *</Label>
                  <Input
                    value={userDetails.phone}
                    onChange={(e) => setUserDetails({ ...userDetails, phone: e.target.value })}
                    className="glass border-gray-600 text-white"
                    placeholder="+91 9876543210"
                    required
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Country *</Label>
                  <Select
                    value={userDetails.country}
                    onValueChange={(value) => setUserDetails({ ...userDetails, country: value })}
                  >
                    <SelectTrigger className="glass border-gray-600 text-white">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent className="glass-dark border-gray-600">
                      <SelectItem value="IN">India</SelectItem>
                      <SelectItem value="US">United States</SelectItem>
                      <SelectItem value="UK">United Kingdom</SelectItem>
                      <SelectItem value="CA">Canada</SelectItem>
                      <SelectItem value="AU">Australia</SelectItem>
                      <SelectItem value="DE">Germany</SelectItem>
                      <SelectItem value="FR">France</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-green-400" />
                Address Information
              </h4>

              <div>
                <Label className="text-gray-300">Address *</Label>
                <Textarea
                  value={userDetails.address}
                  onChange={(e) => setUserDetails({ ...userDetails, address: e.target.value })}
                  className="glass border-gray-600 text-white"
                  placeholder="Street address, apartment, suite, etc."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-gray-300">City</Label>
                  <Input
                    value={userDetails.city}
                    onChange={(e) => setUserDetails({ ...userDetails, city: e.target.value })}
                    className="glass border-gray-600 text-white"
                    placeholder="Mumbai"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">State</Label>
                  <Input
                    value={userDetails.state}
                    onChange={(e) => setUserDetails({ ...userDetails, state: e.target.value })}
                    className="glass border-gray-600 text-white"
                    placeholder="Maharashtra"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">ZIP Code</Label>
                  <Input
                    value={userDetails.zipCode}
                    onChange={(e) => setUserDetails({ ...userDetails, zipCode: e.target.value })}
                    className="glass border-gray-600 text-white"
                    placeholder="400001"
                  />
                </div>
              </div>
            </div>

            {/* Optional Business Information */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Business Information (Optional)</h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300">Company Name</Label>
                  <Input
                    value={userDetails.companyName}
                    onChange={(e) => setUserDetails({ ...userDetails, companyName: e.target.value })}
                    className="glass border-gray-600 text-white"
                    placeholder="Your Company Ltd."
                  />
                </div>
                <div>
                  <Label className="text-gray-300">VAT/Tax Number</Label>
                  <Input
                    value={userDetails.vatNumber}
                    onChange={(e) => setUserDetails({ ...userDetails, vatNumber: e.target.value })}
                    className="glass border-gray-600 text-white"
                    placeholder="VAT123456789"
                  />
                </div>
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1 glass border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                Continue to Payment
              </Button>
            </div>
          </form>
        )}

        {/* Step 2: Payment */}
        {step === 2 && (
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Order Summary</h4>
              <div className="glass rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Project</span>
                  <span className="text-white">{project.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">License</span>
                  <span className="text-white">{project.license}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Price</span>
                  <span className="text-white">₹{project.price.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Tax</span>
                  <span className="text-white">₹0</span>
                </div>
                <Separator className="bg-gray-700" />
                <div className="flex justify-between text-lg font-semibold">
                  <span className="text-white">Total</span>
                  <span className="text-green-400">₹{project.price.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>

            {/* Billing Information */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Billing Information</h4>
              <div className="glass rounded-lg p-4 space-y-2">
                <p className="text-white font-medium">{userDetails.fullName}</p>
                <p className="text-gray-400">{userDetails.email}</p>
                <p className="text-gray-400">{userDetails.phone}</p>
                <p className="text-gray-400">
                  {userDetails.address}, {userDetails.city}, {userDetails.state} {userDetails.zipCode}
                </p>
                <p className="text-gray-400">{userDetails.country}</p>
              </div>
            </div>

            {/* What's Included */}
            <div className="space-y-3">
              <h4 className="font-semibold text-white">What's included:</h4>
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex items-center space-x-2">
                  <Download className="w-4 h-4 text-green-400" />
                  <span>Complete source code</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Download className="w-4 h-4 text-green-400" />
                  <span>Documentation & setup guide</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Download className="w-4 h-4 text-green-400" />
                  <span>5 downloads included</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span>Commercial license with unique license key</span>
                </div>
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
                className="flex-1 glass border-gray-600 text-gray-300 hover:bg-gray-700"
                disabled={processing}
              >
                Back
              </Button>
              <Button
                onClick={handlePurchase}
                disabled={processing}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
              >
                {processing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Complete Purchase
                  </>
                )}
              </Button>
            </div>

            <p className="text-xs text-gray-500 text-center">
              By purchasing, you agree to our terms of service and privacy policy. This is a demo - no real payment will
              be processed.
            </p>
          </div>
        )}

        {/* Step 3: Success */}
        {step === 3 && (
          <div className="text-center space-y-6">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            <div>
              <h3 className="text-2xl font-bold mb-2">Purchase Successful!</h3>
              <p className="text-gray-300 mb-4">
                Thank you for your purchase! Your license key has been generated and you can now download the project.
              </p>
            </div>

            {/* License Key */}
            <div className="glass rounded-lg p-4 space-y-3">
              <h4 className="font-semibold text-white">Your License Key</h4>
              <div className="bg-gray-800 rounded p-3 font-mono text-green-400 text-lg tracking-wider">
                {licenseKey}
              </div>
              <p className="text-xs text-gray-500">
                Save this license key - you'll need it for commercial use of this project.
              </p>
            </div>

            {/* Download Section */}
            <div className="space-y-3">
              <Button
                onClick={handleDownload}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Project Files
              </Button>
              <Button
                onClick={() => {
                  handleClose()
                  window.location.href = "/dashboard"
                }}
                variant="outline"
                className="w-full glass border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Go to Dashboard
              </Button>
            </div>

            <p className="text-xs text-gray-500">You can also access your downloads anytime from your dashboard.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
