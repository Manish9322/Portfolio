import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useGetFeedbacksQuery } from "@/services/api";

/**
 * TestimonialSection Component
 * 
 * This component displays client feedback and testimonials on the main page.
 * It dynamically fetches approved and visible feedback from the database using the admin panel.
 * If no database feedback is available or API fails, it falls back to hardcoded testimonials.
 */

// Fallback testimonials in case API fails or no data
const fallbackTestimonials = [
  {
    feedback:
      "Outstanding work! The attention to detail and professional execution exceeded our expectations completely.",
    name: "Alice Johnson",
    role: "Product Manager",
  },
  {
    feedback:
      "A pleasure to work with, always delivers on time with exceptional quality and clear communication.",
    name: "Michael Lee",
    role: "Lead Developer",
  },
  {
    feedback:
      "Creative, reliable, and highly skilled. The solutions provided were innovative and effective.",
    name: "Priya Singh",
    role: "UX Designer",
  },
  {
    feedback:
      "Transformed our ideas into reality with professionalism and technical expertise that impressed our team.",
    name: "Carlos Rivera",
    role: "Startup Founder",
  },
  {
    feedback:
      "Excellent communication and top-notch results. Every project milestone was met with precision.",
    name: "Sophie Müller",
    role: "Marketing Lead",
  },
  {
    feedback:
      "The best developer I've collaborated with. Technical skills combined with business understanding.",
    name: "David Kim",
    role: "CTO",
  },
  {
    feedback:
      "Always goes above and beyond expectations. Proactive problem-solving and innovative approaches.",
    name: "Fatima Al-Farsi",
    role: "Project Manager",
  },
  {
    feedback:
      "A true professional with a passion for quality. Delivered scalable solutions that drive results.",
    name: "Luca Rossi",
    role: "Business Analyst",
  },
];

