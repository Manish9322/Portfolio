"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Clock } from "lucide-react"

interface BlogCardProps {
  blog: {
    _id: string
    title: string
    description: string
    content: string
    imageUrl: string
    tags: string[]
    readTime: string
    publishedAt: string
    author: {
      name: string
      avatar: string
    }
  }
  variant?: "default" | "compact"
}

export function BlogCard({ blog, variant = "default" }: BlogCardProps) {
  const formattedDate = new Date(blog.publishedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  if (variant === "compact") {
    return (
      <Link href={`/blog/${blog._id}`} className="block h-full">
        <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
          <div className="relative aspect-[16/9]">
            <Image
              src={blog.imageUrl}
              alt={blog.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority={false}
            />
          </div>
          <CardContent className="p-4 flex flex-col flex-grow">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {blog.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
            <h3 className="font-semibold text-base sm:text-lg line-clamp-2 mb-2">{blog.title}</h3>
            <p className="text-muted-foreground text-sm mb-3 line-clamp-3 flex-grow">{blog.description}</p>
            <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
              <div className="flex items-center gap-1 text-sm">
                <CalendarDays className="w-4 h-4" />
                {formattedDate}
              </div>
              <div className="flex items-center gap-1 text-sm">
                <Clock className="w-4 h-4" />
                {blog.readTime}
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    )
  }

  return (
    <Link href={`/blog/${blog._id}`} className="block h-full">
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
        <div className="relative aspect-video">
          <Image
            src={blog.imageUrl}
            alt={blog.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={false}
          />
        </div>
        <CardContent className="p-4 sm:p-6 flex flex-col flex-grow">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {blog.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs sm:text-sm">
                {tag}
              </Badge>
            ))}
          </div>
          <h3 className="text-lg sm:text-xl font-semibold mb-2 line-clamp-2">{blog.title}</h3>
          <p className="text-muted-foreground text-sm sm:text-base mb-4 line-clamp-2 flex-grow">
            {blog.description}
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Image
                src={blog.author.avatar}
                alt={blog.author.name}
                width={32}
                height={32}
                className="rounded-full"
              />
              <span className="text-sm font-medium">{blog.author.name}</span>
            </div>
            <div className="flex items-center gap-3 text-xs sm:text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <CalendarDays className="w-4 h-4" />
                {formattedDate}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {blog.readTime}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
