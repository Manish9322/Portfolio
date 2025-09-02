"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useGetEducationQuery,
  useGetExperiencesQuery,
  useGetProfileQuery,
  useGetProjectsQuery,
  useGetSkillsQuery,
} from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Github,
  Mail,
  Download,
  MapPin,
  Star,
  Trophy,
  Code,
  Briefcase,
  Zap,
  Users,
  Globe,
} from "lucide-react";
import { Linkedin, Twitter, Instagram } from "lucide-react";
import { useState, useEffect } from "react";

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

// Custom hook for typewriter effect
const useTypewriter = (
  text: string,
  speed: number = 50,
  delay: number = 1000
) => {
  const [displayText, setDisplayText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!text) return;

    setDisplayText("");
    setIsComplete(false);

    const timeout = setTimeout(() => {
      let i = 0;
      const timer = setInterval(() => {
        if (i < text.length) {
          setDisplayText(text.slice(0, i + 1));
          i++;
        } else {
          setIsComplete(true);
          clearInterval(timer);
        }
      }, speed);

      return () => clearInterval(timer);
    }, delay);

    return () => clearTimeout(timeout);
  }, [text, speed, delay]);

  return { displayText, isComplete };
};

// Custom hook for rotating text
const useRotatingText = (texts: string[], interval: number = 3000) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (texts.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length);
    }, interval);

    return () => clearInterval(timer);
  }, [texts, interval]);

  return texts[currentIndex] || "";
};

export function HeroSection() {
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

  const yearsOfExperience = calculateYearsOfExperience(experiences);

  // Typewriter effect for name
  const { displayText: typedName, isComplete } = useTypewriter(
    profileData?.name || "",
    100, // typing speed in ms
    500 // delay before starting in ms
  );

  // Rotating specializations
  const specializations = [
    "Full Stack Developer",
    "React Specialist",
    "Node.js Expert",
    "UI/UX Enthusiast",
    "Problem Solver",
  ];

  const rotatingSpecialization = useRotatingText(specializations, 2500);

  // Get top skills for preview
  const topSkills =
    skillsData
      ?.slice(0, 3)
      ?.flatMap((group: SkillGroup) => group.items.slice(0, 2))
      .slice(0, 5) || [];

  return (
    <section className="relative bg-background text-foreground py-24 md:py-16 overflow-hidden min-h-screen flex items-center">
      {/* Enhanced Background Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-b from-primary/10 dark:from-white/10 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-gradient-to-t from-primary/10 dark:from-white/10 to-transparent rounded-full blur-3xl"></div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-2 h-2 bg-primary/30 rounded-full animate-pulse"></div>
      <div
        className="absolute top-40 right-32 w-1 h-1 bg-primary/40 rounded-full animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>
      <div
        className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-primary/20 rounded-full animate-pulse"
        style={{ animationDelay: "2s" }}
      ></div>

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
                  <span className="text-gray-900 dark:text-white">
                    {typedName}
                    {!isComplete && (
                      <span className="animate-pulse text-primary">|</span>
                    )}
                  </span>
                </h1>

                <h2 className="text-2xl md:text-3xl font-medium text-black dark:text-white mt-4 mb-2">
                  {profileData?.title}
                </h2>

                <p className="text-lg text-gray-600 dark:text-white leading-relaxed max-w-3xl mx-auto mb-6">
                  {profileData?.about} Specializing in creating modern,
                  high-performance web applications with exceptional user
                  experiences.
                </p>

                {/* Top Skills Preview */}
                {topSkills.length > 0 && (
                  <div className="mb-8">
                    <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
                      {topSkills.map((skill: any, index: any) => (
                        <span key={index} className="">
                          <Badge key={index} variant="secondary" className="border border-gray-500">
                            {skill}
                          </Badge>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4">
                {/* Primary Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    className="bg-black hover:text-black hover:border hover:bg-white text-white transition-all duration-300 shadow-lg hover:shadow-gray-900/20 dark:bg-transparent dark:border-white dark:border dark:hover:bg-gray-800 dark:hover:text-white group"
                    asChild
                  >
                    <Link href="/work" className="flex items-center">
                      View My Work
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>

                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-black hover:text-black hover:border hover:bg-white text-white transition-all duration-300 shadow-lg hover:shadow-gray-900/20 dark:bg-transparent dark:border-white dark:border dark:hover:bg-gray-800 dark:hover:text-white group"
                    asChild
                  >
                    <Link href="/contact" className="flex items-center">
                      Contact Me
                      <Mail className="ml-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                    </Link>
                  </Button>
                </div>

                {/* Social Links */}
                <div className="flex justify-center gap-2">
                  {profileData?.socialLinks.github && (
                    <Link
                      href={profileData.socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-black dark:text-white hover:text-white hover:bg-black dark:hover:text-gray-900 dark:hover:bg-white transition-all duration-300 hover:scale-110"
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
                        className="text-black dark:text-white hover:text-white hover:bg-black dark:hover:text-gray-900 dark:hover:bg-white transition-all duration-300 hover:scale-110"
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
                        className="text-black dark:text-white hover:text-white hover:bg-black dark:hover:text-gray-900 dark:hover:bg-white transition-all duration-300 hover:scale-110"
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
                        className="text-black dark:text-white hover:text-white hover:bg-black dark:hover:text-gray-900 dark:hover:bg-white transition-all duration-300 hover:scale-110"
                      >
                        <Instagram className="h-5 w-5 " />
                      </Button>
                    </Link>
                  )}
                </div>

                {/* Resume Download */}
                {profileData?.resumeUrl && (
                  <a href={profileData.resumeUrl} download>
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white transition-all duration-300 shadow-lg hover:shadow-primary/20 group"
                    >
                      Download Resume
                      <Download className="ml-2 h-4 w-4 group-hover:translate-y-1 transition-transform" />
                    </Button>
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {isLoadingExperiences ||
          isLoadingProjects ||
          isLoadingSkills ||
          isLoadingEducation
            ? [...Array(4)].map((_, index) => (
                <div key={index} className="relative group">
                  <div className="relative p-6 border border-black/25 rounded-md bg-card/50 backdrop-blur-sm">
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
                  <div className="relative p-6 rounded-md bg-card hover:bg-card/80 border border-gray/50 hover:border-primary/50 transition-all duration-300 overflow-hidden shadow-lg hover:shadow-xl">
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
                    <div className="absolute -right-12 -top-12 w-24 h-24 bg-black/10 rounded-full blur-2xl transition-all duration-500 group-hover:scale-150" />
                    <div className="absolute -right-2 -top-2 w-8 h-8 bg-black/20 rounded-full blur-xl transition-all duration-500 group-hover:scale-150" />

                    {/* Bottom Accent Line */}
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
              ))}
        </div>

        {/* Scroll Indicator */}
        <div className="mt-16 flex flex-col items-center animate-bounce">
          <span className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            Scroll to explore
          </span>
          <div className="w-6 h-10 border-2 border-gray-300 dark:border-gray-600 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-500 dark:bg-gray-400 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>

        {/* Background Decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-b from-primary/5 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-t from-primary/5 to-transparent rounded-full blur-3xl"></div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