function TestimonialCard({
  feedback,
  name,
  role,
  rating,
  company,
}: {
  feedback: string;
  name: string;
  role: string;
  rating?: number;
  company?: string;
}) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-xs ${
          i < rating ? "text-yellow-400" : "text-gray-300"
        }`}
      >
        ★
      </span>
    ));
  };

  return (
    <Card className="flex-shrink-0 w-[380px] sm:w-96 mx-2 sm:mx-3 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-card border-border">
      <CardContent className="p-5 sm:p-7">
        <div className="flex flex-col h-full">
          <div className="flex-1">
            <p className="text-muted-foreground italic leading-relaxed text-sm sm:text-base mb-4">
              "{feedback}"
            </p>
          </div>
          <div className="mt-4 sm:mt-6 pt-4 border-t border-border">
            <div>
              <p className="font-semibold text-foreground text-sm">{name}</p>
              <p className="text-xs text-muted-foreground">
                {role}{company ? ` at ${company}` : ''}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const TestimonialSection = () => {
  // Fetch approved and visible feedbacks from API
  const { data: feedbackData, isLoading, error } = useGetFeedbacksQuery({
    visible: "true",
    approved: "true",
  });

  // Use API data if available and has content, otherwise fallback to hardcoded testimonials
  const apiTestimonials = feedbackData?.success && Array.isArray(feedbackData.data) && feedbackData.data.length > 0 ? feedbackData.data : null;
  const allTestimonials = apiTestimonials || fallbackTestimonials;
  
  // Split testimonials into two rows for the marquee effect
  const midpoint = Math.ceil(allTestimonials.length / 2);
  const testimonials1 = allTestimonials.slice(0, midpoint);
  const testimonials2 = allTestimonials.slice(midpoint);

  // If loading, show fallback with loading indicator
  if (isLoading) {
    const fallbackMidpoint = Math.ceil(fallbackTestimonials.length / 2);
    const fallbackTestimonials1 = fallbackTestimonials.slice(0, fallbackMidpoint);
    const fallbackTestimonials2 = fallbackTestimonials.slice(fallbackMidpoint);
    
    return (
      <section className="py-20 bg-muted/50 dark:bg-muted/20 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="mb-12 text-center">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-black/5 border text-black dark:bg-black/10 border-black/10 text-sm font-medium mb-6 dark:text-white dark:border-white dark:border-white/30">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-black dark:bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-black dark:bg-white"></span>
              </span>
              Client Feedback (Loading...)
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
              What People Say
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Hear from clients and colleagues who have experienced my work
              firsthand
            </p>
          </div>

          <div className="space-y-6">
            {/* First row - left to right */}
            <div className="relative">
              <div className="absolute top-0 -left-40 h-full w-36 sm:w-44 bg-gradient-to-r from-muted/100 dark:from-muted/100 to-transparent z-10"></div>
              <div className="flex animate-marquee-left">
                {[...fallbackTestimonials1, ...fallbackTestimonials1].map(
                  (testimonial, index) => (
                    <TestimonialCard 
                      key={`fallback-row1-${index}`} 
                      feedback={testimonial.feedback}
                      name={testimonial.name}
                      role={testimonial.role}
                    />
                  )
                )}
              </div>
              <div className="absolute top-0 -right-40 h-full w-36 sm:w-44 bg-gradient-to-l from-muted/100 dark:from-muted/100 to-transparent z-10"></div>
            </div>

            {/* Second row - right to left */}
            <div className="relative">
              <div className="absolute top-0 -left-40 h-full w-36 sm:w-44 bg-gradient-to-r from-muted/100 dark:from-muted/100 to-transparent z-10"></div>
              <div className="flex animate-marquee-right">
                {[...fallbackTestimonials2, ...fallbackTestimonials2].map(
                  (testimonial, index) => (
                    <TestimonialCard 
                      key={`fallback-row2-${index}`} 
                      feedback={testimonial.feedback}
                      name={testimonial.name}
                      role={testimonial.role}
                    />
                  )
                )}
              </div>
              <div className="absolute top-0 -right-40 h-full w-36 sm:w-44 bg-gradient-to-l from-muted/100 dark:from-muted/100 to-transparent z-10"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-muted/50 dark:bg-muted/20 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-black/5 border text-black dark:bg-black/10 border-black/10 text-sm font-medium mb-6 dark:text-white dark:border-white dark:border-white/30">
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-black dark:bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-black dark:bg-white"></span>
            </span>
            Client Feedback {apiTestimonials ? "(Live)" : "(Sample)"}
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
            What People Say
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Hear from clients and colleagues who have experienced my work
            firsthand
          </p>
        </div>

        <div className="space-y-6">
          {/* First row - left to right */}
          <div className="relative">
            <div className="absolute top-0 -left-40 h-full w-36 sm:w-44 bg-gradient-to-r from-muted/100 dark:from-muted/100 to-transparent z-10"></div>
            <div className="flex animate-marquee-left">
              {[...testimonials1, ...testimonials1].map(
                (testimonial, index) => (
                  <TestimonialCard 
                    key={`row1-${index}`} 
                    feedback={testimonial.feedback}
                    name={testimonial.name}
                    role={testimonial.role}
                    company={testimonial.company}
                  />
                )
              )}
            </div>
            <div className="absolute top-0 -right-40 h-full w-36 sm:w-44 bg-gradient-to-l from-muted/100 dark:from-muted/100 to-transparent z-10"></div>
          </div>

          {/* Second row - right to left */}
          <div className="relative">
            <div className="absolute top-0 -left-40 h-full w-36 sm:w-44 bg-gradient-to-r from-muted/100 dark:from-muted/100 to-transparent z-10"></div>
            <div className="flex animate-marquee-right">
              {[...testimonials2, ...testimonials2].map(
                (testimonial, index) => (
                  <TestimonialCard 
                    key={`row2-${index}`} 
                    feedback={testimonial.feedback}
                    name={testimonial.name}
                    role={testimonial.role}
                    company={testimonial.company}
                  />
                )
              )}
            </div>
            <div className="absolute top-0 -right-40 h-full w-36 sm:w-44 bg-gradient-to-l from-muted/100 dark:from-muted/100 to-transparent z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
