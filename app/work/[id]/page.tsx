"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  Github,
  Globe,
  Calendar,
  Tag,
  Clock,
  Info,
  Users,
  Target,
  Lightbulb,
  Code,
  Check,
  Star,
  Eye,
  Heart,
  Share2,
  BookOpen,
  ExternalLink,
  Puzzle,
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  Copy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGetProjectQuery } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import { FooterSection } from "@/components/home/FooterSection";

export default function ProjectDetails() {
  const params = useParams();
  const { toast } = useToast();
  const {
    data: project,
    isLoading,
    error,
  } = useGetProjectQuery(params.id as string);

  // State for interactions
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [copied, setCopied] = useState(false);

  // Helper functions
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copied!",
        description: "Project URL copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy URL.",
        variant: "destructive",
      });
    }
  };

  const handleShare = async (platform: string) => {
    const url = window.location.href;
    const title = project?.title || "";
    const text = project?.description || "";

    let shareUrl = "";
    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          url
        )}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
          url
        )}&text=${encodeURIComponent(title)}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          url
        )}`;
        break;
      case "email":
        shareUrl = `mailto:?subject=${encodeURIComponent(
          title
        )}&body=${encodeURIComponent(`${text}\n\n${url}`)}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400");
    }
  };

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
    );
  }

  if (error || !project) {
    return (
      <>
        <Header backLink="/work" backText="Back to Projects" />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The project you're looking for doesn't exist.
            </p>
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
    );
  }

  return (
    <>
      <Header backLink="/work" backText="Back to Projects" />
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative mb-8 lg:mb-12">
          <div className="container mx-auto px-4 pt-8 pb-12 lg:pt-12 lg:pb-16">
            <div className="max-w-6xl mx-auto">
              {/* Project Header */}
              <div className="text-center mb-8 lg:mb-12">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-foreground">
                  {project.title}
                </h1>
                <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
                  {project.description}
                </p>

                {/* Project Meta */}
                <div className="flex flex-wrap items-center justify-center gap-6 text-muted-foreground mb-8">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <Code className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                      <p className="font-medium text-foreground">
                        {project.role || "Full Stack Developer"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Project Role
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{project.timeline || "3-6 months"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>{project.team || "Solo project"}</span>
                  </div>
                </div>
              </div>

              {/* Featured Image */}
              {project.imageUrl && project.imageUrl !== "/placeholder.svg" && (
                <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-card border">
                  <div className="aspect-[16/9] relative">
                    <Image
                      src={project.imageUrl}
                      alt={project.title}
                      fill
                      className="object-cover"
                      priority
                      onError={(e) => {
                        console.error(
                          "Error loading project image:",
                          project.imageUrl
                        );
                        e.currentTarget.src = "/placeholder.svg";
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              {/* Project Stats */}
              <Card className="mb-8">
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary mb-1">
                        {project.tags?.length || 0}
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                        <Code className="h-4 w-4" />
                        Technologies
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary mb-1">
                        {(project.challenges?.length || 0) +
                          (project.solutions?.length || 0)}
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                        <Target className="h-4 w-4" />
                        Challenges & Solutions
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary mb-1">
                        {project.team || "Solo"}
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                        <Users className="h-4 w-4" />
                        Team Size
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary mb-1">
                        {project.timeline || "3-6"}
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                        <Clock className="h-4 w-4" />
                        Timeline
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid lg:grid-cols-4 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-3">
                  {/* Tags */}
                  {project.tags && project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-8">
                      {project.tags.map((tag: string, index: number) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs px-2 py-0.5 hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                        >
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Project Overview */}
                  <Card className="mb-8">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Info className="h-5 w-5" />
                        Project Overview
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:text-foreground prose-p:text-muted-foreground prose-p:leading-relaxed prose-a:text-primary hover:prose-a:text-primary/80 prose-strong:text-foreground prose-ul:text-muted-foreground prose-ol:text-muted-foreground prose-blockquote:border-primary prose-blockquote:text-muted-foreground prose-code:text-primary prose-pre:bg-muted">
                        <p>{project.description}</p>
                        {project.longDescription && (
                          <div
                            dangerouslySetInnerHTML={{
                              __html: project.longDescription,
                            }}
                          />
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Challenges & Solutions */}
                  {((project.challenges && project.challenges.length > 0) ||
                    (project.solutions && project.solutions.length > 0)) && (
                    <Card className="mb-8">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Puzzle className="h-5 w-5" />
                          Challenges & Solutions
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          {project.challenges &&
                            project.challenges.length > 0 && (
                              <div>
                                <h4 className="font-semibold text-black dark:text-white mb-3 flex items-center gap-2">
                                  <Target className="h-4 w-4" />
                                  Challenges Faced
                                </h4>
                                <div className="space-y-3">
                                  {project.challenges.map(
                                    (challenge: string, index: number) => (
                                      <div
                                        key={index}
                                        className="ml-5 list-item list-disc"
                                      >
                                        <p className="text-sm leading-relaxed">
                                          {challenge}
                                        </p>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            )}

                          {project.solutions &&
                            project.solutions.length > 0 && (
                              <div>
                                <h4 className="font-semibold text-black dark:text-white mb-3 flex items-center gap-2">
                                  <Lightbulb className="h-4 w-4" />
                                  Solutions Implemented
                                </h4>
                                <div className="space-y-3">
                                  {project.solutions.map(
                                    (solution: string, index: number) => (
                                      <div
                                        key={index}
                                        className="ml-5 list-item list-disc"
                                      >
                                        <p className="text-sm leading-relaxed">
                                          {solution}
                                        </p>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            )}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Project Screenshots */}
                  {project.screenshots && project.screenshots.length > 0 && (
                    <Card className="mb-8">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Eye className="h-5 w-5" />
                          Project Screenshots
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid sm:grid-cols-2 gap-4">
                          {project.screenshots.map(
                            (screenshot: any, index: number) => (
                              <div key={index} className="space-y-2">
                                <div className="aspect-video relative rounded-lg overflow-hidden border">
                                  <Image
                                    src={screenshot.url || "/placeholder.svg"}
                                    alt={
                                      screenshot.caption ||
                                      `${project.title} screenshot ${index + 1}`
                                    }
                                    fill
                                    className="object-cover hover:scale-105 transition-transform duration-300"
                                    onError={(e) => {
                                      console.error(
                                        "Error loading screenshot:",
                                        screenshot.url
                                      );
                                      e.currentTarget.src = "/placeholder.svg";
                                    }}
                                  />
                                </div>
                                {screenshot.caption && (
                                  <p className="text-sm text-muted-foreground text-center">
                                    {screenshot.caption}
                                  </p>
                                )}
                              </div>
                            )
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Project Gallery (if exists) */}
                  {project.gallery && project.gallery.length > 0 && (
                    <Card className="mb-8">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Eye className="h-5 w-5" />
                          Project Gallery
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid sm:grid-cols-2 gap-4">
                          {project.gallery.map(
                            (image: string, index: number) => (
                              <div
                                key={index}
                                className="aspect-video relative rounded-lg overflow-hidden"
                              >
                                <Image
                                  src={image}
                                  alt={`${project.title} gallery image ${
                                    index + 1
                                  }`}
                                  fill
                                  className="object-cover hover:scale-105 transition-transform duration-300"
                                />
                              </div>
                            )
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Project Actions */}
                  <Card className="mb-8">
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          {project.liveUrl && (
                            <Button asChild size="sm" className="gap-2">
                              <Link
                                href={project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Globe className="h-4 w-4" />
                                Live Demo
                              </Link>
                            </Button>
                          )}
                          {project.githubUrl && (
                            <Button
                              asChild
                              variant="outline"
                              size="sm"
                              className="gap-2"
                            >
                              <Link
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Github className="h-4 w-4" />
                                Source Code
                              </Link>
                            </Button>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() =>
                              setShowShareOptions(!showShareOptions)
                            }
                            variant="outline"
                            size="sm"
                            className="gap-2"
                          >
                            <Share2 className="h-4 w-4" />
                            Share
                          </Button>
                          {showShareOptions && (
                            <div className="flex items-center gap-1 ml-2">
                              <Button
                                onClick={() => handleShare("facebook")}
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0"
                              >
                                <Facebook className="h-4 w-4" />
                              </Button>
                              <Button
                                onClick={() => handleShare("twitter")}
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0"
                              >
                                <Twitter className="h-4 w-4" />
                              </Button>
                              <Button
                                onClick={() => handleShare("linkedin")}
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0"
                              >
                                <Linkedin className="h-4 w-4" />
                              </Button>
                              <Button
                                onClick={() => handleShare("email")}
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0"
                              >
                                <Mail className="h-4 w-4" />
                              </Button>
                              <Button
                                onClick={copyToClipboard}
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0"
                              >
                                {copied ? (
                                  <Check className="h-4 w-4" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar */}
                <div className="lg:sticky lg:top-6 lg:h-fit">
                  {/* Quick Actions */}
                  <Card className="mb-6 mt-20">
                    <CardHeader>
                      <CardTitle className="text-lg">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {project.liveUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-start gap-2"
                          asChild
                        >
                          <Link
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Globe className="h-4 w-4" />
                            View Live Demo
                          </Link>
                        </Button>
                      )}
                      {project.githubUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-start gap-2"
                          asChild
                        >
                          <Link
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Github className="h-4 w-4" />
                            Source Code
                          </Link>
                        </Button>
                      )}
                      <div className="pt-4 border-t">
                        <h5 className="text-sm font-medium mb-3 flex items-center gap-2">
                          <Share2 className="h-4 w-4" />
                          Share Project
                        </h5>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleShare("facebook")}
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0"
                          >
                            <Facebook className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => handleShare("twitter")}
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0"
                          >
                            <Twitter className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => handleShare("linkedin")}
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0"
                          >
                            <Linkedin className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={copyToClipboard}
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0"
                          >
                            {copied ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Project Info */}
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle className="text-lg">Project Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Timeline</p>
                          <p className="text-sm text-muted-foreground">
                            {project.timeline || "3-6 months"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Team Size</p>
                          <p className="text-sm text-muted-foreground">
                            {project.team || "Solo project"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Code className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Role</p>
                          <p className="text-sm text-muted-foreground">
                            {project.role || "Full Stack Developer"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Project Tags */}
                  {project.tags && project.tags.length > 0 && (
                    <Card className="mb-6">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Tag className="h-5 w-5 text-primary" />
                          Technologies
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <p className="text-sm text-muted-foreground mb-4">
                            Technologies used in this project
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {project.tags.map((tag: string, index: number) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs px-2 py-1"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <FooterSection />
    </>
  );
}
