"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Github, Globe, Calendar, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// Mock data for a single project
const mockProject = {
  id: "1",
  title: "E-Commerce Platform",
  description: "A full-featured e-commerce platform built with Next.js and Node.js, featuring real-time inventory management, secure payment processing, and an intuitive admin dashboard.",
  longDescription: `
    This e-commerce platform was developed to provide businesses with a modern, scalable solution for online retail. 
    The project showcases advanced features and robust architecture designed for high performance and reliability.

    Key Features:
    • Real-time inventory tracking with WebSocket integration
    • Secure payment processing with Stripe
    • Advanced search and filtering capabilities
    • Responsive design optimized for all devices
    • Admin dashboard with analytics
    • Customer account management
    • Order tracking and history
    • Product reviews and ratings
  `,
  imageUrl: "/placeholder.jpg",
  tags: ["Next.js", "React", "Node.js", "MongoDB", "Stripe", "WebSocket", "TypeScript", "TailwindCSS"],
  liveUrl: "https://example.com",
  githubUrl: "https://github.com/example/project",
  timeline: "Jan 2023 - Apr 2023",
  role: "Lead Developer",
  team: "4 members",
  challenges: [
    "Implementing real-time inventory synchronization across multiple warehouses",
    "Optimizing database queries for large product catalogs",
    "Ensuring secure payment processing and data handling",
    "Building a scalable architecture for high traffic loads"
  ],
  solutions: [
    "Utilized WebSocket for real-time updates",
    "Implemented database indexing and caching strategies",
    "Integrated Stripe's secure payment infrastructure",
    "Deployed with containerization and load balancing"
  ],
  screenshots: [
    {
      url: "/placeholder.jpg",
      caption: "Dashboard Overview"
    },
    {
      url: "/placeholder.jpg",
      caption: "Product Management"
    },
    {
      url: "/placeholder.jpg",
      caption: "Analytics Dashboard"
    }
  ]
}

export default function ProjectDetails({ params }: { params: { id: string } }) {
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

            <h1 className="text-4xl md:text-5xl font-bold mb-6">{mockProject.title}</h1>
            
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4" />
                {mockProject.timeline}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Tag className="h-4 w-4" />
                {mockProject.role}
              </div>
            </div>

            <p className="text-lg text-gray-300 leading-relaxed mb-8">
              {mockProject.description}
            </p>

            <div className="flex flex-wrap gap-4">
              {mockProject.liveUrl && (
                <Button 
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                  asChild
                >
                  <a href={mockProject.liveUrl} target="_blank" rel="noopener noreferrer">
                    <Globe className="mr-2 h-4 w-4" />
                    Visit Website
                  </a>
                </Button>
              )}
              {mockProject.githubUrl && (
                <Button variant="outline" className="border-white/20 hover:bg-white/10" asChild>
                  <a href={mockProject.githubUrl} target="_blank" rel="noopener noreferrer">
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
                  {mockProject.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Timeline</h3>
                <p className="text-muted-foreground">{mockProject.timeline}</p>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Team</h3>
                <p className="text-muted-foreground">{mockProject.team}</p>
              </div>
            </div>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <h2 className="text-2xl font-bold mb-6">Project Overview</h2>
              <div className="whitespace-pre-line text-muted-foreground">
                {mockProject.longDescription}
              </div>

              <div className="mt-12">
                <h3 className="text-xl font-bold mb-4">Challenges</h3>
                <ul className="space-y-2 text-muted-foreground">
                  {mockProject.challenges.map((challenge, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mt-2"></span>
                      <span>{challenge}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-12">
                <h3 className="text-xl font-bold mb-4">Solutions</h3>
                <ul className="space-y-2 text-muted-foreground">
                  {mockProject.solutions.map((solution, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mt-2"></span>
                      <span>{solution}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-16">
              <h2 className="text-2xl font-bold mb-8">Project Screenshots</h2>
              <div className="grid md:grid-cols-2 gap-8">
                {mockProject.screenshots.map((screenshot, index) => (
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
          </div>
        </div>
      </section>
    </div>
  )
} 