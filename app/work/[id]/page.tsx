"use client"

import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Github, Globe, Calendar, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useGetProjectQuery } from "@/services/api"

export default function ProjectDetails() {
  const params = useParams()
  const { data: project, isLoading, error } = useGetProjectQuery(params.id as string)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading project details...</p>
        </div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
          <p className="text-muted-foreground mb-6">The project you're looking for doesn't exist.</p>
          <Button asChild>
            <Link href="/work">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Link>
          </Button>
        </div>
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-black text-white py-24 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10">
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                "linear-gradient(45deg, #ffffff 1px, transparent 1px), linear-gradient(135deg, #ffffff 1px, transparent 1px)",
              backgroundSize: "50px 50px",
            }}
          ></div>
        </div>
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-b from-blue-500/20 via-purple-500/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-t from-blue-500/20 via-indigo-500/10 to-transparent rounded-full blur-3xl"></div>

        <div className="container relative z-10 mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Button variant="ghost" className="mb-8 hover:bg-white/10" asChild>
              <Link href="/work">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Projects
              </Link>
            </Button>

            <h1 className="text-4xl md:text-5xl font-bold mb-6">{project.title}</h1>
            
            <div className="flex flex-wrap gap-4 mb-8">
              {project.timeline && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4" />
                  {project.timeline}
                </div>
              )}
              {project.role && (
                <div className="flex items-center gap-2 text-sm">
                  <Tag className="h-4 w-4" />
                  {project.role}
                </div>
              )}
            </div>

            <p className="text-lg text-gray-300 leading-relaxed mb-8">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-4">
              {project.liveUrl && (
                <Button 
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                  asChild
                >
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                    <Globe className="mr-2 h-4 w-4" />
                    Visit Website
                  </a>
                </Button>
              )}
              {project.githubUrl && (
                <Button variant="outline" className="border-white/20 hover:bg-white/10" asChild>
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-4 w-4" />
                    View Source
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Project Details */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Technologies</h3>
                <div className="flex flex-wrap gap-2">
                  {project.tags?.map((tag: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              {project.timeline && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Timeline</h3>
                  <p className="text-muted-foreground">{project.timeline}</p>
                </div>
              )}
              {project.team && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Team</h3>
                  <p className="text-muted-foreground">{project.team}</p>
                </div>
              )}
            </div>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <h2 className="text-2xl font-bold mb-6">Project Overview</h2>
              {project.longDescription ? (
                <div className="whitespace-pre-line text-muted-foreground">
                  {project.longDescription}
                </div>
              ) : (
                <div className="text-muted-foreground">
                  {project.description}
                </div>
              )}

              {project.challenges && project.challenges.length > 0 && (
                <div className="mt-12">
                  <h3 className="text-xl font-bold mb-4">Challenges</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    {project.challenges.map((challenge: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mt-2"></span>
                        <span>{challenge}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {project.solutions && project.solutions.length > 0 && (
                <div className="mt-12">
                  <h3 className="text-xl font-bold mb-4">Solutions</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    {project.solutions.map((solution: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mt-2"></span>
                        <span>{solution}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {project.screenshots && project.screenshots.length > 0 && (
              <div className="mt-16">
                <h2 className="text-2xl font-bold mb-8">Project Screenshots</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  {project.screenshots.map((screenshot: any, index: number) => (
                    <div key={index} className="space-y-4">
                      <div className="aspect-video relative rounded-lg overflow-hidden border border-border">
                        <Image
                          src={screenshot.url}
                          alt={screenshot.caption}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <p className="text-sm text-center text-muted-foreground">{screenshot.caption}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
} 