"use client"

import { useState, useEffect } from "react"
import { 
  Eye, 
  Users, 
  MousePointer, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Globe,
  Smartphone,
  Monitor,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useGetActivitiesQuery, useGetContactMessagesQuery, useGetProjectsQuery, useGetAnalyticsQuery } from "@/services/api"

interface AnalyticsData {
  pageViews: number
  uniqueVisitors: number
  bounceRate: number
  avgSessionDuration: string
  topPages: Array<{
    page: string
    views: number
    change: number
  }>
  trafficSources: Array<{
    source: string
    visits: number
    percentage: number
  }>
  deviceBreakdown: Array<{
    device: string
    visits: number
    percentage: number
  }>
  recentActivity: Array<{
    action: string
    timestamp: string
    page: string
  }>
}

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState("7")
  const [isLoading, setIsLoading] = useState(true)
  
  // API queries to get real data
  const { data: analyticsApiData, isLoading: isLoadingAnalytics, refetch: refetchAnalytics } = useGetAnalyticsQuery({ 
    days: parseInt(dateRange)
  })
  const { data: activitiesData, isLoading: isLoadingActivities } = useGetActivitiesQuery({ 
    limit: 10,
    category: 'analytics'
  })
  const { data: messagesData } = useGetContactMessagesQuery({ page: 1, limit: 100, filter: 'all' })
  const { data: projects } = useGetProjectsQuery(undefined)

  const analyticsData = analyticsApiData?.data

  // Update loading state based on API loading
  useEffect(() => {
    setIsLoading(isLoadingAnalytics)
  }, [isLoadingAnalytics])

  const refreshData = () => {
    refetchAnalytics()
  }

  const getDeviceIcon = (device: string) => {
    switch (device.toLowerCase()) {
      case 'mobile':
        return <Smartphone className="h-4 w-4" />
      case 'tablet':
        return <Smartphone className="h-4 w-4 rotate-90" />
      default:
        return <Monitor className="h-4 w-4" />
    }
  }

  const getChangeIcon = (change: number) => {
    return change >= 0 
      ? <ArrowUpRight className="h-3 w-3 text-gray-600" />
      : <ArrowDownRight className="h-3 w-3 text-gray-600" />
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Track your portfolio performance and visitor insights
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Last 24 hours</SelectItem>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            size="sm"
            onClick={refreshData}
            disabled={isLoading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Page Views</p>
                {isLoading ? (
                  <Skeleton className="h-8 w-20 mt-1" />
                ) : (
                  <h3 className="text-2xl font-bold">{analyticsData?.pageViews.toLocaleString()}</h3>
                )}
              </div>
              <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-2 text-gray-600 dark:text-gray-400">
                <Eye className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 text-gray-600 mr-1" />
              <span className="text-gray-600 font-medium">+12%</span> from last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Unique Visitors</p>
                {isLoading ? (
                  <Skeleton className="h-8 w-20 mt-1" />
                ) : (
                  <h3 className="text-2xl font-bold">{analyticsData?.uniqueVisitors.toLocaleString()}</h3>
                )}
              </div>
              <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-2 text-gray-600 dark:text-gray-400">
                <Users className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 text-gray-600 mr-1" />
              <span className="text-gray-600 font-medium">+8%</span> from last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Bounce Rate</p>
                {isLoading ? (
                  <Skeleton className="h-8 w-20 mt-1" />
                ) : (
                  <h3 className="text-2xl font-bold">{analyticsData?.bounceRate}%</h3>
                )}
              </div>
              <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-2 text-gray-600 dark:text-gray-400">
                <MousePointer className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 text-xs text-muted-foreground flex items-center">
              <TrendingDown className="h-3 w-3 text-gray-600 mr-1" />
              <span className="text-gray-600 font-medium">-3%</span> from last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. Session</p>
                {isLoading ? (
                  <Skeleton className="h-8 w-20 mt-1" />
                ) : (
                  <h3 className="text-2xl font-bold">{analyticsData?.avgSessionDuration}</h3>
                )}
              </div>
              <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-2 text-gray-600 dark:text-gray-400">
                <Activity className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 text-gray-600 mr-1" />
              <span className="text-gray-600 font-medium">+5%</span> from last period
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="mr-2 h-5 w-5" />
              Top Pages
            </CardTitle>
            <CardDescription>Most visited pages in your portfolio</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-12" />
                </div>
              ))
            ) : (
              analyticsData?.topPages.map((page, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Badge variant="secondary" className="w-6 h-6 p-0 flex items-center justify-center text-xs">
                      {index + 1}
                    </Badge>
                    <span className="font-medium">{page.page}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">{page.views.toLocaleString()}</span>
                    <div className="flex items-center">
                      {getChangeIcon(page.change)}
                      <span className={`text-xs text-gray-600`}>
                        {Math.abs(page.change)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Traffic Sources */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="mr-2 h-5 w-5" />
              Traffic Sources
            </CardTitle>
            <CardDescription>Where your visitors are coming from</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))
            ) : (
              analyticsData?.trafficSources.map((source, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-gray-400 dark:bg-gray-600" />
                    <span className="font-medium">{source.source}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">{source.visits.toLocaleString()}</span>
                    <Badge variant="outline" className="text-xs">
                      {source.percentage}%
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Device Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="mr-2 h-5 w-5" />
              Device Breakdown
            </CardTitle>
            <CardDescription>Devices used to access your portfolio</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))
            ) : (
              analyticsData?.deviceBreakdown.map((device, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getDeviceIcon(device.device)}
                    <span className="font-medium">{device.device}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">{device.visits.toLocaleString()}</span>
                    <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gray-600 dark:bg-gray-400 h-2 rounded-full" 
                        style={{ width: `${device.percentage}%` }}
                      />
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {device.percentage}%
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="mr-2 h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest visitor interactions</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading || isLoadingActivities ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-32 mb-1" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {analyticsData?.recentActivity?.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No recent analytics activities found
                  </p>
                ) : (
                  analyticsData?.recentActivity?.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50">
                      <div className="w-2 h-2 rounded-full bg-gray-600 dark:bg-gray-400" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">
                          {activity.page} • {new Date(activity.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-gray-600">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Projects</p>
                <p className="text-2xl font-bold">{analyticsData?.totals?.projects || projects?.length || 0}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-gray-600">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Messages</p>
                <p className="text-2xl font-bold">{analyticsData?.totals?.messages || messagesData?.contacts?.length || 0}</p>
              </div>
              <Users className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-gray-600">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
                <p className="text-2xl font-bold">
                  {analyticsData?.totals?.conversionRate || (
                    messagesData?.contacts?.length && analyticsData?.uniqueVisitors 
                      ? ((messagesData.contacts.length / analyticsData.uniqueVisitors) * 100).toFixed(1)
                      : '2.4'
                  )}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
