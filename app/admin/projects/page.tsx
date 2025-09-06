"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ArrowLeft, Plus, Edit, Trash, X, Globe, Github, Upload, GripVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast"


import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  useGetProjectsQuery,
  useAddProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useUpdateProjectOrderMutation
} from "@/services/api"

interface Screenshot {
  url: string
  caption: string
}

interface Screenshot {
  url: string
  caption: string
}

interface Project {
  _id?: string
  title: string
  description: string
  longDescription?: string
  imageUrl: string
  tags: string[]
  liveUrl: string
  githubUrl: string
  featured: boolean
  timeline?: string
  role?: string
  team?: string
  challenges?: string[]
  solutions?: string[]
  screenshots?: Screenshot[]
}

export default function ProjectsPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const { data: projects = [], isLoading } = useGetProjectsQuery(undefined)
  const [updateProjectOrder] = useUpdateProjectOrderMutation()
  const [orderedProjects, setOrderedProjects] = useState<Project[]>([])
  // Sync orderedProjects with projects from API
  useEffect(() => {
    if (projects.length) {
      // Sort by 'order' field if present, fallback to original
      const sorted = [...projects].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      setOrderedProjects(sorted)
    }
  }, [projects])
  // Drag and drop handlers
  const dragItem = useRef<number | null>(null)
  const dragOverItem = useRef<number | null>(null)

  const handleDragStart = (e: React.DragEvent, idx: number) => {
    dragItem.current = idx
  }

  const handleDragEnter = (idx: number) => {
    dragOverItem.current = idx
  }

  const handleDragEnd = async () => {
    const fromIdx = dragItem.current
    const toIdx = dragOverItem.current
    if (fromIdx === null || toIdx === null || fromIdx === toIdx) return
    const updated = [...orderedProjects]
    const [moved] = updated.splice(fromIdx, 1)
    updated.splice(toIdx, 0, moved)
    setOrderedProjects(updated)
    dragItem.current = null
    dragOverItem.current = null
    // Save order to backend
    try {
      await updateProjectOrder({ orderedIds: updated.map(p => p._id) }).unwrap()
      toast({ title: "Order updated", description: "Project order has been updated." })
    } catch {
      toast({ variant: "destructive", title: "Error", description: "Failed to update order." })
    }
  }
  const [addProject] = useAddProjectMutation()
  const [updateProject] = useUpdateProjectMutation()
  const [deleteProject] = useDeleteProjectMutation()

  const [isEditing, setIsEditing] = useState(false)
  const [currentProject, setCurrentProject] = useState<Project | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [formData, setFormData] = useState<Project>({
    title: "",
    description: "",
    longDescription: "",
    imageUrl: "/placeholder.svg?height=600&width=800",
    tags: [],
    liveUrl: "",
    githubUrl: "",
    featured: false,
    timeline: "",
    role: "",
    team: "",
    challenges: [],
    solutions: [],
    screenshots: [],
  });
  const [activeTab, setActiveTab] = useState("basic");
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Update handleEditProject
  const handleEditProject = (project: Project) => {
    setIsEditing(true);
    setCurrentProject(project);
    setPreviewImage(null);
    setFormData({
      ...project,
      imageUrl: project.imageUrl || "/placeholder.svg?height=600&width=800",
      liveUrl: project.liveUrl,
      githubUrl: project.githubUrl,
      tags: project.tags,
    });
    setIsDialogOpen(true);
  };

  const handleNewProject = () => {
    setIsEditing(false)
    setCurrentProject(null)
    setPreviewImage(null)
    setFormData({
      title: "",
      description: "",
      longDescription: "",
      imageUrl: "/placeholder.svg?height=600&width=800",
      tags: [],
      liveUrl: "",
      githubUrl: "",
      featured: false,
      timeline: "",
      role: "",
      team: "",
      challenges: [],
      solutions: [],
      screenshots: [],
    })
    setActiveTab("basic")
    setIsDialogOpen(true)
  }

  const handleImageUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        // Create a local URL for immediate preview
        const previewUrl = URL.createObjectURL(file)
        setPreviewImage(previewUrl)

        // Upload the file to the server
        const formData = new FormData()
        formData.append("file", file)

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (!uploadResponse.ok) throw new Error("Upload failed")
        const uploadData = await uploadResponse.json()

        // Update form data with server URL
        setFormData((prev) => ({
          ...prev,
          imageUrl: uploadData.url, // Use server URL
        }))

        toast({
          title: "Success",
          description: "Image uploaded successfully",
        })
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to upload image",
        })
        // Reset preview on error
        setPreviewImage(null)
      }
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const formattedProject = {
        ...formData,
        tags: Array.isArray(formData.tags) 
          ? formData.tags 
          : (formData.tags as string).split(",").map((tag: string) => tag.trim()).filter((tag: string) => tag),
        challenges: Array.isArray(formData.challenges) ? formData.challenges : [],
        solutions: Array.isArray(formData.solutions) ? formData.solutions : [],
        screenshots: Array.isArray(formData.screenshots) 
          ? formData.screenshots.filter(s => s.url && s.caption)
          : [],
        imageUrl: formData.imageUrl,
        liveUrl: formData.liveUrl,
        githubUrl: formData.githubUrl,
      };

      if (isEditing && currentProject?._id) {
        await updateProject({ _id: currentProject._id, ...formattedProject }).unwrap();
      } else {
        await addProject(formattedProject).unwrap();
      }

      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error saving project:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) {
      return
    }

    try {
      await deleteProject(id).unwrap()
    } catch (error) {
      console.error("Error deleting project:", error)
    }
  }

  const handleToggleFeatured = async (project: Project) => {
    try {
      await updateProject({
        _id: project._id,
        ...project,
        featured: !project.featured
      }).unwrap()
    } catch (error) {
      console.error("Error updating project:", error)
    }
  }

  const handleGoBack = () => {
    router.back()
  }

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Button variant="outline" size="icon" onClick={handleGoBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">Manage Projects</h1>
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="aspect-video relative">
                <Skeleton className="w-full h-full" />
              </div>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                  <Skeleton className="h-8 w-8 rounded" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1">
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                  <Skeleton className="h-5 w-14 rounded-full" />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-16" />
              </CardFooter>
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
          <h1 className="text-2xl font-bold">Manage Projects</h1>
        </div>
        <Button onClick={handleNewProject}>
          <Plus className="mr-2 h-4 w-4" /> Add Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {orderedProjects.map((project: Project, idx: number) => (
          <Card
            key={project._id}
            className="overflow-hidden"
          >
            <div className="aspect-video relative">
              <Image src={project.imageUrl || "/placeholder.svg"} alt={project.title} fill className="object-cover" />
              {project.featured && (
                <div className="absolute right-2 top-2 rounded-full bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">
                  Featured
                </div>
              )}
            </div>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="line-clamp-1 mb-2">{project.title}</CardTitle>
                  <div className="flex flex-wrap gap-1">
                    {project.tags.slice(0, 3).map((tag: string, index: number) => (
                      <span
                        key={index}
                        className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold"
                      >
                        {tag}
                      </span>
                    ))}
                    {project.tags.length > 3 && (
                      <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                        +{project.tags.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="cursor-grab ml-2"
                  onDragStart={(e) => handleDragStart(e, idx)}
                  onDragEnter={() => handleDragEnter(idx)}
                  onDragEnd={handleDragEnd}
                  draggable
                >
                  <GripVertical className="h-4 w-4" />
                  <span className="sr-only">Drag to reorder</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-3">{project.description}</p>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row w-full items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEditProject(project)}>
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => project._id && handleDeleteProject(project._id)}>
                    Delete
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={project.featured}
                    onCheckedChange={() => handleToggleFeatured(project)}
                  />
                  <Label>Featured</Label>
                </div>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[900px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Project" : "Add New Project"}</DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Update the details of your existing project."
                : "Fill in the details to add a new project to your portfolio."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="challenges">Challenges & Solutions</TabsTrigger>
                <TabsTrigger value="screenshots">Screenshots</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" name="title" value={formData.title} onChange={handleInputChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Short Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    className="min-h-[100px]"
                    placeholder="Brief description for project cards"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="longDescription">Long Description</Label>
                  <Textarea
                    id="longDescription"
                    name="longDescription"
                    value={formData.longDescription || ""}
                    onChange={handleInputChange}
                    className="min-h-[150px]"
                    placeholder="Detailed project description with features, technologies used, etc."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="imageUrl">Project Image</Label>
                  <div className="flex flex-col gap-4">
                    <div className="aspect-video w-full relative border rounded-lg overflow-hidden">
                      <Image
                        src={previewImage || formData.imageUrl || "/placeholder.svg"}
                        alt="Project preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleImageUpload}
                        className="flex-1"
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Image
                      </Button>
                      <Input
                        id="imageUrl"
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleInputChange}
                        placeholder="Or paste image URL"
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                  />
                  <Label htmlFor="featured">Featured Project</Label>
                </div>
              </TabsContent>

              <TabsContent value="details" className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input
                    id="tags"
                    name="tags"
                    value={Array.isArray(formData.tags) ? formData.tags.join(", ") : formData.tags}
                    onChange={handleInputChange}
                    placeholder="React, TypeScript, Tailwind CSS"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="liveUrl">Live Link</Label>
                    <Input id="liveUrl" name="liveUrl" value={formData.liveUrl} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="githubUrl">Github Link</Label>
                    <Input id="githubUrl" name="githubUrl" value={formData.githubUrl} onChange={handleInputChange} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="timeline">Timeline</Label>
                    <Input 
                      id="timeline" 
                      name="timeline" 
                      value={formData.timeline || ""} 
                      onChange={handleInputChange}
                      placeholder="e.g., Jan 2023 - Apr 2023"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input 
                      id="role" 
                      name="role" 
                      value={formData.role || ""} 
                      onChange={handleInputChange}
                      placeholder="e.g., Lead Developer, Full Stack Developer"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="team">Team Size</Label>
                  <Input 
                    id="team" 
                    name="team" 
                    value={formData.team || ""} 
                    onChange={handleInputChange}
                    placeholder="e.g., 4 members, Solo project"
                  />
                </div>
              </TabsContent>

              <TabsContent value="challenges" className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="challenges">Challenges (one per line)</Label>
                  <Textarea
                    id="challenges"
                    name="challenges"
                    value={Array.isArray(formData.challenges) ? formData.challenges.join('\n') : ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      challenges: e.target.value.split('\n').filter(line => line.trim())
                    })}
                    className="min-h-[120px]"
                    placeholder="Enter each challenge on a new line..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="solutions">Solutions (one per line)</Label>
                  <Textarea
                    id="solutions"
                    name="solutions"
                    value={Array.isArray(formData.solutions) ? formData.solutions.join('\n') : ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      solutions: e.target.value.split('\n').filter(line => line.trim())
                    })}
                    className="min-h-[120px]"
                    placeholder="Enter each solution on a new line..."
                  />
                </div>
              </TabsContent>

              <TabsContent value="screenshots" className="space-y-4 mt-6">
                <div className="space-y-4">
                  <Label>Project Screenshots</Label>
                  {formData.screenshots && formData.screenshots.map((screenshot, index) => (
                    <div key={index} className="grid grid-cols-3 gap-4 p-4 border rounded-lg">
                      <div className="col-span-2 space-y-2">
                        <Input
                          placeholder="Screenshot URL"
                          value={screenshot.url}
                          onChange={(e) => {
                            const updatedScreenshots = [...(formData.screenshots || [])]
                            updatedScreenshots[index] = { ...screenshot, url: e.target.value }
                            setFormData({ ...formData, screenshots: updatedScreenshots })
                          }}
                        />
                        <Input
                          placeholder="Caption"
                          value={screenshot.caption}
                          onChange={(e) => {
                            const updatedScreenshots = [...(formData.screenshots || [])]
                            updatedScreenshots[index] = { ...screenshot, caption: e.target.value }
                            setFormData({ ...formData, screenshots: updatedScreenshots })
                          }}
                        />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const form = new FormData();
                              form.append("file", file);
                              const uploadResponse = await fetch("/api/upload", {
                                method: "POST",
                                body: form,
                              });
                              if (uploadResponse.ok) {
                                const uploadData = await uploadResponse.json();
                                const updatedScreenshots = [...(formData.screenshots || [])];
                                updatedScreenshots[index] = { ...screenshot, url: uploadData.url };
                                setFormData({ ...formData, screenshots: updatedScreenshots });
                                toast({ title: "Success", description: "Screenshot uploaded successfully" });
                              } else {
                                toast({ variant: "destructive", title: "Error", description: "Failed to upload screenshot" });
                              }
                            }
                          }}
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        {screenshot.url && (
                          <div className="aspect-video relative border rounded overflow-hidden">
                            <Image
                              src={screenshot.url}
                              alt={screenshot.caption || 'Screenshot'}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            const updatedScreenshots = formData.screenshots?.filter((_, i) => i !== index) || []
                            setFormData({ ...formData, screenshots: updatedScreenshots })
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const newScreenshots = [...(formData.screenshots || []), { url: '', caption: '' }]
                      setFormData({ ...formData, screenshots: newScreenshots })
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Screenshot
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
            
            <DialogFooter>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : isEditing ? "Update Project" : "Add Project"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
