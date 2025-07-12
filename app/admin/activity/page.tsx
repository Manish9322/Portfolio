"use client"

import { Label } from "@/components/ui/label"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Calendar,
  Clock,
  Edit,
  Eye,
  Filter,
  MessageSquare,
  Plus,
  Search,
  Settings,
  Trash,
  User,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data for activity log
const mockActivities = [
  {
    id: 1,
    action: "Updated project",
    item: "E-commerce Platform",
    details: "Changed project description and updated screenshots",
    time: "2 hours ago",
    date: "2023-05-02",
    icon: Edit,
    category: "projects",
    user: "You",
  },
  {
    id: 2,
    action: "Added new skill",
    item: "GraphQL",
    details: "Added GraphQL to the skills section with 85% proficiency",
    time: "Yesterday",
    date: "2023-05-01",
    icon: Plus,
    category: "skills",
    user: "You",
  },
  {
    id: 3,
    action: "Received message",
    item: "from John Smith",
    details: "New inquiry about potential project collaboration",
    time: "2 days ago",
    date: "2023-04-30",
    icon: MessageSquare,
    category: "messages",
    user: "John Smith",
  },
  {
    id: 4,
    action: "Updated experience",
    item: "Tech Innovations Inc.",
    details: "Added new responsibilities and updated time period",
    time: "3 days ago",
    date: "2023-04-29",
    icon: Edit,
    category: "experience",
    user: "You",
  },
  {
    id: 5,
    action: "Portfolio viewed",
    item: "25 new visitors",
    details: "Increased traffic from LinkedIn post",
    time: "This week",
    date: "2023-04-28",
    icon: Eye,
    category: "analytics",
    user: "System",
  },
  {
    id: 6,
    action: "Updated profile",
    item: "Contact information",
    details: "Updated email address and added phone number",
    time: "Last week",
    date: "2023-04-25",
    icon: User,
    category: "profile",
    user: "You",
  },
  {
    id: 7,
    action: "Changed settings",
    item: "Theme preferences",
    details: "Switched to dark mode as default theme",
    time: "2 weeks ago",
    date: "2023-04-18",
    icon: Settings,
    category: "settings",
    user: "You",
  },
  {
    id: 8,
    action: "Deleted project",
    item: "Weather App",
    details: "Removed outdated project from portfolio",
    time: "3 weeks ago",
    date: "2023-04-11",
    icon: Trash,
    category: "projects",
    user: "You",
  },
  {
    id: 9,
    action: "Portfolio viewed",
    item: "Spike in traffic",
    details: "50 visitors from Twitter link",
    time: "Last month",
    date: "2023-04-05",
    icon: Eye,
    category: "analytics",
    user: "System",
  },
  {
    id: 10,
    action: "Added new project",
    item: "Portfolio Website",
    details: "Published new personal portfolio website",
    time: "Last month",
    date: "2023-04-01",
    icon: Plus,
    category: "projects",
    user: "You",
  },
  {
    id: 11,
    action: "Updated experience",
    item: "Freelance Work",
    details: "Added new client projects to experience section",
    time: "2 months ago",
    date: "2023-03-15",
    icon: Edit,
    category: "experience",
    user: "You",
  },
  {
    id: 12,
    action: "Received message",
    item: "from Sarah Johnson",
    details: "Inquiry about design consultation",
    time: "2 months ago",
    date: "2023-03-10",
    icon: MessageSquare,
    category: "messages",
    user: "Sarah Johnson",
  },
  {
    id: 13,
    action: "Added new skill",
    item: "Tailwind CSS",
    details: "Added Tailwind CSS to skills with 90% proficiency",
    time: "3 months ago",
    date: "2023-02-20",
    icon: Plus,
    category: "skills",
    user: "You",
  },
  {
    id: 14,
    action: "Portfolio viewed",
    item: "First 100 visitors",
    details: "Milestone: 100 unique visitors to portfolio",
    time: "3 months ago",
    date: "2023-02-15",
    icon: Eye,
    category: "analytics",
    user: "System",
  },
  {
    id: 15,
    action: "Created account",
    item: "Portfolio system",
    details: "Initial setup of portfolio management system",
    time: "3 months ago",
    date: "2023-02-01",
    icon: User,
    category: "system",
    user: "You",
  },
]

