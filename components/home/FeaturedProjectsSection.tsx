"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useGetProjectsQuery } from "@/services/api";

interface Project {
  _id?: string;
  title: string;
  description: string;
  imageUrl: string;
  tags: string[];
  liveUrl: string;
  githubUrl: string;
  featured: boolean;
}

export function FeaturedProjectsSection() {
  const { data: projects = [], isLoading: isLoadingProjects } = useGetProjectsQuery(undefined);
  
  const featuredProjects = (projects as Project[]).filter(
    (project: Project) => project.featured
  );

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-black/5 border text-black dark:bg-black/10 border-black/10 text-sm font-medium mb-6 dark:text-white dark:border-white dark:border-white/30">
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-black dark:bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-black dark:bg-white"></span>
            </span>
            Recent Work
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
            Featured Projects
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Check out some of my latest projects below
          </p>
        </div>

        <div className="grid gap-12">
          {isLoadingProjects ? (
            <div className="grid gap-12">
              {[...Array(2)].map((_, index) => (
                <div
                  key={index}
                  className="group relative grid gap-4 md:gap-8 md:grid-cols-2 animate-pulse"
                >
                  <div className="relative aspect-video overflow-hidden rounded-md bg-muted" />
                  <div className="flex flex-col justify-center space-y-4">
                    <div className="h-6 w-3/4 bg-muted rounded" />
                    <div className="h-4 w-full bg-muted rounded" />
                    <div className="h-4 w-5/6 bg-muted rounded" />
                    <div className="mt-4 flex flex-wrap gap-2">
                      {[...Array(3)].map((_, i) => (
                        <span
                          key={i}
                          className="h-6 w-16 rounded-full bg-muted"
                        />
                      ))}
                    </div>
                    <div className="mt-8 flex gap-4">
                      <div className="h-10 w-32 rounded-md bg-muted" />
                      <div className="h-10 w-32 rounded-md bg-muted" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            featuredProjects.map((project: Project, index: number) => (
              <div
                key={project._id}
                className={`group relative grid gap-4 md:gap-8 md:grid-cols-2 ${
                  index % 2 !== 0 ? "md:[&>*:first-child]:order-last" : ""
                }`}
              >
                <div className="relative aspect-video overflow-hidden rounded-md">
                  <Image
                    src={project.imageUrl || "/placeholder.svg"}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold">{project.title}</h3>
                    <p className="text-muted-foreground">
                      {project.description}
                    </p>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.tags.map((tag: string, index: number) => (
                      <span
                        key={index}
                        className="inline-flex items-center rounded-full border border-border px-2.5 py-0.5 text-xs font-semibold transition-colors hover:bg-secondary text-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-8 flex items-center gap-4">
                    {project.liveUrl && (
                      <Button asChild>
                        <Link href={`/work/${project._id}`}>
                          View Project
                        </Link>
                      </Button>
                    )}
                    {project.githubUrl && (
                      <Button variant="outline" asChild>
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View Code
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-16 text-center">
          <Button asChild variant="outline" size="lg">
            <Link href="/work">View All Projects</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export default FeaturedProjectsSection;