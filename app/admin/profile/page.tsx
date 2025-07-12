"use client"

import { useState, useEffect, ChangeEvent } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ArrowLeft, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { useGetProfileQuery } from "@/services/api"

interface SocialLinks {
  github: string
  linkedin: string
  twitter: string
  instagram: string
}

interface FormData {
  name: string
  title: string
  email: string
  location: string
  about: string
  profileImage: string
  socialLinks: SocialLinks
  resumeUrl?: string
}

export default function ProfilePage() {
  const router = useRouter()
  const { data: profileData, isLoading, isError } = useGetProfileQuery(undefined, {
    refetchOnMountOrArgChange: true,
  })

  // Initialize formData with empty values until profileData is fetched
  const [formData, setFormData] = useState<FormData>({
    name: "",
    title: "",
    email: "",
    location: "",
    about: "",
    profileImage: "/placeholder.svg?height=400&width=400",
    socialLinks: {
      github: "",
      linkedin: "",
      twitter: "",
      instagram: "",
    },
    resumeUrl: "",
  })
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Update formData when profileData is fetched
  useEffect(() => {
    if (profileData) {
      setFormData({
        name: profileData.name || "",
        title: profileData.title || "",
        email: profileData.email || "",
        location: profileData.location || "",
        about: profileData.about || "",
        profileImage: profileData.profileImage || "/placeholder.svg?height=400&width=400",
        socialLinks: {
          github: profileData.socialLinks?.github || "",
          linkedin: profileData.socialLinks?.linkedin || "",
          twitter: profileData.socialLinks?.twitter || "",
          instagram: profileData.socialLinks?.instagram || "",
        },
        resumeUrl: profileData.resumeUrl || "",
      })
    }
  }, [profileData])

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSocialLinkChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [name]: value,
      },
    }))
  }

  const handleResumeUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // In a real app, upload to a storage service and get URL
      // Here, we'll simulate by setting a dummy URL
      setFormData((prev) => ({
        ...prev,
        resumeUrl: URL.createObjectURL(file),
      }))
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setSaveSuccess(false)

    try {
      // Save to database
      await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setSaveSuccess(true)
    } catch (error) {
      console.error("Error saving profile:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleGoBack = () => {
    router.back()
  }

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-8 w-48" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Button variant="outline" size="icon" onClick={handleGoBack}>
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
            <h1 className="text-2xl font-bold">Profile Settings</h1>
          </div>
          <Button disabled>
            Save Changes
          </Button>
        </div>
        <div className="rounded-md bg-red-50 p-4 text-red-800">
          <p className="text-sm font-medium">Error loading profile data. Please try again later.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6 ">
      <div className="flex items-center justify-between ">
        <div className="flex items-center gap-6">
          <Button variant="outline" size="icon" onClick={handleGoBack}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
          <h1 className="text-2xl font-bold">Profile Settings</h1>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {saveSuccess && (
        <div className="rounded-md bg-green-50 p-4 text-green-800">
          <p className="text-sm font-medium">Profile updated successfully!</p>
        </div>
      )}

      <Tabs defaultValue="personal">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="about">About Me</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details displayed on your portfolio</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center space-y-4 sm:flex-row sm:items-start sm:space-x-4 sm:space-y-0">
                <div className="relative h-32 w-32 overflow-hidden rounded-full">
                  <Image
                    src={formData.profileImage || "/placeholder.svg"}
                    alt="Profile"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-center space-y-2">
                  <h3 className="text-lg font-medium">Profile Photo</h3>
                  <p className="text-sm text-muted-foreground">
                    This will be displayed on your portfolio site. Use a square image for best results.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Upload className="h-4 w-4" /> Upload New Photo
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 pt-4 md:grid-cols-2 grid-cols-1">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleInputChange} placeholder="Your full name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Professional Title</Label>
                  <Input id="title" name="title" value={formData.title} onChange={handleInputChange} placeholder="Your professional title" />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2 grid-cols-1">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="Your email" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" name="location" value={formData.location} onChange={handleInputChange} placeholder="Your location" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="about" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>About Me</CardTitle>
              <CardDescription>Tell visitors about yourself and your work</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="about">Short Bio</Label>
                <Textarea
                  id="about"
                  name="about"
                  value={formData.about}
                  onChange={handleInputChange}
                  className="min-h-[100px]"
                  placeholder="Write a short bio about yourself..."
                />
                <p className="text-xs text-muted-foreground">
                  This short bio appears in the hero section of your portfolio.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="longBio">Detailed Bio</Label>
                <Textarea
                  id="longBio"
                  name="longBio"
                  className="min-h-[200px]"
                  placeholder="Write a detailed bio about your journey..."
                />
                <p className="text-xs text-muted-foreground">
                  This detailed bio can be used on your about page or in other sections.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Social Media Links</CardTitle>
              <CardDescription>Connect your social profiles to your portfolio</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="github">GitHub</Label>
                <Input
                  id="github"
                  name="github"
                  value={formData.socialLinks.github}
                  onChange={handleSocialLinkChange}
                  placeholder="https://github.com/yourusername"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  name="linkedin"
                  value={formData.socialLinks.linkedin}
                  onChange={handleSocialLinkChange}
                  placeholder="https://linkedin.com/in/yourusername"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter</Label>
                <Input
                  id="twitter"
                  name="twitter"
                  value={formData.socialLinks.twitter}
                  onChange={handleSocialLinkChange}
                  placeholder="https://twitter.com/yourusername"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  name="instagram"
                  value={formData.socialLinks.instagram}
                  onChange={handleSocialLinkChange}
                  placeholder="https://instagram.com/yourusername"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="resume">Resume</Label>
                <Input
                  id="resume"
                  name="resume"
                  type="file"
                  accept=".pdf"
                  onChange={handleResumeUpload}
                />
                <p className="text-xs text-muted-foreground">
                  Upload a PDF resume to be linked on your portfolio.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}