"use client"

import Image from "next/image"
import Link from "next/link"
import { ExternalLink, Github, Eye } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useGetProjectsQuery } from "@/services/api"
import Header from "@/components/Header"
import { FooterSection } from "@/components/home/FooterSection"

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

  return (
    <>
      <Header backLink="/" backText="Home" />
      <div className="flex min-h-screen flex-col bg-background">
        {/* Main Content */}
        <main className="flex-1">
          {/* Hero Section */}
          <section className="bg-muted/50 py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl">My Work</h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
              A collection of my projects, showcasing my skills and experience in web development, design, and
              problem-solving.
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
              <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
                {projects.map((project: Project) => (
                  <div
                    key={project._id}
                    className="group flex flex-col overflow-hidden rounded-lg border bg-card shadow-sm transition-all hover:shadow-md"
                  >
                    <div className="relative aspect-video overflow-hidden">
                      <Image
                        src={project.imageUrl || "/placeholder.svg"}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      {project.featured && (
                        <div className="absolute right-2 top-2 rounded-full bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">
                          Featured
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <h2 className="mb-2 text-xl font-bold">{project.title}</h2>
                      <p className="mb-4 flex-1 text-muted-foreground">{project.description}</p>
                      <div className="mb-4 flex flex-wrap gap-2">
                        {project.tags.map((tag: string, index: number) => (
                          <Badge key={index} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-3">
                        <Button variant="default" size="sm" className="gap-2" asChild>
                          <Link href={`/work/${project._id}`}>
                            <Eye className="h-4 w-4" /> View Details
                          </Link>
                        </Button>
                        {project.liveUrl && (
                          <Button variant="outline" size="sm" className="gap-2" asChild>
                            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4" /> Live Demo
                            </a>
                          </Button>
                        )}
                        {project.githubUrl && (
                          <Button variant="outline" size="sm" className="gap-2" asChild>
                            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                              <Github className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      </div>
      <FooterSection />
    </>
  )
}
