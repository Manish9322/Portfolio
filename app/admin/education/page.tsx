"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import {
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  Edit,
  GraduationCap,
  GripVertical,
  MapPin,
  Plus,
  Trash,
  Upload,
  Award,
  BookOpen,
  LinkIcon,
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { useDispatch } from "react-redux"
import {
  useGetEducationQuery,
  useAddEducationMutation,
  useUpdateEducationMutation,
  useDeleteEducationMutation,
  useUpdateEducationOrderMutation,
} from "@/services/api"
import { portfolioApi } from "@/services/api"

// Define the Education interface
interface Education {
  _id: string
  institution: string
  degree: string
  field?: string
  period: string
  location?: string
  description: string
  gpa?: string
  achievements: string[]
  logo: string
  website?: string
  startDate?: string
  endDate?: string
  icon: string
  certificateUrl?: string
  type: "degree" | "certification" | "course"
}

export default function EducationPage() {
  const router = useRouter()
  const dispatch = useDispatch()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Fetch education data using RTK Query
  const { data: education = [], isLoading } = useGetEducationQuery(undefined)
  const [addEducation] = useAddEducationMutation()
  const [updateEducation] = useUpdateEducationMutation()
  const [deleteEducation] = useDeleteEducationMutation()
  const [updateEducationOrder] = useUpdateEducationOrderMutation()

  const [isEditing, setIsEditing] = useState(false)
  const [currentEducation, setCurrentEducation] = useState<Education | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [educationToDelete, setEducationToDelete] = useState<Education | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<"basic" | "achievements">("basic")
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [previewLogo, setPreviewLogo] = useState<string | null>(null)
  const [isOrdering, setIsOrdering] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [localEducation, setLocalEducation] = useState<Education[] | null>(null);

  const [formData, setFormData] = useState({
    institution: "",
    degree: "",
    field: "",
    period: "",
    location: "",
    description: "",
    gpa: "",
    achievements: ["", "", ""],
    logo: "/placeholder.svg?height=80&width=80",
    website: "",
    startDate: "",
    endDate: "",
    icon: "graduation",
    certificateUrl: "",
    type: "degree" as "degree" | "certification" | "course",
  })

  const handleEditEducation = (edu: Education) => {
    setIsEditing(true)
    setCurrentEducation(edu)
    setPreviewLogo(null)

    // Format achievements as arrays with at least 3 items
    const achievements = [...(edu.achievements || [])]
    while (achievements.length < 3) achievements.push("")

    setFormData({
      institution: edu.institution,
      degree: edu.degree,
      field: edu.field || "",
      period: edu.period,
      location: edu.location || "",
      description: edu.description,
      gpa: edu.gpa || "",
      achievements,
      logo: edu.logo || "/placeholder.svg?height=80&width=80",
      website: edu.website || "",
      startDate: edu.startDate || "",
      endDate: edu.endDate || "",
      icon: edu.icon || "graduation",
      certificateUrl: edu.certificateUrl || "",
      type: edu.type,
    })

    setIsDialogOpen(true)
    setActiveTab("basic")
  }

  const handleNewEducation = () => {
    setIsEditing(false)
    setCurrentEducation(null)
    setPreviewLogo(null)
    setFormData({
      institution: "",
      degree: "",
      field: "",
      period: "",
      location: "",
      description: "",
      gpa: "",
      achievements: ["", "", ""],
      logo: "/placeholder.svg?height=80&width=80",
      website: "",
      startDate: "",
      endDate: "",
      icon: "graduation",
      certificateUrl: "",
      type: "degree",
    })
    setIsDialogOpen(true)
    setActiveTab("basic")
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleArrayInputChange = (field: keyof typeof formData, index: number, value: string) => {
    setFormData((prev) => {
      const newArray = [...prev[field]]
      newArray[index] = value
      return { ...prev, [field]: newArray }
    })
  }

  const handleRemoveArrayItem = (field: keyof typeof formData, index: number) => {
    setFormData((prev) => {
      const newArray = [...prev[field]]
      newArray.splice(index, 1)
      return { ...prev, [field]: newArray }
    })
  }

  const handleLogoUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const previewUrl = URL.createObjectURL(file)
      setPreviewLogo(previewUrl)
      setFormData({
        ...formData,
        logo: previewUrl, // In a real app, this would be the URL from your server
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSaving(true)
    setSaveSuccess(false)

    try {
      const educationData = {
        ...formData,
        achievements: formData.achievements.filter((a) => a.trim()),
      }

      if (isEditing && currentEducation) {
        await updateEducation({
          _id: currentEducation._id,
          ...educationData,
        }).unwrap()
      } else {
        await addEducation(educationData).unwrap()
      }

      setSaveSuccess(true)
      setTimeout(() => {
        setIsDialogOpen(false)
        setSaveSuccess(false)
      }, 1500)
    } catch (error) {
      console.error("Error saving education:", error)
      toast({
        title: "Error",
        description: "Failed to save education. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteClick = (edu: Education) => {
    setEducationToDelete(edu)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!educationToDelete) return
    try {
      await deleteEducation(educationToDelete._id).unwrap()
      setIsDeleteDialogOpen(false)
    } catch (error) {
      console.error("Error deleting education:", error)
      toast({
        title: "Error",
        description: "Failed to delete education. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleMoveEducation = async (index: number, direction: "up" | "down") => {
    if ((direction === "up" && index === 0) || (direction === "down" && index === education.length - 1)) {
      return;
    }

    setIsOrdering(true);
    const newIndex = direction === "up" ? index - 1 : index + 1;
    const newEducation = [...education];
    const [removed] = newEducation.splice(index, 1);
    newEducation.splice(newIndex, 0, removed);
    const orderedIds = newEducation.map((edu) => edu._id);

    // Update local state for immediate UI feedback
    setLocalEducation(newEducation);

    try {
      await updateEducationOrder({ orderedIds }).unwrap();
      // Clear local state after successful update
      setLocalEducation(null);
    } catch (error) {
      console.error("Error updating education order:", error);
      toast({
        title: "Error",
        description: "Failed to update education order. Please try again.",
        variant: "destructive",
      });
      // Revert to original education data on error
      setLocalEducation(null);
    } finally {
      setIsOrdering(false);
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLButtonElement>, index: number) => {
    setDraggedIndex(index)
    e.dataTransfer.setData("text/plain", index.toString())
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault()
  }

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      return;
    }

    setIsOrdering(true);
    const newEducation = [...education];
    const [removed] = newEducation.splice(draggedIndex, 1);
    newEducation.splice(dropIndex, 0, removed);
    const orderedIds = newEducation.map((edu) => edu._id);

    // Update local state for immediate UI feedback
    setLocalEducation(newEducation);

    try {
      await updateEducationOrder({ orderedIds }).unwrap();
      // Clear local state after successful update
      setLocalEducation(null);
    } catch (error) {
      console.error("Error updating education order:", error);
      toast({
        title: "Error",
        description: "Failed to update education order. Please try again.",
        variant: "destructive",
      });
      // Revert to original education data on error
      setLocalEducation(null);
    } finally {
      setDraggedIndex(null);
      setIsOrdering(false);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as "basic" | "achievements")
  }

  const handleGoBack = () => {
    router.back()
  }

  const getIconComponent = (iconType: string) => {
    switch (iconType) {
      case "graduation":
        return <GraduationCap className="h-5 w-5" />
      case "certificate":
        return <Award className="h-5 w-5" />
      case "course":
        return <BookOpen className="h-5 w-5" />
      default:
        return <GraduationCap className="h-5 w-5" />
    }
  }

  if (isLoading) {
    return <div className="p-6 max-w-7xl mx-auto">
      <Skeleton className="h-6 w-1/2 mb-4" />
      <Skeleton className="h-6 w-1/4 mb-4" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between ">
        <div className="flex items-center gap-6">
          <Button variant="outline" size="icon" onClick={handleGoBack}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
          <h1 className="text-2xl font-bold">Manage Education</h1>
        </div>
        <Button onClick={handleNewEducation}>
          <Plus className="mr-2 h-4 w-4" /> Add Education
        </Button>
      </div>

      {education.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <div className="rounded-full bg-muted p-3">
            <GraduationCap className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-medium">No education entries yet</h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-sm">
            Add your education and certifications to showcase your academic achievements on your portfolio.
          </p>
          <Button onClick={handleNewEducation} className="mt-6">
            <Plus className="mr-2 h-4 w-4" /> Add Your First Education
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {(localEducation || education).map((edu: Education, index: number) => (
            <Card
              key={edu._id}
              className="overflow-hidden"
              draggable
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
            >
              <CardHeader className="bg-muted/50 pb-4">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="relative h-14 w-14 overflow-hidden rounded-full border bg-background flex items-center justify-center">
                      {edu.logo ? (
                        <Image
                          src={edu.logo || "/placeholder.svg"}
                          alt={edu.institution}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        getIconComponent(edu.icon)
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-xl">{edu.degree}</CardTitle>
                      <CardDescription className="text-base">
                        {edu.institution} • {edu.period}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-end">
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleMoveEducation(index, "up")}
                        disabled={index === 0 || isOrdering}
                      >
                        <ArrowUp className="h-4 w-4" />
                        <span className="sr-only">Move up</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleMoveEducation(index, "down")}
                        disabled={index === education.length - 1 || isOrdering}
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
                    <Button variant="outline" size="sm" onClick={() => handleEditEducation(edu)}>
                      <Edit className="mr-2 h-4 w-4" /> Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(edu)}>
                      <Trash className="mr-2 h-4 w-4" /> Delete
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="outline" className="bg-primary/10">
                    {edu.type === "degree" ? "Degree" : edu.type === "certification" ? "Certification" : "Course"}
                  </Badge>
                  {edu.location && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>{edu.location}</span>
                    </div>
                  )}
                  {edu.website && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <LinkIcon className="h-3.5 w-3.5" />
                      <a href={edu.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        Institution Website
                      </a>
                    </div>
                  )}
                  {edu.field && (
                    <Badge variant="secondary" className="bg-muted">
                      {edu.field}
                    </Badge>
                  )}
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="font-medium mb-2">Description</h3>
                    <p className="text-sm text-muted-foreground">{edu.description}</p>

                    {edu.gpa && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-1">GPA</h4>
                        <p className="text-sm">{edu.gpa}</p>
                      </div>
                    )}

                    {edu.certificateUrl && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-1">Certificate</h4>
                        <a
                          href={edu.certificateUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline flex items-center gap-1"
                        >
                          View Certificate <LinkIcon className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    )}
                  </div>
                  <div>
                    {edu.achievements && edu.achievements.length > 0 && (
                      <div>
                        <h3 className="font-medium mb-2">Achievements</h3>
                        <ul className="text-sm space-y-1.5">
                          {edu.achievements.map((achievement, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mt-1.5"></span>
                              <span className="text-muted-foreground">{achievement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Education" : "Add New Education"}</DialogTitle>
            <DialogDescription>
              {isEditing ? "Update your education details." : "Add a new education entry to your portfolio."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="achievements">Achievements</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4 py-4">
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-16 overflow-hidden rounded-full border bg-background flex items-center justify-center">
                    {previewLogo || formData.logo ? (
                      <Image src={previewLogo || formData.logo} alt="Institution logo" fill className="object-cover" />
                    ) : (
                      getIconComponent(formData.icon)
                    )}
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

                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="degree">Degree</SelectItem>
                      <SelectItem value="certification">Certification</SelectItem>
                      <SelectItem value="course">Course</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="icon">Icon</Label>
                  <Select value={formData.icon} onValueChange={(value) => handleSelectChange("icon", value)}>
                    <SelectTrigger id="icon">
                      <SelectValue placeholder="Select icon" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="graduation">Graduation Cap</SelectItem>
                      <SelectItem value="certificate">Certificate</SelectItem>
                      <SelectItem value="course">Book</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="institution">Institution</Label>
                    <Input
                      id="institution"
                      name="institution"
                      value={formData.institution}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="degree">Degree/Certificate Name</Label>
                    <Input id="degree" name="degree" value={formData.degree} onChange={handleInputChange} required />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="field">Field of Study</Label>
                    <Input
                      id="field"
                      name="field"
                      value={formData.field}
                      onChange={handleInputChange}
                      placeholder="e.g., Computer Science"
                    />
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
                    <p className="text-xs text-muted-foreground">Enter "Present" for current education</p>
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
                      placeholder="e.g., 2014 - 2018"
                      required
                    />
                    <p className="text-xs text-muted-foreground">How the time period will appear on your portfolio</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gpa">GPA (Optional)</Label>
                    <Input
                      id="gpa"
                      name="gpa"
                      value={formData.gpa}
                      onChange={handleInputChange}
                      placeholder="e.g., 3.8/4.0"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="website">Institution Website</Label>
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
                    <Label htmlFor="certificateUrl">Certificate URL (if applicable)</Label>
                    <Input
                      id="certificateUrl"
                      name="certificateUrl"
                      type="url"
                      value={formData.certificateUrl}
                      onChange={handleInputChange}
                      placeholder="https://example.com/certificate"
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
                    placeholder="Describe your education, specialization, or certification"
                  />
                </div>
              </TabsContent>

              <TabsContent value="achievements" className="space-y-4 py-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Achievements</Label>
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
                    List your key achievements, awards, or notable accomplishments during this education.
                  </p>

                  {formData.achievements.map((achievement, index) => (
                    <div key={index} className="space-y-2 mb-4">
                      <div className="flex gap-2">
                        <Textarea
                          value={achievement}
                          onChange={(e) => handleArrayInputChange("achievements", index, e.target.value)}
                          placeholder="Describe an achievement or award"
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
              </TabsContent>
            </Tabs>

            {saveSuccess && (
              <div className="mt-4 rounded-md bg-green-50 p-3 text-green-800">
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-green-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="text-sm font-medium">Education saved successfully!</p>
                </div>
              </div>
            )}

            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : isEditing ? "Update Education" : "Add Education"}
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
              This will permanently delete the education entry for{" "}
              <span className="font-medium">{educationToDelete?.degree}</span> at{" "}
              <span className="font-medium">{educationToDelete?.institution}</span>. This action cannot be undone.
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