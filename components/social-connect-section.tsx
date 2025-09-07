"use client"

import type React from "react"
import { useState } from "react"
import { Github, Linkedin, Instagram, Code, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { useGetProfileQuery } from "@/services/api"
import { Skeleton } from "@/components/ui/skeleton"

export function SocialConnectSection() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedPlatform, setSelectedPlatform] = useState<{
    name: string
    icon: React.ReactNode
    url: string
    color: string
    description: string
  } | null>(null)

  const { data: profileData, isLoading, isError } = useGetProfileQuery(undefined, {
  
    refetchOnMountOrArgChange: true,
  })

  const socialPlatforms = [
    {
      name: "LinkedIn",
      icon: <Linkedin className="h-5 w-5" />,
      url: profileData?.socialLinks?.linkedin || "",
      color: "bg-[#0077B5] hover:bg-[#0077B5]/90",
      description: "Connect with me professionally and stay updated on my career journey",
    },
    {
      name: "GitHub",
      icon: <Github className="h-5 w-5" />,
      url: profileData?.socialLinks?.github || "",
      color: "bg-[#333] hover:bg-[#333]/90",
      description: "Explore my code repositories and technical projects",
    },
    {
      name: "Instagram",
      icon: <Instagram className="h-5 w-5" />,
      url: profileData?.socialLinks?.instagram || "",
      color: "bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] hover:opacity-90",
      description: "Follow my creative journey and behind-the-scenes content",
    },
    {
      name: "LeetCode",
      icon: <Code className="h-5 w-5" />,
      url: "https://leetcode.com/u/manish-sonawane/",
      color: "bg-[#FFA116] hover:bg-[#FFA116]/90",
      description: "Check out my coding solutions and competitive programming journey",
    },
  ]

  const handleConnectClick = (platform: {
    name: string
    icon: React.ReactNode
    url: string
    color: string
    description: string
  }) => {
    if (!platform.url || platform.url.trim() === '') {
      toast({
        title: "No URL Available",
        description: `No ${platform.name} URL is set in your profile.`,
        variant: "destructive",
      })
      return
    }
    setSelectedPlatform(platform)
    setIsDialogOpen(true)
  }

  const handleConnect = () => {
    if (selectedPlatform?.url && selectedPlatform.url.trim() !== '') {
      window.open(selectedPlatform.url, '_blank', 'noopener,noreferrer')
      toast({
        title: "Opening Platform!",
        description: `Opening ${selectedPlatform.name} in a new tab.`,
      })
    } else {
      toast({
        title: "No URL Available",
        description: `No ${selectedPlatform?.name} URL is available.`,
        variant: "destructive",
      })
    }
    setIsDialogOpen(false)
  }

  const handleConnectAllPlatforms = () => {
    const availablePlatforms = socialPlatforms.filter(platform => platform.url && platform.url.trim() !== '')
    
    if (availablePlatforms.length === 0) {
      toast({
        title: "No Social Links Available",
        description: "Please set your social media URLs in your profile.",
        variant: "destructive",
      })
      return
    }

    // Open each platform in a new tab
    availablePlatforms.forEach(platform => {
      window.open(platform.url, '_blank', 'noopener,noreferrer')
    })

    toast({
      title: "Opening All Platforms!",
      description: `Opening ${availablePlatforms.length} social platform${availablePlatforms.length > 1 ? 's' : ''} in new tabs.`,
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-80 mb-6" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, index) => (
            <Skeleton key={index} className="h-48 w-full rounded-md" />
          ))}
        </div>
        <Skeleton className="h-32 w-full rounded-md" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-bold mb-2">Let's Connect</h3>
          <p className="text-muted-foreground mb-6">
            Unable to load social media links. Please try again later.
          </p>
        </div>
        <div className="rounded-md bg-red-50 p-4 text-red-800">
          <p className="text-sm font-medium">Error loading profile data.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold mb-3">Let's Connect</h3>
        <p className="text-muted-foreground">
          Follow me on social media to stay updated with my latest projects and insights.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {socialPlatforms.map((platform) => (
          <div
            key={platform.name}
            className="relative group p-6 rounded-md bg-card hover:bg-card/80 border border-gray/50 hover:border-primary/50 transition-all duration-300 overflow-hidden shadow-lg hover:shadow-xl backdrop-blur-sm"
          >
            {/* Background Patterns */}
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Main Content */}
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-full bg-black text-white dark:bg-white dark:text-black">{platform.icon}</div>
                <h4 className="font-semibold">{platform.name}</h4>
              </div>

              <p className="text-sm text-muted-foreground mb-4 flex-grow">{platform.description}</p>

              <Button
                variant="outline"
                className="w-full justify-center gap-2 mt-auto transition-all duration-200"
                onClick={() => handleConnectClick(platform)}
                disabled={!platform.url || platform.url.trim() === ''}
              >
                Connect <ExternalLink className="h-4 w-4" />
              </Button>
            </div>

            {/* Corner Accents */}
            <div className="absolute -right-12 -top-12 w-24 h-24 bg-black/10 dark:bg-white/5 rounded-full blur-2xl transition-all duration-500 group-hover:scale-150" />
            <div className="absolute -right-2 -top-2 w-8 h-8 bg-black/20 dark:bg-white/10 rounded-full blur-xl transition-all duration-500 group-hover:scale-150" />

            {/* Bottom Accent Line */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        ))}
      </div>

      <div className="relative group overflow-hidden">
        <div className="relative p-6 lg:p-8 rounded-md bg-card hover:bg-card/80 border border-gray/50 hover:border-primary/50 transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm">
          {/* Background Patterns */}
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Main Content */}
          <div className="relative z-10 flex flex-col items-center justify-center">
            <Badge variant="outline" className="mb-3">
              Professional Network
            </Badge>
            <h4 className="text-lg font-medium mb-2">Join My Professional Network</h4>
            <p className="text-sm text-center text-muted-foreground mb-6">
              Let's collaborate and grow together. Connect with me on all platforms for exclusive content and opportunities.
            </p>
            <Button
              className="bg-black hover:text-black hover:border hover:bg-white/90 backdrop-blur-sm text-white transition-all duration-300 shadow-lg hover:shadow-gray-900/20 dark:bg-transparent dark:border-white dark:border dark:hover:bg-white/10 dark:hover:backdrop-blur-sm dark:hover:text-white"
              onClick={handleConnectAllPlatforms}
            >
              Connect on All Platforms
            </Button>
          </div>

          {/* Corner Accents */}
          <div className="absolute -right-12 -top-12 w-24 h-24 bg-black/10 dark:bg-white/5 rounded-full blur-2xl transition-all duration-500 group-hover:scale-150" />
          <div className="absolute -right-2 -top-2 w-8 h-8 bg-black/20 dark:bg-white/10 rounded-full blur-xl transition-all duration-500 group-hover:scale-150" />

          {/* Bottom Accent Line */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect on {selectedPlatform?.name}</DialogTitle>
            <DialogDescription>
              You're about to visit {profileData?.name || "the user"}'s {selectedPlatform?.name} profile. This will open in a new browser tab.
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-md">
            <div className="p-3 rounded-full bg-black text-white dark:bg-white dark:text-black">
              {selectedPlatform?.icon}
            </div>
            <div>
              <h4 className="font-medium">{profileData?.name || "User"}</h4>
              <p className="text-sm text-muted-foreground">{selectedPlatform?.url}</p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button className={selectedPlatform?.color} onClick={handleConnect}>
              Visit {selectedPlatform?.name}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}