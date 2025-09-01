"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ArrowLeft, Plus, Edit, Trash, X, Globe, Github } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


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
  useDeleteProjectMutation
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
  const { data: projects = [], isLoading } = useGetProjectsQuery(undefined)
  const [addProject] = useAddProjectMutation()
  const [updateProject] = useUpdateProjectMutation()
  const [deleteProject] = useDeleteProjectMutation()

  const [isEditing, setIsEditing] = useState(false)
  const [currentProject, setCurrentProject] = useState<Project | null>(null)
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
    setFormData({
      title: "",
      description: "",
      imageUrl: "/placeholder.svg?height=600&width=800",
      tags: [],
      liveUrl: "",
      githubUrl: "",
      featured: false,
    })
    setIsDialogOpen(true)
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
    return <div className="p-6">Loading projects...</div>
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
        {projects.map((project: Project) => (
          <Card key={project._id} className="overflow-hidden">
            <div className="aspect-video relative">
              <Image src={project.imageUrl || "/placeholder.svg"} alt={project.title} fill className="object-cover" />
              {project.featured && (
                <div className="absolute right-2 top-2 rounded-full bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">
                  Featured
                </div>
              )}
            </div>
            <CardHeader>
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
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Project" : "Add New Project"}</DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Update the details of your existing project."
                : "Fill in the details to add a new project to your portfolio."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" value={formData.title} onChange={handleInputChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  className="min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input id="imageUrl" name="imageUrl" value={formData.imageUrl} onChange={handleInputChange} required />
              </div>
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
              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                />
                <Label htmlFor="featured">Featured Project</Label>
              </div>
            </div>
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
