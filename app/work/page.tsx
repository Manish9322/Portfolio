"use client"

import Image from "next/image"
import Link from "next/link"
import { ExternalLink, Github, Eye } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useGetProjectsQuery } from "@/services/api"
import Header from "@/components/Header"
import { FooterSection } from "@/components/home/FooterSection"
import { ProjectCard } from "@/components/ui/project-card"

interface Project {
  _id?: string
  title: string
  description: string
  imageUrl: string
  tags: string[]
  liveUrl: string
  githubUrl: string
  featured: boolean
}

export default function WorkPage() {
  const { data: projects = [], isLoading } = useGetProjectsQuery(undefined)

  // Sort projects by creation date or featured status to get the latest first
  // Assuming projects have a createdAt field or we can use the order they come in
  const sortedProjects = [...projects].reverse(); // Reverse to get newest first (assuming API returns oldest first)
  const latestProject = sortedProjects[0];
  const otherProjects = sortedProjects.slice(1);

  return (
    <>
      <Header backLink="/" backText="Home" />
      <div className="flex min-h-screen flex-col bg-background">
        {/* Main Content */}
        <main className="flex-1">
          {/* Hero Section */}
          <section className="bg-muted/50 py-20">
            <div className="container mx-auto px-4 text-center">
              <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  My Work
                </span>
              </h1>
              
              <p className="mx-auto mb-8 max-w-3xl text-lg sm:text-xl text-muted-foreground">
                A collection of my projects, showcasing my skills and experience in web development, design, and problem-solving
              </p>
            </div>
          </section>

        {/* Projects Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-7xl">
            {isLoading ? (
              <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="flex flex-col overflow-hidden rounded-lg border bg-card shadow-sm animate-pulse">
                    <div className="relative aspect-video bg-muted" />
                    <div className="flex flex-1 flex-col p-6 space-y-4">
                      <div className="h-6 bg-muted rounded w-3/4" />
                      <div className="h-4 bg-muted rounded w-full" />
                      <div className="h-4 bg-muted rounded w-5/6" />
                      <div className="flex gap-2">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="h-6 w-16 bg-muted rounded-full" />
                        ))}
                      </div>
                      <div className="flex gap-3 pt-2">
                        <div className="h-8 w-24 bg-muted rounded" />
                        <div className="h-8 w-24 bg-muted rounded" />
                        <div className="h-8 w-24 bg-muted rounded" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {/* Latest Project - Featured */}
                {latestProject && (
                  <div className="mb-12">
                    <div className="mb-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="bg-gradient-to-r from-primary to-secondary text-white px-3 py-1 rounded-full text-sm font-medium">
                          Latest
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold">Latest Project</h2>
                      </div>
                    </div>
                    <ProjectCard project={latestProject} variant="featured" />
                  </div>
                )}

                {/* Other Projects Grid */}
                {otherProjects.length > 0 && (
                  <>
                    <div className="mb-6">
                      <h3 className="text-xl sm:text-2xl font-bold mb-6">More Projects</h3>
                    </div>
                    <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
                      {otherProjects.map((project: Project) => (
                        <ProjectCard key={project._id} project={project} variant="default" />
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </section>
      </main>
      </div>
      <FooterSection />
    </>
  )
}
