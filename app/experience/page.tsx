import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Download, MapPin } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getPortfolioData } from "@/lib/portfolio-data"

export default function ExperiencePage() {
  // In a real implementation, this would fetch from your database
  const { experience, name } = getPortfolioData()

  // Additional experience details for a more complete page
  const enhancedExperience = experience.map((job) => ({
    ...job,
    responsibilities: [
      "Led development of key features and products",
      "Collaborated with cross-functional teams",
      "Mentored junior developers",
      "Implemented best practices and coding standards",
      "Participated in code reviews and technical planning",
    ],
    projects: [
      {
        name: "Customer Dashboard Redesign",
        description: "Redesigned the customer dashboard to improve UX and increase engagement by 25%",
      },
      {
        name: "API Performance Optimization",
        description: "Optimized API endpoints resulting in 40% faster response times",
      },
      {
        name: "Authentication System Overhaul",
        description: "Implemented a new authentication system with improved security features",
      },
    ],
  }))

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 max-w-7xl">
          <Link href="/" className="text-xl font-bold">
            {name}
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Home
            </Link>
            <Link href="/work" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Work
            </Link>
            <Link href="/experience" className="text-sm font-medium">
              Experience
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
        <section className="bg-gradient-to-b from-muted/50 to-background py-20">
          <div className="container mx-auto px-4 text-center max-w-7xl">
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl">Professional Experience</h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
              A detailed look at my professional journey, skills, and accomplishments throughout my career.
            </p>
            <div className="flex justify-center gap-4">
              <Button className="gap-2">
                <Download className="h-4 w-4" /> Download Resume
              </Button>
              <Button variant="outline" asChild>
                <Link href="/contact">Contact Me</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Experience Timeline */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="relative">
              {/* Vertical timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-primary/20 hidden md:block"></div>

              <div className="space-y-24">
                {enhancedExperience.map((job, index) => (
                  <div key={index} className="relative">
                    {/* Timeline dot */}
                    <div className="absolute left-8 top-0 w-6 h-6 bg-primary rounded-full transform -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center justify-center z-10">
                      <div className="w-3 h-3 bg-background rounded-full"></div>
                    </div>

                    <div className="md:ml-16">
                      <div className="bg-card border shadow-lg rounded-xl overflow-hidden">
                        {/* Header */}
                        <div className="bg-muted p-8">
                          <div className="flex flex-col md:flex-row md:items-center gap-6 justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-16 h-16 relative flex-shrink-0 rounded-full overflow-hidden border bg-background">
                                <Image
                                  src={job.logo || "/placeholder.svg"}
                                  alt={job.company}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div>
                                <h2 className="text-2xl font-bold">{job.position}</h2>
                                <p className="text-primary font-medium">{job.company}</p>
                              </div>
                            </div>
                            <div className="flex flex-col md:items-end gap-1 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <span className="inline-block w-3 h-3 rounded-full bg-primary/20"></span>
                                {job.period}
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {job.location}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-8">
                          <div className="grid md:grid-cols-2 gap-8">
                            <div>
                              <h3 className="text-lg font-semibold mb-4">Overview</h3>
                              <p className="text-muted-foreground mb-6">{job.description}</p>

                              <h3 className="text-lg font-semibold mb-4">Key Responsibilities</h3>
                              <ul className="space-y-3">
                                {job.responsibilities.map((responsibility, i) => (
                                  <li key={i} className="flex items-start gap-3">
                                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mt-2"></span>
                                    <span>{responsibility}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div>
                              <h3 className="text-lg font-semibold mb-4">Key Achievements</h3>
                              <ul className="space-y-3 mb-6">
                                { job.achievements && job.achievements.map((achievement, i) => (
                                  <li key={i} className="flex items-start gap-3">
                                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mt-2"></span>
                                    <span>{achievement}</span>
                                  </li>
                                ))}
                              </ul>

                              <h3 className="text-lg font-semibold mb-4">Technologies Used</h3>
                              <div className="flex flex-wrap gap-2 mb-6">
                                { job.technologies && job.technologies.map((tech, i) => (
                                  <Badge key={i} variant="outline" className="bg-background">
                                    {tech}
                                  </Badge>
                                ))}
                              </div>

                              <h3 className="text-lg font-semibold mb-4">Notable Projects</h3>
                              <div className="space-y-4">
                                {job.projects.map((project, i) => (
                                  <div key={i} className="bg-muted/50 p-4 rounded-lg">
                                    <h4 className="font-medium">{project.name}</h4>
                                    <p className="text-sm text-muted-foreground">{project.description}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-muted py-16">
          <div className="container mx-auto px-4 text-center max-w-7xl">
            <h2 className="text-3xl font-bold mb-4">Interested in working together?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
            </p>
            <Button size="lg" className="gap-2" asChild>
              <Link href="/contact">
                Get In Touch <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {name}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
