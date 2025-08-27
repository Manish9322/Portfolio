"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { BlogCard } from "@/components/ui/blog-card"
import { useGetBlogsQuery } from "@/services/api"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { BookOpen } from "lucide-react"

export default function BlogsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const { data: blogs = [], isLoading } = useGetBlogsQuery(undefined)

  const filteredBlogs = blogs.filter((blog: any) =>
    blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="mb-8">
          <Skeleton className="h-12 w-64 mb-4" />
          <Skeleton className="h-4 w-full max-w-2xl" />
        </div>
        <div className="mb-8">
          <Skeleton className="h-12 w-full max-w-md" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-7xl">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
          Blog & Articles
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover insights, tutorials, and thoughts on web development, design, and technology
        </p>
      </div>

      <div className="flex items-center justify-center mb-12">
        <div className="relative w-full max-w-md">
          <Input
            type="search"
            placeholder="Search blogs by title, description, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-4 pr-10 py-2"
          />
          <BookOpen className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
        </div>
      </div>

      {filteredBlogs.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">No blogs found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search query to find what you're looking for.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredBlogs.map((blog: any) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  )
}
