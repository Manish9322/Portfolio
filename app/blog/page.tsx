"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { BlogCard } from "@/components/ui/blog-card";
import { useGetBlogsQuery, useGetProfileQuery } from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import { FooterSection } from "@/components/home/FooterSection";

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
  const { data: profileData } = useGetProfileQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const filteredBlogs = blogs.filter(
    (blog: any) =>
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.tags.some((tag: string) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  // Sort blogs by publishedAt date to get the latest first
  const sortedBlogs = [...filteredBlogs].sort(
    (a: any, b: any) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  const latestBlog = sortedBlogs[0];
  const otherBlogs = sortedBlogs.slice(1);

  // If search is active, show all filtered results in grid instead of separating latest
  const showSeparateLatest = !searchQuery && sortedBlogs.length > 0;
  const displayBlogs = showSeparateLatest ? otherBlogs : sortedBlogs;

  if (isLoadingBlogs) {
    return (
      <>
        <Header backLink="/" backText="Home" />
        <div className="flex min-h-screen flex-col bg-background">
          <main className="flex-1">
            <section className="bg-muted/50 py-20">
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
        </div>
        <FooterSection />
      </>
    );
  }

  return (
    <>
      <Header backLink="/" backText="Home" />
      <div className="flex min-h-screen flex-col bg-background">
        <main className="flex-1">
          {/* Hero Section */}
          <section className="bg-muted/50 py-20">
            <div className="container mx-auto px-4 text-center">
              <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Blog & Articles
                </span>
              </h1>
              
              <p className="mx-auto mb-8 max-w-3xl text-lg sm:text-xl text-muted-foreground">
                Discover insights, tutorials, and thoughts on web development, design, and technology
              </p>

              <div className="flex items-center justify-center">
                <div className="relative w-full max-w-lg">
                  <Input
                    type="search"
                    placeholder="Search blogs by title, description, or tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-4 pr-12 py-3 text-base border-2 focus:border-primary"
                  />
                  <BookOpen className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                </div>
              </div>
            </div>
          </section>

        {/* Blog Grid */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 max-w-7xl">
            {/* Latest Blog - Featured (only show when not searching) */}
            {!isLoadingBlogs && showSeparateLatest && latestBlog && (
              <div className="mb-12">
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-gradient-to-r from-primary to-secondary text-white px-3 py-1 rounded-full text-sm font-medium">
                      Latest
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold">Latest Blog Post</h2>
                  </div>
                </div>
                <BlogCard blog={latestBlog} variant="featured" />
              </div>
            )}

            {/* Other Blogs Grid or All Blogs when searching */}
            {!isLoadingBlogs && displayBlogs.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl sm:text-2xl font-bold mb-6">
                  {searchQuery ? `Search Results (${displayBlogs.length})` : "More Articles"}
                </h3>
              </div>
            )}

            {/* No results message */}
            {!isLoadingBlogs && searchQuery && displayBlogs.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold mb-2">No blogs found</h3>
                <p className="text-muted-foreground">
                  We couldn't find any blogs matching "{searchQuery}". Try different keywords or{" "}
                  <button 
                    onClick={() => setSearchQuery("")}
                    className="text-primary hover:underline font-medium"
                  >
                    clear your search
                  </button>
                </p>
              </div>
            )}

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
              {isLoadingBlogs
                ? [...Array(6)].map((_, i) => (
                    <div key={i} className="space-y-4">
                      <Skeleton className="h-48 w-full" />
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-6 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  ))
                : displayBlogs.map((blog: Blog) => (
                    <BlogCard key={blog._id} blog={blog} variant="compact" />
                  ))}
            </div>
          </div>
        </section>
      </main>
      </div>
      <FooterSection />
    </>
  );
}
