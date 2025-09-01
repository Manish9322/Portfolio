"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useGetExperiencesQuery } from "@/services/api";

interface Experience {
  _id: string;
  company: string;
  position: string;
  period: string;
  location: string;
  description: string;
  logo: string;
  achievements: string[];
  technologies: string[];
  responsibilities: string[];
  order: number;
}

export function ExperienceSection() {
  const { data: experiences = [], isLoading: isLoadingExperiences } = useGetExperiencesQuery(undefined);

  // Sort experiences by order field
  const sortedExperiences = experiences
    ? [...experiences].sort((a: Experience, b: Experience) => a.order - b.order)
    : [];

  const ExperienceSkeletonCard = () => (
    <Card className="overflow-hidden">
      <CardContent className="p-8">
        <div className="flex items-center gap-4 mb-4">
          <Skeleton className="w-16 h-16 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <Skeleton className="h-4 w-48 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6 mb-4" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-40" />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <section className="py-24 bg-gradient-to-b from-background via-background to-muted/50 dark:from-background dark:via-background/80 dark:to-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="mb-16 text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-black/5 border text-black dark:bg-black/10 border-black/10 text-sm font-medium mb-6 dark:text-white dark:border-white dark:border-white/30">
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-black dark:bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-black dark:bg-white"></span>
            </span>
            Career Growth & Experience
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
            Professional Journey
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            My career path and the companies where I've made an impact
          </p>
        </div>

        <div className="relative">
          {isLoadingExperiences ? null : experiences &&
            experiences.length > 0 && (
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/80 via-primary/50 to-primary/20 dark:from-primary/60 dark:via-primary/30 dark:to-primary/10 hidden lg:block"></div>
          )}

          <div className="space-y-24">
            {isLoadingExperiences ? (
              <>
                {[...Array(3)].map((_, index) => (
                  <ExperienceSkeletonCard key={index} />
                ))}
              </>
            ) : sortedExperiences && sortedExperiences.length > 0 ? (
              sortedExperiences.map((job: Experience, index: number) => (
                <div key={job._id} className="relative">
                  <div className="absolute left-1/2 top-0 w-6 h-6 bg-primary rounded-full transform -translate-x-1/2 -translate-y-1/2 hidden lg:flex items-center justify-center">
                    <div className="w-3 h-3 bg-background rounded-full"></div>
                  </div>

                  <div
                    className={`lg:grid lg:grid-cols-2 lg:gap-8 items-center ${
                      index % 2 === 0 ? "" : "lg:flex-row-reverse"
                    }`}
                  >
                    <div
                      className={`mb-8 lg:mb-0 ${
                        index % 2 === 0
                          ? "lg:text-right lg:pr-12"
                          : "lg:order-2 lg:text-left lg:pl-12"
                      }`}
                    >
                      <div className="bg-card border shadow-lg rounded-md p-8 transform transition-all hover:-translate-y-1 hover:shadow-xl">
                        <div className="flex items-center gap-4 mb-4 justify-start">
                          <div className="w-16 h-16 relative flex-shrink-0 rounded-full overflow-hidden border bg-muted">
                            <Image
                              src={job.logo || "/placeholder.svg"}
                              alt={job.company}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold">
                              {job.position}
                            </h3>
                            <p className="text-primary font-medium">
                              {job.company}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 mb-6 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <span className="inline-block w-3 h-3 rounded-full bg-primary/20"></span>
                            {job.period}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {job.location}
                          </div>
                        </div>

                        <p className="mb-6 text-muted-foreground">
                          {job.description}
                        </p>

                        <div className="space-y-4">
                          <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                            Key Achievements
                          </h4>
                          <ul className="space-y-2">
                            {job.achievements.map((achievement, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mt-2"></span>
                                <span className="text-sm">{achievement}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`${
                        index % 2 === 0
                          ? "lg:pl-12"
                          : "lg:order-1 lg:pr-12 lg:text-right"
                      }`}
                    >
                      <div className="bg-muted/50 backdrop-blur-sm rounded-md p-8 border">
                        <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4">
                          Technologies Used
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {job.technologies.map((tech, i) => (
                            <Badge
                              key={i}
                              variant="outline"
                              className="bg-background"
                            >
                              {tech}
                            </Badge>
                          ))}
                        </div>

                        <div className="mt-8 pt-8 border-t">
                          <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4">
                            Responsibilities
                          </h4>
                          <ul className="space-y-2">
                            {job.responsibilities.map((responsibility, i) => (
                              <li key={i} className="flex items-center gap-2">
                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary"></span>
                                <span className="text-sm">
                                  {responsibility}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div>No experience entries found</div>
            )}
          </div>
        </div>

        <div className="mt-16 text-center">
          <Button asChild variant="outline" size="lg">
            <Link href="/experience">View All Experiences</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export default ExperienceSection;