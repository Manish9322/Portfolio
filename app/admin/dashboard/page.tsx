"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Calendar, Clock, Edit, Eye, FileText, Grid, MessageSquare, Plus, Settings, User, BookOpen } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { getPortfolioData } from "@/lib/portfolio-data"
import { AddTaskModal } from "@/components/add-task-modal"
import { 
  useGetProjectsQuery, 
  useGetSkillsQuery, 
  useGetExperiencesQuery, 
  useGetContactMessagesQuery,
  useGetActivitiesQuery 
} from "@/services/api"

export default function DashboardPage() {
  // API queries for dynamic data
  const { data: projects = [], isLoading: isLoadingProjects } = useGetProjectsQuery(undefined)
  const { data: skills = [], isLoading: isLoadingSkills } = useGetSkillsQuery(undefined)
  const { data: experiences = [], isLoading: isLoadingExperiences } = useGetExperiencesQuery(undefined)
  const { data: messagesData, isLoading: isLoadingMessages } = useGetContactMessagesQuery({ page: 1, limit: 10, filter: 'all' })
  const { data: activitiesData, isLoading: isLoadingActivities } = useGetActivitiesQuery({ limit: 10 })

  // Extract messages from the API response structure
  const messages = messagesData?.contacts || []

  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    experience: 0,
    messages: 0,
    views: 1248, // Keep views static as requested
  })

  const [recentActivity, setRecentActivity] = useState([])

  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Update portfolio with latest project",
      description: "Add the new e-commerce project to the portfolio",
      dueDate: "2023-05-04",
      status: "pending",
      priority: "high",
      category: "portfolio",
    },
    {
      id: 2,
      title: "Respond to client inquiry",
      description: "Reply to John Smith about potential collaboration",
      dueDate: "2023-05-03",
      status: "pending",
      priority: "medium",
      category: "messages",
    },
    {
      id: 3,
      title: "Review portfolio analytics",
      description: "Check traffic sources and user engagement",
      dueDate: "2023-05-07",
      status: "pending",
      priority: "low",
      category: "analytics",
    },
  ])

  // Function to map icon strings to icon components
  const getIconComponent = (iconName: string) => {
    const iconMap: Record<string, any> = {
      Edit: Edit,
      Plus: Plus,
      MessageSquare: MessageSquare,
      Eye: Eye,
      Grid: Grid,
      FileText: FileText,
      Calendar: Calendar,
      User: User,
      Settings: Settings,
      BookOpen: BookOpen,
      Clock: Clock,
    }
    return iconMap[iconName] || Edit
  }

  // Function to format time ago
  const timeAgo = (date: string | Date) => {
    const now = new Date()
    const activityDate = new Date(date)
    const diffMs = now.getTime() - activityDate.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) {
      return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`
    } else if (diffHours < 24) {
      return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`
    } else if (diffDays < 7) {
      return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`
    } else {
      return activityDate.toLocaleDateString()
    }
  }

  useEffect(() => {
    // Update stats with dynamic data
    if (!isLoadingProjects && !isLoadingSkills && !isLoadingExperiences && !isLoadingMessages) {
      const totalSkills = skills.reduce((acc: number, skill: any) => acc + skill.items.length, 0)
      
      // Debug: Log messages data
      console.log('Messages data in dashboard:', { messagesData, messages, messagesLength: messages.length })
      
      setStats({
        projects: projects.length,
        skills: totalSkills,
        experience: experiences.length,
        messages: messages.length,
        views: 1248, // Keep views static as requested
      })
    }
  }, [projects, skills, experiences, messages, messagesData, isLoadingProjects, isLoadingSkills, isLoadingExperiences, isLoadingMessages])

  useEffect(() => {
    // Update recent activity with dynamic data
    if (activitiesData && activitiesData.activities) {
      const formattedActivities = activitiesData.activities.map((activity: any) => ({
        id: activity._id,
        action: activity.action,
        item: activity.item,
        time: timeAgo(activity.createdAt),
        icon: getIconComponent(activity.icon),
      }))
      setRecentActivity(formattedActivities)
    }
  }, [activitiesData])

  const handleAddTask = (newTask : any) => {
    setTasks([newTask, ...tasks])
  }

  const handleCompleteTask = (taskId : any) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, status: "completed" } : task)))
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/" target="_blank">
              <Eye className="mr-2 h-4 w-4" /> View Site
            </Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/admin/settings">
              <Settings className="mr-2 h-4 w-4" /> Settings
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Projects</p>
                {isLoadingProjects ? (
                  <Skeleton className="h-8 w-16 mt-1" />
                ) : (
                  <h3 className="text-2xl font-bold">{stats.projects}</h3>
                )}
              </div>
              <div className="rounded-full bg-primary/10 p-2 text-primary">
                <Grid className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 text-xs text-muted-foreground">
              <span className="text-green-500 font-medium">+2</span> since last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Skills</p>
                {isLoadingSkills ? (
                  <Skeleton className="h-8 w-16 mt-1" />
                ) : (
                  <h3 className="text-2xl font-bold">{stats.skills}</h3>
                )}
              </div>
              <div className="rounded-full bg-primary/10 p-2 text-primary">
                <FileText className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 text-xs text-muted-foreground">
              <span className="text-green-500 font-medium">+5</span> since last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Work Experience</p>
                {isLoadingExperiences ? (
                  <Skeleton className="h-8 w-16 mt-1" />
                ) : (
                  <h3 className="text-2xl font-bold">{stats.experience}</h3>
                )}
              </div>
              <div className="rounded-full bg-primary/10 p-2 text-primary">
                <Calendar className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 text-xs text-muted-foreground">
              <span className="text-green-500 font-medium">+1</span> since last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Messages</p>
                {isLoadingMessages ? (
                  <Skeleton className="h-8 w-16 mt-1" />
                ) : (
                  <h3 className="text-2xl font-bold">{stats.messages}</h3>
                )}
              </div>
              <div className="rounded-full bg-primary/10 p-2 text-primary">
                <MessageSquare className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 text-xs text-muted-foreground">
              <span className="text-green-500 font-medium">+3</span> since last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Portfolio Views</p>
                <h3 className="text-2xl font-bold">{stats.views}</h3>
              </div>
              <div className="rounded-full bg-primary/10 p-2 text-primary">
                <Eye className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 text-xs text-muted-foreground">
              <span className="text-green-500 font-medium">+124</span> since last month
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="md:col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest portfolio updates and interactions</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin/activity">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoadingActivities ? (
                // Loading skeletons
                Array.from({ length: 10 }).map((_, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="flex-1 space-y-1">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))
              ) : recentActivity.length > 0 ? (
                recentActivity.map((activity: any) => (
                  <div key={activity.id} className="flex items-start gap-4">
                    <div className="rounded-full bg-muted p-2">
                      <activity.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {activity.action} <span className="font-normal text-muted-foreground">{activity.item}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted-foreground py-4">
                  <p className="text-sm">No recent activity</p>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" className="w-full" asChild>
              <Link href="/admin/activity">View All Activity</Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Portfolio Analytics */}
        <Card className="md:col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Portfolio Analytics</CardTitle>
                <CardDescription>Key insights and performance metrics</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin/analytics">View Details</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* First Row - Original 4 cards in 2x2 grid - Black & White Theme */}
              <div className="grid grid-cols-2 gap-3">
                {/* Traffic Overview */}
                <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900/20 dark:to-gray-800/20 rounded-lg p-4 border-2 border-gray-300 dark:border-gray-600">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center">
                      <Eye className="w-4 h-4 text-white dark:text-black" />
                    </div>
                    <span className="text-xs text-black dark:text-white bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full">+12%</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-black dark:text-white">1.2K</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Monthly Visitors</p>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                      <div className="bg-black dark:bg-white h-1.5 rounded-full" style={{ width: '68%' }}></div>
                    </div>
                  </div>
                </div>

                {/* Project Engagement */}
                <div className="bg-gradient-to-br from-white to-gray-100 dark:from-gray-800/20 dark:to-gray-900/20 rounded-lg p-4 border-2 border-gray-800 dark:border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-8 h-8 bg-gray-800 dark:bg-gray-200 rounded-lg flex items-center justify-center">
                      <Grid className="w-4 h-4 text-white dark:text-black" />
                    </div>
                    <span className="text-xs text-white dark:text-black bg-gray-800 dark:bg-gray-200 px-2 py-1 rounded-full">+8%</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">89%</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Project Views</p>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((bar, i) => (
                        <div key={i} className={`flex-1 bg-gray-200 dark:bg-gray-700 rounded-sm ${i < 4 ? 'h-2' : 'h-3'}`}>
                          <div className={`bg-gray-800 dark:bg-gray-200 rounded-sm ${i < 4 ? 'h-2' : 'h-3'}`} style={{ width: `${90 - i * 15}%` }}></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Skills Interest */}
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-black/20 dark:to-gray-900/20 rounded-lg p-4 border border-black dark:border-white">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-8 h-8 bg-white dark:bg-black border border-black dark:border-white rounded-lg flex items-center justify-center">
                      <FileText className="w-4 h-4 text-black dark:text-white" />
                    </div>
                    <span className="text-xs text-white dark:text-black bg-black dark:bg-white px-2 py-1 rounded-full">Top 3</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600 dark:text-gray-400">React</span>
                      <span className="text-xs font-medium text-black dark:text-white">94%</span>
                    </div>
                    <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-1">
                      <div className="bg-black dark:bg-white h-1 rounded-full" style={{ width: '94%' }}></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600 dark:text-gray-400">Node.js</span>
                      <span className="text-xs font-medium text-black dark:text-white">87%</span>
                    </div>
                    <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-1">
                      <div className="bg-black dark:bg-white h-1 rounded-full" style={{ width: '87%' }}></div>
                    </div>
                  </div>
                </div>

                {/* Contact Activity */}
                <div className="bg-gradient-to-br from-black to-gray-900 dark:from-white dark:to-gray-100 rounded-lg p-4 border-2 border-black dark:border-white">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-8 h-8 bg-white dark:bg-black rounded-lg flex items-center justify-center">
                      <MessageSquare className="w-4 h-4 text-black dark:text-white" />
                    </div>
                    <span className="text-xs text-black dark:text-white bg-white dark:bg-black px-2 py-1 rounded-full">+24%</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-white dark:text-black">{stats.messages}</p>
                    <p className="text-xs text-gray-300 dark:text-gray-700">New Inquiries</p>
                    <div className="flex items-center gap-1 mt-2">
                      <div className="flex-1 bg-gray-700 dark:bg-gray-300 rounded-full h-1.5">
                        <div className="bg-white dark:bg-black h-1.5 rounded-full" style={{ width: '76%' }}></div>
                      </div>
                      <span className="text-xs text-white dark:text-black">76%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Second Row - New 2 cards in black & white */}
              <div className="grid grid-cols-2 gap-3">
                {/* Performance Score */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20 rounded-lg p-4 border">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center">
                      <User className="w-4 h-4 text-white dark:text-black" />
                    </div>
                    <span className="text-xs text-black dark:text-white bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full">A+</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-black dark:text-white">96</p>
                    <p className="text-xs text-muted-foreground">Performance Score</p>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((dot, i) => (
                        <div key={i} className={`w-1.5 h-1.5 rounded-full ${i < 9 ? 'bg-black dark:bg-white' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Response Time */}
                <div className="bg-gradient-to-br from-gray-100 to-white dark:from-gray-800/20 dark:to-black/20 rounded-lg p-4 border-2 border-black dark:border-white">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-8 h-8 bg-white dark:bg-black border-2 border-black dark:border-white rounded-lg flex items-center justify-center">
                      <Clock className="w-4 h-4 text-black dark:text-white" />
                    </div>
                    <span className="text-xs text-white dark:text-black bg-black dark:bg-white px-2 py-1 rounded-full">Fast</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-black dark:text-white">2.4h</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Avg Response Time</p>
                    <div className="grid grid-cols-4 gap-1 mt-2">
                      {[1, 2, 3, 4].map((bar, i) => (
                        <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-sm h-2">
                          <div className={`bg-black dark:bg-white rounded-sm h-2`} style={{ width: `${100 - i * 20}%` }}></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" className="w-full" asChild>
              <Link href="/admin/analytics">View Full Analytics</Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Quick Actions */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <Button variant="outline" className="justify-start" asChild>
                <Link href="/admin/projects">
                  <Grid className="mr-2 h-4 w-4" /> Manage Projects
                </Link>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <Link href="/admin/skills">
                  <FileText className="mr-2 h-4 w-4" /> Manage Skills
                </Link>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <Link href="/admin/experience">
                  <Calendar className="mr-2 h-4 w-4" /> Manage Experience
                </Link>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <Link href="/admin/education">
                  <BookOpen className="mr-2 h-4 w-4" /> Manage Education
                </Link>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <Link href="/admin/profile">
                  <User className="mr-2 h-4 w-4" /> Update Profile
                </Link>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <Link href="/admin/settings">
                  <Settings className="mr-2 h-4 w-4" /> Site Settings
                </Link>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <Link href="/admin/messages">
                  <MessageSquare className="mr-2 h-4 w-4" /> View Messages
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Messages */}
        <Card className="md:col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Messages</CardTitle>
                <CardDescription>Latest inquiries from your contact form</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin/messages">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {isLoadingMessages ? (
                // Loading skeletons
                Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="rounded-md border p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="space-y-1">
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                      <Skeleton className="h-3 w-12" />
                    </div>
                    <Skeleton className="h-3 w-24 mb-1" />
                    <Skeleton className="h-3 w-full mb-1" />
                    <div className="flex items-center justify-between mt-2">
                      <Skeleton className="h-6 w-20" />
                      <div className="flex items-center gap-1">
                        <Skeleton className="h-3 w-12" />
                        <Skeleton className="h-2 w-2 rounded-full" />
                      </div>
                    </div>
                  </div>
                ))
              ) : messages.length > 0 ? (
                messages.slice(0, 3).map((message: any) => (
                  <div key={message._id} className="rounded-md border p-3 hover:bg-muted/30 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{message.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{message.email}</p>
                      </div>
                      <p className="text-xs text-muted-foreground whitespace-nowrap ml-2">{timeAgo(message.createdAt)}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1 truncate">
                      <span className="font-medium">Subject:</span> {message.subject || 'Contact Form Inquiry'}
                    </p>
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                      {message.message.length > 60 
                        ? `${message.message.substring(0, 60)}...` 
                        : message.message}
                    </p>
                    <div className="flex items-center justify-between">
                      <Button variant="outline" size="sm" className="h-6 px-2 text-xs" asChild>
                        <Link href={`/admin/messages?messageId=${message._id}`}>View</Link>
                      </Button>
                      <div className="flex items-center gap-2">
                        {message.archived && (
                          <span className="text-xs text-orange-600 bg-orange-100 px-1.5 py-0.5 rounded-sm">
                            Archived
                          </span>
                        )}
                        {!message.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted-foreground py-4">
                  <p className="text-sm">No messages yet</p>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" className="w-full" asChild>
              <Link href="/admin/messages">View All Messages</Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Analytics Dashboard */}

      </div>
    </div>
  )
}