export default function ActivityPage() {
  const router = useRouter()
  const [activities, setActivities] = useState(mockActivities)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [userFilter, setUserFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("all")

  const handleGoBack = () => {
    router.back()
  }

  // Get unique categories for filter
  const categories = ["all", ...new Set(activities.map((a) => a.category))]
  const users = ["all", ...new Set(activities.map((a) => a.user))]

  // Filter activities based on search, category, date, and user
  const filteredActivities = activities.filter((activity) => {
    // Filter by tab
    if (activeTab !== "all" && activity.category !== activeTab) return false

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        activity.action.toLowerCase().includes(query) ||
        activity.item.toLowerCase().includes(query) ||
        activity.details.toLowerCase().includes(query)
      )
    }

    // Filter by category
    if (categoryFilter !== "all" && activity.category !== categoryFilter) return false

    // Filter by user
    if (userFilter !== "all" && activity.user !== userFilter) return false

    // Filter by date
    if (dateFilter !== "all") {
      const activityDate = new Date(activity.date)
      const now = new Date()

      if (dateFilter === "today") {
        const today = new Date()
        return (
          activityDate.getDate() === today.getDate() &&
          activityDate.getMonth() === today.getMonth() &&
          activityDate.getFullYear() === today.getFullYear()
        )
      } else if (dateFilter === "week") {
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)
        return activityDate >= weekAgo
      } else if (dateFilter === "month") {
        const monthAgo = new Date()
        monthAgo.setMonth(monthAgo.getMonth() - 1)
        return activityDate >= monthAgo
      } else if (dateFilter === "year") {
        const yearAgo = new Date()
        yearAgo.setFullYear(yearAgo.getFullYear() - 1)
        return activityDate >= yearAgo
      }
    }

    return true
  })

  // Group activities by date for display
  const groupedActivities = filteredActivities.reduce((groups, activity) => {
    const date = activity.date
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(activity)
    return groups
  }, {})

  // Sort dates in descending order
  const sortedDates = Object.keys(groupedActivities).sort((a, b) => {
    return new Date(b) - new Date(a)
  })

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const getCategoryColor = (category) => {
    const colors = {
      projects: "bg-blue-100 text-blue-800",
      skills: "bg-green-100 text-green-800",
      experience: "bg-purple-100 text-purple-800",
      messages: "bg-yellow-100 text-yellow-800",
      analytics: "bg-orange-100 text-orange-800",
      profile: "bg-pink-100 text-pink-800",
      settings: "bg-indigo-100 text-indigo-800",
      system: "bg-gray-100 text-gray-800",
    }
    return colors[category] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handleGoBack}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
          <h1 className="text-2xl font-bold">Activity Log</h1>
        </div>
        <div className="flex gap-2">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search activities..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
                <span className="sr-only">Filter</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setCategoryFilter("all")}>All Categories</DropdownMenuItem>
              {categories
                .filter((c) => c !== "all")
                .map((category) => (
                  <DropdownMenuItem key={category} onClick={() => setCategoryFilter(category)}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-64 space-y-4">
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium">Filters</CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-4">
              <div className="space-y-2">
                <Label className="text-xs font-medium">Category</Label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories
                      .filter((c) => c !== "all")
                      .map((category) => (
                        <SelectItem key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-medium">Time Period</Label>
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">Past Week</SelectItem>
                    <SelectItem value="month">Past Month</SelectItem>
                    <SelectItem value="year">Past Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-medium">User</Label>
                <Select value={userFilter} onValueChange={setUserFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select user" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    {users
                      .filter((u) => u !== "all")
                      .map((user) => (
                        <SelectItem key={user} value={user}>
                          {user}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label className="text-xs font-medium">Quick Filters</Label>
                <div className="space-y-1">
                  <Button
                    variant={
                      categoryFilter === "all" && dateFilter === "all" && userFilter === "all" ? "secondary" : "ghost"
                    }
                    size="sm"
                    className="w-full justify-start text-xs"
                    onClick={() => {
                      setCategoryFilter("all")
                      setDateFilter("all")
                      setUserFilter("all")
                    }}
                  >
                    All Activity
                  </Button>
                  <Button
                    variant={dateFilter === "today" ? "secondary" : "ghost"}
                    size="sm"
                    className="w-full justify-start text-xs"
                    onClick={() => setDateFilter("today")}
                  >
                    Today Only
                  </Button>
                  <Button
                    variant={userFilter === "You" ? "secondary" : "ghost"}
                    size="sm"
                    className="w-full justify-start text-xs"
                    onClick={() => setUserFilter("You")}
                  >
                    My Activity
                  </Button>
                  <Button
                    variant={categoryFilter === "messages" ? "secondary" : "ghost"}
                    size="sm"
                    className="w-full justify-start text-xs"
                    onClick={() => setCategoryFilter("messages")}
                  >
                    Messages
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium">Statistics</CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">Total Activities</span>
                  <span className="text-xs font-medium">{activities.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">This Week</span>
                  <span className="text-xs font-medium">
                    {
                      activities.filter((a) => {
                        const activityDate = new Date(a.date)
                        const weekAgo = new Date()
                        weekAgo.setDate(weekAgo.getDate() - 7)
                        return activityDate >= weekAgo
                      }).length
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">This Month</span>
                  <span className="text-xs font-medium">
                    {
                      activities.filter((a) => {
                        const activityDate = new Date(a.date)
                        const monthAgo = new Date()
                        monthAgo.setMonth(monthAgo.getMonth() - 1)
                        return activityDate >= monthAgo
                      }).length
                    }
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex-1">
          <Card>
            <CardHeader className="pb-3">
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-5">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="projects">Projects</TabsTrigger>
                  <TabsTrigger value="experience">Experience</TabsTrigger>
                  <TabsTrigger value="skills">Skills</TabsTrigger>
                  <TabsTrigger value="messages">Messages</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent className="p-0">
              {filteredActivities.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Calendar className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm font-medium">No activities found</p>
                  <p className="text-xs text-muted-foreground mt-1">Try adjusting your filters to see more results</p>
                </div>
              ) : (
                <div className="max-h-[600px] overflow-auto">
                  {sortedDates.map((date) => (
                    <div key={date}>
                      <div className="sticky top-0 bg-background/95 backdrop-blur-sm p-3 border-b">
                        <h3 className="text-sm font-medium">{formatDate(date)}</h3>
                      </div>
                      <ul className="divide-y">
                        {groupedActivities[date].map((activity) => (
                          <li key={activity.id} className="p-3 hover:bg-muted/50">
                            <div className="flex items-start gap-3">
                              <div className={`rounded-full p-2 ${getCategoryColor(activity.category)}`}>
                                <activity.icon className="h-4 w-4" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <p className="text-sm font-medium">
                                    {activity.action}{" "}
                                    <span className="font-normal text-muted-foreground">{activity.item}</span>
                                  </p>
                                  <div className="flex items-center">
                                    <Badge variant="outline" className="text-xs font-normal">
                                      {activity.category}
                                    </Badge>
                                  </div>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">{activity.details}</p>
                                <div className="flex items-center justify-between mt-2">
                                  <p className="text-xs text-muted-foreground flex items-center">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {activity.time}
                                  </p>
                                  <p className="text-xs text-muted-foreground">{activity.user}</p>
                                </div>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
