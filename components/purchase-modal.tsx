"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CreditCard, Shield, Download, CheckCircle, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/contexts/auth-context"

interface PurchaseModalProps {
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

export function PurchaseModal({ isOpen, onClose, project }: PurchaseModalProps) {
  const [processing, setProcessing] = useState(false)
  const [success, setSuccess] = useState(false)
  const { user } = useAuth()

  if (!project) return null

  const handlePurchase = async () => {
    if (!user) {
      alert("Please sign in to make a purchase")
      return
    }

    setProcessing(true)

    try {
      // In a real app, you would integrate with a payment processor like Stripe
      // For demo purposes, we'll simulate a successful payment

      // Create purchase record
      const { error } = await supabase.from("purchases").insert([
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
        },
      ])

      if (error) {
        console.error("Error creating purchase:", error)
        alert("Purchase failed. Please try again.")
      } else {
        // Update project download count
        await supabase.rpc("increment_downloads", { project_id: project.id })

        setSuccess(true)
        setTimeout(() => {
          setSuccess(false)
          onClose()
        }, 3000)
      }
    } catch (error) {
      console.error("Purchase error:", error)
      alert("Purchase failed. Please try again.")
    } finally {
      setProcessing(false)
    }
  }

  if (success) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Purchase Successful!</h3>
            <p className="text-gray-300 mb-4">You can now download {project.title} from your dashboard.</p>
            <Button
              onClick={onClose}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              Go to Dashboard
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Complete Purchase</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Project Info */}
          <div className="flex items-start space-x-4">
            <img
              src={project.images[0] || "/placeholder.svg?height=80&width=80"}
              alt={project.title}
              className="w-20 h-20 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{project.title}</h3>
              <p className="text-gray-400 text-sm">{project.category}</p>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 mt-2">{project.license}</Badge>
            </div>
          </div>

          <Separator className="bg-gray-700" />

          {/* Price Breakdown */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Project Price</span>
              <span className="text-white">₹{project.price.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Platform Fee</span>
              <span className="text-white">₹0</span>
            </div>
            <Separator className="bg-gray-700" />
            <div className="flex justify-between text-lg font-semibold">
              <span className="text-white">Total</span>
              <span className="text-white">₹{project.price.toLocaleString("en-IN")}</span>
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
                <span>Commercial license</span>
              </div>
            </div>
          </div>

          {/* Payment Button */}
          <div className="space-y-3">
            <Button
              onClick={handlePurchase}
              disabled={processing}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
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

            <p className="text-xs text-gray-500 text-center">
              By purchasing, you agree to our terms of service and privacy policy. This is a demo - no real payment will
              be processed.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
