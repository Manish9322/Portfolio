"use client"

import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Github, Globe, Calendar, Tag, Clock, Users, Target, Lightbulb, Code, Star } from "lucide-react"
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
          <p className="text-muted-foreground">Loading project details...</p>
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
      {/* Navigation */}
      <div className="container mx-auto px-4 py-6">
        <Button variant="ghost" className="mb-4" asChild>
          <Link href="/work">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Link>
        </Button>
      </div>

      {/* Hero Section with Project Image */}
      <section className="relative mb-8 lg:mb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Project Main Image */}
            <div className="aspect-video relative rounded-xl overflow-hidden mb-6 lg:mb-8 shadow-2xl">
              <Image
                src={project.imageUrl || "/placeholder.svg"}
                alt={project.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 text-white">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2">{project.title}</h1>
                <p className="text-sm sm:text-lg md:text-xl text-gray-200 max-w-2xl">{project.description}</p>
              </div>
            </div>

            {/* Project Actions */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 mb-8 lg:mb-12">
              {project.liveUrl && (
                <Button size="lg" className="bg-primary hover:bg-primary/90 w-full sm:w-auto" asChild>
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                    <Globe className="mr-2 h-5 w-5" />
                    Live Preview
                  </a>
                </Button>
              )}
              {project.githubUrl && (
                <Button size="lg" variant="outline" className="w-full sm:w-auto" asChild>
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-5 w-5" />
                    View Code
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Project Stats */}
      <section className="py-6 lg:py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              <div className="text-center p-4 rounded-lg bg-card border">
                <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">
                  {project.tags?.length || 0}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">Technologies</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-card border">
                <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">
                  {project.timeline || "N/A"}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">Duration</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-card border">
                <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">
                  {project.role || "Developer"}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">Role</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-card border">
                <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">
                  <Star className="inline h-6 w-6 sm:h-8 sm:w-8" />
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">Featured</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project Details Content */}
      <section className="py-8 lg:py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8 lg:space-y-12">
                {/* Project Overview */}
                <div className="bg-card border rounded-xl p-6 lg:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Target className="h-5 w-5 text-primary" />
                    </div>
                    <h2 className="text-xl lg:text-2xl font-bold">Project Overview</h2>
                  </div>
                  <div className="prose prose-gray dark:prose-invert max-w-none">
                    {project.longDescription ? (
                      <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
                        {project.longDescription}
                      </div>
                    ) : (
                      <div className="text-muted-foreground leading-relaxed">
                        {project.description}
                      </div>
                    )}
                  </div>
                </div>

                {/* Key Features */}
                <div className="bg-card border rounded-xl p-6 lg:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Star className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold">Key Features</h3>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {(project.features || [
                      "Responsive Design",
                      "Modern UI/UX",
                      "Performance Optimized",
                      "Cross-browser Compatible"
                    ]).map((feature: string, index: number) => (
                      <div key={index} className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                        <p className="text-sm leading-relaxed">{feature}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Technical Implementation */}
                <div className="bg-card border rounded-xl p-6 lg:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Code className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold">Technical Implementation</h3>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3">Architecture</h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {project.architecture || "Built with modern web technologies following best practices for scalability, maintainability, and performance."}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Development Process</h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {project.process || "Followed agile development methodologies with iterative design, continuous testing, and regular client feedback integration."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Challenges */}
                {project.challenges && project.challenges.length > 0 && (
                  <div className="bg-card border rounded-xl p-6 lg:p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-destructive/10 rounded-lg">
                        <Target className="h-5 w-5 text-destructive" />
                      </div>
                      <h3 className="text-xl font-bold">Challenges Faced</h3>
                    </div>
                    <div className="space-y-4">
                      {project.challenges.map((challenge: string, index: number) => (
                        <div key={index} className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                          <div className="w-2 h-2 rounded-full bg-destructive mt-2 flex-shrink-0"></div>
                          <p className="text-sm leading-relaxed">{challenge}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Solutions */}
                {project.solutions && project.solutions.length > 0 && (
                  <div className="bg-card border rounded-xl p-6 lg:p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-green-500/10 rounded-lg">
                        <Lightbulb className="h-5 w-5 text-green-500" />
                      </div>
                      <h3 className="text-xl font-bold">Solutions Implemented</h3>
                    </div>
                    <div className="space-y-4">
                      {project.solutions.map((solution: string, index: number) => (
                        <div key={index} className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                          <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                          <p className="text-sm leading-relaxed">{solution}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Screenshots Gallery */}
                {project.screenshots && project.screenshots.length > 0 && (
                  <div className="bg-card border rounded-xl p-6 lg:p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Image className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold">Project Gallery</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                      {project.screenshots.map((screenshot: any, index: number) => (
                        <div key={index} className="group cursor-pointer">
                          <div className="aspect-video relative rounded-lg overflow-hidden border bg-muted">
                            <Image
                              src={screenshot.url}
                              alt={screenshot.caption || `Screenshot ${index + 1}`}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          {screenshot.caption && (
                            <p className="text-sm text-muted-foreground mt-2 text-center">
                              {screenshot.caption}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Lessons Learned */}
                <div className="bg-card border rounded-xl p-6 lg:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <Lightbulb className="h-5 w-5 text-blue-500" />
                    </div>
                    <h3 className="text-xl font-bold">Lessons Learned</h3>
                  </div>
                  <div className="space-y-4">
                    {(project.lessons || [
                      "Importance of user-centered design approach",
                      "Value of iterative development and continuous feedback",
                      "Benefits of modern development tools and frameworks"
                    ]).map((lesson: string, index: number) => (
                      <div key={index} className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                        <p className="text-sm leading-relaxed">{lesson}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sticky Sidebar */}
              <div className="lg:sticky lg:top-6 lg:h-fit space-y-6">
                {/* Technologies Used */}
                <div className="bg-card border rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Code className="h-5 w-5 text-primary" />
                    Technologies
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tags?.map((tag: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Project Info */}
                <div className="bg-card border rounded-xl p-6 space-y-4">
                  <h3 className="text-lg font-semibold mb-4">Project Info</h3>
                  
                  {project.timeline && (
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Timeline</p>
                        <p className="text-sm text-muted-foreground">{project.timeline}</p>
                      </div>
                    </div>
                  )}

                  {project.role && (
                    <div className="flex items-start gap-3">
                      <Tag className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Role</p>
                        <p className="text-sm text-muted-foreground">{project.role}</p>
                      </div>
                    </div>
                  )}

                  {project.team && (
                    <div className="flex items-start gap-3">
                      <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Team</p>
                        <p className="text-sm text-muted-foreground">{project.team}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Status</p>
                      <p className="text-sm text-muted-foreground">{project.status || "Completed"}</p>
                    </div>
                  </div>
                </div>

                {/* Quick Links */}
                <div className="bg-card border rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                  <div className="space-y-3">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors p-2 -m-2 rounded-lg hover:bg-muted/50"
                      >
                        <Globe className="h-4 w-4" />
                        Live Website
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors p-2 -m-2 rounded-lg hover:bg-muted/50"
                      >
                        <Github className="h-4 w-4" />
                        Source Code
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}