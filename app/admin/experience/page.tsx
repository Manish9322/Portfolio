"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import {
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  Calendar,
  Edit,
  Globe,
  GripVertical,
  MapPin,
  Plus,
  Trash,
  Upload,
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
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog"
import {
  useGetExperiencesQuery,
  useAddExperienceMutation,
  useUpdateExperienceMutation,
  useDeleteExperienceMutation,
  useUpdateExperienceOrderMutation,
} from "@/services/api"
import { toast } from "@/components/ui/use-toast"

// Define TypeScript interfaces
interface Project {
  name: string
  description: string
}

interface Experience {
  _id: string
  company: string
  position: string
  period: string
  location?: string
  description: string
  logo?: string
  achievements: string[]
  technologies: string[]
  responsibilities: string[]
  projects: Project[]
  website?: string
  startDate?: string
  endDate?: string
  teamSize?: string
  industry?: string
  order: number
}

interface FormData {
  company: string
  position: string
  period: string
  location: string
  description: string
  logo: string
  achievements: string[]
  technologies: string[]
  responsibilities: string[]
  projects: Project[]
  website: string
  startDate: string
  endDate: string
  teamSize: string
  industry: string
}

export default function ExperiencePage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Fetch experiences from API
  const { data: experiences = [], isLoading, error } = useGetExperiencesQuery(undefined)
  console.log("Experience Data : ", experiences)
  const [addExperience, { isLoading: isAdding }] = useAddExperienceMutation()
  const [updateExperience, { isLoading: isUpdating }] = useUpdateExperienceMutation()
  const [deleteExperience, { isLoading: isDeleting }] = useDeleteExperienceMutation()
  const [updateExperienceOrder] = useUpdateExperienceOrderMutation()

  const [isEditing, setIsEditing] = useState(false)
  const [currentExperience, setCurrentExperience] = useState<Experience | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [experienceToDelete, setExperienceToDelete] = useState<Experience | null>(null)
  const [activeTab, setActiveTab] = useState<"basic" | "achievements" | "projects">("basic")
  const [previewLogo, setPreviewLogo] = useState<string | null>(null)

  const [formData, setFormData] = useState<FormData>({
    company: "",
    position: "",
    period: "",
    location: "",
    description: "",
    logo: "/placeholder.svg?height=80&width=80",
    achievements: ["", "", ""],
    technologies: ["", "", "", "", ""],
    responsibilities: ["", "", ""],
    projects: [
      { name: "", description: "" },
      { name: "", description: "" },
    ],
    website: "",
    startDate: "",
    endDate: "",
    teamSize: "",
    industry: "",
  })

  // Handle API errors
  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load experiences. Please try again.",
      })
    }
  }, [error])

  const handleEditExperience = (experience: Experience) => {
    setIsEditing(true)
    setCurrentExperience(experience)
    setPreviewLogo(null)

    // Format arrays with minimum items
    const achievements = [...(experience.achievements || [])]
    while (achievements.length < 3) achievements.push("")

    const technologies = [...(experience.technologies || [])]
    while (technologies.length < 5) technologies.push("")

    const responsibilities = [...(experience.responsibilities || [])]
    while (responsibilities.length < 3) responsibilities.push("")

    const projects = [...(experience.projects || [])]
    while (projects.length < 2) projects.push({ name: "", description: "" })

    setFormData({
      company: experience.company || "",
      position: experience.position || "",
      period: experience.period || "",
      location: experience.location || "",
      description: experience.description || "",
      logo: experience.logo || "/placeholder.svg?height=80&width=80",
      achievements,
      technologies,
      responsibilities,
      projects,
      website: experience.website || "",
      startDate: experience.startDate || "",
      endDate: experience.endDate || "",
      teamSize: experience.teamSize || "",
      industry: experience.industry || "",
    })

    setIsDialogOpen(true)
    setActiveTab("basic")
  }

  const handleNewExperience = () => {
    setIsEditing(false)
    setCurrentExperience(null)
    setPreviewLogo(null)
    setFormData({
      company: "",
      position: "",
      period: "",
      location: "",
      description: "",
      logo: "/placeholder.svg?height=80&width=80",
      achievements: ["", "", ""],
      technologies: ["", "", "", "", ""],
      responsibilities: ["", "", ""],
      projects: [
        { name: "", description: "" },
        { name: "", description: "" },
      ],
      website: "",
      startDate: "",
      endDate: "",
      teamSize: "",
      industry: "",
    })
    setIsDialogOpen(true)
    setActiveTab("basic")
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleArrayInputChange = (field: "achievements" | "technologies" | "responsibilities", index: number, value: string) => {
    setFormData((prev) => {
      const newArray = [...prev[field]]
      newArray[index] = value
      return { ...prev, [field]: newArray }
    })
  }

  const handleProjectInputChange = (index: number, field: "name" | "description", value: string) => {
    setFormData((prev) => {
      const newProjects = [...prev.projects]
      newProjects[index] = { ...newProjects[index], [field]: value }
      return { ...prev, projects: newProjects }
    })
  }

  const handleRemoveArrayItem = (field: "achievements" | "technologies" | "responsibilities", index: number) => {
    setFormData((prev) => {
      const newArray = [...prev[field]]
      newArray.splice(index, 1)
      return { ...prev, [field]: newArray }
    })
  }

  const handleRemoveProject = (index: number) => {
    setFormData((prev) => {
      const newProjects = [...prev.projects]
      newProjects.splice(index, 1)
      return { ...prev, projects: newProjects }
    })
  }

  const handleLogoUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // For now, create a local URL for preview
      // TODO: Implement actual file upload to server
      const previewUrl = URL.createObjectURL(file)
      setPreviewLogo(previewUrl)
      setFormData((prev) => ({
        ...prev,
        logo: previewUrl, // Replace with server URL after upload
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Filter out empty entries
      const formattedData = {
        ...formData,
        achievements: formData.achievements.filter((a) => a.trim()),
        technologies: formData.technologies.filter((t) => t.trim()),
        responsibilities: formData.responsibilities.filter((r) => r.trim()),
        projects: formData.projects.filter((p) => p.name.trim() || p.description.trim()),
      }

      if (isEditing && currentExperience) {
        await updateExperience({
          _id: currentExperience._id,
          ...formattedData,
        }).unwrap()
        toast({
          title: "Success",
          description: "Experience updated successfully!",
        })
      } else {
        await addExperience(formattedData).unwrap()
        toast({
          title: "Success",
          description: "Experience added successfully!",
        })
      }

      setIsDialogOpen(false)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save experience. Please try again.",
      })
    }
  }

  const handleDeleteClick = (experience: Experience) => {
    setExperienceToDelete(experience)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!experienceToDelete) return

    try {
      await deleteExperience(experienceToDelete._id).unwrap()
      setIsDeleteDialogOpen(false)
      toast({
        title: "Success",
        description: "Experience deleted successfully!",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete experience. Please try again.",
      })
    }
  }

  const handleMoveExperience = async (index: number, direction: "up" | "down") => {
    if ((direction === "up" && index === 0) || (direction === "down" && index === experiences.length - 1)) {
      return
    }

    const newExperiences = [...experiences]
    const [movedExperience] = newExperiences.splice(index, 1)
    const newIndex = direction === "up" ? index - 1 : index + 1
    newExperiences.splice(newIndex, 0, movedExperience)

    // Update order in the backend
    const orderedIds = newExperiences.map((exp: Experience) => exp._id)
    try {
      await updateExperienceOrder({ orderedIds }).unwrap()
      toast({
        title: "Success",
        description: "Experience order updated successfully!",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update experience order. Please try again.",
      })
    }
  }

  const handleGoBack = () => {
    router.back()
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Button variant="outline" size="icon" onClick={handleGoBack}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
          <h1 className="text-2xl font-bold">Manage Experience</h1>
        </div>
        <Button onClick={handleNewExperience} disabled={isLoading}>
          <Plus className="mr-2 h-4 w-4" /> Add Experience
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          {[...Array(3)].map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="bg-muted/50 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-full bg-muted animate-pulse"></div>
                    <div className="space-y-2">
                      <div className="h-6 w-40 bg-muted animate-pulse"></div>
                      <div className="h-4 w-32 bg-muted animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="h-4 w-48 bg-muted animate-pulse"></div>
                  <div className="h-4 w-full bg-muted animate-pulse"></div>
                  <div className="h-4 w-5/6 bg-muted animate-pulse"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : experiences.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <div className="rounded-full bg-muted p-3">
            <Calendar className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-medium">No experience entries yet</h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-sm">
            Add your work experience to showcase your professional journey on your portfolio.
          </p>
          <Button onClick={handleNewExperience} className="mt-6">
            <Plus className="mr-2 h-4 w-4" /> Add Your First Experience
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {experiences.map((experience: Experience, index: number) => (
            <Card key={experience._id} className="overflow-hidden">
              <CardHeader className="bg-muted/50 pb-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-4">
                    <div className="relative h-14 w-14 overflow-hidden rounded-full border bg-background">
                      <Image
                        src={experience.logo || "/placeholder.svg"}
                        alt={experience.company}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{experience.position}</CardTitle>
                      <CardDescription className="text-base">
                        {experience.company} • {experience.period}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleMoveExperience(index, "up")}
                        disabled={index === 0 || isDeleting}
                      >
                        <ArrowUp className="h-4 w-4" />
                        <span className="sr-only">Move up</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleMoveExperience(index, "down")}
                        disabled={index === experiences.length - 1 || isDeleting}
                      >
                        <ArrowDown className="h-4 w-4" />
                        <span className="sr-only">Move down</span>
                      </Button>
                      <Button variant="ghost" size="icon" className="cursor-grab">
                        <GripVertical className="h-4 w-4" />
                        <span className="sr-only">Drag to reorder</span>
                      </Button>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditExperience(experience)}
                      disabled={isDeleting}
                    >
                      <Edit className="mr-2 h-4 w-4" /> Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteClick(experience)}
                      disabled={isDeleting}
                    >
                      <Trash className="mr-2 h-4 w-4" /> Delete
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  {experience.location && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>{experience.location}</span>
                    </div>
                  )}
                  {experience.website && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Globe className="h-3.5 w-3.5" />
                      <a
                        href={experience.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        Company Website
                      </a>
                    </div>
                  )}
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="font-medium mb-2">Description</h3>
                    <p className="text-sm text-muted-foreground">{experience.description}</p>

                    {experience.technologies && experience.technologies.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-2">Technologies Used</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {experience.technologies.map((tech: string, i: number) => (
                            <Badge key={i} variant="secondary" className="bg-muted/80">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Key Achievements</h3>
                    <ul className="text-sm space-y-1.5">
                      {experience.achievements.map((achievement: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mt-1.5"></span>
                          <span className="text-muted-foreground">{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {experience.projects && experience.projects.length > 0 && (
                  <>
                    <Separator className="my-4" />
                    <div>
                      <h3 className="font-medium mb-3">Notable Projects</h3>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {experience.projects.map((project: Project, idx: number) => (
                          <div key={idx} className="rounded-md bg-muted/50 p-3">
                            <h4 className="font-medium text-sm">{project.name}</h4>
                            <p className="text-xs text-muted-foreground mt-1">{project.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Experience" : "Add New Experience"}</DialogTitle>
            <DialogDescription>
              {isEditing ? "Update your work experience details." : "Add a new work experience to your portfolio."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "basic" | "achievements" | "projects")} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="achievements">Achievements</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4 py-4">
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-16 overflow-hidden rounded-full border bg-background">
                    <Image
                      src={previewLogo || formData.logo || "/placeholder.svg"}
                      alt="Company logo"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <Button variant="outline" size="sm" type="button" className="h-9" onClick={handleLogoUpload}>
                      <Upload className="mr-2 h-4 w-4" /> Upload Logo
                    </Button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    <p className="text-xs text-muted-foreground mt-1">Recommended: Square image, at least 200x200px</p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="company">Company Name</Label>
                    <Input id="company" name="company" value={formData.company} onChange={handleInputChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position">Position</Label>
                    <Input
                      id="position"
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      name="startDate"
                      type="month"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      placeholder="YYYY-MM"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      placeholder="YYYY-MM or 'Present'"
                    />
                    <p className="text-xs text-muted-foreground">Enter "Present" for current positions</p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="period">Display Period</Label>
                    <Input
                      id="period"
                      name="period"
                      value={formData.period}
                      onChange={handleInputChange}
                      placeholder="e.g., 2020 - Present"
                      required
                    />
                    <p className="text-xs text-muted-foreground">How the time period will appear on your portfolio</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="e.g., San Francisco, CA"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="website">Company Website</Label>
                    <Input
                      id="website"
                      name="website"
                      type="url"
                      value={formData.website}
                      onChange={handleInputChange}
                      placeholder="https://example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Input
                      id="industry"
                      name="industry"
                      value={formData.industry}
                      onChange={handleInputChange}
                      placeholder="e.g., Technology, Healthcare"
                    />
                  </div>
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
                    placeholder="Describe your role, responsibilities, and the company"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Technologies Used</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          technologies: [...prev.technologies, ""],
                        }))
                      }
                    >
                      <Plus className="h-3.5 w-3.5 mr-1" /> Add
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {formData.technologies.map((tech: string, index: number) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={tech}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleArrayInputChange("technologies", index, e.target.value)}
                          placeholder={`Technology ${index + 1}`}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="shrink-0"
                          onClick={() => handleRemoveArrayItem("technologies", index)}
                        >
                          <Trash className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="achievements" className="space-y-4 py-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Key Achievements</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          achievements: [...prev.achievements, ""],
                        }))
                      }
                    >
                      <Plus className="h-3.5 w-3.5 mr-1" /> Add
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    List your key achievements and contributions during this role.
                  </p>

                  {formData.achievements.map((achievement: string, index: number) => (
                    <div key={index} className="space-y-2 mb-4">
                      <div className="flex gap-2">
                        <Textarea
                          value={achievement}
                          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleArrayInputChange("achievements", index, e.target.value)}
                          placeholder="Describe an achievement or contribution"
                          className="min-h-[80px]"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="shrink-0 h-10"
                          onClick={() => handleRemoveArrayItem("achievements", index)}
                        >
                          <Trash className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Key Responsibilities</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          responsibilities: [...prev.responsibilities, ""],
                        }))
                      }
                    >
                      <Plus className="h-3.5 w-3.5 mr-1" /> Add
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {formData.responsibilities.map((responsibility: string, index: number) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={responsibility}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleArrayInputChange("responsibilities", index, e.target.value)}
                          placeholder="Describe a key responsibility"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="shrink-0"
                          onClick={() => handleRemoveArrayItem("responsibilities", index)}
                        >
                          <Trash className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="projects" className="space-y-4 py-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Notable Projects</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          projects: [...prev.projects, { name: "", description: "" }],
                        }))
                      }
                    >
                      <Plus className="h-3.5 w-3.5 mr-1" /> Add Project
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add notable projects you worked on during this role.
                  </p>

                  {formData.projects.map((project: Project, index: number) => (
                    <div key={index} className="space-y-2 mb-6 p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Project {index + 1}</h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveProject(index)}
                          className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash className="h-3.5 w-3.5 mr-1" /> Remove
                        </Button>
                      </div>

                      <div className="space-y-3 pt-2">
                        <div className="space-y-2">
                          <Label htmlFor={`project-name-${index}`}>Project Name</Label>
                          <Input
                            id={`project-name-${index}`}
                            value={project.name}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleProjectInputChange(index, "name", e.target.value)}
                            placeholder="Project name"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`project-desc-${index}`}>Project Description</Label>
                          <Textarea
                            id={`project-desc-${index}`}
                            value={project.description}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleProjectInputChange(index, "description", e.target.value)}
                            placeholder="Brief description of the project and your role"
                            className="min-h-[80px]"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isAdding || isUpdating}>
                Cancel
              </Button>
              <Button type="submit" disabled={isAdding || isUpdating}>
                {isAdding || isUpdating ? "Saving..." : isEditing ? "Update Experience" : "Add Experience"}
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
              This will permanently delete the experience entry for{" "}
              <span className="font-medium">{experienceToDelete?.position}</span> at{" "}
              <span className="font-medium">{experienceToDelete?.company}</span>. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}