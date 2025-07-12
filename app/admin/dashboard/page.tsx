"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Calendar, Clock, Edit, Eye, FileText, Grid, MessageSquare, Plus, Settings, User, BookOpen } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { getPortfolioData } from "@/lib/portfolio-data"
import { AddTaskModal } from "@/components/add-task-modal"

export default function DashboardPage() {
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    experience: 0,
    messages: 0,
    views: 0,
  })
  const [recentActivity, setRecentActivity] = useState([
    {
      id: 1,
      action: "Updated project",
      item: "E-commerce Platform",
      time: "2 hours ago",
      icon: Edit,
    },
    {
      id: 2,
      action: "Added new skill",
      item: "GraphQL",
      time: "Yesterday",
      icon: Plus,
    },
    {
      id: 3,
      action: "Received message",
      item: "from John Smith",
      time: "2 days ago",
      icon: MessageSquare,
    },
    {
      id: 4,
      action: "Updated experience",
      item: "Tech Innovations Inc.",
      time: "3 days ago",
      icon: Edit,
    },
    {
      id: 5,
      action: "Portfolio viewed",
      item: "25 new visitors",
      time: "This week",
      icon: Eye,
    },
  ])

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

  useEffect(() => {
    // In a real app, this would fetch from your database
    const portfolioData = getPortfolioData()
    setStats({
      projects: portfolioData.featuredProjects.length,
      skills: portfolioData.skills.reduce((acc, skill) => acc + skill.items.length, 0),
      experience: portfolioData.experience.length,
      messages: 5, // Mock data
      views: 1248, // Mock data
    })
  }, [])

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Projects</p>
                <h3 className="text-2xl font-bold">{stats.projects}</h3>
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
                <h3 className="text-2xl font-bold">{stats.skills}</h3>
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
                <h3 className="text-2xl font-bold">{stats.experience}</h3>
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
              {recentActivity.map((activity) => (
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
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" className="w-full" asChild>
              <Link href="/admin/activity">View All Activity</Link>
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

        {/* Upcoming Tasks */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Upcoming Tasks</CardTitle>
            <CardDescription>Tasks and reminders for your portfolio</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tasks
                .filter((task) => task.status === "pending")
                .slice(0, 3)
                .map((task) => (
                  <div key={task.id} className="flex items-start gap-4">
                    <div
                      className={`rounded-full p-2 ${
                        task.priority === "high"
                          ? "bg-yellow-100 text-yellow-600"
                          : task.priority === "medium"
                            ? "bg-blue-100 text-blue-600"
                            : "bg-green-100 text-green-600"
                      }`}
                    >
                      <Clock className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{task.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {task.dueDate ? `Due ${new Date(task.dueDate).toLocaleDateString()}` : "No due date"}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => handleCompleteTask(task.id)}>
                      Complete
                    </Button>
                  </div>
                ))}
            </div>
          </CardContent>
          <CardFooter>
            <AddTaskModal onAddTask={handleAddTask} />
          </CardFooter>
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
            <div className="space-y-4">
              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium">John Smith</p>
                  <p className="text-xs text-muted-foreground">2 days ago</p>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  I'm interested in discussing a potential project for my company...
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/admin/messages">View Message</Link>
                </Button>
              </div>
              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium">Sarah Johnson</p>
                  <p className="text-xs text-muted-foreground">5 days ago</p>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  Your portfolio is impressive! I'd like to connect regarding...
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/admin/messages">View Message</Link>
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" className="w-full" asChild>
              <Link href="/admin/messages">View All Messages</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
