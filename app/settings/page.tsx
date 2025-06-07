"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Settings, Bell, Shield, Palette, Trash2, AlertTriangle, Moon, Sun, Monitor } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export default function SettingsPage() {
  const { user, loading, isAdmin } = useAuth()
  const router = useRouter()
  const [settings, setSettings] = useState({
    // Notification Settings
    emailNotifications: true,
    pushNotifications: false,
    marketingEmails: false,
    projectUpdates: true,

    // Privacy Settings
    profileVisibility: "public",
    showPurchaseHistory: false,
    allowDataCollection: true,

    // Appearance Settings
    theme: "dark",
    language: "en",
    timezone: "UTC",

    // Download Settings
    autoDownload: false,
    downloadQuality: "high",

    // Admin Settings (only for admins)
    adminNotifications: true,
    systemAlerts: true,
    userAnalytics: true,
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth")
      return
    }
  }, [user, loading, router])

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleSaveSettings = () => {
    // In a real app, you would save these to the database
    console.log("Saving settings:", settings)
    alert("Settings saved successfully!")
  }

  const handleDeleteAccount = () => {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      // In a real app, you would handle account deletion
      alert("Account deletion requested. You will receive an email with further instructions.")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse text-white text-xl">Loading settings...</div>
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

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Settings</h1>
          <p className="text-gray-400">Manage your account preferences and privacy settings</p>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="glass-dark rounded-xl p-1 grid grid-cols-2 md:grid-cols-5 gap-1">
            <TabsTrigger
              value="general"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg"
            >
              <Settings className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">General</span>
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg"
            >
              <Bell className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger
              value="privacy"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg"
            >
              <Shield className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Privacy</span>
            </TabsTrigger>
            <TabsTrigger
              value="appearance"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg"
            >
              <Palette className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Appearance</span>
            </TabsTrigger>
            {isAdmin && (
              <TabsTrigger
                value="admin"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-600 data-[state=active]:text-white rounded-lg"
              >
                <Shield className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Admin</span>
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card className="glass-card border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Settings className="w-5 h-5 mr-2 text-blue-400" />
                  General Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-gray-300 mb-2 block">Language</Label>
                    <Select value={settings.language} onValueChange={(value) => handleSettingChange("language", value)}>
                      <SelectTrigger className="glass border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="glass-dark border-gray-600">
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="de">Deutsch</SelectItem>
                        <SelectItem value="hi">हिन्दी</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-gray-300 mb-2 block">Timezone</Label>
                    <Select value={settings.timezone} onValueChange={(value) => handleSettingChange("timezone", value)}>
                      <SelectTrigger className="glass border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="glass-dark border-gray-600">
                        <SelectItem value="UTC">UTC</SelectItem>
                        <SelectItem value="Asia/Kolkata">Asia/Kolkata (IST)</SelectItem>
                        <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                        <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                        <SelectItem value="Asia/Tokyo">Asia/Tokyo (JST)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label className="text-gray-300 mb-2 block">Download Quality</Label>
                  <Select
                    value={settings.downloadQuality}
                    onValueChange={(value) => handleSettingChange("downloadQuality", value)}
                  >
                    <SelectTrigger className="glass border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass-dark border-gray-600">
                      <SelectItem value="high">High Quality</SelectItem>
                      <SelectItem value="medium">Medium Quality</SelectItem>
                      <SelectItem value="low">Low Quality (Faster)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-gray-300 font-medium">Auto-download purchased items</Label>
                    <p className="text-sm text-gray-500">Automatically start downloads after purchase</p>
                  </div>
                  <Switch
                    checked={settings.autoDownload}
                    onCheckedChange={(checked) => handleSettingChange("autoDownload", checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card className="glass-card border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Bell className="w-5 h-5 mr-2 text-green-400" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-gray-300 font-medium">Email Notifications</Label>
                      <p className="text-sm text-gray-500">Receive important updates via email</p>
                    </div>
                    <Switch
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) => handleSettingChange("emailNotifications", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-gray-300 font-medium">Push Notifications</Label>
                      <p className="text-sm text-gray-500">Get instant notifications in your browser</p>
                    </div>
                    <Switch
                      checked={settings.pushNotifications}
                      onCheckedChange={(checked) => handleSettingChange("pushNotifications", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-gray-300 font-medium">Project Updates</Label>
                      <p className="text-sm text-gray-500">Notifications about new projects and updates</p>
                    </div>
                    <Switch
                      checked={settings.projectUpdates}
                      onCheckedChange={(checked) => handleSettingChange("projectUpdates", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-gray-300 font-medium">Marketing Emails</Label>
                      <p className="text-sm text-gray-500">Promotional content and special offers</p>
                    </div>
                    <Switch
                      checked={settings.marketingEmails}
                      onCheckedChange={(checked) => handleSettingChange("marketingEmails", checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-6">
            <Card className="glass-card border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-yellow-400" />
                  Privacy & Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-gray-300 mb-2 block">Profile Visibility</Label>
                  <Select
                    value={settings.profileVisibility}
                    onValueChange={(value) => handleSettingChange("profileVisibility", value)}
                  >
                    <SelectTrigger className="glass border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass-dark border-gray-600">
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                      <SelectItem value="friends">Friends Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-gray-300 font-medium">Show Purchase History</Label>
                      <p className="text-sm text-gray-500">Allow others to see your purchased projects</p>
                    </div>
                    <Switch
                      checked={settings.showPurchaseHistory}
                      onCheckedChange={(checked) => handleSettingChange("showPurchaseHistory", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-gray-300 font-medium">Data Collection</Label>
                      <p className="text-sm text-gray-500">Help improve our service with anonymous usage data</p>
                    </div>
                    <Switch
                      checked={settings.allowDataCollection}
                      onCheckedChange={(checked) => handleSettingChange("allowDataCollection", checked)}
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-red-400 font-medium">Delete Account</Label>
                      <p className="text-sm text-gray-500">Permanently delete your account and all data</p>
                    </div>
                    <Button
                      onClick={handleDeleteAccount}
                      variant="outline"
                      className="border-red-600 text-red-400 hover:bg-red-500/20"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-6">
            <Card className="glass-card border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Palette className="w-5 h-5 mr-2 text-purple-400" />
                  Appearance & Display
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-gray-300 mb-4 block">Theme</Label>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { value: "light", label: "Light", icon: Sun },
                      { value: "dark", label: "Dark", icon: Moon },
                      { value: "system", label: "System", icon: Monitor },
                    ].map((theme) => {
                      const Icon = theme.icon
                      return (
                        <button
                          key={theme.value}
                          onClick={() => handleSettingChange("theme", theme.value)}
                          className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                            settings.theme === theme.value
                              ? "border-blue-500 bg-blue-500/20"
                              : "border-gray-600 hover:border-gray-500"
                          }`}
                        >
                          <Icon className="w-6 h-6 mx-auto mb-2 text-gray-300" />
                          <p className="text-sm text-gray-300">{theme.label}</p>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {isAdmin && (
            <TabsContent value="admin" className="space-y-6">
              <Card className="glass-card border-purple-500/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-purple-400" />
                    Administrator Settings
                  </CardTitle>
                  <p className="text-gray-400">Advanced settings for platform administrators</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-gray-300 font-medium">Admin Notifications</Label>
                        <p className="text-sm text-gray-500">Receive notifications about admin activities</p>
                      </div>
                      <Switch
                        checked={settings.adminNotifications}
                        onCheckedChange={(checked) => handleSettingChange("adminNotifications", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-gray-300 font-medium">System Alerts</Label>
                        <p className="text-sm text-gray-500">Get alerts about system issues and maintenance</p>
                      </div>
                      <Switch
                        checked={settings.systemAlerts}
                        onCheckedChange={(checked) => handleSettingChange("systemAlerts", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-gray-300 font-medium">User Analytics</Label>
                        <p className="text-sm text-gray-500">Enable detailed user behavior analytics</p>
                      </div>
                      <Switch
                        checked={settings.userAnalytics}
                        onCheckedChange={(checked) => handleSettingChange("userAnalytics", checked)}
                      />
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-700">
                    <div className="flex items-center space-x-2 text-yellow-400 mb-4">
                      <AlertTriangle className="w-5 h-5" />
                      <span className="font-medium">Administrator Privileges</span>
                    </div>
                    <p className="text-sm text-gray-400">
                      As an administrator, you have access to advanced features including user management, system
                      analytics, and platform configuration. Use these privileges responsibly.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          <div className="flex justify-end space-x-4 pt-6">
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:border-gray-500">
              Reset to Defaults
            </Button>
            <Button
              onClick={handleSaveSettings}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              Save Settings
            </Button>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
