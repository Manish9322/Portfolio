"use client"

import { Label } from "@/components/ui/label"

import { useState, useEffect } from "react"
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
import { toast } from "sonner"

// Icon mapping for activity types
const iconMap = {
  Edit: Edit,
  Plus: Plus,
  Trash: Trash,
  User: User,
  MessageSquare: MessageSquare,
  Eye: Eye,
  Settings: Settings,
  Calendar: Calendar,
  Clock: Clock,
}

// Types
interface Activity {
  id: string
  action: string
  item: string
  details: string
  time: string
  date: string
  icon: string
  category: string
  user: string
  createdAt?: string
  metadata?: any
}

interface ActivityResponse {
  activities: Activity[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  filters: {
    categories: string[]
    users: string[]
  }
}

export default function ActivityPage() {
  const router = useRouter()
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [userFilter, setUserFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("all")
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0
  })
  const [availableCategories, setAvailableCategories] = useState<string[]>([])
  const [availableUsers, setAvailableUsers] = useState<string[]>([])

  const handleGoBack = () => {
    router.back()
  }

  // Fetch activities from API
  const fetchActivities = async () => {
    try {
      setLoading(true)
      
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      })

      if (categoryFilter !== "all") params.append('category', categoryFilter)
      if (userFilter !== "all") params.append('user', userFilter)
      if (searchQuery.trim()) params.append('search', searchQuery.trim())
      
      // Add date filters
      if (dateFilter !== "all") {
        const now = new Date()
        let startDate = new Date()
        
        switch (dateFilter) {
          case 'today':
            startDate.setHours(0, 0, 0, 0)
            break
          case 'week':
            startDate.setDate(now.getDate() - 7)
            break
          case 'month':
            startDate.setMonth(now.getMonth() - 1)
            break
          case 'year':
            startDate.setFullYear(now.getFullYear() - 1)
            break
        }
        
        if (dateFilter !== 'all') {
          params.append('startDate', startDate.toISOString())
        }
      }

      const response = await fetch(`/api/activity?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch activities')
      }

      const data: ActivityResponse = await response.json()
      
      setActivities(data.activities)
      setPagination(data.pagination)
      setAvailableCategories(['all', ...data.filters.categories])
      setAvailableUsers(['all', ...data.filters.users])
      
    } catch (error) {
      console.error('Error fetching activities:', error)
      toast.error('Failed to load activities')
    } finally {
      setLoading(false)
    }
  }

  // Fetch activities on component mount and when filters change
  useEffect(() => {
    fetchActivities()
  }, [pagination.page, categoryFilter, userFilter, searchQuery, dateFilter])

  // Reset page when filters change
  useEffect(() => {
    setPagination(prev => ({ ...prev, page: 1 }))
  }, [categoryFilter, userFilter, searchQuery, dateFilter, activeTab])

  // Get unique categories for filter (use available categories from API)
  const categories = availableCategories
  const users = availableUsers

  // Filter activities based on active tab
  const filteredActivities = activities.filter((activity) => {
    if (activeTab !== "all" && activity.category !== activeTab) return false
    return true
  })

  // Group activities by date for display
  const groupedActivities: { [key: string]: Activity[] } = filteredActivities.reduce((groups, activity) => {
    const date = activity.date
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(activity)
    return groups
  }, {} as { [key: string]: Activity[] })

  // Sort dates in descending order
  const sortedDates = Object.keys(groupedActivities).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime()
  })

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: "numeric" as const, 
      month: "long" as const, 
      day: "numeric" as const 
    }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      projects: "bg-blue-100 text-blue-800",
      skills: "bg-green-100 text-green-800",
      experience: "bg-purple-100 text-purple-800",
      messages: "bg-yellow-100 text-yellow-800",
      analytics: "bg-orange-100 text-orange-800",
      profile: "bg-pink-100 text-pink-800",
      settings: "bg-indigo-100 text-indigo-800",
      system: "bg-gray-100 text-gray-800",
      education: "bg-cyan-100 text-cyan-800",
      gallery: "bg-teal-100 text-teal-800",
      blog: "bg-red-100 text-red-800",
    }
    return colors[category] || "bg-gray-100 text-gray-800"
  }

  const getActivityIcon = (iconName: string) => {
    return iconMap[iconName as keyof typeof iconMap] || Edit
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
                  <span className="text-xs font-medium">{pagination.total}</span>
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
                {loading && (
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">Loading...</span>
                    <div className="animate-pulse bg-gray-200 h-3 w-6 rounded"></div>
                  </div>
                )}
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
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
                  <p className="text-sm font-medium">Loading activities...</p>
                  <p className="text-xs text-muted-foreground mt-1">Please wait while we fetch your activity log</p>
                </div>
              ) : filteredActivities.length === 0 ? (
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
                                {(() => {
                                  const IconComponent = getActivityIcon(activity.icon)
                                  return <IconComponent className="h-4 w-4" />
                                })()}
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
