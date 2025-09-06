import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Filter, Search } from "lucide-react"

export default function Loading() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" disabled>
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
              disabled
            />
          </div>
          <Button variant="outline" size="icon" disabled>
            <Filter className="h-4 w-4" />
            <span className="sr-only">Filter</span>
          </Button>
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
                <div className="animate-pulse bg-gray-200 h-3 w-16 rounded"></div>
                <div className="animate-pulse bg-gray-200 h-8 w-full rounded"></div>
              </div>
              <div className="space-y-2">
                <div className="animate-pulse bg-gray-200 h-3 w-20 rounded"></div>
                <div className="animate-pulse bg-gray-200 h-8 w-full rounded"></div>
              </div>
              <div className="space-y-2">
                <div className="animate-pulse bg-gray-200 h-3 w-12 rounded"></div>
                <div className="animate-pulse bg-gray-200 h-8 w-full rounded"></div>
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
                  <div className="animate-pulse bg-gray-200 h-3 w-8 rounded"></div>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">This Week</span>
                  <div className="animate-pulse bg-gray-200 h-3 w-6 rounded"></div>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">This Month</span>
                  <div className="animate-pulse bg-gray-200 h-3 w-6 rounded"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex-1">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex gap-2">
                <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
                <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
                <div className="animate-pulse bg-gray-200 h-8 w-24 rounded"></div>
                <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
                <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
                <p className="text-sm font-medium">Loading activities...</p>
                <p className="text-xs text-muted-foreground mt-1">Please wait while we fetch your activity log</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
