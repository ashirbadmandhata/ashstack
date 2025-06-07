"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Download, Heart, ShoppingCart, User, Package, Star, CreditCard, Settings, Eye } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

interface Purchase {
  id: string
  project_id: string
  amount: number
  payment_status: string
  download_count: number
  max_downloads: number
  created_at: string
  projects: {
    title: string
    images: string[]
    category: string
  }
}

interface WishlistItem {
  id: string
  project_id: string
  projects: {
    title: string
    price: number
    images: string[]
    category: string
  }
}

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])
  const [stats, setStats] = useState({
    totalPurchases: 0,
    totalSpent: 0,
    totalDownloads: 0,
    wishlistItems: 0,
  })
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth")
      return
    }

    if (user) {
      fetchUserData()
    }
  }, [user, loading, router])

  const fetchUserData = async () => {
    if (!user) return

    try {
      // Fetch purchases
      const { data: purchasesData, error: purchasesError } = await supabase
        .from("purchases")
        .select(`
          *,
          projects (
            title,
            images,
            category
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (!purchasesError && purchasesData) {
        setPurchases(purchasesData)
      }

      // Fetch wishlist
      const { data: wishlistData, error: wishlistError } = await supabase
        .from("wishlist")
        .select(`
          *,
          projects (
            title,
            price,
            images,
            category
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (!wishlistError && wishlistData) {
        setWishlist(wishlistData)
      }

      // Calculate stats
      if (purchasesData) {
        const totalSpent = purchasesData.reduce((sum, purchase) => sum + purchase.amount, 0)
        const totalDownloads = purchasesData.reduce((sum, purchase) => sum + purchase.download_count, 0)

        setStats({
          totalPurchases: purchasesData.length,
          totalSpent,
          totalDownloads,
          wishlistItems: wishlistData?.length || 0,
        })
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
    }
  }

  const handleDownload = async (purchaseId: string, projectId: string) => {
    try {
      // Update download count
      const { error } = await supabase
        .from("purchases")
        .update({
          download_count: supabase.sql`download_count + 1`,
          updated_at: new Date().toISOString(),
        })
        .eq("id", purchaseId)

      if (!error) {
        // Refresh data
        fetchUserData()
        // Here you would typically trigger the actual file download
        alert("Download started! (In a real app, this would download the files)")
      }
    } catch (error) {
      console.error("Error updating download count:", error)
    }
  }

  const removeFromWishlist = async (wishlistId: string) => {
    try {
      const { error } = await supabase.from("wishlist").delete().eq("id", wishlistId)

      if (!error) {
        fetchUserData()
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse text-white text-xl">Loading dashboard...</div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-950 pt-20">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-cyan-500/5"></div>
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  Welcome back, {user.user_metadata?.full_name || user.email}!
                </h1>
                <p className="text-gray-400">Manage your digital assets and track your progress</p>
              </div>
              <div className="hidden md:block">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {(user.user_metadata?.full_name || user.email || "U").charAt(0).toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: "Total Purchases",
              value: stats.totalPurchases,
              icon: Package,
              color: "from-blue-500 to-cyan-600",
              suffix: "",
            },
            {
              title: "Total Spent",
              value: stats.totalSpent,
              icon: CreditCard,
              color: "from-green-500 to-emerald-600",
              prefix: "₹",
              format: true,
            },
            {
              title: "Downloads",
              value: stats.totalDownloads,
              icon: Download,
              color: "from-purple-500 to-pink-600",
              suffix: "",
            },
            {
              title: "Wishlist Items",
              value: stats.wishlistItems,
              icon: Heart,
              color: "from-orange-500 to-red-600",
              suffix: "",
            },
          ].map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <Card
                key={index}
                className="glass-card border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 group hover:scale-105"
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">{stat.title}</CardTitle>
                  <div
                    className={`p-2 rounded-lg bg-gradient-to-r ${stat.color} group-hover:scale-110 transition-transform`}
                  >
                    <IconComponent className="h-4 w-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {stat.prefix || ""}
                    {stat.format ? stat.value.toLocaleString("en-IN") : stat.value}
                    {stat.suffix || ""}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="glass-dark rounded-xl p-1 grid grid-cols-2 md:grid-cols-4 gap-1">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg transition-all duration-300"
            >
              <User className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger
              value="purchases"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg transition-all duration-300"
            >
              <Package className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Purchases</span>
            </TabsTrigger>
            <TabsTrigger
              value="wishlist"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg transition-all duration-300"
            >
              <Heart className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Wishlist</span>
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg transition-all duration-300"
            >
              <Settings className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Purchases */}
              <Card className="glass-card border-gray-700/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Package className="w-5 h-5 mr-2 text-blue-400" />
                    Recent Purchases
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {purchases.slice(0, 3).map((purchase) => (
                      <div key={purchase.id} className="flex items-center justify-between p-4 glass rounded-lg">
                        <div className="flex items-center space-x-3">
                          <img
                            src={purchase.projects.images[0] || "/placeholder.svg?height=40&width=40"}
                            alt={purchase.projects.title}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                          <div>
                            <p className="text-white font-medium text-sm">{purchase.projects.title}</p>
                            <p className="text-gray-400 text-xs">
                              {new Date(purchase.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                          ₹{purchase.amount.toLocaleString("en-IN")}
                        </Badge>
                      </div>
                    ))}
                    {purchases.length === 0 && (
                      <div className="text-center py-8 text-gray-400">
                        No purchases yet. Start exploring our projects!
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="glass-card border-gray-700/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Star className="w-5 h-5 mr-2 text-yellow-400" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Link href="/projects">
                      <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300">
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Browse Projects
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      className="w-full border-gray-600 text-gray-300 hover:border-blue-500 hover:text-blue-400"
                      onClick={() => setActiveTab("wishlist")}
                    >
                      <Heart className="w-4 h-4 mr-2" />
                      View Wishlist ({stats.wishlistItems})
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-gray-600 text-gray-300 hover:border-green-500 hover:text-green-400"
                      onClick={() => setActiveTab("purchases")}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      My Downloads
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="purchases" className="space-y-6">
            <Card className="glass-card border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center text-2xl">
                  <Package className="w-6 h-6 mr-3 text-blue-400" />
                  My Purchases
                </CardTitle>
                <p className="text-gray-400">Download and manage your purchased digital assets</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {purchases.map((purchase) => (
                    <div
                      key={purchase.id}
                      className="glass rounded-xl border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300"
                    >
                      <div className="p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                          <div className="flex items-start space-x-4 mb-4 lg:mb-0">
                            <img
                              src={purchase.projects.images[0] || "/placeholder.svg?height=60&width=60"}
                              alt={purchase.projects.title}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                            <div>
                              <h3 className="text-white font-semibold text-lg">{purchase.projects.title}</h3>
                              <p className="text-gray-400">{purchase.projects.category}</p>
                              <p className="text-gray-500 text-sm">
                                Purchased: {new Date(purchase.created_at).toLocaleDateString()}
                              </p>
                              <div className="flex items-center space-x-4 mt-2">
                                <Badge
                                  className={
                                    purchase.payment_status === "completed"
                                      ? "bg-green-500/20 text-green-400 border-green-500/30"
                                      : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                                  }
                                >
                                  {purchase.payment_status}
                                </Badge>
                                <span className="text-gray-400 text-sm">
                                  ₹{purchase.amount.toLocaleString("en-IN")}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col items-end space-y-3">
                            <div className="text-right">
                              <p className="text-gray-400 text-sm">Downloads</p>
                              <p className="text-white font-medium">
                                {purchase.download_count} / {purchase.max_downloads}
                              </p>
                              <Progress
                                value={(purchase.download_count / purchase.max_downloads) * 100}
                                className="w-24 h-2 mt-1"
                              />
                            </div>

                            <div className="flex space-x-2">
                              <Link href={`/project/${purchase.project_id}`}>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-gray-600 text-gray-300 hover:border-blue-500 hover:text-blue-400"
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  View
                                </Button>
                              </Link>

                              <Button
                                size="sm"
                                onClick={() => handleDownload(purchase.id, purchase.project_id)}
                                disabled={purchase.download_count >= purchase.max_downloads}
                                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {purchases.length === 0 && (
                    <div className="text-center py-16">
                      <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-white mb-2">No purchases yet</h3>
                      <p className="text-gray-400 mb-6">Start building your digital asset collection</p>
                      <Link href="/projects">
                        <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                          Browse Projects
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wishlist" className="space-y-6">
            <Card className="glass-card border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center text-2xl">
                  <Heart className="w-6 h-6 mr-3 text-red-400" />
                  My Wishlist
                </CardTitle>
                <p className="text-gray-400">Projects you want to purchase later</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wishlist.map((item) => (
                    <Card
                      key={item.id}
                      className="glass-card border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 group"
                    >
                      <div className="relative overflow-hidden rounded-t-xl">
                        <img
                          src={item.projects.images[0] || "/placeholder.svg?height=200&width=300"}
                          alt={item.projects.title}
                          className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="text-white font-semibold mb-2">{item.projects.title}</h3>
                        <p className="text-gray-400 text-sm mb-3">{item.projects.category}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-bold text-white">
                            ₹{item.projects.price.toLocaleString("en-IN")}
                          </span>
                          <div className="flex space-x-2">
                            <Link href={`/project/${item.project_id}`}>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-gray-600 text-gray-300 hover:border-blue-500 hover:text-blue-400"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </Link>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => removeFromWishlist(item.id)}
                              className="border-gray-600 text-gray-300 hover:border-red-500 hover:text-red-400"
                            >
                              <Heart className="w-4 h-4 fill-current" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {wishlist.length === 0 && (
                  <div className="text-center py-16">
                    <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">Your wishlist is empty</h3>
                    <p className="text-gray-400 mb-6">Add projects you're interested in to your wishlist</p>
                    <Link href="/projects">
                      <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                        Explore Projects
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="glass-card border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center text-2xl">
                  <Settings className="w-6 h-6 mr-3 text-gray-400" />
                  Account Settings
                </CardTitle>
                <p className="text-gray-400">Manage your account preferences</p>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-400">Account settings coming soon...</div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
