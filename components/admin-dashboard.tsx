"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  BarChart,
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
} from "lucide-react"

// Mock data
const stats = {
  totalSales: "$45,231",
  activeUsers: "2,345",
  totalAssets: "156",
  conversionRate: "3.2%",
}

const recentOrders = [
  { id: "ORD-001", customer: "John Doe", product: "E-commerce Dashboard", amount: "$299", status: "completed" },
  { id: "ORD-002", customer: "Jane Smith", product: "AI Chat Assistant", amount: "$199", status: "pending" },
  { id: "ORD-003", customer: "Mike Johnson", product: "Mobile Banking App", amount: "$399", status: "completed" },
]

const customRequests = [
  {
    id: "REQ-001",
    name: "Sarah Wilson",
    email: "sarah@example.com",
    projectType: "Web Application",
    status: "pending",
    budget: "$5,000 - $10,000",
    deadline: "2024-02-15",
  },
  {
    id: "REQ-002",
    name: "David Chen",
    email: "david@example.com",
    projectType: "Mobile App",
    status: "in-progress",
    budget: "$10,000 - $25,000",
    deadline: "2024-03-01",
  },
]

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("analytics")

  return (
    <main className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Manage your digital asset store</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-gray-800 border-gray-700">
            <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-600">
              <BarChart className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="upload" className="data-[state=active]:bg-blue-600">
              <Upload className="w-4 h-4 mr-2" />
              Upload Assets
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-blue-600">
              <Users className="w-4 h-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="requests" className="data-[state=active]:bg-blue-600">
              <Settings className="w-4 h-4 mr-2" />
              Custom Requests
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Total Sales</CardTitle>
                  <DollarSign className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stats.totalSales}</div>
                  <p className="text-xs text-green-500">+12% from last month</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Active Users</CardTitle>
                  <Users className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stats.activeUsers}</div>
                  <p className="text-xs text-blue-500">+8% from last month</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Total Assets</CardTitle>
                  <Package className="h-4 w-4 text-purple-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stats.totalAssets}</div>
                  <p className="text-xs text-purple-500">+5 new this week</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Conversion Rate</CardTitle>
                  <BarChart className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stats.conversionRate}</div>
                  <p className="text-xs text-orange-500">+0.3% from last month</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Orders */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg">
                      <div>
                        <p className="text-white font-medium">{order.customer}</p>
                        <p className="text-gray-400 text-sm">{order.product}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-bold">{order.amount}</p>
                        <Badge variant={order.status === "completed" ? "default" : "secondary"}>{order.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="upload" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Upload New Asset</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title" className="text-gray-300">
                      Title
                    </Label>
                    <Input id="title" className="bg-gray-900 border-gray-600 text-white" />
                  </div>
                  <div>
                    <Label htmlFor="price" className="text-gray-300">
                      Price
                    </Label>
                    <Input id="price" type="number" className="bg-gray-900 border-gray-600 text-white" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="category" className="text-gray-300">
                    Category
                  </Label>
                  <Select>
                    <SelectTrigger className="bg-gray-900 border-gray-600 text-white">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="web-app">Web Application</SelectItem>
                      <SelectItem value="mobile-app">Mobile Application</SelectItem>
                      <SelectItem value="ui-kit">UI Kit</SelectItem>
                      <SelectItem value="saas">SaaS Template</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="description" className="text-gray-300">
                    Description
                  </Label>
                  <Textarea id="description" className="bg-gray-900 border-gray-600 text-white" />
                </div>

                <div>
                  <Label htmlFor="tags" className="text-gray-300">
                    Tags (comma separated)
                  </Label>
                  <Input
                    id="tags"
                    placeholder="React, Next.js, Tailwind"
                    className="bg-gray-900 border-gray-600 text-white"
                  />
                </div>

                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  Upload Asset
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                          {order.customer.charAt(0)}
                        </div>
                        <div>
                          <p className="text-white font-medium">{order.customer}</p>
                          <p className="text-gray-400 text-sm">Last purchase: {order.product}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="border-gray-600 text-gray-300">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="border-gray-600 text-gray-300">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="border-red-600 text-red-400">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="requests" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Custom Project Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {customRequests.map((request) => (
                    <div key={request.id} className="p-6 bg-gray-900/50 rounded-lg border border-gray-700">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-white font-semibold">{request.name}</h3>
                          <p className="text-gray-400 text-sm">{request.email}</p>
                        </div>
                        <Badge
                          variant={
                            request.status === "pending"
                              ? "secondary"
                              : request.status === "in-progress"
                                ? "default"
                                : "outline"
                          }
                          className={
                            request.status === "pending"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : request.status === "in-progress"
                                ? "bg-blue-500/20 text-blue-400"
                                : ""
                          }
                        >
                          {request.status === "in-progress" ? (
                            <Clock className="w-3 h-3 mr-1" />
                          ) : request.status === "pending" ? (
                            <Clock className="w-3 h-3 mr-1" />
                          ) : (
                            <CheckCircle className="w-3 h-3 mr-1" />
                          )}
                          {request.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
                        <div>
                          <span className="text-gray-400">Project Type:</span>
                          <p className="text-white">{request.projectType}</p>
                        </div>
                        <div>
                          <span className="text-gray-400">Budget:</span>
                          <p className="text-white">{request.budget}</p>
                        </div>
                        <div>
                          <span className="text-gray-400">Deadline:</span>
                          <p className="text-white">{request.deadline}</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                        <Button size="sm" variant="outline" className="border-gray-600 text-gray-300">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button size="sm" variant="outline" className="border-red-600 text-red-400">
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
