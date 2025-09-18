"use client"

import Image from "next/image"
import Link from "next/link"
import { ExternalLink, Github, Eye } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface ProjectCardProps {
  project: {
    _id?: string
    title: string
    description: string
    imageUrl: string
    tags: string[]
    liveUrl: string
    githubUrl: string
    featured: boolean
  }
  variant?: "default" | "featured"
}

export function ProjectCard({ project, variant = "default" }: ProjectCardProps) {
  if (variant === "featured") {
    return (
      <Card className="group flex flex-col overflow-hidden rounded-lg bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300">
        {/* Enhanced Image */}
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={project.imageUrl || "/placeholder.svg"}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            priority={true}
          />
        </div>

        <CardContent className="flex flex-1 flex-col p-6">
          {/* Title */}
          <h2 className="mb-3 text-xl sm:text-2xl font-bold">
            {project.title}
          </h2>

          {/* Description */}
          <p className="mb-4 text-muted-foreground leading-relaxed line-clamp-2">
            {project.description}
          </p>

          {/* Tags */}
          <div className="mb-4 flex flex-wrap gap-2">
            {project.tags.slice(0, 4).map((tag: string, index: number) => (
              <Badge 
                key={index} 
                variant="secondary"
                className={`text-sm ${
                  index === 0 ? 'bg-primary/10 text-primary border-primary/30' :
                  'bg-muted'
                }`}
              >
                {tag}
              </Badge>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 mt-auto">
            <Button className="gap-2 flex-1 min-w-fit" asChild>
              <Link href={`/work/${project._id}`}>
                <Eye className="h-4 w-4" /> 
                View Details
              </Link>
            </Button>
            {project.liveUrl && (
              <Button variant="outline" size="sm" className="gap-2" asChild>
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
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
        </CardContent>
      </Card>
    )
  }

  // Default variant (existing design)
  return (
    <div className="group flex flex-col overflow-hidden rounded-lg border bg-card shadow-sm transition-all hover:shadow-md">
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
  )
}