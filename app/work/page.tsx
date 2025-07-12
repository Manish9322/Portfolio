import Image from "next/image"
import Link from "next/link"
import { ExternalLink, Github } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getPortfolioData } from "@/lib/portfolio-data"

export default function WorkPage() {
  // In a real implementation, this would fetch from your database
  const { featuredProjects: projects } = getPortfolioData()

  // In a real app, you would fetch all projects, not just featured ones
  const allProjects = [
    ...projects,
    {
      id: 4,
      title: "Portfolio Website",
      description:
        "A professional portfolio website showcasing my work and skills with an admin panel for content management.",
      image: "/placeholder.svg?height=600&width=800",
      tags: ["Next.js", "React", "Tailwind CSS", "TypeScript"],
      link: "#",
      github: "#",
      featured: false,
    },
    {
      id: 5,
      title: "Task Management App",
      description:
        "A collaborative task management application with real-time updates, notifications, and team workspaces.",
      image: "/placeholder.svg?height=600&width=800",
      tags: ["React", "Firebase", "Material UI", "Redux"],
      link: "#",
      github: "#",
      featured: false,
    },
    {
      id: 6,
      title: "Weather Dashboard",
      description:
        "A weather dashboard that provides current conditions and forecasts for multiple locations with interactive maps.",
      image: "/placeholder.svg?height=600&width=800",
      tags: ["JavaScript", "Weather API", "Chart.js", "Leaflet"],
      link: "#",
      github: "#",
      featured: false,
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 max-w-7xl">
          <Link href="/" className="text-xl font-bold">
            Alex Morgan
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Home
            </Link>
            <Link href="/work" className="text-sm font-medium">
              Work
            </Link>
            <Link href="/contact" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Contact
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-muted py-20">
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
            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
              {allProjects.map((project) => (
                <div
                  key={project.id}
                  className="group flex flex-col overflow-hidden rounded-lg border bg-card shadow-sm transition-all hover:shadow-md"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={project.image || "/placeholder.svg"}
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
                      {project.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-3">
                      <Button variant="outline" size="sm" className="gap-2" asChild>
                        <a href={project.link} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" /> Live Demo
                        </a>
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2" asChild>
                        <a href={project.github} target="_blank" rel="noopener noreferrer">
                          <Github className="h-4 w-4" /> View Code
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Alex Morgan. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
