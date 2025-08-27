"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { BlogCard } from "@/components/ui/blog-card";
import { GallerySection } from "@/components/home";

import {
  ArrowRight,
  ChevronRight,
  ExternalLink,
  Github,
  Mail,
  MapPin,
  Download,
  LinkIcon,
} from "lucide-react";
import { Linkedin, Twitter, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { SocialConnectSection } from "@/components/social-connect-section";
import {
  useGetSkillsQuery,
  useGetProjectsQuery,
  useGetEducationQuery,
  useGetExperiencesQuery,
  useGetProfileQuery,
  useGetBlogsQuery
} from "@/services/api";

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

interface SkillGroup {
  _id: string;
  category: string;
  items: string[];
  order: number;
}

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

interface Blog {
  _id: string
  title: string
  description: string
  content: string
  imageUrl: string
  tags: string[]
  readTime: string
  publishedAt: string
  author: {
    name: string
    avatar: string
  }
}

interface Profile {
  name: string;
  title: string;
  location: string;
  email: string;
  about: string;
  profileImage: string;
  socialLinks: {
    github: string;
    linkedin: string;
    twitter: string;
    instagram: string;
  };
  resumeUrl?: string;
}

export default function Home() {
  const { data: blogs = [], isLoading: isLoadingBlogs } = useGetBlogsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const { data: profileData, isLoading: isLoadingProfile } = useGetProfileQuery(
    undefined,
    {
      refetchOnMountOrArgChange: true,
    }
  );
  const { data: skillsData, isLoading: isLoadingSkills } = useGetSkillsQuery(
    undefined,
    {
      refetchOnMountOrArgChange: true,
    }
  );
  const { data: projects = [], isLoading: isLoadingProjects } =
    useGetProjectsQuery(undefined);
  const { data: educationData = [], isLoading: isLoadingEducation } =
    useGetEducationQuery(undefined);
  const { data: experiences = [], isLoading: isLoadingExperiences } =
    useGetExperiencesQuery(undefined);
  const featuredProjects = (projects as Project[]).filter(
    (project: Project) => project.featured
  );

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit form");
      }

      toast({
        title: "Message Sent!",
        description:
          "Your message has been successfully sent. I'll get back to you soon.",
      });

      // Reset form
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      toast({
        title: "Error",
        description:
          (error as Error).message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate Years of Experience
  const calculateYearsOfExperience = (experiences: Experience[]): string => {
    if (!experiences || experiences.length === 0) return "0";

    let totalMonths = 0;
    experiences.forEach((exp) => {
      const [start, end] = exp.period.split(" - ");
      const startDate = new Date(start);
      let endDate = end === "Present" ? new Date() : new Date(end);

      if (isNaN(startDate.getTime()) && start.match(/^\d{4}-\d{2}$/)) {
        startDate.setTime(new Date(`${start}-01`).getTime());
      }
      if (
        isNaN(endDate.getTime()) &&
        end !== "Present" &&
        end.match(/^\d{4}-\d{2}$/)
      ) {
        endDate.setTime(new Date(`${end}-01`).getTime());
      }

      if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
        const months =
          (endDate.getFullYear() - startDate.getFullYear()) * 12 +
          (endDate.getMonth() - startDate.getMonth());
        totalMonths += months;
      }
    });

    const years = Math.floor(totalMonths / 12);
    return years > 0
      ? `${years}+`
      : totalMonths > 0
      ? `${totalMonths} mo`
      : "<1";
  };

  // Calculate Total Skills
  const totalSkills = skillsData
    ? skillsData.reduce(
        (sum: number, group: SkillGroup) => sum + group.items.length,
        0
      )
    : 0;

  // Calculate Total Certifications
  const totalCertifications = educationData
    ? educationData.filter((edu: Education) => edu.type === "certification")
        .length
    : 0;

  // Sort skills by order field
  const sortedSkills = skillsData
    ? [...skillsData].sort((a: SkillGroup, b: SkillGroup) => a.order - b.order)
    : [];

  // Sort experiences by order field
  const sortedExperiences = experiences
    ? [...experiences].sort((a: Experience, b: Experience) => a.order - b.order)
    : [];

  const SkeletonCard = () => (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <Skeleton className="h-6 w-32 mb-4" />
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-5 w-16" />
          ))}
        </div>
      </CardContent>
    </Card>
  );

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
    <div className="flex min-h-screen flex-col">
      {/* Professional Hero Section */}
      <section className="relative bg-background text-foreground py-24 md:py-16 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-b from-blue-500/10 dark:from-blue-400/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-gradient-to-t from-purple-500/10 dark:from-purple-400/10 to-transparent rounded-full blur-3xl"></div>

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          {isLoadingProfile ? (
            <div className="flex flex-col items-center space-y-8 animate-pulse">
              <Skeleton className="h-6 w-32 mb-6" />
              <Skeleton className="h-12 w-3/4 mb-2" />
              <Skeleton className="h-8 w-1/2 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-5/6 mb-4" />
              <div className="flex flex-wrap justify-center gap-4">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center">
              <div className="space-y-8 max-w-6xl">
                <div>
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-black/5 border text-black dark:bg-black/10 border-black/10 text-sm font-medium mb-6 dark:text-white dark:border-white dark:border-white/30">
                    <span className="relative flex h-2 w-2 mr-2">
                      <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-black dark:bg-white opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-black dark:bg-white"></span>
                    </span>
                    Available for new opportunities
                  </div>

                  <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-tight">
                    <span className="block mb-3 text-gray-900 dark:text-white">
                      Hello, I'm
                    </span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600">
                      {profileData?.name}
                    </span>
                  </h1>

                  <div className="h-0.5 w-full bg-blue-500 my-6 mx-auto rounded-full"></div>

                  <h2 className="text-2xl md:text-3xl font-medium text-black dark:text-white mb-4">
                    {profileData?.title}
                  </h2>

                  <p className="text-lg text-gray-600 dark:text-white leading-relaxed max-w-3xl mx-auto">
                    {profileData?.about} Specializing in creating modern,
                    high-performance web applications with exceptional user
                    experiences.
                  </p>
                </div>

                <div className="flex flex-wrap justify-center gap-4">
                  <Button
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300 shadow-lg hover:shadow-blue-900/20 dark:bg-transparent dark:border dark:border-white/25 dark:hover:bg-blue-600 dark:hover:text-white"
                    asChild
                  >
                    <Link href="/work">
                      View My Work <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>

                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-blue-600 hover:bg-blue-700 hover:text-white text-white transition-all duration-300 shadow-lg hover:shadow-blue-900/20 dark:bg-transparent dark:border dark:border-white/25 dark:hover:bg-blue-600 dark:hover:text-white"
                    asChild
                  >
                    <Link href="/contact">
                      Contact Me <Mail className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>

                  {/* Social Links - Updated styles */}
                  {profileData?.socialLinks.github && (
                    <Link
                      href={profileData.socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-black dark:text-blue-600 hover:text-blue-600 hover:bg-blue-50 dark:hover:text-white dark:hover:bg-blue-600"
                      >
                        <Github className="h-5 w-5" />
                      </Button>
                    </Link>
                  )}

                  {profileData?.socialLinks.linkedin && (
                    <Link
                      href={profileData.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-black dark:text-blue-600 hover:text-blue-600 hover:bg-blue-50 dark:hover:text-white dark:hover:bg-blue-600"
                      >
                        <Linkedin className="h-5 w-5 " />
                      </Button>
                    </Link>
                  )}

                  {profileData?.socialLinks.twitter && (
                    <Link
                      href={profileData.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-black dark:text-blue-600 hover:text-blue-600 hover:bg-blue-50 dark:hover:text-white dark:hover:bg-blue-600"
                      >
                        <Twitter className="h-5 w-5 " />
                      </Button>
                    </Link>
                  )}

                  {profileData?.socialLinks.instagram && (
                    <Link
                      href={profileData.socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-black dark:text-blue-600 hover:text-blue-600 hover:bg-blue-50 dark:hover:text-white dark:hover:bg-blue-600"
                      >
                        <Instagram className="h-5 w-5 " />
                      </Button>
                    </Link>
                  )}

                  {profileData?.resumeUrl && (
                    <a href={profileData.resumeUrl} download>
                      <Button
                        size="lg"
                        className="bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300 shadow-lg hover:shadow-blue-900/20 dark:bg-transparent dark:border dark:border-white/25 dark:hover:bg-blue-600 dark:hover:text-white"
                      >
                        Download Resume <Download className="ml-2 h-4 w-4" />
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {isLoadingExperiences ||
            isLoadingProjects ||
            isLoadingSkills ||
            isLoadingEducation
              ? [...Array(4)].map((_, index) => (
                  <div key={index} className="relative group">
                    <div className="relative p-6 border border-black/25 rounded-lg bg-card/50 backdrop-blur-sm">
                      <Skeleton className="h-8 w-16 mb-1" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </div>
                ))
              : [
                  {
                    value: calculateYearsOfExperience(experiences) || "0",
                    label: "Years Experience",
                    subtext: "Professional Development",
                    icon: (
                      <svg
                        className="w-8 h-8 mb-4 text-primary/80"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    ),
                  },
                  {
                    value: projects.length.toString() || "0",
                    label: "Projects Completed",
                    subtext: "Delivered Successfully",
                    icon: (
                      <svg
                        className="w-8 h-8 mb-4 text-primary/80"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                    ),
                  },
                  {
                    value: totalSkills.toString() || "0",
                    label: "Total Skills",
                    subtext: "And Growing Daily",
                    icon: (
                      <svg
                        className="w-8 h-8 mb-4 text-primary/80"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    ),
                  },
                  {
                    value: totalCertifications.toString() || "0",
                    label: "Total Certifications",
                    subtext: "Professional Growth",
                    icon: (
                      <svg
                        className="w-8 h-8 mb-4 text-primary/80"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                        />
                      </svg>
                    ),
                  },
                ].map((stat, index) => (
                  <div key={index} className="relative group">
                    <div className="relative p-6 rounded-lg bg-card hover:bg-card/80 border border-gray/50 hover:border-primary/50 transition-all duration-300 overflow-hidden shadow-lg hover:shadow-xl">
                      {/* Background Patterns */}
                      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      {/* Main Content */}
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                          {stat.icon}
                          <span className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <svg
                              className="w-4 h-4 text-primary dark:text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 10l7-7m0 0l7 7m-7-7v18"
                              />
                            </svg>
                          </span>
                        </div>

                        <div className="space-y-2">
                          <div className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent animate-gradient">
                            {stat.value}
                          </div>
                          <div className="space-y-1">
                            <div className="text-sm font-medium text-foreground">
                              {stat.label}
                            </div>
                            <div className="text-xs text-muted-foreground/80">
                              {stat.subtext}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Corner Accents */}
                      <div className="absolute -right-12 -top-12 w-24 h-24 bg-primary/10 rounded-full blur-2xl transition-all duration-500 group-hover:scale-150" />
                      <div className="absolute -right-2 -top-2 w-8 h-8 bg-primary/20 rounded-full blur-xl transition-all duration-500 group-hover:scale-150" />

                      {/* Bottom Accent Line */}
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </section>

      {/* Enhanced Experience Section */}
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
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/80 via-primary/50 to-primary/20 dark:from-primary/60 dark:via-primary/30 dark:to-primary/10 hidden lg:block"></div>

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

      {/* Featured Projects */}
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

      {/* Skills Section */}
      <section className="bg-muted/50 dark:bg-muted/20 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="mb-12 text-center">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-black/5 border text-black dark:bg-black/10 border-black/10 text-sm font-medium mb-6 dark:text-white dark:border-white dark:border-white/30">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-black dark:bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-black dark:bg-white"></span>
              </span>
              Technical Expertise
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
              My Personal Skills
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Things I've practiced and improved over time.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {isLoadingSkills ? (
              <>
                {[...Array(4)].map((_, index) => (
                  <SkeletonCard key={index} />
                ))}
              </>
            ) : sortedSkills && sortedSkills.length > 0 ? (
              sortedSkills.map((skillGroup: SkillGroup) => (
                <Card key={skillGroup._id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <h3 className="mb-4 text-xl font-bold">
                      {skillGroup.category}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {skillGroup.items.map((skill, index) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div>No skills found</div>
            )}
          </div>
        </div>
      </section>

      {/* Education Section */}
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

      {/* Blog Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="mb-12 text-center">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-black/5 border text-black dark:bg-black/10 border-black/10 text-sm font-medium mb-6 dark:text-white dark:border-white dark:border-white/30">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-black dark:bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-black dark:bg-white"></span>
              </span>
              Fresh Insights
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
              Latest Blog Posts
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Read my latest thoughts, ideas, and insights about technology and
              development
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
            {isLoadingBlogs
              ? [...Array(3)].map((_, i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                ))
              : blogs.map((blog:Blog) => (
                  <BlogCard key={blog._id} blog={blog} variant="compact" />
                ))}
          </div>

          <div className="text-center">
            <Button asChild variant="outline" size="lg">
              <Link href="/blog">
                View All Posts
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <GallerySection />

      {/* Contact & Social Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="mb-12 text-center">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-black/5 border text-black dark:bg-black/10 border-black/10 text-sm font-medium mb-6 dark:text-white dark:border-white dark:border-white/30">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-black dark:bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-black dark:bg-white"></span>
              </span>
              Let's Connect
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground mb-4">
              Get In Touch
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12">
              Have a question or want to collaborate? I'm always open to new
              opportunities and interesting projects.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <SocialConnectSection />
            <div className="bg-card rounded-md shadow-lg p-8 border border-border">
              <h3 className="text-2xl font-bold mb-2">Get In Touch</h3>
              <p className="text-muted-foreground mb-6">
                Have a question or want to work together? Send me a message!
              </p>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                    placeholder="Your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Message
                  </label>
                  <textarea
                    id="message"
                    className="w-full px-3 py-2 border border-input rounded-md bg-background min-h-[120px]"
                    placeholder="Your message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                  ></textarea>
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-8 bg-background">
        <div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {profileData?.name || "Alex Morgan"}.
            All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
