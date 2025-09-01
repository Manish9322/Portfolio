"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import {
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  Edit,
  GripVertical,
  Plus,
  Trash,
  Upload,
  Calendar,
  Tag,
  Clock,
  User,
  Link as LinkIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "@/components/ui/use-toast"
import {
  useGetBlogsQuery,
  useAddBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
  useUpdateBlogOrderMutation,
} from "@/services/api"

// Define the BlogPost interface
interface BlogPost {
  _id: string
  title: string
  slug: string
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

const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .concat('-', Date.now().toString())
}

export default function BlogPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const avatarInputRef = useRef<HTMLInputElement>(null)

  // Fetch blog data using RTK Query
  const { data: blogs = [], isLoading } = useGetBlogsQuery(undefined)
  const [addBlog] = useAddBlogMutation()
  const [updateBlog] = useUpdateBlogMutation()
  const [deleteBlog] = useDeleteBlogMutation()
  const [updateBlogOrder] = useUpdateBlogOrderMutation()

  // State
  const [isEditing, setIsEditing] = useState(false)
  const [currentBlog, setCurrentBlog] = useState<BlogPost | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [blogToDelete, setBlogToDelete] = useState<BlogPost | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<"basic" | "content">("basic")
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null)
  const [isOrdering, setIsOrdering] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [localBlogs, setLocalBlogs] = useState<BlogPost[] | null>(null)

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    content: "",
    imageUrl: "/placeholder.svg?height=80&width=80",
    tags: [] as string[],
    readTime: "",
    author: {
      name: "",
      avatar: "",
    },
  })

  const handleEditBlog = (blog: BlogPost) => {
    setIsEditing(true)
    setCurrentBlog(blog)
    setPreviewImage(null)

    setFormData({
      title: blog.title,
      slug: blog.slug,
      description: blog.description,
      content: blog.content,
      imageUrl: blog.imageUrl || "/placeholder.svg?height=80&width=80",
      tags: blog.tags || [],
      readTime: blog.readTime,
      author: {
        name: blog.author?.name || "",
        avatar: blog.author?.avatar || "",
      },
    })

    setIsDialogOpen(true)
    setActiveTab("basic")
  }

  const handleNewBlog = () => {
    setIsEditing(false)
    setCurrentBlog(null)
    setPreviewImage(null)
    setFormData({
      title: "",
      slug: "",
      description: "",
      content: "",
      imageUrl: "/placeholder.svg?height=80&width=80",
      tags: [],
      readTime: "",
      author: {
        name: "",
        avatar: "",
      },
    })
    setIsDialogOpen(true)
    setActiveTab("basic")
  }

        const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        // Create form data
        const formData = new FormData()
        formData.append("file", file)

        // Upload the file
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) throw new Error("Upload failed")
        const data = await response.json()

        // Update form with the new avatar URL
        setFormData(prev => ({
          ...prev,
          author: {
            ...prev.author,
            avatar: data.url
          }
        }))

        // Show preview
        setPreviewAvatar(data.url)

        toast({
          title: "Success",
          description: "Avatar uploaded successfully",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to upload avatar",
          variant: "destructive",
        })
      }
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (name.startsWith("author.")) {
      const field = name.split(".")[1]
      setFormData((prev) => ({
        ...prev,
        author: {
          ...prev.author,
          [field]: value,
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        ...(name === 'title' ? { slug: generateSlug(value) } : {}),
      }))
    }
  }

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(",").map((tag) => tag.trim()).filter(Boolean)
    setFormData((prev) => ({
      ...prev,
      tags,
    }))
  }

  const handleImageUpload = () => {
    fileInputRef.current?.click()
  }

  const handleAvatarUpload = () => {
    avatarInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        // Create a local URL for immediate preview
        const previewUrl = URL.createObjectURL(file)
        setPreviewImage(previewUrl)
        
        // Upload the file
        const formData = new FormData()
        formData.append('file', file)
        
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })
        
        if (!response.ok) throw new Error("Upload failed")
        const data = await response.json()
        
        // Update form data with server URL
        setFormData((prev) => ({
          ...prev,
          imageUrl: data.url, // Use server URL from upload API
        }))

        toast({
          title: "Success",
          description: "Image uploaded successfully",
        })
      } catch (error) {
        console.error('Error uploading file:', error)
        toast({
          title: "Error",
          description: "Failed to upload image. Please try again.",
          variant: "destructive",
        })
        // Reset preview on error
        setPreviewImage(null)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSaving(true)
    setSaveSuccess(false)

    try {
      const blogData = {
        ...formData,
        publishedAt: new Date().toISOString(),
      }

      if (isEditing && currentBlog) {
        await updateBlog({
          _id: currentBlog._id,
          ...blogData,
        }).unwrap()
      } else {
        await addBlog(blogData).unwrap()
      }

      setSaveSuccess(true)
      setTimeout(() => {
        setIsDialogOpen(false)
        setSaveSuccess(false)
      }, 1500)
    } catch (error) {
      console.error("Error saving blog:", error)
      toast({
        title: "Error",
        description: "Failed to save blog post. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteClick = (blog: BlogPost) => {
    setBlogToDelete(blog)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!blogToDelete) return
    try {
      await deleteBlog(blogToDelete._id).unwrap()
      setIsDeleteDialogOpen(false)
    } catch (error) {
      console.error("Error deleting blog:", error)
      toast({
        title: "Error",
        description: "Failed to delete blog post. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleMoveBlog = async (index: number, direction: "up" | "down") => {
    if ((direction === "up" && index === 0) || (direction === "down" && index === blogs.length - 1)) {
      return
    }

    setIsOrdering(true)
    const newIndex = direction === "up" ? index - 1 : index + 1
    const newBlogs = [...blogs]
    const [removed] = newBlogs.splice(index, 1)
    newBlogs.splice(newIndex, 0, removed)
    const orderedIds = newBlogs.map((blog) => blog._id)

    setLocalBlogs(newBlogs)

    try {
      await updateBlogOrder({ orderedIds }).unwrap()
      setLocalBlogs(null)
    } catch (error) {
      console.error("Error updating blog order:", error)
      toast({
        title: "Error",
        description: "Failed to update blog order. Please try again.",
        variant: "destructive",
      })
      setLocalBlogs(null)
    } finally {
      setIsOrdering(false)
    }
  }

  const handleDragStart = (e: React.DragEvent<HTMLButtonElement>, index: number) => {
    setDraggedIndex(index)
    e.dataTransfer.setData("text/plain", index.toString())
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null)
      return
    }

    setIsOrdering(true)
    const newBlogs = [...blogs]
    const [removed] = newBlogs.splice(draggedIndex, 1)
    newBlogs.splice(dropIndex, 0, removed)
    const orderedIds = newBlogs.map((blog) => blog._id)

    setLocalBlogs(newBlogs)

    try {
      await updateBlogOrder({ orderedIds }).unwrap()
      setLocalBlogs(null)
    } catch (error) {
      console.error("Error updating blog order:", error)
      toast({
        title: "Error",
        description: "Failed to update blog order. Please try again.",
        variant: "destructive",
      })
      setLocalBlogs(null)
    } finally {
      setDraggedIndex(null)
      setIsOrdering(false)
    }
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value as "basic" | "content")
  }

  const handleGoBack = () => {
    router.back()
  }

  if (isLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <Skeleton className="h-6 w-1/2 mb-4" />
        <Skeleton className="h-6 w-1/4 mb-4" />
        <div className="grid grid-cols-1 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardHeader>
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Button variant="outline" size="icon" onClick={handleGoBack}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
          <h1 className="text-2xl font-bold">Manage Blog Posts</h1>
        </div>
        <Button onClick={handleNewBlog}>
          <Plus className="mr-2 h-4 w-4" /> Add New Post
        </Button>
      </div>

      {blogs.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <div className="rounded-full bg-muted p-3">
            <Tag className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-medium">No blog posts yet</h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-sm">
            Share your thoughts, experiences, and insights by creating your first blog post.
          </p>
          <Button onClick={handleNewBlog} className="mt-6">
            <Plus className="mr-2 h-4 w-4" /> Create Your First Post
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {(localBlogs || blogs).map((blog: BlogPost, index: number) => (
            <Card
              key={blog._id}
              className="overflow-hidden"
              draggable
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
            >
              <CardHeader className="bg-muted/50 pb-4">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="relative h-14 w-14 overflow-hidden rounded-lg border bg-background">
                      <Image
                        src={blog.imageUrl || "/placeholder.svg"}
                        alt={blog.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{blog.title}</CardTitle>
                      <CardDescription className="text-base flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {blog.author.name} •{" "}
                        <Clock className="h-4 w-4" />
                        {blog.readTime}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-end">
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleMoveBlog(index, "up")}
                        disabled={index === 0 || isOrdering}
                      >
                        <ArrowUp className="h-4 w-4" />
                        <span className="sr-only">Move up</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleMoveBlog(index, "down")}
                        disabled={index === blogs.length - 1 || isOrdering}
                      >
                        <ArrowDown className="h-4 w-4" />
                        <span className="sr-only">Move down</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="cursor-grab"
                        onDragStart={(e) => handleDragStart(e, index)}
                        draggable
                        disabled={isOrdering}
                      >
                        <GripVertical className="h-4 w-4" />
                        <span className="sr-only">Drag to reorder</span>
                      </Button>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleEditBlog(blog)}>
                      <Edit className="mr-2 h-4 w-4" /> Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(blog)}>
                      <Trash className="mr-2 h-4 w-4" /> Delete
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  {blog.tags.map((tag, i) => (
                    <Badge key={i} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{new Date(blog.publishedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">{blog.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Blog Post" : "Add New Blog Post"}</DialogTitle>
            <DialogDescription>
              {isEditing ? "Update your blog post details." : "Create a new blog post for your portfolio."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="content">Content</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4 py-4">
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-16 overflow-hidden rounded-lg border bg-background">
                    <Image
                      src={previewImage || formData.imageUrl}
                      alt="Featured image"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <Button variant="outline" size="sm" type="button" className="h-9" onClick={handleImageUpload}>
                      <Upload className="mr-2 h-4 w-4" /> Upload Image
                    </Button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Recommended: 16:9 ratio, at least 1200x675px
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter blog post title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Write a brief description of your blog post"
                    required
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="author.name">Author Name</Label>
                    <Input
                      id="author.name"
                      name="author.name"
                      value={formData.author.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="author.avatar">Author Avatar</Label>
                    <div className="flex items-center gap-4">
                      <div className="relative h-12 w-12 overflow-hidden rounded-full border bg-background">
                        <Image
                          src={previewAvatar || formData.author.avatar || "/placeholder-user.jpg"}
                          alt="Author avatar"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <Button variant="outline" size="sm" type="button" className="h-9" onClick={handleAvatarUpload}>
                          <Upload className="mr-2 h-4 w-4" /> Upload Avatar
                        </Button>
                        <input
                          type="file"
                          ref={avatarInputRef}
                          className="hidden"
                          accept="image/*"
                          onChange={handleAvatarFileChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="readTime">Read Time</Label>
                    <Input
                      id="readTime"
                      name="readTime"
                      value={formData.readTime}
                      onChange={handleInputChange}
                      placeholder="e.g., 5 min read"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags</Label>
                    <Input
                      id="tags"
                      name="tags"
                      value={formData.tags.join(", ")}
                      onChange={handleTagsChange}
                      placeholder="Enter tags, separated by commas"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="content" className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="content">Blog Content</Label>
                  <Textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    placeholder="Write your blog post content here..."
                    className="min-h-[400px]"
                    required
                  />
                </div>
              </TabsContent>
            </Tabs>

            {saveSuccess && (
              <div className="mt-4 rounded-md bg-green-50 p-3 text-green-800">
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-green-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="text-sm font-medium">Blog post saved successfully!</p>
                </div>
              </div>
            )}

            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : isEditing ? "Update Post" : "Publish Post"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the blog post "{blogToDelete?.title}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
    }
