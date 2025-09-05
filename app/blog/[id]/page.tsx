"use client"

import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Calendar, Tag, Clock, User, Eye, MessageCircle, Share2, BookOpen, Heart, ThumbsUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useGetBlogQuery } from "@/services/api"

export default function BlogDetails() {
  const params = useParams();
  const { data: blog, isLoading, error } = useGetBlogQuery(params.id as string);

  // Helper function to safely get author name
  const getAuthorName = (author: any): string => {
    if (!author) return "Admin";
    if (typeof author === "string") return author;
    if (typeof author === "object" && author.name) return author.name;
    return "Admin";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading blog details...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Blog Not Found</h1>
          <p className="text-muted-foreground mb-6">The blog you're looking for doesn't exist.</p>
          <Button asChild>
            <Link href="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blogs
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <div className="container mx-auto px-4 py-6">
        <Button variant="ghost" className="mb-4" asChild>
          <Link href="/blog">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blogs
          </Link>
        </Button>
      </div>

      {/* Hero Section */}
      <section className="relative mb-8 lg:mb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Blog Image */}
            {blog.imageUrl && (
              <div className="aspect-[16/9] relative rounded-xl overflow-hidden mb-6 lg:mb-8 shadow-2xl">
                <Image 
                  src={blog.imageUrl} 
                  alt={blog.title} 
                  fill 
                  className="object-cover" 
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>
            )}

            {/* Blog Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                {blog.title}
              </h1>
              
              {/* Blog Meta */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-muted-foreground text-sm mb-6">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{getAuthorName(blog.author)}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : ""}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{blog.readTime || "5 min read"}</span>
                </div>
              </div>

              {/* Tags */}
              {blog.tags && blog.tags.length > 0 && (
                <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
                  {blog.tags.map((tag: string, index: number) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Stats */}
      <section className="py-6 lg:py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              <div className="text-center p-4 rounded-lg bg-card border">
                <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">
                  {blog.views || 0}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground flex items-center justify-center gap-1">
                  <Eye className="h-4 w-4" />
                  Views
                </div>
              </div>
              <div className="text-center p-4 rounded-lg bg-card border">
                <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">
                  {blog.likes || 0}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground flex items-center justify-center gap-1">
                  <Heart className="h-4 w-4" />
                  Likes
                </div>
              </div>
              <div className="text-center p-4 rounded-lg bg-card border">
                <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">
                  {blog.comments || 0}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground flex items-center justify-center gap-1">
                  <MessageCircle className="h-4 w-4" />
                  Comments
                </div>
              </div>
              <div className="text-center p-4 rounded-lg bg-card border">
                <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">
                  {blog.shares || 0}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground flex items-center justify-center gap-1">
                  <Share2 className="h-4 w-4" />
                  Shares
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 lg:py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-4 gap-8 lg:gap-12">
              {/* Article Content */}
              <div className="lg:col-span-3">
                {/* Blog Content */}
                <div className="bg-card border rounded-xl p-6 lg:p-8 mb-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                    <h2 className="text-xl lg:text-2xl font-bold">Article Content</h2>
                  </div>
                  
                  <div className="prose prose-gray dark:prose-invert max-w-none prose-headings:font-bold prose-headings:text-foreground prose-p:text-muted-foreground prose-p:leading-relaxed prose-a:text-primary prose-strong:text-foreground prose-ul:text-muted-foreground prose-ol:text-muted-foreground">
                    <div dangerouslySetInnerHTML={{ __html: blog.content || blog.description }} />
                  </div>
                </div>

                {/* Article Summary */}
                {blog.summary && (
                  <div className="bg-card border rounded-xl p-6 lg:p-8 mb-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-blue-500/10 rounded-lg">
                        <BookOpen className="h-5 w-5 text-blue-500" />
                      </div>
                      <h3 className="text-xl font-bold">Key Takeaways</h3>
                    </div>
                    <div className="text-muted-foreground leading-relaxed">
                      {blog.summary}
                    </div>
                  </div>
                )}

                {/* Related Topics */}
                {blog.relatedTopics && blog.relatedTopics.length > 0 && (
                  <div className="bg-card border rounded-xl p-6 lg:p-8 mb-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-green-500/10 rounded-lg">
                        <Tag className="h-5 w-5 text-green-500" />
                      </div>
                      <h3 className="text-xl font-bold">Related Topics</h3>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {blog.relatedTopics.map((topic: string, index: number) => (
                        <div key={index} className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                          <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                          <p className="text-sm leading-relaxed">{topic}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Author's Note */}
                {blog.authorNote && (
                  <div className="bg-card border rounded-xl p-6 lg:p-8 mb-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-purple-500/10 rounded-lg">
                        <User className="h-5 w-5 text-purple-500" />
                      </div>
                      <h3 className="text-xl font-bold">Author's Note</h3>
                    </div>
                    <div className="text-muted-foreground leading-relaxed italic">
                      "{blog.authorNote}"
                    </div>
                  </div>
                )}

                {/* Article Actions */}
                <div className="bg-card border rounded-xl p-6 lg:p-8">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <Button variant="outline" size="sm" className="gap-2">
                        <ThumbsUp className="h-4 w-4" />
                        Like ({blog.likes || 0})
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2">
                        <MessageCircle className="h-4 w-4" />
                        Comment
                      </Button>
                    </div>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Share2 className="h-4 w-4" />
                      Share Article
                    </Button>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:sticky lg:top-6 lg:h-fit space-y-6">
                {/* Article Info */}
                <div className="bg-card border rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4">Article Info</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Author</p>
                        <p className="text-sm text-muted-foreground">{getAuthorName(blog.author)}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Published</p>
                        <p className="text-sm text-muted-foreground">
                          {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : ""}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Reading Time</p>
                        <p className="text-sm text-muted-foreground">{blog.readTime || "5 min read"}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Eye className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Views</p>
                        <p className="text-sm text-muted-foreground">{blog.views || 0}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Categories */}
                {blog.categories && blog.categories.length > 0 && (
                  <div className="bg-card border rounded-xl p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Tag className="h-5 w-5 text-primary" />
                      Categories
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {blog.categories.map((category: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="bg-card border rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                      <BookOpen className="h-4 w-4" />
                      Save to Reading List
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                      <Share2 className="h-4 w-4" />
                      Share Article
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                      <MessageCircle className="h-4 w-4" />
                      Leave Comment
                    </Button>
                  </div>
                </div>

                {/* Table of Contents */}
                {blog.tableOfContents && blog.tableOfContents.length > 0 && (
                  <div className="bg-card border rounded-xl p-6">
                    <h3 className="text-lg font-semibold mb-4">Table of Contents</h3>
                    <div className="space-y-2">
                      {blog.tableOfContents.map((item: any, index: number) => (
                        <a
                          key={index}
                          href={`#${item.id}`}
                          className="block text-sm text-muted-foreground hover:text-foreground transition-colors p-2 -m-2 rounded-lg hover:bg-muted/50"
                        >
                          {item.title}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}