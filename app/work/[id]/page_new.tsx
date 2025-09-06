"use client"

import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Github, Globe, Calendar, Tag, Clock, Users, Target, Lightbulb, Code, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useGetProjectQuery } from "@/services/api"
import Header from "@/components/Header"
import { FooterSection } from "@/components/home/FooterSection"

export default function ProjectDetails() {
  const params = useParams()
  const { data: project, isLoading, error } = useGetProjectQuery(params.id as string)

  if (isLoading) {
    return (
      <>
        <Header backLink="/work" backText="Back to Projects" />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading project details...</p>
          </div>
        </div>
        <FooterSection />
      </>
    )
  }

  if (error || !project) {
    return (
      <>
        <Header backLink="/work" backText="Back to Projects" />
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
        <FooterSection />
      </>
    )
  }

  return (
    <>
      <Header backLink="/work" backText="Back to Projects" />
      <div className="min-h-screen bg-background">
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
                  <Button asChild size="lg" className="flex-1 sm:flex-none">
                    <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                      <Globe className="mr-2 h-4 w-4" />
                      View Live Demo
                    </Link>
                  </Button>
                )}
                {project.githubUrl && (
                  <Button asChild variant="outline" size="lg" className="flex-1 sm:flex-none">
                    <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                      <Github className="mr-2 h-4 w-4" />
                      View Code
                    </Link>
                  </Button>
                )}
              </div>

              {/* Project Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                <div className="text-center p-4 rounded-lg bg-card border">
                  <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">
                    {project.duration || "3-6"}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Months</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-card border">
                  <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">
                    {project.teamSize || "2-4"}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Team Size</div>
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
                      <p className="text-muted-foreground leading-relaxed">{project.description}</p>
                      {project.longDescription && (
                        <div dangerouslySetInnerHTML={{ __html: project.longDescription }} />
                      )}
                    </div>
                  </div>

                  {/* Technologies Used */}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="bg-card border rounded-xl p-6 lg:p-8">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                          <Code className="h-5 w-5 text-blue-500" />
                        </div>
                        <h3 className="text-xl font-bold">Technologies Used</h3>
                      </div>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {project.technologies.map((tech: string, index: number) => (
                          <Badge key={index} variant="secondary" className="text-sm py-2 px-3">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Key Features */}
                  {project.features && project.features.length > 0 && (
                    <div className="bg-card border rounded-xl p-6 lg:p-8">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-green-500/10 rounded-lg">
                          <Lightbulb className="h-5 w-5 text-green-500" />
                        </div>
                        <h3 className="text-xl font-bold">Key Features</h3>
                      </div>
                      <div className="grid gap-4">
                        {project.features.map((feature: string, index: number) => (
                          <div key={index} className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                            <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                            <p className="text-sm leading-relaxed">{feature}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Challenges & Solutions */}
                  {project.challenges && project.challenges.length > 0 && (
                    <div className="bg-card border rounded-xl p-6 lg:p-8">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-orange-500/10 rounded-lg">
                          <Target className="h-5 w-5 text-orange-500" />
                        </div>
                        <h3 className="text-xl font-bold">Challenges & Solutions</h3>
                      </div>
                      <div className="space-y-4">
                        {project.challenges.map((challenge: any, index: number) => (
                          <div key={index} className="p-4 border border-orange-200 dark:border-orange-800 rounded-lg">
                            <h4 className="font-semibold text-orange-600 dark:text-orange-400 mb-2">
                              Challenge: {challenge.problem}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              Solution: {challenge.solution}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Project Gallery */}
                  {project.gallery && project.gallery.length > 0 && (
                    <div className="bg-card border rounded-xl p-6 lg:p-8">
                      <h3 className="text-xl font-bold mb-6">Project Gallery</h3>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {project.gallery.map((image: string, index: number) => (
                          <div key={index} className="aspect-video relative rounded-lg overflow-hidden">
                            <Image
                              src={image}
                              alt={`${project.title} screenshot ${index + 1}`}
                              fill
                              className="object-cover hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Sidebar */}
                <div className="lg:sticky lg:top-6 lg:h-fit space-y-6">
                  {/* Project Info */}
                  <div className="bg-card border rounded-xl p-6">
                    <h3 className="text-lg font-semibold mb-4">Project Info</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Duration</p>
                          <p className="text-sm text-muted-foreground">{project.duration || "3-6 months"}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Team Size</p>
                          <p className="text-sm text-muted-foreground">{project.teamSize || "2-4 members"}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Code className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Role</p>
                          <p className="text-sm text-muted-foreground">{project.role || "Full Stack Developer"}</p>
                        </div>
                      </div>

                      {project.client && (
                        <div className="flex items-start gap-3">
                          <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">Client</p>
                            <p className="text-sm text-muted-foreground">{project.client}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quick Links */}
                  <div className="bg-card border rounded-xl p-6">
                    <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                    <div className="space-y-3">
                      {project.liveUrl && (
                        <Button variant="outline" size="sm" className="w-full justify-start gap-2" asChild>
                          <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                            <Globe className="h-4 w-4" />
                            Live Demo
                          </Link>
                        </Button>
                      )}
                      {project.githubUrl && (
                        <Button variant="outline" size="sm" className="w-full justify-start gap-2" asChild>
                          <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                            <Github className="h-4 w-4" />
                            Source Code
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Project Categories */}
                  {project.categories && project.categories.length > 0 && (
                    <div className="bg-card border rounded-xl p-6">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Tag className="h-5 w-5 text-primary" />
                        Categories
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {project.categories.map((category: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {category}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <FooterSection />
    </>
  )
}
