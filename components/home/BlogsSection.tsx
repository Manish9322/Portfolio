import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BlogCard } from "@/components/ui/blog-card";
import { useGetBlogsQuery } from "@/services/api";

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

export const BlogsSection = () => {
  const { data: blogs = [], isLoading: isLoadingBlogs } = useGetBlogsQuery(
    undefined,
    {
      refetchOnMountOrArgChange: true,
    }
  );

  return (
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
            : blogs
                .slice(0, 3)
                .map((blog: Blog) => (
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
  );
};

export default BlogsSection;