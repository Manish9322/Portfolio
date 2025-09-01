"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { BlogCard } from "@/components/ui/blog-card";
import { useGetBlogsQuery } from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Blog {
  _id: string;
  title: string;
  description: string;
  content: string;
  imageUrl: string;
  tags: string[];
  readTime: string;
  publishedAt: string;
  author: {
    name: string;
    avatar: string;
  };
}

export default function BlogsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: blogs = [], isLoading: isLoadingBlogs } = useGetBlogsQuery(
    undefined,
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const filteredBlogs = blogs.filter(
    (blog: any) =>
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.tags.some((tag: string) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  if (isLoadingBlogs) {
    return (
      <div className="flex min-h-screen flex-col">
        <header className="border-b">
          <div className="container mx-auto flex h-16 items-center justify-between px-4 max-w-7xl">
            <Skeleton className="h-8 w-32" />
            <div className="flex items-center gap-6">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        </header>

        <main className="flex-1">
          <section className="bg-muted py-20">
            <div className="container mx-auto px-4 text-center">
              <Skeleton className="h-12 w-64 mx-auto mb-4" />
              <Skeleton className="h-4 w-full max-w-2xl mx-auto" />
              <div className="mt-8 flex justify-center">
                <Skeleton className="h-12 w-full max-w-md" />
              </div>
            </div>
          </section>

          <section className="py-16">
            <div className="container mx-auto px-4 max-w-7xl">
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <CardContent className="p-0">
                      <Skeleton className="aspect-video w-full" />
                      <div className="p-6 space-y-4">
                        <div className="flex gap-2">
                          <Skeleton className="h-6 w-16" />
                          <Skeleton className="h-6 w-16" />
                        </div>
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Skeleton className="h-8 w-8 rounded-full" />
                            <Skeleton className="h-4 w-24" />
                          </div>
                          <div className="flex items-center gap-3">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-16" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        </main>

        <footer className="border-t py-8">
          <div className="container mx-auto px-4 text-center">
            <Skeleton className="h-4 w-48 mx-auto" />
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 max-w-7xl">
          <Link href="/" className="text-xl font-bold">
            Alex Morgan
          </Link>
          <nav className="flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Home
            </Link>
            <Link
              href="/work"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Work
            </Link>
            <Link
              href="/education"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Education
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Contact
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-muted py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl">
              Blog & Articles
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
              Discover insights, tutorials, and thoughts on web development,
              design, and technology
            </p>
            <div className="flex items-center justify-center">
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
          </div>
        </section>

        {/* Blog Grid */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 max-w-7xl">

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
              {isLoadingBlogs
                ? [...Array(3)].map((_, i) => (
                    <div key={i} className="space-y-4">
                      <Skeleton className="h-48 w-full" />
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-6 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  ))
                : blogs.map((blog: Blog) => (
                    <BlogCard key={blog._id} blog={blog} variant="compact" />
                  ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Alex Morgan. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
