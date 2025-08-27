"use client"

import type React from "react"
import { useState } from "react"
import { Github, Linkedin, Instagram, Twitter, ExternalLink } from "lucide-react"
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
      name: "Twitter",
      icon: <Twitter className="h-5 w-5" />,
      url: profileData?.socialLinks?.twitter || "",
      color: "bg-[#1DA1F2] hover:bg-[#1DA1F2]/90",
      description: "Join my conversations about tech, design, and industry trends",
    },
  ]

  const handleConnectClick = (platform: {
    name: string
    icon: React.ReactNode
    url: string
    color: string
    description: string
  }) => {
    if (!platform.url) {
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
    toast({
      title: "Connection Request Sent!",
      description: `Your request to connect on ${selectedPlatform?.name} has been sent.`,
    })
    setIsDialogOpen(false)
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
            className="bg-card dark:bg-slate-800/90 rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-all duration-300 flex flex-col backdrop-blur-sm"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2.5 rounded-full text-white ${platform.color.split(" ")[0]}`}>{platform.icon}</div>
              <h4 className="font-semibold">{platform.name}</h4>
            </div>

            <p className="text-sm text-muted-foreground mb-4 flex-grow">{platform.description}</p>

            <Button
              variant="outline"
              className="w-full justify-center gap-2 mt-auto transition-all duration-200"
              onClick={() => handleConnectClick(platform)}
              disabled={!platform.url}
            >
              Connect <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center justify-center bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-slate-800/50 dark:to-indigo-900/20 p-6 lg:p-8 rounded-xl border border-border/50 backdrop-blur-sm">
        <Badge variant="outline" className="mb-3">
          Professional Network
        </Badge>
        <h4 className="text-lg font-medium mb-2">Join My Professional Network</h4>
        <p className="text-sm text-center text-muted-foreground mb-6">
          Let's collaborate and grow together. Connect with me on all platforms for exclusive content and opportunities.
        </p>
        <Button
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
          onClick={() => {
            const hasUrls = socialPlatforms.some((platform) => platform.url)
            if (!hasUrls) {
              toast({
                title: "No Social Links Available",
                description: "Please set your social media URLs in your profile.",
                variant: "destructive",
              })
              return
            }
            toast({
              title: "Thank you!",
              description: "Connection requests have been sent to all platforms.",
            })
          }}
        >
          Connect on All Platforms
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect on {selectedPlatform?.name}</DialogTitle>
            <DialogDescription>
              You're about to connect with {profileData?.name || "the user"} on {selectedPlatform?.name}. This will send a connection request.
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-md">
            <div className={`p-3 rounded-full text-white ${selectedPlatform?.color.split(" ")[0]}`}>
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
              Connect on {selectedPlatform?.name}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}