"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { BlogCard } from "@/components/ui/blog-card";
import {
  HeroSection,
  ExperienceSection,
  EducationSection,
  GallerySection,
  TestimonialSection,
  FeaturedProjectsSection,
  SkillsSection,
  ContactSection,
  FooterSection,
  MarqueeStrip,
} from "@/components/home";
import BlogsSection from "@/components/home/BlogsSection";

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
  useGetBlogsQuery,
} from "@/services/api";
import Skill from "@/models/Skills.model";

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
  _id: string;
  title: string;
  description: string;
  content: string;
  imageUrl: string;
  tags: string[];
  readTime: string;
  publishedAt: string;
  author: {
    name: string;
    avatar: string;
  };
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
  const { data: blogs = [], isLoading: isLoadingBlogs } = useGetBlogsQuery(
    undefined,
    {
      refetchOnMountOrArgChange: true,
    }
  );

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
      {/* Recent Updates Marquee */}
      <MarqueeStrip />

      {/* Hero Section */}
      <HeroSection />

      {/* Experience Section */}
      <ExperienceSection />

      {/* Featured Projects Section */}
      <FeaturedProjectsSection />

      {/* Skills Section */}
      <SkillsSection />

      {/* Education Section */}
      <EducationSection />

      {/* Blogs Section */}
      <BlogsSection />

      {/* Gallery Section */}
      <GallerySection />

      {/* Testimonial Section */}
      <TestimonialSection />

      {/* Contact Section */}
      <ContactSection />

      {/* Footer Section */}
      <FooterSection />
    </div>
  );
}
