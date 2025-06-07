"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function RealTimeCharts() {
  const [salesData, setSalesData] = useState([
    { name: "Jan", sales: 4000, revenue: 2400 },
    { name: "Feb", sales: 3000, revenue: 1398 },
    { name: "Mar", sales: 2000, revenue: 9800 },
    { name: "Apr", sales: 2780, revenue: 3908 },
    { name: "May", sales: 1890, revenue: 4800 },
    { name: "Jun", sales: 2390, revenue: 3800 },
  ])

  const [categoryData, setCategoryData] = useState([
    { name: "Web Apps", value: 400, color: "#3b82f6" },
    { name: "Mobile Apps", value: 300, color: "#8b5cf6" },
    { name: "AI/ML", value: 200, color: "#10b981" },
    { name: "SaaS", value: 150, color: "#f59e0b" },
    { name: "UI Kits", value: 100, color: "#ef4444" },
  ])

  const [realtimeData, setRealtimeData] = useState([
    { time: "00:00", users: 120 },
    { time: "04:00", users: 80 },
    { time: "08:00", users: 200 },
    { time: "12:00", users: 350 },
    { time: "16:00", users: 280 },
    { time: "20:00", users: 180 },
  ])

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update sales data
      setSalesData((prev) =>
        prev.map((item) => ({
          ...item,
          sales: Math.max(1000, item.sales + Math.floor(Math.random() * 100) - 50),
          revenue: Math.max(500, item.revenue + Math.floor(Math.random() * 200) - 100),
        })),
      )

      // Update category data
      setCategoryData((prev) =>
        prev.map((item) => ({
          ...item,
          value: Math.max(50, item.value + Math.floor(Math.random() * 20) - 10),
        })),
      )

      // Update realtime data
      setRealtimeData((prev) => {
        const newData = [...prev]
        const currentTime = new Date()
        const timeString = currentTime.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
        })

        newData.push({
          time: timeString,
          users: Math.floor(Math.random() * 400) + 50,
        })

        return newData.slice(-6) // Keep only last 6 data points
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  // Calculate max values for scaling
  const maxSales = Math.max(...salesData.map((d) => d.sales))
  const maxRevenue = Math.max(...salesData.map((d) => d.revenue))
  const maxUsers = Math.max(...realtimeData.map((d) => d.users))
  const totalCategoryValue = categoryData.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Sales Chart */}
      <Card className="glass-card border-gray-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            📊 Sales & Revenue Trends
            <div className="ml-auto w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-end justify-between gap-2 p-4">
            {salesData.map((item, index) => (
              <div key={item.name} className="flex flex-col items-center flex-1">
                <div className="flex gap-1 items-end h-40 mb-2">
                  {/* Sales Bar */}
                  <div
                    className="bg-gradient-to-t from-blue-500 to-blue-400 rounded-t transition-all duration-500 w-4"
                    style={{
                      height: `${(item.sales / maxSales) * 100}%`,
                      minHeight: "8px",
                    }}
                    title={`Sales: ${item.sales}`}
                  ></div>
                  {/* Revenue Bar */}
                  <div
                    className="bg-gradient-to-t from-purple-500 to-purple-400 rounded-t transition-all duration-500 w-4"
                    style={{
                      height: `${(item.revenue / maxRevenue) * 100}%`,
                      minHeight: "8px",
                    }}
                    title={`Revenue: ${item.revenue}`}
                  ></div>
                </div>
                <span className="text-gray-400 text-xs">{item.name}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span className="text-gray-400 text-sm">Sales</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded"></div>
              <span className="text-gray-400 text-sm">Revenue</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Distribution */}
      <Card className="glass-card border-gray-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            🎯 Category Distribution
            <div className="ml-auto w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            {categoryData.map((item, index) => {
              const percentage = (item.value / totalCategoryValue) * 100
              return (
                <div key={item.name} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm">{item.name}</span>
                    <span className="text-white font-medium">{percentage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: item.color,
                      }}
                    ></div>
                  </div>
                  <div className="text-gray-400 text-xs">{item.value} items</div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Real-time Users */}
      <Card className="glass-card border-gray-700/50 lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            ⚡ Real-time Active Users
            <div className="ml-auto flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-400">Live</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 flex items-end justify-between gap-4 p-4">
            {realtimeData.map((item, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div
                  className="bg-gradient-to-t from-cyan-500 to-cyan-400 rounded-t transition-all duration-500 w-8 relative group"
                  style={{
                    height: `${(item.users / maxUsers) * 100}%`,
                    minHeight: "8px",
                  }}
                >
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {item.users} users
                  </div>
                </div>
                <span className="text-gray-400 text-xs mt-2">{item.time}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <span className="text-gray-400 text-sm">
              Current:{" "}
              <span className="text-cyan-400 font-medium">{realtimeData[realtimeData.length - 1]?.users || 0}</span>{" "}
              active users
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
