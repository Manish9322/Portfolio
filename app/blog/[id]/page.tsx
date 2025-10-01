"use client"

import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { ArrowLeft, Calendar, Tag, Clock, User, Eye, MessageCircle, Share2, BookOpen, Heart, ThumbsUp, Send, ExternalLink, Copy, Check, Facebook, Twitter, Linkedin, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useGetBlogQuery, useGetBlogsQuery, useToggleBlogLikeMutation, useAddBlogCommentMutation, useShareBlogMutation } from "@/services/api"
import { useToast } from "@/hooks/use-toast"
import Header from "@/components/Header"
import { FooterSection } from "@/components/home/FooterSection"

export default function BlogDetails() {
  const params = useParams();
  const { toast } = useToast();
  const { data: blog, isLoading, error, refetch } = useGetBlogQuery(params.id as string);
  const { data: allBlogs } = useGetBlogsQuery(undefined);
  const [toggleLike] = useToggleBlogLikeMutation();
  const [addComment] = useAddBlogCommentMutation();
  const [shareBlog] = useShareBlogMutation();
  
  // State for interactions
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  
  // Comment form state
  const [commentForm, setCommentForm] = useState({
    name: '',
    email: '',
    website: '',
    comment: ''
  });

  // Generate user ID for likes (in real app, use actual user authentication)
  const userId = typeof window !== 'undefined' ? 
    localStorage.getItem('blogUserId') || 
    (() => {
      const id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('blogUserId', id);
      return id;
    })() : 'anonymous';

  // Initialize likes state
  useEffect(() => {
    if (blog) {
      setLikesCount(blog.likesCount || blog.likes?.length || 0);
      setIsLiked(blog.likes?.some((like: any) => like.userId === userId) || false);
    }
  }, [blog, userId]);

  // Helper function to safely get author name
  const getAuthorName = (author: any): string => {
    if (!author) return "Admin";
    if (typeof author === "string") return author;
    if (typeof author === "object" && author.name) return author.name;
    return "Admin";
  };

  // Get related blogs based on similar tags
  const getRelatedBlogs = () => {
    if (!blog || !allBlogs) return [];
    
    const currentTags = blog.tags || [];
    const relatedBlogs = allBlogs
      .filter((relatedBlog: any) => relatedBlog._id !== blog._id)
      .map((relatedBlog: any) => {
        const relatedTags = relatedBlog.tags || [];
        const commonTags = currentTags.filter((tag: string) => relatedTags.includes(tag));
        return {
          ...relatedBlog,
          relevanceScore: commonTags.length
        };
      })
      .filter((relatedBlog: any) => relatedBlog.relevanceScore > 0)
      .sort((a: any, b: any) => b.relevanceScore - a.relevanceScore)
      .slice(0, 3);
    
    // If no related blogs by tags, return most recent blogs
    if (relatedBlogs.length === 0) {
      return allBlogs
        .filter((relatedBlog: any) => relatedBlog._id !== blog._id)
        .slice(0, 3);
    }
    
    return relatedBlogs;
  };

  const handleLike = async () => {
    try {
      const result = await toggleLike({ id: params.id, userId }).unwrap();
      setIsLiked(result.liked);
      setLikesCount(result.likesCount);
      
      toast({
        title: result.liked ? "Blog liked!" : "Like removed",
        description: result.liked ? "Thank you for liking this blog post!" : "Like has been removed.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update like status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentForm.name || !commentForm.email || !commentForm.comment) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await addComment({
        id: params.id,
        ...commentForm
      }).unwrap();
      
      toast({
        title: "Comment submitted!",
        description: result.message || "Your comment has been submitted for approval.",
      });
      
      // Reset form
      setCommentForm({
        name: '',
        email: '',
        website: '',
        comment: ''
      });
      
      // Refresh blog data
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit comment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copied!",
        description: "Blog URL copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy URL.",
        variant: "destructive",
      });
    }
  };

  const handleShare = async (platform: string) => {
    const url = window.location.href;
    const title = blog?.title || '';
    const text = blog?.description || '';

    // Increment share count
    try {
      await shareBlog(params.id).unwrap();
    } catch (error) {
      console.error('Failed to increment share count:', error);
    }

    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${text}\n\n${url}`)}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  if (isLoading) {
    return (
      <>
        <Header backLink="/blog" backText="Back to Blogs" />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading blog details...</p>
          </div>
        </div>
        <FooterSection />
      </>
    );
  }

  if (error || !blog) {
    return (
      <>
        <Header backLink="/blog" backText="Back to Blogs" />
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
        <FooterSection />
      </>
    );
  }

  const approvedComments = blog.comments?.filter((comment: any) => comment.approved) || [];

  return (
    <>
      <Header backLink="/blog" backText="Back to Blogs" />
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative mb-6 md:mb-8 lg:mb-12">
          <div className="container mx-auto px-4 pt-6 pb-8 md:pt-8 md:pb-12 lg:pt-12 lg:pb-16">
            <div className="max-w-6xl mx-auto">
              {/* Blog Header */}
              <div className="text-center mb-6 md:mb-8 lg:mb-12">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 md:mb-6 leading-tight text-foreground px-2">
                  {blog.title}
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 md:mb-8 max-w-3xl mx-auto leading-relaxed px-2">
                  {blog.description}
                </p>
                
                {/* Article Meta */}
                <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 sm:gap-6 text-muted-foreground mb-6 md:mb-8 px-2">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                      <AvatarImage src={blog.author?.avatar} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                        {getAuthorName(blog.author)[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                      <p className="font-medium text-foreground text-sm sm:text-base">{getAuthorName(blog.author)}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">Content Writer</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 sm:gap-6">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="text-xs sm:text-sm">{blog.createdAt ? new Date(blog.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : ""}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="text-xs sm:text-sm">{blog.readTime || "5 min read"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Featured Image */}
              {blog.imageUrl && (
                <div className="relative rounded-lg md:rounded-2xl overflow-hidden shadow-xl md:shadow-2xl bg-card border mx-2 md:mx-0">
                  <div className="aspect-[16/9] relative">
                    <Image 
                      src={blog.imageUrl} 
                      alt={blog.title} 
                      fill 
                      className="object-cover" 
                      priority
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="pb-12 md:pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              {/* Article Stats */}
              <Card className="mb-6 md:mb-8 mx-2 md:mx-0">
                <CardContent className="p-4 md:p-6">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    <div className="text-center p-2 md:p-0">
                      <div className="text-xl md:text-2xl font-bold text-primary mb-1">
                        {blog.views || 0}
                      </div>
                      <div className="text-xs md:text-sm text-muted-foreground flex items-center justify-center gap-1">
                        <Eye className="h-3 w-3 md:h-4 md:w-4" />
                        Views
                      </div>
                    </div>
                    <div className="text-center p-2 md:p-0">
                      <div className="text-xl md:text-2xl font-bold text-primary mb-1">
                        {likesCount}
                      </div>
                      <div className="text-xs md:text-sm text-muted-foreground flex items-center justify-center gap-1">
                        <Heart className="h-3 w-3 md:h-4 md:w-4" />
                        Likes
                      </div>
                    </div>
                    <div className="text-center p-2 md:p-0">
                      <div className="text-xl md:text-2xl font-bold text-primary mb-1">
                        {approvedComments.length}
                      </div>
                      <div className="text-xs md:text-sm text-muted-foreground flex items-center justify-center gap-1">
                        <MessageCircle className="h-3 w-3 md:h-4 md:w-4" />
                        Comments
                      </div>
                    </div>
                    <div className="text-center p-2 md:p-0">
                      <div className="text-xl md:text-2xl font-bold text-primary mb-1">
                        {blog.shares || 0}
                      </div>
                      <div className="text-xs md:text-sm text-muted-foreground flex items-center justify-center gap-1">
                        <Share2 className="h-3 w-3 md:h-4 md:w-4" />
                        Shares
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid lg:grid-cols-4 gap-6 md:gap-8">
                {/* Article Content */}
                <div className="lg:col-span-3 px-2 md:px-0">
                  {/* Tags */}
                  {blog.tags && blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6 md:mb-8">
                      {blog.tags.map((tag: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs px-2 py-0.5 hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer">
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Blog Content */}
                  <Card className="mb-6 md:mb-8">
                    <CardHeader className="pb-4 md:pb-6">
                      <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                        <BookOpen className="h-4 w-4 md:h-5 md:w-5" />
                        Article Content
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 md:px-6">
                      <div className="prose prose-sm sm:prose-base lg:prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:text-foreground prose-p:text-muted-foreground prose-p:leading-relaxed prose-a:text-primary hover:prose-a:text-primary/80 prose-strong:text-foreground prose-ul:text-muted-foreground prose-ol:text-muted-foreground prose-blockquote:border-primary prose-blockquote:text-muted-foreground prose-code:text-primary prose-pre:bg-muted">
                        <div dangerouslySetInnerHTML={{ __html: blog.content || blog.description }} />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Article Actions */}
                  <Card className="mb-6 md:mb-8">
                    <CardContent className="p-4 md:p-6">
                      <div className="flex flex-col gap-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                          <Button 
                            onClick={handleLike} 
                            variant={isLiked ? "default" : "outline"} 
                            size="sm" 
                            className="gap-2 w-full sm:w-auto"
                          >
                            <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                            {likesCount} {likesCount === 1 ? 'Like' : 'Likes'}
                          </Button>
                          <Button 
                            onClick={() => document.getElementById('comments')?.scrollIntoView({ behavior: 'smooth' })}
                            variant="outline" 
                            size="sm" 
                            className="gap-2 w-full sm:w-auto"
                          >
                            <MessageCircle className="h-4 w-4" />
                            Comment
                          </Button>
                        </div>
                        <div className="flex flex-col gap-3">
                          <Button 
                            onClick={() => setShowShareOptions(!showShareOptions)}
                            variant="outline" 
                            size="sm" 
                            className="gap-2 w-full sm:w-auto sm:self-start"
                          >
                            <Share2 className="h-4 w-4" />
                            Share Article
                          </Button>
                          {showShareOptions && (
                            <div className="grid grid-cols-4 sm:flex gap-2 p-3 bg-muted/50 rounded-lg">
                              <Button
                                onClick={() => handleShare('facebook')}
                                size="sm"
                                variant="ghost"
                                className="h-10 w-10 p-0 hover:bg-blue-500/10 hover:text-blue-600"
                                title="Share on Facebook"
                              >
                                <Facebook className="h-4 w-4" />
                              </Button>
                              <Button
                                onClick={() => handleShare('twitter')}
                                size="sm"
                                variant="ghost"
                                className="h-10 w-10 p-0 hover:bg-sky-500/10 hover:text-sky-600"
                                title="Share on Twitter"
                              >
                                <Twitter className="h-4 w-4" />
                              </Button>
                              <Button
                                onClick={() => handleShare('linkedin')}
                                size="sm"
                                variant="ghost"
                                className="h-10 w-10 p-0 hover:bg-blue-700/10 hover:text-blue-700"
                                title="Share on LinkedIn"
                              >
                                <Linkedin className="h-4 w-4" />
                              </Button>
                              <Button
                                onClick={() => handleShare('email')}
                                size="sm"
                                variant="ghost"
                                className="h-10 w-10 p-0 hover:bg-gray-500/10 hover:text-gray-600"
                                title="Share via Email"
                              >
                                <Mail className="h-4 w-4" />
                              </Button>
                              <Button
                                onClick={copyToClipboard}
                                size="sm"
                                variant="ghost"
                                className="h-10 w-10 p-0 hover:bg-gray-500/10 hover:text-gray-600"
                                title="Copy Link"
                              >
                                {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Comments Section */}
                  <Card id="comments" className="">
                    <CardHeader className="pb-4 md:pb-6">
                      <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                        <MessageCircle className="h-4 w-4 md:h-5 md:w-5" />
                        Comments ({approvedComments.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 md:px-6">
                      {/* Comment Form */}
                      <form onSubmit={handleComment} className="mb-6 md:mb-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-4">
                          <div>
                            <Label htmlFor="name" className="text-sm font-medium">Name *</Label>
                            <Input
                              id="name"
                              value={commentForm.name}
                              onChange={(e) => setCommentForm(prev => ({ ...prev, name: e.target.value }))}
                              placeholder="Your name"
                              required
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="email" className="text-sm font-medium">Email *</Label>
                            <Input
                              id="email"
                              type="email"
                              value={commentForm.email}
                              onChange={(e) => setCommentForm(prev => ({ ...prev, email: e.target.value }))}
                              placeholder="Your email"
                              required
                              className="mt-1"
                            />
                          </div>
                        </div>
                        <div className="mb-4">
                          <Label htmlFor="website" className="text-sm font-medium">Website (optional)</Label>
                          <Input
                            id="website"
                            type="url"
                            value={commentForm.website}
                            onChange={(e) => setCommentForm(prev => ({ ...prev, website: e.target.value }))}
                            placeholder="Your website"
                            className="mt-1"
                          />
                        </div>
                        <div className="mb-4">
                          <Label htmlFor="comment" className="text-sm font-medium">Comment *</Label>
                          <Textarea
                            id="comment"
                            value={commentForm.comment}
                            onChange={(e) => setCommentForm(prev => ({ ...prev, comment: e.target.value }))}
                            placeholder="Share your thoughts..."
                            rows={4}
                            required
                            className="mt-1 resize-none"
                          />
                        </div>
                        <Button type="submit" className="gap-2 w-full sm:w-auto">
                          <Send className="h-4 w-4" />
                          Submit Comment
                        </Button>
                      </form>

                      <Separator className="mb-6" />

                      {/* Comments List */}
                      <div className="space-y-6">
                        {approvedComments.length === 0 ? (
                          <p className="text-center text-muted-foreground py-8">
                            No comments yet. Be the first to comment!
                          </p>
                        ) : (
                          approvedComments.map((comment: any, index: number) => (
                            <div key={comment.id || index} className="border rounded-lg p-4">
                              <div className="flex items-start gap-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarFallback>{comment.name[0].toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h4 className="font-medium">
                                      {comment.website ? (
                                        <Link 
                                          href={comment.website} 
                                          target="_blank" 
                                          rel="noopener noreferrer"
                                          className="text-primary hover:text-primary/80"
                                        >
                                          {comment.name}
                                          <ExternalLink className="inline h-3 w-3 ml-1" />
                                        </Link>
                                      ) : (
                                        comment.name
                                      )}
                                    </h4>
                                    <span className="text-sm text-muted-foreground">
                                      {comment.timestamp ? new Date(comment.timestamp).toLocaleDateString() : ''}
                                    </span>
                                  </div>
                                  <p className="text-muted-foreground">{comment.comment}</p>
                                  
                                  {/* Replies */}
                                  {comment.replies && comment.replies.filter((reply: any) => reply.approved).length > 0 && (
                                    <div className="mt-4 pl-4 border-l-2 border-muted space-y-3">
                                      {comment.replies.filter((reply: any) => reply.approved).map((reply: any, replyIndex: number) => (
                                        <div key={reply.id || replyIndex} className="flex items-start gap-3">
                                          <Avatar className="h-8 w-8">
                                            <AvatarFallback>{reply.name[0].toUpperCase()}</AvatarFallback>
                                          </Avatar>
                                          <div>
                                            <div className="flex items-center gap-2 mb-1">
                                              <h5 className="font-medium text-sm">{reply.name}</h5>
                                              <span className="text-xs text-muted-foreground">
                                                {reply.timestamp ? new Date(reply.timestamp).toLocaleDateString() : ''}
                                              </span>
                                            </div>
                                            <p className="text-sm text-muted-foreground">{reply.comment}</p>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar */}
                <div className="mt-8 lg:mt-0 lg:sticky lg:top-6 lg:h-fit px-2 md:px-0">
                  {/* Blog Topics */}
                  <Card className="mb-4 md:mb-6">
                    <CardHeader className="pb-3 md:pb-4">
                      <CardTitle className="text-base md:text-lg flex items-center gap-2">
                        <Tag className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                        Blog Topics
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 md:px-6">
                      {blog.tags && blog.tags.length > 0 ? (
                        <div className="space-y-3">
                          <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-4">
                            Explore topics covered in this article
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {blog.tags.map((tag: string, index: number) => (
                              <Badge 
                                key={index} 
                                variant="secondary" 
                                className="text-xs px-2 py-0.5 hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                              >
                                <Tag className="h-2.5 w-2.5 mr-1" />
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8 md:h-10 md:w-10">
                                <AvatarImage src={blog.author?.avatar} />
                                <AvatarFallback className="text-sm">{getAuthorName(blog.author)[0]}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-xs md:text-sm font-medium">Written by</p>
                                <p className="text-xs md:text-sm text-muted-foreground">{getAuthorName(blog.author)}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <Tag className="h-6 w-6 md:h-8 md:w-8 text-muted-foreground mx-auto mb-2" />
                          <p className="text-xs md:text-sm text-muted-foreground">No topics tagged for this article</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Article Info */}
                  <Card className="mb-4 md:mb-6">
                    <CardHeader className="pb-3 md:pb-4">
                      <CardTitle className="text-base md:text-lg">Article Info</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 md:space-y-4 px-4 md:px-6">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs md:text-sm font-medium">Published</p>
                          <p className="text-xs md:text-sm text-muted-foreground">
                            {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : ""}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs md:text-sm font-medium">Reading Time</p>
                          <p className="text-xs md:text-sm text-muted-foreground">{blog.readTime || "5 min read"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Eye className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs md:text-sm font-medium">Views</p>
                          <p className="text-xs md:text-sm text-muted-foreground">{blog.views || 0}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Related Articles */}
                  <Card>
                    <CardHeader className="pb-3 md:pb-4">
                      <CardTitle className="text-base md:text-lg flex items-center gap-2">
                        <BookOpen className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                        Related Articles
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 md:px-6">
                      {getRelatedBlogs().length > 0 ? (
                        <div className="space-y-3 md:space-y-4">
                          {getRelatedBlogs().map((relatedBlog: any, index: number) => (
                            <Link 
                              key={relatedBlog._id} 
                              href={`/blog/${relatedBlog._id}`}
                              className="block group"
                            >
                              <div className="border rounded-lg p-3 md:p-4 hover:border-primary transition-colors">
                                <div className="flex gap-2 md:gap-3">
                                  {relatedBlog.imageUrl && (
                                    <div className="relative w-12 h-12 md:w-16 md:h-16 flex-shrink-0 rounded-md md:rounded-lg overflow-hidden">
                                      <Image
                                        src={relatedBlog.imageUrl}
                                        alt={relatedBlog.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                      />
                                    </div>
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-xs md:text-sm leading-tight group-hover:text-primary transition-colors line-clamp-2">
                                      {relatedBlog.title}
                                    </h4>
                                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                      {relatedBlog.description}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1 md:mt-2">
                                      <Clock className="h-2.5 w-2.5 md:h-3 md:w-3 text-muted-foreground" />
                                      <span className="text-xs text-muted-foreground">
                                        {relatedBlog.readTime || "5 min read"}
                                      </span>
                                    </div>
                                    {relatedBlog.tags && relatedBlog.tags.length > 0 && (
                                      <div className="flex flex-wrap gap-1 mt-1 md:mt-2">
                                        {relatedBlog.tags.slice(0, 2).map((tag: string, tagIndex: number) => (
                                          <Badge key={tagIndex} variant="outline" className="text-xs px-1 py-0 h-3 md:h-4">
                                            {tag}
                                          </Badge>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </Link>
                          ))}
                          
                          {/* Quick Share Options */}
                          <div className="mt-4 md:mt-6 pt-3 md:pt-4 border-t">
                            <h5 className="text-xs md:text-sm font-medium mb-2 md:mb-3 flex items-center gap-2">
                              <Share2 className="h-3 w-3 md:h-4 md:w-4" />
                              Share This Article
                            </h5>
                            <div className="grid grid-cols-4 gap-2">
                              <Button
                                onClick={() => handleShare('facebook')}
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 hover:bg-blue-500/10 hover:text-blue-600"
                                title="Share on Facebook"
                              >
                                <Facebook className="h-3 w-3 md:h-4 md:w-4" />
                              </Button>
                              <Button
                                onClick={() => handleShare('twitter')}
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 hover:bg-sky-500/10 hover:text-sky-600"
                                title="Share on Twitter"
                              >
                                <Twitter className="h-3 w-3 md:h-4 md:w-4" />
                              </Button>
                              <Button
                                onClick={() => handleShare('linkedin')}
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 hover:bg-blue-700/10 hover:text-blue-700"
                                title="Share on LinkedIn"
                              >
                                <Linkedin className="h-3 w-3 md:h-4 md:w-4" />
                              </Button>
                              <Button
                                onClick={copyToClipboard}
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0"
                                title="Copy Link"
                              >
                                {copied ? <Check className="h-3 w-3 md:h-4 md:w-4 text-green-600" /> : <Copy className="h-3 w-3 md:h-4 md:w-4" />}
                              </Button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-6 md:py-8">
                          <BookOpen className="h-8 w-8 md:h-12 md:w-12 text-muted-foreground mx-auto mb-2 md:mb-3" />
                          <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-4">No related articles found</p>
                          <Button asChild variant="outline" size="sm" className="text-xs">
                            <Link href="/blog">
                              Browse All Articles
                            </Link>
                          </Button>
                          
                          {/* Quick Share Options even when no related blogs */}
                          <div className="mt-4 md:mt-6 pt-3 md:pt-4 border-t">
                            <h5 className="text-xs md:text-sm font-medium mb-2 md:mb-3 flex items-center justify-center gap-2">
                              <Share2 className="h-3 w-3 md:h-4 md:w-4" />
                              Share This Article
                            </h5>
                            <div className="grid grid-cols-4 gap-2 max-w-32 mx-auto">
                              <Button
                                onClick={() => handleShare('facebook')}
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 hover:bg-blue-500/10 hover:text-blue-600"
                                title="Share on Facebook"
                              >
                                <Facebook className="h-3 w-3 md:h-4 md:w-4" />
                              </Button>
                              <Button
                                onClick={() => handleShare('twitter')}
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 hover:bg-sky-500/10 hover:text-sky-600"
                                title="Share on Twitter"
                              >
                                <Twitter className="h-3 w-3 md:h-4 md:w-4" />
                              </Button>
                              <Button
                                onClick={() => handleShare('linkedin')}
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 hover:bg-blue-700/10 hover:text-blue-700"
                                title="Share on LinkedIn"
                              >
                                <Linkedin className="h-3 w-3 md:h-4 md:w-4" />
                              </Button>
                              <Button
                                onClick={copyToClipboard}
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0"
                                title="Copy Link"
                              >
                                {copied ? <Check className="h-3 w-3 md:h-4 md:w-4 text-green-600" /> : <Copy className="h-3 w-3 md:h-4 md:w-4" />}
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <FooterSection />
    </>
  );
}
