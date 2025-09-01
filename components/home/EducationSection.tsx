"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetEducationQuery } from "@/services/api";

interface Education {
  _id: string;
  institution: string;
  degree: string;
  field?: string;
  period: string;
  location?: string;
  description: string;
  gpa?: string;
  achievements: string[];
  logo: string;
  website?: string;
  startDate?: string;
  endDate?: string;
  icon: string;
  certificateUrl?: string;
  type: "degree" | "certification" | "course";
}

export function EducationSection() {
  const { data: educationData = [], isLoading: isLoadingEducation } = useGetEducationQuery(undefined);

  const EducationSkeletonCard = () => (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="aspect-video relative bg-muted flex items-center justify-center p-6">
          <Skeleton className="w-16 h-16 rounded-full" />
        </div>
        <div className="p-6">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2 mb-1" />
          <Skeleton className="h-4 w-1/4 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/30 dark:from-background dark:to-muted/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-black/5 border text-black dark:bg-black/10 border-black/10 text-sm font-medium mb-6 dark:text-white dark:border-white dark:border-white/30">
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-black dark:bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-black dark:bg-white"></span>
            </span>
            Qualifications & Learning
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
            Education & Certifications
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            My academic background and professional certifications
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {isLoadingEducation ? (
            <>
              {[...Array(3)].map((_, index) => (
                <EducationSkeletonCard key={index} />
              ))}
            </>
          ) : educationData && educationData.length > 0 ? (
            educationData.slice(0, 3).map((edu: Education, index: number) => (
              <Card
                key={edu._id}
                className="overflow-hidden transition-all hover:shadow-md"
              >
                <CardContent className="p-0">
                  <div className="aspect-video relative bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center p-6">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      {edu.icon === "graduation" ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8 text-primary"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                          <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"></path>
                        </svg>
                      ) : edu.icon === "certificate" ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8 text-primary"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="15" cy="15" r="3"></circle>
                          <path d="M13 17.5V22l2-1.5 2 1.5v-4.5"></path>
                          <rect
                            width="18"
                            height="14"
                            x="3"
                            y="3"
                            rx="2"
                          ></rect>
                          <path d="M3 8h18"></path>
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8 text-primary"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M4 4v16h16"></path>
                          <path d="M13 4h7"></path>
                          <path d="M13 8h7"></path>
                          <path d="M13 12h7"></path>
                        </svg>
                      )}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-1">{edu.degree}</h3>
                    <p className="text-primary font-medium">
                      {edu.institution}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {edu.period}
                    </p>
                    {edu.location && (
                      <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {edu.location}
                      </p>
                    )}
                    {edu.field && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Field: {edu.field}
                      </p>
                    )}
                    <div className="mt-4">
                      <p className="text-sm">{edu.description}</p>
                    </div>
                    {edu.gpa && (
                      <div className="mt-4">
                        <p className="text-sm font-medium">GPA: {edu.gpa}</p>
                      </div>
                    )}
                    {edu.website && (
                      <div className="mt-4">
                        <a
                          href={edu.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline flex items-center gap-1"
                        >
                          Institution Website{" "}
                          <LinkIcon className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    )}
                    {edu.certificateUrl && (
                      <div className="mt-4">
                        <a
                          href={edu.certificateUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline flex items-center gap-1"
                        >
                          View Certificate{" "}
                          <LinkIcon className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    )}
                    {edu.achievements && edu.achievements.length > 0 && (
                      <div className="mt-4 pt-4 border-t">
                        <h4 className="text-sm font-semibold mb-2">
                          Achievements
                        </h4>
                        <ul className="space-y-1">
                          {edu.achievements.map((achievement, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2 text-sm"
                            >
                              <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mt-1.5"></span>
                              <span className="text-muted-foreground">
                                {achievement}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div>No education entries found</div>
          )}
        </div>

        <div className="mt-16 text-center">
          <Button asChild variant="outline" size="lg">
            <Link href="/education">View All Education</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export default EducationSection;