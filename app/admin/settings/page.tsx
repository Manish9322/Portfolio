"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Check, Moon, Save, Sun, SunMoon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SettingsPage() {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const [generalSettings, setGeneralSettings] = useState({
    siteTitle: "Alex Morgan | Full Stack Developer",
    metaDescription: "Alex Morgan is a full stack developer specializing in building exceptional digital experiences.",
    favicon: "/favicon.ico",
    showContact: true,
    showResume: true,
    enableBlog: false,
  })

  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: "system",
    primaryColor: "blue",
    fontFamily: "inter",
    borderRadius: "medium",
    animations: true,
  })

  const [sidebarSettings, setSidebarSettings] = useState({
    defaultExpanded: true,
    position: "left",
    style: "default",
    showLabels: true,
    items: [
      { id: "dashboard", label: "Dashboard", enabled: true },
      { id: "profile", label: "Profile", enabled: true },
      { id: "projects", label: "Projects", enabled: true },
      { id: "skills", label: "Skills", enabled: true },
      { id: "experience", label: "Experience", enabled: true },
      { id: "settings", label: "Settings", enabled: true },
    ],
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    contactFormAlerts: true,
    portfolioViewAlerts: false,
    weeklyReports: true,
  })

  const handleGeneralChange = (e) => {
    const { name, value, type, checked } = e.target
    setGeneralSettings({
      ...generalSettings,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleAppearanceChange = (key, value) => {
    setAppearanceSettings({
      ...appearanceSettings,
      [key]: value,
    })
  }

  const handleSidebarItemToggle = (itemId, enabled) => {
    setSidebarSettings({
      ...sidebarSettings,
      items: sidebarSettings.items.map((item) => (item.id === itemId ? { ...item, enabled } : item)),
    })
  }

  const handleNotificationChange = (key, value) => {
    setNotificationSettings({
      ...notificationSettings,
      [key]: value,
    })
  }

  const handleSave = async () => {
    setIsSaving(true)
    setSaveSuccess(false)

    try {
      // In a real app, this would save to your database
      // await fetch('/api/settings', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     general: generalSettings,
      //     appearance: appearanceSettings,
      //     sidebar: sidebarSettings,
      //     notifications: notificationSettings,
      //   }),
      // })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setSaveSuccess(true)
    } catch (error) {
      console.error("Error saving settings:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleGoBack = () => {
    router.back()
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handleGoBack}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            "Saving..."
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" /> Save Settings
            </>
          )}
        </Button>
      </div>

      {saveSuccess && (
        <div className="rounded-md bg-green-50 p-4 text-green-800">
          <div className="flex">
            <Check className="h-5 w-5 text-green-400" />
            <div className="ml-3">
              <p className="text-sm font-medium">Settings saved successfully!</p>
            </div>
          </div>
        </div>
      )}

      <Tabs defaultValue="general">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="sidebar">Sidebar</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure your portfolio website settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="siteTitle">Site Title</Label>
                <Input
                  id="siteTitle"
                  name="siteTitle"
                  value={generalSettings.siteTitle}
                  onChange={handleGeneralChange}
                />
                <p className="text-xs text-muted-foreground">This appears in browser tabs and search engine results.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  name="metaDescription"
                  value={generalSettings.metaDescription}
                  onChange={handleGeneralChange}
                  className="min-h-[80px]"
                />
                <p className="text-xs text-muted-foreground">
                  A brief description of your portfolio for search engines (150-160 characters recommended).
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="favicon">Favicon URL</Label>
                <Input id="favicon" name="favicon" value={generalSettings.favicon} onChange={handleGeneralChange} />
              </div>
              <div className="space-y-4 pt-4">
                <h3 className="text-sm font-medium">Features</h3>
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <Label htmlFor="showContact">Show Contact Information</Label>
                    <p className="text-xs text-muted-foreground">Display your contact details on your portfolio</p>
                  </div>
                  <Switch
                    id="showContact"
                    name="showContact"
                    checked={generalSettings.showContact}
                    onCheckedChange={(checked) => setGeneralSettings({ ...generalSettings, showContact: checked })}
                  />
                </div>
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <Label htmlFor="showResume">Show Resume Download</Label>
                    <p className="text-xs text-muted-foreground">Allow visitors to download your resume</p>
                  </div>
                  <Switch
                    id="showResume"
                    name="showResume"
                    checked={generalSettings.showResume}
                    onCheckedChange={(checked) => setGeneralSettings({ ...generalSettings, showResume: checked })}
                  />
                </div>
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <Label htmlFor="enableBlog">Enable Blog Section</Label>
                    <p className="text-xs text-muted-foreground">Add a blog section to your portfolio</p>
                  </div>
                  <Switch
                    id="enableBlog"
                    name="enableBlog"
                    checked={generalSettings.enableBlog}
                    onCheckedChange={(checked) => setGeneralSettings({ ...generalSettings, enableBlog: checked })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>Customize how your portfolio looks and feels</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Theme</Label>
                <RadioGroup
                  value={appearanceSettings.theme}
                  onValueChange={(value) => handleAppearanceChange("theme", value)}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="light" id="theme-light" />
                    <Label htmlFor="theme-light" className="flex items-center gap-1.5">
                      <Sun className="h-4 w-4" /> Light
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dark" id="theme-dark" />
                    <Label htmlFor="theme-dark" className="flex items-center gap-1.5">
                      <Moon className="h-4 w-4" /> Dark
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="system" id="theme-system" />
                    <Label htmlFor="theme-system" className="flex items-center gap-1.5">
                      <SunMoon className="h-4 w-4" /> System
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="primaryColor">Primary Color</Label>
                <Select
                  value={appearanceSettings.primaryColor}
                  onValueChange={(value) => handleAppearanceChange("primaryColor", value)}
                >
                  <SelectTrigger id="primaryColor">
                    <SelectValue placeholder="Select a color" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blue">Blue</SelectItem>
                    <SelectItem value="purple">Purple</SelectItem>
                    <SelectItem value="green">Green</SelectItem>
                    <SelectItem value="red">Red</SelectItem>
                    <SelectItem value="orange">Orange</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fontFamily">Font Family</Label>
                <Select
                  value={appearanceSettings.fontFamily}
                  onValueChange={(value) => handleAppearanceChange("fontFamily", value)}
                >
                  <SelectTrigger id="fontFamily">
                    <SelectValue placeholder="Select a font" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inter">Inter</SelectItem>
                    <SelectItem value="roboto">Roboto</SelectItem>
                    <SelectItem value="poppins">Poppins</SelectItem>
                    <SelectItem value="montserrat">Montserrat</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="borderRadius">Border Radius</Label>
                <Select
                  value={appearanceSettings.borderRadius}
                  onValueChange={(value) => handleAppearanceChange("borderRadius", value)}
                >
                  <SelectTrigger id="borderRadius">
                    <SelectValue placeholder="Select border radius" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <Label htmlFor="animations">Enable Animations</Label>
                  <p className="text-xs text-muted-foreground">Use animations throughout your portfolio</p>
                </div>
                <Switch
                  id="animations"
                  checked={appearanceSettings.animations}
                  onCheckedChange={(checked) => handleAppearanceChange("animations", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sidebar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sidebar Settings</CardTitle>
              <CardDescription>Configure your admin sidebar navigation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="sidebarPosition">Sidebar Position</Label>
                <RadioGroup
                  value={sidebarSettings.position}
                  onValueChange={(value) => setSidebarSettings({ ...sidebarSettings, position: value })}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="left" id="sidebar-left" />
                    <Label htmlFor="sidebar-left">Left</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="right" id="sidebar-right" />
                    <Label htmlFor="sidebar-right">Right</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sidebarStyle">Sidebar Style</Label>
                <Select
                  value={sidebarSettings.style}
                  onValueChange={(value) => setSidebarSettings({ ...sidebarSettings, style: value })}
                >
                  <SelectTrigger id="sidebarStyle">
                    <SelectValue placeholder="Select a style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="minimal">Minimal</SelectItem>
                    <SelectItem value="compact">Compact</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <Label htmlFor="defaultExpanded">Default Expanded</Label>
                  <p className="text-xs text-muted-foreground">Keep sidebar expanded by default</p>
                </div>
                <Switch
                  id="defaultExpanded"
                  checked={sidebarSettings.defaultExpanded}
                  onCheckedChange={(checked) => setSidebarSettings({ ...sidebarSettings, defaultExpanded: checked })}
                />
              </div>

              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <Label htmlFor="showLabels">Show Labels</Label>
                  <p className="text-xs text-muted-foreground">Show text labels next to icons</p>
                </div>
                <Switch
                  id="showLabels"
                  checked={sidebarSettings.showLabels}
                  onCheckedChange={(checked) => setSidebarSettings({ ...sidebarSettings, showLabels: checked })}
                />
              </div>

              <div className="space-y-2">
                <Label>Sidebar Items</Label>
                <p className="text-xs text-muted-foreground mb-2">Enable or disable items in your sidebar navigation</p>

                <div className="space-y-3">
                  {sidebarSettings.items.map((item) => (
                    <div key={item.id} className="flex flex-col md:flex-row items-center justify-between gap-4">
                      <Label htmlFor={`sidebar-item-${item.id}`}>{item.label}</Label>
                      <Switch
                        id={`sidebar-item-${item.id}`}
                        checked={item.enabled}
                        onCheckedChange={(checked) => handleSidebarItemToggle(item.id, checked)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <Label htmlFor="emailNotifications">Email Notifications</Label>
                  <p className="text-xs text-muted-foreground">Receive notifications via email</p>
                </div>
                <Switch
                  id="emailNotifications"
                  checked={notificationSettings.emailNotifications}
                  onCheckedChange={(checked) => handleNotificationChange("emailNotifications", checked)}
                />
              </div>

              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <Label htmlFor="contactFormAlerts">Contact Form Alerts</Label>
                  <p className="text-xs text-muted-foreground">Get notified when someone submits your contact form</p>
                </div>
                <Switch
                  id="contactFormAlerts"
                  checked={notificationSettings.contactFormAlerts}
                  onCheckedChange={(checked) => handleNotificationChange("contactFormAlerts", checked)}
                />
              </div>

              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <Label htmlFor="portfolioViewAlerts">Portfolio View Alerts</Label>
                  <p className="text-xs text-muted-foreground">
                    Get notified about significant traffic to your portfolio
                  </p>
                </div>
                <Switch
                  id="portfolioViewAlerts"
                  checked={notificationSettings.portfolioViewAlerts}
                  onCheckedChange={(checked) => handleNotificationChange("portfolioViewAlerts", checked)}
                />
              </div>

              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <Label htmlFor="weeklyReports">Weekly Reports</Label>
                  <p className="text-xs text-muted-foreground">
                    Receive weekly summary reports of your portfolio activity
                  </p>
                </div>
                <Switch
                  id="weeklyReports"
                  checked={notificationSettings.weeklyReports}
                  onCheckedChange={(checked) => handleNotificationChange("weeklyReports", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            "Saving..."
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" /> Save Settings
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
